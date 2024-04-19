/**
 * Created by zeter on 2017/4/13.
 */

import { ajax } from '../api-tool'

export default {
  resetPwd(data) {
    const url = '/ajax/organization/reset/password'
    return ajax(url, data)
  },
  enterSystem(data) {
    const url = '/ajax/customers/go_sys'
    return ajax(url, data, { system: 'dashboard' })
  },
  oaContract: {
    // 获取国家代码
    getCountryCode(data) {
      const url = '/ajax/oa/getCountryCode'
      return ajax(url, data)
    },
    // 获取合同编号
    getContractNo(data) {
      const url = '/ajax/oa/getContractNo'
      return ajax(url, data)
    },
    // 流程1保存提交
    saveOrSubmitProcessOne(data) {
      const url = '/ajax/oa/saveOrSubmitProcessOne'
      return ajax(url, data)
    },
    // 流程2 保存提交
    saveOrSubmitProcessTwo(data) {
      const url = '/ajax/oa/saveOrSubmitProcessTwo'
      return ajax(url, data)
    },
    // 流程1更新提交
    updateProcessOne(data) {
      const url = '/ajax/oa/updateProcessOne'
      return ajax(url, data)
    },
    // 流程2更新提交
    updateProcessTwo(data) {
      const url = '/ajax/oa/updateProcessTwo'
      return ajax(url, data)
    },
    submitProcessOne(data) {
      const url = '/ajax/oa/submitProcessOne'
      return ajax(url, data)
    },
    submitProcessTwo(data) {
      const url = '/ajax/oa/submitProcessTwo'
      return ajax(url, data)
    },
    // 删除记录
    delete(data) {
      const url = '/ajax/oa/delete'
      return ajax(url, data)
    },
    // 列表数据
    list(data) {
      const url = '/ajax/oa/list'
      return ajax(url, data)
    },
    // 根据审批单号获取审批详情
    getSpInfo(data) {
      const url = '/ajax/oa/getSpInfo'
      return ajax(url, data)
    },
    // 复制
    copyById(data) {
      const url = '/ajax/oa/copyById'
      return ajax(url, data)
    }
  },
  h5Manage: {
    // 新增H5配置
    insertH5Config(data) {
      const url = '/ajax/h5/insertH5Config'
      return ajax(url, data)
    },
    // 获取H5 配置
    getH5Config(data) {
      const url = '/ajax/h5/getH5Config'
      return ajax(url, data)
    },
    // 更新H5配置
    updateH5Config(data) {
      const url = '/ajax/h5/updateH5Config'
      return ajax(url, data)
    },
    // 获取列表
    getList(data) {
      const url = '/ajax/h5/getList'
      return ajax(url, data)
    }
  },
  balance: {
    get(data) {
      const url = '/ajax/balance/getBalance'
      return ajax(url, data)
    },
    setThreshold(data) {
      const url = '/ajax/balance/setDebtThreshold'
      return ajax(url, data)
    }
  },

  list: {
    /**
     *  获取用户下的所有系统报价和销售报价
     *
     *  wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/customer-manage/dc-org-list
     *
     *  @param orgId {int} 组织ID
     */
    get(data, idx = true) {
      const url = idx ? '/ajax/organization/list' : '/ajax/organization/level2/list'
      return ajax(url, data)
    },
    level2List(data) {
      const url = '/ajax/organization/listLevel2'
      return ajax(url, data)
    },
    update(data) {
      const url = '/ajax/organization/update'
      return ajax(url, data)
    },
    roleList() {
      const url = '/ajax/role/list'
      return ajax(url)
    },
    orgHasUser(data) {
      const url = '/ajax/user/orgAdmin'
      return ajax(url, data)
    },
    nextList(data) {
      const url = '/ajax/organization/next/list'
      return ajax(url, data)
    },
    // 配额
    recharge(data) {
      const url = '/ajax/balance/recharge'
      return ajax(url, data)
    },
    refund(data) {
      const url = '/ajax/balance/refund'
      return ajax(url, data)
    },
    deductWithInternation: (data) => ajax('/ajax/balance/deductWithIntlCard', data)
  },

  info(data) {
    const url = '/ajax/organization/level2/detail'
    return ajax(url, data)
  },

  changeAccount(data) {
    const url = '/ajax/user/changeAccount'
    return ajax(url, data)
  },

  wx: {
    getWxConfig(userId) {
      const url = '/ajax/wxConfig/get'
      return ajax(url, { user_id: userId })
    },
    setWxConfig(data) {
      const url = '/ajax/wxConfig/save'
      return ajax(url, data)
    }
  },

  orgUser: {
    createOrg(data) {
      const url = '/ajax/organization/create'
      return ajax(url, data)
    },
    create_user(data) {
      const url = '/ajax/user/create'
      return ajax(url, data)
    }
  },

  combine: {
    listByOrgId(data) {
      const url = '/ajax/combination/listByOrgId'
      return ajax(url, data)
    },
    shelves(data) {
      const url = '/ajax/combination/shelves'
      return ajax(url, data)
    }
  },
  priceTable: {
    getRecentlyOfferId(data) {
      const url = '/ajax/price/offer/custom/exclusive/getRecentlyOfferId'
      return ajax(url, data)
    },
    exclusiveRemove(data) {
      const url = '/ajax/price/offer/custom/exclusive/remove'
      return ajax(url, data)
    },
    exclusiveAdd(data) {
      const url = '/ajax/price/offer/custom/exclusive/add'
      return ajax(url, data)
    },
    exclusive(data) {
      const url = '/ajax/price/offer/custom/exclusive'
      return ajax(url, data)
    },
    /**
     *  获取用户下的所有系统报价和销售报价
     *
     *  wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/price-offer-mgt#3-%E8%8E%B7%E5%8F%96%E7%94%A8%E6%88%B7%E4%B8%8B%E7%9A%84%E6%89%80%E6%9C%89%E7%B3%BB%E7%BB%9F%E6%8A%A5%E4%BB%B7%E5%92%8C%E9%94%80%E5%94%AE%E6%8A%A5%E4%BB%B7
     *
     *  @param orgId {int} 组织ID
     */
    get(data) {
      const url = '/ajax/price/offer/custom'
      return ajax(url, data)
    },

    /**
     * 更新单个销售报价
     *
     * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/price-offer-mgt#4-%E4%BF%9D%E5%AD%98%E9%94%80%E5%94%AE%E6%8A%A5%E4%BB%B7
     *
     * @param orgId
     * @param stdPriceId
     * @param sellPrice
     */
    update(orgId, stdPriceId, sellPrice) {
      const url = '/ajax/price/salesOffer/save'
      return ajax(url, { orgId, systemOfferId: stdPriceId, price: sellPrice })
    },
    // 更新报价属性
    save(data) {
      const url = '/ajax/price/sales/properties/save'
      return ajax(url, data)
    },

    // 获取网络产品销售报价列表
    getSalesOfferList(data) {
      const url = '/ajax/offer/listSalesOffer'
      return ajax(url, data)
    },

    // 保存销售报价
    saveSalesOffer(data) {
      const url = '/ajax//offer/saveSalesOffer'
      return ajax(url, data)
    }
  },

  certification: {
    manualWatch(data) {
      const url = '/ajax/enterpriseQualification/manualWatch'
      return ajax(url, data)
    },
    /**
     * 企业资质列表
     *
     * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/enterprise-qualification-api-desc#%E4%BC%81%E4%B8%9A%E8%B5%84%E8%B4%A8%E5%88%97%E8%A1%A8
     *
     * @param pageNo {int}
     * @param pageSize {int}
     * @param companyCertifyStatus {string}
     * @param legalEntityCertifyStatus {string}
     * @param startTime {string}
     * @param endTime {string}
     */
    getAll(data) {
      const url = '/ajax/enterpriseQualification/list'
      return ajax(url, data)
    },

    /**
     * 查询资质信息
     *
     * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/enterprise-qualification-api-desc#%E4%BC%81%E4%B8%9A%E8%B5%84%E8%B4%A8%E5%88%97%E8%A1%A8
     *
     * @param pageIndex {int}
     * @param pageSize {int}
     * @param iccid {string}
     * @param orgId {string}
     */
    queryCaseRecord(data) {
      const url = '/ajax/caseRecord/query'
      return ajax(url, data)
    },
    /**
     * 新增资质信息
     *
     * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/enterprise-qualification-api-desc#%E4%BC%81%E4%B8%9A%E8%B5%84%E8%B4%A8%E5%88%97%E8%A1%A8
     *
     * @param iccids {array}
     * @param photos {array}
     * @param remark {string}
     */
    createCaseRecord(data) {
      const url = '/ajax/caseRecord/create'
      return ajax(url, data)
    },
    /**
     * 批量新增资质信息
     *
     * @param zip {file}
     */
    createCaseRecordBatch(data) {
      const url = '/ajax/caseRecord/create/batch'
      return ajax(url, data)
    },
    /**
     * 删除资质信息
     */
    deleteCaseRecord(iccid) {
      const url = `/ajax/caseRecord/delete`
      return ajax(url, { iccid })
    },
    /**
     * 查询卡片列表
     */
    getDetailCardList(data) {
      const url = `/ajax/caseRecord/query/iccids`
      return ajax(url, data)
    },
    /**
     * 批量查询
     */
    batchQuery(data) {
      const url = `/ajax/caseRecord/query/batch`
      return ajax(url, data)
    }
  },

  sell: {
    /**
     * 客户分配列表
     * wiki：https://git.taovip.com/iot/simboss-captain-america/wikis/dc-org-list
     */
    sellerList() {
      const url = '/ajax/organization/sales/list'
      return ajax(url)
    },
    sellchange(id, data) {
      const url = '/ajax/organization/assignSaleStaff'
      return ajax(url, {
        org_id: id,
        dc_name: data.dcName,
        sale_name: data.saleName,
        remark: data.saleRemark
      })
    }
  },

  bride: {
    allTags() {
      const url = '/ajax/organization/tags'
      return ajax(url)
    },
    saveTags(data) {
      const url = '/ajax/organization/tags/save'
      return ajax(url, {
        orgId: data.orgId,
        tags: data.tags
      })
    }
  },

  active: {
    setPresent(data) {
      const url = '/ajax/organization/setPresent'
      return ajax(url, { ...data })
    },
    isMerged(data) {
      const url = '/ajax/organization/userPool/isMerged'
      return ajax(url, { ...data })
    },
    test(data) {
      const url = '/ajax/organization/userPool/test'
      return ajax(url, { ...data })
    },
    invert(data) {
      const url = '/ajax/organization/userPool/invert'
      return ajax(url, { ...data })
    }
  },

  subordinate: {
    // 分销配额
    fxQuotaDeduct(data) {
      const url = '/ajax/balance/fxQuotaDeduct'
      return ajax(url, data)
    },
    // 逆划拨检查
    transferReverseValidate(data) {
      const url = '/ajax/iotCard/validate'
      return ajax(url, data)
    },
    // 划拨可逆
    transferReverse(data) {
      const url = '/ajax/iotCard/transferReverse'
      return ajax(url, data)
    }
  },

  volume: {
    // 获取流量统计
    count(data) {
      const url = '/ajax/monthlyVolumeBill/sendBill'
      return ajax(url, data)
    }
  },

  // NEW 修改认证方式
  updateType(data) {
    const url = '/ajax/enterpriseQualification/updateType'
    return ajax(url, data)
  },
  // NEW 营业执照和身份证照片有效
  passIdCardAndLicence(data) {
    const url = '/ajax/enterpriseQualification/passIdCardAndLicence'
    return ajax(url, data)
  },
  qualificationsPass(data) {
    const url = '/ajax/enterpriseQualification/pass'
    return ajax(url, data)
  },
  qualificationsReject(data) {
    const url = '/ajax/enterpriseQualification/notPass'
    return ajax(url, data)
  },
  statisticSummary(data) {
    const url = '/ajax/statistics/summary'
    return ajax(url, data)
  },
  summaryChart(data) {
    const url = '/ajax/statistics/summaryChart'
    return ajax(url, data)
  },
  statisticBuyCard(data) {
    const url = '/ajax/statistics/buyCard'
    return ajax(url, data)
  },
  statisticRenew(data) {
    const url = '/ajax/statistics/renew'
    return ajax(url, data)
  },
  statisticIncomeMoney(data) {
    const url = '/ajax/statistics/incomeMoney'
    return ajax(url, data)
  },
  serviceMoneyDeduct(data) {
    const url = '/ajax/balance/payServiceFee'
    return ajax(url, data)
  },
  updateCustomConditionPrice(data) {
    const url = '/ajax/price/sales/setCondition'
    return ajax(url, data)
  },
  batchUpdateCustomePrice: (data) => ajax('/ajax/price/salesOffer/batchSave', data)
}
