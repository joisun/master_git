import ajax from '@/api/ajax'
import { Message } from 'element-ui'
import { commonMessageConfig } from '@/plugins'

export default function goSystem(userId, pointOrgName, redirect) {
  let data = {
    user_id: encodeURI(userId),
    redirect
  }
  let frame
  // frame在promise回调里面打开时，会被浏览器拦截窗口？！
  let promise = ajax.customer.enterSystem(data)
  return promise.then((rst) => {
    if (rst.success) {
      frame = window.open('about:blank', '_blank')
      if (frame) {
        frame.location = rst.url
      }
    } else {
      if (frame) {
        frame.close && frame.close()
      }
      Message({
        ...commonMessageConfig('error'),
        message: `${pointOrgName} 超级登录失败`,
        type: 'error'
      })
    }
  })
}
