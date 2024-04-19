import factory from '@/global/function/fold-filter-storage'

const SetCheck = 'storeRecordInner'
let allSet = {
  // baseOperationId: '操作ID',
  operator: '操作人',
  carrier: '运营商',
  carrierAccountName: '供应商账号',
  ratePlanType: '套餐类型',
  ratePlanVolume: '套餐档位',
  hasTesting: '测试期',
  activationDeadLine: '激活宽限期',
  batchNo: '批次号',
  material: '材质',
  specification: '规格',
  specialLimit: '特殊限制'
  // refCategoryDesc: '套餐分类'
}

export default factory(SetCheck, allSet)
