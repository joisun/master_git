const dateUnit = function(timeUnit) {
  const unitMapping = {
    M: '个月',
    D: '天'
  }
  return unitMapping[timeUnit]
}

const supportFilter = function(val) {
  let rst = '支持'
  if (!val || val === 'off') {
    rst = '不支持'
  }
  return rst
}

const needFilter = function(val) {
  let rst = '需要'
  if (!val || val === 'off') {
    rst = '不需要'
  }
  return rst
}

const runingFilter = function(val) {
  let rst = '开通'
  if (!val || val === 'off') {
    rst = '不开通'
  }
  return rst
}

const openFilter = function(val) {
  let rst = '打开'
  if (!val || val === 'off') {
    rst = '关闭'
  }
  return rst
}

const open2Filter = function(val) {
  let rst = '开启'
  if (!val || val === 'off') {
    rst = '关闭'
  }
  return rst
}

const open3Filter = function(val) {
  let rst = '开启'
  if (!val || val === 'off') {
    rst = '未开启'
  }
  return rst
}

const sharableFilter = function(val) {
  if (val === 'POOL') return '支持'
  return '不支持'
}

const haveFilter = function(val) {
  let rst = '有'
  if (!val || val === 'off') {
    rst = '无'
  }
  return rst
}

export {
  dateUnit,
  supportFilter,
  needFilter,
  runingFilter,
  openFilter,
  sharableFilter,
  open2Filter,
  open3Filter,
  haveFilter
}
