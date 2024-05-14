/**
 * 包装localStorage
 * 提供 缓存更新机制
 * 1. maxDuration 最大存活时间
 * 2. customCallback 自定义比较函数
 */
class Storage {
  constructor (options = {}) {
    let defaultOpts = {
      strategy: 'regularly', // custom 自定模式 regularly 定期清理模式
      maxDuration: 30 * 24 * 60 * 60 * 1000, // 最长存活时间 只在 regularly模式有效
      customCallback: null // 定义函数 只在custom模式有效
    }
    this._id = `storage__${+new Date()}`
    this.options = { ...defaultOpts, ...options }
  }
  getItem (key) {
    let { strategy, maxDuration } = this.options
    let item = localStorage.getItem(key)
    if (item) {
      item = JSON.parse(item)
    } else {
      // 之前没有存储过
      return false
    }
    let metadata = item.metadata || {}
    let sStrategy = metadata.strategy
    let sMaxDuration = metadata.maxDuration
    let timestamp = metadata.timestamp
    
    // 存储的meta 和 新的配置不一致，强制使存储失效
    if (sStrategy !== strategy || sMaxDuration !== maxDuration) {
      this.removeItem(key)
      return false
    }
    if (strategy === 'regularly') {
      // 定期清理
      let current = +new Date()
      if (timestamp + maxDuration > current) {
        // 已经过时 需要被清理
        this.removeItem(key)
        return false
      } else {
        // 还没有过时 可以使用
        return item.original
      }
    } else if (strategy === 'custom') {
      let { customCallback } = this.options
      // 自定义判断方法不通过
      if (!customCallback(item.original)) {
        this.removeItem(key)
        return false
      } else {
        return item.original
      }
    }
  }
  setItem (key, item) {
    let { strategy, maxDuration } = this.options
    let wrapper = {
      metadata: { strategy, maxDuration },
      timestamp: +new Date(),
      original: item
    }
    return localStorage.setItem(key, JSON.stringify(wrapper))
  }
  removeItem (key) {
    return localStorage.removeItem(key)
  }
}
export default Storage
