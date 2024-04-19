import { iccidsTransfer } from '@/global/function/iccids-tool'

const maxIccidLength = 5000

const checkIccidLength = (field, value, callback) => {
  const iccidArray = iccidsTransfer(value)
  if (iccidArray && iccidArray.length > maxIccidLength) {
    callback(new Error(`数量最多不超过${maxIccidLength}张`))
  }
  callback()
}

export { checkIccidLength, maxIccidLength }
