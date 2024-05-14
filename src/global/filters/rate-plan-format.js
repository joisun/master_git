import volumeFormat from '@/global/filters/volume-format'
import {
  dateUnit
} from '@/global/filters/word-map'

function month2year(validity, validityUnit, monthUnit = '个月') {
  if (validityUnit !== 'M') {
    return `${validity}${dateUnit(validityUnit)}`
  }
  let month = validity % 12
  let year = Math.floor(validity / 12)
  if (year === 0) {
    return `${validity}${monthUnit}`
  }
  if (month === 0) {
    return `${year}年`
  }
  return `${year}年${month}${monthUnit}`
}

// /**
//  * 入库套餐格式化
//  * @param  {Number} volume
//  * @param  {Number} validity
//  * @param  {String} validityUnit
//  * @return {String}
//  */
// export const inRatePlanFormat = function (volume, validity, validityUnit) {
//   if (Number(volume) === -1) {
//     return '全套餐';
//   }
//   return validity ? `${volumeFormat(volume)}/${validity}月` : `${volumeFormat(volume)}`;
// };

/**
 * 入库套餐格式化
 * @param  {Number} volume 次数或流量
 * @param  {Number} validity 周期
 * @param  {String} cardPeriod 期限，目前单位都为年
 * @param  {Boolean} useCountAsVolume 使用次数
 * @return {String}
 */
export const inRatePlanFormat = function({ volume, validity, validityUnit, cardPeriod, ratePlanType = '', useCountAsVolume = false, cardPeriodUnit = '年' }) {
  if (Number(volume) === -1) {
    return '全套餐'
  }

  // 只有前向自定义的才需要显示validity
  // 接口不统一
  // custom=前向自定义=前向自定义套餐
  if (ratePlanType !== '' && !['custom','CUSTOM', '前向自定义', '前向自定义套餐'].includes(ratePlanType.toLowerCase())) {
    return `${volumeFormat(volume)}/月`
  }
  if (!useCountAsVolume) {
    if (cardPeriod === 1 || cardPeriod === undefined) {
      return validity ? `${volumeFormat(volume)}/${month2year(validity, validityUnit)}` : `${volumeFormat(volume)}`
    }
    return validity ? `${volumeFormat(volume)}/${month2year(validity, validityUnit)} ${cardPeriod}${cardPeriodUnit}` : `${volumeFormat(volume)} ${cardPeriod}${cardPeriodUnit}`
  }
  if (cardPeriod === 1 || cardPeriod === undefined) {
    return `${volume}次/${month2year(validity, validityUnit)}`
  }
  return `${volume}次/${month2year(validity, validityUnit)} ${cardPeriod}${cardPeriodUnit}`
}

/**
 * 出库套餐格式化
 * @param  {Number}  volume
 * @param  {Number}  validity
 * @param  {String}  validityUnit
 * @param  {String}  offerType    出库套餐类型
 * @param  {Boolean} unlimited
 * @return {String}
 */
export const outRatePlanFormat = function({ volume, validity, validityUnit, cardPeriod, offerType, useCountAsVolume = false, cardPeriodUnit = '份', unlimited = false }) {
  if (unlimited) {
    return '不限流量套餐'
  }
  if (offerType.toLowerCase() === 'monthly') {
    // 按月套餐
    return `${volumeFormat(volume)}/月`
  }
  let suffix
  if (offerType.toLowerCase() === 'package') {
    suffix = ''
  } else {
    suffix = `/${month2year(validity, validityUnit)}`
  }
  if (!useCountAsVolume) {
    if (cardPeriod === 1 || cardPeriod === undefined) {
      return `${volumeFormat(volume)}${suffix}`
    }
    return `${volumeFormat(volume)}${suffix} ${cardPeriod}${cardPeriodUnit}`
  }
  if (cardPeriod === 1 || cardPeriod === undefined) {
    return `${volume}次${suffix}`
  }
  return `${volume}次${suffix} ${cardPeriod}${cardPeriodUnit}`
}
