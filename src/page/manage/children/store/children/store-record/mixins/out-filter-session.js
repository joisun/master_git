import factory from '@/global/function/fold-filter-storage'

const SetCheck = 'storeRecordOut'
let allSet = {
  exportDate: '出库时间',
  exportRecordId: '操作ID',
  orderNo: '订单号',
  orgName: '客户名称',
  carrier: '运营商',
  carrierAccountList: '供应商账号',
  type: '套餐类型',
  totalDataVolume: '套餐档位',
  testValidity: '测试期',
  cardMaterial: '材质',
  cardSpecification: '规格',
  operator: '操作人',
  status: '出库状态',
  successCount: '出库数量'
}

export default factory(SetCheck, allSet)
