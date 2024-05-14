import dateFormat from '@/global/filters/date-format'

const columns = [
  { key: 'gmtCreated', name: '操作时间', width: '110', formatter: (row, { property }) => dateFormat(row.gmtCreated) },
  { key: 'cardCount', name: '卡数', width: '87' },
  { key: 'operator', name: '操作人', width: '150' },
  { key: 'remark', name: '备注', width: '150' }
]

export { columns }
