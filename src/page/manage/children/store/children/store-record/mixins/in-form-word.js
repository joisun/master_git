import moment from 'moment'

class SearchField {
  constructor() {
    this.carrier = ''
    this.carrierAccountId = ''
    this.ratePlanType = ''
    this.hasTesting = ''
    this.material = ''
    this.specification = ''
    this.time = null
    this.cardIssuer = ''
    this.id = ''
  }
  toSearch() {
    let hash = { ...this }
    let times = hash.time
    hash.timeStart = times ? moment(times[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : ''
    hash.timeEnd = times ? moment(times[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : ''
    delete hash.time
    return hash
  }
  reset() {
    Object.keys(this).forEach((key) => {
      if (key !== 'time') this[key] = ''
    })
    this.time = []
    return this
  }
}

export default SearchField
