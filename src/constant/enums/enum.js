// captain的枚举逻辑

const hasOwnProperty = Object.prototype.hasOwnProperty

export default class Enum {
  constructor(object = {}) {
    let data = {}
    // eslint-disable-next-line no-unused-vars
    for (let key in object) {
      if (hasOwnProperty.call(object, key)) {
        data[key] = object[key]
      }
    }
    this.data = data
  }

  maps() {
    return this.data
  }

  entries() {
    return Object.entries(this.data)
  }

  keys() {
    return Object.keys(this.data)
  }

  values() {
    return Object.values(this.data)
  }

  /**
     * 反转key, value
     * @return Enum
     */
  invert() {
    let dstData = {}
    let srcData = this.data
    // eslint-disable-next-line no-unused-vars
    for (let key in srcData) {
      dstData[srcData[key]] = key
    }
    return new Enum(dstData)
  }

  get(key, caseSensitive = true) {
    let data = this.data
    if (caseSensitive) {
      return data[key]
    }
    // eslint-disable-next-line no-unused-vars
    for (let k in data) {
      if (String(k).toLowerCase() === String(key).toLowerCase()) {
        return data[k]
      }
    }
  }

  has(key, caseSensitive = true) {
    let data = this.data
    if (caseSensitive) {
      return key in data
    }
    // eslint-disable-next-line no-unused-vars
    for (let k in data) {
      if (String(k).toLowerCase() === String(key).toLowerCase()) {
        return true
      }
    }
    return false
  }

  /**
     * @param {Function} predicate 过滤条件
     * @return Enum
     */
  filter(predicate) {
    let dstData = {}
    let srcData = this.data
    // eslint-disable-next-line no-unused-vars
    for (let key in srcData) {
      if (predicate(key)) {
        dstData[key] = srcData[key]
      }
    }
    return new Enum(dstData)
  }

  /**
     * 排除keys
     * @param  {...String}
     * @return Enum
     */
  excludes(...keys) {
    return this.filter(key => keys.indexOf(key) === -1)
  }

  /**
     * 包含keys
     * @param  {...String}
     * @return Enum
     */
  includes(...keys) {
    return this.filter(key => keys.indexOf(key) !== -1)
  }
}
