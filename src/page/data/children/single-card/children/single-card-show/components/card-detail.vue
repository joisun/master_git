<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => {}
    },
    signedCarrierList: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      signedCarrierName: ''
    }
  },
  computed: {
    grossProfit() {
      return (this.content.totalIncome - this.content.realCost).toFixed(2)
    },
    grossProfitMargin() {
      return this.content.totalIncome === 0
        ? '-'
        : ((this.grossProfit / this.content.totalIncome.toFixed(2)) * 100).toFixed(2) + '%'
    }
  },
  watch: {
    content() {
      this.signedCarrierName = this.getSignedCarrierName(this.content.signedCarrierId)
    }
  },
  created() {
    this.signedCarrierName = this.getSignedCarrierName(this.content.signedCarrierId)
  },
  methods: {
    getSignedCarrierName(id) {
      for (let i = 0, j = this.signedCarrierList.length; i < j; i++) {
        if (this.signedCarrierList[i].id === id) {
          return this.signedCarrierList[i].name
        }
      }
      return ''
    },
    detail(name) {
      const { carrier, carrierAccountId } = this.content
      this.$router.push({ name, query: { carrier, carrierAccountId } })
    }
  }
}
</script>

<template>
  <div class="single-card-grid-content">
    <div class="single-card-card-detail device-card">
      <div class="card-header">
        <span
          class="title"
          :title="content.carrierAccountId | carrierAccountFilter(content.carrier)"
          >{{ content.carrierAccountId | carrierAccountFilter(content.carrier) }}</span
        >
        <span v-if="signedCarrierName" class="info">{{ signedCarrierName }}</span>
      </div>
      <div class="card-content">
        <div class="card-content-l2">
          <div class="statistic">
            <div class="statistic__item">
              <p class="statistic__item--title">总卡数</p>
              <p class="statistic__item--value">{{ content.totalCount }}</p>
            </div>
            <div class="statistic__item">
              <p class="statistic__item--title">计费卡数</p>
              <p class="statistic__item--value">{{ content.chargeCount }}</p>
            </div>
            <div class="statistic__item">
              <p class="statistic__item--title">库存卡数</p>
              <p class="statistic__item--value">{{ content.inventoryCount }}</p>
            </div>
            <div class="statistic__item">
              <p class="statistic__item--title">销卡卡数</p>
              <p class="statistic__item--value">{{ content.retiredCount }}</p>
            </div>
          </div>
          <div class="statistic">
            <div class="statistic__item">
              <p class="statistic__item--title">收入</p>
              <p class="statistic__item--value">{{ content.totalIncome.toFixed(2) }}</p>
            </div>
            <div class="statistic__item">
              <p class="statistic__item--title">实际成本</p>
              <p class="statistic__item--value">{{ content.realCost.toFixed(2) }}</p>
            </div>
            <div class="statistic__item">
              <p class="statistic__item--title">毛利</p>
              <p class="statistic__item--value">{{ grossProfit }}</p>
            </div>
            <div class="statistic__item">
              <p class="statistic__item--title">毛利率</p>
              <p class="statistic__item--value" :class="{ warn: grossProfit < 0 }">
                {{ grossProfitMargin }}
              </p>
            </div>
          </div>
        </div>
        <div class="card-content-l3 margin-bottom-10">
          <el-button type="primary" size="mini" @click="detail('single-card-list')"
            >卡片列表</el-button
          >
          <el-button type="primary" size="mini" @click="detail('single-card-statistics')"
            >数据统计</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" >
.single-card-grid-content {
  .card-header {
    .title {
      width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      @media screen and (max-width: 1700px) {
        width: 300px;
        top: 0.4rem;
        right: 0.4rem;
      }
    }
  }
}
</style>
