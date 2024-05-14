/**
 * 显示对象摘要信息
 * @param obj {*} 目标对象
 * @return {string} 对象摘要信息
 * @author gzj 20161026
 */
export function objSummary(obj) {
  const propsInfo = {}
  // eslint-disable-next-line no-unused-vars
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      propsInfo[i] = obj[i].toString()
    }
  }

  try {
    let value = null
    try {
      if (obj instanceof Error) {
        value = obj.toString()
      } else {
        value = JSON.parse(JSON.stringify(obj))
      }
    } catch (err) {
      value = obj.toString()
    }

    return JSON.stringify({
      value: value,
      props: propsInfo
    })
  } catch (err) {
    console.debug(err)
    console.warn(obj)
    return JSON.stringify(err.toString())
  }
}

/**
 * 分页器
 * @param dataList {Array} 带分页数据数组
 * @param pageSize {int} 每页大小
 * @return {Array} 分页数组，下标标识页码
 * @author gzj 20161202
 */
export function paginator(dataList, pageSize = 10) {
  const p = []
  let pIndex = 0
  let baseIndex = 0
  let i = 0

  if (!dataList.length) return []

  while (baseIndex + i < dataList.length) {
    p[pIndex] = []
    while (i < pageSize && baseIndex + i < dataList.length) {
      p[pIndex].push(dataList[baseIndex + i])
      ++i
    }
    i = 0
    ++pIndex
    baseIndex = pIndex * pageSize
  }

  if (!p[p.length - 1].length) {
    p.pop()
  }

  return p
}

/**
 * 缓存
 * @author gzj 20161029
 */
export class Cache {
  constructor() {
    this.counter = 0

    this._store = {}
    this._task = {}
  }

  /**
   * 清除指定的单个缓存
   * @param key {string}
   * @private
   * @author gzj 20160516
   */
  _cleanCache(key) {
    if (this._store.hasOwnProperty(key)) {
      clearTimeout(this._task[key])
      delete this._task[key]
      delete this._store[key]
      --this.counter
    }
  }

  /**
   * 清除指定的多个缓存
   * @param keys {Array | undefined} 缓存名数组,如果不指定,则清除所有缓存
   * @private
   */
  _cleanCaches(keys) {
    keys = keys || Object.keys(this._store)
    // eslint-disable-next-line no-unused-vars
    for (let key of keys) {
      this._cleanCache(key)
    }
  }

  /**
   * 清除指定缓存,如果不指定,则清除全部
   * @param mix {string | Array | undefined}
   * @author author gzj 20160516
   */
  clean(mix) {
    if (typeof mix === 'string') {
      this._cleanCache(mix)
    } else {
      this._cleanCaches(mix)
    }
  }

  /**
   * 获取指定缓存内容
   * @param key {string}
   * @param afterGet {function(val)} 获得缓存内容后的回调, 入参为缓存内容
   * @param defaultValueGetter {function(key, afterGet)} 取值器, 接受可以作为参数. 当缓存不存在时, 如果设置了取值器, 则返回取值器返回值
   * @return {*} 如果key对应的值不存在,则返回undefined
   * @author gzj 20160516
   */
  get(key, afterGet, defaultValueGetter) {
    let ret = this._store[key]
    if (ret === undefined && defaultValueGetter) {
      defaultValueGetter(key, afterGet)
    } else {
      afterGet(ret)
    }
  }

  /**
   * 设置缓存内容
   * @param key {string}
   * @param val {*}
   * @param afterSet {function(Error, val)} 设置缓存完成回调, 入参为异常对象
   * @param expire {int} 有效期, 单位毫秒, 默认永远有效
   * @param forceUpdate {boolean} 是否强制更新. 为已经存在的缓存设置值时,如果不指定此项为true,则会设置失败
   * @return {boolean} 是否设置成功
   */
  set(key, val, afterSet = null, expire = 0, forceUpdate = true) {
    if (typeof key !== 'string' || val === undefined) {
      throw new TypeError('key must be string and val must not be undefined')
    }
    if (forceUpdate) {
      this.clean(key)
    }

    if (this._store[key] !== undefined) {
      afterSet(new Error('value is cached.'), null)
    } else {
      this._store[key] = val
      this._task[key] = setTimeout(() => {
        this.clean(key)
      }, expire)
      afterSet(undefined, val)
    }
  }
}

/**
 * 将兑换转换成{name: key, id: value}的形式
 * @param obj 需要转换的对象
 * @param n key的字面量名
 * @param v value的字面量名
 */
export function buildMap (obj, n = 'key', v = 'value') {
  return Object.entries(obj).map(e => {
    return {[n]: e[0], [v]: e[1] }
  })
}

/**
 * 将源对象的属性映射到新的对象
 * @param mapNameMap {object} 属性映射表，格式
 *      {
 *          <string: 目标属性名>: <string: 源属性名>,
 *          <string: 目标属性名>: {
 *              name: <string: 源属性名>,
 *              helper: <function(attr): 属性处理器，接受源属性值，返回目标属性值>
 *          }
 *      }
 * @param src {object} 源对象
 * @param dest {object|null} 目标对象，不指定则生成新对象
 * @returns {object} 目标对象
 */
export function mapTo(mapNameMap, src, dest = null) {
  const destObj = dest || {}
  // eslint-disable-next-line no-unused-vars
  for (let k in mapNameMap) {
    if (mapNameMap.hasOwnProperty(k)) {
      let attrGetter = mapNameMap[k]
      destObj[k] = attrGetter.helper ? attrGetter.helper(src[attrGetter.name], dest) : src[attrGetter]
    }
  }
  return destObj
}

/**
 * 构建路径关系映射对象
 * @param paths {array} 路径列表
 * @param options {object} 配置信息，可用项如下
 *      {
 *          prefix: <string: 路径前缀,应用到所有路径，默认 ''>,
 *          split: <string: 路径的分隔符，默认 '/'>,
 *          case: <string: 映射对象属性名的大小写，lower|upper|raw，默认'raw'>
 *      }
 * @return {{}}
 * @author gzj 20170215
 */
export function buildPathORM(paths, options = {}) {
  options = Object.assign({ prefix: '', split: '/', case: 'lower' }, options)

  const orm = {}
  // eslint-disable-next-line no-unused-vars
  for (let path of paths) {
    let t = orm
    let dirs = path.split(options.split)
    dirs[0].length || dirs.splice(0, 1)
    for (let i = 0; i < dirs.length; ++i) {
      let dir = dirs[i]
      switch (options.case) {
        case 'lower':
          dir = dir.toLowerCase()
          break
        case 'upper':
          dir = dir.toUpperCase()
          break
      }

      if (i < dirs.length - 1) {
        if (!t.hasOwnProperty(dir)) t[dir] = {}
        t = t[dir]
      } else if (t.hasOwnProperty(dir)) throw new Error(`Path[${path}] is not unique`)
      else t[dir] = options.prefix + path
    }
  }
  return orm
}
