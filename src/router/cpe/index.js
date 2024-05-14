import Cpe from '@/page/cpe'
import Client from '@/page/cpe/children/client/client.vue'
import ClientList from '@/page/cpe/children/client/client-list/client-list.vue'
import ClientPriceSet from '@/page/cpe/children/client/client-price-set/client-price-set.vue'
import Device from '@/page/cpe/children/device/device.vue'
import DeviceList from '@/page/cpe/children/device/device-list/device-list.vue'
import DeviceTerminal from '@/page/cpe/children/device/device-list/terminal/index.vue'
import Order from '@/page/cpe/children/order/order.vue'
import OrderList from '@/page/cpe/children/order/order-list/order-list.vue'
import Stock from '@/page/cpe/children/stock/stock.vue'
import StockList from '@/page/cpe/children/stock/stock-list/stock-list.vue'
import StockIn from '@/page/cpe/children/stock/stock-in/stock-in.vue'
import DeliverRecord from '@/page/cpe/children/stock/deliver-record/deliver-record.vue'
import Goods from '@/page/cpe/children/goods/goods.vue'
import GoodsList from '@/page/cpe/children/goods/goods-list/goods-list.vue'
import GoodsEdit from '@/page/cpe/children/goods/goods-edit/goods-edit.vue'
import PackageEdit from '@/page/cpe/children/goods/package-edit/package-edit.vue'
import Tools from '@/page/cpe/children/tools/tools.vue'
import ToolsLogs from '@/page/cpe/children/tools/logs/logs.vue'
import ToolsBatchRestartSetting from '@/page/cpe/children/tools/batch-restart-setting/batch-restart-setting.vue'
import SelfCheck from '@/page/cpe/children/tools/self-check/self-check.vue'
import Recovery from '@/page/cpe/children/tools/recovery/recovery.vue'
import Upgrade from '@/page/cpe/children/tools/upgrade/upgrade.vue'
import Wan2lan from '@/page/cpe/children/tools/wan2lan/wan2lan.vue'
import Supplier from '@/page/cpe/children/supplier/supplier.vue'
import SupplierList from '@/page/cpe/children/supplier/supplier-list/index.vue'
import SupplierProductList from '@/page/cpe/children/supplier/product-list/index.vue'
import SupplierProductEdit from '@/page/cpe/children/supplier/product-edit/index.vue'
import OnvifConfig from '@/page/cpe/children/tools/onvif-configure/index.vue'
import OpenVpnConfig from '@/page/cpe/children/tools/openvpn-configure/index.vue'
import OpenVpnServer from '@/page/cpe/children/tools/openvpn-server/index.vue'
import Alarm from '@/page/cpe/children/alarm/alarm.vue'
import AlarmList from '@/page/cpe/children/alarm/alarm-list/alarm-list.vue'
import AlarmSetting from '@/page/cpe/children/alarm/setting/setting.vue'
import MqttTopic from '@/page/cpe/children/tools/mqtt-topic/index.vue'
import ExtendExpire from '@/page/cpe/children/tools/extend-expire/extend-expire.vue'
import ThreeInOne from '@/page/cpe/children/stock/three-in-one/index.vue'
import DeviceExchange from '@/page/cpe/children/deviceExchange/deviceExchange'
export default {
  path: 'cpe',
  name: 'cpe',
  component: Cpe,
  children: [
    {
      path: 'supplier',
      name: 'cpe-supplier',
      component: Supplier,
      children: [
        {
          path: 'list',
          name: 'cpe-supplier-list',
          component: SupplierList
        },
        {
          path: 'product',
          name: 'cpe-supplier-product',
          component: SupplierProductList
        },
        {
          path: 'product-edit',
          name: 'cpe-supplier-product-edit',
          component: SupplierProductEdit
        }
      ]
    },
    {
      path: 'client',
      name: 'cpe-client',
      component: Client,
      children: [
        {
          path: 'list',
          name: 'cpe-client-list',
          component: ClientList
        },
        {
          path: 'price',
          name: 'cpe-client-price-set',
          component: ClientPriceSet
        }
      ]
    },
    {
      path: 'device',
      name: 'cpe-device',
      component: Device,
      children: [
        {
          path: 'list',
          name: 'cpe-device-list',
          component: DeviceList
        },
        {
          path: 'terminal',
          name: 'cpe-device-terminal',
          component: DeviceTerminal
        },
        {
          path: 'logs',
          name: 'cpe-tool-logs',
          component: ToolsLogs
        },
        {
          path: 'self-check',
          name: 'cpe-tool-self-check',
          component: SelfCheck
        },
        {
          path: 'batch-restart-setting',
          name: 'cpe-batch-restart-setting',
          component: ToolsBatchRestartSetting
        },
        {
          path: 'recovery',
          name: 'cpe-tool-recovery',
          component: Recovery
        },
        {
          path: 'upgrade',
          name: 'cpe-tool-upgrade',
          component: Upgrade
        },
        {
          path: 'wan2lan',
          name: 'cpe-tool-wan2lan',
          component: Wan2lan
        },
        {
          path: 'extend-expire',
          name: 'extend-expire',
          component: ExtendExpire
        }
      ]
    },
    {
      path: 'order',
      name: 'cpe-order',
      component: Order,
      children: [
        {
          path: 'list',
          name: 'cpe-order-list',
          component: OrderList
        }
      ]
    },
    {
      path: 'stock',
      name: 'cpc-stock',
      component: Stock,
      children: [
        {
          path: 'list',
          name: 'cpe-stock-list',
          component: StockList
        },
        {
          path: 'in',
          name: 'cpe-stock-in',
          component: StockIn
        },
        {
          path: 'three-in-one',
          name: 'cpe-three-in-one',
          component: ThreeInOne
        }
      ]
    },
    {
      path: 'deliver-record',
      name: 'cpe-deliver-record',
      component: DeliverRecord
    },
    {
      path: 'goods',
      name: 'cpe-goods',
      component: Goods,
      children: [
        {
          path: 'list',
          name: 'cpe-goods-list',
          component: GoodsList
        },
        {
          path: 'goods-edit',
          name: 'cpe-goods-edit',
          component: GoodsEdit
        },
        {
          path: 'package-edit',
          name: 'cpe-package-edit',
          component: PackageEdit
        }
      ]
    },
    {
      path: 'alarm',
      name: 'cpe-alarm',
      component: Alarm,
      children: [
        {
          path: 'list',
          name: 'cpe-alarm-list',
          component: AlarmList
        },
        {
          path: 'setting',
          name: 'cpe-alarm-setting',
          component: AlarmSetting
        }
      ]
    },
    {
      path: 'cpe-device-exchange',
      name: 'cpe-device-exchange',
      component: DeviceExchange
    },
    {
      path: 'tool',
      name: 'cpe-tool',
      component: Tools,
      children: [
        {
          path: 'onvif-configure',
          name: 'cpe-onvif-configure',
          component: OnvifConfig
        },
        {
          path: 'mqtt-topic',
          name: 'cpe-tool-mqtt-topic',
          component: MqttTopic
        },
        {
          path: 'openvpn-config',
          name: 'cpe-tool-openvpn-config',
          component: OpenVpnConfig
        },
        {
          path: 'openvpn-server',
          name: 'cpe-tool-openvpn-server',
          component: OpenVpnServer
        }
      ]
    }
  ]
}
