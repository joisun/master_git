import {ajax} from '../api-tool'

export default {
  async index(data) {
    const url = '/ajax/singleCard/index'
    return ajax(url, data)
  },
  async list(data) {
    const url = '/ajax/singleCard/card/list'
    return ajax(url, data)
  },
  async exportCardList(data) {
    const url = '/ajax/singleCard/card/export'
    return ajax(url, data)
  },
  async supplierStatistic(data) {
    const url = '/ajax/singleCard/statistic/supplier'
    return ajax(url, data)
  },
  async customerStatistic(data) {
    const url = '/ajax/singleCard/statistic/customer'
    return ajax(url, data)
  },
  async historyStatistic(data) {
    const url = '/ajax/singleCard/statistic/history'
    return ajax(url, data)
  }
}
