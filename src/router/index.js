import data from './data/index.js'
import crm from './crm/index.js'
import card from './card/index.js'
import common from './common'
import cpe from './cpe/index.js'
import compliance from './compliance/index.js'
import CustomerService from '@/router/customer-service'
import QualScript from '@/page/tools/qual-script/index.vue'
import LadyLiberty from '@/page/lady-liberty.vue'

import Router from 'vue-router'
import client from '@/router/manage/client'
import store from '@/router/manage/store'
import order from '@/router/manage/order'
import operation from '@/router/manage/operation'
import finance from '@/router/manage/finance'
import develop from '@/router/manage/develop'
import other from '@/router/manage/other'
import vpdn from '@/router/manage/vpdn'

export default [
  // manage,
  client,
  store,
  order,
  operation,
  finance,
  develop,
  other,
  vpdn,
  data,
  crm,
  common,
  card,
  cpe,
  compliance,
  CustomerService,
  {
    path: 'qual-script',
    name: 'qual-script',
    component: QualScript
  },
  {
    path: '/international/*',
    name: 'international',
    component: LadyLiberty,
    children: [
      {
        path: '/international/price-manage/price-list',
        name: 'international-price-list',
        component: LadyLiberty
      },
      {
        path: '/international/carrier-manage/carrier-account-list',
        name: 'international-carrier-account-list',
        component: LadyLiberty
      },
      {
        path: '/international/carrier-manage/carrier-package-list',
        name: 'international-carrier-package-list',
        component: LadyLiberty
      },
      {
        path: '/international/order-manage/order-list',
        name: 'international-order-list',
        component: LadyLiberty
      },
      {
        path: '/international/order-manage/create-order',
        name: 'international-create-order',
        component: LadyLiberty
      },
      {
        path: '/international/store-manage/in-store-list',
        name: 'international-in-store',
        component: LadyLiberty
      },
      {
        path: '/international/store-manage/out-store-list',
        name: 'international-out-store',
        component: LadyLiberty
      },
      {
        path: '/international/card-manage/card-list',
        name: 'international-card-list',
        component: LadyLiberty
      },
      // 充值申请
      {
        path: '/international/finance-manage/apply-list',
        name: 'international-finance-manage-apply-list',
        component: LadyLiberty
      },
      // 到账记录
      {
        path: '/international/finance-manage/transaction-history',
        name: 'international-finance-manage-transaction-history',
        component: LadyLiberty
      }
    ]
  }
]

const initRouter = () => {
  return new Router({
    routes: []
  })
}
export const router = initRouter()
