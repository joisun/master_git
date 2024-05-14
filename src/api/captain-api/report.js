/**
 * Created by zeter on 2017/4/13.
 */

import {ajax} from '../api-tool'

export default {
  getDetailData: (data) => ajax('/ajax/operateReport/listOutCardStatistic', data),
  getOrderData: (data) => ajax('/ajax/operateReport/listTopNBuyOrderStatistic', data),
  getRenewalData: (data) => ajax('/ajax/operateReport/listTopNRechargeOrderStatistic', data),
  saleReport: (data) => ajax('/ajax/operateReport/salesReport/export', data),
  getSaleReportEnum: () => ajax('/ajax/operateReport/getReportEnums'),
  getStoreManageReportData: (data) => ajax('/ajax/operateReport/queryDeviceBaseReport', data)
}
