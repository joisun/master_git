import Industry from '@/constant/enums/industry-enum'
const convert = function (el, binding) {
  let { value } = binding
  let val = Industry.convert(value)
  el.innerHTML = val || '-'
}

export default convert
