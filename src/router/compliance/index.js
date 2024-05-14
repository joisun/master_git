import Compliance from '@/page/compliance/index'
import ExtWhitelist from '@/page/compliance/ext-whitelist/index'
import ComplianceChange from '@/page/compliance/change/index'
import ComplianceChangeList from '@/page/compliance/change/children/list/list'
import ComplianceChangeDetail from '@/page/compliance/change/children/detail/detail'
import ChangeList from '@/page/compliance/ext-whitelist/change-list/index.vue'
import UpdateAndDetail from '@/page/compliance/ext-whitelist/change-list/update-and-detail/index.vue'
import ExtWhitelistList from '@/page/compliance/ext-whitelist/ext-whitelist-list/index'
import ExtWhitelistCarrierConfig from '@/page/compliance/ext-whitelist/ext-whitelist-carrier-config/index'
import HumanConnnectBlacklist from '@/page/compliance/ext-whitelist/human-connnect-blacklist'
import HumanConnnectBlacklistList from '@/page/compliance/ext-whitelist/human-connnect-blacklist/children/list'
import CarrierAccountMatching from '@/page/compliance/ext-whitelist/carrier-account-matching'
import FlowWarning from '@/page/compliance/flow-warning'
import FlowWarningList from '@/page/compliance/flow-warning/children/list/list'
import FlowWarningDownloads from '@/page/compliance/flow-warning/children/downloads/downloads'

export default {
  path: 'compliance',
  name: 'compliance',
  component: Compliance,
  children: [
    {
      path: 'ext-whitelist',
      name: 'ext-whitelist',
      component: ExtWhitelist,
      redirect: {
        name: 'my-todos',
        query: {
          enter: true
        }
      },
      children: [
        {
          path: 'todos',
          name: 'my-todos',
          component: ChangeList
        },
        {
          path: 'change-list',
          name: 'compliance-change-list',
          component: ChangeList
        },
        {
          path: 'update-and-detail',
          name: 'ext-whitelist-update-and-detail',
          component: UpdateAndDetail
        },
        {
          path: 'list',
          name: 'ext-whitelist-list',
          component: ExtWhitelistList
        },
        {
          path: 'carrier-config',
          name: 'ext-whitelist-carrier-config',
          component: ExtWhitelistCarrierConfig
        }
      ]
    },
    {
      path: 'human-connect-blacklist',
      name: 'human-connect-blacklist',
      component: HumanConnnectBlacklist,
      children: [
        {
          path: 'human-connect-blacklist-list/:carrier',
          name: 'human-connect-blacklist-list',
          component: HumanConnnectBlacklistList
        }
      ]
    },
    {
      path: 'carrier-account-matching',
      name: 'carrier-account-matching',
      component: CarrierAccountMatching
    },
    {
      path: 'change',
      name: 'compliance-change',
      component: ComplianceChange,
      children: [
        {
          path: 'list',
          name: 'compliance-change-list',
          component: ComplianceChangeList
        },
        {
          path: 'detail',
          name: 'compliance-change-detail',
          component: ComplianceChangeDetail
        }
      ]
    },
    {
      path: 'flow-warning',
      name: 'flow-warning',
      component: FlowWarning,
      children: [
        {
          path: 'list',
          name: 'flow-warning-list',
          component: FlowWarningList
        },
        {
          path: 'downloads',
          name: 'flow-warning-downloads',
          component: FlowWarningDownloads
        }
      ]
    }
  ]
}
