import Common from '@/page/common/common.vue'
import Download from '@/page/common/children/download/download.vue'
import MyNotice from '@/page/common/children/my-notice/my-notice.vue'
import ThirdPartyOrderClose from '@/page/common/children/third-party-order-close/third-party-order-close'
import FirstOrder from '@/page/common/children/first-order/first-order.vue'
import FirstOrderCard from '@/page/common/children/first-order/childern/card.vue'
import FirstOrderCpe from '@/page/common/children/first-order/childern/cpe.vue'
import RefundTool from '@/page/manage/children/finance/children/refund-tool/index.vue'

export default {
  path: 'common',
  name: 'common',
  component: Common,
  children: [
    {
      path: 'download',
      meta: { pageName: '下载管理' },
      name: 'download',
      component: Download
    },
    {
      path: 'my-notice',
      meta: { pageName: '我的通知' },
      name: 'my-notice',
      component: MyNotice
    },
    {
      path: 'third-party-order-close',
      meta: { pageName: '三方订单关闭' },
      name: 'third-party-order-close',
      component: ThirdPartyOrderClose
    },
    {
      path: 'first-order',
      meta: { pageName: '首单查询' },
      name: 'first-order',
      component: FirstOrder,
      children: [
        {
          path: 'first-order-card',
          name: 'first-order-card',
          component: FirstOrderCard
        },
        {
          path: 'first-order-cpe',
          name: 'first-order-cpe',
          component: FirstOrderCpe
        }
      ]
    },
    {
      path: 'refund-tool',
      meta: { pageName: '退款工具' },
      name: 'refund-tool',
      component: RefundTool
    }
  ]
}
