import ajax from '@/api/ajax'
import cachify from '../cachify'

export default {
  state: {
    ratePlanList: []
  },
  mutations: {
    setRatePlanList(state, array) {
      state.ratePlanList = array
    }
  },
  actions: {
    async getRatePlanList({ commit, state }, { force } = {}) {
      return new Promise(async(resolve) => {
        let rst = await cachify(ajax.store.listRatePlan, {
          force,
          data: { list: state.ratePlanList }
        })()
        if (rst.success) commit('setRatePlanList', rst.data.list)
        resolve(rst.data.list)
      })
    }
  }
}
