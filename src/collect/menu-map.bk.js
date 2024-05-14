export default [
  {
    name: '销售CRM',
    children: [
      { name: '首页', link: 'crm-home' },
      { name: '销售看板', link: 'crm-kanban' },
      { name: '线索', link: 'customer-clues-index' },
      { name: '商机', link: 'potential-customers-index' },
      { name: '查重', link: 'duplicate-check' },
      { name: '跟踪标签', link: 'input-tag' },
      { name: '销售转单统计', link: 'auto-order-setting' }
    ]
  },
  {
    name: '客户',
    children: [
      { name: '客户管理', link: 'client-list' },
      { name: '资质审核', link: 'client-verify' },
      {
        name: '客服工具',
        complex: [
          { name: '强制激活', link: 'forcibly-activate' },
          { name: '激活停卡', link: 'active-and-deactive' },
          { name: 'IMEI解绑', link: 'imei-unbind' },
          { name: '取消计划套餐', link: 'cancel-plan' },
          { name: '客户改套餐', link: 'customer-modify-package' },
          { name: '卡功能打标修改', link: 'tag-tools' },
          { name: '卡信息互转', link: 'card-info-convert' },
          { name: 'VPDN增值功能', link: 'network-tool', query: { type: '1' } },
          { name: '销卡管理', link: 'eliminate-card' },
          { name: '卡归属查询', link: 'card-ownership-query' },
          { name: 'VPDN详单', link: 'card-vpdn-detail' }
        ]
      },
      { name: 'H5管理', link: 'h5-manage' },
      { name: '模版合同', link: 'template-contract-list' }
    ]
  },
  {
    name: '订单',
    children: [
      { name: '订单列表', link: 'order-list' },
      {
        name: '订单工具',
        complex: [
          { name: '订单重置', link: 'order-tool-reset' }
          // { name: '订单退款', link: 'order-tool-refund' }
        ]
      }
    ]
  },
  {
    name: '仓储',
    children: [
      {
        name: '库存管理',
        complex: [
          { name: '入库记录', link: 'store-record-inner' },
          { name: '库存查看', link: 'store-inventory-list' },
          { name: '出库记录', link: 'store-record-out' }
        ]
      },
      { name: '卡片管理', link: 'card-list' },
      {
        name: '出卡策略',
        complex: [
          {
            name: '移动出卡策略',
            link: 'card-export-strategy-list',
            params: { carrier: 'cmcc' }
          },
          {
            name: '联通出卡策略',
            link: 'card-export-strategy-list',
            params: { carrier: 'unicom' }
          },
          {
            name: '电信出卡策略',
            link: 'card-export-strategy-list',
            params: { carrier: 'chinanet' }
          }
        ]
      },
      {
        name: '白卡管理',
        complex: [
          { name: '白卡入库', link: 'blank-card-warehousing' },
          { name: '白卡入库记录', link: 'blank-card-record' },
          { name: '开卡记录', link: 'blank-card-active-record' }
        ]
      },
      {
        name: '运营商管理',
        complex: [
          { name: '账号管理', link: 'store-carrier' },
          {
            name: '续费接口',
            link: 'store-carrier-plan',
            params: { carrier: 'cmcc' }
          }
        ]
      },
      { name: '库管报表', link: 'store-manage-report' }
    ]
  },
  {
    name: '数据',
    children: [
      {
        name: '用户流量池',
        link: 'user-pool-show'
      },
      {
        name: '系统流量池',
        complex: [
          {
            name: '移动',
            link: 'system-pool-show',
            params: { carrier: 'cmcc' }
          },
          {
            name: '联通',
            link: 'system-pool-show',
            params: { carrier: 'unicom' }
          },
          {
            name: '电信',
            link: 'system-pool-show',
            params: { carrier: 'chinanet' }
          }
        ]
      },
      {
        name: '单卡',
        complex: [
          {
            name: '移动',
            link: 'single-card-show',
            params: { carrier: 'cmcc' }
          },
          {
            name: '联通',
            link: 'single-card-show',
            params: { carrier: 'unicom' }
          },
          {
            name: '电信',
            link: 'single-card-show',
            params: { carrier: 'chinanet' }
          }
        ]
      }
    ]
  },
  {
    name: '运营',
    children: [
      { name: '客户盈亏', link: 'customer-profit' },
      { name: '公告管理', link: 'operation-notice' },
      { name: '推广营销', link: 'operation-pop-list' },
      { name: '销售报表', link: 'operation-sales' },
      {
        name: '运营报表',
        complex: [
          { name: '卡片套餐报表', link: 'operation-report' },
          { name: '运营数据报表', link: 'operation-sale-report' },
          { name: '库管报表', link: 'operation-store-manage-report' }
        ]
      },
      { name: '信息报备', link: 'message-report' },
      { name: '博客页管理', link: 'blog-manage' }
    ]
  },
  {
    name: '合规',
    children: [
      { name: '公网白名单', link: 'ext-whitelist' },
      { name: '合规变更', link: 'compliance-change-list' }
    ]
  },
  {
    name: '财务',
    children: [
      {
        name: '报价管理',
        complex: [
          { name: '套餐列表', link: 'finance-price-list' },
          { name: '卡功能分类', link: 'finance-price-function' },
          { name: '续费分类', link: 'finance-price-renew' },
          { name: '套餐规格', link: 'finance-price-specs' },
          { name: '网络产品', link: 'finance-price-network' },
          { name: '定位产品', link: 'finance-price-lbs' },
          { name: '组合套餐', link: 'finance-price-combine' }
        ]
      },
      {
        name: '余额管理',
        complex: [
          { name: '申请记录', link: 'finance-charge-inner' },
          { name: '到账记录', link: 'finance-charge-reach' },
          { name: '账户余额变更', link: 'finance-charge-record' }
        ]
      },
      {
        name: '财务对账',
        complex: [{ name: '运营商对账', link: 'finance-ledger-carrier' }]
      },
      {
        name: '销售提成',
        complex: [
          { name: '销售提成', link: 'sales-comission' },
          { name: '考核成本', link: 'sales-comission-cost' },
          { name: '提成配置', link: 'sales-comission-config' },
          { name: '提成比例', link: 'sales-comission-percentage' },
          { name: '续费管理', link: 'finance-recharge-manage' },
          { name: '项目订单', link: 'project-order' }
        ]
      },
      {
        name: '佣金管理',
        complex: [
          { name: '佣金结算', link: 'finance-profit-settlement' },
          { name: '佣金明细', link: 'finance-profit-list' }
        ]
      },
      {
        name: '成本管理',
        complex: [
          { name: '成本统计', link: 'finance-cost-statistic' },
          { name: '参数配置', link: 'finance-cost' },
          { name: '资费管理', link: 'finance-carrier-charge' }
        ]
      },
      {
        name: '退款申请',
        link: 'refund-management'
      }
    ]
  },
  {
    name: '其他',
    children: [
      { name: '下载管理', link: 'download' },
      { name: '销卡管理', link: 'eliminate-card' },
      { name: '测试卡管理', link: 'test-card' },
      { name: '卡归属查询', link: 'card-ownership-query' },
      { name: 'NB续费记录', link: 'carrier-nb-renew-record' },
      {
        name: '订正工具',
        complex: [
          { name: '客户改套餐', link: 'customer-modify-package' },
          { name: '运营商改套餐', link: 'carrier-modify-package' },
          { name: '运营商账号修改', link: 'carrier-account-modify' },
          { name: '取消计划套餐', link: 'cancel-plan' },
          { name: '库存卡信息修改', link: 'inventory-modify' },
          { name: '激活卡改库存', link: 'return-stock' },
          { name: '取消停机保号', link: 'cancel-retain-number' },
          { name: 'NB卡APN修改', link: 'nb-apn-modify' },
          { name: '套餐周期对齐', link: 'customer-period-align' },
          { name: '三方订单关闭', link: 'third-party-order-close' }
        ]
      },
      { name: '技术工具', link: 'develop-tool' },
      { name: '取消测试期', link: 'carrier-cancel-test' },
      { name: '黑白名单', link: 'white-list' },
      { name: '操作日志', link: 'operation-log' },
      { name: '熔断管理', link: 'stop-card-fuse' },
      { name: '位置绑定', link: 'card-location-bind' }
    ]
  },
  {
    name: 'VPDN',
    children: [
      { name: '分离计费', link: 'vpdn-separate' },
      { name: '联网限速', link: 'vpdn-speed-limit' },
      { name: 'IP管理工具', link: 'vpdn-ip-list' },
      { name: '路由规则管理', link: 'routing-rules' },
      { name: '地址转换工具', link: 'address-translation' },
      {
        name: '网络工具',
        complex: [
          { name: '打标工具', link: 'network-tool', query: { type: '1' } },
          { name: '企业专网IP配置', link: 'network-tool', query: { type: '2' } },
          { name: '网络产品配置状态', link: 'network-tool', query: { type: '3' } }
        ]
      },
      { name: 'APN设置', link: 'ad-hoc-apn-setting' }
    ]
  },
  {
    name: 'CPE',
    children: [
      { name: '客户列表', link: 'cpe-client-list' },
      { name: '设备列表', link: 'cpe-device-list' },
      { name: '商品管理', link: 'cpe-goods-list' },
      {
        name: '供应商',
        complex: [
          { name: '供应商名录', link: 'cpe-supplier-list' },
          { name: '供应商产品', link: 'cpe-supplier-product' }
        ]
      },
      {
        name: '库存管理',
        complex: [
          { name: '库存列表', link: 'cpe-stock-list' },
          { name: '出库记录', link: 'cpe-deliver-record' },
          { name: '三合一卡', link: 'cpe-three-in-one' }
        ]
      },
      { name: '订单列表', link: 'cpe-order-list' },
      { name: '告警列表', link: 'cpe-alarm-list' },
      { name: '设备退换管理', link: 'cpe-device-exchange' },
      {
        name: '设备工具',
        complex: [
          { name: 'ONVIF配置', link: 'cpe-onvif-configure' },
          { name: 'Mqtt Topic管理', link: 'cpe-tool-mqtt-topic' },
          { name: 'openVPN配置', link: 'cpe-tool-openvpn-config' },
          { name: 'openVPN服务器', link: 'cpe-tool-openvpn-server' }
        ]
      }
    ]
  }
]
