/**
 * Created by zeter on 2017/4/13.
 */
import { ajax } from '../api-tool'

export default {
  tool: {
    // 退款工具
    refundTool(data) {
      const url = '/ajax/crm/tool/refund'
      return ajax(url, data)
    }
  },
  combine: {
    // 新增
    save(data) {
      const url = '/ajax/combination/save'
      return ajax(url, data)
    },
    // 编辑
    update(data) {
      const url = '/ajax/combination/update'
      return ajax(url, data)
    },
    // 列表
    list(data) {
      const url = '/ajax/combination/list'
      return ajax(url, data)
    }
  },
  cashin: {
    getAll(data) {
      const url = '/ajax/mailChargeBill/list'
      return ajax(url, {
        start_time: data.startTime,
        end_time: data.endTime,
        status: data.status,
        page_index: data.pageIndex,
        page_size: data.pageSize
      })
    },

    bind(id, orgid, cause) {
      const url = '/ajax/mailChargeBill/confirm'
      return ajax(url, { id: id, org_id: orgid, cause: cause })
    }
  },
  recharge: {
    list(data) {
      const url = '/ajax/offlineRecharge/list'
      return ajax(url, {
        status: data.status,
        page_index: data.pageIndex,
        page_size: data.pageSize
      })
    },
    reject(id) {
      const url = '/ajax/offlineRecharge/reject'
      return ajax(url, { id: id })
    },

    pass(id) {
      const url = '/ajax/offlineRecharge/pass'
      return ajax(url, { id: id })
    }
  },
  getsales() {
    const url = '/ajax/organization/sales/list'
    return ajax(url)
  },
  getClassification(data) {
    const url = '/ajax/priceOfferCategory/get'
    return ajax(url, data)
  },
  renew: {
    // 导出
    exportData() {
      const url = '/ajax/priceOfferCategory/export'
      return ajax(url)
    }
  },
  plan: {
    deleteRenew: (params) => {
      const url = '/ajax/priceOfferCategory/delete'
      return ajax(url, params)
    },
    getClassificationTags: () => {
      const url = '/ajax/priceOfferCategory/tags'
      return ajax(url)
    },
    getConditionsData: (params) => {
      const url = '/ajax/price/offer/custom/info/condition'
      return ajax(url, params)
    },
    getClassifications: (params) => {
      const url = '/ajax/priceOfferCategory/list'
      return ajax(url, params)
    },
    getAll(data) {
      const url = '/ajax/price/offer/list'
      return ajax(url, data)
    },
    get(data) {
      const url = '/ajax/price/offer/info'
      return ajax(url, data)
    },
    getById(data) {
      const url = '/ajax/price/offer/getById'
      return ajax(url, data)
    },
    getCustom(data) {
      const url = '/ajax/price/offer/custom/info'
      return ajax(url, data)
    },
    put(plan) {
      const url = '/ajax/price/offer/save'
      return ajax(url, plan)
    },
    exportData() {
      const url = '/ajax/price/export'
      return ajax(url)
    },
    createPlanClassification: (data) => {
      const url = '/ajax/priceOfferCategory/create'
      return ajax(url, data)
    },
    updateClassificationDisplayName: (data) => {
      const url = '/ajax/priceOfferCategory/updateDisplayName'
      return ajax(url, data)
    },
    batchChange: (data) => {
      const url = '/ajax/price/offer/bottomPrice/batchUpdate'
      return ajax(url, data)
    },
    batchChangePackageStatus(data) {
      const url = '/ajax/price/offer/status/batchUpdate'
      return ajax(url, data)
    },
    batchChangeStatus: (data) => {
      const url = '/ajax/price/sales/properties/switchStatus'
      return ajax(url, data)
    },
    modifySalesPrice: (data) => {
      const url = '/ajax/price/sales/properties/modifySalesPrice'
      return ajax(url, data)
    },
    deleteOffer: (data) => {
      const url = '/ajax/price/offer/delete'
      return ajax(url, data)
    }
  },
  // 套餐规格
  volume: {
    // 获取套餐规格列表
    getVolumeList(params) {
      const url = '/ajax/price/volume/list'
      return ajax(url, params)
    },
    exportData() {
      const url = '/ajax/price/volume/export'
      return ajax(url)
    },
    save(params) {
      const url = '/ajax/price/volume/save'
      return ajax(url, params)
    },
    delete(params) {
      const url = '/ajax/price/volume/delete'
      return ajax(url, params)
    }
  },
  // 卡功能分类
  function: {
    getFunctionList(params) {
      const url = 'ajax/price/function/list'
      return ajax(url, params)
    },
    saveFunction(params) {
      const url = 'ajax/price/function/save'
      return ajax(url, params)
    },
    deleteFunction(params) {
      const url = 'ajax/price/function/delete'
      return ajax(url, params)
    },
    exportData() {
      const url = '/ajax/price/function/export'
      return ajax(url)
    }
  },
  recordBill: {
    listSummary: (data) => {
      const url = '/ajax/monthlyVolumeBill/listSummary'
      return ajax(url, data)
    },
    get: (data) => {
      const url = '/ajax/monthlyVolumeBill/list'
      return ajax(url, data)
    },
    getSum: (data) => {
      const url = '/ajax/monthlyVolumeBill/sum'
      return ajax(url, data)
    },
    down: (data) => {
      const url = '/ajax/monthlyVolumeBill/exportDetail'
      return ajax(url, data)
    }
  },
  network: {
    savePlatformOffer(data) {
      const url = '/ajax/offer/savePlatformOffer'
      return ajax(url, data)
    },
    getPlatFormOfferList(data) {
      const url = '/ajax//offer/listPlatFormOffer'
      return ajax(url, data)
    }
  },
  getProfitRecord(data) {
    const url = '/ajax/commission/apply/list'
    return ajax(url, data)
  },
  getProfitList(data) {
    const url = '/ajax/commission/detailList'
    return ajax(url, data)
  },
  downProfitList(data) {
    const url = '/ajax/commission/detailList/export'
    return ajax(url, data)
  },
  handleApplyProfile(data) {
    const url = '/ajax/commission/apply/handle'
    return ajax(url, data)
  },
  carrierChargeRuleList(data) {
    const url = '/ajax/carrierCharge/entry/list'
    return ajax(url, data)
  },
  carrierChargeSave(data) {
    const url = '/ajax/carrierCharge/save'
    return ajax(url, data)
  },
  getChargeCarrierList(data) {
    const url = '/ajax/carrierCharge/getCarrierChargeName'
    return ajax(url, data)
  },
  getChargeDetail(data) {
    const url = '/ajax/carrierCharge/getCarrierChargeById'
    return ajax(url, data)
  },
  getChargeCarrier(data) {
    const url = '/ajax/carrierCharge/getCarrierAccountById'
    return ajax(url, data)
  },
  getChargeByCarrierId(data) {
    const url = '/ajax/carrierCharge/category/listByChargeId'
    return ajax(url, data)
  },
  getCustomerBannerList: (data) => ajax('/ajax/balance/changeRecords', data),
  exportCustomerBannerList: (data) => ajax('/ajax/balance/exportRecord', data),
  getRechargePriceCost: (data) => ajax('/ajax/salesCommissionTool/rechargePriceCost/query', data),
  exportRechargePriceCost: (data) =>
    ajax('/ajax/salesCommissionTool/rechargePriceCost/export', data)
}
