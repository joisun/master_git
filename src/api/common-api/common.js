import { ajax } from '../api-tool'

export default {
  getEnum: () => ajax('/ajax/enum/getAll'),
  getToolUrl: (data) => ajax('/ajax/common/url/get', data, { system: 'tool' }),
  getOfficialUrl: (data) => ajax('/ajax/common/url/get', data, { system: 'official' }),
  getBannerUrl: (data) => ajax('/ajax/common/url/get', data, { system: 'banner' }),
  getUser: () => ajax('/ajax/common/user/get'),
  getDownloadUrl: (data) => ajax('/ajax/exportRecord/getUrl', data),
  getDownloadUrlByNode: (data) => ajax('/ajax/common/file/getDownloadUrl', data),
  getExportRecordList: (data) => ajax('/ajax/exportRecord/list', data),
  deleteExportRecord: (data) => ajax('/ajax/exportRecord/delete', data),
  getOssObjectAndUpload: (data) => ajax('/ajax/common/file/getOssObjectAndUpload', data),
  ossUpload: (data) => ajax('/ajax/common/file/upload', data, {}, true),
  checkExportStatus: (data) => ajax('/ajax/exportRecord/checkStatus', data),
  desensitizationShow: (data, system = 'captain') =>
    ajax('/ajax/desensitization/show', data, { system }),
  getManageInfo: (data) => ajax('/ajax/desensitization/getManageInfo', data, { system: 'ironman' }),
  closeYddOrderCard: (data) => ajax('/ajax/cardOrder/closeYddOrder', data, { system: 'captain' }),
  closeYddOrderCpe: (data) => ajax('/ajax/yidadan/order/close', data, { system: 'ironman' }),
  getCardFirstProductionOrder: (data) =>
    ajax('/ajax/whitehouse/firstProductionOrder/card/get', data, { system: 'whitehouse'}),
  getCpeFirstProductionOrder: (data) => ajax('/ajax/whitehouse/firstProductionOrder/cpe/get', data, { system: 'whitehouse'}),
  getExtractedFont: (data) => ajax('/ajax/whitehouse/font/getFontByText', data),
  auth: {
    getMenus: (data) => ajax('/ajax/auth/getMenus', data),
    getToken: (data) => ajax('/ajax/auth/getToken', data),
    goLogin: (data) => ajax('/ajax/auth/goLogin', data),
    getAuth: (data) => ajax('/ajax/auth/getAuth', data),
    createTreeData: (data) => ajax('/ajax/auth/createTreeData', data),
  }
}
