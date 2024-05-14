import Enumerator from '@/constant/enums/cpe-enum'
const convert = function(el, binding) {
  let { value: { original, category, cb } } = binding
  let val = Enumerator.convert(category, original)
  if (cb && typeof cb === 'function') {
    val = cb(val)
  }
  el.innerHTML = val || '-'
}

export default convert
