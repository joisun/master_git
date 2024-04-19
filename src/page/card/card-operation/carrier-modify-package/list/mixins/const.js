import dateFormat from '@/global/filters/date-format'
import volumeFilter from '@/global/filters/volume-format'

const packageModifyList = [
  { key: 'carrier', name: '运营商', width: '87' },
  { key: 'orgName', name: '运营商账号', width: '150' },
  { key: 'origCardType', name: '变更前套餐类型', width: '150' },
  { key: 'origDataVolume', name: '变更前套餐档位', width: '120', formatter: (value) => volumeFilter(value.origDataVolume) },
  { key: 'targetCardType', name: '变更后套餐类型', width: '150' },
  { key: 'targetDataVolume', name: '变更后套餐档位', width: '120', formatter: (value) => volumeFilter(value.targetDataVolume) },
  { key: 'cardCount', name: '卡片数量', width: '90' },
  { key: 'gmtModified', name: '生效时间', width: '110', formatter: (row, { property }) => dateFormat(row.gmtModified) },
  { key: 'changeBy', name: '操作人', width: '110' }
]

export { packageModifyList }
