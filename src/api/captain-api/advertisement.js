/**
 * Created by zeter on 2017/4/13.
 */

import { ajax } from '../api-tool'

export default {
  list(data) {
    const url = '/ajax/campaign/link/list'
    return ajax(url, data)
  },
  add(data) {
    const url = '/ajax/campaign/link/add'
    return ajax(url, data)
  },
  batchAdd(data) {
    const url = '/ajax/campaign/link/batchAdd'
    return ajax(url, data)
  },
  updata(data) {
    const url = '/ajax/campaign/link/updateKeyId'
    return ajax(url, data)
  },
  costImport(data) {
    const url = '/ajax/campaign/cost/import'
    return ajax(url, data)
  },
  costExport(data) {
    const url = '/ajax/campaign/cost/export'
    return ajax(url, data)
  },
  export(data) {
    const url = '/ajax/campaign/link/export'
    return ajax(url, data)
  },
  user: {
    list(data) {
      const url = '/ajax/campaign/result/list'
      return ajax(url, data)
    },
    export(data) {
      const url = '/ajax/campaign/result/export'
      return ajax(url, data)
    }
  }
}
