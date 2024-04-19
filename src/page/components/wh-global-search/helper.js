export function isValidOrderNumber(orderNumber) {
  if (!orderNumber || orderNumber.length !== 18 || !parseInt(orderNumber)) {
    return false
  }
  const year = parseInt(orderNumber.substring(0, 4))
  const month = parseInt(orderNumber.substring(4, 6))
  const day = parseInt(orderNumber.substring(6, 8))
  if (year < 2000 || year > 2999) {
    return false
  }
  if (month < 1 || month > 12) {
    return false
  }
  if (day < 1 || day > 31) {
    return false
  }
  return true
}

export function isValidIntlOrderNumber(orderNumber) {
  if (!orderNumber || orderNumber.length !== 17 || !parseInt(orderNumber)) {
    return false
  }
  const year = 2000 + parseInt(orderNumber.substring(0, 2))
  const month = parseInt(orderNumber.substring(2, 4))
  const day = parseInt(orderNumber.substring(4, 6))
  if (year < 2000 || year > 2999) {
    return false
  }
  if (month < 1 || month > 12) {
    return false
  }
  if (day < 1 || day > 31) {
    return false
  }
  return true
}

export function isValidICCID(value) {
  return /^(89[0-9A-Za-z]{14,20})$/.test(value)
}

export function isValidIMSI(value) {
  return /^(?:[2-9]\d{14,19})$/.test(value)
}
export function isPhoneNumber(value) {
  return /^((\+)?[1-9]{1,3})?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})$/.test(value)
}
export function isIp(value) {
  return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    value
  )
}

export function isMSISDN(value) {
  return /^[1-9][0-9]{10,14}$/.test(value)
}
export function isOrgId(value) {
  return /^\d{3,5}$/.test(value)
}
