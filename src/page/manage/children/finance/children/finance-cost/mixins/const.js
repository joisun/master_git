import tagExtract from '@/global/directive/tag-extract'
import enums from '@/constant/enums'
import classificationFilter from '@/global/filters/classification-format'

const PRICE_COLUMNS = [{
  key: 'id',
  name: 'ID',
  width: '60'
}, {
  key: 'operator',
  name: '运营商',
  width: '76',
  formatter: (row, {
    property
  }) => enums.carrier.get(row[property])
}, {
  key: 'offerType',
  name: '套餐类型',
  formatter: (row, {
    property
  }) => enums.planType.get(row[property]),
  width: '100'
}, {
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
      cardPeriod: row.rechargeUnit
    }
  }),
  width: '110'
}, {
  key: 'categoryId',
  name: '套餐分类',
  formatter: (row, {
    property
  }) => classificationFilter(row[property]),
  width: '190'
}, {
  key: 'officalPrice',
  name: '运营商价',
  width: '80'
}, {
  key: 'price',
  name: '平台报价',
  width: '80'
}, {
  key: 'bottomPrice',
  name: '销售底价',
  width: '80'
}, {
  key: 'bottomPrice',
  name: '销售底价折扣',
  width: '80',
  formatter: (row) => `${row.officalPrice ? (row.bottomPrice / row.officalPrice).toFixed(3) : '-'}`
}
]
export {
  PRICE_COLUMNS
}
