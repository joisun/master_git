import carrierOriginMap from '../../collect/carrier-map'

const carrierTypeMap = (item) => {
  if (typeof item !== 'string' && typeof item !== 'number') {
    return ''
  } else {
    return carrierOriginMap.getMarry(item.toLocaleLowerCase())
  }
}

export default carrierTypeMap
