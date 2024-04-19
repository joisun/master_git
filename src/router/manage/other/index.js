import other from '@/page/manage/children/other/other.vue'
import testCard from '@/page/manage/children/other/children/test-card/test-card.vue'
import whiteList from '@/page/manage/children/other/children/white-list/white-list.vue'
import OperationLog from '@/page/manage/children/other/children/operation-log/operation-log.vue'
import StopCardFuse from '@/page/manage/children/other/children/stop-card-fuse/stop-card-fuse'
import CardOwnershipQuery from '@/page/manage/children/other/children/card-ownership-query/card-ownership-query'
export default {
  path: 'other',
  name: 'other',
  component: other,
  children: [
    {
      path: 'card-ownership-query',
      name: 'card-ownership-query',
      component: CardOwnershipQuery
    },
    {
      path: 'test-card',
      name: 'test-card',
      component: testCard
    },
    {
      path: 'white-list',
      name: 'white-list',
      component: whiteList
    },
    {
      path: 'operation-log',
      name: 'operation-log',
      component: OperationLog
    },
    {
      path: 'stop-card-fuse',
      name: 'stop-card-fuse',
      component: StopCardFuse
    }
  ]
}
