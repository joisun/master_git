<script>
export default {
  name: 'rate-plan-select-whitehouse',
  props: {
    value: {
      default: ''
    },
    carrier: {
      type: String,
      default: ''
    },
    carrierAccountId: {
      type: Number,
      default: undefined
    },
    dbType: {
      type: String,
      default: ''
    },
    showDisabled: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择套餐分类'
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      currentValue: '',
      options: []
    }
  },
  watch: {
    value(val) {
      this.currentValue = val
    },
    carrier() {
      this.currentValue = ''
      this.getOptions()
    },
    carrierAccountId() {
      this.currentValue = ''
      this.getOptions()
    },
    dbType() {
      this.currentValue = ''
      this.getOptions()
    },
    currentValue(val) {
      const item = val
        ? this.options.find((item) => item.carrierChargeCategoryId === val) || {}
        : {}
      this.$emit('input', val, item)
      this.$emit('change', val, item)
    }
  },
  async created() {
    await this.getOptions()
    this.currentValue = this.value
  },
  methods: {
    async getOptions() {
      const { carrier, carrierAccountId, dbType } = this
      if (carrier && carrierAccountId && dbType) {
        const res = await this.jaxLib.whitelist.listChargeCategoryId4Compliance({
          carrier,
          carrierAccountId,
          dbType
        })
        if (res && res.success) {
          this.options = res.data
        }
      }
    },
    onChange(val) {
      this.currentValue = val
    }
  }
}
</script>

<template>
  <el-select
    v-model="currentValue"
    :placeholder="placeholder"
    :size="size"
    v-bind="$attrs"
    clearable
    @change="onChange"
  >
    <el-option
      v-for="i in options"
      :key="i.carrierChargeCategoryId"
      :label="`${i.carrierChargeCategoryId}(${i.carrierPlanName})`"
      :value="i.carrierChargeCategoryId"
    />
  </el-select>
</template>
