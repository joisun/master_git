/**
 * 列折叠 mixin
 */
/* eslint-disable no-return-assign */
import Storage from '@/global/function/limited-storage'
class SimpleStorage {
  constructor(columns) {
    this._storage = new Storage({
      strategy: 'custom',
      customCallback: stored => {
        let storedKeys = stored.map(item => item.key).sort()
        let currentKeys = columns.map(item => item.key).sort()
        return storedKeys.every((sk, index) => {
          let ckIndex = currentKeys.indexOf(sk)
          return ckIndex === index
        })
      }
    })
  }
  getStored(prefix) {
    return this._storage.getItem(prefix)
  }
  setStore(foldHash, filterFields) {
    let { prefix } = foldHash
    this._storage.setItem(prefix, filterFields)
    return true
  }
  getAllSet(foldHash, columns) {
    let { precast, def, prefix } = foldHash
    let stored = this.getStored(prefix)
    if (stored) {
      return stored
    } else {
      return columns.map(({ name, key }) => {
        return {
          name, key, checked: def.includes(key), disabled: precast.includes(key)
        }
      })
    }
  }
  package(foldHash, columns) {
    let { precast, def } = foldHash
    columns.forEach(col => col.checked = precast.includes(col.key) || def.includes(def.key))
    return this
  }
  normalize(filterFields, columns) {
    filterFields.forEach(field => {
      let column = columns.find(col => col.key === field.key)
      column.checked = field.checked
    })
    return columns
  }
}
export default {
  data() {
    return {
      filterFields: [],
      _foldHash: {
        prefix: '',
        precast: [], // 预制的
        def: [] // 默认的
      }
    }
  },
  methods: {
    initFoldable({ precast, def, prefix }) {
      let { columns } = this
      let _foldHash = this._foldHash = { precast, def, prefix }
      this.$storage = new SimpleStorage(columns)
      this.$storage.package(_foldHash, columns)
      this.filterFields = this.$storage.getAllSet(_foldHash, columns)
      this.columns = [...this.$storage.normalize(this.filterFields, columns)]
    },
    // 处理下拉菜单 过滤表格列
    handleDropDown(val) {
      if (val === false) {
        let { filterFields, columns, _foldHash } = this
        this.columns = [...this.$storage.normalize(filterFields, columns)]
        this.$storage.setStore(_foldHash, filterFields)
      }
    }
  }
}
