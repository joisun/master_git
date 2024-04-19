<script>
  /**
   * Create by zeter on 2019-09-24
   */
  import Basics from './components/basics.vue'
  import Buy from './components/buy.vue'
  import Renewal from  './components/renewal.vue'
  import Money from './components/money.vue'
  const baseInfo = [
    { name: '累计充值', value: 'totalRechargeMoney' },
    { name: '累计消费', value: 'totalConsumeMoney' },
    { name: '累计购卡', value: 'totalBuyCardMoney' },
    { name: '累计续费', value: 'totalRenewMoney' }
  ]
  export default {
    name: 'client-data',
    data() {
      return {
        baseLoading: true,
        baseInfo: baseInfo,
        baseList: {}
      }
    },
    computed: {
      customerName() {
        return this.$route.query.orgName
      },
      orgId() {
        return Number(this.$route.query.orgId)
      }
    },
    methods: {
      async getBaseInfo() {
        let rst = await this.jaxLib.customer.statisticSummary({
          orgId: this.orgId
        })
        if (!rst.success) return false
        this.baseLoading = false
        this.baseList = rst.data
      },
      backToCustomerList() {
        this.$router.push('client-list')
      }
    },
    components: {
      'basics-data': Basics,
      'buy-data': Buy,
      'renewal-data': Renewal,
      'money-data': Money
    },
    mounted(){
      this.getBaseInfo()
    }
  }
</script>

<template>
    <div class="client-data">
      <div class="wh__warp">
        <div class="wh__header">
          <h2 class="wh-title">统计分析</h2>
          <span class="level2__back">
          <el-tooltip content="返回一级组织列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backToCustomerList"></wh-std-icon>
          </el-tooltip>
        </span>
        </div>
        <div class="mb20">
          {{ customerName }}
        </div>
        <div class="wh__body">
          <div class="flex flex-items-stretch" v-loading="baseLoading">
            <div class="client-data__info flex flex1">
            <span v-for="i in baseInfo">
            <p class="font16">{{i.name}}</p>
            <p class="font32">{{baseList[i.value] || '0'}}</p>
          </span>
            </div>
          </div>
          <div class="flex client-data__list">
            <basics-data :orgId="orgId"></basics-data>
            <money-data :orgId="orgId"></money-data>
            <buy-data :orgId="orgId"></buy-data>
            <renewal-data :orgId="orgId"></renewal-data>
          </div>
        </div>
      </div>
    </div>
</template>
<style lang="scss" scoped>
  .client-data{
    &__list{
      flex-wrap: wrap;
      & > div {
        flex: 0 0 50%;
        max-width: 50%;
        justify-content: space-between;
        padding: 10px;
        align-items:stretch;
        @media (max-width: 1280px) {
          flex: 0 0 100%;
          max-width: 100%;
        }
      }
    }
    &__info {
      flex-wrap: wrap;
      p{
        margin: 15px;
      }
      span {
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
        border-radius: 4px;
        flex: 0 0 calc(25% - 20px);
        max-width: calc(25% - 20px);
        font-size: 14px;
        margin: 0 10px 10px;
        padding: 10px;
        color: #fff;

        &:nth-child(1) {
          background-color: #488ff5;
        }

        &:nth-child(2) {
          background-color: #fcb430;
        }

        &:nth-child(3) {
          background-color: #45b3f2;
        }

        &:nth-child(4) {
          background-color: #f7494e;
        }
      }
    }
  }
</style>

