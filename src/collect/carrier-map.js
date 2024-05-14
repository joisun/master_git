/**
 * Created by zeter on 2017/6/15.
 */
let valueMap = {
  cmcc: '移动',
  unicom: '联通',
  chinanet: '电信'
}
let valueForNumber = {
  1: 'cmcc',
  0: 'unicom',
  2: 'chinanet'
}
const carrierMap = {
  getValue: () => valueMap,
  getNumberMap: () => valueForNumber,
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
  /**
   * 传入数字或者字母匹配中文
   * @param {Number,String} item 你需要匹配的字段
   * @returns {String}
   */
  getMarry: (item) => {
    if (typeof item === 'number') {
      return valueMap[valueForNumber[item]]
    }
    return valueMap[item]
  },
  beTemplate: (prefix = true) => {
    let newArray = []
    // eslint-disable-next-line no-unused-vars
    for (let key of Object.keys(valueMap)) {
      newArray.push({ name: prefix ? `中国${valueMap[key]}` : valueMap[key], value: key })
    }
    return newArray
  }
}
export default carrierMap
