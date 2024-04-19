import store from '@/store'
/**
 *
 * @param volume
 * @param whether 是否需要带单位，默认为true
 * @returns {*}
 */
const saleFormat = function(str) {
  let saleList = store.state.salesPerson.salesList
  let saleName = str
  saleList.map(e => {
    if (str === e.key || str === e.name) saleName = e.name
  })
  return saleName
}

export default saleFormat
