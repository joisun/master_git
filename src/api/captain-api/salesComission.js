import { ajax } from '../api-tool'

const projectOrder = {
  /**
   * 查询订单标记
   * */
  salesCommissionMarkQuery: (data) => ajax('/ajax/salesCommissionMark/query', data),
  /**
   * 新增订单标记
   * */
  salesCommissionMarkSave: (data) => ajax('/ajax/salesCommissionMark/save', data)
}
const commissionConfig = {
  getSalesButlerConfig: async (data) =>
    ajax('/ajax/saleButlerConfig/list/groupByGroupId', { data }),

  /**
   * 获取 地区code名称 map
   * */
  getButlerSaleGroupId: (data) => ajax('/ajax/saleButlerConfig/list/groupId', data),

  /**
   * 获取销售提成配置
   * */
  salesCommissionConfigList: (data) => ajax('/ajax/salesCommissionConfig/list', data),
  /**
   * 获取提成下限
   * */
  salesCommissionConfigLowerLimit: (data) =>
    ajax('/ajax/salesCommissionConfig/list/lowerLimit', data),
  /**
   * 获取 内部系统（butler)销售组织结构
   * */
  salesCommissionConfigButlerListSale: (data) =>
    ajax('/ajax/salesCommissionConfig/list/butler/sale', data),
  /**
   * 获取个人提成系数
   * */
  salesCommissionConfigPersonalCoefficient: (data) =>
    ajax('/ajax/salesCommissionConfig/list/personal/coefficient', data),
  /**
   * 获取团队提成百分比
   * */
  salesCommissionConfigTeamPercentage: (data) =>
    ajax('/ajax/salesCommissionConfig/list/team/percentage', data),
  /**
   * 保存销售提成配置
   * */
  salesCommissionConfigSave: (data) => ajax('/ajax/salesCommissionConfig/save', data),
  /**
   * 保存个人提成系数
   * */
  salesCommissionConfigPersonalSave: (data) =>
    ajax('/ajax/salesCommissionConfig/save/personal/coefficient', data),
  /**
   * 保存团队提成百分比
   * */
  salesCommissionConfigTeamSave: (data) =>
    ajax('/ajax/salesCommissionConfig/save/team/percentage', data),
  /**
   * 获取当前登录用户角色
   * */
  getCurrentUserAuthority: (data) =>
    ajax('/ajax/salesCommissionConfig/getCurrentUserAuthority', data),
  /**
   * 获取 地区code名称 map
   * */
  getButlerSaleArea: (data) => ajax('/ajax/salesCommissionConfig/list/butler/sale/area', data)
}
const salesCommission2024 = {
  summary: (data) => ajax('/ajax/salesCommission2024/summary', data),
  getLastModifyTime: (data) => ajax('/ajax/salesCommission2024/getLastModifyTime', data),
  // 销售提成数据详情 客户纬度
  detail: (data) => ajax('/ajax/salesCommission2024/detail', data),
  detailModifyCost: (data) => ajax('/ajax/salesCommission2024/detail/modifyCost', data),
  detailModifyRecord: (data) => ajax('/ajax/salesCommission2024/detail/modifyRecord', data),
  addDetail: (data) => ajax('/ajax/salesCommission2024/addDetail', data),
  batchImportCheck: (data) => ajax('/ajax/salesCommission2024/import/check', data),
  batchImport: (data) => ajax('/ajax/salesCommission2024/import', data),
  export: (data) => ajax('/ajax/salesCommission2024/export', data)
}

export default {
  query: (data) => ajax('/ajax/salesCommission/summary', data),
  detailQuery: (data) => ajax('/ajax/salesCommission/detail', data),
  modifyCost: (data) => ajax('/ajax/salesCommission/detail/modifyCost', data),
  detailExport: (data) => ajax('/ajax/salesCommission/detail/export', data),
  export: (data) => ajax('/ajax/salesCommission/export', data),
  import: (data) => ajax('/ajax/salesCommission/import', data),
  getPercentageList: (data) => ajax('/ajax/salesCommissionRateConfig/list', data),
  saveSalesComissionPercentage: (data) => ajax('/ajax/salesCommissionRateConfig/save', data),
  deletePercentageItem: (data) => ajax('/ajax/salesCommissionRateConfig/delete', data),
  getCostList: (data) => ajax('/ajax/salesCost/list', data),
  addComissionCost: (data) => ajax('/ajax/salesCost/save', data),
  modifyComissionCost: (data) => ajax('/ajax/salesCost/modifyCost', data),
  comissionCostExport: (data) => ajax('/ajax/salesCost/export', data),
  computeRefundMoney: (data) => ajax('/ajax/refund/checkRefund', data),
  submitRefundMoney: (data) => ajax('/ajax/refund/refund', data),
  deleteDetailItem: (data) => ajax('/ajax/salesCommission/detail/delete', data),
  refundDetailExport: (data) => ajax('/ajax/refund/exportDetail', data),
  importCost: (data) => ajax('/ajax/salesCost/import', data),
  getSalesList: () => ajax('/ajax/sales/list'),
  ...projectOrder,
  ...commissionConfig,
  salesCommission2024
}
