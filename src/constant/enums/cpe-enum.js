/**
 * @description 枚举转换器
 *
 */
import { cloneDeep } from 'lodash'
// 枚举类
class Enumerator {
  constructor() {
    this.platform = 'simboss-cpe'
    this._id = `enumerator__${+new Date()}`
  }
  checkEnums() {
    return !!this.enums
  }
  setEnums(enums) {
    Object.defineProperty(this, 'enums', {
      enumerable: true,
      configurable: true,
      writable: false,
      value: cloneDeep(enums)
    })
    return this
  }
  get(category) {
    if (!category) return {}
    return this.enums[category]
  }
  convert(category, value) {
    if (!this.enums) {
      return ''
    }
    let t = this.enums[category]
    let ret = ''
    if (typeof value === 'number') value = value + ''
    if (!value || value.length === 0) return undefined
    if (!t) return undefined
    if (Array.isArray(t) && !Array.isArray(value)) {
      let item = t.find(i => i.id + '' === value)
      ret = item.name
    } else {
      ret = t[value]
    }
    return ret
  }
}
let inst = null
export default (inst || (inst = new Enumerator()))
