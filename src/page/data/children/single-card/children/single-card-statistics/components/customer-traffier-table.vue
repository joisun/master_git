<script>
  import CustomerTrafficTable from '../../../../components/customer-traffic-table'
  import { CUSTOMER_COLUMNS } from '../../../../mixins/consts'
  const SINGLE_CARD_CUSTOMER_COLUMNS = [ ...CUSTOMER_COLUMNS ]
  SINGLE_CARD_CUSTOMER_COLUMNS.forEach((item, index) => {
    if ([ 'memo', 'diffVolume', 'activeCount' ].indexOf(item.key) > -1) {
      SINGLE_CARD_CUSTOMER_COLUMNS.splice(index, 1)
    }
  })
  SINGLE_CARD_CUSTOMER_COLUMNS.splice(3, 0, { name: '激活卡数', key: 'chargeCount', width: '120' })
  export default {
    extends: CustomerTrafficTable,
    data() {
      return {
        isSingleCard: true
      }
    },
    computed: {
      carrier() {
        return this.$route.query.carrier
      },
      carrierAccountId() {
        return this.$route.query.carrierAccountId
      }
    },
    props: {
      columns: {
        default: _ => SINGLE_CARD_CUSTOMER_COLUMNS
      }
    },
    methods: {
      async getList() {
        if (!this.month) return false
        let res = await this.jaxLib.single.customerStatistic({
          carrier: this.carrier,
          carrierAccountId: this.carrierAccountId,
          month: this.month,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize
        })
        if (!res.success) return false
        let { sum, list } = res.data
        list = [ sum, ...list ]
        this.page.total = res.data.page && res.data.page.allCount
        this.dataSource.list = list.map((item, index) => {
          if (item.offerName === '本月合计') {
            item.orgName = item.offerName
          }
          item.index = index + 1
          item.expectCost = item.realCost // 采购成本 = 实际成本
          item.grossProfit = item.totalIncome - item.realCost
          item.grossProfitMargin = item.totalIncome ? item.grossProfit / item.totalIncome : '-'
          return item
        })
      }
    }
  }
</script>
