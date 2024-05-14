/**
 * Created by zeter on 2017/4/13.
 */

import { ajax } from '../api-tool'

export default {
  modifyLogisticsAuth(params = {}) {
    const url = '/ajax/cardOrder/modifyLogistics/auth'
    return ajax(url, params)
  },
  specification: {
    /**
     * 获取订单的购卡详情
     *
     * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/card-order-api#%E8%B4%AD%E5%8D%A1%E8%A6%81%E6%B1%82%E6%8E%A5%E5%8F%A3
     *
     * @param billId {string} 订单编号
     * @return {Promise}
     */
    get(billId) {
      const url = '/ajax/cardOrder/queryBuyCardSpecification'
      return ajax(url, { card_order_no: billId })
    },
    getHistory(data) {
      const url = '/ajax/cardOrder/queryExtendInfoOfBuyCardSpecification'
      return ajax(url, data)
    },
    queryLogisticsMoney(data) {
      const url = '/ajax/cardOrder/queryLogisticsMoney'
      return ajax(url, data)
    }
  },

  getGoodsList: {
    get(billId) {
      const url = '/ajax/cardOrder/getGoodsList'
      return ajax(url, { orderNo: billId })
    }
  },

  express: {
    /**
     * 更新物流信息
     * @param billId {string} 订单编号
     * @param companyName {string} 物流公司名
     * @param expressId {string} 物流单号
     */
    set(data) {
      const url = '/ajax/cardOrder/updateLogistics'
      return ajax(url, data)
    }
  },

  buyer: {
    /**
     * 查询购卡组织
     * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/api-desc#%E8%B4%AD%E5%8D%A1%E7%BB%84%E7%BB%87%E5%88%97%E8%A1%A8
     * @param searchStr {string} 组织id或组织名称
     * @param size {int} 最多返回条数
     */
    search(searchStr, size = 10) {
      const url = '/ajax/organization/listBuyCardOrg'
      return ajax(url, { search_str: searchStr, size })
    },

    /**
     * 根据订单编号查询待发货订单
     *
     * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/order-online-api/order-mgt#%E6%A0%B9%E6%8D%AE%E8%AE%A2%E5%8D%95%E7%BC%96%E5%8F%B7%E6%9F%A5%E8%AF%A2%E5%BE%85%E5%8F%91%E8%B4%A7%E8%AE%A2%E5%8D%95
     *
     * @param billId
     */
    get(billId) {
      const url = '/ajax/cardOrder/queryDeliveringOrderByNo'
      return ajax(url, { order_no: billId })
    }
  },

  certify: {
    /**
     * 订单审核通过
     * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/order-online-api/order-mgt#%E5%AE%A1%E6%A0%B8%E9%80%9A%E8%BF%87
     * @param billSerialId {int} 订单短号
     */
    pass(billSerialId) {
      const url = '/ajax/cardOrder/reviewPass'
      return ajax(url, { co_id: billSerialId })
    },

    /**
     * 订单审核不通过
     * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/order-online-api/order-mgt#%E5%AE%A1%E6%A0%B8%E4%B8%8D%E9%80%9A%E8%BF%87
     * @param billSerialId {int} 订单短号
     */
    refuse(billSerialId) {
      const url = '/ajax/cardOrder/reviewFaild'
      return ajax(url, { co_id: billSerialId })
    }
  },

  /**
   * 取消订单
   *
   * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/order-online-api/order-mgt#%E5%8F%96%E6%B6%88%E8%AE%A2%E5%8D%95
   *
   * @param billSerialId {int} 订单短号
   * @param remark {string}
   */
  cancel(billSerialId, remark = '', refundMoney) {
    const url = '/ajax/cardOrder/cancel'
    return ajax(url, { co_id: billSerialId, remark, refundMoney })
  },

  /**
   * 完成订单
   *
   * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/order-online-api/order-mgt#%E5%AE%8C%E6%88%90%E8%AE%A2%E5%8D%95
   *
   * @param billSerialId {int} 订单短号
   * @param remark {string}
   */
  done(billSerialId, remark = '') {
    const url = '/ajax/cardOrder/done'
    return ajax(url, { co_id: billSerialId, remark })
  },

  /**
   * 订单购卡列表
   * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/order-online-api/order-mgt#%E8%B4%AD%E5%8D%A1%E8%AE%A2%E5%8D%95%E5%88%97%E8%A1%A8
   * @param params {object} 查询参数，
   */
  query(params = {}) {
    const url = '/ajax/cardOrder/list'
    return ajax(url, params)
  },

  updateOrderRemark(data) {
    const url = '/ajax/cardOrder/updateRemark'
    return ajax(url, data)
  },

  remark: {
    addSalerRemark(data) {
      const url = '/ajax/cardOrder/addSalerRemark'
      return ajax(url, data)
    },
    /**
     * 添加订单备注
     *
     * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/order-online-api/order-mgt#%E6%B7%BB%E5%8A%A0%E5%A4%87%E6%B3%A8
     *
     * @param billId
     * @param remark {string}
     */
    create(data) {
      const url = '/ajax/remark/create'
      return ajax(url, data)
    },

    /**
     * 查询订单备注
     *
     * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/order-online-api/order-mgt#%E6%9F%A5%E8%AF%A2%E5%A4%87%E6%B3%A8
     *
     * @param billId
     */
    query(data) {
      const url = '/ajax/remark/query'
      return ajax(url, data)
    },
    /**
     * 查询所有备注
     * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/card-order-api
     * @param orderNo
     */
    getRemark(orderNo) {
      const url = '/ajax/cardOrder/queryRemark'
      return ajax(url, { order_no: orderNo })
    }
  },

  contact: {
    /**
     * 修改订单收货信息
     *
     * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/order-online-api/order-mgt#%E4%BF%AE%E6%94%B9%E8%AE%A2%E5%8D%95%E6%94%B6%E8%B4%A7%E4%BF%A1%E6%81%AF
     *
     * @param billSerialId {int} 订单短号
     * @param name {string} 收货人姓名
     * @param phone {string} 收货人电话
     * @param address {string} 收货人地址
     */
    update(billSerialId, name, phone, address) {
      const url = '/ajax/cardOrder/modifyOrderAddress'
      return ajax(url, {
        co_id: billSerialId,
        contact_info: JSON.stringify({ userName: name, phone, address })
      })
    }
  },

  payinfo: {
    /**
     * 查看支付信息(对公转账）
     *
     * wiki: https://git.taovip.com/iot/simboss-captain-america/wikis/order-online-api/order-mgt#%E6%9F%A5%E7%9C%8B%E6%94%AF%E4%BB%98%E4%BF%A1%E6%81%AF%E5%AF%B9%E5%85%AC%E8%BD%AC%E8%B4%A6
     *
     * @param billId
     */
    get(billId) {
      const url = '/ajax/cardOrder/queryPaymentInfo'
      return ajax(url, { order_no: billId })
    }
  },

  changeBill(data) {
    const url = '/ajax/cardOrder/modifyLogistics'
    return ajax(url, data)
  },

  resetBill(data) {
    const url = '/ajax/cardOrder/resetOrder'
    return ajax(url, data)
  },

  refundBill(data) {
    const url = '/ajax/cardOrder/refund'
    return ajax(url, data)
  },

  waitingPurchase(data) {
    const url = '/ajax/cardOrder/waitingPurchase'
    return ajax(url, data)
  },

  purchasing(data) {
    const url = '/ajax/cardOrder/purchasing'
    return ajax(url, data)
  },

  getSaleOrderData: (data) => ajax('/ajax/crm/cardOrder/info', data)
}
