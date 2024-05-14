/*
 * @Author: wushiji
 * @Date: 2021-01-22 18:38:55
 * @Description:
 * @LastEditors: wushiji
 * @LastEditTime: 2021-03-11 14:28:02
 */
const numberFixed = (val, arg = 2) => {
  if (typeof val === 'undefined') return
  if (val === '-') return '-'
  let result = Math.round(Math.abs(val) * Math.pow(10, arg)) / Math.pow(10, arg) || 0
  if (val < 0) {
    result = '-' + result
  }
  if (result === '-0' || result === -0) {
    return 0
  }
  return result
}
export default numberFixed
