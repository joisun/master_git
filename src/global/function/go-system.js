import ajax from '@/api/ajax'
import { Message } from 'element-ui'
import { commonMessageConfig } from '@/plugins'

export default function goSystem(userId, pointOrgName, redirect) {
  let data = {
    user_id: encodeURI(userId),
    redirect
  }
  
  return ajax.customer.enterSystem(data).then((rst) => {
    if (rst.success) {
      // Check if it's a mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        // On mobile, directly navigate to the URL
        window.location.href = rst.url;
      } else {
        // On desktop, maintain the original popup behavior
        const frame = window.open('about:blank', '_blank');
        if (frame) {
          frame.location = rst.url;
        }
      }
    } else {
      Message({
        ...commonMessageConfig('error'),
        message: `${pointOrgName} 超级登录失败`,
        type: 'error'
      });
    }
  });
}
