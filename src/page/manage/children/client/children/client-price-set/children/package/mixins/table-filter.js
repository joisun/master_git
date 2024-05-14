import revelFilterMixins from '@/global/mixins/reveal-filter-mixins'

const SetCheck = 'userPricerSet'
let allSet = {
  condition1: '续费条件一',
  condition2: '续费条件二',
  condition3: '续费条件三',
  condition4: '续费条件四'
}

export default revelFilterMixins(SetCheck, allSet)
