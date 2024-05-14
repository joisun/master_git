import CustomerService from '@/page/customer-service/index'
import ForciblyActivate from '@/page/customer-service/children/forcibly-activate'
import ActiveAndDeactive from '@/page/customer-service/children/active-and-deactive'
import CardInfoConvert from '@/page/customer-service/children/card-info-convert'
import ImeiUnbind from '@/page/customer-service/children/imei-unbind'
import TagTools from '@/page/customer-service/children/tag-tools'
import CardVpdnDetail from '@/page/customer-service/children/card-vpdn-detail'
// import PackageReset from '@/page/customer-service/children/package-reset/index.vue'
export default {
  path: 'customer-service',
  name: 'customer-service',
  component: CustomerService,
  children: [
    {
      path: 'forcibly-activate',
      name: 'forcibly-activate',
      component: ForciblyActivate
    },
    {
      path: 'active-and-deactive',
      name: 'active-and-deactive',
      component: ActiveAndDeactive
    },
    {
      path: 'card-info-convert',
      name: 'card-info-convert',
      component: CardInfoConvert
    },
    {
      path: 'imei-unbind',
      name: 'imei-unbind',
      component: ImeiUnbind
    },
    {
      path: 'tag-tools',
      name: 'tag-tools',
      component: TagTools
    },
    {
      path: 'card-vpdn-detail',
      name: 'card-vpdn-detail',
      component: CardVpdnDetail
    }
    // {
    //   path: 'package-reset',
    //   name: 'package-reset',
    //   component: PackageReset
    // }
  ]
}
