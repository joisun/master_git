/*
 * @Author: SerkeyWu
 * @Date: 2021-02-19 09:44:30
 * @Description: Do not edit
 * @LastEditors: wushiji
 * @LastEditTime: 2021-03-11 14:34:20
 */
import enums from "@/constant/enums";
import getVolume from "@/global/function/getVolume"

const PRICE_PACKAGE_COLUMES = [
  { key: "id", name: "ID", width: "80" },
  {
    key: "carrier",
    name: "运营商",
    width: "80",
    formatter: (row, { property }) => enums.carrier.get(row[property]),
  },
  {
    key: "volume",
    name: "套餐规格",
    width: "100",
    formatter: (row) => getVolume(row.volume, row.volumeUnit),
  },
  {
    key: "validity",
    name: "套餐周期",
    width: "100",
    formatter: (row, { property }) => {
      const value = row[property]
      if (!value) {
        return '自然月'
      } else if(!(value % 12)) {
        return value / 12 + '年'
      } else {
        return value + '月'
      }
    }
  },
  {
    name: "销售底价",
    width: "40",
    formatter: (row) => row.minBottomPrice === row.maxBottomPrice ? row.minBottomPrice : `${row.minBottomPrice}-${row.maxBottomPrice}`,
  },
  {
    key: 'status',
    name: "状态",
    width: "30",
    formatter: (row, { property }) => row[property] === 0 ? '禁用' : '可用'
  },
];

export { PRICE_PACKAGE_COLUMES };
