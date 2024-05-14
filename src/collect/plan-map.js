/**
 * Created by zeter on 2017/6/15.
 */
let valueMap = {
  monthly: '按月',
  custom: '自定义',
  package: '加油包',
  'pool-package': '流量池叠加包',
  'overflow-package': '超额流量包'
}
const planTypeMap = {
  getValue: () => valueMap,
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
  getMarry: (item) => valueMap[item],
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
