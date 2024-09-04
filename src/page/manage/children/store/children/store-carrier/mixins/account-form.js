/*
 * @Author: SerkeyWu
 * @Date: 2020-11-12 15:56:13
 * @Description: Do not edit
 * @LastEditors: SerkeyWu
 * @LastEditTime: 2021-02-25 11:19:45
 */
class AccountForm {
  constructor(type, refId) {
    this.username = ''
    this.password = ''
    this.apiUrl = ''
    this.description = ''
    this.type = type
    this.status = true
    this.signedCarrierId = ''
    this.platformType = ''
    this.activeCardExpandPool = true
    this.planType = 'day'
    this.batchPrefix = ''

    this.appId = ''
    this.secret = ''
    this.ecCode = ''
    this.refId = refId
    this.smsChannelApiKey = ''
    this.extInfo = ''
    this.masterAccount = true
    this.vpdnAccount = false
    this.nbIotAccount = false
    this.gprsSwitchSupport = false
    this.physicalSwitchSupport = false
    this.basicApiNotSupported = false
    this.carrierRealName = false
    this.resaleSupplier = false
    this.extWhiteList = false
    this.voiceCardAccount = false
  }
}

export default AccountForm
