import ajax from '@/api/ajax'
import cachify from '../cachify'

export default {
  state: {
    unicomAccountList: [],
    cmccAccountList: [],
    chinanetAccountList: []
  },
  getters: {
    carrierAccountList: (state) => (carrier) => {
      if (carrier) return state[`${carrier}AccountList`]
      return [...state.unicomAccountList, ...state.cmccAccountList, ...state.chinanetAccountList]
    }
  },
  mutations: {
    setAccountList(state, data) {
      state[`${data.carrier}AccountList`] = data.value.map(e => {
        e.carrier = data.carrier
        return e
      })
    }
  },
  actions: {
    async changeAccountList({ commit, state }, { carrier, force } = {}) {
      return new Promise(async(resolve, reject) => {
        if (!carrier) {
          const unicomPromise = cachify(ajax.card.broker.get, {
            force,
            data: state.unicomAccountList
          })('unicom')
          const cmccPromise = cachify(ajax.card.broker.get, {
            force,
            data: state.cmccAccountList
          })('cmcc')
          const chinanetPromise = cachify(ajax.card.broker.get, {
            force,
            data: state.chinanetAccountList
          })('chinanet')

          Promise.all([unicomPromise, cmccPromise, chinanetPromise]).then((resultList) => {
            let chinanetRst = resultList[2]
            let cmccRst = resultList[1]
            let unicomRst = resultList[0]
            if (chinanetRst.success) commit('setAccountList', { carrier: 'chinanet', value: chinanetRst.data })
            if (cmccRst.success) commit('setAccountList', { carrier: 'cmcc', value: cmccRst.data })
            if (unicomRst.success) commit('setAccountList', { carrier: 'unicom', value: unicomRst.data })
            resolve(true)
          })
        } else {
          let rst = await cachify(ajax.card.broker.get, {
            force,
            data: state[`${carrier.toLowerCase()}AccountList`]
          })(carrier)
          if (!rst.success) {
            reject(null)
          }
          commit('setAccountList', { carrier: carrier, value: rst.data })
          resolve(true)
        }
      })
    }
  }
}
