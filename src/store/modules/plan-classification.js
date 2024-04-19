import ajax from '@/api/ajax'
import cachify from '../cachify'

export default {
  state: {
    planClassificationList: []
  },
  getters: {
    getClassificationList: (state) => (carrier, showDisabled = null) => {
      let classificationList = state.planClassificationList
      if (showDisabled === false) {
        classificationList = classificationList.filter(item => !item.disabled)
      }
      if (!carrier) return classificationList
      return classificationList.filter(e => e.carrier === carrier)
    }
  },
  mutations: {
    setClassificationList(state, data) {
      state.planClassificationList = null
      state.planClassificationList = data
    }
  },
  actions: {
    async changeClassificationList({ commit, state }, { force } = {}) {
      return new Promise(async(resolve, reject) => {
        let rst = await cachify(ajax.financial.plan.getClassifications, {
          force,
          data: state.planClassificationList
        })()
        if (!rst.success) reject(null)
        commit('setClassificationList', rst.data)
        resolve(rst.data)
      })
    }
  }
}
