export default {
  data() {
    return {
      storageKey: '',
      selected: []
    }
  },
  methods: {
    handleSelectionChange(selected) {
      if (!this.storageKey) {
        throw new Error('请选设置storageKey')
      }
      this.selected = selected
      sessionStorage.setItem(
        this.storageKey,
        JSON.stringify({
          time: new Date().getTime(),
          data: selected
        })
      )
    },
    clearStorageSelection() {
      if (this.storageKey) {
        sessionStorage.removeItem(this.storageKey)
      }
    },
    setDefaultSelection() {
      // 预留方法, 设置默认选中项
    }
  }
}
