import enums from '@/constant/enums'
import carrierAccountFormat from '@/global/filters/carrier-account-format'
import tagExtract from '@/global/directive/tag-extract'

export const columns = [{
  key: 'carrier',
  label: '运营商',
  width: '100',
  formatter: (row, {
    property
  }) => enums.carrier.get(row[property])
}, {
  key: 'carrierAccountId',
  label: '运营商账号',
  width: '100',
  formatter: (row, {
    property
  }) => carrierAccountFormat(row[property], row.carrier)
}, {
  key: 'offerType',
  label: '套餐类型',
  width: '100',
  formatter: (row, {
    property
  }) => enums.planType.get(row[property])
}, {
  key: 'volume',
  label: '套餐档位',
  width: '100',
  formatter: (row) => tagExtract(null, {
    value: {
      volume: row.volume,
      validity: row.validity,
      validityUnit: row.validityUnit
    }
  })
}]

export const accountTypeParam = {
  cmcc: {
    2: [{
      key: 'packageId',
      value: '',
      info: '套餐ID'
    }],
    5: [{
      key: 'prodID',
      value: '',
      info: '商品ID'
    }, {
      key: 'attrID',
      value: '',
      info: '商品属性'
    }, {
      key: 'attrValue',
      value: '',
      info: '商品属性值'
    }]
  },
  unicom: {

  },
  chinanet: {
    1: [{
      key: 'flowValue',
      value: '',
      info: '套餐ID'
    }],
    2: [{
      key: 'flowValue',
      value: '',
      info: '套餐ID'
    }]
  }

}
