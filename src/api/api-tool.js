import { Message as ElMessage } from 'element-ui'
import { createInterfacerFactory } from './interfacer'
import Vue from 'vue'
import { commonMessageConfig } from '@/plugins'
let Message = ElMessage
const _normalizeMessage = (res, option) => {
  let messageHash = {
    message: '',
    type: 'info'
  }
  let status = res.body.status + ''
  const message = res.body.message || res.body.msg || option.errmsg
  if (!res.body.success) {
    if (status === '401') {
      // 无权限 自助提取信息
      messageHash.message = res.body.message || '您没有此操作的权限'
      messageHash.type = 'warning'
    } else {
      messageHash.message = message || option.errmsg
      messageHash.type = 'error'
    }
    Message({
      ...commonMessageConfig(messageHash.type),
      message: messageHash.message,
      type: messageHash.type
    })
  }
}
const trimParams = (params) => {
  try {
    Object.keys(params).forEach((key) => {
      if (typeof params[key] === 'string') {
        params[key] = params[key].trim()
      }
    })
  } catch (e) {}
  return params
}
export const ajax = (url, data = {}, option = {}, isFile = false) => {
  Message = option.Message ? option.Message : Message
  delete option.Message
  const begin = Date.now()
  const traceId = window.__bl && __bl.getTraceId('EagleEye-TraceID')
  // 默认配置
  option = Object.assign(
    {
      method: 'post',
      errmsg: '操作失败'
    },
    option
  )

  let postData = data
  const system = option.system || 'captain'
  let headers = {
    emulateJSON: true,
    'EagleEye-TraceID': traceId
  }

  let successCallback = (res) => {
    const {
      data: { code }
    } = res
    try {
      window.__bl &&
        __bl.api(url, code === 0, Date.now() - begin, code, res.body.message, begin, traceId)
    } catch (e) {}
    if (code && (code === 302 || code === 10001)) {
      Message({
        ...commonMessageConfig('error'),
        message: '您的登录已经失效，正在进入重新登录',
        type: 'error',
        offset: 70
      })
      window.location.href = `${window.location.origin}?redirect=${window.location.hash}`
    } else {
      _normalizeMessage(res, option)
      return res.body
    }
  }
  let errorCallback = (err) => {
    try {
      window.__bl &&
        __bl.api(url, false, Date.now() - begin, err.body.code, err.body.message, begin, traceId)
    } catch (e) {}
    Message({
      ...commonMessageConfig('error'),
      message: err.message || '网络不好, 喝杯茶吧',
      type: 'error',
      offset: 70
    })
  }

  if (isFile) {
    postData.append('system', system)
    if (!postData.get('filter')) postData.append('filter', '')
    return Vue.http[option.method || 'post'](url, postData, headers)
      .catch(errorCallback)
      .then(successCallback)
  }
  postData.system = system
  if (!postData.filter) postData.filter = ''
  let postValue = JSON.stringify(trimParams(postData))
  let interfacer = createInterfacerFactory({
    url,
    method: option.method || 'post',
    headers
  })
  return interfacer.do(postValue).catch(errorCallback).then(successCallback)
}
