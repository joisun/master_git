export default {
  /**
   * 获取查询参数
   * @param name
   * @returns {*}
   */
  getQueryString(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) return decodeURIComponent(r[2]); return null
  },
  /**
   * 解析参数
   * @param url
   * @returns {{}}
   */
  parseQueryString(url) {
    let arr
    let res = {}
    arr = url.split('?')
    arr.shift()
    let queryStr = arr.join('?')
    if (queryStr.trim().length === 0) return res
    arr = queryStr.split('&')
    arr.map((e) => {
      let itemArr = e.split('=')
      let name = itemArr.shift()
      let value = itemArr.join('=')
      res[name] = value
    })
    return res
  },
  /**
   * 为url添加查询参数
   * @param url
   * @param StringObject
   * @returns {string}
   */
  addQueryString(url, StringObject = {}) {
    let str = ''
    if (StringObject !== null) {
      // eslint-disable-next-line no-unused-vars
      for (let i in StringObject) {
        str += `${i}=${StringObject[i]}&`
      }
      str = str.substr(0, str.length - 1)
      str = `?${str}`
    }
    return `${url}${str}`
  },
  /**
   * 去除所有查询参数
   * @param url
   */
  funcUrlDel(url) {
    return url.split('?')[0]
  }
}
