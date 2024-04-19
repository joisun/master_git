<script>
  /**
   * Create by zeter on 2019-04-08
   */
  import enums from '@/constant/enums'
  import classificationFilter from '@/global/filters/classification-format'
  const attachFun = [
    { value: 'sharable', name: '流量池' },
    { value: 'supportSms', name: '短信接收' },
    { value: 'locationService', name: '基站定位' },
    { value: 'realnameRequire', name: '实名认证' },
    { value: 'apnSetting', name: 'APN设置' },
    { value: 'cardDeviceBundling', name: '机卡绑定' },
    { value: 'supportTestingCard', name: '测试期' }
  ]
  const mark = [
    { value: 'whiteCardEnable', name: '支持0元购买白卡' },
    { value: 'activeAfterOutput', name: '出库并激活' },
    { value: 'testEnable', name: '支持测试卡' },
    { value: 'unlimitedVolume', name: '不限流量' },
    { value: 'allowRecharge', name: '允许续费' }
  ]
  const cardFeeList = [
    { value: 'cardFee', name: '塑料插拔卡' },
    { value: 'pasterCardFee', name: '塑料贴片卡' },
    { value: 'ceramicCardFee', name: '陶瓷插拔卡' },
    { value: 'pasterCeramicCardFee', name: '陶瓷贴片卡' }
  ]
  const spliceFunction = (ob, array) => {
    return array.map(e => {
      if (ob[e.value]) return e.name
      else return ''
    }).join(' ')
  }
  const cardFeeCalculation = (ob) => {
    return cardFeeList.map(e => {
      if (ob[e.value] >= 0) return `${e.name}(${ob[e.value]}元)`
      else return ''
    }).join(' ')
  }
  const list = [
    { name: '套餐ID', value: 'id' },
    { name: '套餐名称', value: 'name' },
    { name: '套餐类型', value: 'offerType', formatter: (name, row) => enums.planType.get(row[name]) },
    { name: '套餐分类', value: 'categoryId', formatter: (name, row) => classificationFilter(row[name]) },
    { name: '附加功能', value: 'attachFun', formatter: (name, row) => spliceFunction(row, attachFun) },
    { name: '特殊标记', value: 'mark', formatter: (name, row) => spliceFunction(row, mark) },
    { name: '卡片费用',
      value: 'legalEntityStatus',
      show: (item) => ['custom', 'monthly'].indexOf(item.offerType) >= 0,
      formatter: (name, row) => cardFeeCalculation(row) }
  ]
  export default {
    name: 'price-info-panel',
    data() {
      return {
        time: 0,
        list,
        content: {},
        loading: false
      }
    },
    props: {
      placement: {
        default: 'top'
      },
      id: {
        require: true
      }
    },
    methods: {
      async getData() {
        this.loading = true
        let rst = await this.jaxLib.financial.plan.get({
          id: this.id
        })
        if (!rst.success) return false
        this.content = rst.data[0]
        this.loading = false
      },
      show() {
        if (this.time === 0) {
          this.getData()
        }
        this.time++
      }
    }
  }
</script>

<template>
  <el-popover class="price-info-panel" ref="popover" :placement="placement" trigger="hover" @show="show">
    <div class="box-card wh-panel-card"  v-loading="loading">
      <div v-for="(o, index) in list" :key="index" v-if="o.show ? o.show(content) : true">
        {{o.name}}: {{o.formatter ? o.formatter(o.value, content) : content[o.value]}}
      </div>
    </div>
    <slot slot="reference"></slot>
  </el-popover>
</template>
