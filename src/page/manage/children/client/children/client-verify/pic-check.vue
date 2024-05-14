<script>
/**
 * Create by zeter on 2017/11/21
 */
import moment from 'moment'
import detailDialog from './components/verify-action.vue'
import consts, {
  ERROR_TYPE_FORMAT
} from '@/page/manage/children/client/children/client-verify/mixins/consts'
import filterQueryParams from '@/global/function/filterQueryParams'
import whPreviewContent from '@/global/components/wh-preview/wh-preview-content.vue'

export default {
  components: {
    'detail-dialog': detailDialog,
    'wh-preview-content': whPreviewContent
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
        machineFailReasonCode: Object.keys(ERROR_TYPE_FORMAT)
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
      detailDialog: false,
      multipleSelection: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async picCheck(ids) {
      const res = await this.jaxLib.customer.certification.manualWatch({ ids })
      if (res && res.success) {
        this.$message.success('操作成功')
        await this.getData()
        // this.multipleSelection = []
      }
    },
    async batchCheck() {
      this.$confirm(`当前已选【 ${this.multipleSelection.length} 】条数据，确定批量复核`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const ids = this.multipleSelection.map((item) => item.id).join()
          const res = await this.jaxLib.customer.certification.manualWatch({ ids })
          if (res && res.success) {
            this.$message.success('操作成功')
            await this.getData()
          }
        })
        .catch(() => {})
    },
    // 加载数据
    async getData() {
      this.isLoading = true
      const { timeRange, searchInput } = this.form
      const rst = await this.jaxLib.customer.certification.getAll(
        filterQueryParams({
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize,
          machineStatus: 'pass',
          manualStatus: 'not-audit',
          manualWatch: 0,
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
      // this.multipleSelection = []
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    goBack() {
      this.$router.replace({ name: 'client-verify' })
    }
  }
}
</script>

<template>
  <div class="audit">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">客户报价</h2>
        <span class="level2__back">
          <el-tooltip content="返回" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="goBack"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--search">
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
        </div>
        <div>
          <el-button type="primary" :disabled="!multipleSelection.length" @click="batchCheck"
            >批量图片复核</el-button
          >
          <span style="margin-left: 20px; color: #3d3e3f; font-size: 14px"
            >当前已选 {{ multipleSelection.length }} 条</span
          >
        </div>
      </div>
      <div class="wh__body">
        <div class="wh__body--table audit__table">
          <el-table
            v-loading="isLoading"
            :data="list"
            row-key="id"
            height="calc(100vh - 220px)"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" reserve-selection />
            <el-table-column label="审核图片">
              <template #default="{ row }">
                <wh-preview-content
                  :key="row.licencePic"
                  ref="carousel"
                  carousel-height="350px"
                  :list="[row.licencePic]"
                  :index="0"
                  indicator-position="outside"
                />
              </template>
            </el-table-column>
            <el-table-column label="身份证正面">
              <template #default="{ row }">
                <wh-preview-content
                  :key="row.idCardPicFont"
                  ref="carousel"
                  carousel-height="350px"
                  :list="[row.idCardPicFont]"
                  :index="0"
                  indicator-position="outside"
                />
              </template>
            </el-table-column>
            <el-table-column label="身份证背面">
              <template #default="{ row }">
                <wh-preview-content
                  :key="row.idCardPicBack"
                  ref="carousel"
                  carousel-height="350px"
                  :list="[row.idCardPicBack]"
                  :index="0"
                  indicator-position="outside"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100">
              <template #default="{ row, $index }">
                <el-button
                  type="primary"
                  style="margin-bottom: 10px"
                  size="small"
                  @click="picCheck(row.id)"
                >
                  复核通过
                </el-button>
                <el-button size="small" @click="openDialog('detailDialog', $index)">
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
