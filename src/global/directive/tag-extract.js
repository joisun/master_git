import { inRatePlanFormat, outRatePlanFormat } from '../filters/rate-plan-format'

/**
 * 用于写入套餐类型指令
 * 当只传入入库套餐数据(validity、validityUnit、volume)表示入库套餐类型
 * 当传入全量数据(validity/validityUnit/unlimited/offerType/volume)套餐时表示出库用户套餐类型
 * @param el
 * @param binding
 * @returns {string}
 */
const extract = function(el, binding) {
  let value = binding.value
  let offerType = value.offerType // 出库的套餐类型
  let ratePlanType = value.ratePlanType // 入库的套餐类型
  let validity = value.validity
  let validityUnit = value.validityUnit
  let unlimited = value.unlimited || false
  let volume = value.volume
  let cardPeriod = value.cardPeriod
  let useCountAsVolume = value.useCountAsVolume || false
  let str = ''
  if (ratePlanType || !offerType) {
    str = inRatePlanFormat({ volume, validity, validityUnit, ratePlanType, useCountAsVolume })
  } else {
    str = outRatePlanFormat({ volume, validity, validityUnit, offerType, unlimited, cardPeriod, useCountAsVolume })
  }
  if (el) {
    el.innerHTML = str
  } else {
    return str
  }
}

export default extract
