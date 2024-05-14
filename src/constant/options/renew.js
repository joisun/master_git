// 卡功能分类相关选项
const options = {
  // 网络属性
  networkAttribute: [
    {
      label: "公网",
      value: false,
    },
    {
      label: "专网",
      value: true,
    },
  ],
  // 套餐属性
  packageAttribute: [
    {
      label: "前向",
      value: 'forward',
    },
    {
      label: "后向",
      value: 'backward',
    },
  ],
  // 续费限制
  renewRestriction: [
    {
      label: "可续周期",
      value: 'ALLOW_EXTEND_PERIOD',
    },
    {
      label: "可购买加油包",
      value: 'ALLOW_APPEND_PACKAGE',
    },
    {
      label: "可购买流量池叠加包",
      value: 'ALLOW_APPEND_POOL_PACKAGE',
    },
    {
      label: "可改套餐",
      value: 'ALLOW_CHANGE_RATE_PLAN',
    },
    {
      label: "自动续费",
      value: 'ALLOW_AUTO_RECHARGE',
    },
    {
      label: "次月续费时间范围限制",
      value: 'RECHARGE_TIME_LIMIT',
    },
  ],
  renewRestrictionObj: {
    'ALLOW_EXTEND_PERIOD': '可续周期',
    'ALLOW_APPEND_PACKAGE': '需购买加油包',
    'ALLOW_APPEND_POOL_PACKAGE': '可购买流量池叠加包',
    'ALLOW_CHANGE_RATE_PLAN': '可改套餐',
    'ALLOW_AUTO_RECHARGE': '自动续费',
    'RECHARGE_TIME_LIMIT': '次月续费时间范围限制'
  },
};

export default options;
