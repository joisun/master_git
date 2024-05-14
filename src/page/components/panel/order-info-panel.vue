<script>
  /**
   * Create by zeter on 2019-04-08
   */
  import enums from '@/constant/enums'
  import dateFormat from '@/global/filters/date-format'
  import numberFormat from '@/global/filters/number-fixed'

  const list = [
    { name: '状态', value: 'status', formatter: (name, row) => enums.orderStatus.get(row[name]) },
    { name: '创建时间', value: 'gmtCreated', formatter: (name, row) => dateFormat(row[name]) },
    { name: '客户名称', value: 'orgName' },
    { name: '总金额', value: 'totalMoney', formatter: (name, row) => `${numberFormat(row[name] / 10000)}元(含运费${row.logisticsFee / 10000}元)` },
    { name: '总张数', value: 'buyCount', formatter: (name, row) => `${row[name]}张` },
    { name: '销售', value: 'salesName' }
  ]
  const orderQueryList = [
    { name: '短信', value: 'supportSms', formatter: (name, row) => row[name] ? '支持' : '不支持' },
    { name: '流量池', value: 'type', formatter: (name, row) => row[name] === 'POOL' ? '支持' : '不支持' },
    { name: '测试期', value: 'supportTestingCard', formatter: (name, row) => row.supportTestingCard ? `${row.testValidity}个月` : '无' },
    { name: '材质规格', value: 'cardMaterial', formatter: (name, row) => enums.materialType.get(row.cardMaterial) + enums.specificationType.get(row.cardSpecification) },
    { name: '卡费(单价)', value: 'cardFee', formatter: (name, row) => `${row.cardFee / row.buyCount / 10000}元` },
    { name: '自动续费', value: 'automaticRecharge', formatter: (name, row) => row[name] ? '开启' : '未开启' },
    { name: '销售价格', value: 'ratePlanDiscountPrice', formatter: (name, row) => `${numberFormat(row[name] / 10000)}元` },
    { name: '订购周期', value: 'validity', formatter: (name, row) => row.ratePlanType === 'MONTHLY' ? row.validity + '月' : row.rechargeUnit + '份' },
    { name: '小计', value: 'totalMoney', formatter: (name, row) => `${numberFormat(row[name] / 10000)}元` }
  ]
  export default {
    name: 'order-info-panel',
    data() {
      return {
        time: 0,
        list,
        orderQueryList,
        content: {},
        queryList: [],
        loading: false
      }
    },
    props: {
      placement: {
        default: 'top',
        type: String
      },
      id: {
        required: true
      }
    },
    methods: {
      async getData() {
        let rst = await this.jaxLib.bill.query({
          orderNo: this.id,
          pageSize: '1',
          pageIndex: '1',
          enableFilter: 'off'
        })
        if (!rst.success || !rst.data.list.length) return false
        this.content = rst.data.list[0]
      },
      async getListData() {
        let rst = await this.jaxLib.bill.specification.get(this.id)
        if (!rst.success) return false
        this.queryList = rst.data.list
      },
      async show() {
        if (this.time === 0) {
          this.loading = true
          await Promise.all([this.getData(), this.getListData()])
          this.loading = false
        }
        this.time++
      }
    }
  }
</script>

<template>
  <el-popover class="order-info-panel" ref="popover" :placement="placement" trigger="hover" @show="show" width="500">
    <div class="box-card wh-panel-card order-panel" v-loading="loading" >
      <el-collapse :value="['1']">
        <el-collapse-item name="1">
          <template slot="title">
            订单号 {{id}}
          </template>
          <div class="wh-panel-card__group">
            <div v-for="(o, index) in list" :key="index" class="wh-panel-card__item">
              {{o.name}}: {{o.formatter ? o.formatter(o.value, content) : content[o.value]}}
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item v-for="(i, index) in queryList" :key="index">
          <template slot="title">
            {{i.carrier | carrierFilter}}
            {{i.priceOfferCategory ? i.priceOfferCategory.name : ''}}
            <span v-tag-extract="{
              offerType: i.ratePlanType,
              validity: i.validity,
              validityUnit: i.validityUnit,
              volume: i.volume,
              unlimited: i.unlimitedVolume,
              cardPeriod: i.rechargeUnit,
              useCountAsVolume: i.useCountAsVolume,
            }"></span>
            {{i.buyCount}}张
          </template>
          <div class="wh-panel-card__group">
            <div v-for="(o, index) in orderQueryList" :key="index" class="wh-panel-card__item">
              {{o.name}}: {{o.formatter ? o.formatter(o.value, i) : i[o.value]}}
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <slot slot="reference"></slot>
  </el-popover>
</template>
