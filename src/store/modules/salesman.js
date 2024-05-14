import * as types from '../types'
import apis from '@/api/ajax'

export default {
  state: {
    list: [],

    roles: [],

    user: {},

    pagin: {
      pageNo: 1,
      pageSize: 20,
      totalCount: 0
    }
  },
  actions: {
    async [types.SALESMAN_SEARCH] ({commit, state}, arg) {
      const finalArg = {...{pageNo: state.pagin.pageNo, pageSize: state.pagin.pageSize}, ...arg}
      const ret = await apis.crm.salesmanSearch(finalArg)
      let salesmanList = ret.data
      commit(types.SALESMAN_SEARCH, salesmanList)
    },

    async [types.SALESMAN_GET] ({commit}, arg) {
      const ret = await apis.crm.salesmanGet(arg)
      commit(types.SALESMAN_GET, ret.data)
    },

    async [types.SALESMAN_PUT] ({commit}, arg) {
      return await apis.crm.salesmanPut(arg)
    },

    async [types.SALESMAN_ROLE_SEARCH] ({commit}, arg) {
      const ret = await apis.crm.salesmanRoleSearch(arg)
      commit(types.SALESMAN_ROLE_SEARCH, ret.data.records)
    }
  },
  mutations: {
    [types.SALESMAN_SEARCH] (state, salesman) {
      state.list = salesman.records
      state.pagin = salesman.pagin
    },
    [types.SALESMAN_GET] (state, user) {
      state.user = user
    },
    [types.SALESMAN_ROLE_SEARCH] (state, roles) {
      state.roles = roles
    }
  }
}
