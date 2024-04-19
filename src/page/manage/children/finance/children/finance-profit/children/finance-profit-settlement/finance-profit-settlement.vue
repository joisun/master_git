<script>
/**
   * Create by zeter on 2019-06-03
   */
  import moment from 'moment'
  import { profitListColumns as columns } from '../../mixins/const'

  export default {
    name: 'finance-profit-list',
    data() {
      return {
        columns: columns,
        loading: false,
        list: [],
        page: {
          pageIndex: 1,
          pageSize: 20,
          total: 0
        }
      }
    },
    methods: {
      async getList() {
        this.loading = true
        let rst = await this.jaxLib.financial.getProfitRecord({
          currentPage: this.page.pageIndex,
          rowsPerPage: this.page.pageSize
        })
        this.loading = false
        if (!rst.success) return false
        this.list = rst.data.list
        this.page.total = rst.data.page.allCount
      },
      changeSize(val) {
        this.page.pageSize = val
        this.getList()
      },
      changeIndex(val) {
        this.page.pageIndex = val
        this.getList()
      },
      validBillDate(billingDate) {
        const billingDateValue = moment(billingDate, 'YYYY-MM').valueOf()
        const nowDayValue = moment().startOf('month').valueOf()
        return billingDateValue < nowDayValue
      },
      settle(val) {
        let vNode = () => (
        <div>
          <div> 此操作将会通过返佣，确认继续吗?</div>
          <div>客户ID：{val.orgId}</div>
          <div>客户名称：{val.orgName}</div>
          <div>账单日期：{moment(val.billingDate).format('YYYY-MM')}</div>
          <div>佣金总金额：{val.commission}元</div>
        </div>
      )
        this.$msgbox({
          title: '返佣',
          message: vNode(this.$createElement),
          showCancelButton: true
        }).then(async() => {
          let rst = await this.jaxLib.financial.handleApplyProfile({
            id: val.id
          })
          if (!rst.success) return false
          this.$message.success('返佣操作成功')
          this.getList()
        })
      },
    },
    mounted() {
      this.getList()
    }
  }
</script>

<template>
  <div class="finance-profit-list">
    <div class="wh__body" v-loading="loading">
      <div class="wh__body--table">
        <el-table :data="list"
                  height="calc(100vh - 260px)"
          style="width: 100%">
          <el-table-column v-for="(item, index) in columns"
            :key=index
            :formatter="item.formatter"
            :prop=item.key
            :label=item.name
            :min-width=item.width
            :class-name="item.className">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini"
                @click="settle(scope.row)"
                :disabled="scope.row.status === 'finished' || !validBillDate(scope.row.billingDate)">
                {{scope.row.status === 'rebating' ? '返佣' : '已结算'}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="wh__body--page">
        <el-pagination
          @size-change="changeSize"
          @current-change="changeIndex"
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          :page-sizes="[10, 20, 50, 100, 200]"
          :total="page.total"
          layout="sizes, pager, total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
