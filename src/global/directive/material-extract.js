import specificationList from '../../collect/specification-map'

const materialList = {
  'PLASTIC': '塑料插拔卡',
  'CERAMICS': '陶瓷插拔卡',
  'PASTER': '陶瓷贴片卡',
  'PLASTIC_PASTER': '塑料贴片卡',
  'EPOXY': '环氧树脂',
  'VEHICLE': '车规级'
}
const extract = function(el, binding) {
  let value = binding.value
  let specification = value.specification
  let material = value.material
  let str = `${materialList[material]}-${specificationList.getValue()[specification]}`
  if (el) {
    el.innerHTML = str
  } else {
    return str
  }
}

export default extract
