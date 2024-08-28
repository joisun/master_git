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
import Gotham from '@/page/gotham.vue'
import Login from "@/page/login.vue";

export default [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
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
    path: '/ota-admin/*',
    name: 'ota-admin',
    component: Gotham,
    children: [
      {
        path: '/ota-admin/card-manage/seed-list',
        name: 'ota-admin-seed-list',
        component: Gotham
      },
      {
        path: '/ota-admin/card-manage/affiliate-list',
        name: 'ota-admin-affiliate-list',
        component: Gotham
      },
      {
        path: '/ota-admin/system-manage/link-records',
        name: 'ota-admin-link-records',
        component: Gotham
      },
      {
        path: '/ota-admin/card-manage/ota-card-list',
        name: 'ota-admin-ota-card-list',
        component: Gotham
      },
      {
        // 菜单 高亮 问题，/price-list
        path: '/ota-admin/price-manage/price-list-index/price-list',
        name: 'ota-admin-price-list-index',
        component: Gotham
      },
      {
        path: '/ota-admin/price-manage/price-list-index/price-list',
        name: 'ota-admin-price-list',
        component: Gotham
      },
      {
        path: '/ota-admin/price-manage/price-list-index/price-list-no-formal',
        name: 'ota-admin-price-list-no-formal',
        component: Gotham
      },
      {
        path: '/ota-admin/price-manage/price-list-index/platform-service',
        name: 'ota-admin-platform-service',
        component: Gotham
      },
      {
        path: '/ota-admin/price-manage/package-group-index/package-group',
        name: 'ota-admin-package-group-list',
        component: Gotham
      },
      {
        path: '/ota-admin/price-manage/package-group-index/package-group-add',
        name: 'ota-admin-package-group-add',
        component: Gotham
      }
    ]
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
      },
      // 工具-客户改套餐
      {
        path: '/international/tools/customer-package-modify-list',
        name: 'international-tools-customer-package-modify-list',
        component: LadyLiberty
      },
      // 工具-运营商改套餐
      {
        path: '/international/tools/carrier-package-modify-list',
        name: 'international-tools-carrier-package-modify-list',
        component: LadyLiberty
      }
    ]
  }
]

const initRouter = () => {
  return new Router({
    routes: [
      {
        path: '/login',
        name: 'login',
        component: Login
      },
    ]
  })
}
export const router = initRouter()
