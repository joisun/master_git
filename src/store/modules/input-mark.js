import * as types from '../types'
import apis from '@/api/ajax'
const pageConfig = {
  pageNo: 1,
  pageSize: 20,
  totalCount: 0
}
export default {
  state: {
    pageConfig: {...pageConfig},
    list: [],
    statistic: {}
  },
  actions: {
    // 获取跟踪标记
    async [types.INPUT_MARK_SEARCH] ({commit}, hash) {
      const ret = await (apis.crm.inputMarkSearch(hash))
      commit(types.INPUT_MARK_SEARCH, ret.data)
    },
    // 保存 潜客跟踪标记
    async [types.INPUT_MARK_CUSTOMER_POST] ({commit}, hash) {
      return await apis.crm.inputMarkCustomerPost(hash)
    },
    // 新建标记名
    async [types.INPUT_MARK_POST] ({commit}, markHash) {
      return await apis.crm.inputMarkPost(markHash)
    }
  },
  getters: {},
  mutations: {
    [types.INPUT_TAG_SEARCH] (state, data) {
      state.list = data.records
      state.page = data.pagin
    },
    [types.INPUT_TAG_STATISTICS_SEARCH] (state, data) {
      state.statistic = data
    }
  }
}
