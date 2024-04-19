/**
 * Created by zeter on 2017/6/15.
 */
let valueMap = {
  'STANDARD': '前向按月套餐',
  'CUSTOM': '前向自定义套餐',
  'PRE_POOL': '前向流量池套餐',
  'POOL': '后向流量池套餐'
}
const planTypeMap = {
  getValue: () => {
    return valueMap
  },
  /**
   * 反向匹配
   * @param {String}item 传入需要匹配的中文
   * @returns
   */
  reverseValue: (item) => {
    let newObject = {}
    // eslint-disable-next-line no-unused-vars
    for (let key of Object.keys(valueMap)) {
      newObject[valueMap[key]] = key
    }
    return newObject
  },
  getMarry: (item) => {
    return valueMap[item.toLocaleUpperCase()]
  },
  beTemplate: () => {
    let newArray = []
    // eslint-disable-next-line no-unused-vars
    for (let key of Object.keys(valueMap)) {
      newArray.push({ name: valueMap[key], value: key })
    }
    return newArray
  }
}
export default planTypeMap
