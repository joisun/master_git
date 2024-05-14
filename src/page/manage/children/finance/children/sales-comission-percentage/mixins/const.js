/*
 * @Author: SerkeyWu
 * @Date: 2021-02-19 10:03:01
 * @Description: Do not edit
 * @LastEditors: SerkeyWu
 * @LastEditTime: 2021-02-24 17:45:05
 */
import enums from '@/constant/enums'

const computeSpan = (arr) => {
  const left = arr[0] === 0 ? '(' : '['
  const right = arr[1] === 100 ? ']' : ')'
  return `${left}${arr[0]}，${arr[1]}${right}`
}

export const COLUMNS = [
  {
    key: 'orderType',
    name: '订单类型',
    width: '67',
    formatter: (row) => enums.salesIncomeOrderType.get(row.orderType)
  },
  {
    key: 'profitLimit',
    name: '毛利率区间',
    width: '167',
    formatter: (row) => computeSpan(row.profitLimit)
  },
  {
    key: 'incomeCommission',
    name: '收入提成',
    width: '67',
    formatter: (row) => row.incomeCommission * 100 + '%'
  },
  {
    key: 'profitCommission',
    name: '毛利提成',
    width: '67',
    formatter: (row) => row.profitCommission * 100 + '%'
  }
]
export const COLUMNS_RENEW = [
  {
    key: 'orderType',
    name: '订单类型',
    width: '67',
    formatter: (row) => enums.salesIncomeOrderType.get(row.orderType)
  },
  {
    key: 'renewTime',
    name: '续费时间',
    width: '67',
    formatter: (row) => enums.rechargeLimit.get(row.rechargeLimit.toString())
  },
  {
    key: 'profitLimit',
    name: '毛利率区间',
    width: '167',
    formatter: (row) => computeSpan(row.profitLimit)
  },
  {
    key: 'incomeCommission',
    name: '收入提成',
    width: '67',
    formatter: (row) => row.incomeCommission * 100 + '%'
  },
  {
    key: 'profitCommission',
    name: '毛利提成',
    width: '67',
    formatter: (row) => row.profitCommission * 100 + '%'
  }
]
