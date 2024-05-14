import Vue from 'vue'
// component Init
import whInput from './components/wh-search-input.vue' // 带搜索input
import stdIcon from './components/std-icon.vue'
import carrierIcon from './components/wh-carrier-icon.vue'
import temSelectItem from './components/tem-select-item.vue'

// directive Init
import tagExtract from './directive/tag-extract' // 套餐规格统一过滤
import materialExtract from './directive/material-extract' // 材质规格
import crmEnumExtract from './directive/crm-enum-extract'
import cpeEnumExtract from './directive/cpe-enum-extract'
import industryExtract from './directive/industry-extract'
import desensitization from './directive/desensitization'

// filters Init
import {
  dateUnit,
  supportFilter,
  needFilter,
  runingFilter,
  openFilter,
  open2Filter,
  open3Filter
} from './filters/word-map'
import dateFormat from './filters/date-format'
import planMapFilter from './filters/plan-word-map'
import volumeFormat from './filters/volume-format'
import numberFixed from './filters/number-fixed'
import speedFormat from './filters/speed-format'
import saleFormat from './filters/sale-format'
import classificationFormat from './filters/classification-format'
import carrierAccountFormat from './filters/carrier-account-format'
import rateFormat from './filters/rate-format' // 运营商账号 需要传入id和carrier
import ellipsisFormat from './filters/ellipsis-format'
import toLowerMoneyUnit from './filters/to-lower-money-unit'

// global function
import whImgShow from './components/wh-preview/wh-preview.js'
import Desensitization from './components/desensitization.vue'
import toLocaleString from '@/global/filters/to-local-string'
import vpdnApnFormat from '@/global/filters/vpdn-apn-format'

Vue.component('wh-desensitization', Desensitization)
Vue.component('wh-input', whInput)
// icon
Vue.component('wh-std-icon', stdIcon)

Vue.component('wh-carrier-icon', carrierIcon)

Vue.component('tem-select-item', temSelectItem)

Vue.directive('tag-extract', tagExtract)
Vue.directive('crm-enum-extract', crmEnumExtract)
Vue.directive('cpe-enum-extract', cpeEnumExtract)
Vue.directive('industry-extract', industryExtract)
Vue.directive('material-extract', materialExtract)
Vue.directive('desensitization', desensitization)

Vue.filter('toLocaleString', toLocaleString) // 时间单位过滤
Vue.filter('dateUnit', dateUnit) // 时间单位过滤
Vue.filter('supportFilter', supportFilter) // 是否支持
Vue.filter('needFilter', needFilter) // 是否需要
Vue.filter('runingFilter', runingFilter) // 是否开通
Vue.filter('openFilter', openFilter) // 是否打开
Vue.filter('open2Filter', open2Filter) // 是否打开2
Vue.filter('open3Filter', open3Filter) // 是否打开3
Vue.filter('dateFilter', dateFormat) // 日期格式化
// Vue.filter('carrierFilter', carrierTypeMap) // 运营商。使用新的版本：entry.js下定义
Vue.filter('planTypeMap', planMapFilter) // 套餐类型
Vue.filter('volumeFilter', volumeFormat) // 流量格式化
Vue.filter('numberFilter', numberFixed) // 金额过滤，小数过滤
Vue.filter('rateFilter', rateFormat) // 专用于小数转百分比
Vue.filter('speedFilter', speedFormat) // 网速格式化
Vue.filter('saleFilter', saleFormat) // 获取销售名称 业务使用前需检查是否拉取store数据
Vue.filter('classificationFilter', classificationFormat) // 套餐分类过滤器 业务使用前需检查是否拉取store数据
Vue.filter('carrierAccountFilter', carrierAccountFormat)
Vue.filter('ellipsisFilter', ellipsisFormat) // 文字过长改为省略号
Vue.filter('toLowerMoneyUnit', toLowerMoneyUnit) // 文字过长改为省略号
Vue.filter('vpdnApnFormat', vpdnApnFormat)
export const imagePlugin = {
  install(vue) {
    vue.prototype.$whImgShow = whImgShow
  }
}

Vue.use(imagePlugin)
