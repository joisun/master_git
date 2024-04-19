import data from '@/page/data/index.vue'
import systemPool from '@/page/data/children/system-pool/system-pool.vue'
import systemPoolShow from '@/page/data/children/system-pool/children/system-pool-show/system-pool-show.vue'
import systemPoolUsage from '@/page/data/children/system-pool/children/system-pool-usage/system-pool-usage.vue'
import systemPoolCard from '@/page/data/children/system-pool/children/system-pool-card/system-pool-card.vue'
import systemPoolTrafficOperation from '@/page/data/children/system-pool/children/system-pool-traffic-operation/system-pool-traffic-operation.vue'
import userPool from '@/page/data/children/user-pool/user-pool.vue'
import userPoolShow from '@/page/data/children/user-pool/children/user-pool-show/user-pool-show.vue'
import userPoolList from '@/page/data/children/user-pool/children/user-pool-list/user-pool-list.vue'
import userPoolDetail from '@/page/data/children/user-pool/children/user-pool-list/children/user-pool-detail/user-pool-detail.vue'
import userPoolHis from '@/page/data/children/user-pool/children/user-pool-list/children/user-pool-his/user-pool-his.vue'
import singleCard from '@/page/data/children/single-card/single-card'
import singleCardShow from '@/page/data/children/single-card/children/single-card-show/single-card-show.vue'
import singleCardList from '@/page/data/children/single-card/children/single-card-list/single-card-list.vue'
import singleCardStatistics from '@/page/data/children/single-card/children/single-card-statistics/single-card-statistics.vue'

export default {
  path: 'data',
  name: 'data',
  component: data,
  children: [
    {
      path: 'system-pool',
      name: 'system-pool',
      component: systemPool,
      children: [
        {
          path: 'system-pool-show/:carrier',
          name: 'system-pool-show',
          component: systemPoolShow
        },
        {
          path: 'system-pool-usage',
          name: 'system-pool-usage',
          component: systemPoolUsage
        },
        {
          path: 'system-pool-card',
          name: 'system-pool-card',
          component: systemPoolCard
        },
        {
          path: 'traffic-operation',
          name: 'system-pool-traffic-operation',
          component: systemPoolTrafficOperation
        }
      ]
    },
    {
      path: 'user-pool',
      name: 'user-pool',
      component: userPool,
      children: [
        {
          path: 'user-pool-show',
          name: 'user-pool-show',
          component: userPoolShow
        },
        {
          path: 'user-pool-list',
          name: 'user-pool-list',
          component: userPoolList,
          children: [
            {
              path: 'detail',
              name: 'user-pool-detail',
              component: userPoolDetail
            },
            {
              path: 'history',
              name: 'user-pool-history',
              component: userPoolHis
            }
          ]
        }
      ]
    },
    {
      path: 'single-card',
      name: 'single-card',
      component: singleCard,
      children: [
        {
          path: 'single-card-show/:carrier',
          name: 'single-card-show',
          component: singleCardShow
        },
        {
          path: 'single-card-list',
          name: 'single-card-list',
          component: singleCardList
        },
        {
          path: 'single-card-statistics',
          name: 'single-card-statistics',
          component: singleCardStatistics
        }
      ]
    }
  ]
}
