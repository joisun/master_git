import dateFormat from '@/global/filters/date-format'
import enums from '@/constant/enums'
import { inRatePlanFormat } from '@/global/filters/rate-plan-format'

const innerColumns = [
  // { key: 'baseOperationId', name: '操作ID', formatter: (row, { property }) => (row[property] ? row[property] : '') },
  { key: 'operator', name: '操作人', width: '120' },
  {
    key: 'carrier',
    name: '运营商',
    width: '100',
    formatter: (row, { property }) => enums.carrier.get(row[property])
  },
  { key: 'carrierAccountName', name: '供应商账号', width: '150' },
  { key: 'batchNo', name: '批次号', width: '200' },
  {
    key: 'ratePlanType',
    name: '套餐类型',
    width: '120',
    formatter: (row, { property }) => enums.ratePlanType.get(row[property])
  },
  {
    key: 'ratePlanVolume',
    name: '套餐档位',
    width: '100',
    formatter: (row) => {
      if (row.ratePlanType === 'POOL') return '全套餐'
      return inRatePlanFormat({
        ratePlanType: row.ratePlanType,
        volume: row.ratePlanVolume,
        validity: row.validity,
        validityUnit: row.validityUnit,
        cardPeriod: row.cardPeriod,
        useCountAsVolume: row.useCountAsVolume
      })
    }
  },
  {
    key: 'hasTesting',
    name: '测试期',
    width: '70',
    formatter: (row, { property }) => (row[property] ? '有' : '无')
  },
  {
    key: 'activationDeadLine',
    name: '激活宽限期',
    width: '130',
    formatter: (row, { property }) => dateFormat(row[property], 'YYYY-MM-DD')
  },
  {
    key: 'material',
    name: '材质',
    width: '70',
    formatter: (row, { property }) => enums.materialType.get(row[property])
  },
  {
    key: 'cardSpecification',
    name: '规格',
    width: '120',
    formatter: (row, { property }) => enums.specificationType.get(row[property])
  }
]

const outterColumns = [
  {
    key: 'exportDate',
    name: '出库时间',
    width: '140',
    formatter: (row, { property }) => dateFormat(row[property])
  },
  {
    key: 'exportRecordId',
    name: '操作ID',
    formatter: (row, { property }) => (row[property] ? row[property] : '')
  },
  { key: 'orderNo', name: '订单号', width: '140' },
  { key: 'orgName', name: '客户名称' },
  {
    key: 'carrier',
    name: '运营商',
    formatter: (row, { property }) =>
      enums.carrier.get(row[property] ? row[property].toLowerCase() : '')
  },
  { key: 'carrierAccountList', name: '供应商账号', width: '150' },
  { key: 'type', name: '套餐类型' },
  {
    key: 'totalDataVolume',
    name: '套餐档位',
    formatter: (row) => {
      let validity = row.validity // 来自buyCardSpecification, validity存的是所购的所有月份
      if (row.type === '前向自定义') {
        validity = row.validity / row.cardPeriod
      }
      return inRatePlanFormat({
        ratePlanType: row.type,
        volume: row.totalDataVolume,
        validity: validity,
        validityUnit: row.validityUnit,
        cardPeriod: row.cardPeriod,
        useCountAsVolume: row.useCountAsVolume,
        cardPeriodUnit: '份'
      })
    }
  },
  {
    key: 'testValidity',
    name: '测试期',
    formatter: (row, { property }) => (row[property] ? '有' : '无')
  },
  {
    key: 'cardMaterial',
    name: '材质',
    formatter: (row, { property }) => enums.materialType.get(row[property])
  },
  {
    key: 'cardSpecification',
    name: '规格',
    formatter: (row, { property }) => enums.specificationType.get(row[property])
  },
  { key: 'operator', name: '操作人' }
]

export { innerColumns, outterColumns }
