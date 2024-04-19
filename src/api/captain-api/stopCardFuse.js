import { ajax } from '../api-tool'

export default {
  async deactivedCardFuseCarrier(data) {
    const url = '/ajax/deactivedCardFuse/statistics/carrier'
    return ajax(url, data)
  },
  async deactivedCardFuseReason(data) {
    const url = '/ajax/deactivedCardFuse/statistics/changeReason'
    return ajax(url, data)
  },
  async deactivedCardFuseCustomer(data) {
    const url = '/ajax/deactivedCardFuse/statistics/customer'
    return ajax(url, data)
  },
  async deactivedCardFuseDetails(data) {
    const url = '/ajax/deactivedCardFuse/statistics/details'
    return ajax(url, data)
  },
  async updateDeactivedCardFuse(data) {
    const url = `/ajax/deactivedCardFuse/update`
    return ajax(url, data)
  },
  async deactivedCardFuseStatus(type) {
    const url = `/ajax/deactivedCardFuse/status`
    return ajax(url, { type })
  },
  async listFuseStatus() {
    const url = `/ajax/fuse/listFuseStatus`
    return ajax(url)
  },
  async fuse(data) {
    const url = `/ajax/fuse/fuse`
    return ajax(url, data)
  }
}
