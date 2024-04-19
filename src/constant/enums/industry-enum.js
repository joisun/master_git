/**
 * @description 枚举转换器
 *
 */
import { cloneDeep } from 'lodash'
// 枚举类
class Industries {
  constructor() {
    this.platform = 'simboss-crm'
    this._id = `industries__${+new Date()}`
  }
  checkEnums() {
    if (this.industries) {
      return true
    }
    return false
  }
  setIndustries(list) {
    Object.defineProperty(this, 'industries', {
      enumerable: true,
      configurable: true,
      writable: false,
      value: cloneDeep(list)
    })
    return this
  }
  get() {
    return this.industries
  }
  convert(value) {
    let t = this.industries
    value = value + ''
    if (!value || value.length === 0) return undefined
    let item = t.find(i => i.id + '' === value)
    return item ? item.name : ''
  }
}
let inst = null
export default (inst || (inst = new Industries()))
