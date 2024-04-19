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

import { ajax } from '../api-tool'

const apis = {
  enumSearch: (data) => ajax('/ajax/enum/search', data, { system: 'crm' }),
  userSearch: (data) => ajax('/ajax/user/search', data, { system: 'crm' }),
  salesmanSearch: (data) => ajax('/ajax/salesman/search', data, { system: 'crm' }),
  salesmanGet: (data) => ajax('/ajax/salesman/get', data, { system: 'crm' }),
  salesmanPut: (data) => ajax('/ajax/salesman/put', data, { system: 'crm' }),
  salesmanRoleSearch: (data) => ajax('/ajax/salesman/role/search', data, { system: 'crm' }),
  industryList: (data) => ajax('/ajax/industry/list', data, { system: 'crm' }),
  customerSearch: (data) => ajax('/ajax/customer/search', data, { system: 'crm' }),
  customerSpecialFocusPut: (data) =>
    ajax('/ajax/customer/specialFocus/put', data, { system: 'crm' }),
  customerPost: (data) => ajax('/ajax/customer/post', data, { system: 'crm' }),
  customerPut: (data) => ajax('/ajax/customer/put', data, { system: 'crm' }),
  customerDelete: (data) => ajax('/ajax/customer/delete', data, { system: 'crm' }),
  customerGet: (data) => ajax('/ajax/customer/get', data, { system: 'crm' }),
  customerContactSearch: (data) => ajax('/ajax/customer/contact/search', data, { system: 'crm' }),
  customerContactPost: (data) => ajax('/ajax/customer/contact/post', data, { system: 'crm' }),
  customerContactPut: (data) => ajax('/ajax/customer/contact/put', data, { system: 'crm' }),
  customerFollowSearch: (data) => ajax('/ajax/customer/follow/search', data, { system: 'crm' }),
  customerFollowPost: (data) => ajax('/ajax/customer/follow/post', data, { system: 'crm' }),
  customerFollowPut: (data) => ajax('/ajax/customer/follow/put', data, { system: 'crm' }),
  customerAbandonPut: (data) => ajax('/ajax/customer/abandon/put', data, { system: 'crm' }),
  customerTransferPut: (data) => ajax('/ajax/customer/transfer/put', data, { system: 'crm' }),
  customerSalesConfirmPut: (data) =>
    ajax('/ajax/customer/salesConfirm/put', data, { system: 'crm' }),
  customerDuplicateCheckSearch: (data) =>
    ajax('/ajax/customer/duplicateCheck/search', data, { system: 'crm' }),
  customerDuplicateCheckSearchBatch: (data) =>
    ajax('/ajax/customer/duplicateCheck/search/batch', data, { system: 'crm' }),
  customerDuplicateSearchPage: (data) =>
    ajax('/ajax/customer/duplicateCheck/search/page', data, { system: 'crm' }),
  customerDuplicateGetUrl: (data) =>
    ajax('/ajax/customer/duplicateCheck/search/getUrl', data, { system: 'crm' }),
  customerAuditPut: (data) => ajax('/ajax/customer/audit/put', data, { system: 'crm' }),
  customerAutoSend: (data) => ajax('/ajax/customer/autoSend', data, { system: 'crm' }),
  customerSearchAll: (data) => ajax('/ajax/customer/searchAll', data, { system: 'crm' }),
  customerAutoMatch: (data) => ajax('/ajax/customer/autoMatch', data, { system: 'crm' }),
  customerFailurePut: (data) => ajax('/ajax/customer/failure/put', data, { system: 'crm' }),
  customerMerge: (data) => ajax('/ajax/customer/merge', data, { system: 'crm' }),
  customerFailureReset: (data) => ajax('/ajax/customer/failure/reset', data, { system: 'crm' }),
  customerCluesSearch: (data) => ajax('/ajax/customerClues/search', data, { system: 'crm' }),
  clueUpload: (data) => ajax('/ajax/customer/clue/upload', data, { system: 'crm' }),
  businessOppUpload: (data) => ajax('/ajax/customer/businessOpp/upload', data, { system: 'crm' }),
  inputTagSearch: (data) => ajax('/ajax/inputTag/search', data, { system: 'crm' }),
  inputTagPut: (data) => ajax('/ajax/inputTag/put', data, { system: 'crm' }),
  inputTagPost: (data) => ajax('/ajax/inputTag/post', data, { system: 'crm' }),
  inputTagDelete: (data) => ajax('/ajax/inputTag/delete', data, { system: 'crm' }),
  inputTagPotentialPost: (data) => ajax('/ajax/inputTag/potential/post', data, { system: 'crm' }),
  inputTagRegisterPost: (data) => ajax('/ajax/inputTag/register/post', data, { system: 'crm' }),
  inputTagStatisticSearch: (data) =>
    ajax('/ajax/inputTag/statistics/search', data, { system: 'crm' }),
  followRecordGet: (data) => ajax('/ajax/customer/follow/getByDate', data, { system: 'crm' }),
  followRecordExport: (data) => ajax('/ajax/customer/follow/exportByDate', data, { system: 'crm' }),
  getSubordinates: (data) => ajax('/ajax/seller/getSubordinates', data, { system: 'crm' }),
  importRank: (data) => ajax('/ajax/customer/importRank', data, { system: 'crm' }),
  inputMarkSearch: (data) => ajax('/ajax/customer/remark/search', data, { system: 'crm' }),
  inputMarkPost: (data) => ajax('/ajax/customer/remark/insert', data, { system: 'crm' }),
  inputMarkCustomerPost: (data) => ajax('/ajax/customer/remark/add', data, { system: 'crm' }),
  usageScenarioListGet: (data) => ajax('/ajax/usageScenario/list', data, { system: 'crm' }),
  missionCreatePost: (data) => ajax('/ajax/mission/create', data, { system: 'crm' }),
  customerExport: (data) => ajax('/ajax/customer/export', data, { system: 'crm' }),
  missionListGet: (data) => ajax('/ajax/mission/list', data, { system: 'crm' }),
  missionDetailGet: (data) => ajax('/ajax/mission/getById', data, { system: 'crm' }),
  missionUpdatePost: (data) => ajax('/ajax/mission/update', data, { system: 'crm' }),
  missionRecordGet: (data) => ajax('/ajax/mission/getByDate', data, { system: 'crm' }),
  missionRecordUpdatePost: (data) => ajax('/ajax/mission/do', data, { system: 'crm' }),
  customerMissionListGet: (data) => ajax('/ajax/mission/getByCustomId', data, { system: 'crm' }),
  getSearchSellerList: (data) => ajax('/ajax/seller/getSearchList', data, { system: 'crm' }),
  customerReportBaseInfo: (data) => ajax('/ajax/report/customer/baseInfo', data, { system: 'crm' }),
  customerReportSalePerformance: (data) =>
    ajax('/ajax/report/sale/performance', data, { system: 'crm' }),
  customerReportBuyCardMoney: (data) =>
    ajax('/ajax/report/industry/buyCardMoney', data, { system: 'crm' }),
  customerReportBuyCardCount: (data) =>
    ajax('/ajax/report/industry/buyCardCount', data, { system: 'crm' }),
  customerReportPriceOfferRank: (data) =>
    ajax('/ajax/report/priceOffer/buyCardMoney', data, { system: 'crm' }),
  customerReportAverageDaily: (data) =>
    ajax('/ajax/report/customer/averageDaily', data, { system: 'crm' }),
  orderSettingSearch: (data) => ajax('/ajax/report/getNewcomerStats', data, { system: 'crm' }),
  orderSettingGet: (data) => ajax('/ajax/autoTransfer/get', data, { system: 'crm' }),
  orderSettingSet: (data) => ajax('/ajax/autoTransfer/set', data, { system: 'crm' }),
  orderSettingSellerGetAll: (data) => ajax('/ajax/seller/getAll', data, { system: 'crm' }),
  orderSettingGetProvinces: (data) =>
    ajax('/ajax/autoTransfer/getProvinces', data, { system: 'crm' }),
  performanceRank: (data) => ajax('/ajax/report/sale/performance/rank', data, { system: 'crm' })
}
export default apis
