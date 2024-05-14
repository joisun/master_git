import dateFormat from '@/global/filters/date-format'
import enums from '@/constant/enums'

export const columns = [
  { key: 'carrier', name: '运营商', width: '80', formatter: (row, { property }) => enums.carrier.get(row[property]) },
  { key: 'carrierAccountName', name: '供应商账号', width: '160' },
  { key: 'type', name: '入库套餐类型', width: '120', formatter: (row, { property }) => enums.ratePlanType.get(row[property]) },
  { key: 'packageName', name: '入库套餐档位', width: '100' },
  { key: 'supportTesting', name: '测试期', width: '70', formatter: (row, { property }) => (row[property] ? '有' : '无') },
  { key: 'activationDeadline', name: '沉默期', width: '130', formatter: (row) => dateFormat(row.activationDeadline, 'YYYY-MM-DD') },
  { key: 'material', name: '材质', width: '70', formatter: (row, { property }) => enums.materialType.get(row[property]) },
  { key: 'specification', name: '规格', width: '120', formatter: (row, { property }) => enums.specificationType.get(row[property]) },
  { key: 'exportCount', name: '出库数量', width: '90' }
]
