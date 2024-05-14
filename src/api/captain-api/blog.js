import {ajax} from '../api-tool'
export default {
  async queryList(data) {
    const url = '/ajax/blog/article/query'
    return ajax(url, data)
  },
  async queryType(data) {
    const url = '/ajax/blog/type/query'
    return ajax(url, data)
  },
  async saveCategory(data) {
    const url = '/ajax/blog/category/save'
    return ajax(url, data)
  },
  async deleteCategory(data) {
    const url = '/ajax/blog/category/delete'
    return ajax(url, data)
  },
  async queryCategory(data) {
    const url = '/ajax/blog/category/query'
    return ajax(url, data)
  },
  async saveArticle(data) {
    const url = '/ajax/blog/article/save'
    return ajax(url, data)
  },
  async deleteArticle(data) {
    const url = '/ajax/blog/article/delete'
    return ajax(url, data)
  },
}