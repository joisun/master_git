/*
 * @Author: SerkeyWu
 * @Date: 2020-11-12 15:56:13
 * @Description: Do not edit
 * @LastEditors: SerkeyWu
 * @LastEditTime: 2021-02-26 10:29:49
 */
import store from '@/store'

/**
 * 运营商地区过滤器 必须传入两个参数 (对应id和对应运营商缺一不可)
 * @param str
 * @param carrier
 * @returns {string}
 */
const carrierAccountFormat = function(str, carrier) {
  let carrierAccountList = store.state.carrierAccount[`${carrier}AccountList`]
  let carrierAccountName = str
  carrierAccountList.map(e => {
    if (JSON.parse(str) === e.id && carrier === e.carrier) carrierAccountName = e.name
  })
  return carrierAccountName
}

export default carrierAccountFormat
