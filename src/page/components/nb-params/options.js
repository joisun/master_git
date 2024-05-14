const chinanetApnOptions = [
  {
    value: '8',
    label: 'ctnb'
  },
  {
    value: '200',
    label: 'ue.prefer.ctnb'
  },
  {
    value: '201',
    label: 'psmA.eDRX0.ctnb'
  },
  {
    value: '211',
    label: 'psmC.eDRX0.ctnb'
  },
  {
    value: '221',
    label: 'psmF.eDRXC.ctnb'
  },
  {
    value: '231',
    label: 'psm0.eDRXH.ctnb'
  },
  {
    value: '241',
    label: 'psm0.eDRXD.ctnb'
  },
  {
    value: '251',
    label: 'psm0.eDRXC.ctnb'
  },
  {
    value: '261',
    label: 'psm0.eDRX0.ctnb'
  },
  {
    value: '30020',
    label: 'sjgas.vpdn.sh'
  },
  {
    value: '30024',
    label: 'hiiotnb.vpdn.sd'
  },
  {
    value: '2649',
    label: 'gdmtx.vpdn.x'
  }
]
const chinanetTauOptions = [
  {
    value: '130',
    label: '2小时加10分'
  },
  {
    value: '190',
    label: '3小时加10分钟'
  },
  {
    value: '250',
    label: '4小时加10分钟'
  },
  {
    value: '730',
    label: '12小时加10分钟'
  },
  {
    value: '1450',
    label: '24小时加10分钟'
  },
  {
    value: '2890',
    label: '48小时加10分钟'
  },
  {
    value: '4330',
    label: '72小时加10分钟'
  },
  {
    value: '5770',
    label: '96小时加10分钟'
  },
  {
    value: '7210',
    label: '120小时加10分钟'
  },
  {
    value: '8650',
    label: '144小时加10分钟'
  },
  {
    value: '10090',
    label: '168小时加10分钟'
  },
  {
    value: '11530',
    label: '192小时加10分钟'
  },
  {
    value: '12970',
    label: '216小时加10分钟'
  },
  {
    value: '14410',
    label: '240小时加10分钟'
  },
  {
    value: '15850',
    label: '264小时加10分钟'
  },
  {
    value: '17290',
    label: '288小时加10分'
  }
]
const commonEnum = {
  terminalControl: {
    value: 'terminalControl',
    label: '终端控制'
  },
  NONE: {
    value: 'NONE',
    label: '不启用'
  }
}

const generateOptions = (from, step, times, unit) => {
  const options = []
  for (let i = 0; i < times; i++) {
    const currentValue = from + step * i
    options.push({
      value: `${currentValue}`,
      label: currentValue + unit
    })
  }
  return options
}

const dedicatedApnOptions = [
  ...'CMNBIOTONENET、CMNBIOTOTA'.split('、').map((e) => {
    return {
      label: e,
      value: e
    }
  })
]
const universalApnOptions = [
  ...'CMNBIOT、CMNBIOT1、CMNBIOT2、CMNBIOT3、CMNBIOT4、CMNBIOT5、CMNBIOT6'.split('、').map((e) => {
    return {
      label: e,
      value: e
    }
  })
]

const apnTypeOptions = [
  { value: 'universal', label: '通用APN' },
  { value: 'dedicated', label: '专用APN' }
]
const newApnNameToLowPowerModeMap = {
  CMNBIOT: '4',
  CMNBIOT1: '5',
  CMNBIOT2: '1',
  CMNBIOT3: '2',
  CMNBIOT4: '2',
  CMNBIOT5: '2',
  CMNBIOT6: '3'
}

const lowPowerModeOptions = [
  { value: '1', label: 'PSM' },
  { value: '2', label: 'eDRX' },
  { value: '3', label: 'PSM+eDRX(用户设置)' },
  { value: '4', label: 'PSM+eDRX(终端控制)' },
  { value: '5', label: 'NONE' }
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
  { value: '15', label: '10485.76s' }
]

const tauPrecisionTypeOptions = [
  { value: '6', label: '6min' },
  { value: '10', label: '10min' },
  { value: '1', label: '1h' },
  { value: '2', label: '10h' }
]

const tauPrecisionValueOptions = {
  6: generateOptions(54, 6, 23, 'min'),
  10: generateOptions(190, 10, 13, 'min'),
  1: generateOptions(6, 1, 26, 'h'),
  2: generateOptions(40, 10, 28, 'h')
}

const activePrecisionTypeOptions = [
  { value: '2', label: '2s' },
  { value: '1', label: '1min' },
  { value: '6', label: '6min' }
]

const activePrecisionValueOptions = {
  2: generateOptions(0, 2, 32, 's'),
  1: generateOptions(2, 1, 30, 'min'),
  6: generateOptions(0, 6, 32, 'min')
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
  psmPrecisionVal: ''
}
const commonApnSchemaMap = {
  CMNBIOT: {
    TAU: {
      value: commonEnum.terminalControl.value,
      required: false
    },
    ACTIVE: {
      value: commonEnum.terminalControl.value,
      required: false
    },
    EDRX: {
      value: commonEnum.terminalControl.value,
      required: false
    },
    PTW: {
      value: commonEnum.terminalControl.value,
      required: false
    }
  },
  CMNBIOT1: {
    TAU: {
      value: commonEnum.NONE.value,
      required: false
    },
    ACTIVE: {
      value: commonEnum.NONE.value,
      required: false
    },
    EDRX: {
      value: commonEnum.NONE.value,
      required: false
    },
    PTW: {
      value: commonEnum.NONE.value,
      required: false
    }
  },
  CMNBIOT2: {
    TAU: {
      value: ['', ''],
      options: [tauPrecisionTypeOptions, tauPrecisionValueOptions],
      required: true
    },
    ACTIVE: {
      value: ['2', '8'],
      options: [activePrecisionTypeOptions, activePrecisionValueOptions],
      required: true
    },
    EDRX: {
      value: commonEnum.NONE.value,
      required: false
    },
    PTW: {
      value: commonEnum.NONE.value,
      required: false
    }
  },
  CMNBIOT3: {
    TAU: {
      value: commonEnum.NONE.value,
      required: false
    },
    ACTIVE: {
      value: commonEnum.NONE.value,
      required: false
    },
    EDRX: {
      value: '2',
      options: tedrxOptions,
      required: true
    },
    PTW: {
      value: '10.24s',
      required: false
    }
  },
  CMNBIOT4: {
    TAU: {
      value: commonEnum.NONE.value,
      required: false
    },
    ACTIVE: {
      value: commonEnum.NONE.value,
      required: false
    },
    EDRX: {
      value: '5',
      options: tedrxOptions,
      required: true
    },
    PTW: {
      value: '10.24s',
      required: false
    }
  },
  CMNBIOT5: {
    TAU: {
      value: commonEnum.NONE.value,
      required: false
    },
    ACTIVE: {
      value: commonEnum.NONE.value,
      required: false
    },
    EDRX: {
      value: '9',
      options: tedrxOptions,
      required: true
    },
    PTW: {
      value: '10.24s',
      required: false
    }
  },
  CMNBIOT6: {
    TAU: {
      value: ['', ''],
      options: [tauPrecisionTypeOptions, tauPrecisionValueOptions],
      required: true
    },
    ACTIVE: {
      value: ['1', '2'],
      options: [activePrecisionTypeOptions, activePrecisionValueOptions],
      required: true
    },
    EDRX: {
      value: '2',
      options: tedrxOptions,
      required: true
    },
    PTW: {
      value: '10.24s',
      required: false
    }
  }
}
const dedicatedApnSchemaMap = {
  1: {
    TAU: {
      value: ['', ''],
      options: [tauPrecisionTypeOptions, tauPrecisionValueOptions],
      required: true
    },
    ACTIVE: {
      value: ['', ''],
      options: [activePrecisionTypeOptions, activePrecisionValueOptions],
      required: true
    },
    EDRX: {
      value: commonEnum.NONE.value,
      required: false
      // value: '5',
      // options: tedrxOptions
    },
    PTW: {
      value: commonEnum.NONE.value,
      required: false
    }
  },
  2: {
    TAU: {
      value: commonEnum.NONE.value,
      required: false
    },
    ACTIVE: {
      value: commonEnum.NONE.value,
      required: false
    },
    EDRX: {
      value: '',
      options: tedrxOptions,
      required: true
    },
    PTW: {
      value: '',
      required: false
    }
  },
  3: {
    TAU: {
      value: ['', ''],
      options: [tauPrecisionTypeOptions, tauPrecisionValueOptions],
      required: true
    },
    ACTIVE: {
      value: ['', ''],
      options: [activePrecisionTypeOptions, activePrecisionValueOptions],
      required: true
    },
    EDRX: {
      value: '',
      options: tedrxOptions,
      required: true
    },
    PTW: {
      value: '',
      required: false
    }
  },
  4: {
    TAU: {
      value: commonEnum.terminalControl.value,
      required: false
    },
    ACTIVE: {
      value: commonEnum.terminalControl.value,
      required: false
    },
    EDRX: {
      value: commonEnum.terminalControl.value,
      required: false
    },
    PTW: {
      value: commonEnum.terminalControl.value,
      required: false
    }
  },
  5: {
    TAU: {
      value: commonEnum.NONE.value,
      required: false
    },
    ACTIVE: {
      value: commonEnum.NONE.value,
      required: false
    },
    EDRX: {
      value: commonEnum.NONE.value,
      required: false
    },
    PTW: {
      value: commonEnum.NONE.value,
      required: false
    }
  }
}

export {
  commonEnum,
  apnTypeOptions,
  dedicatedApnOptions,
  universalApnOptions,
  newApnNameToLowPowerModeMap,
  lowPowerModeOptions,
  tedrxOptions,
  form,
  tauPrecisionTypeOptions,
  tauPrecisionValueOptions,
  activePrecisionTypeOptions,
  activePrecisionValueOptions,
  commonApnSchemaMap,
  dedicatedApnSchemaMap,
  chinanetApnOptions,
  chinanetTauOptions
}
