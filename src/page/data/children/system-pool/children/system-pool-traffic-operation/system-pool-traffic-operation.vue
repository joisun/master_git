<script>
  import CarrierTrafficTable from '../../../components/carrier-traffic-table.vue'
  import CustomerTrafficTable from '../../../components/customer-traffic-table.vue'
  import PoolInfo from '../../../components/pool-info.vue'
  import dateFormat from '@/global/filters/date-format'
  import { getLastMonth } from '@/global/function/time-tool'

  export default {
    name: 'system-pool-traffic-operation',
    components: {
      CarrierTrafficTable,
      CustomerTrafficTable,
      PoolInfo
    },
    data() {
      return {
        tabsValue: '',
        month: '',
        userNowMonthly: {},
        loading: false,
        statistic: {
          statistic: {},
          history: []
        },
        detail: {},
        monthStatistic: {}
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      },
      carrier() {
        return this.$route.query.carrier
      }
    },
    async mounted() {
      this.getStatistic()
      await this.getPoolSpecification()
      this.getVolumeOperationSupplier()
      this.tabsValue = this.$route.query.type || 'carrier'
    },
    methods: {
      async getStatistic() {
        let res = await this.jaxLib.pool.volumeStatistic({ poolId: this.id })
        if (!res.success) return false
        this.statistic = res.data
      },
      async getPoolSpecification() {
        let res = await this.jaxLib.pool.details({
          poolId: this.id
        })
        if (!res.success) return false
        this.detail = res.data
        if (this.carrier === 'unicom' && this.detail.poolSpecification === -1) {
          this.month = getLastMonth()
        } else {
          this.month = new Date()
        }
      },
      async getVolumeOperationSupplier() {
        const month = this.carrier === 'unicom' ? getLastMonth() : new Date()
        let rst = await this.jaxLib.pool.volumeOperationSupplier({
          poolId: this.id,
          pageIndex: 1,
          pageSize: 15,
          month: dateFormat(month, 'YYYY-MM') + '-01'
        })
        if (!rst.success) return false
        this.monthStatistic = rst.data.sum[0]
      },
      closePage() {
        this.$router.push({ name: 'system-pool-show', params: { carrier: this.detail.carrier } })
      },
      // 切换周期
      onTabChange(tab, event) {
        this.$router.push({ name: this.$route.name, query: { id: this.id, type: tab.name, carrier: this.carrier } })
      },
      onChangeMonth(date) {
        this.month = date
      }
    }
  }
</script>

<template>
  <div class="system-pool-traffic-operation">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">系统流量池 -
          <span v-tag-extract="{volume: detail.poolSpecification}"></span>
        </h2>
        <span class="wh__header--close">
          <wh-std-icon sign="xe6aa" @click="closePage">
          </wh-std-icon>
        </span>
      </div>
      <div class="wh__info" v-loading="loading">
        <div class="wh__info--title">
          <span>流量运营
            <span class="gridFont">
              最近同步时间: {{ statistic.lastSyncTime | dateFilter}}
            </span>
          </span>
        </div>
        <div class="wh__info--body">
          <pool-info
            :statistic="statistic.statistic"
            :monthStatistic="monthStatistic"
            :poolSpecification="detail.poolSpecification"
            :carrier="carrier"
            :history="statistic.history">
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
          :poolId="id"
          :carrier="carrier"
          :poolSpecification="detail.poolSpecification"
          @change-month="onChangeMonth">
        </carrier-traffic-table>
        <customer-traffic-table
          v-show="tabsValue === 'customer'"
          :active="tabsValue === 'customer'"
          :month="month"
          :poolId="id"
          :carrier="carrier"
          :poolSpecification="detail.poolSpecification"
          @change-month="onChangeMonth">
        </customer-traffic-table>
      </div>
    </div>
  </div>
</template>
