import * as types from '../types'
import apis from '@/api/ajax'

export default {
  state: {
    list: []
  },
  actions: {
    async [types.DUPLICATE_CHECK] ({commit}, keyword) {
      const ret = await apis.crm.customerDuplicateCheckSearch({keyword})
      commit(types.DUPLICATE_CHECK, ret.data)
    }
  },
  getters: {

  },
  mutations: {
    [types.DUPLICATE_CHECK] (state, data) {
      state.list = data.records
    }
  }
}
