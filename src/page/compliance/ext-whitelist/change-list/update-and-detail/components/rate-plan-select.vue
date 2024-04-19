<script>
export default {
  name: 'rate-plan-select',
  props: {
    value: {
      default: ''
    },
    orgId: {
      type: Number,
      default: 0
    },
    targetCategoryId: {
      type: Number,
      default: undefined
    },
    origPriceOfferId: {
      type: Number,
      default: undefined
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
    orgId() {
      this.currentValue = ''
      this.getOptions()
    },
    targetCategoryId() {
      this.currentValue = ''
      this.getOptions()
    },
    origPriceOfferId() {
      this.currentValue = ''
      this.getOptions()
    },
    currentValue(val) {
      const item = val ? this.options.find((item) => item.id === val) || {} : {}
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
      const { orgId, origPriceOfferId, targetCategoryId } = this
      if (orgId && origPriceOfferId && targetCategoryId) {
        const res = await this.jaxLib.whitelist.listAvailableChangeCustomerRatePlan({
          orgId,
          origPriceOfferId,
          targetCategoryId
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
    <el-option v-for="i in options" :key="i.id" :label="`${i.id}(${i.name})`" :value="i.id" />
  </el-select>
</template>
