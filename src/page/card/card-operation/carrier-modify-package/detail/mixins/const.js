import volumeFilter from '@/global/filters/volume-format'

const beforeModifyList = [
  { name: '运营商', key: 'carrier' },
  { name: '运营商账号', key: 'orgName' },
  { name: '有效卡数', key: 'cardCount', formatter: (value) => `${value}张` },
  { name: '当前套餐类型', key: 'origCardType' },
  { name: '当前套餐档位', key: 'origDataVolume', formatter: (value) => volumeFilter(value) }
]
const afterModifyList = [
  { name: '运营商', key: 'carrier' },
  { name: '运营商账号', key: 'orgName' },
  { name: '有效卡数', key: 'cardCount', formatter: (value) => `${value}张` }
]

export { beforeModifyList, afterModifyList }
