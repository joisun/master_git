// TODO 测试环境使用

import { safeGet } from '@/global/function/safe-operations'

export const REQ_FOR_FRAME_CONTRACT_OPT = {
  E_STAMP: 'option-1685432933509',
  P_STAMP: 'option-1685432933510',
  EP_STAMP: 'option-1685432933509'
}
export const REQ_FOR_FRAME_CONTRACT_MAP = {
  [REQ_FOR_FRAME_CONTRACT_OPT.E_STAMP]: '电子扫描件',
  [REQ_FOR_FRAME_CONTRACT_OPT.P_STAMP]: '纸质盖章件',
  [REQ_FOR_FRAME_CONTRACT_OPT.EP_STAMP]: '电子扫描件+纸质盖章件'
}
export const REQ_FOR_ATTACH_CONTRACT_OPT = {
  E_STAMP: 'option-1608085709290',
  P_STAMP: 'option-1608085742135',
  EP_STAMP: 'option-1685425694621'
}
export const REQ_FOR_ATTACH_CONTRACT_MAP = {
  [REQ_FOR_ATTACH_CONTRACT_OPT.E_STAMP]: '电子扫描件',
  [REQ_FOR_ATTACH_CONTRACT_OPT.P_STAMP]: '纸质盖章件',
  [REQ_FOR_ATTACH_CONTRACT_OPT.EP_STAMP]: '电子扫描件+纸质盖章件'
}
export const COMPANY_OPTIONS = {
  FRAME_COMPANY_QINAI: 'option-4064893013',
  FRAME_COMPANY_SIMBOSS: 'option-1592385942639',
  ATTACH_COMPANY_QINAI: 'option-1685432327932',
  ATTACH_COMPANY_SIMBOSS: 'option-1685432327933',

  FRAME_OUR: 'option-2435492841',
  FRAME_OTHER: 'option-2435492842',
  ATTACH_OUR: 'option-1608085791197',
  ATTACH_OTHER: 'option-1608085791198'
}

export const BUSSNESS_SCOPE_TYPE_1 = {
  domestic: 'option-1706522130810',
  intl: 'option-1706522130811'
}
export const BUSSNESS_SCOPE_TYPE_2 = {
  domestic: 'option-1706522587928',
  intl: 'option-1706522587929'
}
// 针对流程1
export const businessScopeMap1 = {
  [BUSSNESS_SCOPE_TYPE_1.domestic]: '国内卡',
  [BUSSNESS_SCOPE_TYPE_1.intl]: '国际卡'
}
// 针对流程234
export const businessScopeMap2 = {
  [BUSSNESS_SCOPE_TYPE_2.domestic]: '国内卡',
  [BUSSNESS_SCOPE_TYPE_2.intl]: '国际卡'
}
const BAC = {
  [COMPANY_OPTIONS.FRAME_COMPANY_QINAI]: {
    name: '上海启奈信息科技有限公司',
    bank: '招商银行股份有限公司上海闵行支行',
    account: '121912912910301',
    alipay: 'money@simboss.com'
  },
  [COMPANY_OPTIONS.FRAME_COMPANY_SIMBOSS]: {
    name: '杭州芯博士网络科技有限公司',
    bank: '浦发银行杭州分行',
    account: '95200078801500001609',
    alipay: 'pay8@simboss.com'
  },
  [COMPANY_OPTIONS.ATTACH_COMPANY_QINAI]: {
    name: '上海启奈信息科技有限公司',
    bank: '招商银行股份有限公司上海闵行支行',
    account: '121912912910301',
    alipay: 'money@simboss.com'
  },
  [COMPANY_OPTIONS.ATTACH_COMPANY_SIMBOSS]: {
    name: '杭州芯博士网络科技有限公司',
    bank: '浦发银行杭州分行',
    account: '95200078801500001609',
    alipay: 'pay8@simboss.com'
  },
  上海启奈信息科技有限公司: {
    name: '上海启奈信息科技有限公司',
    bank: '招商银行股份有限公司上海闵行支行',
    account: '121912912910301',
    alipay: 'money@simboss.com'
  },
  杭州芯博士网络科技有限公司: {
    name: '杭州芯博士网络科技有限公司',
    bank: '浦发银行杭州分行',
    account: '95200078801500001609',
    alipay: 'pay8@simboss.com'
  }
}
export default {
  data() {
    return {
      countryCodeList: [],
      BUSSNESS_SCOPE_TYPE_1,
      BUSSNESS_SCOPE_TYPE_2,
      businessScopeMap1,
      businessScopeMap2,
      bankAccounts: {
        ...BAC
      },
      bankAccountsIntl: {
        ...BAC,
        [COMPANY_OPTIONS.FRAME_COMPANY_SIMBOSS]: {
          name: '杭州芯博士网络科技有限公司',
          bank: '招商银行股份有限公司杭州城西支行',
          account: '571918494510601',
          liaison: '308331012167'
        },
        [COMPANY_OPTIONS.ATTACH_COMPANY_SIMBOSS]: {
          name: '杭州芯博士网络科技有限公司',
          bank: '招商银行股份有限公司杭州城西支行',
          account: '571918494510601',
          liaison: '308331012167'
        },
        杭州芯博士网络科技有限公司: {
          name: '杭州芯博士网络科技有限公司',
          bank: '招商银行股份有限公司杭州城西支行',
          account: '571918494510601',
          liaison: '308331012167'
        }
      },
      secondPartyOptions1: [
        {
          value: COMPANY_OPTIONS.FRAME_COMPANY_QINAI,
          label: '上海启奈信息科技有限公司'
        },
        {
          value: COMPANY_OPTIONS.FRAME_COMPANY_SIMBOSS,
          label: '杭州芯博士网络科技有限公司'
        }
      ],
      secondPartyOptions2: [
        {
          value: COMPANY_OPTIONS.ATTACH_COMPANY_QINAI,
          label: '上海启奈信息科技有限公司'
        },
        {
          value: COMPANY_OPTIONS.ATTACH_COMPANY_SIMBOSS,
          label: '杭州芯博士网络科技有限公司'
        }
      ],
      sendFirstOptions1: [
        {
          value: COMPANY_OPTIONS.FRAME_OUR,
          label: '我方'
        },
        {
          value: COMPANY_OPTIONS.FRAME_OTHER,
          label: '对方'
        }
      ],
      sendFirstOptions2: [
        {
          value: COMPANY_OPTIONS.ATTACH_OUR,
          label: '我方'
        },
        {
          value: COMPANY_OPTIONS.ATTACH_OTHER,
          label: '对方'
        }
      ],
      optionMapper: {
        [COMPANY_OPTIONS.FRAME_COMPANY_QINAI]: COMPANY_OPTIONS.ATTACH_COMPANY_QINAI,
        [COMPANY_OPTIONS.FRAME_COMPANY_SIMBOSS]: COMPANY_OPTIONS.ATTACH_COMPANY_SIMBOSS,
        [COMPANY_OPTIONS.FRAME_OUR]: COMPANY_OPTIONS.ATTACH_OUR,
        [COMPANY_OPTIONS.FRAME_OTHER]: COMPANY_OPTIONS.ATTACH_OTHER
      },
      REQ_FOR_FRAME_CONTRACT_MAP,
      REQ_FOR_FRAME_CONTRACT_LIST: Object.keys(REQ_FOR_FRAME_CONTRACT_MAP).map((item) => ({
        label: REQ_FOR_FRAME_CONTRACT_MAP[item],
        value: item
      })),
      REQ_FOR_ATTACH_CONTRACT_LIST: Object.keys(REQ_FOR_ATTACH_CONTRACT_MAP).map((item) => ({
        label: REQ_FOR_ATTACH_CONTRACT_MAP[item],
        value: item
      }))
    }
  },
  methods: {
    async getCountryCode() {
      const res = await this.jaxLib.customer.oaContract.getCountryCode({})
      if (safeGet(res, 'success', false)) {
        this.countryCodeList = res.data
      }
    }
  }
}
