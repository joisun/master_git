import dateFormat from '@/global/filters/date-format'

const columns = [
  { key: 'recordNo', name: '单号', width: '80' },
  { key: 'rechargeCount', name: '续费卡数', width: '49' },
  {
    name: '运营商信息',
    width: '150',
    formatter: (row, { property }) => `${row.orgName}(${row.orgId})`
  },
  {
    name: '续费套餐',
    width: '150',
    key: 'priceOfferName'
  },
  {
    name: '时间',
    width: '150',
    formatter: (row, { property }) => dateFormat(row.createTime)
  },
  { key: 'operator', name: '操作人', width: '80' }
]

export { columns }
