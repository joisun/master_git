import Card from '@/page/manage/children/store/children/store-card/store-card.vue'
import cardList from '@/page/manage/children/store/children/store-card/children/store-card-list.vue'
import cardOperation from '@/page/card/card-operation/index.vue'
import eliminateCard from '@/page/card/card-operation/eliminate-card/eliminate-card.vue'
import eliminateCardRules from '@/page/card/card-operation/eliminate-card/rules/rules.vue'
import eliminateCardAutoActive from '@/page/card/card-operation/eliminate-card/auto-active/auto-active.vue'
import cancelPlan from '@/page/card/card-operation/cancel-plan/cancel-plan.vue'
import cancelPlanDetail from '@/page/card/card-operation/cancel-plan/detail/detail.vue'
import cancelPlanList from '@/page/card/card-operation/cancel-plan/list/list.vue'
import returnStock from '@/page/card/card-operation/return-stock/return-stock.vue'
import activeRetainNumber from '@/page/card/card-operation/cancel-retain-number/cancel-retain-number.vue'
import returnStockDetail from '@/page/card/card-operation/return-stock/detail/detail.vue'
import returnStockList from '@/page/card/card-operation/return-stock/list/list.vue'
import nbApnModify from '@/page/card/card-operation/nb-apn-modify/nb-apn-modify.vue'
import nbApnModifyAdd from '@/page/card/card-operation/nb-apn-modify/add/add.vue'
import nbApnModifyList from '@/page/card/card-operation/nb-apn-modify/list/list.vue'
import inventoryModify from '@/page/card/card-operation/inventory-modify/inventory-modify'
import inventoryModifyDetail from '@/page/card/card-operation/inventory-modify/detail/detail.vue'
import inventoryModifyList from '@/page/card/card-operation/inventory-modify/list/list.vue'
import carrierAccountModify from '@/page/card/card-operation/carrier-account-modify/carrier-account-modify.vue'
import carrierAccountModifyDetail from '@/page/card/card-operation/carrier-account-modify/detail/detail.vue'
import carrierAccountModifyList from '@/page/card/card-operation/carrier-account-modify/list/list.vue'
import carrierModifyPackage from '@/page/card/card-operation/carrier-modify-package/carrier-modify-package.vue'
import carrierModifyPackageDetail from '@/page/card/card-operation/carrier-modify-package/detail/detail.vue'
import carrierModifyPackageList from '@/page/card/card-operation/carrier-modify-package/list/list.vue'
import customerModifyPackage from '@/page/card/card-operation/customer-modify-package/customer-modify-package.vue'
import customerModifyPackageDetail from '@/page/card/card-operation/customer-modify-package/detail/detail.vue'
import customerModifyPackageList from '@/page/card/card-operation/customer-modify-package/list/list.vue'
import carrierCancelTest from '@/page/card/card-operation/cancel-test/cancel-test.vue'
import customerPeriodAlign from '@/page/card/card-operation/customer-period-align/customer-period-align'
import customerPeriodAlignList from '@/page/card/card-operation/customer-period-align/list/list'
import carrierNbRenewRecord from '@/page/card/card-operation/carrier-nb-renew-record/carrier-nb-renew-record'
import carrierNbRenewRecordList from '@/page/card/card-operation/carrier-nb-renew-record/list/list.vue'
import CardLocationBind from '@/page/card/card-operation/card-location-bind/card-location-bind'
import CardLocationBindList from '@/page/card/card-operation/card-location-bind/list/list'
import PubVpdnInterchange from '@/page/card/card-operation/pub-vpdn-interchange/pub-vpdn-interchange.vue'
import PlanTransfer from '@/page/card/card-operation/plan-transfer/plan-transfer.vue'
import PlanTransferList from '@/page/card/card-operation/plan-transfer/list/list.vue'
import PlanTransferDetail from '@/page/card/card-operation/plan-transfer/detail/detail.vue'
export default {
  name: 'card',
  path: 'card',
  component: Card,
  children: [
    {
      name: 'card-list',
      path: 'list',
      component: cardList
    },
    {
      name: 'card-operation',
      path: 'operation',
      component: cardOperation,
      children: [
        {
          path: 'carrier-cancel-test',
          name: 'carrier-cancel-test',
          component: carrierCancelTest
        },
        {
          name: 'eliminate-card',
          path: 'eliminate-card',
          component: eliminateCard
        },
        {
          name: 'eliminate-card-rules',
          path: 'eliminate-card-rules',
          component: eliminateCardRules
        },
        {
          name: 'eliminate-card-auto-active',
          path: 'eliminate-card-auto-active',
          component: eliminateCardAutoActive
        },
        {
          name: 'cancel-plan',
          path: 'cancel-plan',
          component: cancelPlan,
          redirect: { name: 'cancel-plan-list' },
          children: [
            {
              name: 'cancel-plan-list',
              path: 'list',
              component: cancelPlanList
            },
            {
              name: 'cancel-plan-detail',
              path: 'detail',
              component: cancelPlanDetail
            }
          ]
        },
        {
          name: 'plan-transfer',
          path: 'plan-transfer',
          component: PlanTransfer,
          redirect: { name: 'plan-transfer-list' },
          children: [
            {
              name: 'plan-transfer-list',
              path: 'list',
              component: PlanTransferList
            },
            {
              name: 'plan-transfer-detail',
              path: 'detail',
              component: PlanTransferDetail
            }
          ]
        },
        {
          name: 'return-stock',
          path: 'return-stock',
          component: returnStock,
          redirect: { name: 'return-stock-list' },
          children: [
            {
              name: 'return-stock-list',
              path: 'list',
              component: returnStockList
            },
            {
              name: 'return-stock-detail',
              path: 'detail',
              component: returnStockDetail
            }
          ]
        },
        {
          name: 'cancel-retain-number',
          path: 'cancel-retain-number',
          component: activeRetainNumber
        },
        {
          name: 'nb-apn-modify',
          path: 'nb-apn-modify',
          component: nbApnModify,
          redirect: { name: 'nb-apn-modify-list' },
          children: [
            {
              name: 'nb-apn-modify-list',
              path: 'list',
              component: nbApnModifyList
            },
            {
              name: 'nb-apn-modify-add',
              path: 'add',
              component: nbApnModifyAdd
            }
          ]
        },
        {
          name: 'customer-period-align',
          path: 'customer-period-align',
          component: customerPeriodAlign,
          redirect: { name: 'customer-period-align-list' },
          children: [
            {
              name: 'customer-period-align-list',
              path: 'list',
              component: customerPeriodAlignList
            }
          ]
        },
        {
          name: 'carrier-nb-renew-record',
          path: 'carrier-nb-renew-record',
          component: carrierNbRenewRecord,
          redirect: { name: 'carrier-nb-renew-record-list' },
          children: [
            {
              name: 'carrier-nb-renew-record-list',
              path: 'list',
              component: carrierNbRenewRecordList
            }
          ]
        },
        {
          name: 'inventory-modify',
          path: 'inventory-modify',
          component: inventoryModify,
          redirect: { name: 'inventory-modify-list' },
          children: [
            {
              name: 'inventory-modify-list',
              path: 'list',
              component: inventoryModifyList
            },
            {
              name: 'inventory-modify-detail',
              path: 'detail',
              component: inventoryModifyDetail
            }
          ]
        },
        {
          name: 'carrier-account-modify',
          path: 'carrier-account-modify',
          redirect: { name: 'carrier-account-modify-list' },
          component: carrierAccountModify,
          children: [
            {
              name: 'carrier-account-modify-list',
              path: 'list',
              component: carrierAccountModifyList
            },
            {
              name: 'carrier-account-modify-detail',
              path: 'detail',
              component: carrierAccountModifyDetail
            }
          ]
        },
        {
          name: 'public-vpdn-interchange',
          path: 'public-vpdn-interchange',
          component: PubVpdnInterchange
        },
        {
          name: 'carrier-modify-package',
          path: 'carrier-modify-package',
          component: carrierModifyPackage,
          redirect: { name: 'carrier-modify-package-list' },
          children: [
            {
              name: 'carrier-modify-package-list',
              path: 'list',
              component: carrierModifyPackageList
            },
            {
              name: 'carrier-modify-package-detail',
              path: 'detail',
              component: carrierModifyPackageDetail
            }
          ]
        },
        {
          name: 'customer-modify-package',
          path: 'carrier-customer-package',
          component: customerModifyPackage,
          redirect: { name: 'customer-modify-package-list' },
          children: [
            {
              name: 'customer-modify-package-list',
              path: 'list',
              component: customerModifyPackageList
            },
            {
              name: 'customer-modify-package-detail',
              path: 'detail',
              component: customerModifyPackageDetail
            }
          ]
        },
        {
          name: 'card-location-bind',
          path: 'card-location-bind',
          component: CardLocationBind,
          redirect: { name: 'card-location-bind-list' },
          children: [
            {
              name: 'card-location-bind-list',
              path: 'list',
              component: CardLocationBindList
            }
          ]
        }
      ]
    }
  ]
}
