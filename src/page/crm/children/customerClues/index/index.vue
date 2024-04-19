<script type="text/jsx">
  import { mapState } from 'vuex'
  import * as appTypes from '@/store/types'
  import moment from 'moment'
  import apis from '@/api/ajax'
  import Tag from '../../potentialCustomers/components/dialog-tag'
  import RealTimeUserSearch from '@/global/mixins/real-time-user-search'
  import RealTimeInputTagSearch from '@/global/mixins/real-time-input-tag'
  import FoldColumnMixin from '@/global/mixins/fold-column-mixin'
  import { customerCluesColumns, salesmanChangelogColumns } from '../../potentialCustomers/mixins/fold-column'
  import PrivilegeInfo from '@/global/mixins/privilege-info-mixin'
  import CrmAdvancedSearch from '@/page/components/crm-advanced-search.vue'

  const fieldMap = {
    source: '',
    stage: '',
    industry: [],
    keyword: '',
    mobile: '',
    email: '',
    orgId: '',
    pickedRange: [],
    specialFocus: '0',
    startTime: '', // 创建时间 起始左区间
    endTime: '', // 创建时间 截止右区间
    inputTag: '', // 跟踪标签
    createdPerson: '', // 创建人
    salesGroupId: '', // 销售小组
    registerAccount: '', // 注册账号
    areaId: '', // 地区id
    orderBy: 'createTime', // 排序的对象，设置默认值
    sort: 'desc' // 排序的方式
  }

  const pageConfig = {
    pageNo: 1,
    pageSize: 20,
    totalCount: 0
  }

  export default {
    name: 'customer-clues-index',
    components: { Tag, CrmAdvancedSearch },
    mixins: [RealTimeUserSearch, RealTimeInputTagSearch, FoldColumnMixin, PrivilegeInfo],
    data() {
      return {
        loading: false,
        page: { ...pageConfig },
        list: [],
        customerStatistics: {
          newCustomer: 0, // 新增加客户
          distribution: 0, // 分配客户
          abandon: 0, // 丢弃客户
          toAudit: 0 // 待审查
        },
        searchField: { ...fieldMap },
        salesmanChangelogColumns: [ ...salesmanChangelogColumns ],
        columns: [ ...this.normalizeColumns(customerCluesColumns) ],
        cascaderProps: {
          label: 'name',
          value: 'id'
        },
        dialogStatus: {
          isTagDialogShow: false,
          isUploadDialogShow: false
        },
        states: {
          multipleSelection: [],
          command: null
        },
        uploadFile: null,
        uploadFileList: []
      }
    },
    computed: {
      ...mapState({
        user: state => state.overall.user,
        stages: state => state.overall.crmEnum.cluesStage,
        sources: state => state.overall.crmEnum.source,
        areaGroups: state => state.overall.crmEnum.smallRegion,
        industries: state => state.industry.list,
        salesGroups: state => state.overall.crmEnum.salesGroup
      })
    },
    created() {
      let { precast, def, prefix } = customerCluesColumns
      this.fetchInputTagList()
      this.initFoldable({ precast, def, prefix })
    },
    mounted() {
      if (this.user.id) {
        this.fetch({ pageNo: 1, pageSize: 20 })
      }
    },
    watch: {
      'areaGroups': function() {
        this.initDate()
      }
    },

    methods: {
      initDate() {
        this.fetch({ pageNo: 1, pageSize: 20 })
      },

      async fetch(page = this.page) {
        let searchField = this.normalizeSearchFields()
        this.loading = true
        const ret = await apis.crm.customerCluesSearch({ ...page, ...searchField })
        this.loading = false
        if (!ret.success) return
        this.list = ret.data.records
        this.page = ret.data.pagin
        this.customerStatistics = ret.data.customerStatistics
      },

      async fetchInputTagList() {
        this.$store.dispatch(appTypes.INPUT_TAG_SEARCH, { keyword: '' })
      },

      async enterCustomer(id) {
        const { href } = this.$router.resolve({
          name: 'client-list',
          query: { id: id }
        })
        window.open(href, '_blank')
      },
      closeDialog({ type, refreshable, data }) {
        let handlers = {
          'inputTag': async function({ refreshable, data }) {
            this.dialogStatus.isTagDialogShow = false
            // 保存跟踪标记
            if (refreshable === true) {
              let { states: { multipleSelection, command } } = this
              let searchFields = this.normalizeSearchFields()
              let taggedIds = multipleSelection.map(item => item.id).toString()
              let hash = { ...data, taggedIds, isAll: +command, ...searchFields }
              await this.$store.dispatch(appTypes.INPUT_TAG_CUSTOMER_POST, hash)
              this.fetch()
              this.fetchInputTagList()
            }
          }
        }
        handlers[type].call(this, { refreshable, data })
      },

      openDialog(type) {
        let multipleSelection = this.states.multipleSelection
        let args = Array.prototype.slice.call(arguments, 1)
        if (multipleSelection.length === 0) {
          this.$message.warning('请先选择客户')
          return
        }
        let handlers = {
          'inputTag': function(command) {
            this.states.command = command
            this.dialogStatus.isTagDialogShow = true
          }
        }
        handlers[type].apply(this, args)
      },

      // 切换关注
      async focus(item) {
        let { user: { id } } = this
        let customerId = item.id
        let hash = {
          userId: id,
          customerId,
          isSpecialFocus: item.isSpecialFocus === '0' ? '1' : '0' // 0 表示不特别关注，1表示特别关注
        }
        await this.$store.dispatch(appTypes.CUSTOMER_FOCUS, hash)
        // 切换关注成功
        this.fetch()
      },

      normalizeColumns(columns) {
        let self = this
        columns[0]['render-header'] = function(h, { column, $index }) {
          return <div>{column.label}
            <span on-click={self.handleCustomHeaderClick.bind(self)} class="cursor-pointer">
              {
                self.searchField.specialFocus === '0'
                  ? <wh-std-icon class="focus" sign="&#xe66b;"></wh-std-icon>
                  : <wh-std-icon class="focus is-focus color-warning" sign="&#xe68b;"></wh-std-icon>
              }
          </span>
          </div>
        }
        return columns
      },

      // 排序
      handleSortChange({ prop, order }) {
        let { searchField } = this
        searchField.orderBy = prop
        searchField.sort = order === 'descending' ? 'desc' : 'asc'
        this.fetch()
      },

      handleCustomHeaderClick() {
        let { searchField: { specialFocus } } = this
        this.searchField.specialFocus = specialFocus === '0' ? '1' : '0'
        this.fetch()
      },

      normalizeSearchFields() {
        let searchField = { ...this.searchField }
        let { pickedRange, orgId, areaId, registerAccount } = searchField
        searchField.industry = searchField.industry ? '' : searchField.industry.join(',')
        let [startTime, endTime] = pickedRange || []
        searchField.startTime = startTime ? +moment(startTime) : ''
        searchField.endTime = endTime ? +moment(endTime) : ''
        searchField.orgId = orgId.replace(/，|\s+/, ',')
        searchField.registerAccount = registerAccount.replace(/，|\s+/, ',')
        searchField.areaId = areaId.toString()
        return searchField
      },

      reset() {
        this.searchField = { ...searchField }
        this.$refs.search.handleBtnClick()
        this.fetch()
      },
      handleSearch() {
        this.$refs.search.handleBtnClick()
        this.fetch({ pageNo: 1, pageSize: 20 })
      },
      // 创建潜在客户
      goToCreateCustomer() {
        this.$router.push({ name: 'customer-clues-create' })
      },

      // 设置表格多选值
      handleSelectionChange(val) {
        this.states.multipleSelection = val
      },

      // 处理分页
      handlePageChange(val) {
        let { page } = this
        page = { ...page }

        page.pageNo = val
        this.fetch(page)
      },

      // 新页面打开详情
      openDetail(customerId) {
        this.$router.push({ name: 'customer-clues-detail', params: { customerId: customerId } })
      },

      // 批量导入成功提示
      async submitUpload() {
        let { success } = await apis.crm.clueUpload({ fileKey: this.uploadFile })
        if (!success) return false
        this.dialogStatus.isUploadDialogShow = false
        this.uploadFile = null
        this.uploadFileList = []
        this.$message({ type: 'success', message: '导出成功' })
        this.fetch({ pageNo: 1, pageSize: 20 })
      },

      quickQuery(type) {
        Object.assign(this.searchField, {
          quickQueryType: type
        })
        this.handlePageChange(1)
      },

      // 批量审核冲突
      handleConflict(command) {
        let multipleSelection = this.states.multipleSelection
        if (multipleSelection.length === 0) {
          this.$message.warning('请先选择客户')
          return
        }
        if (!multipleSelection.every(item => item.stage === '3')) {
          this.$message.warning('仅支持批量操作报备冲突的客户')
          return
        }
        if (command === 0) {
          this.audit(multipleSelection)
        } else if (command === 1) {
          this.delete(multipleSelection)
        }
      },

      audit(multipleSelection) {
        this.$confirm('确认通过吗？流程不可逆，请谨慎操作', '提示').then(async() => {
          let customerIdList = multipleSelection.map(item => item.id)
          let { user: { id } } = this
          let hash = {
            customerId: customerIdList.join(','), // 潜在客户id
            userId: id, // 核实人的id
            isPass: 0 // 0不通过，1通过
          }
          await this.$store.dispatch(appTypes.CUSTOMER_AUDIT_PUT, hash)
          this.$message.success('审核客户成功')
          this.fetch()
        })
      },

      delete(multipleSelection) {
        this.$confirm('确认删除客户吗？删除后将无法恢复，请谨慎操作', '提示').then(async() => {
          let customerIdList = multipleSelection.map(item => item.id)
          await this.$store.dispatch(appTypes.CUSTOMER_DELETE, { customerId: customerIdList.join(',') })
          this.$message.success('批量删除客户成功')
          this.fetch()
        })
      },
      onUploadSuccess(res) {
        this.uploadFile = res.data.filePosition
      },
      onUploadRemove() {
        this.uploadFile = null
      },
      closeUploadDialog() {
        this.uploadFile = null
        this.uploadFileList = []
        this.dialogStatus.isUploadDialogShow = false
      },
    }
  }
</script>
<template>
  <div class="wh__warp">
    <div class="wh__header">
      <h2 class="wh-title">线索审查</h2>
    </div>
    <div class="wh__body">
      <div class="customer-index crm-container">
        <div class="crm-container__bar quick-query-content">
          <el-row>
            <el-col :span="6">
              <div class="quick-query-item">
                <p>新增客户</p>
                <p>{{customerStatistics.newCustomer}}个</p>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="quick-query-item">
                <p>分配客户</p>
                <p>{{customerStatistics.distribution}}个</p>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="quick-query-item">
                <p>丢弃客户</p>
                <p>{{customerStatistics.abandon}}个</p>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="quick-query-item quick-query-pointer last-quick-query-item" @click="quickQuery(1)">
                <p>待审查客户</p>
                <p>{{customerStatistics.toAudit}}个</p>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="wh__tools">
          <el-input
            v-model="searchField.keyword"
            @keyup.native.enter="fetch({pageNo: 1, pageSize: 20})"
            prefix-icon="el-icon-search"
            class="width20"
            placeholder="客户名/公司名/联系人"
          >
          </el-input>
          <div class="float-right">
            <el-dropdown
              :hide-on-click="false"
              @visible-change="handleDropDown"
              class="margin-right10"
            >
              <el-tooltip class="item" effect="dark" content="列折叠" placement="top">
                <el-button size="small">
                  <wh-std-icon sign="&#xe662;"></wh-std-icon>
                </el-button>
              </el-tooltip>

              <el-dropdown-menu slot="dropdown">
                <el-scrollbar
                  tag="ul"
                  wrap-class="el-select-dropdown__wrap details__inner--max"
                  view-class="el-select-dropdown__list no-padding"
                  v-show="true"
                >
                  <el-dropdown-item v-for="(item, index) in filterFields" :key="index">
                    <el-checkbox v-model="item.checked" :disabled="item.disabled">{{item.name}}</el-checkbox>
                  </el-dropdown-item>
                </el-scrollbar>
              </el-dropdown-menu>
            </el-dropdown>

            <!--冲突审核-->
            <el-dropdown
              :hide-on-click="false"
              @command="handleConflict"
              class="margin-right10"
            >
              <el-tooltip class="item" effect="dark" content="冲突审核" placement="top">
                <el-button size="small">
                  <wh-std-icon sign="&#xe69b;"></wh-std-icon>
                </el-button>
              </el-tooltip>

              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :key="0" :command="0">通过</el-dropdown-item>
                <el-dropdown-item :key="1" :command="1">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-tooltip class="item" effect="dark" content="添加跟踪标签" placement="top">
              <el-button size="small" @click="openDialog('inputTag', '1')">
                <wh-std-icon sign="&#xe63c"></wh-std-icon>
              </el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="批量导入" placement="top">
              <el-button title="批量上传" size="small" @click="dialogStatus.isUploadDialogShow = true">
                <wh-std-icon sign="&#xe679;"></wh-std-icon>
              </el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="新增客户" placement="top">
              <el-button @click="goToCreateCustomer" type="primary" size="small">
                <wh-std-icon sign="&#xe632;">&#xe632;</wh-std-icon>
              </el-button>
            </el-tooltip>
          </div>

          <CrmAdvancedSearch ref="search">
            <template slot-scope="props">
              <div v-show="props.isAdvancedPanelShow" class="advanced-search filter-body margin-top20">
                <div class="body__line">

                  <div class="body__line--item">
                    <label>来源：</label>
                    <el-select
                      class="width70"
                      clearable
                      v-model="searchField.source"
                      placeholder="请选择来源"
                    >
                      <el-option
                        v-for="item in sources"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>

                  <div class="body__line--item">
                    <label>销售小组：</label>
                    <el-select
                      class="width70"
                      clearable
                      v-model="searchField.salesGroupId"
                      placeholder="请选择销售小组"
                    >
                      <el-option
                        v-for="item in salesGroups"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>

                  <div class="body__line--item">
                    <label>地区：</label>
                    <el-select
                      class="width70"
                      clearable
                      multiple
                      v-model="searchField.areaId"
                      placeholder="请选择地区">
                      <el-option
                        v-for="item in areaGroups"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </div>

                  <div class="body__line--item">
                    <label>阶段：</label>
                    <el-select
                      class="width70"
                      clearable
                      v-model="searchField.stage"
                      placeholder="请选择阶段"
                    >
                      <el-option
                        v-for="item in stages"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>

                </div>
                <div class="body__line">

                  <div class="body__line--item">
                    <label>行业：</label>
                    <el-cascader
                      class="width70"
                      clearable
                      :props="cascaderProps"
                      :options="industries"
                      v-model="searchField.industry">
                    </el-cascader>
                  </div>

                  <div class="body__line--item">
                    <label>邮箱：</label>
                    <el-input v-model="searchField.email" class="width70" placeholder="请输入邮箱"><template slot="append">@</template></el-input>
                  </div>

                  <div class="body__line--item">
                    <label>手机号：</label>
                    <el-input v-model="searchField.mobile" class="width70" placeholder="请输入手机号"><template slot="append"><wh-std-icon sign="&#xe625;"></wh-std-icon></template></el-input>
                  </div>

                  <div class="body__line--item">
                    <label>orgId：</label>
                    <el-input v-model="searchField.orgId" class="width70" placeholder="多个以逗号分隔"></el-input>
                  </div>
                </div>

                <div class="body__line">

                  <div class="body__line--item">
                    <label>注册账号：</label>
                    <el-input v-model="searchField.registerAccount" class="width70" placeholder="多个以逗号分隔"></el-input>
                  </div>

                  <div class="body__line--item">
                    <label>跟踪标签：</label>
                    <el-select
                      class="width70"
                      clearable
                      v-model="searchField.inputTag"
                      filterable
                      remote
                      :remote-method="getRemoteInputTagList"
                      :loading="loadingRemoteInputTag"
                      placeholder="跟踪标签">
                      <el-option
                        v-for="item in remoteInputTagList"
                        :key="item.id"
                        :label="item.inputTag"
                        :value="item.tagId">
                      </el-option>
                    </el-select>
                  </div>

                  <div class="body__line--item">
                    <label>创建人：</label>
                    <el-select
                      class="width70"
                      clearable
                      v-model="searchField.createdPerson"
                      filterable
                      remote
                      :remote-method="(query) => getRemoteUsers(query, '')"
                      :loading="loadingRemoteUsers"
                      placeholder="请选创建人">
                      <el-option
                        v-for="item in remoteUsers"
                        :key="item.id"
                        :label="item.realName"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </div>

                <div class="body__line">
                  <div class="body__line--item take-2">
                    <label style="width: 14%">创建时间：</label>
                    <el-date-picker
                      class="width85"
                      v-model="searchField.pickedRange"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    ></el-date-picker>
                  </div>
                </div>
                <div class="body__line">
                  <div class="body__line--item take-2">
                    <label style="width: 14%"></label>
                    <el-button class="advanced-btn-wrapper" type="primary" @click="handleSearch" size="small">搜索</el-button>
                    <el-button @click="reset" size="small">清空</el-button>
                  </div>
                </div>
              </div>
            </template>
          </CrmAdvancedSearch>
        </div>

        <div class="wh__body" v-loading="loading">
          <el-table
            :data="list"
            stripe
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
            style="width: 100%">
            <el-table-column
              type="selection"
              width="46">
            </el-table-column>
          <el-table-column
            v-for="item in columns"
            v-if="'company|lastestFollow|salesman|orgId'.indexOf(item.key) === -1 && item.checked"
            :key="item.key"
            :prop="item.key.split('.')[0]"
            :min-width="item.minWidth"
            :width="item.width"
            :sortable="item.sortable"
            :label="item.name"
          >
            <template slot-scope="scope">
              <span
                v-if="item.desensitization"
                v-desensitization="item.desensitization(scope.row)"
              >
                {{ item.formatter ? item.formatter(scope.row) : scope.row[item.key] }}
              </span>
              <span v-else>
                {{ item.formatter ? item.formatter(scope.row) : scope.row[item.key] }}
              </span>
            </template>
          </el-table-column>
            <!--orgId-->
            <el-table-column
              v-else-if="item.key === 'orgId' && item.checked"
              :min-width="item.minWidth"
              :label="item.name">
              <template slot-scope="props">
                <a class="link" @click="enterCustomer(props.row.orgId)">{{props.row.orgId}}</a>
              </template>
            </el-table-column>

            <el-table-column
              v-else-if="item.key === 'salesman' && item.checked"
              :min-width="item.minWidth"
              :prop="item.key"
              :label="item.name"
            >
              <template slot-scope="props">
                <el-popover v-if="!!props.row.salesmanChangelog" popper-class="customer-index__cell--popover" trigger="hover" placement="top">
                  <el-table :data="props.row.salesmanChangelog">
                    <el-table-column
                      v-for="(item, index) in salesmanChangelogColumns"
                      :formatter="item.formatter"
                      :prop="item.key"
                      :key="index"
                      :min-width="item.minWidth"
                      :label="item.name">
                    </el-table-column>
                  </el-table>
                  <div v-if="!!props.row.salesman" slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ props.row.salesman.realName }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>

            <el-table-column
              v-else-if="item.key === 'lastestFollow' && item.checked"
              :min-width="item.minWidth"
              :prop="item.key"
              :sortable="item.sortable"
              :label="item.name">
              <template slot-scope="props">
                <el-popover v-if="!!props.row.lastestFollow" popper-class="customer-index__cell--popover" trigger="hover" placement="top">
                  <p><span>跟进人：</span> {{ props.row.lastestFollow.followPeople }}</p>
                  <p><span>跟进时间：</span> {{ props.row.lastestFollow.followTime | dateFilter }}</p>
                  <p><span>备注：</span>{{ props.row.lastestFollow.followNotice }}</p>
                  <p><span>下次跟进时间：</span> {{ props.row.lastestFollow.nextTime | dateFilter }}</p>
                  <p><span>下次跟进方式：</span><span v-crm-enum-extract="{original: props.row.lastestFollow.nextMethod, category: 'followStyle'}"></span></p>
                  <p><span>下次跟进内容：</span>{{ props.row.lastestFollow.nextFollow }}</p>
                  <p><span>主管意见：</span>{{ props.row.lastestFollow.leaderFeedback }}</p>
                  <div v-if="!!props.row.lastestFollow" slot="reference" class="name-wrapper">
                    <el-tag size="mini">{{ props.row.lastestFollow.followTime | dateFilter('YYYY-MM-DD') }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>

            <el-table-column
              v-else-if="item.key === 'company' && item.checked"
              :render-header="item['render-header']"
              :min-width="item.minWidth"
              :prop="item.key"
              :label="item.name">
              <template slot-scope="props">
                <span class="link" @click="openDetail(props.row.id)">{{ (props.row.company && /[^(!‭‭)\s]+/.test(props.row.company)) ? props.row.company : props.row.id}}</span>
                <wh-std-icon v-if="props.row.isSpecialFocus === '0'" @click="focus(props.row)" sign="&#xe66b;" class="focus"></wh-std-icon>
                <wh-std-icon v-else @click="focus(props.row)" sign="&#xe68b;" class="focus is-focus color-warning" ></wh-std-icon>
              </template>
            </el-table-column>
          </el-table>
          <div class="wh__body--page">

            <el-pagination
              class="margin-top20"
              @current-change="handlePageChange"
              :current-page="page.pageNo"
              :page-size="page.pageSize"
              layout="total, prev, pager, next"
              :total="page.totalCount">
            </el-pagination>
          </div>
        </div>
      </div>
      <el-dialog
        title="添加标签"
        width="30%"
        :close-on-click-modal="false"
        :visible.sync="dialogStatus.isTagDialogShow">
        <Tag :command="states.command" @onClose="closeDialog"></Tag>
      </el-dialog>
      <el-dialog
        title="批量导入"
        :show-close="false"
        :visible.sync="dialogStatus.isUploadDialogShow"
      >
        <el-upload
          action="/ajax/common/file/upload"
          :on-success="onUploadSuccess"
          :on-remove="onUploadRemove"
          accept=".xls,.xlsx"
          :file-list="uploadFileList"
        >
          <el-button title="客户等级导入" size="small" :disabled="!!uploadFile">
            <i class="el-icon-upload2"></i> 点击上传
          </el-button>
        </el-upload>
        <br>
        <p>只能上传xls/xlsx文件，且文件行数不超过3万条。
          <a
            target="_blank"
            href="https://simboss-ibilling.oss-cn-hangzhou.aliyuncs.com/crm/CRM%E7%BA%BF%E7%B4%A2%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx"
            style="color: #1c8de0;">下载模板</a></p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeUploadDialog">取 消</el-button>
          <el-button type="primary" @click="submitUpload">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .customer-index{
    .link{
      cursor: pointer;
      color: #1c8de0;
    }
    .quick-query-content {
      background-color: #fff;
      border-bottom: 20px solid #F8F8F8;

      .quick-query-item {
        border-right: 1px solid #BFBFBF;
        height: 55px;
        text-align: center;
        cursor: default;
        &.quick-query-pointer {
          cursor: pointer;
        }

        p {
          &:first-child {
            font-size: 14px;
            line-height: 22px;
            color: rgba(0, 0, 0, .45);
            margin-bottom: 3px;
          }

          &:nth-of-type(2) {
            font-size: 18px;
            height: 28px;
          }
        }
      }

      .last-quick-query-item {
        border-right: none;
      }
    }

    .upload {
      display: inline-block;
    }
    .el-table .el-table__row{
      .cell .icon.focus{
        visibility: hidden;
        cursor: pointer;
        &.is-focus{
          visibility: visible;
        }
      }
      &:hover .cell .icon.focus{
        visibility: visible;
      }
    }
  }
  .customer-index__cell--popover{
    & > p {
      padding: 5px;
      & > span:first-child{
        display: inline-block;
        min-width: 110px;
        font-weight: 400;
        color: #878d99;
      }
    }
  }
</style>
