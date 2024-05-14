/**
 * iccid转化 将各种各样有,或者空白的iccid序列转化成需要的格式
 * 传入type若为array则转化为数组，若为其他则插入对应字符串
 * @param val
 * @param type
 */
export const iccidsTransfer = (val, type = 'array') => {
  let sliceArray = [
    { name: 'comma', string: '\uff0c', mode: /\uff0c/g },
    { name: 'separated', string: ',', mode: /,/g },
    { name: 'space', string: ' ', mode: /\s/g },
    { name: 'Wrap', string: '\n', mode: /\n/g }
  ]
  let string = val.trim()
  sliceArray.forEach(e => {
    string = string.replace(e.mode, ',')
  })
  let ar = string.replace(/,+/g, ',').split(',')
  if (type === 'array') return ar
  return ar.join(type)
}

/**
 * 获取不包含校验位的iccid
 * @param iccid
 * @returns {*}
 */
export function getRightIccid(iccid) {
  if (typeof iccid !== 'string' || !iccid) {
    return ''
  }
  const topSix = iccid.substring(0, 6)
  switch (true) {
    case ['898600', '898602', '898604', '898607'].indexOf(topSix) >= 0: // 移动的卡不做处理
      return iccid
    case ['898601', '898606', '898609', '898603', '898611'].indexOf(topSix) >= 0: // 联通(前3个)和电信(后2个)的卡去掉最后一位
      return iccid.substring(0, iccid.length - 1)
    default:
      return iccid
  }
}

/**
 * 获取卡所属运营商
 * @param iccid
 * @returns {string}
 */
export function getIccidCarrier(iccid) {
  if (!iccid || typeof iccid !== 'string') {
    return ''
  }
  const topSix = iccid.substring(0, 6)
  if (['898600', '898602', '898604', '898607', '898608'].indexOf(topSix) > -1) {
    return 'cmcc'
  }
  if (['898601', '898609', '898606'].indexOf(topSix) > -1) {
    return 'unicom'
  }
  if (['898603', '898611'].indexOf(topSix) > -1) {
    return 'chinanet'
  }
  return ''
}
