import manage from '@/page/manage/index.vue'

import client from './client/index'
import store from './store/index'
import order from './order/index'
import operation from './operation/index'
import finance from './finance/index'
import develop from './develop/index'
import other from './other/index'
import vpdn from './vpdn/index'

export default {
  path: 'manage',
  name: 'manage',
  component: manage,
  children: [
    client,
    store,
    order,
    operation,
    finance,
    develop,
    other,
    vpdn
  ]
}
