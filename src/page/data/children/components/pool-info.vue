<script>
  import statisticChart from '../mixins/statistic-chart'

  export default {
    name: 'system-pool-traffic-operation-info',
    mixins: [statisticChart],
    props: {
      statistic: {
        type: Object,
        default: () => {}
      },
      history: {
        type: Array,
        default: () => []
      },
      monthStatistic: {
        type: Object,
        default: () => {}
      },
      type: {
        type: String,
        default: 'system-pool'
      },
      poolSpecification: {
        type: Number,
        default: 0
      },
      carrier: {
        type: String
      }
    },
    data() {
      return {
        total: {
          income: '',
          expectCost: '',
          realCost: '',
          grossProfit: ''
        },
        month: {
          totalIncome: '',
          expectCost: '',
          realCost: '',
          grossProfit: ''
        }
      }
    },
    mounted() {
      this.drawDetail(this.history)
    },
    watch: {
      history(val) {
        this.drawDetail(val)
      },
      statistic() {
        this.statisticTransform('statistic', 'total')
      },
      monthStatistic() {
        this.statisticTransform('monthStatistic', 'month')
      }
    },
    computed: {
      monthText() {
        if (this.carrier === 'unicom') {
          return '上月'
        } else {
          return '本月'
        }
      }
    },
    methods: {
      statisticTransform(props, data) {
        Object.keys(this[data]).forEach(key => {
          if (this[props][key] || this[props][key] === 0) {
            this[data][key] = this[props][key].toFixed(2)
          } else {
            this[data][key] = '-'
          }
        })
      },
      drawDetail(data) {
        if (this.type === 'system-pool') {
          this.drawSystemPoolDetail(data)
        } else {
          this.drawSingleCardDetail(data)
        }
      }
    }
  }
</script>

<template>
  <div class="pool-info">
    <div class="statistics">
      <div class="statistics__item">
        <p v-if="carrier === 'unicom'">累计收入(20190101至上月)</p>
        <p v-else>累计收入(20190101至今)</p>
        <p>{{ total.income }}</p>
      </div>
      <div class="statistics__item">
        <p>累计采购成本</p>
        <p>{{ total.expectCost }}</p>
      </div>
      <div class="statistics__item">
        <p>累计实际成本</p>
        <p>{{ total.realCost }}</p>
      </div>
      <div class="statistics__item">
        <p>累计毛利</p>
        <p>{{ total.grossProfit }}</p>
      </div>
    </div>
    <div class="statistics">
      <div class="statistics__item">
        <p>{{monthText}}收入</p>
        <p>{{ month.totalIncome }}</p>
      </div>
      <div class="statistics__item">
        <p>{{monthText}}采购成本</p>
        <p>{{ month.expectCost }}</p>
      </div>
      <div class="statistics__item">
        <p>{{monthText}}实际成本</p>
        <p>{{ month.realCost }}</p>
      </div>
      <div class="statistics__item">
        <p>{{monthText}}毛利</p>
        <p>{{ (month.totalIncome - month.realCost).toFixed(2) }}</p>
      </div>
    </div>
    <div class="info__detail">
      <div id="poolDetail" class="info__detail--canvas"></div>
    </div>
  </div>
</template>

<style lang="scss">
  .pool-info {
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

    .info__detail {
      width: 100%;
      height: 450px;
      margin-top: 30px;
      padding: 10px 0;

      &--canvas {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
