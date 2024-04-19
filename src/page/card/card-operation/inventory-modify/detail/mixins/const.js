import dateFormat from '@/global/filters/date-format'

const modifyList = [
  { name: '测试期', key: 'testDataVolume', formatter: (value) => value ? '有': '无'},
  { name: '测试期流量', key: 'testDataVolume', show: (o) => !!o['testDataVolume']},
  { name: '测试期到期时间', key: 'testDeadline', formatter: (value) => dateFormat(value), show: (o) => !!o['testDataVolume']},
  { name: '激活宽限期', key: 'activationDeadline', formatter: (value) => dateFormat(value) },
  { name: '关联分类', key: 'refCategory' },
  { name: '标签', key: 'tags' }
]

export { modifyList }
