import enums from '@/constant/enums'

export const cardStoreMap = [
  { key: 'carrier', label: '运营商', width: '100px', formatter: (row, { property }) => enums.carrier.get(row[property]) },
  {
    key: 'carrierAccountName',
    label: '供应商账号',
    width: '200px',
    formatter: (row, { property }) => `${row[property]}(${row.carrierAccountId})`
  },
  {
    key: 'ratePlanVolume',
    label: '套餐档位',
    width: '100px',
    formatter: (row) => row.packageName
  },
  {
    key: 'material',
    label: '材质',
    width: '80px',
    formatter: (row, { property }) => enums.materialType.get(row[property])
  },
  {
    key: 'specification',
    label: '规格',
    width: '80px',
    formatter: (row, { property }) => enums.specificationType.get(row[property])
  },
  {
    key: 'ratePlanType',
    label: '类型',
    width: '120px',
    formatter: row => enums.ratePlanType.get(row.type)
  },
  { key: 'previousInventoryCount', label: '上月库存', width: '100px' },
  { key: 'importCount', label: '本月入库', width: '100px' },
  { key: 'exportCount', label: '本月出库', width: '100px' },
  { key: 'inventoryCount', label: '当前库存', width: '100px' }
]
