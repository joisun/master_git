<script>
/**
 * Create by zeter on 2017/11/21
 */
import moment from 'moment'
import detailDialog from './components/verify-action.vue'
import clientPanel from '@/page/components/panel/client-info-panel.vue'
import consts, {
  ERROR_TYPE_FORMAT
} from '@/page/manage/children/client/children/client-verify/mixins/consts'
import filterQueryParams from '@/global/function/filterQueryParams'

export default {
  components: {
    'detail-dialog': detailDialog,
    'client-panel': clientPanel
  },
  mixins: [consts],
  data() {
    return {
      form: {
        searchStatus: 'not-audit',
        pickType: '',
        manualStatus: 'not-audit',
        machineStatus: '',
        timeRange: null,
        searchInput: '',
        machineFailReasonCode: Object.keys(ERROR_TYPE_FORMAT),
        manualWatch: undefined
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      page: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0
      },
      list: [],
      content: null,
      selectIndex: 0,
      isLoading: true,
      detailDialog: false
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    onSearch(type) {
      if (type === 1) {
        this.form = {
          ...this.form,
          searchStatus: 'not-audit',
          timeRange: null,
          searchInput: '',
          manualWatch: undefined,
          machineFailReasonCode: [],
          machineStatus: 'pass',
          manualStatus: 'not-audit',
          pickType: 'business'
        }
      }
      if (type === 2) {
        this.form = {
          searchStatus: 'not-audit',
          pickType: '',
          manualStatus: 'not-audit',
          machineStatus: '',
          timeRange: null,
          searchInput: '',
          machineFailReasonCode: Object.keys(ERROR_TYPE_FORMAT),
          manualWatch: undefined
        }
      }
      this.page.pageIndex = 1
      this.getData()
    },
    picCheck() {
      this.$router.push({ name: 'cert-pic-check' })
    },
    // 加载数据
    async getData() {
      this.isLoading = true
      const {
        pickType,
        searchInput,
        timeRange,
        machineStatus,
        manualStatus,
        machineFailReasonCode,
        manualWatch
      } = this.form
      const rst = await this.jaxLib.customer.certification.getAll(
        filterQueryParams({
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize,
          pickType,
          machineStatus,
          manualStatus,
          manualWatch,
          machineFailReasonCode: machineFailReasonCode,
          searchStr: searchInput,
          gmtDateStart: timeRange
            ? moment(this.form.timeRange[0]).format('YYYY-MM-DD 00:00:00')
            : '',
          gmtDateEnd: timeRange ? moment(this.form.timeRange[1]).format('YYYY-MM-DD 23:59:59') : ''
        })
      )
      this.isLoading = false
      if (!rst.success) {
        this.$message.error(rst.message, '获取企业资质列表失败')
        return false
      }
      this.page.totalCount = rst.data.page.allCount
      this.list = rst.data.list
    },
    // 选择条件变化
    changeSelect() {
      this.page.pageIndex = 1
      this.getData()
    },
    // 换页码
    changePageNumber(val) {
      this.page.pageIndex = val
      this.getData()
    },
    // 打开弹窗
    openDialog(name, idx) {
      if (idx !== null) {
        this.content = this.list[idx]
        this.selectIndex = idx
      } else {
        this.content = null
      }
      this[name] = true
    },
    // 切换内容
    changeDetail(action) {
      if (this.selectIndex === this.list.length - 1 && action === 1) {
        this.$message.warning('已经是最后一个')
        return false
      }
      if (this.selectIndex === 0 && action === -1) {
        this.$message.warning('已经是第一个')
        return false
      }
      this.selectIndex = this.selectIndex + action
      this.content = this.list[this.selectIndex]
    },
    // 关闭弹窗
    closeDialog(dialogName, refresh) {
      this[dialogName] = false
      if (refresh) this.getData()
    }
  }
}
</script>

<template>
  <div class="audit">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">资质审核</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--search">
          <el-select
            v-model="form.pickType"
            placeholder="请选择流程类型"
            clearable
            style="width: 200px"
            @change="changeSelect"
          >
            <el-option
              v-for="(val, key) in AUDIT_PICK_TYPE"
              :key="key"
              :label="val === AUDIT_PICK_TYPE.BUSINESS ? '商务对接人' : '法人'"
              :value="val"
            />
          </el-select>
          <el-select
            v-model="form.manualStatus"
            placeholder="人工审核状态"
            clearable
            style="width: 120px"
            @change="changeSelect"
          >
            <el-option
              v-for="(val, key) in enums.qualificationStatus.excludes('not-submit').maps()"
              :key="key"
              :label="val"
              :value="key"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="form.machineStatus"
            placeholder="机器审核状态"
            clearable
            style="width: 120px"
            @change="changeSelect"
          >
            <el-option
              v-for="(val, key) in enums.qualificationStatus.excludes('not-submit').maps()"
              :key="key"
              :label="val"
              :value="key"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="form.machineFailReasonCode"
            multiple
            collapse-tags
            placeholder="机器审核错误原因"
            clearable
            style="width: 285px"
            @change="changeSelect"
          >
            <el-option
              v-for="val in ERROR_TYPE"
              :key="val"
              :label="errorTypeFormat[val]"
              :value="val"
            />
          </el-select>
          <el-date-picker
            v-model="form.timeRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 220px"
            :picker-options="pickerOptions"
            @change="changeSelect"
          >
          </el-date-picker>
          <el-input
            v-model="form.searchInput"
            placeholder="请输入组织ID或名称"
            clearable
            style="width: 220px"
            @keyup.native.enter="changeSelect"
          >
            <el-button slot="append" icon="el-icon-search" @click="changeSelect"> </el-button>
          </el-input>
          <el-select
            v-model="form.manualWatch"
            placeholder="复核状态"
            clearable
            style="width: 100px"
            @change="changeSelect"
          >
            <el-option
              v-for="item in [
                { label: '已复核', value: 1 },
                { label: '未复核', value: 0 }
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div style="margin-bottom: 20px">
          快速查询：
          <el-button-group>
            <el-button @click="onSearch(1)">商务对接人授权书</el-button>
            <el-button @click="onSearch(2)">机审错误需人工</el-button>
          </el-button-group>
        </div>
        <div>
          <el-button type="primary" @click="picCheck">图片复核</el-button>
        </div>
      </div>
      <div class="wh__body">
        <div class="wh__body--table audit__table">
          <el-table v-loading="isLoading" :data="list" height="calc(100vh - 220px)">
            <el-table-column label="提交时间" min-width="120">
              <template slot-scope="scope">
                {{ scope.row.gmtCreated | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column label="客户ID">
              <template slot-scope="scope">
                <span>{{ scope.row.orgId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="客户名称" width="350">
              <template slot-scope="scope">
                <client-panel :key="scope.row.orgId" :org-id="scope.row.orgId">
                  <span>{{ scope.row.orgName }}</span>
                </client-panel>
              </template>
            </el-table-column>
            <el-table-column label="审核状态">
              <template #default="{ row }">
                {{ auditStatusFormat[judgeFinalStatus(row)] }}
              </template>
            </el-table-column>
            <el-table-column label="人工审核状态">
              <template #default="{ row }">
                {{ auditStatusFormat[row.manualStatus] }}
              </template>
            </el-table-column>
            <el-table-column label="自动审核状态" align="center">
              <template #default="{ row }">
                <div>
                  {{ auditStatusFormat[row.machineStatus] }}
                </div>
                <div>
                  {{ row.machineFailReason }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="归属销售" align="center">
              <template #default="{ row }">
                {{ row.saleName | saleFilter }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button size="small" @click="openDialog('detailDialog', scope.$index)">
                  审核
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="wh__body--page">
          <el-pagination
            :current-page="page.pageIndex"
            :page-size="page.pageSize"
            :total="page.totalCount"
            @current-change="changePageNumber"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      title="资质审核"
      top="1%"
      size="full"
      :visible.sync="detailDialog"
      :lock-scroll="false"
      custom-class="auto-width"
    >
      <detail-dialog
        dialog-name="detailDialog"
        :content="content"
        @closeDialog="closeDialog"
        @changeDetail="changeDetail"
      >
      </detail-dialog>
    </el-dialog>
  </div>
</template>
