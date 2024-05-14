import dateFormat from '@/global/filters/date-format'

const columns = [
  { key: 'orgId', name: '客户ID', width: '110' },
  { key: 'orgName', name: '客户名称', width: '150' },
  { key: 'iccidCount', name: '卡数', width: '89' },
  { key: 'operationTime', name: '操作时间', width: '150', formatter: (row, { property }) => dateFormat(row.operationTime) },
  { key: 'operator', name: '操作人', width: '150' },
  { key: 'remark', name: '备注', width: '150' }
]

export { columns }
