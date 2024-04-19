/**
 * Created by zeter on 2017/5/31.
 */
import moment from 'moment'

// 销售过滤
let filtersells = (x, list) => {
  // eslint-disable-next-line no-unused-vars
  for (let i in list) {
    if (x === list[i].key) {
      return list[i].name
    }
  }
}

// 时间过滤
let filtersTime = (val, formatString = `YYYY-MM-DD HH:mm:ss`) => {
  let ret
  if (typeof val === 'object') {
    if (val === null) return
    if (!(val instanceof Date)) {
      val = val.time
    }
  }
  if (typeof val === 'undefined') return ''
  ret = moment(val)
  if (!ret.isValid()) return
  return ret.format(formatString)
}

export { filtersells, filtersTime }
