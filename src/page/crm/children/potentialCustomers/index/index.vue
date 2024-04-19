<script type="text/jsx">
import { mapState } from 'vuex'
import * as appTypes from '@/store/types'
import moment from 'moment'
import apis from '@/api/ajax'
import Tag from '../components/dialog-tag'
import Remark from '../components/dialog-remark'
import Transfer from '../components/dialog-transfer.vue'
import RealTimeUserSearch from '@/global/mixins/real-time-user-search'
import RealTimeInputTagSearch from '@/global/mixins/real-time-input-tag'
import RealTimeInputMarkSearch from '@/global/mixins/real-time-input-mark'
import FoldColumnMixin from '@/global/mixins/fold-column-mixin'
import { columns, salesmanChangelogColumns } from '../mixins/fold-column'
import PrivilegeInfo from '@/global/mixins/privilege-info-mixin'
import CrmAdvancedSearch from '@/page/components/crm-advanced-search.vue'

const searchField = {
  orgId: '',
  source: '',
  salesmanId: '',
  stage: '',
  rank: '',
  remarkId: '',
  industry: [],
  industryId: '',
  parentIndustryId: '',
  keyword: '',
  mobile: '',
  email: '',
  salesGroupId: '',
  areaId: '',
  pickedRange: [],
  nextTimePickedRange: [],
  lastFollowTimeRange: [], // 最后跟进时间
  specialFocus: '0',
  registerAccount: '',
  startTime: '', // 创建时间 起始左区间
  endTime: '', // 创建时间 截止右区间
  startNextTime: '', // 下次跟进时间 起始左区间
  endNextTime: '', // 下次跟进时间 起始左区间
  inputTag: '', // 跟踪标签
  createdPerson: '', // 创建人
  parentOnly: false // 只显示主账户
}

export default {
  components: { Transfer, Tag, CrmAdvancedSearch, Remark },
  mixins: [RealTimeUserSearch, RealTimeInputTagSearch, RealTimeInputMarkSearch, FoldColumnMixin, PrivilegeInfo],
  name: 'potential-customers',
  data() {
    return {
      loading: false,
      searchField: { ...searchField },
      salesmanChangelogColumns: [...salesmanChangelogColumns],
      columns: [...this.normalizeColumns(columns)],
      cascaderProps: {
        label: 'name',
        value: 'id',
        checkStrictly: true
      },
      dialogStatus: {
        isTransferDialogShow: false,
        isTagDialogShow: false,
        isMarkDialogShow: false,
        isImportRankDialogShow: false
      },
      states: {
        multipleSelection: [],
        command: null
      },
      uploadType: '',
      uploadTemplateUrl: '',
      rankUploadFile: null,
      rankUploadFileList: [],
      sellerList: [],
      blockSelect: null
    }
  },

  computed: {
    ...mapState({
      user: state => state.overall.user,
      page: state => state.customer.page,
      list: state => state.customer.list,
      customerStatistics: state => state.customer.customerStatistics,
      stages: state => state.overall.crmEnum.advanceStage,
      sources: state => state.overall.crmEnum.source,
      salesGroups: state => state.overall.crmEnum.salesGroup,
      areaGroups: state => state.overall.crmEnum.smallRegion,
      industries: state => state.industry.list
    }),
  },

  created() {
    let { precast, def, prefix } = columns
    this.fetchInputTagList()
    this.getSellerList()
    this.initFoldable({ precast, def, prefix })
    if (this.$route.query.quickQueryType) {
      Object.assign(this.searchField, {
        quickQueryType: this.$route.query.quickQueryType
      })
      let url = location.href.split('?')[0]
      window.history.pushState({}, '', url)
    }
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
    async getSellerList() {
      const { success, data } = await apis.crm.getSearchSellerList()
      if (!success) return false
      this.sellerList = data
    },
    async fetch(page = this.page) {
      let searchField = this.normalizeSearchFields()
      delete searchField.industry
      this.$refs.search.handleBtnClick()
      this.loading = true
      await this.$store.dispatch(appTypes.CUSTOMERS_SEARCH, { ...page, ...searchField })
      this.loading = false
    },

    async exportCustomer() {
      const res = await apis.crm.customerExport()
      if (res.success) {
        window.location.href = res.data.fileUrl
      }
    },

    async enterCustomer(id) {
      const { href } = this.$router.resolve({
        name: 'client-list',
        query: { id: id }
      })
      window.open(href, '_blank')
    },

    async fetchInputTagList() {
      this.$store.dispatch(appTypes.INPUT_TAG_SEARCH, { keyword: '' })
    },

    closeDialog({ type, refreshable, data }) {
      let handlers = {
        'transfer': async function({ refreshable, data }) {
          this.dialogStatus.isTransferDialogShow = false
          if (refreshable === true) {
            const { success } = await this.$store.dispatch(appTypes.CUSTOMERS_TRANSFER, data)
            if (success) {
              this.$message.success('客户转移成功')
              this.fetch()
            }
          }
        },
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
        },
        'inputMark': async function({ data, refreshable }) {
          this.dialogStatus.isMarkDialogShow = false
          if (refreshable === true) {
            let { states: { multipleSelection } } = this
            let taggedIds = multipleSelection.map(item => item.id).toString()
            await this.$store.dispatch(appTypes.INPUT_MARK_CUSTOMER_POST, { ...data, customerIds: taggedIds })
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
        'transfer': function() {
          this.dialogStatus.isTransferDialogShow = true
        },
        'inputTag': function(command) {
          this.states.command = command
          this.dialogStatus.isTagDialogShow = true
        },
        'inputMark': function() {
          this.dialogStatus.isMarkDialogShow = true
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
      let { pickedRange, nextTimePickedRange, orgId, areaId, registerAccount, industry, lastFollowTimeRange } = searchField
      let [startTime, endTime] = pickedRange || []
      let [startNextTime, endNextTime] = nextTimePickedRange || []
      let [lastFollowTimeStart, lastFollowTimeEnd] = lastFollowTimeRange || []
      searchField.startTime = startTime ? +moment(startTime).startOf('day') : ''
      searchField.endTime = endTime ? +moment(endTime).endOf('day') : ''
      searchField.startNextTime = startNextTime ? +moment(startNextTime).startOf('day') : ''
      searchField.endNextTime = endNextTime ? +moment(endNextTime).endOf('day') : ''
      searchField.lastFollowTimeStart = lastFollowTimeStart ? +moment(lastFollowTimeStart).startOf('day') : ''
      searchField.lastFollowTimeEnd = lastFollowTimeEnd ? +moment(lastFollowTimeEnd).endOf('day') : ''
      searchField.orgId = orgId.replace(/，|\s+/, ',')
      searchField.registerAccount = registerAccount.replace(/，|\s+/, ',')
      searchField.areaId = areaId.toString()
      searchField.parentIndustryId = industry[0] || ''
      searchField.industryId = industry[1] || ''
      return searchField
    },

    reset() {
      this.searchField = { ...searchField }
      this.fetch()
      this.$refs.search.handleBtnClick()
    },

    // 创建潜在客户
    goToCreateCustomer() {
      this.$router.push({ name: 'potential-customer-create' })
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
      this.$router.push({ name: 'potential-customer-detail', params: { customerId: customerId } })
    },
    openUploadDialog(type) {
      this.dialogStatus.isImportRankDialogShow = true
      this.uploadType = type
      if (type === 'rank') {
        this.uploadTemplateUrl = 'https://simboss-ibilling.oss-cn-hangzhou.aliyuncs.com/%E5%AE%A2%E6%88%B7%E7%AD%89%E7%BA%A7%E5%8F%98%E6%9B%B4%E6%A8%A1%E6%9D%BF.xlsx'
      } else {
        this.uploadTemplateUrl = 'https://simboss-ibilling.oss-cn-hangzhou.aliyuncs.com/crm/CRM%E5%95%86%E6%9C%BA%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'
      }
    },

    onUploadRankSuccess(res) {
      this.rankUploadFile = res.data.filePosition
    },
    onUploadRankRemove() {
      this.rankUploadFile = null
    },
    async submitRankUpload() {
      if (!this.rankUploadFile) {
        this.$message({ type: 'error', message: '请上传文件' })
        return false
      }
      const { success, msg } = this.uploadType === 'rank'
        ? await apis.crm.importRank({ fileKey: this.rankUploadFile })
        : await apis.crm.businessOppUpload({ fileKey: this.rankUploadFile })
      if (!success) {
        return false
      }
      this.$message({ type: 'success', message: msg })
      this.rankUploadFile = null
      this.rankUploadFileList = []
      this.dialogStatus.isImportRankDialogShow = false
      this.fetch({ pageNo: 1, pageSize: 20 })
    },
    closeRankUploadDialog() {
      this.rankUploadFile = null
      this.rankUploadFileList = []
      this.dialogStatus.isImportRankDialogShow = false
    },
    // 快速查找
    quickQuery(type) {
      let setValue = type
      if(this.blockSelect === type) setValue = null
      Object.assign(this.searchField, { quickQueryType: setValue })
      this.blockSelect = setValue
      this.handlePageChange(1)
    }
  }
}
</script>

<template>
  <div class="wh__warp">
    <div class="wh__header">
      <h2 class="wh-title">商机推进</h2>
    </div>
    <div class="customer-index crm-container">
      <div class="crm-container__bar quick-query-content">
        <el-row>
          <el-col :span="6">
            <div
              class="quick-query-item quick-query-pointer"
              @click="quickQuery(1)"
              :class="{ active: blockSelect === 1 }"
            >
              <p>新增客户/新增自挖掘客户</p>
              <p>
                <span
                  >{{ customerStatistics.newCustomer }}个/{{
                    customerStatistics.newMineCustomer
                  }}个</span
                >
              </p>
            </div>
          </el-col>

          <el-col :span="6">
            <div
              class="quick-query-item quick-query-pointer"
              :class="{ active: blockSelect === 2 }"
              @click="quickQuery(2)"
            >
              <p>已跟进客户数/已跟进次数</p>
              <p>{{ customerStatistics.followed }}个/{{ customerStatistics.followedCount }}个</p>
            </div>
          </el-col>

          <el-col :span="6">
            <div
              class="quick-query-item quick-query-pointer"
              @click="quickQuery(3)"
              :class="{ active: blockSelect === 3 }"
            >
              <p>本月未跟进客户</p>
              <p>{{ customerStatistics.unfollowed }}个</p>
            </div>
          </el-col>

          <el-col :span="6">
            <div
              class="quick-query-item quick-query-pointer last-quick-query-item"
              @click="quickQuery(4)"
              :class="{ active: blockSelect === 4 }"
            >
              <p>本日分配客户/待处理客户</p>
              <p>{{ customerStatistics.distribution }}个/{{ customerStatistics.unhandled }}个</p>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="wh__tools">
        <el-input
          v-model="searchField.keyword"
          @keyup.native.enter="fetch({ pageNo: 1, pageSize: 20 })"
          prefix-icon="el-icon-search"
          class="width20"
          placeholder="客户名/公司名/联系人"
        ></el-input>
        <div class="float-right">
          <el-dropdown
            :hide-on-click="false"
            @visible-change="handleDropDown"
            class="margin-right10"
          >
            <el-tooltip class="item" effect="dark" content="列折叠" placement="top">
              <el-button size="small">
                <wh-std-icon sign="xe662"></wh-std-icon>
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
                  <el-checkbox v-model="item.checked" :disabled="item.disabled">
                    {{ item.name }}
                  </el-checkbox>
                </el-dropdown-item>
              </el-scrollbar>
            </el-dropdown-menu>
          </el-dropdown>

          <el-tooltip class="item" effect="dark" content="客户等级导入" placement="top">
            <el-button title="客户等级导入" size="small" @click="openUploadDialog('rank')">
              <wh-std-icon sign="&#xe65e;"></wh-std-icon>
            </el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="转移客户" placement="top">
            <el-button @click="openDialog('transfer')" size="small">
              <wh-std-icon sign="&#xe62b;"></wh-std-icon>
            </el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="添加标记" placement="top">
            <el-button size="small" @click="openDialog('inputMark', '1')">
              <wh-std-icon sign="&#xe6b8;"></wh-std-icon>
            </el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="添加跟踪标签" placement="top">
            <el-button size="small" @click="openDialog('inputTag', '1')">
              <wh-std-icon sign="&#xe63c;"></wh-std-icon>
            </el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="批量导入" placement="top">
            <el-button title="批量上传" size="small" @click="openUploadDialog('businessOpp')">
              <wh-std-icon sign="&#xe679;">&#xe679;</wh-std-icon>
            </el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="客户信息导出" placement="top">
            <el-button title="客户信息导出" size="small" @click="exportCustomer">
              <wh-std-icon sign="&#xe635;"></wh-std-icon>
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
            <div
              v-show="props.isAdvancedPanelShow"
              class="advanced-search filter-body margin-top20"
            >
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
                      :value="item.id"
                    ></el-option>
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
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>

                <div class="body__line--item">
                  <label>地区：</label>
                  <el-select
                    class="width70"
                    placeholder="请选择地区"
                    clearable
                    multiple
                    v-model="searchField.areaId"
                  >
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
                  <label>销售：</label>
                  <el-select
                    class="width70"
                    v-model="searchField.salesmanId"
                    filterable
                    placeholder="请选择销售"
                    clearable
                  >
                    <el-option
                      v-for="salesman in sellerList"
                      :key="salesman.saleId"
                      :label="salesman.realName"
                      :value="salesman.saleId"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="body__line">
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
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </div>

                <div class="body__line--item">
                  <label>行业：</label>
                  <el-cascader
                    class="width70"
                    clearable
                    :props="cascaderProps"
                    :options="industries"
                    v-model="searchField.industry"
                  ></el-cascader>
                </div>

                <div class="body__line--item">
                  <label>邮箱：</label>
                  <el-input v-model="searchField.email" class="width70" placeholder="请输入邮箱">
                    <template slot="append">@</template>
                  </el-input>
                </div>

                <div class="body__line--item">
                  <label>手机号：</label>
                  <el-input v-model="searchField.mobile" class="width70" placeholder="请输入手机号">
                    <template slot="append">
                      <wh-std-icon sign="&#xe625;"></wh-std-icon>
                    </template>
                  </el-input>
                </div>
              </div>

              <div class="body__line">
                <div class="body__line--item">
                  <label>orgId：</label>
                  <el-input
                    v-model="searchField.orgId"
                    class="width70"
                    placeholder="多个以逗号分隔"
                  ></el-input>
                </div>

                <div class="body__line--item">
                  <label>注册账号：</label>
                  <el-input
                    v-model="searchField.registerAccount"
                    class="width70"
                    placeholder="多个以逗号分隔"
                  ></el-input>
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
                    placeholder="跟踪标签"
                  >
                    <el-option
                      v-for="item in remoteInputTagList"
                      :key="item.id"
                      :label="item.inputTag"
                      :value="item.tagId"
                    ></el-option>
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
                    placeholder="请选创建人"
                  >
                    <el-option
                      v-for="item in remoteUsers"
                      :key="item.id"
                      :label="item.realName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="body__line">
                <div class="body__line--item">
                  <label>客户等级：</label>
                  <el-select
                    class="width70"
                    clearable
                    v-model="searchField.rank"
                    placeholder="客户等级"
                  >
                    <el-option
                      v-for="item in ['SKA', 'KA', 'C', 'B', 'A']"
                      :key="item"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </div>
                <div class="body__line--item">
                  <label>客户标记：</label>
                  <el-select
                    class="width70"
                    clearable
                    v-model="searchField.remarkId"
                    filterable
                    remote
                    :remote-method="getRemoteInputMarkList"
                    :loading="loadingRemoteInputMark"
                    placeholder="跟踪标签"
                  >
                    <el-option
                      v-for="item in remoteInputMarkList"
                      :key="item.id"
                      :label="item.remark"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
                <div class="body__line--item take-2">
                  <label style="width: 14%">最后跟进时间：</label>
                  <el-date-picker
                    class="width85"
                    v-model="searchField.lastFollowTimeRange"
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
                <div class="body__line--item take-2">
                  <label style="width: 14%">下次跟进：</label>
                  <el-date-picker
                    class="width85"
                    v-model="searchField.nextTimePickedRange"
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
                  <el-button
                    type="primary"
                    @click="fetch({ pageNo: 1, pageSize: 20 })"
                    size="small"
                    class="advanced-btn-wrapper"
                  >
                    搜索
                  </el-button>
                  <el-button @click="reset" size="small">清空</el-button>
                </div>
              </div>
            </div>
          </template>
        </CrmAdvancedSearch>
        <el-checkbox
          class="ml20"
          @change="fetch({ pageNo: 1, pageSize: 20 })"
          v-model="searchField.parentOnly"
          >只显示主账户</el-checkbox
        >
      </div>

      <div class="wh__body" v-loading="loading">
        <el-table
          :data="list"
          stripe
          row-key="id"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="40" />
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
              <span v-if="item.desensitization" v-desensitization="item.desensitization(scope.row)">
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
            :label="item.name"
          >
            <template slot-scope="props">
              <a class="link" target="_blank" @click="enterCustomer(props.row.orgId)">
                {{ props.row.orgId }}
              </a>
            </template>
          </el-table-column>

          <el-table-column
            v-else-if="item.key === 'salesman' && item.checked"
            :min-width="item.minWidth"
            :prop="item.key"
            :label="item.name"
          >
            <template slot-scope="props">
              <el-popover
                v-if="!!props.row.salesmanChangelog"
                popper-class="customer-index__cell--popover"
                trigger="hover"
                placement="top"
              >
                <el-table :data="props.row.salesmanChangelog">
                  <el-table-column
                    v-for="(item, index) in salesmanChangelogColumns"
                    :formatter="item.formatter"
                    :prop="item.key"
                    :key="index"
                    :min-width="item.minWidth"
                    :label="item.name"
                  ></el-table-column>
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
            :label="item.name"
          >
            <template slot-scope="props">
              <el-popover
                v-if="!!props.row.lastestFollow"
                popper-class="customer-index__cell--popover"
                trigger="hover"
                placement="top"
              >
                <p><span>跟进人：</span> {{ props.row.lastestFollow.followPeople }}</p>
                <p><span>跟进时间：</span> {{ props.row.lastestFollow.followTime | dateFilter }}</p>
                <p><span>备注：</span>{{ props.row.lastestFollow.followNotice }}</p>
                <p>
                  <span>下次跟进时间：</span> {{ props.row.lastestFollow.nextTime | dateFilter }}
                </p>
                <p>
                  <span>下次跟进方式：</span
                  ><span
                    v-crm-enum-extract="{
                      original: props.row.lastestFollow.nextMethod,
                      category: 'followStyle'
                    }"
                  ></span>
                </p>
                <p><span>下次跟进内容：</span>{{ props.row.lastestFollow.nextFollow }}</p>
                <p><span>主管意见：</span>{{ props.row.lastestFollow.leaderFeedback }}</p>
                <div v-if="!!props.row.lastestFollow" slot="reference" class="name-wrapper">
                  <el-tag size="mini">{{
                    props.row.lastestFollow.followTime | dateFilter('YYYY-MM-DD')
                  }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            v-else-if="item.key === 'company' && item.checked"
            :render-header="item['render-header']"
            :min-width="item.minWidth"
            :prop="item.key"
            :label="item.name"
          >
            <template slot-scope="props">
              <span class="link" @click="openDetail(props.row.id)">
                {{
                  props.row.company && /[^(!‭‭)\s]+/.test(props.row.company)
                    ? props.row.company
                    : props.row.id
                }}
              </span>

              <wh-std-icon
                v-if="props.row.isSpecialFocus === '0'"
                @click="focus(props.row)"
                sign="&#xe66b;"
                class="focus"
              ></wh-std-icon>

              <wh-std-icon
                v-else
                @click="focus(props.row)"
                sign="&#xe68b;"
                class="focus is-focus color-warning"
              ></wh-std-icon>
            </template>
          </el-table-column>
        </el-table>
        <div class="wh__body--page">
          <el-pagination
            class="margin-top20 align-right"
            @current-change="handlePageChange"
            :current-page="page.pageNo"
            :page-size="page.pageSize"
            layout="total, prev, pager, next"
            :total="page.totalCount"
          ></el-pagination>
        </div>
      </div>

      <el-dialog
        title="转移客户"
        width="30%"
        :close-on-click-modal="false"
        :visible.sync="dialogStatus.isTransferDialogShow"
      >
        <Transfer :customers="states.multipleSelection" @onClose="closeDialog"></Transfer>
      </el-dialog>

      <el-dialog
        title="添加标签"
        width="30%"
        :close-on-click-modal="false"
        :visible.sync="dialogStatus.isTagDialogShow"
      >
        <Tag :command="states.command" @onClose="closeDialog"></Tag>
      </el-dialog>
      <el-dialog
        title="添加标记"
        width="30%"
        :close-on-click-modal="false"
        :visible.sync="dialogStatus.isMarkDialogShow"
      >
        <remark @onClose="closeDialog"></remark>
      </el-dialog>
      <el-dialog
        :title="uploadType === 'rank' ? '修改客户等级' : '批量导入'"
        :show-close="false"
        :visible.sync="dialogStatus.isImportRankDialogShow"
      >
        <el-upload
          action="/ajax/common/file/upload"
          :on-success="onUploadRankSuccess"
          :on-remove="onUploadRankRemove"
          accept=".xls,.xlsx"
          :file-list="rankUploadFileList"
        >
          <el-button title="客户等级导入" size="small" :disabled="!!rankUploadFile">
            <i class="el-icon-upload2"></i> 点击上传
          </el-button>
        </el-upload>
        <br />
        <p>
          只能上传xls/xlsx文件，且文件行数不超过3万条。
          <a target="_blank" :href="uploadTemplateUrl" style="color: #1c8de0">下载模板</a>
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeRankUploadDialog">取 消</el-button>
          <el-button type="primary" @click="submitRankUpload">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.customer-index {
  .link {
    cursor: pointer;
    color: #1c8de0;
  }

  .item {
    margin-left: 0px;
  }

  .quick-query-content {
    border-bottom: 20px solid #f8f8f8;
    background: #fff;

    .quick-query-item {
      height: 55px;
      text-align: center;
      cursor: default;
      margin-top: 10px;
      &.active {
        background: rgb(231, 235, 238);
      }
      &.quick-query-pointer {
        cursor: pointer;
      }

      p {
        &:first-child {
          font-size: 14px;
          line-height: 22px;
          color: rgba(0, 0, 0, 0.45);
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

  .el-table .el-table__row {
    .cell .icon.focus {
      visibility: hidden;
      cursor: pointer;

      &.is-focus {
        visibility: visible;
      }
    }

    &:hover .cell .icon.focus {
      visibility: visible;
    }
  }
}

.customer-index__cell--popover {
  & > p {
    padding: 5px;

    & > span:first-child {
      display: inline-block;
      min-width: 110px;
      font-weight: 400;
      color: #878d99;
    }
  }
}
</style>
