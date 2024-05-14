import Enumerator from '@/constant/enums/crm-enum'
import DateTimeFormat from '@/global/filters/date-format'

export const columns = [
  { name: 'ID', key: 'id', minWidth: 90 },
  { name: '任务名称', key: 'missionName' },
  {
    name: '目标客户等级',
    key: 'targetCustomerRank',
    minWidth: 100,
    formatter: (row, { property }) => (row[property] ? row[property] : '全部')
  },
  {
    name: '目标销售',
    key: 'targetSellers',
    formatter: (row, { property }) =>
      row.targetSellers.map(e => e.realName).join(',')
  },
  {
    name: '需要更新的任务信息',
    key: 'targetCustomerRemark',
    minWidth: 130,
    formatter: (row, { property }) =>
      row.updateCustomerInfo ? '是' : '否'
  },
  {
    name: '任务时间',
    key: 'startTime',
    minWidth: 150,
    formatter: (row, { property }) => row['startTime'] + '~' + row['endTime']
  },
  {
    name: '创建时间',
    key: 'gmtCreated',
    minWidth: 120,
    formatter: (row, { property }) => DateTimeFormat(row['gmtCreated'])
  },
  {
    name: '任务类型',
    key: 'missionType',
    minWidth: 100,
    formatter: (row, { property }) =>
      Enumerator.convert('missionType', row[property])
  }
]
