import store from '@/page/manage/children/store/store.vue'
import storeCard from '@/page/manage/children/store/children/store-card/store-card.vue'
import storeCardList from '@/page/manage/children/store/children/store-card/children/store-card-list.vue'
import vpdnNetworkDetail from '@/page/manage/children/store/children/store-card/children/vpdn-network-detail.vue'
import storeInventory from '@/page/manage/children/store/children/store-inventory/store-inventory.vue'
import storeInventoryList from '@/page/manage/children/store/children/store-record/children/store-inventory-list/store-inventore-list'
import storeInventoryTurnover from '@/page/manage/children/store/children/store-inventory/children/store-inventory-turnover/store-inventore-turnover.vue'
import storeDeliveryNote from '@/page/manage/children/store/children/store-delivery-note/store-delivery-note.vue'
import storeRecord from '@/page/manage/children/store/children/store-record/store-record.vue'
import storeRecordOut from '@/page/manage/children/store/children/store-record/children/store-record-out/store-record-out.vue'
import storeRecordInner from '@/page/manage/children/store/children/store-record/children/store-record-inner/store-record-inner.vue'
import storeCarrier from '@/page/manage/children/store/children/store-carrier/store-carrier.vue'
import storeCarrrierPlan from '@/page/manage/children/store/children/store-carrier-plan/store-carrier-plan.vue'
import storeManageReport from '@/page/manage/children/store/children/store-manage-report/store-manage-report.vue'
import inventoryReservation from '@/page/manage/children/store/children/inventory-reservation/inventory-reservation'
import inventoryReservationList from '@/page/manage/children/store/children/inventory-reservation/children/list/list'
import inventoryReservationMyList from '@/page/manage/children/store/children/inventory-reservation/children/reserve-list/list'
import whiteCard from '@/page/manage/children/store/children/white-card/white-card.vue'
import whiteCardWarehousing from '@/page/manage/children/store/children/white-card/children/warehousing/warehousing'
import whiteCardRecord from '@/page/manage/children/store/children/white-card/children/record/record'
import whiteCardActiveRecord from '@/page/manage/children/store/children/white-card/children/active-record/active-record'
import CardExportStrategy from '@/page/manage/children/store/children/card-export-strategy/card-export-strategy'
import CardExportStrategyList from '@/page/manage/children/store/children/card-export-strategy/children/list'

export default {
  path: 'store',
  name: 'store',
  component: store,
  children: [
    {
      path: 'card-export-strategy',
      name: 'card-export-strategy',
      component: CardExportStrategy,
      children: [
        {
          path: 'card-export-strategy-list/:carrier',
          name: 'card-export-strategy-list',
          component: CardExportStrategyList
        }
      ]
    },
    {
      path: 'store-card',
      name: 'store-card',
      component: storeCard,
      redirect: { name: 'store-card-list' },
      children: [
        {
          path: 'store-card-list',
          name: 'store-card-list',
          component: storeCardList
        },
        {
          path: 'vpdn-network-detail',
          name: 'vpdn-network-detail',
          component: vpdnNetworkDetail
        }
      ]
    },
    {
      path: 'store-inventory',
      name: 'store-inventory',
      component: storeInventory,
      children: [
        // {
        //   path: 'store-inventory-list',
        //   name: 'store-inventory-list',
        //   component: storeInventoryList
        // },
        {
          path: 'store-inventory-turnover',
          name: 'store-inventory-turnover',
          component: storeInventoryTurnover
        }
      ]
    },
    {
      path: 'store-delivery-note',
      name: 'store-delivery-note',
      component: storeDeliveryNote
    },
    {
      path: 'blank-card',
      name: 'blank-card',
      component: whiteCard,
      children: [
        {
          path: 'blank-card-warehousing',
          name: 'blank-card-warehousing',
          component: whiteCardWarehousing
        },
        {
          path: 'blank-card-record',
          name: 'blank-card-record',
          component: whiteCardRecord
        },
        {
          path: 'blank-card-active-record',
          name: 'blank-card-active-record',
          component: whiteCardActiveRecord
        }
      ]
    },
    {
      path: 'store-record',
      name: 'store-record',
      component: storeRecord,
      children: [
        {
          path: 'store-record-out',
          name: 'store-record-out',
          component: storeRecordOut
        },
        {
          path: 'store-record-inner',
          name: 'store-record-inner',
          component: storeRecordInner
        },
        {
          path: 'store-inventory-list',
          name: 'store-inventory-list',
          component: storeInventoryList
        }
      ]
    },
    {
      path: 'store-carrier',
      name: 'store-carrier',
      component: storeCarrier
    },
    {
      path: 'store-manage-report',
      name: 'store-manage-report',
      component: storeManageReport
    },
    {
      path: 'store-carrier-plan/:carrier',
      name: 'store-carrier-plan',
      component: storeCarrrierPlan
    },
    {
      path: 'inventory-reservation',
      name: 'inventory-reservation',
      component: inventoryReservation,
      children: [
        {
          path: 'inventory-reservation-list',
          name: 'inventory-reservation-list',
          component: inventoryReservationList
        },
        {
          path: 'inventory-reservation-my-list',
          name: 'inventory-reservation-my-list',
          component: inventoryReservationMyList
        }
      ]
    }
  ]
}
