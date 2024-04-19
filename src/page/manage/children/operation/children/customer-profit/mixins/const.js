import numberFilter from '@/global/filters/number-fixed'

const specificationMap = {
  'STANDARD': '单卡按月卡',
  'CUSTOM': '自定义卡',
  'POOL': '流量池卡'
}

export const COLUMNS = [
  { key: "rank", name: "排名", width: "37", sortable: 'custom' },
  { key: "orgId", name: "客户ID", width: "67", sortable: 'custom' },
  { key: "orgName", name: "客户名称", width: "167" },
  { key: "sales", name: "所属销售", width: "67", sortable: 'custom' },
  {
    key: "totalCards",
    name: "总卡数",
    width: "67",
    sortable: 'custom'
  },
  {
    key: "profitMoney",
    name: "盈亏金额",
    width: "67",
    formatter: (row) => (row.income - row.cost ? numberFilter((row.income - row.cost) / 10000) : 0),
    sortable: 'custom'
  },
  {
    name: "最大亏损套餐（ID）",
    width: "127",
    formatter: (row) => `${row.maxLossName}（${row.maxLossPriceOfferId}）`,
  },
  {
    name: "最大盈利套餐（ID）",
    width: "127",
    formatter: (row) => `${row.maxProfitName}（${row.maxProfitPriceOfferId}）`,
  },
];
export const COLUMNS_DETAIL = [
  { name: "套餐（ID）", width: "67", formatter: (row) => `${row.displayName}（${row.priceOfferId}）`,},
  { key: "cardType", name: "卡类型", width: "67",  formatter: (row) => specificationMap[row.cardType]},
  {
    key: "cardCount",
    name: "卡数",
    width: "67",
    sortable: 'custom'
  },
  {
    key: "income",
    name: "收入",
    width: "67",
    formatter: (row) => (row.income ? numberFilter((row.income) / 10000) : 0),
    sortable: 'custom'
  },
  {
    key: "cost",
    name: "成本",
    width: "67",
    formatter: (row) => (row.cost ? numberFilter((row.cost) / 10000) : 0),
    sortable: 'custom'
  },
  {
    key: "profit_money",
    name: "盈亏金额",
    width: "67",
    formatter: (row) => (row.income - row.cost ? numberFilter((row.income - row.cost) / 10000) : 0),
    sortable: 'custom'
  },
];
