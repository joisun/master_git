const beforeModifyList = [
  { name: '客户ID', key: 'refId' },
  { name: '客户名称', key: 'orgName' },
  { name: '有效卡数', key: 'cardCount', formatter: (value) => `${value}张` },
  { name: '套餐分类', key: 'origCategoryName' },
  { name: '套餐类型', key: 'origCardType' }
]
const afterModifyList = [
  { name: '客户ID', key: 'refId' },
  { name: '客户名称', key: 'orgName' },
  { name: '有效卡数', key: 'cardCount', formatter: (value) => `${value}张` }
]

export { beforeModifyList, afterModifyList }
