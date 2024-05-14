export default [
  {
    name: 'CRM',
    value: '',
    code: 'crm',
    children: [
      {
        name: '首页',
        value: '',
        code: 'crm-home',
        children: []
      },
      {
        name: '销售看板',
        value: '',
        code: 'crm-kanban',
        children: []
      },
      {
        name: '线索',
        value: '',
        code: 'customer-clues-index',
        children: []
      },
      {
        name: '商机',
        value: '',
        code: 'potential-customers-index',
        children: []
      },
      {
        name: '查重',
        value: '',
        code: 'duplicate-check',
        children: []
      },
      {
        name: '跟踪标签',
        value: '',
        code: 'input-tag',
        children: []
      },
      {
        name: '销售转单统计',
        value: '',
        code: 'auto-order-setting',
        children: []
      }
    ]
  },
  {
    name: '客户',
    value: '',
    code: 'client',
    children: [
      {
        name: '客户管理',
        value: '',
        code: 'client-list',
        children: []
      },
      {
        name: '资质审核',
        value: '',
        code: 'client-verify',
        children: []
      },
      {
        name: '客服工具',
        value: '',
        code: 'customer-service-tools',
        children: [
          {
            name: '卡套餐转移',
            value: '',
            code: 'plan-transfer',
            children: []
          },
          {
            name: '强制激活',
            value: '',
            code: 'forcibly-activate',
            children: []
          },
          {
            name: '激活停卡',
            value: '',
            code: 'active-and-deactive',
            children: []
          },
          {
            name: 'IMEI解绑',
            value: '',
            code: 'imei-unbind',
            children: []
          },
          {
            name: '取消计划套餐',
            value: '',
            code: 'cancel-plan',
            children: []
          },
          {
            name: '客户改套餐',
            value: '',
            code: 'customer-modify-package',
            children: []
          },
          {
            name: '卡功能打标修改',
            value: '',
            code: 'tag-tools',
            children: []
          },
          {
            name: '卡信息互转',
            value: '',
            code: 'card-info-convert',
            children: []
          },
          {
            name: 'VPDN增值功能',
            value: '{"query":{"type":1}}',
            code: 'network-tool-1',
            children: []
          },
          {
            name: '销卡管理',
            value: '',
            code: 'eliminate-card',
            children: []
          },
          {
            name: '卡归属查询',
            value: '',
            code: 'card-ownership-query',
            children: []
          },
          {
            name: 'VPDN详单',
            value: '',
            code: 'card-vpdn-detail',
            children: []
          }
        ]
      },
      {
        name: 'H5管理',
        value: '',
        code: 'h5-manage',
        children: []
      },
      {
        name: '模版合同',
        value: '',
        code: 'template-contract-list',
        children: []
      }
    ]
  },
  {
    name: '订单',
    value: '',
    code: 'order',
    children: [
      {
        name: '订单列表',
        value: '',
        code: 'order-list',
        children: []
      },
      {
        name: '订单工具',
        value: '',
        code: 'order-tools',
        children: [
          {
            name: '订单重置',
            value: '',
            code: 'order-tool-reset',
            children: []
          }
        ]
      }
    ]
  },
  {
    name: '仓储',
    value: '',
    code: 'store',
    children: [
      {
        name: '库存管理',
        value: '',
        code: 'store-inventory-management',
        children: [
          {
            name: '入库记录',
            value: '',
            code: 'store-record-inner',
            children: []
          },
          {
            name: '库存查看',
            value: '',
            code: 'store-inventory-list',
            children: []
          },
          {
            name: '出库记录',
            value: '',
            code: 'store-record-out',
            children: []
          }
        ]
      },
      {
        name: '卡片管理',
        value: '',
        code: 'card-list',
        children: []
      },
      {
        name: '出卡策略',
        value: '',
        code: 'card-export-strategy',
        children: [
          {
            name: '移动出卡策略',
            value: '{"params":{"carrier":"cmcc"}}',
            code: 'card-export-strategy-list-cmcc',
            children: []
          },
          {
            name: '联通出卡策略',
            value: '{"params":{"carrier":"unicom"}}',
            code: 'card-export-strategy-list-unicom',
            children: []
          },
          {
            name: '电信出卡策略',
            value: '{"params":{"carrier":"chinanet"}}',
            code: 'card-export-strategy-list-chinanet',
            children: []
          }
        ]
      },
      {
        name: '白卡管理',
        value: '',
        code: 'blank-card-management',
        children: [
          {
            name: '白卡入库',
            value: '',
            code: 'blank-card-warehousing',
            children: []
          },
          {
            name: '白卡入库记录',
            value: '',
            code: 'blank-card-record',
            children: []
          },
          {
            name: '开卡记录',
            value: '',
            code: 'blank-card-active-record',
            children: []
          }
        ]
      },
      {
        name: '运营商管理',
        value: '',
        code: 'carrier-management',
        children: [
          {
            name: '账号管理',
            value: '',
            code: 'store-carrier',
            children: []
          },
          {
            name: '续费接口',
            value: '{"params":{"carrier":"cmcc"}}',
            code: 'store-carrier-plan-cmcc',
            children: []
          }
        ]
      },
      {
        name: '库管报表',
        value: '',
        code: 'store-manage-report',
        children: []
      },
      {
        name: '库存查看和预定',
        value: '',
        code: 'inventory-reservation-list',
        children: []
      }
    ]
  },
  {
    name: '数据',
    value: '',
    code: 'data',
    children: [
      {
        name: '用户流量池',
        value: '',
        code: 'user-pool-show',
        children: []
      },
      {
        name: '系统流量池',
        value: '',
        code: 'system-pool-show',
        children: [
          {
            name: '移动',
            value: '{"params":{"carrier":"cmcc"}}',
            code: 'system-pool-show-cmcc',
            children: []
          },
          {
            name: '联通',
            value: '{"params":{"carrier":"unicom"}}',
            code: 'system-pool-show-unicom',
            children: []
          },
          {
            name: '电信',
            value: '{"params":{"carrier":"chinanet"}}',
            code: 'system-pool-show-chinanet',
            children: []
          }
        ]
      },
      {
        name: '单卡',
        value: '',
        code: 'single-card-show',
        children: [
          {
            name: '移动',
            value: '{"params":{"carrier":"cmcc"}}',
            code: 'single-card-show-cmcc',
            children: []
          },
          {
            name: '联通',
            value: '{"params":{"carrier":"unicom"}}',
            code: 'single-card-show-unicom',
            children: []
          },
          {
            name: '电信',
            value: '{"params":{"carrier":"chinanet"}}',
            code: 'single-card-show-chinanet',
            children: []
          }
        ]
      },
      {
        name: '首单查询',
        value: '',
        code: 'first-order',
        children: [
          {
            name: '卡平台',
            value: '',
            code: 'first-order-card',
            children: []
          },
          {
            name: '设备平台',
            value: '',
            code: 'first-order-cpe',
            children: []
          }
        ]
      }
    ]
  },
  {
    name: '运营',
    value: '',
    code: 'operation',
    children: [
      {
        name: '客户盈亏',
        value: '',
        code: 'customer-profit',
        children: []
      },
      {
        name: '公告管理',
        value: '',
        code: 'operation-notice',
        children: []
      },
      {
        name: '推广营销',
        value: '',
        code: 'operation-pop-list',
        children: []
      },
      {
        name: '销售报表',
        value: '',
        code: 'operation-sales',
        children: []
      },
      {
        name: '运营报表',
        value: '',
        code: 'operation-report',
        children: [
          {
            name: '卡片套餐报表',
            value: '',
            code: 'operation-report-card',
            children: []
          },
          {
            name: '运营数据报表',
            value: '',
            code: 'operation-sale-report',
            children: []
          },
          {
            name: '库管报表',
            value: '',
            code: 'operation-store-manage-report',
            children: []
          }
        ]
      },
      {
        name: '信息报备',
        value: '',
        code: 'message-report',
        children: []
      },
      {
        name: '博客页管理',
        value: '',
        code: 'blog-manage',
        children: []
      }
    ]
  },
  {
    name: '合规',
    value: '',
    code: 'compliance',
    children: [
      {
        name: '合规变更管理',
        value: '',
        code: 'ext-whitelist',
        children: []
      },
      {
        name: '人联网黑名单',
        value: '',
        code: 'human-connect-blacklist-list',
        children: [
          {
            name: '移动',
            value: '{"params":{"carrier":"cmcc"}}',
            code: 'human-connect-blacklist-list-cmcc',
            children: []
          },
          {
            name: '联通',
            value: '{"params":{"carrier":"unicom"}}',
            code: 'human-connect-blacklist-list-unicom',
            children: []
          },
          {
            name: '电信',
            value: '{"params":{"carrier":"chinanet"}}',
            code: 'human-connect-blacklist-list-chinanet',
            children: []
          }
        ]
      },
      {
        name: '运营商账号匹配',
        value: '',
        code: 'carrier-account-matching',
        children: []
      },
      {
        name: '流量预警',
        value: '',
        code: 'flow-warning',
        children: [
          {
            name: '告警列表',
            value: '',
            code: 'flow-warning-list',
            children: []
          },
          {
            name: '下载处理记录',
            value: '',
            code: 'flow-warning-downloads',
            children: []
          }
        ]
      }
    ]
  },
  {
    name: '财务',
    value: '',
    code: 'finance',
    children: [
      {
        name: '报价管理',
        value: '',
        code: 'finance-price-management',
        children: [
          {
            name: '套餐列表',
            value: '',
            code: 'finance-price-list',
            children: []
          },
          {
            name: '卡功能分类',
            value: '',
            code: 'finance-price-function',
            children: []
          },
          {
            name: '续费分类',
            value: '',
            code: 'finance-price-renew',
            children: []
          },
          {
            name: '套餐规格',
            value: '',
            code: 'finance-price-specs',
            children: []
          },
          {
            name: '网络产品',
            value: '',
            code: 'finance-price-network',
            children: []
          },
          {
            name: '定位产品',
            value: '',
            code: 'finance-price-lbs',
            children: []
          },
          {
            name: '组合套餐',
            value: '',
            code: 'finance-price-combine',
            children: []
          }
        ]
      },
      {
        name: '余额管理',
        value: '',
        code: 'balance-management',
        children: [
          {
            name: '申请记录',
            value: '',
            code: 'finance-charge-inner',
            children: []
          },
          {
            name: '到账记录',
            value: '',
            code: 'finance-charge-reach',
            children: []
          },
          {
            name: '账户余额变更',
            value: '',
            code: 'finance-charge-record',
            children: []
          }
        ]
      },
      {
        name: '财务对账',
        value: '',
        code: 'finance-ledger',
        children: [
          {
            name: '运营商对账',
            value: '',
            code: 'finance-ledger-carrier',
            children: []
          }
        ]
      },
      {
        name: '销售提成',
        value: '',
        code: 'sales-comission-management',
        children: [
          {
            name: '销售提成',
            value: '',
            code: 'sales-comission',
            children: []
          },
          {
            name: '考核成本',
            value: '',
            code: 'sales-comission-cost',
            children: []
          },
          {
            name: '提成配置',
            value: '',
            code: 'sales-comission-config',
            children: []
          },
          {
            name: '提成比例',
            value: '',
            code: 'sales-comission-percentage',
            children: []
          },
          {
            name: '续费管理',
            value: '',
            code: 'finance-recharge-manage',
            children: []
          },
          {
            name: '项目订单',
            value: '',
            code: 'project-order',
            children: []
          }
        ]
      },
      {
        name: '佣金管理',
        value: '',
        code: 'finance-profit-management',
        children: [
          {
            name: '佣金结算',
            value: '',
            code: 'finance-profit-settlement',
            children: []
          },
          {
            name: '佣金明细',
            value: '',
            code: 'finance-profit-list',
            children: []
          }
        ]
      },
      {
        name: '成本管理',
        value: '',
        code: 'finance-cost-management',
        children: [
          {
            name: '成本统计',
            value: '',
            code: 'finance-cost-statistic',
            children: []
          },
          {
            name: '参数配置',
            value: '',
            code: 'finance-cost',
            children: []
          },
          {
            name: '资费管理',
            value: '',
            code: 'finance-carrier-charge',
            children: []
          }
        ]
      },
      {
        name: '退款申请',
        value: '',
        code: 'refund-management',
        children: []
      }
    ]
  },
  {
    name: '其他',
    value: '',
    code: 'others',
    children: [
      {
        name: '下载管理',
        value: '',
        code: 'download',
        children: []
      },
      {
        name: '销卡',
        value: '',
        code: 'eliminate-card',
        children: [
          {
            name: '销卡管理',
            value: '',
            code: 'eliminate-card',
            children: []
          },
          {
            name: '过期未销卡管理',
            value: '',
            code: 'eliminate-card-auto-active',
            children: []
          }
        ]
      },
      {
        name: '测试卡管理',
        value: '',
        code: 'test-card',
        children: []
      },
      {
        name: '卡归属查询',
        value: '',
        code: 'card-ownership-query',
        children: []
      },
      {
        name: 'NB续费记录',
        value: '',
        code: 'carrier-nb-renew-record',
        children: []
      },
      {
        name: '订正工具',
        value: '',
        code: 'revision-tools',
        children: [
          {
            name: '卡套餐转移',
            value: '',
            code: 'plan-transfer',
            children: []
          },
          {
            name: '客户改套餐',
            value: '',
            code: 'customer-modify-package',
            children: []
          },
          {
            name: '公网VPDN互转',
            value: '',
            code: 'public-vpdn-interchange',
            children: []
          },
          {
            name: '运营商改套餐',
            value: '',
            code: 'carrier-modify-package',
            children: []
          },
          {
            name: '运营商账号修改',
            value: '',
            code: 'carrier-account-modify',
            children: []
          },
          {
            name: '取消计划套餐',
            value: '',
            code: 'cancel-plan',
            children: []
          },
          {
            name: '库存卡信息修改',
            value: '',
            code: 'inventory-modify',
            children: []
          },
          {
            name: '激活卡改库存',
            value: '',
            code: 'return-stock',
            children: []
          },
          {
            name: '取消停机保号',
            value: '',
            code: 'cancel-retain-number',
            children: []
          },
          {
            name: 'NB卡APN修改',
            value: '',
            code: 'nb-apn-modify',
            children: []
          },
          {
            name: '套餐周期对齐',
            value: '',
            code: 'customer-period-align',
            children: []
          },
          {
            name: '三方订单关闭',
            value: '',
            code: 'third-party-order-close',
            children: []
          },
          {
            name: '退款工具',
            value: '',
            code: 'refund-tool',
            children: []
          }
        ]
      },
      {
        name: '技术工具',
        value: '',
        code: 'develop-tool',
        children: []
      },
      {
        name: '取消测试期',
        value: '',
        code: 'carrier-cancel-test',
        children: []
      },
      {
        name: '黑白名单',
        value: '',
        code: 'white-list',
        children: []
      },
      {
        name: '操作日志',
        value: '',
        code: 'operation-log',
        children: []
      },
      {
        name: '熔断管理',
        value: '',
        code: 'stop-card-fuse',
        children: []
      },
      {
        name: '位置绑定',
        value: '',
        code: 'card-location-bind',
        children: []
      }
    ]
  },
  {
    name: 'VPDN',
    value: '',
    code: 'vpdn',
    children: [
      {
        name: '分离计费',
        value: '',
        code: 'vpdn-separate',
        children: []
      },
      {
        name: '联网限速',
        value: '',
        code: 'vpdn-speed-limit',
        children: []
      },
      {
        name: 'IP管理工具',
        value: '',
        code: 'vpdn-ip-list',
        children: []
      },
      {
        name: '路由规则管理',
        value: '',
        code: 'routing-rules',
        children: []
      },
      {
        name: '地址转换工具',
        value: '',
        code: 'address-translation',
        children: []
      },
      {
        name: '网络工具',
        value: '',
        code: 'network-tools',
        children: [
          {
            name: '打标工具',
            value: '{"query":{"type":1}}',
            code: 'network-tool-1',
            children: []
          },
          {
            name: '企业专网IP配置',
            value: '{"query":{"type":2}}',
            code: 'network-tool-2',
            children: []
          },
          {
            name: '网络产品配置状态',
            value: '{"query":{"type":3}}',
            code: 'network-tool-3',
            children: []
          }
        ]
      },
      {
        name: 'APN设置',
        value: '',
        code: 'ad-hoc-apn-setting',
        children: []
      }
    ]
  },
  {
    name: 'CPE',
    value: '',
    code: 'cpe',
    children: [
      {
        name: '客户列表',
        value: '',
        code: 'cpe-client-list',
        children: []
      },
      {
        name: '设备列表',
        value: '',
        code: 'cpe-device-list',
        children: []
      },
      {
        name: '商品管理',
        value: '',
        code: 'cpe-goods-list',
        children: []
      },
      {
        name: '供应商',
        value: '',
        code: 'cpe-supplier',
        children: [
          {
            name: '供应商名录',
            value: '',
            code: 'cpe-supplier-list',
            children: []
          },
          {
            name: '供应商产品',
            value: '',
            code: 'cpe-supplier-product',
            children: []
          }
        ]
      },
      {
        name: '库存管理',
        value: '',
        code: 'cpe-stock-management',
        children: [
          {
            name: '库存列表',
            value: '',
            code: 'cpe-stock-list',
            children: []
          },
          {
            name: '出库记录',
            value: '',
            code: 'cpe-deliver-record',
            children: []
          },
          {
            name: '三合一卡',
            value: '',
            code: 'cpe-three-in-one',
            children: []
          }
        ]
      },
      {
        name: '订单列表',
        value: '',
        code: 'cpe-order-list',
        children: []
      },
      {
        name: '告警列表',
        value: '',
        code: 'cpe-alarm-list',
        children: []
      },
      {
        name: '设备退换管理',
        value: '',
        code: 'cpe-device-exchange',
        children: []
      },
      {
        name: '设备工具',
        value: '',
        code: 'cpe-tools',
        children: [
          {
            name: 'ONVIF配置',
            value: '',
            code: 'cpe-onvif-configure',
            children: []
          },
          {
            name: 'Mqtt Topic管理',
            value: '',
            code: 'cpe-tool-mqtt-topic',
            children: []
          },
          {
            name: 'openVPN配置',
            value: '',
            code: 'cpe-tool-openvpn-config',
            children: []
          },
          {
            name: 'openVPN服务器',
            value: '',
            code: 'cpe-tool-openvpn-server',
            children: []
          }
        ]
      }
    ]
  },
  {
    name: '国际卡',
    value: '',
    code: 'international',
    children: [
      {
        name: '运营商管理',
        value: '',
        code: 'carrier-manage',
        children: [
          {
            name: '运营商账号管理',
            value: '',
            code: 'international-carrier-account-list'
          },
          {
            name: '运营商套餐管理',
            value: '',
            code: 'international-carrier-package-list'
          }
        ]
      },
      {
        name: '仓储',
        value: '',
        code: 'store-manage',
        children: [
          {
            name: '入库记录',
            value: '',
            code: 'international-in-store'
          },
          {
            name: '出库记录',
            value: '',
            code: 'international-out-store'
          },
          {
            name: '卡片管理',
            value: '',
            code: 'international-card-list'
          }
        ]
      },
      {
        name: '套餐管理',
        value: '',
        code: 'international-price-manage',
        children: [
          {
            name: '套餐列表',
            value: '',
            code: 'international-price-list'
          }
        ]
      },
      {
        name: '订单管理',
        value: '',
        code: 'international-order-manage',
        children: [
          {
            name: '订单列表',
            value: '',
            code: 'international-order-list'
          },
          {
            name: '新增订单',
            value: '',
            code: 'international-create-order'
          }
        ]
      }
    ]
  }
]
