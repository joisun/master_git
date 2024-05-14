/**
 * Created by zeter on 2017/6/15.
 */
let valueMap = {
  STANDARD: '标准卡',
  MICRO: 'MICRO卡',
  NANO: 'NANO卡',
  MS_2X2: '贴片卡2*2',
  MS_5X5: '贴片卡5*5',
  MS_5X6: '贴片卡5*6'
}
const materialMap = {
  'PLASTIC': '塑料插拔卡',
  'CERAMICS': '陶瓷插拔卡',
  'PASTER': '陶瓷贴片卡',
  'PLASTIC_PASTER': '塑料贴片卡',
  'EPOXY': '环氧树脂',
  'VEHICLE': '车规级'
}
export default {
  getValue: (value = 'specification') => (value === 'material' ? materialMap : valueMap),
  reverseValue: () => {
    let newObject = {}
    // eslint-disable-next-line no-unused-vars
    for (let key of Object.keys(valueMap)) {
      newObject[valueMap[key]] = key
    }
    return newObject
  },
  getMarry: (item, value = 'specification') => {
    let keysObj = value === 'material' ? materialMap : valueMap
    let setMapValue = ''
    // eslint-disable-next-line no-unused-vars
    for (let key of Object.keys(keysObj)) {
      if (item === key || item === keysObj[key]) {
        setMapValue = keysObj[key]
        break
      }
    }
    return setMapValue
  },
  getDoubleMarry: (specificationName, materialName) => materialMap.specificationName + valueMap.materialName,
  beTemplate: (value = 'specification') => {
    let keysObj = value === 'material' ? materialMap : valueMap
    let newArray = []
    // eslint-disable-next-line no-unused-vars
    for (let key of Object.keys(keysObj)) {
      newArray.push({ name: keysObj[key], value: key })
    }
    return newArray
  }
}
