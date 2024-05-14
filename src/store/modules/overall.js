/**
 * Created by zeter on 2017/4/6.
 */
import ajax from '@/api/ajax'
import Enumerator from '@/constant/enums/crm-enum'
import CpeEnumerator from '@/constant/enums/cpe-enum'
import * as types from '../types'
import { structure } from '@/global/function/loop-list-util'

export default {
  state: {
    officialHost: '',
    toolHost: '',
    bannerHost: '',
    enum: {},
    crmEnum: {
      stage: [],
      cluesStage: [],
      advanceStage: [],
      serverStage: [],
      source: [],
      competitor: [],
      settle: [],
      customerStage: [],
      followStyle: [],
      smallRegion: [],
      useMeal: [],
      discardReason: [],
      currentSuppliers: [],
      payMethod: [],
      salesGroup: [],
      types: [],
      sendStatus: [] // 月结账单发送状态
    },
    cpeEnum: {},
    user: {}
  },
  getters: {
    getEnum: (state) => (name) => {
      if (name) return state.enum[name]
      return state.enum
    }
  },
  mutations: {
    [types.CRM_ENUM](state, enums) {
      let hash = {}
      Object.keys(enums).forEach(key => {
        if (Array.isArray(enums[key])) {
          if (key === 'discardReason' || key === 'useMeal') {
            hash[key] = structure(enums[key])
          } else {
            hash[key] = enums[key]
          }
        } else {
          // 将格式进行改变为id, name格式，非数组的
          hash[key] = Object.keys(enums[key]).map(_k => {
            return {
              id: _k,
              name: enums[key][_k]
            }
          })
        }
      })
      state.crmEnum = hash
    },
    [types.CPE_ENUM](state, enums) {
      let hash = {}
      Object.keys(enums).forEach(key => {
        if (Array.isArray(enums[key])) {
          if (key === 'discardReason' || key === 'useMeal') {
            hash[key] = structure(enums[key])
          } else {
            hash[key] = enums[key]
          }
        } else {
          // 将格式进行改变为id, name格式，非数组的
          hash[key] = Object.keys(enums[key]).map(_k => {
            return {
              id: _k,
              name: enums[key][_k]
            }
          })
        }
      })
      state.cpeEnum = hash
    },
    setUrl(state, value) {
      state.officialHost = value.official
      state.toolHost = value.tool
      state.bannerHost = value.banner
    },
    setEnum(state, content) {
      state.enum = { ...content }
    },
    setUser(state, content) {
      state.user = { ...content }
    }
  },
  actions: {
    async [types.CRM_ENUM]({ commit }) {
      commit(types.CRM_ENUM, Enumerator.enums)
    },
    async [types.CPE_ENUM]({ commit }) {
      commit(types.CPE_ENUM, CpeEnumerator.enums)
    },
    async loadUser({ commit }) {
      let rst = await ajax.common.getUser()
      if (!rst.success) return false
      commit('setUser', rst.data)
      return rst.data
    },
    async getUrl({ commit }) {
      let toolAJax = ajax.common.getToolUrl()
      let officialAjax = await ajax.common.getOfficialUrl()
      let [rst, rsp] = await Promise.all([toolAJax, officialAjax])
      commit('setUrl', { tool: rst.data, official: rsp.data })
      return rst.data
    }
  }
}
