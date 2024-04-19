import revelFilterMixins from '@/global/mixins/reveal-filter-mixins'

const SetCheck = 'systemPoolListData'
let allSet = {
  storeStatus: '库存状态',
  gprsStatus: '网络状态',
  deviceStatus: '设备状态',
  physicalStatus: '运营商状态',
  poolSpecification: '客户套餐规格',
  usage: '本月用量',
  carrierUsedVolume: '流量池接口本月用量',
  dataUsage: '最近同步时间',
  totalDataVolume: '套餐过期时间',
  lockDate: '锁卡时间'
}

export default revelFilterMixins(SetCheck, allSet)
