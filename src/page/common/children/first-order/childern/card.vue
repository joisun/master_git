<script>
import ajax from '@/api/ajax'
import goSystem from '@/global/function/go-system'
import dateFormat from '@/global/filters/date-format'
import filterQueryParams from '@/global/function/filterQueryParams'
const end = new Date()
const start = new Date()
start.setTime(start.getTime() - 3600 * 1000 * 24)
end.setTime(end.getTime() - 3600 * 1000 * 24)
export default {
  data() {
    return {
      statusMap: {
        DONE: '已完成',
        DELIVERING: '待发货',
        DELIVERED: '已发货'
      },
      range: [start, end],
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              end.setTime(end.getTime() - 3600 * 1000 * 24)
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
          }
        ]
      },
      tableData: [],
      page: {
        pageSize: 20,
        pageIndex: 1,
        total: 0
      },
      loading: false
    }
  },
  methods: {
    async getList() {
      const { range } = this
      let startDay = ''
      let endDay = ''
      if (range && range.length === 2) {
        startDay = dateFormat(range[0], 'YYYY-MM-DD 00:00:00')
        endDay = dateFormat(range[1], 'YYYY-MM-DD 23:59:59')
      }
      this.loading = true
      const {
        success,
        data: {
          list,
          page: { allCount }
        }
      } = await ajax.common.getCardFirstProductionOrder(
        filterQueryParams({
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize,
          startDay,
          endDay
        })
      )
      this.loading = false
      if (!success) return false
      this.tableData = list
      this.page.total = allCount
    },
    changePageIndex(val) {
      this.page.pageIndex = val
      this.getList()
    },
    async goSystem({ orderId, orgId }) {
      let preRst = await this.jaxLib.customer.list.orgHasUser({ orgId: orgId })
      if (!preRst.success || !preRst.data) return false
      goSystem(preRst.data.id, this.pointOrgName, `/#/online/records??billId=${orderId}`)
    },
    onSearch() {
      this.page.pageIndex = 1
      this.getList()
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<template>
  <div class="download">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        下单时间：
        <el-date-picker
          v-model="range"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="onSearch"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="wh__body" v-loading="loading">
      <el-table :data="tableData" border height="calc(100vh - 180px)" style="width: 100%">
        <el-table-column prop="order_no" label="订单号">
          <template #default="{ row }">
            <el-button
              type="text"
              @click="goSystem({ orderId: row.order_no, orgId: row.org_id })"
              >{{ row.order_no }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="firstOrderDate" label="下单时间">
          <template #default="{ row }">
            {{ row.firstOrderDate | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="sale_name" label="订单状态">
          <template #default="{ row }">
            {{ statusMap[row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="total_money" label="订单金额(元)">
          <template #default="{ row }">
            {{ row.total_money | toLowerMoneyUnit }}
          </template>
        </el-table-column>
        <el-table-column prop="organization" label="客户">
          <template #default="{ row }"> {{ row.org_name }}({{ row.org_id }}) </template>
        </el-table-column>
        <el-table-column prop="organization" label="客户注册时间">
          <template #default="{ row }">
            {{ row.orgCreatedTime | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="sale_name" label="销售">
          <template #default="{ row }">
            {{ row.sale_name | saleFilter }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="changePageIndex"
        :current-page="page.pageIndex"
        :page-size="page.pageSize"
        layout="total, prev, pager, next"
        :total="page.total"
        class="wh__body--page"
      />
    </div>
  </div>
</template>
