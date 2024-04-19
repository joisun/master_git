// 材质枚举
const objToArray = (obj) => {
  return Object.keys(obj).map((key) => {
    return {
      label: obj[key],
      value: key
    }
  })
}
export const MATERIAL_EMUN = {
  CONSUMER_PLUG: '消费级插拔卡',
  INDUSTRIAL_PLUG: '工业级插拔卡',
  INDUSTRIAL_PASTER: '工业级贴片卡',
  CONSUMER_PASTER: '消费级贴片卡',
  OTHERS: '其他'
}
// 规格枚举
export const SPEC_EMNU = {
  STANDARD: '标准卡',
  MICRO: 'Micro卡',
  NANO: 'Nano卡',
  MS_5X6: '5*6MM贴片卡',
  MS_2X2: '2*2MM贴片卡',
  OTHERS: '其他'
}

export const CONTROL_EMUN = {
  VOLUME_LIMIT: '限额',
  REGIONAL_RESTRICTIONS: '区域限制',
  EXT_WHITE_LIST: '公网白名单',
  VPDN: '定向',
  NONE: '都不加'
}

export const STATUS_EMUN = {
  0: '供应链确认中',
  1: '满足',
  2: '部分核销',
  3: '全部核销',
  4: '释放',
  5: '无法满足'
}

export const NET_TYPE_EMUN = {
  '4G': '4G',
  NB: 'NB',
  '5G': '5G',
  '2/3/4G': '2/3/4G'
}
export const underwritingWillEmun = {
  will: '愿意包销',
  unWill: '不愿意包销',
  donotwill: '把握度高，但不想报销'
}

export const MATERIAL_EMUN_LIST = objToArray(MATERIAL_EMUN)
export const SPEC_EMNU_LIST = objToArray(SPEC_EMNU)
export const CONTROL_EMUN_LIST = objToArray(CONTROL_EMUN)
export const STATUS_EMUN_List = objToArray(STATUS_EMUN)

export const NET_TYPE_EMUN_LIST = objToArray(NET_TYPE_EMUN)
