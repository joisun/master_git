export default {
  carrier: {
    cmcc: '中国移动',
    unicom: '中国联通',
    chinanet: '中国电信'
  }, // 运营商
  ratePlanType: {
    STANDARD: '前向按月套餐',
    CUSTOM: '前向自定义套餐',
    PRE_POOL: '前向流量池套餐',
    POOL: '后向流量池套餐'
  },
  userType: {
    dc: '直客',
    ds: '分销',
    dp: '分润',
    dpc: '渠道',
    dsc: '零售'
  },
  qualificationType: {
    eq: '企业资质认证',
    legal: '法人信息认证'
  },
  qualificationStatus: {
    'not-audit': '待审核',
    pass: '通过审核',
    'not-pass': '未通过审核',
    'not-submit': '未提交审核'
  },
  cardStatus: {
    activation: '已激活',
    deactivation: '已停卡',
    level2: '库存',
    retired: '已销卡',
    testing: '可测试'
  },
  imeiStatus: {
    NOT_SET: '未开启',
    NOT_BIND: '待绑定',
    NORMAL: '正常',
    SPLIT: '机卡分离'
  },
  deviceStatus: {
    TEST_READY_NAME: '可测试',
    INVENTORY_NAME: '库存',
    TRIAL_NAME: '试用期',
    ACTIVATION_READY_NAME: '可激活',
    ACTIVATED_NAME: '已激活',
    DEACTIVATED_NAME: '已停卡',
    RETIRED_NAME: '已销卡',
    PURGED_NAME: '已回收'
  },
  gprsStatus: {
    DEACTIVATED_NAME: '关闭',
    ACTIVATED_NAME: '开启'
  },
  lockStatus: {
    NOT_EXECUTE: '未执行',
    SUCCESS: '成功',
    FINISHED: '完成',
    FAILED: '失败'
  },
  cardStoreStatus: {
    inventory: '库存中',
    delivered: '已出库',
    locked: '锁定',
    inventoryRetired: '库存中(已销卡)',
    inventoryRetiring: '库存中(提交销卡)'
  },
  specificationType: {
    STANDARD: '标准卡',
    MICRO: 'Micro卡',
    NANO: 'Nano卡',
    MS_5X5: '5*5MM贴片卡',
    MS_5X6: '5*6MM贴片卡',
    MS_2X2: '2*2MM贴片卡'
  },
  materialType: {
    PLASTIC: '塑料插拔卡',
    CERAMICS: '陶瓷插拔卡',
    PASTER: '陶瓷贴片卡',
    PLASTIC_PASTER: '塑料贴片卡',
    EPOXY: '环氧树脂',
    VEHICLE: '车规级'
  },
  planType: {
    monthly: '按月套餐',
    custom: '自定义套餐',
    package: '加油包',
    'pool-package': '流量池叠加包',
    'overflow-package': '超额流量包'
  },
  chinanetAPIType: {
    1: '上海',
    2: '电信物联网中心',
    3: '上海创略',
    4: '电信爱立信',
    5: '电信爱立信SI'
  },
  cmccAPIType: {
    1: '中移物联',
    2: '广东',
    3: '上海',
    4: 'VPDN',
    5: '江苏',
    6: '浙江',
    8: 'CTBOSS'
  },
  unicomAPIType: {
    1: 'Jasper',
    2: 'Jasper蜂窝子系统'
  },
  unicomCarrierPlanType: {
    day: '按天',
    'half-month': '按半月',
    full: '按整月'
  },
  retiringStatus: {
    submited: '未处理',
    dealing: '处理中',
    done: '已处理',
    refused: '已拒绝'
  },
  orderType: {
    production: '正式卡订单',
    testing: '测试卡订单'
  },
  orderStatus: {
    PAYMENT: '待支付',
    REVIEW: '待审核',
    'WAITING-PURCHASE': '待采购',
    PURCHASING: '采购中',
    'REVIEW-FAILD': '审核未过',
    OUTPUTING: '待出库',
    'OUTPUT-SUBMITTED': '出库中',
    DELIVERING: '已出库',
    DELIVERED: '已发货',
    DONE: '已完成',
    CLOSE: '已关闭',
    REFUND: '已退款'
  },
  orderPayType: {
    ALIPAY: '支付宝',
    'PUBLIC-ACCOUNT': '对公打款'
  },
  logisticsCompany: {
    中通: '中通',
    顺丰: '顺丰',
    申通: '申通',
    国通: '国通',
    韵达: '韵达',
    圆通: '圆通',
    ems: 'ems',
    邮政包裹: '邮政包裹',
    百世汇通: '百世汇通',
    天天: '天天',
    自提: '自提',
    到付: '到付'
  },
  offlineRechargeStatus: {
    1: '待审核',
    0: '充值成功',
    '-1': '充值失败'
  },
  mailChargeBillStatus: {
    0: '未充值',
    1: '已充值'
  },
  dateUnit: {
    M: '个月',
    D: '天'
  },
  networkType: {
    public: '公网',
    private: '专网'
  },
  overSoldType: {
    overlying: '流量池叠加包超卖',
    combo: '流量池跨档套餐超卖',
    card_overlying: '单卡叠加包超卖',
    card_combo: '单卡跨档套餐超卖'
  },
  cardType: {
    PRODUCTION: '正式卡',
    TESTING: '测试卡'
  },
  planClassType: {
    forward: '前向',
    backward: '后向'
  },
  cmccAccountType: {
    2: '广东移动',
    5: '江苏移动'
  },
  chinanetAccountType: {
    1: '上海电信',
    2: '电信物联网中心'
  },
  unicomAccountType: {},
  physicalStatus: {
    INVENTORY_NAME: '库存',
    TEST_READY_NAME: '可测试',
    ACTIVATION_READY_NAME: '待激活',
    ACTIVATED_NAME: '已激活',
    DEACTIVATED_NAME: '已停卡',
    RETIRED_NAME: '已销卡'
  },
  offerTypeMap: {
    STANDARD: '按月套餐',
    CUSTOM: '自定义套餐'
  },
  tradeType: {
    // 变更类型枚举
    3: '平台充值',
    4: '取消订单',
    5: '余额退款',
    12: '套餐变更-退差价',
    '-7': '平台退款',
    '-11': '配额撤回',
    '-12': '套餐变更-补差价',
    14: '网络盒子',
    15: '取消计划套餐',
    16: '企业专网服务费',
    17: '国际卡购卡'
  },
  offerType: {
    ACL_POLICY_WHITE: '白名单',
    ACL_POLICY_APP: '分应用计费',
    SPEED_LIMIT: '限速',
    ADHOC: '卡卡自组网',
    LBS: '定位产品',
    EPNET: '企业专网'
  },
  platformTypes: {
    cmcc: {
      name: '移动',
      value: 'cmcc',
      platforms: ['PBOSS', 'CTBOSS', '5G', 'NB', 'INTERNATION']
    },
    unicom: {
      name: '联通',
      value: 'unicom',
      platforms: ['Jasper', '5G', 'NB', 'INTERNATION']
    },
    chinanet: {
      name: '电信',
      value: 'chinanet',
      platforms: ['CMP', 'DCP', '5G', 'NB', 'INTERNATION']
    }
  },
  salesIncomeType: {
    INCOME: '购卡',
    RECHARGE: '续费',
    // REFUND: '退款',
    BUY_REFUND: '购卡退款',
    RECHARGE_REFUND: '续费退款',
    GROUP_RECHARGE_REFUND: '团队续费退款',
    GROUP_BUY_REFUND: '团队购卡退款',
    PENDING: '待结算',
    FINANCE: '财务核算',
    OTHER: '其他',
    CHANGE_REFUND: '改套餐退款'
  },
  salesIncomeOrderType: {
    GENERAL: '普通订单',
    OVERSOLD: '超卖订单',
    NB: 'NB订单',
    RESALE: '转售订单',
    EPNET_SERVICE: '企业专网服务',
    PACKAGE: '加油包',
    POOL_PACKAGE: '流量池叠加包',
    MATERIAL_POINTS: '物料积分',
    BONUS: '项目奖金',
    CPE: 'CPE',
    OTHER: '其他'
  },
  rechargeLimit: {
    '-1': '不限制',
    1: '首年',
    2: '次年',
    0: '两年以上'
  }
}
