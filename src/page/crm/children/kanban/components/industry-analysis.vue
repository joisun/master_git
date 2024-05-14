<script>
  import apis from '@/api/ajax'
  import moment from 'moment'

  export default {
    props: {
      saleId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        buyCardMoney: [],
        buyCardCount: [],
        keyCustomerBuyCardMoney: [], // 大客户购卡金额排行
        offerPriceRank: []
      }
    },
    created() {
      this.getData()
    },
    watch: {
      saleId() {
        this.getData()
      }
    },
    methods: {
      getData() {
        const params = {
          saleId: this.saleId,
          queryDate: moment()
            .subtract(1, 'day')
            .format('YYYY-MM-DD'),
          keyCustomer: false
        }
        this.getBuyCardMoney(params)
        this.getBuyCardCount(params)
        this.getOfferPriceRank({ saleId: params.saleId, keyCustomer: false })
        this.getBuyCardMoney({ ...params, keyCustomer: true }) // 获取大客户购卡金额
      },
      async getBuyCardMoney(params) {
        const { success, data } = await apis.crm.customerReportBuyCardMoney(params)
        if (!success) {
          return false
        }
        params.keyCustomer ? this.keyCustomerBuyCardMoney = data : this.buyCardMoney = data
      },
      async getBuyCardCount(params) {
        const { success, data } = await apis.crm.customerReportBuyCardCount(params)
        if (!success) {
          this.buyCardCount = []
          return false
        }
        this.buyCardCount = data
      },
      async getOfferPriceRank(params) {
        const { success, data } = await apis.crm.customerReportPriceOfferRank(params)
        if (!success) {
          this.offerPriceRank = []
          return false
        }
        this.offerPriceRank = data
      }
    }
  }
</script>

<template>
  <div class="industry-analysis">
    <div class="flex">
      <div class="flex1 box">
        <div class="title">购卡金额排行<span>（大客户除外）</span></div>
        <div class="box-item box-item--row">
          <p v-for="(item, index) in buyCardMoney" :key="index">
            <span class="label">{{index + 1}}、{{item.industry || '-'}}</span>
            <span class="value">{{item.buyMoney.toFixed(2)}}元</span>
          </p>
        </div>
      </div>
      <div class="flex1 box">
        <div class="title">购卡数排行<span>（大客户除外）</span></div>
        <div class="box-item box-item--row">
          <p v-for="(item, index) in buyCardCount" :key="index">
            <span class="label">{{index + 1}}、{{item.industry || '-'}}</span>
            <span class="value">{{item.buyCount}}</span>
          </p>
        </div>
      </div>
      <div class="flex1 box">
        <div class="title">大客户排行</div>
        <div class="box-item box-item--row">
          <p v-for="(item, index) in keyCustomerBuyCardMoney" :key="index">
            <span class="label">{{index + 1}}、{{item.industry || '-'}}</span>
            <span class="value">{{item.buyMoney.toFixed(2)}}元</span>
          </p>
        </div>
      </div>
    </div>
    <div class="mt20">
      <div class="box package-specs">
        <div class="title">套餐规格排行<span>（大客户除外）</span></div>
        <div class="flex">
          <div class="box-item" v-for="item in offerPriceRank" :key="item.priceOfferName">
            <div class="title">{{item.priceOfferName}}</div>
            <div v-for="(_item, index) in item.industryBuyMoneyVOList" :key="_item.industry" class="flex box-item-row">
              <div class="name">{{index + 1}}、{{_item.industry || '-'}}</div>
              <div class="value">{{_item.buyMoney.toFixed(2)}}元</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .industry-analysis {
    .box {
      border: 1px solid #efefef;
      margin-right: 20px;
      padding: 15px;
      text-align: center;

      .title {
        font-weight: 700;
        text-align: left;

        span {
          font-size: 14px;
        }
      }

      &:last-child {
        margin-right: 0;
      }

      &-item {
        border: 1px solid #efefef;
        min-height: 120px;
        min-width: 46%;
        display: inline-block;
        margin-right: 5%;
        margin-top: 10px;
        padding: 10px 0;
        font-size: 14px;

        &--row {
          width: 100%;
        }

        &:last-child {
          margin-right: 0;
        }

        p {
          display: flex;
          line-height: 26px;

          .label {
            width: 60%;
            text-align: left;
            padding-left: 15px;
          }

          .value {
            width: 40%;
            padding-right: 15px;
            text-align: right;
          }
        }
      }

      &.package-specs {
        min-height: 120px;
        color: #303133;

        .box-item {
          min-width: 10%;
          flex: 1;
          margin-right: 20px;
          padding-top: 15px;
          padding-left: 15px;

          &:last-child {
            margin-right: 0;
          }

          .title {
            margin-bottom: 8px;
            font-weight: 600;
            font-size: 14px;
          }

          &-row {
            font-size: 14px;
            line-height: 26px;

            .name {
              font-weight: 500;
              flex: 1;
              text-align: left;
            }

            .value {
              flex: 1;
              text-align: right;
              padding-right: 15px;
            }
          }
        }
      }
    }
  }
</style>
