import operation from '@/page/manage/children/operation/operation.vue'
import operationPop from '@/page/manage/children/operation/children/operation-pop/operation-pop.vue'
import operationPopList from '@/page/manage/children/operation/children/operation-pop/children/operation-pop-list.vue'
import operationPopUser from '@/page/manage/children/operation/children/operation-pop/children/operation-pop-user.vue'

import operationNotice from '@/page/manage/children/operation/children/operation-notice/operation-notice.vue'
import customerProfit from '@/page/manage/children/operation/children/customer-profit/customer-profit.vue'
import customerProfitList from '@/page/manage/children/operation/children/customer-profit/list/customer-profit-list.vue'
import customerProfitDetail from '@/page/manage/children/operation/children/customer-profit/detail/customer-profit-detail.vue'
import operationSales from '@/page/manage/children/operation/children/operation-sales/operation-sales.vue'
import operationReport from '@/page/manage/children/operation/children/operation-report/operation-report.vue'
import operationSaleReport from '@/page/manage/children/operation/children/operation-sale-report/operation-sale-report.vue'
import storeManageReport from '@/page/manage/children/operation/children/store-manage-report/store-manage-report.vue'

import messageReport from '@/page/manage/children/operation/children/message-report/message-report.vue'
import operationBlogManage from '@/page/manage/children/operation/children/blog-manage/blog-manage.vue'
import operationAddArticle from '@/page/manage/children/operation/children/blog-manage/add-article.vue'

export default {
  path: 'operation',
  name: 'operation',
  component: operation,
  children: [
    {
      path: 'operation-notice',
      name: 'operation-notice',
      component: operationNotice,
    },
    {
      path: 'customer-profit',
      name: 'customer-profit',
      component: customerProfit,
      redirect: {
        name: 'customer-profit-list',
        query: {
          enter: true
        }
      },
      children: [
        {
          name: 'customer-profit-list',
          path: 'customer-profit-list',
          component: customerProfitList,
        },
        {
          path: 'customer-profit-detail',
          name: 'customer-profit-detail',
          component: customerProfitDetail,
        }
      ],
    },
    {
      path: 'operation-sales',
      name: 'operation-sales',
      component: operationSales,
    },
    {
      path: 'operation-pop',
      name: 'operation-pop',
      component: operationPop,
      children: [
        {
          path: 'operation-pop-list',
          name: 'operation-pop-list',
          component: operationPopList,
        },
        {
          path: 'operation-pop-user',
          name: 'operation-pop-user',
          component: operationPopUser,
        },
      ],
    },
    {
      path: 'operation-report-card',
      name: 'operation-report-card',
      component: operationReport,
    },
    {
      path: 'operation-sale-report',
      name: 'operation-sale-report',
      component: operationSaleReport,
    },
    {
      path: 'store-manage-report',
      name: 'operation-store-manage-report',
      component: storeManageReport,
    },
    {
      path: 'message-report',
      name: 'message-report',
      component: messageReport,
    },
    {
      path: 'blog-manage',
      name: 'blog-manage',
      component: operationBlogManage,
    },
    {
      path: 'add-article',
      name: 'add-article',
      component: operationAddArticle,
    },
  ],
}
