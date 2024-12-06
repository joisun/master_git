/**
 * Created by gzj on 17/3/22.
 *
 * 以下是api配置的几种写法：
 *
 * 完整的配置
 * {url: '/test/post', method: 'post'}
 *
 * 简化的配置
 * '/test/post'
 *
 * 使用配置生成器
 *
 * import {GET, POST} from './helpers'
 *
 * GET('/test/get')
 * POST('/test/post')
 *
 */

import { ajax } from './api-tool'
const afterSale = {
  /**
   * 申请列表
   * */
  getAfterSaleRequestApplyList: (data) =>
    ajax('/ajax/device/afterSaleRequest/list', data, { system: 'ironman' }),
  /**
   * 退换申请
   * */
  afterSaleRequestSave: (data) =>
    ajax('/ajax/device/afterSaleRequest/save', data, { system: 'ironman' }),
  /**
   * 审核列表
   * */
  getAfterSaleRequestReviewList: (data, type) =>
    ajax(`/ajax/device/afterSaleRequest/list/review`, data, { system: 'ironman' }),

  /**
   * 换货处理列表
   * */
  getAfterSaleRequestDeliverList: (data, type) =>
    ajax(`/ajax/device/afterSaleRequest/list/deliver`, data, { system: 'ironman' }),

  /**
   *回收处理列表
   * */
  getAfterSaleRequestRecycleList: (data, type) =>
    ajax(`/ajax/device/afterSaleRequest/list/recycle`, data, { system: 'ironman' }),

  /**
   * 验收列表
   * */
  getAfterSaleAcceptanceList: (data, type) =>
    ajax(`/ajax/device/afterSaleRequest/list/acceptance`, data, { system: 'ironman' }),
  /**
   * 返厂维修列表
   * */
  getAfterSaleReturnFactoryList: (data, type) =>
    ajax(`/ajax/device/afterSaleRequest/list/returnFactory`, data, { system: 'ironman' }),
  /**
   * 各个列表总数
   * */
  getAfterSaleRequestListCount: (data) =>
    ajax('/ajax/device/afterSaleRequest/list/count', data, { system: 'ironman' }),
  /**
   * 申请详情
   * */
  getAfterSaleRequestListDetail: (data) =>
    ajax('/ajax/device/afterSaleRequest/detail', data, { system: 'ironman' }),
  /**
   * 审核详情
   * */
  getAfterSaleRequestListReviewDetail: (data) =>
    ajax('/ajax/device/afterSaleRequest/review/detail', data, { system: 'ironman' }),
  /**
   * 寄货详情
   * */
  getAfterSaleRequestListDeliverDetail: (data) =>
    ajax('/ajax/device/afterSaleRequest/deliver/detail', data, { system: 'ironman' }),
  /**
   * 验收详情
   * */
  getAfterSaleRequestListAcceptanceDetail: (data) =>
    ajax('/ajax/device/afterSaleRequest/acceptance/detail', data, { system: 'ironman' }),
  /**
   * 回收详情
   * */
  getAfterSaleRequestListRecyleDetail: (data) =>
    ajax('/ajax/device/afterSaleRequest/recycle/detail', data, { system: 'ironman' }),
  /**
   * 审核通过
   * */
  getAfterSaleRequestReviewPass: (data) =>
    ajax('/ajax/device/afterSaleRequest/review/pass', data, { system: 'ironman' }),
  /**
   * 审核驳回
   * */
  getAfterSaleRequestReviewReject: (data) =>
    ajax('/ajax/device/afterSaleRequest/review/reject', data, { system: 'ironman' }),
  /**
   * 寄货提交
   * */
  getAfterSaleRequestDeliverCommit: (data) =>
    ajax('/ajax/device/afterSaleRequest/deliver/commit', data, { system: 'ironman' }),
  /**
   * 回收提交
   * */
  getAfterSaleRequestRecyleCommit: (data) =>
    ajax('/ajax/device/afterSaleRequest/recycle/commit', data, { system: 'ironman' }),
  /**
   * 验收提交
   * */
  getAfterSaleRequestAcceptanceCommit: (data) =>
    ajax('/ajax/device/afterSaleRequest/acceptance/commit', data, { system: 'ironman' }),
  /**
   * 批量返厂申请
   * */
  returnFactorySave: (data) =>
    ajax('/ajax/device/afterSaleRequest/returnFactory/save', data, { system: 'ironman' }),
  /**
   * 批量返厂
   * */
  returnFactoryCommit: (data) =>
    ajax('/ajax/device/afterSaleRequest/returnFactory/commit', data, { system: 'ironman' }),
  /**
   * 批量返厂完成
   * */
  returnFactoryDone: (data) =>
    ajax('/ajax/device/afterSaleRequest/returnFactory/done', data, { system: 'ironman' }),
  /**
   * 批量验收申请
   * */
  returnAcceptanceSave: (data) =>
    ajax('/ajax/device/afterSaleRequest/acceptance/save', data, { system: 'ironman' }),
  /**
   * 商品列表
   * */
  list4DeviceAfterSale: (data) =>
    ajax('/ajax/item/list4DeviceAfterSale', data, { system: 'ironman' }),
  /**
   * 返厂导出
   * */
  exportReturnFactory: (data) =>
    ajax('/ajax/device/afterSaleRequest/export/returnFactory', data, { system: 'ironman' })
}

const apis = {
  resetPwd: (data) => ajax('/ajax/org/reset/password', data, { system: 'ironman' }),
  modifyLogisticsAuth: (data) => ajax('/ajax/ecommerce/modifyLogistics/auth', data, { system: 'ironman' }),
  getCpeEnumList: (data) => ajax('/ajax/enum/getAll', data, { system: 'ironman' }),
  getCustomerList: (data) => ajax('/ajax/org/level1/list', data, { system: 'ironman' }),
  getCustomerPriceList: (data) => ajax('/ajax/offer/listByOrgId', data, { system: 'ironman' }),
  batchUpdatePrice: (data) =>
    ajax('/ajax/offer/saleOffer/batchUpdatePrice', data, { system: 'ironman' }),
  updateOfferStatus: (data) =>
    ajax('/ajax/offer/saleOffer/updateStatus', data, { system: 'ironman' }),
  changeCustomerPrices: (data) => ajax('/ajax/seller/getSubordinates', data, { system: 'ironman' }),
  getDeviceList: (data) => ajax('/ajax/device/list', data, { system: 'ironman' }),
  getDeviceSysInfo: (data) => ajax('/ajax/device/sysInfo', data, { system: 'ironman' }),
  getStoreRecordList: (data) => ajax('/ajax/stock/deliver/records', data, { system: 'ironman' }),
  getStoreRecordMacList: (data) => ajax('/ajax/stock/trade/listAdr', data, { system: 'ironman' }),
  getOrderList: (data) => ajax('/ajax/ecommerce/trade/search', data, { system: 'ironman' }),
  postOrderClose: (data) => ajax('/ajax/ecommerce/trade/close', data, { system: 'ironman' }),
  getOrderMacFile: (data) => ajax('/ajax/stock/trade/exportAdr', data, { system: 'ironman' }),
  postOrderModify: (data) => ajax('/ajax/ecommerce/trade/update', data, { system: 'ironman' }),
  getOrderDeliverDetail: (data) =>
    ajax('/ajax/ecommerce/trade/outing/detail', data, { system: 'ironman' }),
  postOrderDeliver: (data) => ajax('/ajax/ecommerce/trade/delivery', data, { system: 'ironman' }),
  postStockDeliver: (data) => ajax('/ajax/stock/deliver', data, { system: 'ironman' }),
  postOrderAuditPass: (data) => ajax('/ajax/ecommerce/trade/pass', data, { system: 'ironman' }),
  postOrderAuditReject: (data) => ajax('/ajax/ecommerce/trade/noPass', data, { system: 'ironman' }),
  getItemList: (data) => ajax('/ajax/item/list', data, { system: 'ironman' }),
  updateDeviceStatus: (data) => ajax('/ajax/item/device/updateStatus', data, { system: 'ironman' }),
  updatePackageStatus: (data) =>
    ajax('/ajax/item/package/updateStatus', data, { system: 'ironman' }),
  addDevice: (data) => ajax('/ajax/item/device/insert', data, { system: 'ironman' }),
  updateDevice: (data) => ajax('/ajax/item/device/update', data, { system: 'ironman' }),
  updatePackage: (data) => ajax('/ajax/item/package/update', data, { system: 'ironman' }),
  getDeviceDetail: (data) => ajax('/ajax/item/device/getByItemNo', data, { system: 'ironman' }),
  getPackageDetail: (data) => ajax('/ajax/item/package/getByItemNo', data, { system: 'ironman' }),
  addPackage: (data) => ajax('/ajax/item/package/insert', data, { system: 'ironman' }),
  deleteDevice: (data) => ajax('/ajax/item/device/delete', data, { system: 'ironman' }),
  deletePackage: (data) => ajax('/ajax/item/package/delete', data, { system: 'ironman' }),
  getClientList: (data) => ajax('/ajax/org/search', data, { system: 'ironman' }),
  renameOrgBrand: (data) => ajax('/ajax/org/renameBrand', data, { system: 'ironman' }),
  getMonitorLogType: (data) => ajax('/ajax/tool/log/types', data, { system: 'ironman' }),
  getMonitorLogList: (data) => ajax('/ajax/tool/log/list', data, { system: 'ironman' }),
  monitorLogRematch: (data) => ajax('/ajax/tool/log/rematch', data, { system: 'ironman' }),
  monitorPing: (data) => ajax('/ajax/tool/ping', data, { system: 'ironman' }),
  monitorPingData: (data) => ajax('/ajax/tool/ping/data', data, { system: 'ironman' }),
  monitorBatchRestart: (data) => ajax('/ajax/tool/setTimerRestart', data, { system: 'ironman' }),
  getFlow: (data) => ajax('/ajax/tool/getFlow', data, { system: 'ironman' }),
  selfCheckInfo: (data) => ajax('/ajax/tool/selfCheck/info', data, { system: 'ironman' }),
  selfCheck: (data) => ajax('/ajax/tool/selfCheck', data, { system: 'ironman' }),
  wipeDevice: (data) => ajax('/ajax/tool/wipeDevice', data, { system: 'ironman' }),
  upgrade: (data) => ajax('/ajax/tool/upgrade', data, { system: 'ironman' }),
  upgradeValidate: (data) => ajax('/ajax/tool/upgrade/validate', data, { system: 'ironman' }),
  supplierList: (data) => ajax('/ajax/supplier/list', data, { system: 'ironman' }),
  supplierSave: (data) => ajax('/ajax/supplier/save', data, { system: 'ironman' }),
  supplierDelete: (data) => ajax('/ajax/supplier/delete', data, { system: 'ironman' }),
  supplierProductList: (data) => ajax('/ajax/supplier/product/list', data, { system: 'ironman' }),
  supplierProductSave: (data) => ajax('/ajax/supplier/product/save', data, { system: 'ironman' }),
  supplierProductDelete: (data) =>
    ajax('/ajax/supplier/product/delete', data, { system: 'ironman' }),
  supplierProductGet: (data) => ajax('/ajax/supplier/product/get', data, { system: 'ironman' }),
  stockList: (data) => ajax('/ajax/stock/list', data, { system: 'ironman' }),
  stockImport: (data) => ajax('/ajax/stock/import', data, { system: 'ironman' }),
  supplierProductSearch: (data) =>
    ajax('/ajax/supplier/product/search', data, { system: 'ironman' }),
  deviceChangeValidate: (data) =>
    ajax('/ajax/ecommerce/trade/deviceChange/validate', data, { system: 'ironman' }),
  deviceChange: (data) =>
    ajax('/ajax/ecommerce/trade/deviceChange/submit', data, { system: 'ironman' }),
  deviceChangeReview: (data) =>
    ajax('/ajax/ecommerce/trade/deviceChange/review', data, { system: 'ironman' }),
  deviceChangeDetail: (data) =>
    ajax('/ajax/ecommerce/trade/deviceChange/detail', data, { system: 'ironman' }),
  sshConfig: (data) => ajax('/ajax/tool/configSsh', data, { system: 'ironman' }),
  getWan2Lan: (data) => ajax('/ajax/tool/getWan2Lan', data, { system: 'ironman' }),
  setWan2Lan: (data) => ajax('/ajax/tool/setWan2Lan', data, { system: 'ironman' }),
  stockExport: (data) => ajax('/ajax/stock/export', data, { system: 'ironman' }),
  getConnectedClients: (data) =>
    ajax('/ajax/tool/getConnectedClients', data, { system: 'ironman' }),
  configIpcWeb: (data) => ajax('/ajax/tool/configIpcWeb', data, { system: 'ironman' }),
  getIpcInfo: (data) => ajax('/ajax/tool/listIpcInfo', data, { system: 'ironman' }),
  getRtspList: (data) => ajax('/ajax/tool/listIpcRtsp', data, { system: 'ironman' }),
  mqttTopicSave: (data) => ajax('/ajax/mqtt/topic/save', data, { system: 'ironman' }),
  mqttTopicList: (data) => ajax('/ajax/mqtt/topic/list', data, { system: 'ironman' }),
  mqttTopicDetail: (data) => ajax('/ajax/mqtt/topic/detail', data, { system: 'ironman' }),
  mqttVersionList: (data) => ajax('/ajax/mqtt/version/list', data, { system: 'ironman' }),
  mqttVersionSave: (data) => ajax('/ajax/mqtt/version/save', data, { system: 'ironman' }),
  firmwareList: (data) => ajax('/ajax/firmware/list', data, { system: 'ironman' }),
  firmwareRelease: (data) => ajax('/ajax/firmware/release', data, { system: 'ironman' }),
  extendExpire: (data) => ajax('/ajax/tool/extendExpire', data, { system: 'ironman' }),
  alertRuleList: (data) => ajax('/ajax/alert/rule/list', data, { system: 'ironman' }),
  alertRuleSwitch: (data) => ajax('/ajax/alert/rule/switch', data, { system: 'ironman' }),
  alertRuleSave: (data) => ajax('/ajax/alert/rule/save', data, { system: 'ironman' }),
  alertRecordList: (data) => ajax('/ajax/alert/record/list', data, { system: 'ironman' }),
  alertHandle: (data) => ajax('/ajax/alert/handle', data, { system: 'ironman' }),
  deviceSetFollow: (data) => ajax('/ajax/device/setFollow', data, { system: 'ironman' }),
  deviceClientSetFollow: (data) => ajax('/ajax/client/setFollow', data, { system: 'ironman' }),
  deviceClientList: (data) => ajax('/ajax/client/list', data, { system: 'ironman' }),
  deviceClientDetail: (data) => ajax('/ajax/client/data/detail', data, { system: 'ironman' }),
  deviceClientData: (data) => ajax('/ajax/client/data', data, { system: 'ironman' }),
  topicIssue: (data) => ajax('/ajax/mqtt/topic/send', data, { system: 'ironman' }),
  deviceTagList: (data) => ajax('/ajax/device/tag/list', data, { system: 'ironman' }),
  deviceTagSave: (data) => ajax('/ajax/device/tag/save', data, { system: 'ironman' }),
  domainRecordStat: (data) =>
    ajax('/ajax/device/domainRecord/cpeStat', data, { system: 'ironman' }),
  domainRecordClientStat: (data) =>
    ajax('/ajax/device/domainRecord/clientStat', data, { system: 'ironman' }),
  domainRecordDetail: (data) =>
    ajax('/ajax/device/domainRecord/detail', data, { system: 'ironman' }),
  clientUsageList: (data) => ajax('/ajax/client/usage/list', data, { system: 'ironman' }),
  clientUsageDetail: (data) => ajax('/ajax/client/usage/detail', data, { system: 'ironman' }),
  overlayUpdate: (data) => ajax('/ajax/item/overlay/update', data, { system: 'ironman' }),
  overlayStatusUpdate: (data) =>
    ajax('/ajax/item/overlay/updateStatus', data, { system: 'ironman' }),
  balanceRecharge: (data) => ajax('/ajax/balance/recharge', data, { system: 'ironman' }),
  orgAssign: (data) => ajax('/ajax/org/assign', data, { system: 'ironman' }),
  threeInOneCardList: (data) => ajax('/ajax/threeInOneCard/list', data, { system: 'ironman' }),
  threeInOneCardStatistics: (data) =>
    ajax('/ajax/threeInOneCard/statistics', data, { system: 'ironman' }),
  threeInOneCardImport: (data) => ajax('/ajax/threeInOneCard/import', data, { system: 'ironman' }),
  threeInOneCardExport: (data) => ajax('/ajax/threeInOneCard/export', data, { system: 'ironman' }),
  threeInOneCardListByCardIds: (data) =>
    ajax('/ajax/threeInOneCard/listByCardIds', data, { system: 'ironman' }),
  vpnConfigList: (data) => ajax('/ajax/vpnConfig/list', data, { system: 'ironman' }),
  vpnConfigBatchInsert: (data) => ajax('/ajax/vpnConfig/insert/batch', data, { system: 'ironman' }),
  vpnConfigBatchUpdate: (data) => ajax('/ajax/vpnConfig/update/batch', data, { system: 'ironman' }),
  vpnConfigBatchDelete: (data) => ajax('/ajax/vpnConfig/delete/batch', data, { system: 'ironman' }),
  vpnConfigBatchSwitch: (data) => ajax('/ajax/vpnConfig/switch', data, { system: 'ironman' }),
  vpnServerList: (data) => ajax('/ajax/vpnServer/list', data, { system: 'ironman' }),
  vpnServerSave: (data) => ajax('/ajax/vpnServer/save', data, { system: 'ironman' }),
  vpnServerBatchDelete: (data) => ajax('/ajax/vpnServer/delete/batch', data, { system: 'ironman' }),
  ...afterSale
}
export default apis
