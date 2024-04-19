// 卡功能分类相关选项
const options = {
  // 网络制式
  generation: [
    {
      value: '2G',
      label: '2G'
    },
    {
      value: '3G',
      label: '3G'
    },
    {
      value: '4G',
      label: '4G'
    },
    {
      value: '5G',
      label: '5G'
    }
  ],
  // 卡功能
  cardFunction: [
    {
      value: 'sharable',
      label: '流量池共享'
    },
    {
      value: 'smsType',
      label: '短信接收'
    },
    {
      value: 'realnameRequire',
      label: '实名认证'
    },
    {
      value: 'apnSetting',
      label: 'APN设置'
    },
    {
      value: 'cardDeviceBundling',
      label: '机卡绑定'
    },
    {
      value: 'supportTestingCard',
      label: '测试期'
    },
    {
      value: 'industryStandardPricing',
      label: '行业统一报价'
    }
  ],
  // 短信服务方式
  supportSms: [
    {
      value: 'foreverPackage',
      label: '永久有效'
    },
    {
      value: 'monthlySmsPackage',
      label: '包月'
    },
    {
      value: 'yearlySmsPackage',
      label: '包年'
    }
  ],
  specialRestriction: [
    {
      value: 'whiteCardEnable',
      label: '支持0元购买白卡'
    },
    {
      value: 'activeAfterOutput',
      label: '出库并激活'
    },
    {
      value: 'testEnable',
      label: '支持测试卡'
    },
    {
      value: 'unlimitedVolume',
      label: '不限流量'
    },
    {
      value: 'allowRecharge',
      label: '允许续费'
    }
  ],
  carrierSpecialRestriction: [
    {
      value: 'carrierImeiBind',
      label: '机卡绑定'
    },
    {
      value: 'carrierRealName',
      label: '实名认证'
    }
  ]
}

export default options
