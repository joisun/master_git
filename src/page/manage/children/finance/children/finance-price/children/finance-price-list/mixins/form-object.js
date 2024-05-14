class formObject {
  constructor(id) {
    this.id = 0
    this.operator = 1
    this.offerType = 'monthly'
    this.volume = 1024
    this.validity = 1
    this.validityUnit = 'M'
    this.sharable = false
    this.sharePriceFactor = 1
    this.officalPrice = 0
    this.price = 0
    this.bottomPrice = 0
    this.status = true
    this.whiteCardEnable = false
    this.realnameRequire = false
    this.categoryId = id
    this.step = [3, 12]
    this.extendField = ''
    this.activeAfterOutput = false
    this.supportSms = false
    this.testEnable = false
    this.locationService = false
    this.apnSetting = false
    this.cardDeviceBundling = false
    this.cardFee = 0
    this.ceramicCardFee = 0
    this.pasterCardFee = 0
    this.pasterCeramicCardFee = 0
    this.supportTestingCard = false
    this.unlimitedVolume = false
    this.minTestLimit = 0
    this.maxTestLimit = 6
    this.allowRecharge = false
    this.rechargeUnit = 1
    this.materialSpecification = ''

    this.periodDefinition = 1
    this.useCountAsVolume = false
    this.count = 20000 // 不传给后台
    // this.periodOver = true;
    // this.usageOver = true;
    // 时间或用量耗尽：periodOver和usageOver都为true时，设置periodEndTag=1
    // 时间到期：periodOver为true时，设置periodEndTag=2
    this.periodEndTag = 1 // 不传给后台
    this.minDeadline = 0 // 沉默期开始日期
    this.deadline = 0 // 沉默期结束日期

    this.carrierRealName = false // 实名认证
    this.carrierImeiBind = false // 机卡绑定
    
    this.monthlySmsPackage = false // 短信月包
    this.yearlySmsPackage = false // 短信年包
    this.foreverPackage = true // 永久有效
  }
}

export default formObject
