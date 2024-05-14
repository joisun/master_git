export const calcMonth = (renewOriginList, buyCardOriginList) => {
  let monthOne = renewOriginList.reduce((total, item) => {
    total[item.month] = item.money
    return total
  }, {})
  let monthTwo = buyCardOriginList.reduce((total, item) => {
    total[item.month] = item.money
    return total
  }, {})
  let monthList = Array.from(new Set([...renewOriginList.map(e => e.month), ...buyCardOriginList.map(e => e.month)]))
  let renewList = monthList.map(e => monthOne[e] ? monthOne[e] : 0)
  let buyCardList = monthList.map(e => monthTwo[e] ? monthTwo[e] : 0)
  return {
    month: monthList,
    renew: renewList,
    buyCard: buyCardList
  }
}

export const separateWord = (list) => {
  return {
    month: list.map(e => e.month),
    priceOfferName: list.map(e => e.priceOfferName),
    money: list.map(e => e.money)
  }
}
