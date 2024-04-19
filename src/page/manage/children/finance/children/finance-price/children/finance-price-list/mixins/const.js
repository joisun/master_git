import planMap from '@/collect/plan-map'
import dateFormat from '@/global/filters/date-format'
import numberFixes from '@/global/filters/number-fixed'

import tagExtract from '@/global/directive/tag-extract'
import enums from '@/constant/enums'

const PRICE_SET_COLUMNS = [
  { key: 'categoryName', label: '套餐分类' },
  { key: 'sharable', label: '流量池共享', width: '100', formatter: (row, { property }) => (row[property] ? '支持' : '不支持') },
  { key: 'supportSms', label: '短信服务', formatter: (row, { property }) => (row[property] ? '支持' : '不支持') },
  { key: 'locationService', label: '基站定位', formatter: (row, { property }) => (row[property] ? '支持' : '不支持') },
  { key: 'realnameRequire', label: '需要实名认证', formatter: (row, { property }) => (row[property] ? '是' : '否') },
  { key: 'apnSetting', label: 'APN设置', formatter: (row, { property }) => (row[property] ? '是' : '否') },
  { key: 'cardDeviceBundling', label: '机卡绑定', formatter: (row, { property }) => (row[property] ? '是' : '否') },
  { key: 'whiteCardEnable', label: '允许0元购卡', formatter: (row, { property }) => (row[property] ? '支持' : '否') },
  { key: 'testEnable', label: '支持测试卡', formatter: (row, { property }) => (row[property] ? '支持' : '不支持') },
  { key: 'activeAfterOutput', label: '出库并激活', formatter: (row, { property }) => (row[property] ? '是' : '否') },
  { key: 'supportTestingCard', label: '支持测试期', formatter: (row, { property }) => (row[property] ? '是' : '否') },
  { key: 'allowRecharge', label: '允许续费', formatter: (row, { property }) => (row[property] ? '是' : '否') },
  {
    key: 'cardFee',
    label: '塑料卡费',
    width: '100',
    formatter: (row, { property }) => (row[property] > 0 ? numberFixes(row[property]) : '不支持'),
    show: true
  },
  {
    key: 'ceramicCardFee',
    label: '陶瓷卡费',
    width: '100',
    formatter: (row, { property }) => (row[property] > 0 ? numberFixes(row[property]) : '不支持'),
    show: true
  },
  {
    key: 'pasterCardFee',
    label: '塑料贴片卡费',
    width: '100',
    formatter: (row, { property }) => (row[property] > 0 ? numberFixes(row[property]) : '不支持'),
    show: true
  },
  {
    key: 'pasterCeramicCardFee',
    label: '陶瓷贴片卡费',
    width: '100',
    formatter: (row, { property }) => (row[property] > 0 ? numberFixes(row[property]) : '不支持'),
    show: true
  },
  {
    key: 'modified',
    label: '购买周期',
    formatter: (row, { property }) => {
      if (row.offerType === 'monthly') {
        return `${row.minPurchaseLimit}月-${row.maxPurchaseLimit}月`
      }
      return '无'
    }
  },
  { key: 'created', label: '创建时间', width: '180', formatter: (row, { property }) => dateFormat(row[property]) },
  { key: 'modified', label: '修改时间', width: '180', formatter: (row, { property }) => dateFormat(row[property]) }
]

const PRICE_COLUMNS = [
  { key: 'id', name: 'ID', width: '80' },
  { key: 'operator', name: '运营商', width: '100', formatter: (row, { property }) => enums.carrier.get(row[property]) },
  { key: 'offerType', name: '套餐类型', formatter: (row, { property }) => enums.planType.get(row[property]), width: '100' },
  {
    key: 'volume',
    name: '套餐规格',
    formatter: (row) => tagExtract(null, {
      value: {
        offerType: row.offerType,
        validity: row.validity,
        validityUnit: row.validityUnit,
        volume: row.volume,
        unlimited: row.unlimitedVolume,
        useCountAsVolume: row.useCountAsVolume,
        cardPeriod: 1 // 期限不显示（其实就是订购周期），传1
      }
    }),
    width: '110'
  },
  { key: 'rechargeUnit', name: '订购周期', width: '80' },
  { key: 'categoryId', name: '套餐分类', width: '190' },
  { key: 'officalPrice', name: '运营商价', width: '80',  formatter: row => row.minOfficialPrice === row.maxOfficialPrice ? row.minOfficialPrice : `${row.minOfficialPrice}-${row.maxOfficialPrice}`},
  { key: 'price', name: '平台报价', width: '80', formatter: row => row.minPrice === row.maxPrice ? row.minPrice : `${row.minPrice}-${row.maxPrice}` },
  { key: 'bottomPrice', name: '销售底价', width: '80', formatter: row => row.minBottomPrice === row.maxBottomPrice ? row.minBottomPrice : `${row.minBottomPrice}-${row.maxBottomPrice}` }
]

export { planMap, PRICE_COLUMNS, PRICE_SET_COLUMNS }
