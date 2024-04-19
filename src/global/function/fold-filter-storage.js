let getStorage = function() {
  let key = this.setCheck
  return JSON.parse(localStorage.getItem(key))
}
// 存储数据
let setStorage = function(list) {
  let key = this.setCheck
  let saveLocal = {}
  let hash = this.allSet
  list.forEach(e => { saveLocal[e] = hash[e] })
  return localStorage.setItem(key, JSON.stringify(saveLocal))
}
// 检查是否有存入该数据项
let checkStorage = function() {
  let key = this.setCheck
  return !!localStorage.getItem(key)
}
// 获取已经stored的数据项，如果没有，则使用全部数据
let getStoredFilterSet = function(flag) {
  let stored
  if (this.checkStorage()) stored = this.getStorage()
  else stored = { ...this.allSet }
  if (flag) return { ...this.allSet }
  return Object.keys(stored)
}

let foldFilterStorage = {
  getStorage,
  setStorage,
  checkStorage,
  getStoredFilterSet
}

/**
 * 生成对应存储项
 * @param setCheck
 * @param allSet
 * @returns {foldFilterStorage}
 */
export default function factory(setCheck, allSet) {
  let setFilter = Object.create(foldFilterStorage)
  setFilter.setCheck = setCheck
  setFilter.allSet = allSet
  return setFilter
}
