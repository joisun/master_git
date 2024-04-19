import order from '@/page/manage/children/order/order.vue'
import orderList from '@/page/manage/children/order/children/order-list/order-list.vue'
import orderTool from '@/page/manage/children/order/children/order-tool/order-tool.vue'
import orderChange from '@/page/manage/children/order/children/order-change/order-change.vue'
import orderToolRefund from '@/page/manage/children/order/children/order-tool/children/order-tool-refund/order-tool-refund.vue'
import orderToolReset from '@/page/manage/children/order/children/order-tool/children/order-tool-reset/order-tool-reset.vue'

export default {
  path: 'order',
  name: 'order',
  component: order,
  children: [
    {
      path: 'order-list',
      name: 'order-list',
      component: orderList
    },
    {
      path: 'order-tool',
      name: 'order-tool',
      component: orderTool,
      children: [
        {
          path: 'order-tool-refund',
          name: 'order-tool-refund',
          component: orderToolRefund
        },
        {
          path: 'order-tool-reset',
          name: 'order-tool-reset',
          component: orderToolReset
        }
      ]
    },
    {
      path: 'order-change',
      name: 'order-change',
      component: orderChange
    }
  ]
}
