/*
 * @Author: SerkeyWu
 * @Date: 2021-01-22 18:38:55
 * @Description: Do not edit
 * @LastEditors: SerkeyWu
 * @LastEditTime: 2021-02-07 16:04:48
 */
import cardOptions from '@/constant/options/cardFunction'

function mapKeyToString(row, map) {
  const arr = [];
  map.forEach((item) => {
    if (row[item.value]) {
      arr.push(item.label);
    }
  });
  return arr.join(',');
}

const TABLE_COLUMES = [
  { key: "id", name: "ID", width: "40" },
  { key: "name", name: "分类名称", width: "100" },
  {
    key: "generation",
    name: "网络制式",
    width: "80",
  },
  {
    key: 'cardFunction',
    name: "卡功能",
    width: "120",
    formatter: (row) => mapKeyToString(row, cardOptions.cardFunction),
  },
  {
    key: "specialRestriction",
    name: "特殊限制",
    width: "120",
    formatter: (row) => mapKeyToString(row, cardOptions.specialRestriction),
  },
  {
    key: "carrierSpecialRestriction",
    name: "运营商特殊限制",
    width: "120",
    formatter: (row) => mapKeyToString(row, cardOptions.carrierSpecialRestriction),
  },
];

export { TABLE_COLUMES };
