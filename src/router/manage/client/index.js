import client from '@/page/manage/children/client/client.vue'
import clientPriceSet from '@/page/manage/children/client/children/client-price-set/client-price-set.vue'
import clientPriceSetPackage from '@/page/manage/children/client/children/client-price-set/children/package/package.vue'
import clientPriceSetNetwork from '@/page/manage/children/client/children/client-price-set/children/network/network.vue'
import clientPriceSetLbs from '@/page/manage/children/client/children/client-price-set/children/lbs/lbs.vue'
import clientPriceExclusive from '@/page/manage/children/client/children/client-price-set/children/package/exclusive'
import clientPriceCombine from '@/page/manage/children/client/children/client-price-set/children/package/combine.vue'
import clientList from '@/page/manage/children/client/children/client-list/client-list.vue'
import clientVerify from '@/page/manage/children/client/children/client-verify/client-verify.vue'
import clientDetail from '@/page/manage/children/client/children/client-detail/client-detail.vue'
import clientData from '@/page/manage/children/client/children/client-data/client-data.vue'
import TemplateContract from '@/page/manage/children/client/children/template-contract/template-contract'
import TemplateContractList from '@/page/manage/children/client/children/template-contract/children/list'
import H5Manage from '@/page/manage/children/client/children/h5-manage/h5-manage'
import PicCheck from '@/page/manage/children/client/children/client-verify/pic-check.vue'
import LadyLiberty from '@/page/lady-liberty.vue'
import Gotham from '@/page/gotham.vue'
import IntlClientPriceSet from "@/page/manage/children/client/children/intl-client-price-set/intl-client-price-set.vue";

export default {
  path: 'client',
  name: 'client',
  component: client,
  children: [
    {
      path: 'h5-manage',
      name: 'h5-manage',
      component: H5Manage
    },
    {
      path: 'client-verify',
      name: 'client-verify',
      component: clientVerify
    },
    {
      path: 'cert-pic-check',
      name: 'cert-pic-check',
      component: PicCheck
    },
    {
      path: 'client-list',
      name: 'client-list',
      component: clientList
    },
    {
      path: 'template-contract',
      name: 'template-contract',
      component: TemplateContract,
      children: [
        {
          path: 'template-contract-list',
          name: 'template-contract-list',
          component: TemplateContractList
        }
      ]
    },
    {
      path: 'client-price-set',
      name: 'client-price-set',
      component: clientPriceSet,
      children: [
        {
          path: 'client-price-set-package',
          name: 'client-price-set-package',
          component: clientPriceSetPackage
        },
        {
          path: 'client-price-set-network',
          name: 'client-price-set-network',
          component: clientPriceSetNetwork
        },
        {
          path: 'client-price-set-lbs',
          name: 'client-price-set-lbs',
          component: clientPriceSetLbs
        },
        {
          path: 'client-price-exclusive',
          name: 'client-price-exclusive',
          component: clientPriceExclusive
        },
        {
          path: 'client-price-combine',
          name: 'client-price-combine',
          component: clientPriceCombine
        },
        // {
        //   path: '/international/price-manage/client-price-set',
        //   name: 'international-client-price-set',
        //   component: LadyLiberty
        // },
        // {
        //   path: '/ota-admin/price-manage/client-price-set',
        //   name: 'ota-admin-client-price-set',
        //   component: Gotham
        // }
      ]
    },
    {
      path: 'intl-client-price-set',
      name: 'intl-client-price-set',
      component: IntlClientPriceSet,
      children: [
        {
          path: '/international/price-manage/client-price-set',
          name: 'international-client-price-set',
          component: LadyLiberty
        },
        {
          path: '/ota-admin/price-manage/client-price-set',
          name: 'ota-admin-client-price-set',
          component: Gotham
        },
        {
          path: '/ota-admin/price-manage/no-formal-client-price-set',
          name: 'ota-admin-no-formal-client-price-set',
          component: Gotham
        },
        {
          path: '/ota-admin/price-manage/platform-service-client-price-set',
          name: 'ota-admin-platform-service-client-price-set',
          component: Gotham
        }
      ]
    },
    {
      path: 'client-detail',
      name: 'client-detail',
      component: clientDetail
    },
    {
      path: 'client-data',
      name: 'client-data',
      component: clientData
    }
  ]
}
