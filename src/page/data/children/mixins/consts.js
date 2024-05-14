import volumeFormat from '@/global/filters/volume-format'
import numberFixed from '@/global/filters/number-fixed'
import enums from '@/constant/enums'

export const OTHERS_COLUMNS = [
  { name: '序号', key: 'index', width: '80' },
  { name: '描述', key: 'priceOfferName', width: '120' },
  { name: '激活卡数', key: 'activeCount', width: '120' },
  { name: '流量总量', key: 'totalVolume', width: '120', sortable: true, formatter: (row, { property }) => volumeFormat(row[property]) },
  { name: '使用量', key: 'usedVolume', width: '120', sortable: true, formatter: (row, { property }) => (row.priceOfferName === '扩池锁卡' ? '-' : volumeFormat(row[property])) },
  { name: '差额流量总量', key: 'diffVolume', width: '140', sortable: true, formatter: (row, { property }) => '-' },
  { name: '收入', key: 'totalIncome', width: '120', sortable: true, formatter: (row, { property }) => '-' },
  { name: '采购成本', key: 'expectCost', width: '120', sortable: true, formatter: (row, { property }) => '-' },
  { name: '实际成本', key: 'realCost', width: '120', sortable: true, formatter: (row, { property }) => numberFixed(row[property]) },
  { name: '毛利', key: 'grossProfit', width: '120', sortable: true, formatter: (row, { property }) => '-' },
  { name: '毛利率', key: 'grossProfitMargin', width: '120', sortable: true, formatter: (row, { property }) => '-' },
  { name: '备注', key: 'memo', width: '140' }
]

export const CUSTOMER_COLUMNS = [
  { name: '序号', key: 'index', width: '80' },
  { name: '组织ID', key: 'orgId', width: '120', formatter: (row, { property }) => (row.orgId ? row.orgId : '-') },
  { name: '客户名称', key: 'orgName', width: '130', formatter: (row, { property }) => (row.isExpandDetail || row.isSummary ? row.priceOfferName : row.orgName) },
  { name: '激活卡数', key: 'activeCount', width: '120' },
  { name: '流量总量', key: 'totalVolume', width: '120', sortable: true, formatter: (row, { property }) => volumeFormat(row[property]) },
  { name: '使用量', key: 'usedVolume', width: '120', sortable: true, formatter: (row, { property }) => (row.priceOfferType === 'package' || row.priceOfferType === 'pool-package' ? '-' : volumeFormat(row[property])) },
  { name: '差额流量总量', key: 'diffVolume', width: '140', sortable: true, formatter: (row, { property }) => volumeFormat(row[property]) },
  { name: '收入(元)', key: 'totalIncome', width: '120', sortable: true, formatter: (row, { property }) => numberFixed(row[property]) },
  { name: '采购成本(元)', key: 'expectCost', width: '135', sortable: true, formatter: (row, { property }) => numberFixed(row[property]) },
  { name: '实际成本(元)', key: 'realCost', width: '135', sortable: true, formatter: (row, { property }) => numberFixed(row[property]) },
  { name: '毛利(元)', key: 'grossProfit', width: '120', formatter: (row, { property }) => numberFixed(row[property]) },
  { name: '毛利率', key: 'grossProfitMargin', width: '120', formatter: (row, { property }) => ((row[property] === -1 || row[property] === '-') ? '-' : (row[property] * 100).toFixed(2) + '%') },
  { name: '备注', key: 'memo', width: '140' }
]

export const CARRIER_COLUMNS = [
  { name: '序号', key: 'index', width: '80' },
  { name: '套餐名称', key: 'priceOfferName', width: '120' },
  { name: '套餐类型', key: 'priceOfferType', width: '120', formatter: (row, { property }) => (row[property] ? enums.planType.get(row[property]) : '-') },
  { name: '激活卡数', key: 'activeCount', width: '120' },
  { name: '流量总量', key: 'totalVolume', width: '120', sortable: true, formatter: (row, { property }) => volumeFormat(row[property]) },
  { name: '使用量', key: 'usedVolume', width: '120', sortable: true, formatter: (row, { property }) => (row.priceOfferType === 'package' || row.priceOfferType === 'pool-package' ? '-' : volumeFormat(row[property])) },
  { name: '差额流量总量', key: 'diffVolume', width: '140', sortable: true, formatter: (row, { property }) => volumeFormat(row[property]) },
  { name: '收入(元)', key: 'totalIncome', width: '120', sortable: true, formatter: (row, { property }) => numberFixed(row[property]) },
  { name: '采购成本(元)', key: 'expectCost', width: '135', sortable: true, formatter: (row, { property }) => numberFixed(row[property]) },
  { name: '实际成本(元)', key: 'realCost', width: '135', sortable: true, formatter: (row, { property }) => numberFixed(row[property]) },
  { name: '毛利(元)', key: 'grossProfit', width: '120', formatter: (row, { property }) => numberFixed(row[property]) },
  { name: '毛利率', key: 'grossProfitMargin', width: '120', formatter: (row, { property }) => ((row[property] === -1 || row[property] === '-') ? '-' : (row[property] * 100).toFixed(2) + '%') },
  { name: '备注', key: 'memo', width: '140' }
]

export const SINGLE_CARD_CARRIER_COLUMNS = [
  { name: '序号', key: 'index', width: '80' },
  { name: '套餐名称', key: 'offerName', width: '120' },
  { name: '套餐类型', key: 'offerType', width: '120', formatter: (row, { property }) => (row[property] ? enums.planType.get(row[property]) : '-') },
  { name: '计费卡数', key: 'chargeCount', width: '120' },
  { name: '流量总量', key: 'totalVolume', width: '120', sortable: true, formatter: (row, { property }) => volumeFormat(row[property]) },
  { name: '使用量', key: 'usedVolume', width: '120', sortable: true, formatter: (row, { property }) => (row.priceOfferType === 'package' || row.priceOfferType === 'pool-package' ? '-' : volumeFormat(row[property])) },
  { name: '收入(元)', key: 'totalIncome', width: '120', sortable: true, formatter: (row, { property }) => numberFixed(row[property]) },
  { name: '采购成本(元)', key: 'expectCost', width: '135', sortable: true, formatter: (row, { property }) => numberFixed(row[property]) },
  { name: '实际成本(元)', key: 'realCost', width: '135', sortable: true, formatter: (row, { property }) => numberFixed(row[property]) },
  { name: '毛利(元)', key: 'grossProfit', width: '120', sortable: true, formatter: (row, { property }) => numberFixed(row[property]) },
  { name: '毛利率', key: 'grossProfitMargin', width: '120', sortable: true, formatter: (row, { property }) => ((row[property] === -1 || row[property] === '-') ? '-' : (row[property] * 100).toFixed(2) + '%') }
]
