const toLowerMoneyUnit = (val, unit = 'w') => {
  if (!val) return val
  return (Math.floor(val * 100) / 1000000).toFixed(2)
}
export default toLowerMoneyUnit
