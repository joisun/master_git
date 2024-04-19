/**
 * Created by guests on 17/1/24.
 */

export {
  CARRIER,
  CARRIER_NAME_MAP,
  CARD_TYPE,
  FEE_CAL_TYPE,
  FEE_CAL_CYCLE
} from '@/collect/other-consts'

export const GOOD_COLUMNS = [
  { name: '数量', key: 'buyCount', width: '6' },
  { name: '功能',
    key: 'type',
    width: '18',
    formatter: (row) => `${row.type === 'POOL' ? '流量池' : '标准卡'} ${row.supportSms ? '短信收发' : ''} ${row.locationService ? '定位' : ''} ${row.apnSetting ? '需要设置apn' : ''} ${row.cardDeviceBundling ? '机卡绑定' : ''} ${row.realnameRequire ? '需要实名认证' : ''} ${row.testValidity && row.supportTestingCard ? `测试期:${row.testValidity}月` : ''} ` },
  { name: '最晚激活时间', key: 'activationDeadLine', width: '10' },
  { name: 'iccid(区间内不一定连续)', key: 'iccidRange', width: '36', align: 'left' }
]
