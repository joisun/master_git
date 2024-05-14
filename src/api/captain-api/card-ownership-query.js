import { ajax } from '../api-tool'

export default {
  async getList(data) {
    const url = '/ajax/deviceQuery/batchQueryDeviceInfo'
    return ajax(url, data)
  },
  async export(data) {
    const url = '/ajax/deviceQuery/exportBatchQueryDeviceInfo'
    return ajax(url, data)
  }
}
