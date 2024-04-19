import dateFormat from '@/global/filters/date-format'
import numberFilter from '@/global/filters/number-fixed'
import enums from '@/constant/enums'

export const settlementColumns = [
  { key: 'id', name: '序号', width: '67' },
  {
    key: 'tradeTime',
    name: '支付时间',
    width: '130',
    formatter: (row, { property }) => dateFormat(row[property])
  },
  { key: 'iccid', name: 'ICCID', width: '150' },
  { key: 'orgName', name: '一级客户名称', width: '150' },
  { key: 'orgId', name: '一级客户ID', width: '90' },
  { key: 'sequence', name: '记录编号', width: '120' },
  { key: 'externalOrder', name: '交易流水号', width: '120' },
  { key: 'priceOfferName', name: '套餐规格', width: '150' },
  { key: 'systemOfferId', name: '套餐ID', width: '90' },
  {
    key: 'price',
    name: '支付金额(元)',
    width: '120',
    formatter: (row, { property }) => numberFilter(row[property])
  },
  {
    key: 'profitMoney',
    name: '一级佣金(元)',
    width: '120',
    formatter: (row, { property }) => numberFilter(row[property])
  }
]

export const profitListColumns = [
  { key: 'orgId', name: '组织ID', width: '67' },
  { key: 'orgName', name: '客户名称', width: '180' },
  {
    key: 'type',
    name: '类型',
    width: '150',
    formatter: (row, { property }) => enums.commissionType.get(row[property])
  },
  {
    key: 'gmtCreated',
    name: '申请时间',
    width: '150',
    formatter: (row, { property }) => dateFormat(row[property])
  },
  {
    key: 'billingDate',
    name: '佣金账单日期',
    width: '150',
    formatter: (row, { property }) => dateFormat(row[property], 'YYYY-MM')
  },
  {
    key: 'commission',
    name: '返佣金额',
    width: '150',
    formatter: (row, { property }) => numberFilter(row[property])
  }
]

export const wechatConfig = [
  { name: '公众号ID', key: 'wx2b6b29ed360cb483' },
  { name: '客户后端主机', key: 'https://api.simboss.com' },
  { name: '商户号', key: '1504446501' },
  { name: '页面host', key: 'client.simboss.com' }
]
