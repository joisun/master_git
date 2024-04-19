import enums from '@/constant/enums'
import tagExtract from '@/global/directive/tag-extract'
import numberFilter from '@/global/filters/number-fixed'

export const PRICE_SET_COLUMNS = [
  { key: 'operator', label: '运营商', width: '100', formatter: (row, { property }) => enums.carrier.get(row[property]) },
  { key: 'offerType', label: '套餐类型', formatter: (row, { property }) => enums.planType.get(row[property]), width: '100' },
  { key: 'dataAmount',
    label: '套餐规格',
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
    width: '113'
  },
  { key: 'rechargeUnit', label: '套餐周期', width: '80' },
  { key: 'categoryId', label: '套餐分类', width: '197' },
  { key: 'officalPrice', label: '运营商报价', width: '113', formatter: row => row.minOfficialPrice === row.maxOfficialPrice ? row.minOfficialPrice :`${row.minOfficialPrice}-${row.maxOfficialPrice}` },
  { label: '平台售价', width: '113', formatter: row => row.minPrice === row.maxPrice ? row.minPrice : `${row.minPrice}-${row.maxPrice}` },
  { key: 'buyBottomPrice', label: '购卡底价', width: '97', formatter: row => row.minBottomPrice === row.maxBottomPrice ? numberFilter(row.minBottomPrice) : `${numberFilter(row.minBottomPrice)}-${numberFilter(row.maxBottomPrice)}` },
  { label: '购卡价格', width: '97', formatter: row => row.minSalePrice === row.maxSalePrice ? numberFilter(row.minSalePrice) : `${numberFilter(row.minSalePrice)}-${numberFilter(row.maxSalePrice)}` },
  { key: 'bottomPrice', label: '续费底价', width: '97', formatter: row => row.minRechargeBottomPrice === row.maxRechargeBottomPrice ? numberFilter(row.minRechargeBottomPrice) : `${numberFilter(row.minRechargeBottomPrice)}-${numberFilter(row.maxRechargeBottomPrice)}` },
  { key: 'bottomPrice', label: '续费价格', width: '97', formatter: row => row.minRechargePrice === row.maxRechargePrice ? numberFilter(row.minRechargePrice) : `${numberFilter(row.minRechargePrice)}-${numberFilter(row.maxRechargePrice)}` },
]

export const PRICE_CONDITIONS_LIST = [
  { name: '续费条件一', showFields: 'condition1', discountFields: 'condition1Discount' },
  { name: '续费条件二', showFields: 'condition2', discountFields: 'condition2Discount' },
  { name: '续费条件三', showFields: 'condition3', discountFields: 'condition3Discount' },
  { name: '续费条件四', showFields: 'condition4', discountFields: 'condition4Discount' }
]
