import vpdn from '@/page/manage/children/vpdn/vpdn.vue'
import vpdnSeparate from '@/page/manage/children/vpdn/children/vpdn-separate/vpdn-separate.vue'
import vpdeSpeedLimit from '@/page/manage/children/vpdn/children/vpdn-speed-limit/vpdn-speed-limit.vue'
import vpdnIpList from '@/page/manage/children/vpdn/children/vpdn-ip-list/vpdn-ip-list.vue'
import routingRules from '@/page/manage/children/vpdn/children/routing-rules/routing-rules.vue'
import addressTranslation from '@/page/manage/children/vpdn/children/address-translation/address-translation.vue'
import networkTool from '@/page/manage/children/vpdn/children/network-tool/network-tool.vue'
import adhocApnSetting from '@/page/manage/children/vpdn/children/adhoc-apn-setting/adhoc-apn-setting'

export default {
  path: 'vpdn',
  name: 'vpdn',
  component: vpdn,
  children: [
    {
      path: 'vpdn-separate',
      name: 'vpdn-separate',
      component: vpdnSeparate
    },
    {
      path: 'vpdn-speed-limit',
      name: 'vpdn-speed-limit',
      component: vpdeSpeedLimit
    },
    {
      path: 'vpdn-ip-list',
      name: 'vpdn-ip-list',
      component: vpdnIpList
    },
    {
      path: 'routing-rules',
      name: 'routing-rules',
      component: routingRules
    },
    {
      path: 'address-translation',
      name: 'address-translation',
      component: addressTranslation
    },
    {
      path: 'network-tool',
      name: 'network-tool',
      component: networkTool
    },
    {
      path: 'ad-hoc-apn-setting',
      name: 'ad-hoc-apn-setting',
      component: adhocApnSetting
    }
  ]
}
