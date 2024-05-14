const defaultLength = 2

const rateFormat = function(val, arg) {
  if (typeof val === 'undefined' || val === '') return
  arg = +(arg || defaultLength)
  let num = Number(val)
  if (isNaN(num)) return NaN
  return (num * 10000 / 100).toFixed(arg) + '%'
}

export default rateFormat
