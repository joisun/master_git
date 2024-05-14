<script>
  import detail from './components/detail'
  export default {
    name: 'finance-cost-statistic',
    components: {
      detail
    },
    data() {
      return {
        lastSyncTime: '',
        totalStatistic: {},
        isLoading: false,
        history: [],
        lastSyncDate: '',
        total: {
          lastMonthRealCost: '',
          totalExpectCost: '',
          totalIncome: '',
          lastMonthIncome: '',
          lastMonthExpectCost: '',
          totalRealCost: ''
        }
      }
    },
    created() {
      this.getTotal()
    },
    methods: {
      async getTotal() {
        let res = await this.jaxLib.cost.statistic.getTotal()
        if (!res.success) return false
        let totalStatistic = res.data
        this.lastSyncDate = totalStatistic.lastSyncDate
        Object.keys(this.total).forEach(key => {
          if (totalStatistic[key] || totalStatistic[key] === 0) {
            this.total[key] = totalStatistic[key].toFixed(2)
          } else {
            this.total[key] = '-'
          }
        })
      }
    }
  }
</script>

<template>
  <div class="finance-cost-statistic">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">成本统计
        </h2>
      </div>
      <div class="wh__info" v-loading="isLoading">
        <div class="wh__info--title">
          <span>成本统计
            <span class="gridFont">
              最近同步时间: {{ lastSyncDate | dateFilter}}
            </span>
          </span>
        </div>
        <div class="wh__info--body">
          <div class="statistics">
            <div class="statistics__item">
              <p>累计收入(20190101至今)</p>
              <p>{{ total.totalIncome }}</p>
            </div>
            <div class="statistics__item">
              <p>累计采购成本</p>
              <p>{{ total.totalExpectCost }}</p>
            </div>
            <div class="statistics__item">
              <p>累计实际成本</p>
              <p>{{ total.totalRealCost }}</p>
            </div>
            <div class="statistics__item">
              <p>累计毛利</p>
              <p>{{ (total.totalIncome - total.totalRealCost).toFixed(2) }}</p>
            </div>
          </div>
          <div class="statistics">
            <div class="statistics__item">
              <p>上月收入</p>
              <p>{{ total.lastMonthIncome }}</p>
            </div>
            <div class="statistics__item">
              <p>上月采购成本</p>
              <p>{{ total.lastMonthExpectCost }}</p>
            </div>
            <div class="statistics__item">
              <p>上月实际成本</p>
              <p>{{ total.lastMonthRealCost }}</p>
            </div>
            <div class="statistics__item">
              <p>上月毛利</p>
              <p>{{ (total.lastMonthIncome - total.lastMonthRealCost).toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="wh__body">
        <detail :history="history"></detail>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .finance-cost-statistic {
    .statistics {
      display: flex;
      margin-bottom: 15px;

      &__item {
        flex: 1;
        border: 1px solid rgb(221, 221, 221);
        margin-right: 15px;
        padding: 15px;

        p {
          line-height: 30px;

          &:first-child {
            font-size: 14px;
          }

          &:last-child {
            font-weight: bold;
            font-size: 18px;
            text-align: center;
          }
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>
