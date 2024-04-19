import ajax from '@/api/ajax'
import cachify from '../cachify'

export default {
  state: {
    salesList: []
  },
  mutations: {
    setSales(state, data) {
      state.salesList = data
    }
  },
  actions: {
    async getSales({ commit, state }, { force } = {}) {
      return new Promise(async(resolve) => {
        let rst = await cachify(ajax.customer.sell.sellerList, {
          force,
          data: state.salesList
        })()
        if (rst.success) commit('setSales', rst.data)
        resolve(rst.data)
      })
    }
  }
}
