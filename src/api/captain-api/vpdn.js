/**
 * Created by zeter on 2017/4/13.
 */

import { ajax } from '../api-tool'

export default {
  apn: {
    getList(data) {
      const url = '/ajax/vpdn/apn/list'
      return ajax(url, data)
    },
    add(data) {
      const url = '/ajax/vpdn/apn/add'
      return ajax(url, data)
    },
    update(data) {
      const url = '/ajax/vpdn/apn/update'
      return ajax(url, data)
    },
    enable(data) {
      const url = '/ajax/vpdn/apn/enable'
      return ajax(url, data)
    }
  },
  acl: {
    get(data) {
      const url = '/ajax/aclPolicy/listByOrgName'
      return ajax(url, data)
    },
    save(data) {
      const url = '/ajax/aclPolicy/save'
      return ajax(url, data)
    },
    tags() {
      const url = '/ajax/aclPolicy/tags'
      return ajax(url)
    },
    template(data) {
      const url = '/ajax/aclPolicy/getOrgTemplate'
      return ajax(url, data)
    }
  },
  ip: {
    addPlan(data) {
      const url = '/ajax/vpdn/ip/addPlan'
      return ajax(url, data)
    },
    plans(data) {
      const url = '/ajax/vpdn/ip/plans'
      return ajax(url, data)
    },
    mapList(data) {
      const url = '/ajax/vpdn/ip/mappings'
      return ajax(url, data)
    },
    failRetry(data) {
      const url = '/ajax/vpdn/ip/mapping/retry'
      return ajax(url, data)
    },
    // data是formdata
    upload(data) {
      const url = '/ajax/vpdn/ip/assign/upload'
      return ajax(url, data, {}, true)
    },
    failDown(data) {
      const url = '/ajax/vpdn/ip/fail/export'
      return ajax(url, data)
    },
    successDown(data) {
      const url = '/ajax/vpdn/ip/success/export'
      return ajax(url, data)
    }
  },
  speedLimit: {
    // 检查是否开启【VPDN限速】
    checkSpeedLimit(data) {
      const url = '/ajax/organization/checkSpeedLimit'
      return ajax(url, data)
    },
    // 检查是否为VPDN套餐
    checkVPDN(data) {
      const url = '/ajax/price/offer/checkVPDN'
      return ajax(url, data)
    },
    list(data) {
      const url = '/ajax/speedLimit/list'
      return ajax(url, data)
    },
    create(data) {
      const url = '/ajax/speedLimit/create'
      return ajax(url, data)
    },
    update(data) {
      const url = '/ajax/speedLimit/update'
      return ajax(url, data)
    },
    speedLevelList() {
      const url = '/ajax/speedLimit/level/list'
      return ajax(url)
    }
  },
  networkStatus: {
    cardInfo(data) {
      const url = '/ajax/vpdn/networkStatus/cardInfo'
      return ajax(url, data)
    },
    links(data) {
      const url = '/ajax/vpdn/networkStatus/links'
      return ajax(url, data)
    },
    ping(data) {
      const url = '/ajax/vpdn/networkStatus/ping'
      return ajax(url, data)
    },
    networkInfo(data) {
      const url = '/ajax/vpdn/networkInfo'
      return ajax(url, data)
    }
  },
  rule: {
    list(data) {
      const url = '/ajax/rule/list'
      return ajax(url, data)
    },
    get(data) {
      const url = '/ajax/rule/get'
      return ajax(url, data)
    },
    update(data) {
      const url = '/ajax/rule/update'
      return ajax(url, data)
    },
    add(data) {
      const url = '/ajax/rule/add'
      return ajax(url, data)
    }
  },
  util: {
    change(data) {
      const url = '/ajax/vpdn/util/change'
      return ajax(url, data)
    },
    whitelistTag(data) {
      const url = '/ajax/vpdn/util/whitelist'
      return ajax(url, data)
    },
    postEpNetIpConfig(data) {
      const url = '/ajax/vpdn/util/epnet/init'
      return ajax(url, data)
    },
    changeStatus(data) {
      const url = '/ajax/vpdnTool/changeStatus'
      return ajax(url, data)
    },
    async queryStatus(data) {
      const url = '/ajax/vpdnTool/queryStatus'
      return ajax(url, data)
    },
    export(data) {
      const url = '/ajax/vpdnTool/export'
      return ajax(url, data)
    }
  }
}
