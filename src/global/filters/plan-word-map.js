import planTypeMap from '../../collect/plan-map'

const planMapFilter = (item) => {
  if (typeof item !== 'string') {
    return ''
  }
  return planTypeMap.getMarry(item.toLocaleLowerCase())
}

export default planMapFilter
