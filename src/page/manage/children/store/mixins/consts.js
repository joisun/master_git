/**
 * Created by gzj on 17/2/13.
 */

export {
  CARRIER,
  CARRIER_NAME_MAP,
  FEE_CAL_TYPE
}
  from '@/collect/other-consts'

// eslint-disable-next-line max-len
const RANKS_MAP = [0, 2, 5, 10, 20, 30, 50, 70, 100, 150, 200, 300, 500, 700, 1024, 2048, 3072, 4096, 6144, 10240, 11264, 15360, 20480, 24576, 25600, 30720, 36864, 40960, 49152, 51200, 102400, 204800, 1048576]

// 库存操作类型
export const CARRIER_RANKS = RANKS_MAP.map((e) => ({
  label: e,
  value: e
}))

export const LIST_RATE_PLAN_RANKS = [
  ...CARRIER_RANKS,
  // CARRIER_RANKS没有20000这个选项，所以不会冲突
  {
    value: 20000,
    label: 20000,
    useCountAsVolume: true
  }
]
