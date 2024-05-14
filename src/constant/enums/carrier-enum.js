import Enum from './enum'
import _ from 'lodash'

let key2ordinal = {
  cmcc: 1,
  unicom: 0,
  chinanet: 2
}

let ordinal2key = _.invert(key2ordinal)

export default class CarrierEnum extends Enum {
  ordinal2key(ordinal) {
    return ordinal2key[ordinal]
  }

  key2ordinal(key) {
    return key2ordinal[key]
  }

  get(key, ...rest) {
    if (typeof key === 'number') {
      key = this.ordinal2key(key)
    }
    if (key) {
      key = key.toLocaleLowerCase() // 保持原来一样
    }
    return super.get(key, ...rest)
  }

  /**
     * @return [{中国移动：0, 中国联通：1, 中国电信：2}]
     */
  mapsByOrdinal() {
    let obj = {}
    this.keys().map(e => (obj[this.get(e)] = this.key2ordinal(e)))
    return obj
  }
}
