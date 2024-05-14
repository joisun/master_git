export const AUDIT_STATUS = {
  NOT_SUBMIT: 'not-submit',
  PASS: 'pass',
  NOT_AUDIT: 'not-audit',
  NOT_PASS: 'not-pass'
}

export const AUDIT_PICK_TYPE = {
  LEGAL: 'legal',
  BUSINESS: 'business'
}
export const ERROR_TYPE = {
  IDCARD_NOT_MATCH: '20001',
  LICENCE_NOT_MATCH: '20002',
  IDCARD_OCR_FAIL: '20003',
  LICENCE_OCR_FAIL: '20004',
  FOUR_ELEMENT_ENTERPRISE: '20005',
  NOT_LEGAL_IDCARD: '20006',
  TWO_ELEMENT_ENTERPRISE: '20007',
  REAL_NAME_AUTH: '20008',
  UNKNOW: '30000',
  NOT_ENT_STATUS: '20009'
}
export const ERROR_TYPE_FORMAT = {
  [ERROR_TYPE.IDCARD_NOT_MATCH]: '输入的身份证号码和图片不一致',
  [ERROR_TYPE.LICENCE_NOT_MATCH]: '输入的营业执照和图片不一致',
  [ERROR_TYPE.IDCARD_OCR_FAIL]: '身份证识别失败',
  [ERROR_TYPE.LICENCE_OCR_FAIL]: '营业执照识别失败',
  [ERROR_TYPE.FOUR_ELEMENT_ENTERPRISE]: '企业四要素验证失败',
  [ERROR_TYPE.NOT_LEGAL_IDCARD]: '企业四要素身份证或姓名不匹配',
  [ERROR_TYPE.TWO_ELEMENT_ENTERPRISE]: '企业二要素验证失败',
  [ERROR_TYPE.REAL_NAME_AUTH]: '实名认证失败',
  [ERROR_TYPE.UNKNOW]: '未知异常',
  [ERROR_TYPE.NOT_ENT_STATUS]: '企业非在营状态'
}
export default {
  data() {
    return {
      AUDIT_STATUS,
      AUDIT_PICK_TYPE,
      ERROR_TYPE,
      errorTypeFormat: ERROR_TYPE_FORMAT,
      auditStatusFormat: {
        [AUDIT_STATUS.NOT_PASS]: '未通过',
        [AUDIT_STATUS.PASS]: '通过',
        [AUDIT_STATUS.NOT_AUDIT]: '未审核',
        [AUDIT_STATUS.NOT_SUBMIT]: '未提交'
      }
    }
  },
  methods: {
    isAuthPicInValid(data) {
      const { machineFailReasonCode, manualStatus } = data
      const { IDCARD_NOT_MATCH, LICENCE_NOT_MATCH, IDCARD_OCR_FAIL, LICENCE_OCR_FAIL } = ERROR_TYPE
      if (manualStatus === AUDIT_STATUS.PASS) return false
      return (
        machineFailReasonCode &&
        [IDCARD_NOT_MATCH, LICENCE_NOT_MATCH, IDCARD_OCR_FAIL, LICENCE_OCR_FAIL].includes(
          `${machineFailReasonCode}`
        )
      )
    },
    isLegalPersonFlow(data) {
      const { pickType } = data
      return !pickType || pickType === AUDIT_PICK_TYPE.LEGAL
      // const { IDCARD_NOT_MATCH, LICENCE_NOT_MATCH, IDCARD_OCR_FAIL, LICENCE_OCR_FAIL } = ERROR_TYPE
      // return [IDCARD_NOT_MATCH, LICENCE_NOT_MATCH, IDCARD_OCR_FAIL, LICENCE_OCR_FAIL].includes(
      //   `${machineFailReasonCode}`
      // )
    },
    judgeFinalStatus(data) {
      const { id, machineStatus, manualStatus, pickType } = data || {}
      if (!machineStatus && !manualStatus) return AUDIT_STATUS.NOT_PASS
      if (manualStatus === AUDIT_STATUS.PASS) return manualStatus
      if (!id) return AUDIT_STATUS.NOT_SUBMIT
      if (pickType === AUDIT_PICK_TYPE.LEGAL || !pickType) {
        if (manualStatus !== AUDIT_STATUS.NOT_PASS) {
          return machineStatus
        }
        return manualStatus
      }
      if (pickType === AUDIT_PICK_TYPE.BUSINESS) {
        return manualStatus || AUDIT_STATUS.NOT_AUDIT
      }
      return manualStatus
    }
  }
}
