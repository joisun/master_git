const NumberFixed = (val) => (val ? (Number(val) / 10000).toFixed(2) : '0')

const columns = [
  { key: 'buyCountDay',
    name: '当日新购卡数',
    width: 120,
    formatter: (row, { property }) => row[property] || '0'
  },
  { key: 'buyCountMonth',
    name: '当月累计购卡数',
    width: '120px',
    formatter: (row, { property }) => row[property] || '0'
  },
  { key: 'buyMoneyDay',
    name: '当日新增购卡金额',
    formatter: (row, { property }) => `${NumberFixed(row[property])}`,
    width: 120
  },
  { key: 'buyMoneyMonth',
    name: '当月累计购卡金额',
    formatter: (row, { property }) => `${NumberFixed(row[property])}`,
    width: 120
  },
  { key: 'rechargeMoneyDay',
    name: '当日续费金额',
    formatter: (row, { property }) => `${NumberFixed(row[property])}`,
    width: 120
  },
  { key: 'rechargeMoneyMonth',
    name: '当月累计续费金额',
    formatter: (row, { property }) => `${NumberFixed(row[property])}`,
    width: 120
  }
]
export default columns
