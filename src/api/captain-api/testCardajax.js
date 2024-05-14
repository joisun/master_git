import { ajax } from '../api-tool'

export default {
  async getUserList(data) {
    const url = '/ajax/testCard/userList'
    return ajax(url, data)
  },
  async getHistory(data) {
    const url = '/ajax/testCard/getHistory'
    return ajax(url, data)
  },
  async lendCard(data) {
    const url = '/ajax/testCard/lendCard'
    return ajax(url, data)
  },
  async returnCard(data) {
    const url = '/ajax/testCard/returnCard'
    return ajax(url, data)
  },
  async getTags() {
    const url = '/ajax/testCard/tags'
    return ajax(url)
  },
  async getCardList(data) {
    const url = '/ajax/testCard/list'
    return ajax(url, data)
  },
  async addTestCard(data) {
    const url = '/ajax/testCard/save'
    return ajax(url, data)
  },
  async updateTestCard(data) {
    const url = '/ajax/testCard/update'
    return ajax(url, data)
  },
  async apply(data) {
    const url = '/ajax/testCard/apply'
    return ajax(url, data)
  },
  async cancel(data) {
    const url = '/ajax/testCard/cancel'
    return ajax(url, data)
  },
  async delete(data) {
    const url = '/ajax/testCard/delete'
    return ajax(url, data)
  }
}
