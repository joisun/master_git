import Regexp from '@/constant/regexps'

// 校验邮箱
let mailValidator = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入邮箱地址'))
  }
  if (!Regexp.email.test(value)) {
    callback(new Error('请输入格式正确的邮箱地址'))
  }
  callback()
}

// 校验iccid输入
let iccidValidator = (rule, value, callback) => {
  if (!value.length) {
    callback(new Error('请输入iccid'))
  }
  callback()
}

export {
  mailValidator,
  iccidValidator
}
