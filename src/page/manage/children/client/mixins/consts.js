// 没有用到了吧。。

/**
 * Created by gzj on 17/3/9.
 */
import planMap from '@/collect/plan-map'
import carrierMap from '@/collect/carrier-map'

import tagExtract from '@/global/directive/tag-extract'
import dateFormat from '@/global/filters/date-format'
import numberFilter from '@/global/filters/number-fixed'

const fixMoney = (e) => {
  if (e) return Number(e).toFixed(2)
  else return 0
}

export {
  CARRIER, CARRIER_NAME_MAP, FEE_CAL_TYPE, CARD_TYPE, FEE_CAL_CYCLE
} from '@/collect/other-consts'

export const statusOptions = [
  {
    label: '待审核',
    value: 'not-audit'
  },
  {
    label: '通过',
    value: 'pass'
  },
  {
    label: '未通过审核',
    value: 'not-pass'
  }
]
export const CERTIFY_TYPE = {
  COMPANY: '企业',
  LEGAL_BODY: '法人'
}
export const userType = [
  { name: '直客', key: 'dc' },
  { name: '分销', key: 'ds' },
  { name: '分润', key: 'dp' }
]
export const PRICE_SET_COLUMNS = [
  { key: 'id', label: 'ID', width: '67' },
  {
    key: 'operator',
    label: '运营商',
    width: '100',
    formatter: (row, { property }) => carrierMap.getValue()[carrierMap.getNumberMap()[row[property]]]
  },
  {
    key: 'offerType',
    label: '套餐类型',
    formatter: (row, { property }) => planMap.getValue()[row[property]],
    width: '100'
  },
  {
    key: 'dataAmount',
    label: '套餐规格',
    formatter: (row, { property }) => tagExtract(null, {
      value: {
        offerType: row.offerType,
        validity: row.validity,
        validityUnit: row.validityUnit,
        volume: row.volume,
        unlimited: row.unlimitedVolume
      }
    }),
    width: '113'
  },
  { key: 'categoryName', label: '套餐分类', width: '197' },
  {
    key: 'validDuration',
    label: '购卡周期',
    formatter: (row, { property }) => {
      if (row.offerType === 'monthly') {
        return `${row.minPurchaseLimit}月-${row.maxPurchaseLimit}月`
      } else return '无'
    },
    width: '97'
  },
  { key: 'status', label: '当前状态', width: '97', formatter: (row, { property }) => row[property] === 'on' ? '上架' : '下架' },
  // {key: 'supportPool', label: '套餐分类', width: '180'},
  { key: 'officalPrice', label: '运营商报价', width: '113', formatter: (row, { property }) => fixMoney(row[property]) },
  { key: 'price', label: '平台报价', width: '97', formatter: (row, { property }) => fixMoney(row[property]) },
  { key: 'bottomPrice', label: '销售底价', width: '97', formatter: (row, { property }) => fixMoney(row[property]) }
]

export const userInfoColumns = [
  { name: '客户名称', key: 'orgName' },
  { name: '账号', key: 'userAccount' },
  { name: '公司名称', key: 'fullname' },
  { name: '联系电话', key: 'phone' },
  { name: '联系邮箱', key: 'email' },
  { name: '地址', key: 'address' },
  { name: '用户姓名', key: 'name' },
  { name: '行业', key: 'industry', formatter: (e, data) => `${data.industry} - ${data.industryScope}` },
  { name: '', key: '' },
  { name: '账号类型', key: 'userType' },
  { name: '组织ID', key: 'orgId' },
  { name: '销售归属', key: 'saleName' },
  { name: '账户余额', key: 'balance', formatter: (e, data) => data[e] ? numberFilter(data[e]) : 0 },
  { name: '注册时间', key: 'registerTime', formatter: (e, data) => dateFormat(data[e]) },
  { name: '最后登录时间', key: 'lastLoginTime', formatter: (e, data) => dateFormat(data[e]) },
  { name: '执照注册号', key: 'licence' },
  { name: '法人身份证号', key: 'idCardNum' }
]
