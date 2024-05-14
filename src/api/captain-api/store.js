import { ajax } from '../api-tool'
const reservation = {
  // 查询全部库存
  reserveGetInventory(data) {
    const url = '/ajax/inventory/reserve/getInventory'
    return ajax(url, data)
  },
  // 预定库存
  inventoryReserve(data) {
    const url = '/ajax/inventory/reserve/insert'
    return ajax(url, data)
  },
  // 查询我的预定
  getMyReserve(data) {
    const url = '/ajax/inventory/reserve/getMyReserve'
    return ajax(url, data)
  },
  // 核销
  dunderwriting(data) {
    const url = '/ajax/inventory/reserve/dunderwriting'
    return ajax(url, data)
  },
  // 修改状态
  reserveUpdateStatus(data) {
    const url = '/ajax/inventory/reserve/updateStatus'
    return ajax(url, data)
  }
}
const exportCard = {
  // 列表
  deviceBaseExportStrategyList(data) {
    const url = '/ajax/deviceBaseExportStrategy/list'
    return ajax(url, data)
  },
  // 保存
  deviceBaseExportStrategySave(data) {
    const url = '/ajax/deviceBaseExportStrategy/save'
    return ajax(url, data)
  },
  // 删除
  deviceBaseExportStrategyDelete(data) {
    const url = '/ajax/deviceBaseExportStrategy/delete'
    return ajax(url, data)
  }
}
const deviceBaseBlank = {
  // 删除
  deviceBaseBlankDelete(data) {
    const url = '/ajax/deviceBaseBlank/delete'
    return ajax(url, data)
  },
  // 汇总数据
  deviceBaseBlankSummary(data) {
    const url = '/ajax/deviceBaseBlank/summary'
    return ajax(url, data)
  },

  // 入库
  deviceBaseBlankImport(data) {
    const url = '/ajax/deviceBaseBlank/input'
    return ajax(url, data)
  },
  // 入库列表
  deviceBaseBlankImportList(data) {
    const url = '/ajax/deviceBaseBlank/input/list'
    return ajax(url, data)
  },
  // 部分开卡
  deviceBaseBlankExportPart(data) {
    const url = '/ajax/deviceBaseBlank/output/part'
    return ajax(url, data)
  },
  // 出库列表
  deviceBaseBlankExportList(data) {
    const url = '/ajax/deviceBaseBlank/output/list'
    return ajax(url, data)
  },
  // 全部开卡
  deviceBaseBlankExportAll(data) {
    const url = '/ajax/deviceBaseBlank/output/all'
    return ajax(url, data)
  },
  // 材质/规格枚举
  deviceBaseBlankEnum(data) {
    const url = '/ajax/deviceBaseBlank/enum'
    return ajax(url, data)
  },
  // iccid 明细导出
  deviceBaseBlankOutputExportIccid(data) {
    const url = '/ajax/deviceBaseBlank/output/export/iccid'
    return ajax(url, data)
  },
  // 获取批次号
  deviceBaseBlankGenBatchNo(data) {
    const url = '/ajax/deviceBaseBlank/generate/batchNo'
    return ajax(url, data)
  }
}

export default {
  list(data) {
    const url = '/ajax/deviceBase/queryStockInfo'
    return ajax(url, data)
  },
  detail(data) {
    const url = '/ajax/deviceBase/queryStockDetailInfo'
    return ajax(url, data)
  },
  listRatePlan() {
    const url = '/ajax/deviceBase/listRatePlan'
    return ajax(url)
  },
  updateStoreStandardCount(data) {
    const url = '/ajax/deviceBase/updateStoreStandardCount'
    return ajax(url, data)
  },
  exportDetail(data) {
    const url = '/ajax/deviceBase/exportByStockQuery'
    return ajax(url, data)
  },
  innerStoreRecord(data) {
    const url = '/ajax/deviceBase/listImportRecord'
    return ajax(url, data)
  },
  innerStoreRecordDown(data) {
    const url = '/ajax/deviceBase/exportImportRecord'
    return ajax(url, data)
  },
  manageReport(data) {
    const url = '/ajax/deviceBase/listReportForm'
    return ajax(url, data)
  },
  countManageReport(data) {
    const url = '/ajax/deviceBase/countExportNum'
    return ajax(url, data)
  },
  downManageReport(data) {
    const url = '/ajax/deviceBase/dlReportForm'
    return ajax(url, data)
  },
  signedCarrierListGet: (data) => ajax('/ajax/signedCarrier/list', data),
  carrierAccountConfigListGet: (data) => ajax('/ajax/carrierAccount/list', data),
  carrierAccountConfigSave: (data) => ajax('/ajax/carrierAccount/save', data),

  carrierPlanList(data) {
    const url = '/ajax/rechargeConfig/list'
    return ajax(url, data)
  },
  carrierPlanAdd(data) {
    const url = '/ajax/rechargeConfig/create'
    return ajax(url, data)
  },
  carrierPlanUpdate(data) {
    const url = '/ajax/rechargeConfig/update'
    return ajax(url, data)
  },
  inventoryChangeApplyList: (data) => ajax('/ajax/cardModification/listCardInputDataChange', data),
  inventoryChangeValidate: (data) =>
    ajax('/ajax/cardModification/validateModifyCardInputData', data),
  inventoryChangeApply: (data) => ajax('/ajax/cardModification/modifyCardInputData', data),
  inventoryChangeDetail: (data) => ajax('/ajax/cardModification/cardInputDataChangeDetail', data),
  activeToInventoryList: (data) => ajax('/ajax/activationRollback/history', data),
  activeToInventoryValidate: (data) => ajax('/ajax/activationRollback/validate', data),
  activeToInventoryApply: (data) => ajax('/ajax/activationRollback/modify', data),
  nbApnModifyList: (data) => ajax('/ajax/cardModification/listApnModify', data),
  nbApnModifyValidate: (data) => ajax('/ajax/cardModification/validateApnModify', data),
  nbApnModifySave: (data) => ajax('/ajax/cardModification/modifyApn', data),

  // 客户侧套餐周期对齐记录列表
  userRatePlanAlignRecordList: (data) => ajax('/ajax/userRatePlanAlignRecord/list', data),
  // 续费记录-卡号列表
  userRatePlanAlignRecordCardList: (data) =>
    ajax('/ajax/userRatePlanAlignRecord/list/detail', data),
  // 客户侧套餐周期对齐保存
  userRatePlanAlignRecordSave: (data) => ajax('/ajax/userRatePlanAlignRecord/save', data),

  // 续费记录列表
  carrierRechargeRecordList: (data) => ajax('/ajax/carrierRechargeRecord/list', data),
  // 续费记录-卡号列表
  carrierRechargeRecordCardList: (data) => ajax('/ajax/carrierRechargeRecord/list/detail', data),
  // 续费记录保存
  carrierRechargeRecordSave: (data) => ajax('/ajax/carrierRechargeRecord/save', data),
  // 中止入库
  terminationImport: (data) => ajax('/ajax/deviceBase/terminationImport', data),
  ...deviceBaseBlank,
  ...exportCard,
  ...reservation
}
