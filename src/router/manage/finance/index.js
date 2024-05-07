import finance from '@/page/manage/children/finance/finance.vue'
import financePrice from '@/page/manage/children/finance/children/finance-price/finance-price.vue'
import financePriceList from '@/page/manage/children/finance/children/finance-price/children/finance-price-list/finance-price-list.vue'
import financePriceSpecs from '@/page/manage/children/finance/children/finance-price/children/finance-price-specs/finance-price-specs.vue'
import financePriceFunction from '@/page/manage/children/finance/children/finance-price/children/finance-price-function/finance-price-function.vue'
import financePriceRenew from '@/page/manage/children/finance/children/finance-price/children/finance-price-renew/finance-price-renew.vue'
import financePriceClass from '@/page/manage/children/finance/children/finance-price/children/finance-price-class/finance-price-class.vue'
import financePriceNetwork from '@/page/manage/children/finance/children/finance-price/children/finance-price-network/finance-price-network.vue'
import financePriceLbs from '@/page/manage/children/finance/children/finance-price/children/finance-price-lbs/finance-price-lbs.vue'
import financeCharge from '@/page/manage/children/finance/children/finance-charge/finance-charge.vue'
import financeChargeInner from '@/page/manage/children/finance/children/finance-charge/children/finance-charge-inner/finance-charge-inner.vue'
import financeChargeReach from '@/page/manage/children/finance/children/finance-charge/children/finance-charge-reach/finance-charge-reach.vue'
import financeChargeRecord from '@/page/manage/children/finance/children/finance-charge/children/finance-charge-record/finance-charge-record.vue'
import financePriceCombine from '@/page/manage/children/finance/children/finance-price/children/finance-price-combine/finance-price-combine'

import financeLedger from '@/page/manage/children/finance/children/finance-ledger/finance-ledger.vue'
import financeLedgerCarrier from '@/page/manage/children/finance/children/finance-ledger/children/finance-ledger-carrier/finance-ledger-carrier.vue'

import financeProfit from '@/page/manage/children/finance/children/finance-profit/finance-profit.vue'
import financeProfitSettlement from '@/page/manage/children/finance/children/finance-profit/children/finance-profit-settlement/finance-profit-settlement.vue'
import financeProfitList from '@/page/manage/children/finance/children/finance-profit/children/finance-profit-list/finance-profit-list.vue'

import financeCost from '@/page/manage/children/finance/children/finance-cost/finance-cost.vue'

import financeCarrierCharge from '@/page/manage/children/finance/children/finance-carrier-charge/finance-carrier-charge.vue'
import financeCostStatistic from '@/page/manage/children/finance/children/finance-cost-statistic/finance-cost-statistic.vue'

import salesComission from '@/page/manage/children/finance/children/sales-comission/sales-comission.vue'
import salesComissionList from '@/page/manage/children/finance/children/sales-comission/list/sales-comission-list.vue'
import salesComissionDetail from '@/page/manage/children/finance/children/sales-comission/detail/sales-comission-detail.vue'
import salesComissionList2024 from '@/page/manage/children/finance/children/sales-comission-2024/list/sales-comission-list.vue'
import salesComissionDetail2024 from '@/page/manage/children/finance/children/sales-comission-2024/detail/sales-comission-detail.vue'

import salesComissionCost from '@/page/manage/children/finance/children/sales-comission-cost/sales-comission-cost.vue'
import salesComissionConfig from '@/page/manage/children/finance/children/sales-comission-config/index.vue'
import salesComissionCostList from '@/page/manage/children/finance/children/sales-comission-cost/list/sales-comission-cost-list.vue'
import salesComissionPercentage from '@/page/manage/children/finance/children/sales-comission-percentage/sales-comission-percentage.vue'
import salesComissionPercentageList from '@/page/manage/children/finance/children/sales-comission-percentage/list/sales-comission-percentage-list.vue'
import rechargeManage from '@/page/manage/children/finance/children/recharge-manage/index.vue'
import refundManagement from '@/page/manage/children/finance/children/refund-management/index.vue'
import ProjectOrder from '@/page/manage/children/finance/children/project-order'

export default {
  path: 'finance',
  name: 'finance',
  component: finance,
  children: [
    {
      path: 'finance-price',
      name: 'finance-price',
      component: financePrice,
      children: [
        {
          path: 'finance-price-list',
          name: 'finance-price-list',
          component: financePriceList
        },
        {
          path: 'finance-price-function',
          name: 'finance-price-function',
          component: financePriceFunction
        },
        {
          path: 'finance-price-renew',
          name: 'finance-price-renew',
          component: financePriceRenew
        },
        {
          path: 'finance-price-class',
          name: 'finance-price-class',
          component: financePriceClass
        },
        {
          path: 'finance-price-specs',
          name: 'finance-price-specs',
          component: financePriceSpecs
        },
        {
          path: 'finance-price-network',
          name: 'finance-price-network',
          component: financePriceNetwork
        },
        {
          path: 'finance-price-lbs',
          name: 'finance-price-lbs',
          component: financePriceLbs
        },
        {
          path: 'finance-price-combine',
          name: 'finance-price-combine',
          component: financePriceCombine
        }
      ]
    },
    {
      path: 'finance-charge',
      name: 'finance-charge',
      component: financeCharge,
      children: [
        {
          path: 'finance-charge-inner',
          name: 'finance-charge-inner',
          component: financeChargeInner
        },
        {
          path: 'finance-charge-reach',
          name: 'finance-charge-reach',
          component: financeChargeReach
        },
        {
          path: 'finance-charge-record',
          name: 'finance-charge-record',
          component: financeChargeRecord
        }
      ]
    },
    {
      path: 'refund-management',
      name: 'refund-management',
      component: refundManagement
    },
    {
      path: 'sales-comission',
      name: 'sales-comission',
      component: salesComission,
      redirect: {
        name: 'sales-comission-list',
        query: {
          enter: true
        }
      },
      children: [
        {
          name: 'sales-comission-list2024',
          path: 'sales-comission-list2024',
          component: salesComissionList2024
        },
        {
          path: 'sales-comission-detail2024',
          name: 'sales-comission-detail2024',
          component: salesComissionDetail2024
        },
        {
          name: 'sales-comission-list',
          path: 'sales-comission-list',
          component: salesComissionList
        },
        {
          path: 'sales-comission-detail',
          name: 'sales-comission-detail',
          component: salesComissionDetail
        }
      ]
    },
    // {
    //   path: 'sales-comission-2024',
    //   name: 'sales-comission-2024',
    //   component: salesComission2024,
    //   redirect: {
    //     name: 'sales-comission-list-2024',
    //     query: {
    //       enter: true
    //     }
    //   },
    //   children: [
    //     {
    //       name: 'sales-comission-list-2024',
    //       path: 'sales-comission-list-2024',
    //       component: salesComissionList2024
    //     },
    //     {
    //       path: 'sales-comission-detail-2024',
    //       name: 'sales-comission-detail-2024',
    //       component: salesComissionDetail2024
    //     }
    //   ]
    // },
    {
      path: 'sales-comission-cost',
      name: 'sales-comission-cost',
      component: salesComissionCost,
      redirect: {
        name: 'sales-comission-cost-list',
        query: {
          enter: true
        }
      },
      children: [
        {
          name: 'sales-comission-cost-list',
          path: 'sales-comission-cost-list',
          component: salesComissionCostList
        }
      ]
    },
    {
      path: 'sales-comission-percentage',
      name: 'sales-comission-percentage',
      component: salesComissionPercentage,
      redirect: {
        name: 'sales-comission-percentage-list',
        query: {
          enter: true
        }
      },
      children: [
        {
          name: 'sales-comission-percentage-list',
          path: 'sales-comission-percentage-list',
          component: salesComissionPercentageList
        }
      ]
    },
    {
      path: 'sales-comission-config',
      name: 'sales-comission-config',
      component: salesComissionConfig
    },
    {
      path: 'project-order',
      name: 'project-order',
      component: ProjectOrder
    },
    {
      path: 'finance-ledger',
      name: 'finance-ledger',
      component: financeLedger,
      children: [
        {
          path: 'finance-ledger-carrier',
          name: 'finance-ledger-carrier',
          component: financeLedgerCarrier
        }
      ]
    },
    {
      path: 'finance-profit',
      name: 'finance-profit',
      component: financeProfit,
      children: [
        {
          path: 'finance-profit-settlement',
          name: 'finance-profit-settlement',
          component: financeProfitSettlement
        },
        {
          path: 'finance-profit-list',
          name: 'finance-profit-list',
          component: financeProfitList
        }
      ]
    },
    {
      path: 'finance-cost',
      name: 'finance-cost',
      component: financeCost
    },
    {
      path: 'finance-carrier-charge',
      name: 'finance-carrier-charge',
      component: financeCarrierCharge
    },
    {
      path: 'finance-cost-statistic',
      name: 'finance-cost-statistic',
      component: financeCostStatistic
    },
    {
      path: 'finance-recharge-manage',
      name: 'finance-recharge-manage',
      component: rechargeManage
    }
  ]
}
