import dateFormat from '@/global/filters/date-format'

const typeMap = {
  SPECIFY_TIME: '指定时间'
}

const columns = [
  { key: 'id', name: 'ID', width: '80' },
  { key: 'alignedCount', name: '对齐卡数', width: '49' },
  { key: 'alignManner', name: '对齐方式', width: '49' },
  {
    name: '指定固定激活时间',
    width: '150',
    formatter: (row, { property }) => dateFormat(row.activeTime)
  },
  {
    name: '时间',
    width: '150',
    formatter: (row, { property }) => dateFormat(row.operationTime)
  },
  { key: 'operator', name: '操作人', width: '80' }
]

export { columns, typeMap }
