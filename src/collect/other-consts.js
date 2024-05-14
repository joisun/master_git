/**
 * Created by gzj on 17/2/13.
 */

// 运营商套餐类型
export const CARRIER = {
  CMCC: 'CMCC', // 移动
  UNICOM: 'UNICOM', // 联通,
  CHINANET: 'CHINANET' // 电信
}

// 运营商名表
export const CARRIER_NAME_MAP = {
  [CARRIER.CMCC]: '中国移动',
  [CARRIER.UNICOM]: '中国联通',
  [CARRIER.CHINANET]: '中国电信'
}

// 计费套餐类型
export const FEE_CAL_TYPE = {
  POOL: 'POOL', // 流量池
  STANDARD: 'STANDARD', // 标准套餐
  PRE_POOL: 'PRE_POOL' // 后向流量池
}

// 卡类型
export const CARD_TYPE = {
  PRODUCTION: 'PRODUCTION', // 正式卡
  TEST: 'TESTING' // 测试卡
}

// 套餐类型（计费周期）
export const FEE_CAL_CYCLE = {
  MONTHLY: 'MONTHLY',
  CUSTOMER: 'CUSTOMER'
}
