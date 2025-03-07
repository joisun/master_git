
import Crm from '@/page/crm/crm.vue'

import CrmHome from '@/page/crm/children/home/home.vue'
import CrmHomeIndex from '@/page/crm/children/home/index/index.vue'

import Customer from '@/page/crm/children/customer/customer.vue'

import PotentialCustomers from '@/page/crm/children/potentialCustomers/potentialCustomers.vue'
import PotentialCustomerIndex from '@/page/crm/children/potentialCustomers/index/index.vue'
import PotentialCustomerDetail from '@/page/crm/children/potentialCustomers/detail/detail.vue'
import PotentialCustomerCreate from '@/page/crm/children/potentialCustomers/create/create.vue'

import CustomerClues from '@/page/crm/children/customerClues/customerClues.vue'
import CustomerCluesIndex from '@/page/crm/children/customerClues/index/index.vue'

import InputTag from '@/page/crm/children/inputTag/inputTag.vue'

import DuplicateCheck from '@/page/crm/children/duplicateCheck/duplicateCheck.vue'

import MissionList from '@/page/crm/children/mission/missionList.vue'
import Kanban from '@/page/crm/children/kanban/kanban.vue'
import OrderSetting from '@/page/crm/children/orderSetting/orderSetting.vue'

import BoKanban from '@/page/crm/children/boKanban/boKanban.vue'

export default {
  path: 'crm',
  name: 'crm',
  component: Crm,
  children: [
    {
      path: 'home',
      meta: { pageName: '首页' },
      name: 'crm-home',
      redirect: { name: 'home-index' },
      component: CrmHome,
      children: [
        {
          path: '',
          name: 'home-index',
          component: CrmHomeIndex
        },
        {
          path: 'mission',
          name: 'home-mission',
          component: MissionList
        },
        {
          path: ':customerId/detail',
          meta: { pageName: '客户详情' },
          name: 'home-customer-detail',
          component: PotentialCustomerDetail
        }
      ]
    },
    {
      path: 'customer',
      meta: { pageName: '用户详情' },
      component: Customer,
      children: [
        {
          path: ':customerId/detail',
          meta: { pageName: '客户详情' },
          name: 'customer-detail',
          component: PotentialCustomerDetail
        }
      ]
    },
    {
      path: 'customer-clues',
      meta: { pageName: '线索审查' },
      component: CustomerClues,
      children: [
        {
          path: '',
          name: 'customer-clues-index',
          component: CustomerCluesIndex
        },
        {
          path: 'create',
          meta: { pageName: '创建客户' },
          name: 'customer-clues-create',
          component: PotentialCustomerCreate
        },
        {
          path: ':customerId/detail',
          meta: { pageName: '客户详情' },
          name: 'customer-clues-detail',
          component: PotentialCustomerDetail
        }
      ]
    },
    {
      path: 'potential-customers',
      meta: { pageName: '商机推进' },
      component: PotentialCustomers,
      children: [
        {
          path: '',
          name: 'potential-customers-index',
          component: PotentialCustomerIndex
        },
        {
          path: 'create',
          meta: { pageName: '创建客户' },
          name: 'potential-customer-create',
          component: PotentialCustomerCreate
        },
        {
          path: ':customerId/detail',
          meta: { pageName: '客户详情' },
          name: 'potential-customer-detail',
          component: PotentialCustomerDetail
        }
      ]
    },
    {
      path: 'input-tag',
      name: 'input-tag',
      component: InputTag
    },
    {
      path: 'duplicate-check',
      name: 'duplicate-check',
      component: DuplicateCheck
    },
    {
      path: 'kanban',
      name: 'crm-kanban',
      component: Kanban
    },
    {
      path: 'bokanban',
      name: 'bo-kanban',
      component: BoKanban
    },
    {
      path: 'order-setting',
      name: 'auto-order-setting',
      component: OrderSetting
    }
  ]
}
