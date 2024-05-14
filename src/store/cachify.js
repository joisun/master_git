import { clone } from 'lodash'

const MAX_CACHE_LIMIT = 1000
let store = {}
let storeCount = 0

/**
 * 优化缓存
 */
function optimizeCache() {
  // todo
}

/**
 * 获取缓存
 */
function getCache(key) {
  return store[key]
}

/**
 * 设置缓存
 */
function setCache(key, value) {
  if (storeCount > MAX_CACHE_LIMIT) {
    optimizeCache()
  }
  storeCount += 1
  store[key] = value
}

/**
 * 对接口的结果进行缓存
 * @param  {Function} fn
 * @param  {Boolean}   options.force   是否强制刷新
 * @param  {*}   options.data    上一次缓存的结果
 * @param  {Number}   options.timeout 缓存时间
 * @param  {String}   options.key     缓存的key
 * @return {Promise}
 */
export default function cachify(fn, { force, data, timeout, key }) {
  if (!timeout) {
    timeout = 300000 // ms单位
  }
  return async function cachedFn(...args) {
    if (!key) {
      key = fn.toString() + ':' + JSON.stringify(args)
    }
    let match = getCache(key)
    let now = Date.now()
    if (force ||
      !match ||
      (now - match.lastUpdateAt > timeout)) {
      let rst = await fn(...args)
      if (rst.success) {
        setCache(key, {
          args, // args不需要存储了吧
          lastUpdateAt: now
        })
      }
      return rst
    }
    return {
      data: clone(data),
      success: true,
      status: 200,
      cached: true
    }
  }
}
