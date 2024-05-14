/*
 * @Author: SerkeyWu
 * @Date: 2021-02-19 10:03:01
 * @Description: Do not edit
 * @LastEditors: wushiji
 * @LastEditTime: 2021-03-04 10:10:33
 */
import numberFilter from '@/global/filters/number-fixed'
import saleFormat from '@/global/filters/sale-format'

export const COLUMNS = [
  { key: 'saleName', name: '销售', width: '67', formatter: (row) => saleFormat(row.saleName) },
  {
    key: 'orgName',
    name: '客户名称',
    width: '167',
    formatter: (row) => `${row.orgName}(${row.orgId})`
  },
  {
    key: 'income',
    name: '新增金额',
    width: '67',
    sortable: 'custom',
    formatter: (row) => numberFilter(row.income)
  },
  {
    key: 'recharge',
    name: '续费金额',
    width: '67',
    sortable: 'custom',
    formatter: (row) => numberFilter(row.recharge)
  },
  {
    key: 'gross',
    name: '毛利额',
    width: '127',
    sortable: 'custom',
    formatter: (row) => numberFilter(row.gross)
  },
  {
    key: 'grossMargin',
    name: '毛利率',
    width: '127',
    sortable: 'custom',
    formatter: (row) => numberFilter(row.grossMargin * 100) + '%'
  },
  {
    key: 'pendingIncome',
    name: '待结算',
    width: '127',
    formatter: (row) => numberFilter(row.pendingIncome)
  },
  {
    key: 'commission',
    name: '预估提成',
    width: '127',
    formatter: (row) => numberFilter(row.commission),
    sortable: 'custom'
  }
]
export const COLUMNS_DETAIL = [
  {
    key: 'transactionDate',
    name: '交易日期',
    width: '65',
    sortable: 'custom'
  },
  {
    key: 'orderNo',
    name: '订单编号',
    width: '120'
  },
  {
    key: 'priceOfferId',
    name: '套餐ID',
    width: '67'
  },
  {
    key: 'income',
    name: '收入金额',
    width: '67',
    formatter: (row) => numberFilter(row.income + row.recharge + row.otherIncome),
    sortable: 'custom'
  },
  {
    key: 'cost',
    name: '成本',
    width: '67',
    formatter: (row) => numberFilter(row.cost),
    sortable: 'custom'
  },
  // {
  //   key: 'profit',
  //   name: '利润',
  //   width: '67',
  //   formatter: (row) =>
  //     row.income + row.recharge + row.otherIncome - row.cost
  //       ? numberFilter(row.income + row.recharge + row.otherIncome - row.cost)
  //       : 0,
  //   sortable: 'custom'
  // },
  {
    key: 'gross',
    name: '毛利额',
    width: '127',
    sortable: 'custom',
    formatter: (row) => numberFilter(row.gross)
  },
  {
    key: 'grossMargin',
    name: '毛利率',
    width: '67',
    sortable: 'custom',
    formatter: (row) => numberFilter(row.grossMargin * 100) + '%'
  },
  {
    key: 'comission',
    name: '提成金额',
    width: '67',
    formatter: (row) => numberFilter(row.commission),
    sortable: 'custom'
  }
]
