import { iccidsTransfer } from '@/global/function/iccids-tool'

const generateOptions = (from, step, times, unit) => {
  const options = []
  for (let i = 0; i < times; i++) {
    const currentValue = from + step * i
    options.push({
      value: currentValue,
      label: currentValue + unit
    })
  }
  return options
}

const maxIccidLength = 5000

const apnOptions = [
  ...'CMNBIOT、CMNBIOT1、CMNBIOT2、CMNBIOT3、CMNBIOT4、CMNBIOT5、CMNBIOT6'
    .split('、')
    .map((e) => {
      return {
        label: e,
        value: e,
      }
    }),
]

const newApnNameToLowPowerModeMap = {
  CMNBIOT: '4',
  CMNBIOT1: '5',
  CMNBIOT2: '1',
  CMNBIOT3: '2',
  CMNBIOT4: '2',
  CMNBIOT5: '2',
  CMNBIOT6: '3',
}

const lowPowerModeOptions = [
  { value: '1', label: 'PSM' },
  { value: '2', label: 'eDRX' },
  { value: '3', label: 'PSM+eDRX(用户设置)' },
  { value: '4', label: 'PSM+eDRX(终端控制)' },
  { value: '5', label: 'NONE' },
]

const tedrxOptions = [
  { value: '2', label: '20.48s' },
  { value: '3', label: '40.96s' },
  { value: '5', label: '81.92s' },
  { value: '9', label: '163.84s' },
  { value: '10', label: '327.68s' },
  { value: '11', label: '655.36s' },
  { value: '12', label: '1310.72s' },
  { value: '13', label: '2621.44s' },
  { value: '14', label: '5242.88s' },
  { value: '15', label: '10485.76s' },
]

const tauPrecisionTypeOptions = [
  { value: '6', label: '54min' },
  { value: '10', label: '190min' },
  { value: '1', label: '6h' },
  { value: '2', label: '40h' },
]

const tauPrecisionValueOptions = {
  '6': generateOptions(54, 6, 23, 'min'),
  '10': generateOptions(190, 10, 13, 'min'),
  '1': generateOptions(6, 1, 26, 'h'),
  '2': generateOptions(40, 10, 28, 'h'),
}

const psmPrecisionTypeOptions = [
  { value: '2', label: '0s' },
  { value: '1', label: '2min' },
  { value: '6', label: '0min' }
]

const psmPrecisionValueOptions = {
  '2': generateOptions(0, 2, 32, 's'),
  '1': generateOptions(2, 1, 30, 'min'),
  '6': generateOptions(0, 6, 32, 'min')
}

const form = {
  iccids: '',
  newApnName: '',
  oldApnName: '',
  lowPowerMode: '',
  tedrx: '',
  tauPrecisionType: '',
  tauPrecisionVal: '',
  psmPrecisionType: '',
  psmPrecisionVal: '',
}

const checkIccidLength = (field, value, callback) => {
  const iccidArray = iccidsTransfer(value)
  if (iccidArray && iccidArray.length > maxIccidLength) {
    callback(new Error(`数量最多不超过${maxIccidLength}张`))
  }
  callback()
}

export {
  apnOptions,
  newApnNameToLowPowerModeMap,
  lowPowerModeOptions,
  tedrxOptions,
  form,
  checkIccidLength,
  maxIccidLength,
  tauPrecisionTypeOptions,
  tauPrecisionValueOptions,
  psmPrecisionTypeOptions,
  psmPrecisionValueOptions
}
