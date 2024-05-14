/**
 * Created by zeter on 2017/4/13.
 */

import { ajax } from '../api-tool'

export default {
  group: async(date) => {
    let url = '/ajax/salesReport/querySalesGroupReport'
    return ajax(url, {
      queryDate: date
    })
  },
  groupDetail: async(data) => {
    let url = '/ajax/salesReport/querySalesGroupDetailReport'
    return ajax(url, {
      queryDate: data.date,
      groupCode: data.name
    })
  },
  downloadFile: async(startDate, endDate) => {
    let url = '/ajax/salesReport/exportOrder'
    return ajax(url, {
      startDate,
      endDate
    })
  },
  downSalerRenewCount: (data) => ajax('/ajax/salesReport/exportRenewSp', data),
  downSalerBuyCardCount: (data) => ajax('/ajax/salesReport/exportNewSp', data),
  downOtherOtherCount: (data) => ajax('/ajax/salesReport/exportOthers', data)
}
