import * as types from '../types'
import apis from '@/api/ajax'
import CustomerMeta from '@/constant/crm-data/customer-meta.json'
const pageConfig = {
  pageNo: 1,
  pageSize: 20,
  totalCount: 0
}
const baseDetail = CustomerMeta

// 把获取到的详情由字符串变为数组,在template中设置
const extract = (tempalte, data) => {
  const _ = (_t, _d) => {
    let tuple = {}
    Object.keys(_t).forEach(key => {
      let temp = null
      if (Array.isArray(_t[key])) {
        temp = _d[key]
        if (!temp) _d[key] = []
        else _d[key] = (temp + '').split(',')
      }
      tuple[key] = _d[key]
    })
    return tuple
  }
  let detail = {}
  Object.keys(tempalte).forEach(key => {
    let ret = null
    if (!data.hasOwnProperty(key)) {
      ret = tempalte[key]
    } else {
      if (typeof data[key] === 'object' && data[key] !== null) {
        ret = _(tempalte[key], data[key])
      } else {
        ret = data[key]
      }
    }
    detail[key] = ret
  })
  return detail
}
// 将数组变成字符串
const serialize = (data) => {
  let _hash = {}
  let specArr = ['industryId', 'competitor', 'usageScenario', 'useMeal', 'currentSuppliers']
  const normalize = (data) => {
    Object.keys(data).forEach(key => {
      if (specArr.includes(key)) {
        data[key] = data[key].toString()
      }
    })
    return data
  }
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'object' && data[key] !== null) {
      _hash[key] = JSON.stringify(normalize(data[key]))
    } else {
      _hash[key] = data[key]
    }
  })
  return _hash
}
// 保证默认值是从其上一阶段获取到的
const blackMagic = (data) => {
  const isExist = (val) => {
    if (val === null) {
      // 没有值的时候默认为null
      return false
    } else if (Array.isArray(val) && !val.length) {
      // 个别会在一开始就处理为[]
      return false
    } else {
      return true
    }
  }

  let demandConfirm = data.demandConfirm
  let negotiation = data.negotiation
  let preliminary = data.preliminary
  let clues = data.clues

  // demandConfirm的应用场景默认从线索审查中获取到
  if (!isExist(preliminary.useFor) && isExist(clues.useScenes)) preliminary.useFor = clues.useScenes
  if (!isExist(preliminary.buyTime) && isExist(clues.prePurchaseTime)) preliminary.buyTime = clues.prePurchaseTime
  // demandConfirm 中的是否有竞品(hasCompetitor) 竞品名 其他竞品名 竞品存在的问题、需要使用套餐、预计采购时间
  // 这几个字段默认从 preliminary 取 当有自己的值的时候，就使用自己的值。
  if (!isExist(demandConfirm.useMeal) && isExist(preliminary.useMeal)) demandConfirm.useMeal = preliminary.useMeal
  if (!isExist(demandConfirm.buyTime) && isExist(preliminary.buyTime)) demandConfirm.buyTime = preliminary.buyTime
  if (!isExist(demandConfirm.hasCompetitor) && isExist(preliminary.hasCompetitor)) demandConfirm.hasCompetitor = preliminary.hasCompetitor
  if (!isExist(demandConfirm.competitor) && isExist(preliminary.competitor)) demandConfirm.competitor = preliminary.competitor
  if (!isExist(demandConfirm.otherCompetitor) && isExist(preliminary.otherCompetitor)) demandConfirm.otherCompetitor = preliminary.otherCompetitor
  if (!isExist(demandConfirm.notice) && isExist(preliminary.notice)) demandConfirm.notice = preliminary.notice

  // negotiation 中的需要使用套餐、报价首单收入
  // 这四个字段默认从 demandConfirm取
  if (!isExist(negotiation.useMeal) && isExist(demandConfirm.useMeal)) negotiation.useMeal = demandConfirm.useMeal
  if (!isExist(negotiation.firstIncome) && isExist(demandConfirm.firstIncome)) negotiation.firstIncome = demandConfirm.firstIncome
  return data
}
export default {
  state: {
    page: { ...pageConfig },
    list: [],
    customerStatistics: {   // 统计数据
      newCustomer: 0,  // 新增加客户
      newMineCustomer: 0, // 新增自挖掘
      followed: 0, // 已跟进客户
      followedCount: 0, // 已跟进次数
      success: 0,  // 赢单客户
      stay: 0  // 停留客户
    },
    detail: { ...baseDetail },
    contacts: []
  },
  actions: {
    // 获取潜客列表
    async [types.CUSTOMERS_SEARCH] ({commit}, condition) {
      let ret = await apis.crm.customerSearch(condition)
      commit(types.CUSTOMERS_SEARCH, ret.data)
    },
    // 特别关注
    async [types.CUSTOMER_FOCUS] ({commit}, hash) {
      return await apis.crm.customerSpecialFocusPut(hash)
    },
    // 创建潜客
    async [types.CUSTOMER_POST] ({commit}, hash) {
      return await apis.crm.customerPost(hash)
    },
    // 修改潜客
    async [types.CUSTOMER_PUT] ({commit}, hash) {
      return await apis.crm.customerPut(serialize(hash))
    },
    // 删除潜在客户
    async [types.CUSTOMER_DELETE] ({commit}, hash) {
      return await apis.crm.customerDelete(hash)
    },
    // 获取潜客详情
    async [types.CUSTOMER_DETAIL_GET] ({commit}, customerId) {
      let ret = await apis.crm.customerGet({id: customerId})
      commit(types.CUSTOMER_DETAIL_GET, { ...ret.data, isSubCustomer: ret.message !== 'OK' })
    },
    // 根据潜客id 获取联系人信息
    async [types.CUSTOMER_CONTACT_SEARCH] ({commit}, customerId) {
      let ret = await apis.crm.customerContactSearch({customerId})
      commit(types.CUSTOMER_CONTACT_SEARCH, ret.data)
    },
    // 创建联系人
    async [types.CUSTOMER_CONTACT_POST] ({commit}, hash) {
      return await apis.crm.customerContactPost(hash)
    },

    // 修改保存联系人
    async [types.CUSTOMER_CONTACT_PUT] ({commit}, hash) {
      return await apis.crm.customerContactPut(hash)
    },
    // 丢弃客户
    async [types.CUSTOMER_ABANDON] ({commit}, hash) {
      return await apis.crm.customerAbandonPut(hash)
    },
    // 转译客户
    async [types.CUSTOMERS_TRANSFER] ({commit}, hash) {
      return await apis.crm.customerTransferPut(hash)
    },
    // 销售接单
    async [types.CUSTOMER_RECEIVE] ({commit}, hash) {
      return await apis.crm.customerSalesConfirmPut(hash)
    },
    // 审核客户
    async [types.CUSTOMER_AUDIT_PUT] ({commit}, hash) {
      return await apis.crm.customerAuditPut(hash)
    },
    // 自动转单
    async [types.CUSTOMER_AUTO_SEND] ({commit}, hash) {
      return await apis.crm.customerAutoSend(hash)
    }
  },
  getters: {

  },
  mutations: {
    [types.CUSTOMERS_SEARCH] (state, data) {
      state.list = data.records
      state.page = data.pagin
      Object.assign(state.customerStatistics, data.customerStatistics)
    },
    [types.CUSTOMER_DETAIL_GET] (state, data) {
      let s = blackMagic(extract(baseDetail, data))
      // 将行业从字符串转换成数字
      s.baseInfo.industryId = s.baseInfo.industryId.map(e => Number(e))
      s.baseInfo.usageScenario = s.baseInfo.usageScenario.map(e => Number(e))
      state.detail = s
    },
    [types.CUSTOMER_CONTACT_SEARCH] (state, data) {
      state.contacts = data.records
    }
  }
}
