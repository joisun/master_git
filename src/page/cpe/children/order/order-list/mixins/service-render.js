import CpeEnums from '@/constant/enums/cpe-enum'

export const serviceRender = (orderItem) => {
    const { serviceName, serviceUnit } = orderItem
    const [unit, unitValue] = serviceUnit.split(':')
    const unitName = CpeEnums.convert('chargePeriod', unit)
    return `${serviceName}(每台/${unitValue}${unitName})`
}
