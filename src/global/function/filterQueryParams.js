// 过滤请求参数

// 过滤不合法的请求参数

export default function (queryParams) {
  const filteredQueryParams = {}
  const keys = Object.keys(queryParams)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = queryParams[key]
    if (([undefined, null, ''].includes(value) || Array.isArray(value) && !value.length)) {
      continue
    }
    filteredQueryParams[key] = value
  }
  return filteredQueryParams
}