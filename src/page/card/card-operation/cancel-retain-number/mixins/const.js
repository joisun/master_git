import dateFormat from '@/global/filters/date-format'

const COLUMNS = [
  {
    key: "iccids",
    label: "ICCID",
    width: "100",
  },
  {
    key: "cancelMonthCount",
    label: "取消月数",
    width: "60",
  },
  {
    key: "refundMoney",
    label: "退款金额",
    width: "60",
    formatter: (row, { property }) => (row[property]) / 10000,
  },
  {
    key: "operator",
    label: "操作人",
    width: "60",
  },
  {
    key: "gmtCreated",
    label: "操作时间",
    width: "60",
    formatter: (row, { property }) => dateFormat(row.gmtCreated),
  },
];

export { COLUMNS };
