let validateNumber = (rule, val, cb) => {
  let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^[0-9]\.[0-9]([0-9])?$)/
  if (!val && val !== 0) {
    return cb(new Error('额度不能为空'))
  } else if (!reg.test(val)) {
    return cb(new Error('请输入正确数字'))
  }
  cb()
}
// 在validateNumber的基础上，支持0的校验
let validateNumberWithZero = (rule, val, cb) => {
  if (val === '0' || val === 0) {
    cb()
  } else {
    validateNumber(rule, val, cb)
  }
}
let validateSell = (rule, val, cb) => {
  if (!val) {
    return cb(new Error('选择不能为空'))
  } cb()
}
export { validateNumber, validateSell, validateNumberWithZero }
