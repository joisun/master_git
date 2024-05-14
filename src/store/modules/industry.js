import * as types from '../types'
import apis from '@/api/ajax'
import Vue from 'vue'
import Industry from '@/constant/enums/industry-enum'
import { structure } from '@/global/function/loop-list-util'
import { Message } from 'element-ui'

export default {
  state: {
    list: []
  },
  actions: {
    async [types.CRM_INDUSTRY] ({commit}) {
        let {data, success} = await apis.crm.industryList()
        if (!success) return false
        Industry.setIndustries(data)
        commit(types.CRM_INDUSTRY, Industry.industries)
    }
  },
  getters: {

  },
  mutations: {
    [types.CRM_INDUSTRY] (state, industries) {
      state.list = structure(industries)
    }
  }
}
