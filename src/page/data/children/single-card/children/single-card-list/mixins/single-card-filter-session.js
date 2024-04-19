import revelFilterMixins from '@/global/mixins/reveal-filter-mixins'

const SetCheck = 'singleCardListData'
let allSet = {
  storeStatus: '库存状态',
  physicalStatus: '运营商状态',
  offerType: '套餐类型',
  carrierPoolSpecification: '运营商套餐规格',
  poolSpecification: '客户套餐规格',
  usage: '本月用量',
  lastSyncTime: '最近同步时间',
  expireDate: '套餐过期时间'
}

export default revelFilterMixins(SetCheck, allSet)
