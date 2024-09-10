<script>
/**
 * Create by zeter on 2017/8/22
 */
import { mapTo } from '@/global/function/misc'
import DialogMixin from '@/global/mixins/dialog-mixin'
import extract from '@/global/directive/tag-extract'
import NbParams from '@/page/components/nb-params/nb-params'
import enums from '@/constant/enums'
export default {
  components: {
    NbParams
  },
  mixins: [DialogMixin],
  props: {
    orderAllValue: {
      default: {}
    },
    dialogName: {
      type: String,
      default: ''
    },
    billId: {
      default: ''
    },
    billSerialId: {
      default: ''
    },
    billStatus: {
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      billSpecificationList: []
    }
  },
  computed: {
    ifShowWaitingPurchaseButton: function () {
      return this.billStatus === 'REVIEW'
    },
    ifShowReviewButton: function () {
      return this.billStatus === 'REVIEW-FAILD' || this.billStatus === 'REVIEW'
    },
    ifShowArrivalButton: function () {
      return this.billStatus === 'PURCHASING'
    },
    ifShowOutputButton: function () {
      return this.billStatus === 'OUTPUTING'
    },
    ifShowPurchasingButton: function () {
      return this.billStatus === 'WAITING-PURCHASE'
    }
  },
  methods: {
    isNbParamsCarrier(i) {
      return i.NBIoT && ['cmcc', 'chinanet'].includes(i.carrier.toLowerCase())
    },
    open() {
      this.billSpecificationList = []
      this.getList()
    },
    // 获取购卡要求列表
    async getList() {
      this.loading = true
      let rst = await this.jaxLib.bill.specification.get(this.billId)
      this.loading = false
      if (!rst.success) {
        this.msg(rst.message, 'error')
        return false
      }
      const list = (this.billSpecificationList = [])
      // eslint-disable-next-line no-unused-vars
      for (let index in rst.data.list) {
        let c = rst.data.list[index]
        list.push(this.tranBillSpecification(c))
        this.getStoreInfo(c.id, index)
      }
    },
    // 获取单个的列表接口
    async getStoreInfo(id, index) {
      let newValue = { ...this.billSpecificationList[index] }
      newValue.loadingHistory = true
      this.$set(this.billSpecificationList, index, newValue)

      let rst = await this.jaxLib.bill.specification.getHistory({
        card_order_no: this.billId,
        bcsId: id
      })
      if (!rst.success) return false

      newValue = { ...this.billSpecificationList[index] }
      newValue.loadingHistory = false
      newValue.stockCount = rst.data.stockCount
      newValue.dbValidity = rst.data.validity
      newValue.historyList = rst.data.histories.map((m) => this.tranBillSpecification(m))
      newValue.showHistory = rst.data.histories.length
      newValue.dbType = rst.data.dbType
      this.$set(this.billSpecificationList, index, newValue)
    },
    // 转换购卡要求数据格式
    tranBillSpecification(content) {
      const toFrontPrice = (price) => (price / 10000).toFixed(2)
      let _hasTag = (con, property) => con.tagList.filter((tag) => tag.name === property).length > 0
      return mapTo(
        {
          NBIoT: 'NBIoT',
          carrier: 'carrier',
          cardMaterial: 'cardMaterial',
          cardSpecification: 'cardSpecification',
          volume: 'volume',
          validity: 'validity',
          rechargeUnit: 'rechargeUnit',
          useCountAsVolume: 'useCountAsVolume',
          validityUnit: 'validityUnit',
          gmtCreated: 'gmtCreated',
          apnDetail: 'apnDetail',
          safetyControl: 'safetyControl',
          planLifeCircle: {
            helper: () =>
              `${
                content.ratePlanType === 'MONTHLY'
                  ? content.validity + '月'
                  : content.rechargeUnit + '份'
              }`
          },
          planSpecification: {
            helper: () =>
              extract(null, {
                value: {
                  offerType: content.ratePlanType,
                  validity:
                    content.ratePlanType === 'CUSTOM'
                      ? content.validity / content.rechargeUnit
                      : content.validity,
                  validityUnit: content.validityUnit,
                  volume: content.volume,
                  unlimited: content.unlimitedVolume,
                  cardPeriod: content.rechargeUnit,
                  useCountAsVolume: content.useCountAsVolume
                }
              })
          }, // 套餐流量
          cardAmount: 'buyCount', // 卡数量
          planPrice: { name: 'ratePlanPrice', helper: toFrontPrice }, // 原价
          planDiscount: { name: 'ratePlanDiscountPrice', helper: toFrontPrice }, // 折扣价
          totalMoney: { name: 'totalMoney', helper: toFrontPrice }, // 小计
          cardFee: { name: 'cardFee', helper: toFrontPrice }, // 总卡费
          simpleCardFee: {
            helper: () =>
              `${(Number(content.cardFee / 10000) / Number(content.buyCount)).toFixed(2)}元`
          },
          feeCalType: { name: 'type', helper: (attr) => (attr === 'POOL' ? '支持' : '不支持') }, // 支持流量池
          supportSms: { name: 'supportSms', helper: (v) => (v ? '支持' : '不支持') }, // 短信
          realnameRequire: { name: 'realnameRequire', helper: (v) => (v ? '需要' : '不需要') },
          carrierRealName: { name: 'carrierRealName', helper: (v) => (v ? '需要' : '不需要') },
          locationService: { name: 'locationService', helper: (v) => (v ? '支持' : '不支持') }, // 定位支持
          ALLOW_CHANGE_RATE_PLAN: {
            name: 'priceOfferCategory',
            helper: (v) => (_hasTag(v, 'ALLOW_CHANGE_RATE_PLAN') ? '支持' : '不支持')
          },
          ALLOW_APPEND_PACKAGE: {
            name: 'priceOfferCategory',
            helper: (v) => (_hasTag(v, 'ALLOW_APPEND_PACKAGE') ? '支持' : '不支持')
          },
          ALLOW_EXTEND_PERIOD: {
            name: 'priceOfferCategory',
            helper: (v) => (_hasTag(v, 'ALLOW_EXTEND_PERIOD') ? '支持' : '不支持')
          },
          RECHARGE_TIME_LIMIT: {
            name: 'priceOfferCategory',
            helper: (v) => (_hasTag(v, 'RECHARGE_TIME_LIMIT') ? '有' : '无')
          },
          ALLOW_APPEND_POOL_PACKAGE: {
            name: 'priceOfferCategory',
            helper: (v) => (_hasTag(v, 'ALLOW_APPEND_POOL_PACKAGE') ? '支持' : '不支持')
          },
          whiteCardEnable: { name: 'whiteCardEnable', helper: (v) => (v ? '0元购卡' : false) },
          priceOfferCategoryName: {
            helper: () => (content.priceOfferCategory ? content.priceOfferCategory.name : '')
          },
          cardDeviceBundling: {
            name: 'cardDeviceBundling',
            helper: (v) => (v ? '需要' : '不需要')
          },
          apnSetting: { name: 'apnSetting', helper: (v) => (v ? '需要' : '不需要') },
          supportTestingCard: {
            name: 'supportTestingCard',
            helper: (v) => (v ? `${content.testValidity}个月` : '无')
          },
          automaticRecharge: { name: 'automaticRecharge', helper: (v) => (v ? '开启' : '不开启') },
          carriorAccounts: {
            helper: () => (content.carriorAccounts ? content.carriorAccounts.join(',') : '')
          },
          networkRate: 'networkRate',
          apn: { helper: () => (content.apn ? content.apn : '') }, // apn
          netProductType: {
            name: 'netProductType',
            helper: (v) => enums.offerType.get(v) || '无'
          }
        },
        content
      )
    },
    // 进入仓储页面
    enterStore(item) {
      let query = {
        carrier: item.carrier.toLocaleLowerCase(),
        ratePlanType: item.dbType,
        material: item.cardMaterial,
        volumeType: item.useCountAsVolume ? 'COUNT' : 'AMOUNT',
        enter: false
      }
      if (item.dbType !== 'POOL') {
        query.ratePlanVolume = item.volume
        query.validity = item.dbValidity
        query.validityUnit = item.validityUnit
      }
      const { href } = this.$router.resolve({
        name: 'store-inventory-list',
        query: query
      })
      window.open(href, '_blank')
    },

    onClickWaitingPurchase() {
      this.jaxLib.bill
        .waitingPurchase({
          orderNo: this.billId,
          waitingPurchase: true
        })
        .then((resp) => {
          if (resp.success) {
            this.shortcuts.msg(`订单${this.billId}待采购成功`, 'success')
            this.$emit('close', true)
          } else {
            this.shortcuts.notify('订单待采购失败！' + resp.message, '操作失败', 'error')
          }
        })
        .catch((err) => {
          console.error('onClickWaitingPurchase:', err)
        })
    },
    onClickReview() {
      this.jaxLib.bill.certify
        .pass(this.billSerialId)
        .then((resp) => {
          if (resp.success) {
            this.shortcuts.msg(`订单${this.billSerialId}已通过`, 'success')
            this.$emit('close', true)
          } else {
            this.shortcuts.notify('订单审核通过失败！' + resp.message, '操作失败', 'error')
          }
        })
        .catch((err) => {
          console.error('onOperateReview:', err)
        })
    },
    onClickArrival() {
      this.jaxLib.bill
        .purchasing({
          orderNo: this.billId,
          purchasing: false
        })
        .then((resp) => {
          if (resp.success) {
            this.shortcuts.msg(`订单${this.billId}已到货成功`, 'success')
            this.$emit('close', true)
          } else {
            this.shortcuts.notify('订单已到货失败！' + resp.message, '操作失败', 'error')
          }
        })
        .catch((err) => {
          console.error('onClickArrival:', err)
        })
    },
    onClickPurchasing() {
      this.jaxLib.bill
        .purchasing({
          orderNo: this.billId,
          purchasing: true
        })
        .then((resp) => {
          if (resp.success) {
            this.shortcuts.msg(`订单${this.billId}已变更为采购中状态`, 'success')
            this.$emit('close', true)
          } else {
            this.shortcuts.notify('订单设置为采购中失败！' + resp.message, '操作失败', 'error')
          }
        })
        .catch((err) => {
          console.error('onClickPurchasing:', err)
        })
    },
    onClickOutput() {
      let redirect = (_) => {
        this.$emit('close')
        this.$router.push({
          name: 'store-delivery-note',
          query: {
            orderNo: this.billId
          }
        })
      }
      if (this.billStatus !== 'WAITING-PURCHASE') {
        redirect()
        return
      }
      this.jaxLib.bill
        .waitingPurchase({
          orderNo: this.billId,
          waitingPurchase: false
        })
        .then((resp) => {
          if (resp.success) {
            redirect()
          } else {
            this.shortcuts.notify('订单已到货失败！' + resp.message, '操作失败', 'error')
          }
        })
        .catch((err) => {
          console.error('onOperateOutput:', err)
        })
    }
  }
}
</script>

<template>
  <div class="order-require">
    <div class="wh__dialog--header order-require__header">
      <p class="order-require__import">
        客户名称: {{ orderAllValue.orgName }} 收件人:
        {{ JSON.parse(orderAllValue.contactInfo).user_name }}
      </p>
      <p class="order-require__import--block">
        客户备注: {{ orderAllValue.remark }}
      </p>
      <p class="order-require__import--block">
        销售备注: {{ orderAllValue.salerRemark }}
      </p>
      <p>
        订单号:{{ orderAllValue.orderNo }} 总金额:{{ Number(orderAllValue.totalMoney) / 10000 }}元
        <span v-if="orderAllValue.refundMoney !== 0"
          >(退款金额:{{ Number(orderAllValue.refundMoney) / 10000 }})</span
        >
        总张数: {{ orderAllValue.buyCount }}张 运费{{
          Number(orderAllValue.logisticsFee) / 10000
        }}元
      </p>
      <div class="order-require__operations">
        <el-button v-if="ifShowWaitingPurchaseButton" type="primary" @click="onClickWaitingPurchase"
          >待采购</el-button
        >
        <el-button v-if="ifShowPurchasingButton" type="primary" @click="onClickPurchasing"
          >采购中</el-button
        >
        <el-button v-if="ifShowReviewButton" type="primary" @click="onClickReview">通过</el-button>
        <el-button v-if="ifShowArrivalButton" type="primary" @click="onClickArrival"
          >已到货</el-button
        >
        <el-button v-if="ifShowOutputButton" type="primary" @click="onClickOutput">出库</el-button>
      </div>
    </div>
    <div v-for="(i, index) in billSpecificationList" :key="index" class="wh__card wh__card--large">
      <div class="wh__card--header">
        <span class="wh__card--title">
          {{ i.carrier | carrierFilter }} {{ i.priceOfferCategoryName }} &nbsp;&nbsp;{{
            i.planSpecification
          }}
          {{ i.cardAmount }}张
        </span>
        <span class="float-right"
          >仓储剩余:
          <el-button type="text" @click="enterStore(i)">{{ i.stockCount }}</el-button>
        </span>
      </div>
      <div class="wh__card--body order-require__block">
        <div class="wh__card--body-item order-require__line">
          <div
            class="order-require__item"
            :class="{ 'order-require__import': i.cardMaterial.indexOf('CERAMICS') >= 0 }"
          >
            材质规格:
            <span
              >{{ i.cardMaterial | materialTypeFilter
              }}{{ i.cardSpecification | specificationTypeFilter }}</span
            >
          </div>
          <div class="order-require__item">
            流量池: <span>{{ i.feeCalType }}</span>
          </div>
          <div
            class="order-require__item"
            :class="{ 'order-require__import': i.carrier === 'unicom' && i.supportSms === '支持' }"
          >
            短信支持: <span>{{ i.supportSms }}</span>
          </div>
          <div class="order-require__item">
            测试期:
            <span v-if="i.supportTestingCard !== '无'" style="color: red">{{
              i.supportTestingCard
            }}</span>
            <span v-else>{{ i.supportTestingCard }}</span>
          </div>
          <div class="order-require__item">
            定位服务:
            <span v-if="i.locationService === '支持'" style="color: red">{{
              i.locationService
            }}</span>
            <span v-else>{{ i.locationService }}</span>
          </div>
          <div class="order-require__item">
            语音功能:
            <span>{{i.voiceCard ? '支持': '不支持'}}</span>
          </div>
        </div>
        <div class="wh__card--body-item order-require__line">
          <div class="order-require__item">
            套餐原价: <span>{{ i.planPrice }}元</span>
          </div>
          <div class="order-require__item">
            销售折扣价: <span>{{ i.planDiscount }}元</span>
          </div>
          <div class="order-require__item">
            订购周期: <span>{{ i.planLifeCircle }}</span>
          </div>
          <div class="order-require__item">
            总卡费: <span>{{ i.cardFee }}元(单价:{{ i.simpleCardFee }})</span>
          </div>
          <div class="order-require__item">
            小计:
            <span
              >{{ i.totalMoney }}元
              <span v-if="i.whiteCardEnable" style="color: red">({{ i.whiteCardEnable }})</span>
              <span v-if="i.networkRate > 0" style="margin-left: 5px">
                <el-tooltip
                  effect="dark"
                  :content="`包含${(i.networkRate * 10000) / 100}%网络功能费`"
                  placement="top"
                >
                  <i class="iconfont">&#xe600;</i>
                </el-tooltip>
              </span>
            </span>
          </div>
        </div>
        <div class="wh__card--body-item order-require__line">
          <div class="order-require__item">
            apn设置: <span>{{ i.apn || '无' }}</span>
          </div>
          <div class="order-require__item">
            机卡绑定: <span>{{ i.cardDeviceBundling }}</span>
          </div>
          <div class="order-require__item">
            实名认证: <span>{{ i.realnameRequire }}</span>
          </div>
          <div class="order-require__item">
            自动续费: <span>{{ i.automaticRecharge }}</span>
          </div>
          <div class="order-require__item">
            网络增值服务：<span :class="{ 'order-require__red': i.netProductType !== '无' }">{{
              i.netProductType
            }}</span>
          </div>
        </div>
        <div class="wh__card--body-item order-require__line">
          <div class="order-require__item">
            续费周期: <span>{{ i.ALLOW_EXTEND_PERIOD }}</span>
          </div>
          <div class="order-require__item">
            更换套餐: <span>{{ i.ALLOW_CHANGE_RATE_PLAN }}</span>
          </div>
          <div class="order-require__item">
            续费单卡加油包: <span>{{ i.ALLOW_APPEND_PACKAGE }}</span>
          </div>
          <div class="order-require__item">
            续费流量池叠加包: <span>{{ i.ALLOW_APPEND_POOL_PACKAGE }}</span>
          </div>
          <div class="order-require__item">
            续费时间限制: <span>{{ i.RECHARGE_TIME_LIMIT }}</span>
          </div>
        </div>
        <div class="wh__card--body-item order-require__line">
          <div class="order-require__item">
            运营商实名认证限制: <span>{{ i.carrierRealName }}</span>
          </div>
          <div class="order-require__item">
            安全管控: <span>{{ i.safetyControl }}</span>
          </div>
        </div>
        <div v-if="isNbParamsCarrier(i)" class="wh__card--body-item order-require__line">
          <div class="order-require__item">
            <nb-params :data="i" />
          </div>
        </div>
      </div>
      <div class="wh__card--footer order-require__history">
        <template v-if="i.loadingHistory"> 正在加载历史订单，请等待。。。 </template>
        <template v-else-if="i.showHistory">
          <div
            v-for="(historyItem, index) in i.historyList"
            :key="index"
            class="order-require__history--item"
          >
            <span class="order-require__history--title">历史订单</span>&nbsp;&nbsp;
            <span> {{ historyItem.gmtCreated | dateFilter }} </span>
            <span>{{ historyItem.carrier | carrierFilter }}</span>
            <span
              class="order-require__history--item-account"
              :title="historyItem.carriorAccounts"
              >{{ historyItem.carriorAccounts }}</span
            >&nbsp;
            <span>{{ historyItem.priceOfferCategoryName }} {{ historyItem.planSpecification }}</span
            >&nbsp;&nbsp;
            <span
              >{{ historyItem.cardMaterial | materialTypeFilter
              }}{{ historyItem.cardSpecification | specificationTypeFilter }}
            </span>
            <span
              >{{ historyItem.feeCalType }}流量池 {{ historyItem.supportSms }}短信
              {{ historyItem.locationService }}定位
              {{ historyItem.supportTestingCard }}测试期 </span
            >&nbsp;&nbsp;
            <span> {{ historyItem.cardAmount }}张 </span>
          </div>
        </template>
        <template v-else><span>该用户的该类型卡无历史订单</span></template>
      </div>
    </div>
  </div>
</template>
