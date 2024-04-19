export default {
  data() {
    return {
      storageKey: ''
    }
  },
  methods: {
    clearStorageSelection() {
      if (this.storageKey) {
        sessionStorage.removeItem(this.storageKey)
      }
    },
    getSelected(filerKey = '') {
      if (!this.storageKey) {
        throw new Error('请选设置storageKey')
      }
      let storageData = sessionStorage.getItem(this.storageKey)
      if (!storageData) {
        return []
      }
      storageData = JSON.parse(storageData)
      if (!storageData.time || !storageData.data) {
        return []
      }
      if (((new Date()).getTime() - storageData.time) > (15 * 60000)) { // 有效期15分钟
        this.clearStorageSelection()
        return []
      }
      return !filerKey ? storageData.data : storageData.data.map(item => item[filerKey])
    }
  }
}
