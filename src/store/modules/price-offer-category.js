import ajax from '@/api/ajax.js'

// 即将废弃 全部使用plan-classification函数
export default {
  state: {
    priceList: []
  },
  mutations: {
    setPriceList(state, priceList) {
      state.priceList = priceList
    }
  },
  actions: {
    changePriceList({ commit, state }, priceList) {
      commit('setPriceList', priceList)
    },
    async getPriceList({ commit, state }) {
      return new Promise(async(resolve, reject) => {
        let rst = await ajax.financial.plan.getClassifications()
        if (rst.success) commit('setPriceList', rst.data)
        resolve(rst.data)
      })
    }
  }
}
