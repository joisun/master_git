import dateFormat from '@/global/filters/date-format'
import enums from '@/constant/enums'
import saleFormat from '@/global/filters/sale-format'
import carrierAccountFormat from '@/global/filters/carrier-account-format'
import store from '@/store'

const restltSupplierList = [
  { key: 'id', name: 'ID', width: '67' },
  { key: 'iccid', name: 'ICCID', width: '170' },
  { key: 'msisdn', name: '手机号', width: '150' },
  { key: 'submitter', name: '申请人', width: '120', formatter: (row, { property }) => saleFormat(row[property]) },
  { key: 'submitTime', name: '申请时间', width: '105', formatter: (row, { property }) => dateFormat(row[property]) },
  { key: 'orgId', name: '企业ID', width: '100', formatter: (row, { property }) => (row[property] === -1 ? '无' : row[property]) },
  { key: 'cardRetiringType', name: '销卡类型', width: '120', formatter: (row, { property }) => row[property] ? store.getters.getEnum('cardRetiringType')[row[property]]: ''},
  { key: 'doRefund', name: '是否退费', width: '90', formatter: (row, { property }) => row[property] ? '是' : '否'},
  { key: 'approvalProcessId', name: '审批流程号', width: '120'},
  { key: 'refuseCause', name: '理由', width: '190' },
  { key: 'carrier', name: '运营商', width: '90', formatter: (row, { property }) => enums.carrier.get(row.carrier) },
  { key: 'carrierAccountId', name: '所属账号', width: '150', formatter: (row, { property }) => carrierAccountFormat(row[property], row.carrier) },
  { key: 'saleName', name: '所属销售', width: '110', formatter: (row, { property }) => saleFormat(row[property]) },
  { key: 'status', name: '处理结果', width: '120', formatter: (row, { property }) => enums.retiringStatus.get(row[property]) },
]
const waitList = [
  { key: 'id', name: 'ID', width: '67' },
  { key: 'iccid', name: 'ICCID', width: '170' },
  { key: 'msisdn', name: '手机号', width: '150' },
  { key: 'submitter', name: '申请人', width: '120', formatter: (row, { property }) => saleFormat(row[property]) },
  { key: 'submitTime', name: '申请时间', width: '150', formatter: (row, { property }) => dateFormat(row[property]) },
  { key: 'orgId', name: '企业ID', width: '90' },
  { key: 'cardRetiringType', name: '销卡类型', width: '120', formatter: (row, { property }) => row[property] ? store.getters.getEnum('cardRetiringType')[row[property]]: ''},
  { key: 'doRefund', name: '是否退费', width: '90' ,formatter: (row, { property }) => row[property] ? '是' : '否'},
  { key: 'approvalProcessId', name: '审批流程号', width: '120' },
  { key: 'submitCause', name: '申请理由', width: '190' },
  { key: 'carrier', name: '运营商', width: '90', formatter: (row, { property }) => enums.carrier.get(row.carrier) },
  { key: 'carrierAccountId', name: '所属账号', width: '150', formatter: (row, { property }) => carrierAccountFormat(row[property], row.carrier) },
  { key: 'saleName', name: '所属销售', width: '110', formatter: (row, { property }) => saleFormat(row[property]) },
  { key: 'status', name: '处理结果', width: '100', formatter: (row, { property }) => enums.retiringStatus.get(row[property]) }
]

const restltCustomerList = [
  { key: 'id', name: 'ID', width: '67' },
  { key: 'iccid', name: 'ICCID', width: '170' },
  { key: 'submitTime', name: '申请时间', width: '150', formatter: (row, { property }) => dateFormat(row[property]) },
  { key: 'status', name: '处理结果', width: '100', formatter: (row, { property }) => enums.retiringStatus.get(row[property]) },
  { key: 'finishedTime', name: '处理时间', width: '150', formatter: (row, { property }) => dateFormat(row[property]) },
  { key: 'cardRetiringType', name: '销卡类型', width: '120', formatter: (row, { property }) => row[property] ? store.getters.getEnum('cardRetiringType')[row[property]]: ''},
  { key: 'doRefund', name: '是否退费', width: '90', formatter: (row, { property }) => row[property] ? '是' : '否'},
  { key: 'approvalProcessId', name: '审批流程号', width: '120' },
  { key: 'submitCause', name: '描述', width: '190' },
  { key: 'refuseCause', name: '原因', width: '120' }
]

export { restltCustomerList, waitList, restltSupplierList }
