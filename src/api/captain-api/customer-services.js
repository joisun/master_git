import { ajax } from '../api-tool'

const packageReset = {
  deviceBatchResetDrp(data) {
    const url = '/ajax/2.0/device/batchResetDrp'
    return ajax(url, { ...data }, { system: 'api' })
  },
  listByIccid(data) {
    const url = '/ajax/wja/deviceRatePlan/listByIccid'
    return ajax(url, { ...data })
  },
  updateDeviceRatePlan(data) {
    const url = '/ajax/wja/deviceRatePlan/update'
    return ajax(url, { ...data })
  }
}
export default {
  /**
   *强制激活设备状态
   * params {
   *   "iccids": "",
   *   "remark": ""
   * }
   *
   * return {
   *   "success": [
   *     ""
   *   ],
   *   "failed": [
   *     ""
   *   ]
   * }
   */
  activeStatus(data) {
    const url = '/ajax/service/tool/activeStatus'
    return ajax(url, { ...data })
  },
  /**
   * 激活停卡
   * params {
   *   "iccids": "",
   *   "statusType": "",
   *   "action": "",
   *   "remark": ""
   * }
   *
   * return {
   *   "success": [
   *     ""
   *   ],
   *   "failed": [
   *     ""
   *   ]
   * }
   */
  modifyDeviceStatus(data) {
    const url = '/ajax/service/tool/modifyDeviceStatus'
    return ajax(url, { ...data })
  },
  /**
   *  imei解绑
   * params {
   *   "iccids": "",
   *   "remark": ""
   * }
   *
   * return
   */
  imeiUnbind(data) {
    const url = '/ajax/service/tool/imeiUnbind'
    return ajax(url, { ...data })
  },
  /**
   *  卡打标
   * params {
   *   "mergTags": [
   *     0
   *   ],
   *   "activeDeadline": "2022-11-03",
   *   "iccids": "",
   *   "action": "",
   *   "remark": ""
   *
   * }
   *
   * return
   */
  modifyCardTags(data) {
    const url = '/ajax/service/tool/modifyCardTags'
    return ajax(url, { ...data })
  },
  /**
   *  iccid互转
   * params {
   *   "iccids": "",
   *   "msisdns": "",
   *   "imsis": "",
   *   "ips": ""
   * }
   *
   * return {
   *   "iccid": "",
   *   "statusChangeReason": "",
   *   "msisdn": "",
   *   "orgId": 0,
   *   "orgName": "",
   *   "carriorAccountId": 0,
   *   "status": "",
   *   "carrier": "",
   *   "importDate": "2022-11-03 15:35:00",
   *   "exportDate": "2022-11-03 15:35:00",
   *   "orderNo": "",
   *   "bcsId": 0,
   *   "importResult": "",
   *   "importRecordId": 0,
   *   "exportRecordId": 0,
   *   "gmtCreated": "2022-11-03 15:35:00",
   *   "gmtModified": "2022-11-03 15:35:00",
   *   "type": "",
   *   "activationDeadline": "2022-11-03 15:35:00",
   *   "poolId": 0,
   *   "lockDate": "2022-11-03 15:35:00",
   *   "iccidSt": "",
   *   "iccidEd": "",
   *   "importErrorMsg": "",
   *   "tag": 0,
   *   "totalDataVolume": 0,
   *   "importDataVolume": 0,
   *   "customDataVolume": 0,
   *   "testDeadline": "2022-11-03 15:35:00",
   *   "testDataVolume": 0,
   *   "firstMonthDataVolume": 0,
   *   "refCategory": "",
   *   "ip": "",
   *   "apn": "",
   *   "imsi": "",
   *   "importBatchNo": "",
   *   "exportBatchNo": "",
   *   "lockStatus": "",
   *   "cardSpecification": "",
   *   "cardMaterial": "",
   *   "routerIp": "",
   *   "validity": 0,
   *   "validityUnit": "",
   *   "cardPeriod": 0
   * }
   */
  batchQueryDeviceInfo(data) {
    const url = '/ajax/service/tool/batchQueryDeviceInfo'
    return ajax(url, { ...data })
  },
  /**
   *  iccid导出
   * params {
   *   "iccids": "",
   *   "msisdns": "",
   *   "imsis": "",
   *   "ips": ""
   * }
   *
   * return
   */
  batchQueryDeviceInfoExport(data) {
    const url = '/ajax/service/tool/batchQueryDeviceInfo/export'
    return ajax(url, { ...data })
  },
  /**
   *  卡详单导出
   * params {
   *   "iccid": "",
   *   "start": "",yyyy-MM-dd HH:mm:ss
   *   "end": ""yyyy-MM-dd HH:mm:ss
   * }
   *
   * return
   */
  deviceDetailExport(data) {
    const url = '/ajax/service/tool/deviceDetailExport'
    return ajax(url, { ...data })
  },
  /**
   * 操作日志查询
   * params {
   *
   *   "empName": "",
   *   "business": "",
   *   "currentPage": 0,
   *   "pageSize": 0
   *
   * }
   *
   * return
   */
  toolLog(data) {
    const url = '/ajax/service/tool/log'
    return ajax(url, { ...data })
  },
  /**
   * 导出失败或成功的iccid
   * params {
   *   "id": 0,
   *   "exportType": 0
   * }
   *
   * return
   */
  toolLogExport(data) {
    const url = '/ajax/service/tool/log/export'
    return ajax(url, { ...data })
  },
  ...packageReset
}
