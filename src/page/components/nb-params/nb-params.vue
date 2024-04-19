<template>
  <div class="order-require__item">
    {{title}}
    <template v-if="apnDetail">
      <div v-if="currentCarrier === 'chinanet'" class="apn-values">
        <p>
          <span>APN名：{{ findItemByValue(apnDetail.customAPN, chinanetApnOptions) }}</span>
          <span>APN名：{{ findItemByValue(apnDetail.timerTAU, chinanetTauOptions) }}</span>
        </p>
      </div>
      <div v-else class="apn-values">
        <p>
          <span>APN类型：{{ findItemByValue(apnDetail.apnType, apnTypeOptions) }}</span>
          <span>APN名：{{ apnDetail.newApnName }}</span>
          <span v-if="apnDetail.lowPowerMode"
            >节能参数类型：{{ findItemByValue(apnDetail.lowPowerMode, lowPowerModeOptions) }}</span
          >
        </p>
        <p>
          <span>
            TAU定时器：
            <template v-if="!commonEnum[apnDetail.tauPrecisionType]">
              <span
                >精度：{{
                  findItemByValue(apnDetail.tauPrecisionType, tauPrecisionTypeOptions)
                }}</span
              >
              <span
                >数值：{{
                  findItemByValue(
                    apnDetail.tauPrecisionVal,
                    tauPrecisionValueOptions[apnDetail.tauPrecisionType]
                  )
                }}</span
              >
            </template>
            <template v-else>
              {{ commonEnum[apnDetail.tauPrecisionType].label }}
            </template>
          </span>
          <span>
            ACTIVE定时器：
            <template v-if="!commonEnum[apnDetail.psmPrecisionType]">
              <span
                >精度：{{
                  findItemByValue(apnDetail.psmPrecisionType, activePrecisionTypeOptions)
                }}</span
              >
              <span
                >数值：{{
                  findItemByValue(
                    apnDetail.psmPrecisionVal,
                    activePrecisionValueOptions[apnDetail.psmPrecisionType]
                  )
                }}</span
              >
            </template>
            <template v-else>
              {{ commonEnum[apnDetail.psmPrecisionType].label }}
            </template>
          </span>
          <span
            >eDRX周期：
            <template v-if="commonEnum[apnDetail.tedrx]">
              {{ commonEnum[apnDetail.tedrx].label }}
            </template>
            <template v-else>
              {{ findItemByValue(apnDetail.tedrx, tedrxOptions) }}
            </template>
          </span>
          <span
            >PTW时间：{{
              commonEnum[apnDetail.ptwTime]
                ? commonEnum[apnDetail.ptwTime].label
                : apnDetail.ptwTime
            }}</span
          >
        </p>
      </div>
    </template>
    <template v-else>默认</template>
  </div>
</template>

<script>
import {
  dedicatedApnOptions,
  universalApnOptions,
  lowPowerModeOptions,
  tedrxOptions,
  tauPrecisionTypeOptions,
  tauPrecisionValueOptions,
  activePrecisionTypeOptions,
  activePrecisionValueOptions,
  apnTypeOptions,
  commonEnum,
  commonApnSchemaMap,
  dedicatedApnSchemaMap,
  chinanetTauOptions,
  chinanetApnOptions
} from './options'

function safeJSONParse(data) {
  try {
    return JSON.parse(data) || {}
  } catch (e) {
    return {}
  }
}
export default {
  props: {
    title: {
      type: String,
      default: 'NB参数:'
    },
    data: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data() {
    return {
      commonEnum,
      commonApnSchemaMap,
      dedicatedApnSchemaMap,
      dedicatedApnOptions,
      universalApnOptions,
      lowPowerModeOptions,
      tedrxOptions,
      tauPrecisionTypeOptions,
      tauPrecisionValueOptions,
      activePrecisionTypeOptions,
      activePrecisionValueOptions,
      apnTypeOptions,
      chinanetTauOptions,
      chinanetApnOptions
    }
  },
  computed: {
    apnDetail() {
      return this.data.apnDetail ? safeJSONParse(this.data.apnDetail) : null
    },
    currentCarrier() {
      return this.data.carrier ? this.data.carrier.toLowerCase() : ''
    }
  },
  methods: {
    findItemByValue(value, options) {
      if (!options) return
      const item = options.find((item) => item.value === value) || {}
      return item.label || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.apn-values {
  p {
    & > span {
      display: inline-block;
      margin: 0 10px;
    }
  }
}
</style>
