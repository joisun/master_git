<script>
import CardTableDialog from './card-table-dailog'
import dateFormat from '@/global/filters/date-format'
import Download from '@/page/components/wh-download/wh-download'
export default {
  name: 'card-location-bind',
  components: {
    CardTableDialog
  },
  data() {
    return {
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      tableData: [],
      loading: false,
      statusMap: {
        PENDING: '待处理',
        DONE: '已完成'
      },
      search: {
        dateRange: [new Date(), new Date()],
        status: 'PENDING'
      }
    }
  },
  computed: {
    canBatchOperate() {
      return this.search.dateRange && this.search.dateRange.length
    },
    hasResult() {
      return this.tableData && this.tableData.length > 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    onDateChange() {
      this.changeIndex(1)
    },
    async handleExport() {
      const { dateRange, status } = this.search
      const [dateStart, dateEnd] = this.getDate(dateRange)
      const { success, data } = await this.jaxLib.card.cardLocationBindExport({
        dateStart,
        dateEnd,
        status
      })
      if (!success) return false
      await Download({ ...data })
    },
    handelOpenCardDetail(row) {
      this.$refs.cardTableDialog.open(row.iccids)
    },
    handleFinish(row) {
      const message = row
        ? '确认将【该数据】设置为已完成'
        : '确认将【当前时间范围下的待处理数据】设置为已完成吗'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { dateRange } = this.search
          const [dateStart, dateEnd] = this.getDate(dateRange)
          const params = row
            ? {
                id: row.id
              }
            : {
                dateStart,
                dateEnd
              }
          const res = await this.jaxLib.card.cardLocationBindDone(params)
          if (res && res.success) {
            this.$message.success('操作成功')
            await this.getList()
          }
        })
        .catch(() => {})
    },
    changeIndex(val) {
      this.page.pageIndex = val
      this.getList()
    },
    getDate(dateRange) {
      let dateStart = ''
      let dateEnd = ''
      if (dateRange && dateRange.length === 2) {
        [dateStart, dateEnd] = [
          dateFormat(dateRange[0], 'YYYY-MM-DD 00:00:00'),
          dateFormat(dateRange[1], 'YYYY-MM-DD 23:59:59')
        ]
      }
      return [dateStart, dateEnd]
    },
    async getList() {
      const { dateRange, status } = this.search
      const [dateStart, dateEnd] = this.getDate(dateRange)
      const { pageIndex, pageSize } = this.page
      const {
        data: {
          page: { allCount },
          list
        },
        success
      } = await this.jaxLib.card.cardLocationBindList({
        pageNo: pageIndex,
        pageSize,
        dateStart,
        dateEnd,
        status
      })
      this.loading = false
      if (!success) return false
      this.tableData = list
      this.page.total = allCount
    }
  }
}
</script>

<template>
  <div class="inventory-modify-list">
    <card-table-dialog ref="cardTableDialog" />
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">区域限制位置绑定</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--mix">
          <el-date-picker
            v-model="search.dateRange"
            type="daterange"
            clearable
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="onDateChange"
          />
          <el-select
            v-model="search.status"
            placeholder="处理状态"
            clearable
            @change="changeIndex(1)"
          >
            <el-option label="待处理" value="PENDING" />
            <el-option label="已完成" value="DONE" />
          </el-select>
          <template v-if="canBatchOperate">
            <el-button icon="el-icon-download" :disabled="!hasResult" @click="handleExport()"
              >导出</el-button
            >
            <el-button
              type="primary"
              style="margin-left: 0"
              :disabled="!hasResult"
              @click="handleFinish()"
              >完成待处理数据</el-button
            >
          </template>
        </div>
      </div>
      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData" height="calc(100vh - 210px)">
            <el-table-column prop="id" label="id" />
            <el-table-column prop="iccids" label="卡号">
              <template slot-scope="{ row }">
                <el-button type="text" @click="handelOpenCardDetail(row)">{{
                  row.iccids.length
                }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="province" label="绑定省份" />
            <el-table-column prop="status" label="处理状态">
              <template slot-scope="{ row }">
                {{ statusMap[row.status] }}
              </template>
            </el-table-column>
            <el-table-column prop="gmtCreated" label="提交时间">
              <template slot-scope="{ row }">
                {{ row.gmtCreated | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button v-if="row.status === 'PENDING'" type="primary" @click="handleFinish(row)"
                  >完成</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="wh__body--page">
          <el-pagination
            :current-page="page.pageIndex"
            :page-size="page.pageSize"
            :total="page.total"
            layout="pager, total"
            @current-change="changeIndex"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
