export default {
  state: {
    cardTools: true
  },
  mutations: {
    setCardTools(state, cardTools) {
      state.cardTools = cardTools
    }
  },
  actions: {
    changeCardTools({ commit, state }) {
      commit('setCardTools', !state.cardTools)
    }
  }
}
