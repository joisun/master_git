import revelFilterMixins from '@/global/mixins/reveal-filter-mixins'

const SetCheck = 'userPoolListData'
let allSet = {
  totalVolume: '流量池总量',
  useVolume: '已使用量',
  leftVolume: '剩余流量',
  usage: '流量使用占比',
  totalCount: '流量池总卡量',
  currentActivationCount: '已激活卡量',
  currentInventoryCount: '库存卡量',
  currentDeactivationCount: '已停卡卡量',
  currentTestingCount: '测试期卡量',
  currentRetiredCount: '已销卡卡量',
  lastUpgradeTime: '最近同步时间'
}

export default revelFilterMixins(SetCheck, allSet)
