import { ajax } from '../api-tool'
const flowWarning = {
  /**
   */
  async addTask(data) {
    const url = '/ajax/flow/warning/addTask'
    return ajax(url, data)
  }
}
const accountMatch = {
  /**
   * 变更类型枚举列表
   */
  async accountMatchGetTypeMap(data) {
    const url = '/ajax/accountMatch/getTypeMap'
    return ajax(url, data)
  },
  /**
   * 查询匹配列表
   * params: {
   *   "id": 0,
   *   "oldCarrierId": 0,
   *   "newCarrierId": 0,
   *   "type": 0,
   *   "carrierName": "",
   *   "remark": ""
   * }
   */
  async accountMatchList(data) {
    const url = '/ajax/accountMatch/list'
    return ajax(url, data)
  },
  /**
   * 新增
   * params: {
   *   "id": 0,
   *   "oldCarrierId": 0,
   *   "newCarrierId": 0,
   *   "type": 0,
   *   "carrierName": "",
   *   "remark": ""
   * }
   */
  async accountMatchAdd(data) {
    const url = '/ajax/accountMatch/add'
    return ajax(url, data)
  },
  /**
   * 修改
   * params: {
   *   "id": 0,
   *   "oldCarrierId": 0,
   *   "newCarrierId": 0,
   *   "type": 0,
   *   "carrierName": "",
   *   "remark": ""
   * }
   */
  async accountMatchUpdate(data) {
    const url = '/ajax/accountMatch/update'
    return ajax(url, data)
  },
  /**
   * 导出列表
   * params: {
   *   "id": 0,
   *   "oldCarrierId": 0,
   *   "remark": ""
   *   "newCarrierId": 0,
   *   "type": 0,
   *   "carrierName": "",
   * }
   */
  async accountMatchExportList(data) {
    const url = '/ajax/accountMatch/exportList'
    return ajax(url, data)
  }
}
const peopleInternetList = {
  /**
   * 查询人联网黑名单
   * params: {
   *   "id": 0,
   *   "carrier": "", 运营商 cmcc, chinanet。。。
   *   "urlOrIp": "",地址或ip
   *   "remark": "",备注
   * }
   */
  async peopleInternetAdd(data) {
    const url = '/ajax/peopleInternet/add'
    return ajax(url, data)
  },
  /**
   * 新增人联网黑名单
   * params: {
   *   "carrier": "", 运营商 cmcc, chinanet 。。。
   * }
   */
  async peopleInternetList(data) {
    const url = '/ajax/peopleInternet/list'
    return ajax(url, data)
  },
  /**
   * 模糊搜索人联网黑名单接口
   * params: {
   * [
   *   {
   *   "id": 0,
   *   "url": "",
   *   "remark": "",
   *   "carrier": ""
   * }
   * ]
   * }
   */
  async peopleInternetListByUrl(data) {
    const url = '/ajax/peopleInternet/listByUrl'
    return ajax(url, data)
  },
  /**
   * 根据id更新
   * params {
   *   "id": 0,
   *   "carrier": "",
   *   "urlOrIp": "",
   *   "remark": ""
   * }
   */
  async peopleInternetUpdate(data) {
    const url = '/ajax/peopleInternet/update'
    return ajax(url, data)
  },
  /**
   * 根据id删除
   * params {
   *   "id": 0,
   * }
   */
  async peopleInternetRemove(data) {
    const url = '/ajax/peopleInternet/remove'
    return ajax(url, data)
  }
}

const configList = {
  /**
   * 工单分页获取iccid
   */
  async getWorkOrderIccidList(data) {
    const url = '/ajax/extWhiteList/workOrder/detail/iccid/list'
    return ajax(url, data)
  },
  /**
   * 池子分页获取iccid
   */
  async getIccidList(data) {
    const url = '/ajax/extWhiteList/detail/iccid/list'
    return ajax(url, data)
  },
  /**
   * 获取各处理状态数量
   */
  async getAllStatusCount(data) {
    const url = '/ajax/extWhiteList/workOrder/getAllStatusCount'
    return ajax(url, data)
  },
  /**
   * 获取文件URL
   */
  async workOrderGetFileUrl(data) {
    const url = '/ajax/extWhiteList/workOrder/getFileUrl'
    return ajax(url, data)
  },
  /**
   * 获取类型
   */
  async listPoolAddressType(data) {
    const url = '/ajax/extWhiteList/workOrder/list/pool/address/type'
    return ajax(url, data)
  },
  /**
   * 获取历史业务名称/模版
   */
  async listPoolAddress(data) {
    const url = '/ajax/extWhiteList/workOrder/list/pool/address'
    return ajax(url, data)
  },
  /**
   * 支持白名单运营商配置列表
   */
  async workOrderCarrierConfigList(data) {
    const url = '/ajax/extWhiteList/workOrder/carrier/config/list'
    return ajax(url, data)
  },
  /**
   * 支持白名单运营商配置删除
   */
  async workOrderCarrierConfigDelete(data) {
    const url = '/ajax/extWhiteList/workOrder/carrier/config/delete'
    return ajax(url, data)
  },
  /**
   * 支持白名单运营商配置目的新增
   */
  async workOrderCarrierConfigPuerposeInsert(data) {
    const url = '/ajax/extWhiteList/workOrder/carrier/config/purpose/insert'
    return ajax(url, data)
  },
  /**
   * 支持白名单运营商配置目的列表
   */
  async workOrderCarrierConfigPuerposeList(data) {
    const url = '/ajax/extWhiteList/workOrder/carrier/config/purpose/list'
    return ajax(url, data)
  },
  /**
   * 支持白名单运营商配置新增
   */
  async workOrderCarrierConfigInsert(data) {
    const url = '/ajax/extWhiteList/workOrder/carrier/config/insert'
    return ajax(url, data)
  },
  /**
   * 获取业务名称
   */
  async getBusinessName(data) {
    const url = '/ajax/extWhiteList/workOrder/getBusinessName'
    return ajax(url, data)
  },
  /**
   * 修改上传文件fileKey
   */
  async workOrderConfigFileUpdate(data) {
    const url = '/ajax/extWhiteList/workOrder/config/file/update'
    return ajax(url, data)
  },
  /**
   * ip域名导出
   */
  async workOrderExportPoolAddress(data) {
    const url = '/ajax/extWhiteList/workOrder/exportPool/address'
    return ajax(url, data)
  },
  /**
   * iccid导出
   */
  async workOrderExportPoolIccid(data) {
    const url = '/ajax/extWhiteList/workOrder/exportPool/iccid'
    return ajax(url, data)
  },
  /**
   * 审核
   */
  async workOrderConfigReview(data) {
    const url = '/ajax/extWhiteList/workOrder/config/review'
    return ajax(url, data)
  },
  /**
   * 公网白名单配置列表
   */
  async workOrderList(data) {
    const url = '/ajax/extWhiteList/workOrder/list'
    return ajax(url, data)
  },

  /**
   * 新增或修改 公网白名单配置
   * id为空表示新增 配置
   * pool_id为空表示新增 白名单池
   * */
  async workOrderSave(data) {
    const url = '/ajax/extWhiteList/workOrder/save'
    return ajax(url, data)
  },
  /**
   * 配置中
   ids用于 多选框选择批量 配置中
   其他参数用于 搜索条件配置中
   如果出现ids 和搜索条件都有值，按ids配置
   * */
  async configCommit(data) {
    const url = '/ajax/extWhiteList/workOrder/config/commit'
    return ajax(url, data)
  },
  /**
   * 公网白名单工单详情
   * */
  async workOrderDetail(data) {
    const url = '/ajax/extWhiteList/workOrder/detail'
    return ajax(url, data)
  },
  /**
   * 配置完成
   * */
  async configSuccess(data) {
    const url = '/ajax/extWhiteList/workOrder/config/success'
    return ajax(url, data)
  },
  /**
   * 驳回
   * */
  async configRefuse(data) {
    const url = '/ajax/extWhiteList/workOrder/config/refuse'
    return ajax(url, data)
  },
  /**
   * 重新配置
   * */
  async configReConfig(data) {
    const url = '/ajax/extWhiteList/workOrder/config/reConfig'
    return ajax(url, data)
  },
  /**
   * 白名单配置导出
   * */
  async exportPool(data) {
    const url = '/ajax/extWhiteList/workOrder/exportPool'
    return ajax(url, data)
  }
}
const extWhiteList = {
  async workOrderSaveCheck(data) {
    const url = '/ajax/extWhiteList/workOrder/save/check'
    return ajax(url, data)
  },
  /**
   * 公网白名单列表
   * */
  async extWhiteList(data) {
    const url = '/ajax/extWhiteList/listPool'
    return ajax(url, data)
  },
  /**
   * 公网白名单导出
   * */
  async extWhiteExport(data) {
    const url = '/ajax/extWhiteList/exportPool'
    return ajax(url, data)
  },
  /**
   * 公网白名单详情
   * */
  async extWhiteListDetail(data) {
    const url = '/ajax/extWhiteList/detail'
    return ajax(url, data)
  }
}
const change = {
  async cardLimitationChangeList(data) {
    const url = '/ajax/cardLimitation/change/list'
    return ajax(url, data)
  },
  async cardLimitationChangeCreate(data) {
    const url = '/ajax/cardLimitation/change/create'
    return ajax(url, data)
  },
  async cardLimitationChangeDetail(data) {
    const url = '/ajax/cardLimitation/change/detail'
    return ajax(url, data)
  },
  async cardLimitationChangeImport(data) {
    const url = '/ajax/cardLimitation/change/import'
    return ajax(url, data)
  }
}
export default {
  async getWhiteList(data) {
    const url = '/ajax/blackWhiteList/listWhiteList'
    return ajax(url, data)
  },
  async saveWhiteList(data) {
    const url = '/ajax/blackWhiteList/save'
    return ajax(url, data)
  },
  async getReasonList(data) {
    const url = '/ajax/blackWhiteList/listReason'
    return ajax(url, data)
  },
  async cancelWhiteList(data) {
    const url = '/ajax/blackWhiteList/cancel'
    return ajax(url, data)
  },
  async getExtWhiteList(data) {
    const url = '/ajax/extWhiteList/listPoolByStatus'
    return ajax(url, data)
  },
  async extWhiteListRefuse(data) {
    const url = '/ajax/extWhiteList/refuse'
    return ajax(url, data)
  },
  async extWhiteListReConfig(data) {
    const url = '/ajax/extWhiteList/reConfig'
    return ajax(url, data)
  },
  async extWhiteListExportPool(data) {
    const url = '/ajax/extWhiteList/exportPool'
    return ajax(url, data)
  },
  async extWhiteListConfigSuccess(data) {
    const url = '/ajax/extWhiteList/config/success'
    return ajax(url, data)
  },
  ...configList,
  ...extWhiteList,
  ...change,
  ...peopleInternetList,
  ...accountMatch,
  ...flowWarning,
  // 变更列表和我的代办
  async complianceList(data) {
    const url = '/ajax/compliance/list'
    return ajax(url, data)
  },
  async complianceMyList(data) {
    const url = '/ajax/compliance/myList'
    return ajax(url, data)
  },
  // 通过流程编号获取详情
  async getInfoByFlowNo(data) {
    const url = '/ajax/compliance/getInfoByFlowNo'
    return ajax(url, data)
  },
  // 根据iccids查询套餐
  async getPriceOfferByIccids(data) {
    const url = '/ajax/compliance/getPriceOfferByIccids'
    return ajax(url, data)
  },
  // 新增转VPDN/转公网限额
  // 新增转公网白名单
  async complianceSubmit(data) {
    const url = '/ajax/compliance/submit'
    return ajax(url, data)
  },

  // 是否是运营或者供应链（运营或供应链提交时可以不写白名单或者客户信息）
  async opOrSu(data) {
    const url = '/ajax/compliance/opOrSu'
    return ajax(url, data)
  },
  // 编辑
  async complianceSaveAndSubmit(data) {
    const url = '/ajax/compliance/saveAndSubmit'
    return ajax(url, data)
  },
  // 审核接口
  async complianceProcess(data) {
    const url = '/ajax/compliance/process'
    return ajax(url, data)
  },
  // 提交运营商变更时excel文件的获取
  async complianceGetFile(data) {
    const url = '/ajax/compliance/getFile'
    return ajax(url, data)
  },
  // 查询是否可关闭
  async complianceCanClose(data) {
    const url = '/ajax/compliance/canClose'
    return ajax(url, data)
  },
  // 关闭申请单
  async complianceClose(data) {
    const url = '/ajax/compliance/close'
    return ajax(url, data)
  },
  // 获取处理历史
  async complianceGetHistory(data) {
    const url = '/ajax/compliance/getHistory'
    return ajax(url, data)
  },
  // 客户套餐变更分组
  async validateCustomerRatePlanChangeIccid(data) {
    const url = '/ajax/compliance/validateCustomerRatePlanChangeIccid'
    return ajax(url, data)
  },
  // 公网白名单工单列表（用于群组号填写）
  async listExtWhiteList(data) {
    const url = '/ajax/compliance/listExtWhiteList'
    return ajax(url, data)
  },
  // 客户套餐变更选项
  async listAvailableChangeCustomerRatePlan(data) {
    const url = '/ajax/compliance/listAvailableChangeCustomerRatePlan'
    return ajax(url, data)
  },
  // 运营商套餐变更分组显示
  async validateCarrierAccount4Compliance(data) {
    const url = '/ajax/compliance/validateCarrierAccount4Compliance'
    return ajax(url, data)
  },
  // 运营商套餐变更选项
  async listChargeCategoryId4Compliance(data) {
    const url = '/ajax/compliance/listChargeCategoryId4Compliance'
    return ajax(url, data)
  },
  // 销售套餐价格展示
  async listSalePriceChange(data) {
    const url = '/ajax/compliance/listSalePriceChange'
    return ajax(url, data)
  },

  // 查询列表，返回相同signedCarrierId 运营商列表
  async listSameSignedCarrierAccountList(data) {
    const url = '/ajax/carrierAccount/listSameSignedCarrierAccountList'
    return ajax(url, data)
  }
}
