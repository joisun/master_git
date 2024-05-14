/*
 * @Author: SerkeyWu
 * @Date: 2021-01-22 18:38:55
 * @Description: Do not edit
 * @LastEditors: SerkeyWu
 * @LastEditTime: 2021-02-07 13:58:34
 */
import enums from '@/constant/enums'
import renewOptions from '@/constant/options/renew'

const TABLE_COLUMES = [
  { key: 'id', name: 'ID', width: '40' },
  { key: 'name', name: '分类名称', width: '120' },
  { key: 'displayName', name: '分类别名', width: '140' },
  {
    key: 'carrier',
    name: '运营商',
    width: '50',
    formatter: (row, { property }) => enums.carrier.get(row[property]),
  },
  {
    key: 'vpdnOnly',
    name: '网络属性',
    width: '40',
    formatter: (row, { property }) =>
      row[property]
        ? renewOptions.networkAttribute[1].label
        : renewOptions.networkAttribute[0].label,
  },
  {
    key: 'type',
    name: '套餐属性',
    width: '40',
    formatter: (row, { property }) =>
      row[property] === 'forward'
        ? renewOptions.packageAttribute[0].label
        : renewOptions.packageAttribute[1].label,
  },
  {
    key: 'platform',
    name: '所属平台',
    width: '60',
  },
  {
    key: 'renewRestriction',
    name: '续费限制',
    formatter: (row, { property }) =>
      row[property].map((e) => renewOptions.renewRestrictionObj[e]).join(','),
    width: 160
  },
  {
    key: 'disabled',
    name: '套餐分类状态',
    width: '60',
    formatter: (row, { property }) => (row[property] ? '禁用' : '启用'),
  },
]

export { TABLE_COLUMES }
