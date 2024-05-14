<script>
  import CarrierTrafficTable from '../../../../components/carrier-traffic-table'
  import { SINGLE_CARD_CARRIER_COLUMNS } from '../../../../mixins/consts'
  export default {
    extends: CarrierTrafficTable,
    computed: {
      carrier() {
        return this.$route.query.carrier
      },
      carrierAccountId() {
        return this.$route.query.carrierAccountId
      }
    },
    data() {
      return {
        isSingleCard: true
      }
    },
    created() {
      this.getList()
    },
    props: {
      columns: {
        default: _ => SINGLE_CARD_CARRIER_COLUMNS
      }
    },
    methods: {
      async getList() {
        let res = await this.jaxLib.single.supplierStatistic({
          carrier: this.carrier,
          carrierAccountId: this.carrierAccountId,
          month: this.month
        })
        if (!res.success) return false
        let { sum, list } = res.data
        list = [ sum, ...list ]
        this.dataSource.list = list.map((item, index) => {
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
