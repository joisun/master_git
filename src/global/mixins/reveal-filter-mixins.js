import store from '@/global/function/fold-filter-storage'

export default (name, obj) => {
  let storeValue = store(name, obj)
  return {
    data() {
      return {
        // 字段显示筛选器
        revealFields: {
          full: storeValue.getStoredFilterSet(true),
          stored: storeValue.getStoredFilterSet()
        }
      }
    },
    computed: {
      revealWord() {
        let val = {}
        this.revealFields.stored.forEach(e => (val[e] = 'true'))
        return val
      }
    },
    methods: {
      // 过滤显示更改
      handleRevealChange(filterList) {
        storeValue.setStorage(filterList)
      }
    }
  }
}
