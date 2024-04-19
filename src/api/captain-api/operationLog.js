import { ajax } from '../api-tool'

export default {
  async userOperationLogList(data) {
    const url = '/ajax/userOperationLog/list'
    return ajax(url, data)
  },
  async listOperationType(data) {
    const url = '/ajax/userOperationLog/listOperationType'
    return ajax(url, data)
  },
  async exportIccids(data) {
    const url = '/ajax/userOperationLog/exportIccids'
    return ajax(url, data)
  }
}
