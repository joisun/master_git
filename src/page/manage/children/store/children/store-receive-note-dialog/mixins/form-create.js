export const CMCC_FORM_DATA = {
  type: 'CUSTOM',
  validity: 12,
  cardPeriod: '',
  useCountAsVolume: false,
  freeForFirstMonth: false
}
export const UNICOM_FORM_DATA = {
  type: 'STANDARD',
  validity: 1,
  cardPeriod: 1,
  useCountAsVolume: false
}
export const CHINANET_FORM_DATA = {
  type: 'CUSTOM',
  validity: 12,
  cardPeriod: '',
  useCountAsVolume: true,
  freeForFirstMonth: true,
  totalDataCount: 20000
}
export const FORM_DATA = {
  activationDeadline: '',
  totalDataVolume: '',
  material: 'PLASTIC',
  specification: 'NANO',
  iccids: '',
  tags: ['NB_IOT'],
  categoryList: []
}
