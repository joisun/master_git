// 套餐相关选项

// 套餐报价类型
const offerType = [
  {
    label: "按月套餐",
    value: "monthly",
  },
  {
    label: "自定义套餐",
    value: "custom",
  },
  {
    label: "加油包",
    value: "package",
  },
  {
    label: "流量池叠加包",
    value: "pool-package",
  },
];

// 自定义套餐专有字段 周期定义
const periodDefinition = [
  {
    label: "每月30天",
    value: 1,
  },
  {
    label: "自然月月底",
    value: 2,
  },
  {
    label: "自然月叠加",
    value: 3,
  }
];

// 自定义套餐专有字段 套餐结束方式
const periodEndTag = [
  {
    label: "时间到期或用量用尽",
    value: 1,
  },
  {
    label: "时间到期",
    value: 2,
  }
];

export {
  offerType,
  periodDefinition,
  periodEndTag
}
