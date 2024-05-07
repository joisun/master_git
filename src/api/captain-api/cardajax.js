/**
 * Created by zeter on 2017/4/13.
 */

import { ajax } from '../api-tool'
const cardLocationBind = {
  cardLocationBindList: (data) => ajax('/ajax/cardLocationBind/list', data, { system: 'captain' }),
  cardLocationBindDone: (data) => ajax('/ajax/cardLocationBind/done', data, { system: 'captain' }),
  cardLocationBindExport: (data) =>
    ajax('/ajax/cardLocationBind/export', data, { system: 'captain' })
}
export default {
  transfer: {
    //套餐转移记录列表
    list: (data) =>
      ajax('/ajax/deviceRatePlan/tool/transfer/list', data, {
        system: 'captain'
      }),
    // 被转卡可转套餐列表接口
    getCanTransferList: (data) =>
      ajax('/ajax/deviceRatePlan/tool/transfer/getCanTransferList', data, {
        system: 'captain'
      }),
    // 套餐转移校验
    check: (data) =>
      ajax('/ajax/deviceRatePlan/tool/transfer/check', data, {
        system: 'captain'
      }),
    // 套餐转移记录详情
    detail: (data) =>
      ajax('/ajax/deviceRatePlan/tool/transfer/detail', data, {
        system: 'captain'
      }),
    // 套餐转移
    transfer: (data) =>
      ajax('/ajax/deviceRatePlan/tool/transfer', data, {
        system: 'captain'
      }),
    // 套餐转移记录详情-套餐列表
    detailDrpList: (data) =>
      ajax('/ajax/deviceRatePlan/tool/transfer/detail/drpList', data, {
        system: 'captain'
      })
  },
  publicVpdn: {
    // 合规账号变更记录
    list: (data) =>
      ajax('/ajax//cardModification/listCompliance', data, {
        system: 'captain'
      }),
    // 合规账号变更选项
    listChargeCategoryId4Compliance: (data) =>
      ajax('/ajax/cardModification/listChargeCategoryId4Compliance', data, {
        system: 'captain'
      }),

    // 合规账号变更
    modifyCarrierAccount4Compliance: (data) =>
      ajax('/ajax/cardModification/modifyCarrierAccount4Compliance', data, {
        system: 'captain'
      }),
    // 合规账号变更卡号校验
    validateCarrierAccount4Compliance: (data) =>
      ajax('/ajax/cardModification/validateCarrierAccount4Compliance', data, {
        system: 'captain'
      })
  },
  output: (data) => ajax('/ajax/deviceBase/deviceOutput', data, { system: 'captain' }),

  /**
   * 卡出库订单搜索
   *
   * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/order-online-api/order-mgt
   *
   * @param query_str {string}
   */
  orderSearch(data) {
    const url = '/ajax/cardOrder/queryDeliveringOrder'
    return ajax(url, data)
  },

  // 一键填充
  autoFill(orderNo) {
    const url = '/ajax/deviceBase/autoFillCardByOrder'
    return ajax(url, { order_no: orderNo })
  },

  // 出库时，查询订单成本
  getOrderCost(params) {
    const url = '/deviceBase/getOrderCost'
    return ajax(url, params)
  },

  /**
   * 获取卡列表
   *
   * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/device-base-api#%E8%8E%B7%E5%8F%96%E5%8D%A1%E5%88%97%E8%A1%A8
   * @param data
   */
  get(data) {
    const url = '/ajax/deviceBase/list'
    return ajax(url, data)
  },
  // 获取卡详情
  detail(data) {
    const url = '/ajax/deviceBase/detail'
    return ajax(url, data)
  },

  exportCardCount(data) {
    const url = '/ajax/deviceBase/export/count'
    return ajax(url, data)
  },

  export2CardData(data) {
    const url = '/ajax/deviceBase/export2'
    return ajax(url, data)
  },
  exportCardData(data) {
    const url = '/ajax/deviceBase/export'
    return ajax(url, data)
  },
  // 导出过期卡
  exportExpiredData() {
    const url = '/ajax/deviceBase/exportActivationDurationExpiredCard'
    return ajax(url)
  },
  // 查询卡状态变更记录
  listStatusRecords(data) {
    const url = '/ajax/deviceBase/listStatusRecords'
    return ajax(url, data)
  },
  listStatusRecordsV2(data) {
    const url = '/ajax/deviceBase/listStatusRecordsV2'
    return ajax(url, data)
  },
  statistic: {
    /**
     * 获取卡统计信息
     *
     * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/device-base-api#%E8%8E%B7%E5%8F%96%E7%BB%9F%E8%AE%A1%E4%BF%A1%E6%81%AF
     *
     * @param status {string} inventory/delivered/空串 ， 空串为获取全部
     */
    get(status = '') {
      const url = '/ajax/deviceBase/collectStatistics'
      return ajax(url, { status })
    }
  },

  store: {
    history: {
      /**
       * 获取卡出入库记录
       *
       * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/device-base-api#%E5%87%BA%E5%BA%93-%E5%85%A5%E5%BA%93%E8%AE%B0%E5%BD%95
       *
       * @param type {string} 出库/入库（export/import）
       * @param pageNo {int} 页码
       * @param pageSize {int} 每页最大记录数
       */
      get(type, pageNo = 1, pageSize = 20) {
        const url = '/ajax/deviceBase/queryInOutRecordList'
        return ajax(url, { type, page_index: pageNo, page_size: pageSize })
      },
      /**
       * 获取卡出入库记录，新加接口@吴焰冰
       *
       */
      getV2(data) {
        const url = '/ajax/deviceBase/queryInventoryOutRecordList'
        return ajax(url, data)
      }
    },

    clearFailCard(id) {
      const url = '/ajax/deviceBase/clearInputFaildCard'
      return ajax(url, { baseOperationId: id })
    }
  },

  broker: {
    /**
     * 获取运营商账号列表
     *
     * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/device-base-api#%E8%8E%B7%E5%8F%96%E8%BF%90%E8%90%A5%E5%95%86%E8%B4%A6%E5%8F%B7%E5%88%97%E8%A1%A8
     *
     * @param carrier {string} chinanet/cmcc/unicom
     * @return {Promise}
     */
    get(carrier) {
      const url = '/ajax/deviceBase/listAccount'
      return ajax(url, { carrier })
    }
  },

  tags: {
    // 获取卡标
    list(data) {
      const url = '/ajax/deviceBase/tags'
      return ajax(url, data)
    }
  },

  // 销卡工具
  retiring: {
    apply(data) {
      const url = '/ajax/cardRetiring/submit'
      return ajax(url, data, {}, false, 0)
    },
    query(data) {
      const url = '/ajax/cardRetiring/list/my'
      return ajax(url, data)
    },
    finish(data) {
      const url = '/ajax/cardRetiring/finish'
      return ajax(url, data)
    },
    refuse(data) {
      const url = '/ajax/cardRetiring/refuse'
      return ajax(url, data)
    },
    export(data) {
      const url = '/ajax/cardRetiring/export/my'
      return ajax(url, data)
    },
    list(data) {
      const url = '/ajax/cardRetiring/list/todo'
      return ajax(url, data)
    },
    listExport(data) {
      const url = '/ajax/cardRetiring/export/todo'
      return ajax(url, data)
    },
    listOver(data) {
      const url = '/ajax/cardRetiring/list/over'
      return ajax(url, data)
    },
    listOverExport(data) {
      const url = '/ajax/cardRetiring/export/over'
      return ajax(url, data)
    },
    realSearch(data) {
      const url = '/ajax/cardRetiring/search'
      return ajax(url, data)
    },
    // 根据iccids检查不销卡的客户
    checkNoRetiredIccid(data) {
      const url = '/ajax/cardRetiring/checkNoRetired/iccids'
      return ajax(url, data)
    },
    // 导出前检查不销卡的客户
    checkNoRetiredBeforeExport(data) {
      const url = '/ajax/cardRetiring/checkNoRetired/export/todo'
      return ajax(url, data)
    }
  },

  // 获取路由列表
  getRoute() {
    const url = '/ajax/router/listAll'
    return ajax(url)
  },

  // 改套餐列表
  modifyPackageList(data) {
    const url = '/ajax/cardModifyTool/list'
    return ajax(url, data)
  },
  modifyPlanCheck(data) {
    const url = '/ajax/cardModifyTool/validateCustomerRatePlanChangeIccid'
    return ajax(url, data)
  },
  getModifyPlanList(data) {
    const url = '/ajax/cardModifyTool/listAvailableChangeCustomerRatePlan'
    return ajax(url, data)
  },
  modifyPlanCheckPlan(data) {
    const url = '/ajax/cardModifyTool/validateChangeCustomerRatePlan'
    return ajax(url, data)
  },
  customerModifyPlan(data) {
    const url = '/ajax/cardModifyTool/changeCustomerRatePlan'
    return ajax(url, data)
  },
  // 运营商改套餐
  modifyInPackageSubmit(data) {
    const url = '/ajax/cardModifyTool/modify'
    return ajax(url, data)
  },
  modifyInPackageCheck(data) {
    const url = '/ajax/cardModifyTool/validateIccids'
    return ajax(url, data)
  },
  cancelCarrierTesting(data) {
    const url = '/ajax/cardOperation/cancelTest'
    return ajax(url, data)
  },
  // 入库记录卡号获取
  innerStoreRecordGet(data) {
    const url = '/ajax/deviceBase/exportDeviceInRecord'
    return ajax(url, data)
  },
  // 出库记录卡号获取
  outStoreRecordGet(data) {
    const url = '/ajax/deviceBase/exportDeviceOutRecord'
    return ajax(url, data)
  },

  // 获取账户变更记录
  getCarrierAccountModifications(data) {
    const url = '/ajax/cardModification/getCarrierAccountModifications'
    return ajax(url, data)
  },
  // 运营商账户变更校验账号
  validateCarrierAccountModification: (data) =>
    ajax('/ajax//cardModification/validateModification', data),
  calcuteTotalPriceOffer: (data) => ajax('/ajax/cardModification/calcuteTotalPriceOffer', data),
  modifyCarrierAccount: (data) => ajax('/ajax/cardModification/modifyCarrierAccount', data),
  postReceiveNote: (data) => ajax('/ajax/deviceBase/inputDeviceByCharge', data),
  cancelPlanApplyList: (data) => ajax('/ajax/cardModifyTool/listCancelRatePlateRecords', data),
  cancelPlanApplyValidate: (data) => ajax('/ajax/cardModifyTool/validateCancelRatePlanIccid', data),
  cancelPlanApplyPost: (data) => ajax('/ajax/cardModifyTool/deleteCancelRatePlan', data),
  cancelPlanApplyPlanListGet: (data) => ajax('/ajax/cardModifyTool/listCanDeleteDrp', data),
  cancelPlanApplyDetailDown: (data) => ajax('/ajax/cardModifyTool/getDownloadUrl', data),
  cancelPlanApplyRestart: (data) => ajax('/ajax/cardModifyTool/sendExportMsg', data),

  getSaleRenewData: (data) => ajax('/ajax/crm/customerRecharge/info', data),
  getSaleRenewExportPath: (data) => ajax('ajax/crm/customerRecharge/export', data),

  organizationSearch: (data) => ajax('/ajax/organization/search', data),
  retainNumber: {
    validate(data) {
      const url = '/ajax/cancelRetainNumber/validate'
      return ajax(url, data)
    },
    cancelRetain(data) {
      const url = '/ajax/cancelRetainNumber/cancelRetain'
      return ajax(url, data)
    },
    getList(data) {
      const url = '/ajax/cancelRetainNumber/list'
      return ajax(url, data)
    }
  },
  ...cardLocationBind,
  eliminateRules: {
    // 销卡恢复
    cardRetiringRecover(data) {
      const url = '/ajax/cardRetiring/recover'
      return ajax(url, data)
    },
    // 根据订单号和客户ID搜索
    retireRuleList(data) {
      const url = '/ajax/retire/rule/list'
      return ajax(url, data)
    },
    // 根据客户ID获取销卡配置
    getRetireConfig(data) {
      const url = '/ajax/retire/rule/getRetireConfig'
      return ajax(url, data)
    },
    // 根据客户ID修改销卡配置
    updateRetireConfig(data) {
      const url = '/ajax/retire/rule/updateRetireConfig'
      return ajax(url, data)
    },
    // 根据订单号变更自动销卡规则(可批量)
    updateRetireRule(data) {
      const url = '/ajax/retire/rule/updateRetireRule'
      return ajax(url, data)
    },
    // 根据订单号查询操作记录
    getHistory(data) {
      const url = '/ajax/retire/rule/getHistory'
      return ajax(url, data)
    }
  },
  autoActive: {
    // 未销卡管理列表
    activateList(data) {
      const url = '/ajax/auto/activate/list'
      return ajax(url, data)
    },
    // 变更生效状态
    modifyStatus(data) {
      const url = '/ajax/auto/activate/modifyStatus'
      return ajax(url, data)
    },
    // 变更生效记录
    history(data) {
      const url = '/ajax/auto/activate/history'
      return ajax(url, data)
    },
    // 自动加入规则客户纬度列表
    autoAddOrgRule(data) {
      const url = '/ajax/auto/activate/org/rule'
      return ajax(url, data)
    },
    // 自动加入规则运营商纬度列表
    autoAddCarrierRule(data) {
      const url = '/ajax/auto/activate/carrier/rule'
      return ajax(url, data)
    },
    // 根据主键id删除规则
    deleteRule(data) {
      const url = '/ajax/auto/activate/delete/rule'
      return ajax(url, data)
    },
    // 添加自动加入规则
    insertRule(data) {
      const url = '/ajax/auto/activate/insert/rule'
      return ajax(url, data)
    }
  }
}
