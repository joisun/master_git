/**
 * Created by zeter on 2017/4/13.
 */

import {ajax} from '../api-tool'

export default {
  list: async(data) => {
    const url = '/ajax/cardPool/list/sys'
    return ajax(url, data)
  },
  history: async(data) => {
    let url = '/ajax/cardPool/sys/history'
    return ajax(url, data)
  },
  details: async(data) => {
    let url = '/ajax/cardPool/sys/details'
    return ajax(url, data)
  },
  activePoolCard: async(iccids) => {
    let url = '/ajax/deviceBase/activeDevice'
    return ajax(url, {
      iccids: iccids
    })
  },
  validatorPoolCard: async(iccids) => {
    let url = '/ajax/deviceBase/validateActiveDevice'
    return ajax(url, {
      iccids: iccids
    })
  },
  queryAlarm: async(data) => {
    let url = '/ajax/eventTrigger/pool/show'
    return ajax(url)
  },
  sureAlarm: async(data) => {
    let url = '/ajax/eventTrigger/pool/insert'
    return ajax(url, {
      notifyPhone: data.notifyPhone,
      notifyEmail: data.notifyEmail,
      notifyOption: data.notifyOption,
      warningThreshold: data.warningThreshold,
      criticalThreshold: data.criticalThreshold,
      fatalThreshold: data.fatalThreshold
    })
  },
  userList: async(data) => {
    let url = '/ajax/cardPool/list/user'
    return ajax(url, data)
  },
  userDetails: async(data) => {
    let url = '/ajax/cardPool/user/details'
    return ajax(url, data)
  },
  getPoolSize: async(carrier) => {
    let url = '/ajax/cardPool/size'
    return ajax(url, {
      carrier: carrier
    })
  },
  oversell: async(data) => {
    let url = '/ajax/cardPool/sys/oversell/details'
    return ajax(url, data)
  },
  dailyVolume: async(data) => {
    let url = '/ajax/cardPool/dailyUsage'
    return ajax(url, data)
  },
  userPoolStopCard: async(data) => {
    let url = '/ajax/eventTrigger/pool/setUpperLimit'
    return ajax(url, data)
  },
  volumeOperationSupplier: async(data) => {
    let url = '/ajax/cardPool/volumeOperation/supplier'
    return ajax(url, data)
  },
  volumeOperationCustomer: async(data) => {
    let url = '/ajax/cardPool/volumeOperation/customer'
    return ajax(url, data)
  },
  volumeOperationOthers: async(data) => {
    let url = '/ajax/cardPool/volumeOperation/others'
    return ajax(url, data)
  },
  volumeOperationCustomerDetail: async(data) => {
    let url = '/ajax/cardPool/volumeOperation/customer/detail'
    return ajax(url, data)
  },
  exportTable: async(data, type) => {
    const url = type === 0 ? '/ajax/cardPool/sys/details/export' : '/ajax/cardPool/sys/userDetails/export'
    return ajax(url, data)
  },
  cardList: async(data) => {
    const url = '/ajax/cardPool/sys/cardlist'
    return ajax(url, data)
  },
  volumeStatistic: async(data) => {
    const url = '/ajax/cardPool/volumeOperation/statistic'
    return ajax(url, data)
  }
}
