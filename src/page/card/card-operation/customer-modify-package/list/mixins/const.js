import dateFormat from '@/global/filters/date-format'

const packageModifyList = [
  { key: 'refId', name: '客户ID', width: '87' },
  { key: 'orgName', name: '客户名称', width: '150' },
  { key: 'origCardType', name: '变更前套餐类型', width: '150' },
  { key: 'origOfferName', name: '变更前套餐档位', width: '120' },
  { key: 'targetCardType', name: '变更后套餐类型', width: '150' },
  {
    key: 'targetOfferName',
    name: '变更后套餐档位',
    width: '120',
    formatter: (row, { property }) => (row[property] === -1 ? '无' : row[property])
  },
  { key: 'cardCount', name: '卡片数量', width: '90' },
  {
    key: 'gmtModified',
    name: '生效时间',
    width: '110',
    formatter: (row, { property }) => dateFormat(row.gmtModified)
  }
]

export { packageModifyList }
