<script>
  import poolInfo from '../../../components/pool-info.vue'
  import carrierTrafficTable from './components/carrier-traffic-table.vue'
  import customerTrafficTable from './components/customer-traffier-table.vue'
  import dateFormat from '@/global/filters/date-format'

  export default {
    name: 'single-card-statistic',
    components: {
      poolInfo,
      carrierTrafficTable,
      customerTrafficTable
    },
    data() {
      return {
        history: {},
        loading: false,
        totalStatistic: {},
        monthStatistic: {},
        supplierStatistic: {},
        tabsValue: 'carrier',
        month: dateFormat(new Date(), 'YYYY-MM') + '-01'
      }
    },
    mounted() {
      this.getStatistics()
    },
    computed: {
      carrier() {
        return this.$route.query.carrier
      },
      carrierAccountId() {
        return this.$route.query.carrierAccountId
      }
    },
    methods: {
      closePage() {
        this.$router.push({ name: 'single-card-show', params: { carrier: this.carrier } })
      },
      async getStatistics() {
        let res = await this.jaxLib.single.supplierStatistic({
          carrier: this.carrier,
          carrierAccountId: this.carrierAccountId,
          month: dateFormat(this.month, 'YYYY-MM') + '-01'
        })
        if (!res.success) return false
        this.supplierStatistic = res.data
        this.monthStatisticTransform(this.supplierStatistic.sum)
        res = await this.jaxLib.single.historyStatistic({
          carrier: this.carrier,
          carrierAccountId: this.carrierAccountId
        })
        if (!res.success) return false
        this.history = res.data
        this.totalStatisticTransform(this.history.sum)
      },
      monthStatisticTransform(monthStatistic) {
        this.monthStatistic = monthStatistic
        this.monthStatistic.expectCost = monthStatistic.realCost
        this.monthStatistic.grossProfit = monthStatistic.totalIncome - monthStatistic.realCost
      },
      totalStatisticTransform(totalStatistic) {
        this.totalStatistic = totalStatistic
        this.totalStatistic.income = totalStatistic.totalIncome
        this.totalStatistic.expectCost = totalStatistic.realCost
        this.totalStatistic.grossProfit = totalStatistic.totalIncome - totalStatistic.realCost
      },
      onTabChange() {},
      onChangeMonth(date) {
        this.month = dateFormat(date, 'YYYY-MM') + '-01'
      }
    }
  }
</script>

<template>
  <div class="single-card-statistics">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">单卡 - {{ Number(carrierAccountId) | carrierAccountFilter(carrier) }}
        </h2>
        <span class="wh__header--close">
          <wh-std-icon sign="xe6aa" @click="closePage">
          </wh-std-icon>
        </span>
      </div>
      <div class="wh__info" v-loading="loading">
        <div class="wh__info--title">
          <span>数据统计</span>
        </div>
        <div class="wh__info--body">
          <pool-info
            type="single-card"
            :statistic="totalStatistic"
            :monthStatistic="monthStatistic"
            :history="history.list">
          </pool-info>
        </div>
      </div>
      <div class="wh__tabs">
        <el-tabs v-model="tabsValue" @tab-click="onTabChange">
          <el-tab-pane label="供应商" name="carrier">
          </el-tab-pane>
          <el-tab-pane label="客户" name="customer">
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="wh__body">
        <carrier-traffic-table
          v-show="tabsValue === 'carrier'"
          :active="tabsValue === 'carrier'"
          :month="month"
          poolId="0"
          @change-month="onChangeMonth">
        </carrier-traffic-table>
        <customer-traffic-table
          v-show="tabsValue === 'customer'"
          :active="tabsValue === 'customer'"
          :month="month"
          poolId="0"
          @change-month="onChangeMonth">
        </customer-traffic-table>
      </div>
    </div>
  </div>
</template>
