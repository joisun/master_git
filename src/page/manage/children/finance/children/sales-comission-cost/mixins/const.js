/*
 * @Author: SerkeyWu
 * @Date: 2021-02-19 10:03:01
 * @Description: Do not edit
 * @LastEditors: wushiji
 * @LastEditTime: 2021-03-04 14:23:32
 */
import enums from '@/constant/enums'

export const COLUMNS = [
  { key: 'priceOfferId', name: '套餐ID', width: '67' },
  {
    key: 'carrier',
    name: '运营商',
    width: '67',
    formatter: (row) => enums.carrier.get(row.carrier)
  },
  {
    key: 'planName',
    name: '套餐规格',
    width: '100'
  },
  {
    key: 'officalPrice',
    name: '运营商价',
    width: '67'
  },
  {
    key: 'cost',
    name: '销售成本（不含卡费）',
    width: '160'
  },
  {
    key: 'rechargeCost',
    name: '续费成本',
    width: '127'
  },
  {
    name: '插拔卡费',
    width: '80',
    formatter: (row) => (row.cardCost ? row.cardCost.PLASTIC : '')
  },
  {
    name: '陶瓷插拔卡费',
    width: '100',
    formatter: (row) => (row.cardCost ? row.cardCost.CERAMICS : '')
  },
  {
    name: '消费级贴片卡费',
    width: '80',
    formatter: (row) => (row.cardCost ? row.cardCost.PLASTIC_PASTER : '')
  },
  {
    name: '工业级贴片卡费',
    width: '80',
    formatter: (row) => (row.cardCost ? row.cardCost.CERAMICS_PASTER : '')
  },
  {
    key: 'signedCarrierName',
    name: '供应商',
    width: '127'
  },
  {
    key: 'carrierName',
    name: '供应商账号',
    width: '160',
    formatter: (row) => row.carrierName
  }
]
