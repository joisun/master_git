const multiple = 1024
const { isInteger, parseFloat, isNaN } = Number
/**
 *
 * @param volume
 * @param whether 是否需要带单位，默认为true
 * @returns {*}
 */
const volumeFormat = function (volume, whether = true, trace = false) {
  if (isNaN(+volume)) return volume
  if (typeof volume === 'string') volume = parseFloat(volume)
  // 小于 1G
  if (Math.abs(volume) < 1024) {
    // 包含小数
    if (!isInteger(volume)) volume = volume.toFixed(3)
    return volume + (whether ? (trace ? 'K' : 'M') : '')
  }
  volume /= multiple
  // 转成G包含小数
  if (!isInteger(volume)) volume = volume.toFixed(3)
  return volume + (whether ? (trace ? 'M' : 'G') : '')
}

export default volumeFormat
