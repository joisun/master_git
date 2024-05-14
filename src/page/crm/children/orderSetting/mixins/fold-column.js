import Enumerator from '@/constant/enums/crm-enum'
import DateTimeFormat from '@/global/filters/date-format'
import numberFixed from '@/global/filters/number-fixed'

export const columns = [
  [
    { name: '区域', key: 'group' },
    { name: '销售', key: 'seller' },
    { name: '分配客户数', key: 'customers' },
    { name: '及时跟进数', key: 'followed' },
    { name: '及时跟进率', key: 'followedRate', formatter: (row) => (((row['followed']/row['customers'])*100).toFixed(2) + '%') }
  ],
  [
    {
      label: '7天成单率',
      items: [
        { name: '测试单', key: 'testingOrder7Days', formatter: (row, { property }) => (((row[property]/row['customers'])*100).toFixed(2) + '%') },
        { name: '正式单', key: 'productionOrder7Days', formatter: (row, { property }) => (((row[property]/row['customers'])*100).toFixed(2) + '%') }
      ]
    },
    {
      label: '15天成单率',
      items: [
        { name: '测试单', key: 'testingOrder15Days', formatter: (row, { property }) => (((row[property]/row['customers'])*100).toFixed(2) + '%') },
        { name: '正式单', key: 'productionOrder15Days', formatter: (row, { property }) => (((row[property]/row['customers'])*100).toFixed(2) + '%') }
      ]
    },
    {
      label: '30天成单率',
      items: [
        { name: '测试单', key: 'testingOrder30Days', formatter: (row, { property }) => (((row[property]/row['customers'])*100).toFixed(2) + '%') },
        { name: '正式单', key: 'productionOrder30Days', formatter: (row, { property }) => (((row[property]/row['customers'])*100).toFixed(2) + '%') }
      ]
    }
  ]
]
