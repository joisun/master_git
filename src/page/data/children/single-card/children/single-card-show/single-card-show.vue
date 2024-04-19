<script>
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
import cardDetail from './components/card-detail.vue'

export default {
  name: 'single-card-show',
  components: {
    whCarrierAccountSelect,
    cardDetail
  },
  data() {
    return {
      carrier: this.$route.params.carrier || 'cmcc',
      isLoading: false,
      signedCarrierId: '', // 所属运营商
      signedCarrierList: [], // 所属运营商
      carrierAccount: '',
      cardList: [],
      summary: {
        totalCount: 0,
        totalIncome: 0,
        totalRealCost: 0,
        totalGrossProfit: 0,
        grossProfitMargin: 0
      }
    }
  },
  watch: {
    async $route(val) {
      if (val.name === 'single-card-show' && val.params.carrier !== this.carrier) {
        this.carrier = val.params.carrier
        this.signedCarrierId = ''
        this.carrierAccountId = ''
        await this.getSignedCarrierList()
        await this.getCardList()
      }
    }
  },
  async mounted() {
    this.carrierAccount = this.$route.query.carrierAccountId
      ? Number(this.$route.query.carrierAccountId)
      : ''
    await this.getSignedCarrierList()
    await this.getCardList()
  },
  methods: {
    async tabClick(tab) {
      if (tab.name !== this.carrier) {
        this.$router.push({ name: 'single-card-show', params: { carrier: tab.name } })
        this.carrier = tab.name
        this.signedCarrierId = ''
        this.carrierAccountId = ''
        await this.getSignedCarrierList()
        this.getCardList()
      }
    },
    async getSignedCarrierList() {
      if (!this.carrier) return false
      let res = await this.jaxLib.store.signedCarrierListGet({ carrier: this.carrier })
      if (!res.success) return false
      this.signedCarrierList = res.data
    },
    getOverviewData(list) {
      let totalCount = 0
      let totalIncome = 0
      let totalRealCost = 0
      let totalGrossProfit = 0
      list.forEach((item) => {
        totalCount += item.totalCount || 0
        totalIncome += item.totalIncome || 0
        totalRealCost += item.realCost || 0
        totalGrossProfit += item.totalIncome - item.realCost || 0
      })
      return {
        totalCount,
        totalIncome: totalIncome.toFixed(3),
        totalRealCost: totalRealCost.toFixed(3),
        totalGrossProfit: totalGrossProfit.toFixed(3),
        grossProfitMargin:
          totalGrossProfit && totalIncome ? ((totalGrossProfit / totalIncome) * 100).toFixed(2) : 0
      }
    },
    async getCardList() {
      this.isLoading = true
      let res = await this.jaxLib.single.index({
        carrier: this.carrier,
        signedCarrierId: this.signedCarrierId,
        carrierAccountId: this.carrierAccount
      })
      this.isLoading = false
      if (!res.success) return false
      let cardList = res.data
      this.cardList = cardList.sort((a, b) => {
        return a.totalIncome - a.realCost - (b.totalIncome - b.realCost)
      })
      this.summary = this.getOverviewData(cardList)
    }
  }
}
</script>

<template>
  <div class="single-card-show">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">单卡</h2>
      </div>
      <el-tabs :value="carrier" class="wh__tabs" @tab-click="tabClick">
        <el-tab-pane v-for="(key, val) in enums.carrier.maps()" :key="val" :label="key" :name="val">
        </el-tab-pane>
      </el-tabs>
      <div class="wh__tools">
        <div class="wh__tools--search">
          <el-select
            v-model="signedCarrierId"
            placeholder="请选择所属运营商"
            clearable
            @change="getCardList"
          >
            <el-option
              v-for="item in signedCarrierList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <wh-carrier-account-select
            v-model="carrierAccount"
            :carrier="carrier"
            :signed-carrier-id="signedCarrierId"
            @change="getCardList"
          >
          </wh-carrier-account-select>
        </div>
        <div class="collect-content">
          <p class="collect-content__box align-middle">
            <span>
              总卡数 <br />
              {{ summary.totalCount | toLocaleString }}
            </span>
            <span>
              总收入 <br />
              {{ summary.totalIncome | toLocaleString }}
            </span>
            <span>
              总实际成本 <br />
              {{ summary.totalRealCost | toLocaleString }}
            </span>
            <span>
              总毛利 <br />
              {{ summary.totalGrossProfit | toLocaleString }}
            </span>
            <span>
              总毛利率 <br />
              {{ summary.grossProfitMargin }}%
            </span>
          </p>
        </div>
        <div v-loading="isLoading" class="wh__body">
          <div v-if="cardList.length === 0 && !isLoading" class="noValue">暂无数据</div>
          <card-detail
            v-for="(item, index) in cardList"
            v-else
            :key="index"
            :signed-carrier-list="signedCarrierList"
            :content="item"
          >
          </card-detail>
        </div>
      </div>
    </div>
  </div>
</template>
