import moment from 'moment'

const defaultFormatString = 'YYYY-MM-DD HH:mm:ss'
let dateFormat = function (val, formatString) {
  let ret
  if (typeof val === 'object') {
    if (val === null) return
    if (val instanceof Date) {
      // 如果是 Date 实例
    } else {
      // 如果只是普通对象，检测time 属性
      // 平台里面存在非常多时间为null的情况，如果直接去 a.time 可能会报错，所以传整个对象进来
      val = val.time
    }
  }
  if (typeof val === 'undefined') return
  ret = moment(val)
  if (!ret.isValid()) return
  return ret.format(formatString || defaultFormatString)
}

export default dateFormat
