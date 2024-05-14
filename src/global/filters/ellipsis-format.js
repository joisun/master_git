/**
 * 格式化文本
 * @param value 文本值
 * @param length 最长的位数
 * @returns {string}
 */
const ellipsisFormat = function(value, ellipsisLength) {
  if (!value) return ''
  if (value.length > ellipsisLength) {
    return value.slice(0, ellipsisLength) + '...'
  }
  return value
}

export default ellipsisFormat

