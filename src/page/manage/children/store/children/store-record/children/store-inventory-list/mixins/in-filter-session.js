import factory from '@/global/function/fold-filter-storage'

const SetCheck = 'storeInventoryListGoods'
let allSet = {
  carrier: '运营商',
  carrierAccountName: '供应商账号',
  ratePlanVolume: '套餐档位',
  material: '材质',
  specification: '规格',
  ratePlanType: '类型',
  previousInventoryCount: '上月库存',
  importCount: '本月入库',
  exportCount: '本月出库',
  inventoryCount: '当前库存'
}

export default factory(SetCheck, allSet)
