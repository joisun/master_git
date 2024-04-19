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
    async [types.INPUT_TAG_SEARCH] ({commit}, hash) {
      const ret = await (apis.crm.inputTagSearch(hash))
      commit(types.INPUT_TAG_SEARCH, ret.data)
    },
    // 获取跟踪标记统计信息
    async [types.INPUT_TAG_STATISTICS_SEARCH] ({commit}, hash) {
      const ret = await apis.crm.inputTagStatisticSearch(hash)
      commit(types.INPUT_TAG_STATISTICS_SEARCH, ret.data)
    },
    // 保存 潜客跟踪标记
    async [types.INPUT_TAG_CUSTOMER_POST] ({commit}, hash) {
      return await apis.crm.inputTagPotentialPost(hash)
    },
    // 保存 注册客户跟踪标记
    async [types.INPUT_TAG_REGISTER_POST] ({commit}, hash) {
      return await apis.crm.inputTagRegisterPost(hash)
    },
    // 新建标签名
    async [types.INPUT_TAG_POST] ({commit}, tagHash) {
      return await apis.crm.inputTagPost(tagHash)
    },
    // 更新标签名
    async [types.INPUT_TAG_UPDATE] ({commit}, tagHash) {
      return await apis.crm.inputTagPut(tagHash)
    },
    // 删除标签名
    async [types.INPUT_TAG_DELETE] ({commit}, hash) {
      return await apis.crm.inputTagDelete(hash)
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
