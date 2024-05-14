import Enum from './enum'
import CarrierEnum from './carrier-enum'
import Vue from 'vue'

// 默认导出captain
export default Object.create({
  install(data) {
    // eslint-disable-next-line no-unused-vars

    for (let key in data) {
      if (key === 'carrier') {
        // 暂时特殊处理
        this[key] = new CarrierEnum(data[key])
      } else {
        this[key] = new Enum(data[key])
      }
      let callback = (function (item) {
        return (k, invert, caseSensitive) =>
          invert ? item.invert().get(k, caseSensitive) : item.get(k, caseSensitive)
      })(this[key])
      /**
       * callback接受参数为：
       * @param  key
       * @param  invert 是否反转key,value
       * @param  caseSensitive 是否大小写敏感，默认敏感
       * @return *
       */
      Vue.filter(`${key}Filter`, callback)
    }
    Vue.prototype.enums = this
  }
})
