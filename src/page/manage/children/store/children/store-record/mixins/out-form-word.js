import moment from 'moment'

class SearchField {
  constructor() {
    this.carrier = ''
    this.totalDataVolume = ''
    this.testValidity = ''
    this.cardSpecification = ''
    this.cardMaterial = ''
    this.useCountAsVolume = ''
    this.time = null
  }
  toSearch() {
    let hash = { ...this }
    let times = hash.time
    hash.beginDate = times ? moment(times[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : ''
    hash.endDate = times ? moment(times[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : ''
    delete hash.time
    return hash
  }
  reset() {
    Object.keys(this).forEach(key => {
      if (key !== 'time') this[key] = ''
    })
    this.time = []
    return this
  }
}

export default SearchField
