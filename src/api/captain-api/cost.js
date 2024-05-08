import {ajax} from '../api-tool'

export default {
  account: {
    getCarrierConfigItem(data) {
      const url = '/ajax/costingEvaluate/getCarrierConfigItems'
      return ajax(url, { ...data })
    },
    getNewCarrierConfig(data) {
      const url = '/ajax/costingEvaluate/getNewCarrierConfig'
      return ajax(url, { ...data })
    },
    saveNewCarrierConfig(data) {
      const url = '/ajax/costingEvaluate/saveNewCarrierConfig'
      return ajax(url, { ...data })
    }
  },
  month: {
    get(data) {
      const url = '/ajax/carrierBill/getBill'
      return ajax(url, { ...data })
    },
    save(data) {
      const url = '/ajax/carrierBill/saveBill'
      return ajax(url, { ...data })
    }
  },
  plan: {
    run(data) {
      const url = '/ajax/carrierRatePlan/optimize'
      return ajax(url, { ...data })
    },
    get(data) {
      const url = '/ajax/carrierRatePlan/queryByAccount'
      return ajax(url, { ...data })
    },
    save(data) {
      const url = '/ajax/carrierRatePlan/batchSave'
      return ajax(url, { ...data })
    }
  },
  statistic: {
    getTotal(data) {
      const url = '/ajax/costStatistic/getTotal'
      return ajax(url, data)
    },
    getHistory(data) {
      const url = '/ajax/costStatistic/getHistory'
      return ajax(url, data)
    }
  }
}
