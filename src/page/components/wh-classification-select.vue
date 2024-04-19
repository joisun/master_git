<script>
/**
 * Create by zeter on 2018/11/20
 * 本组件用于套餐分类的下拉
 */
export default {
  name: 'wh-classification-select',
  props: {
    value: {
      default: undefined
    },
    carrier: {
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
      currentValue: undefined
    }
  },
  computed: {
    classificationList() {
      return this.$store.getters.getClassificationList(this.carrier, this.showDisabled)
    }
  },
  watch: {
    value(val) {
      this.currentValue = val || undefined
    },
    carrier() {
      this.currentValue = ''
    },
    currentValue(val) {
      const item = val ? this.classificationList.find((item) => item.id === val) : {}
      this.$emit('input', val, item)
      this.$emit('change', val, item)
    }
  },
  async created() {
    await this.$store.dispatch('changeClassificationList')
    this.currentValue = this.value || undefined
  },
  methods: {
    changeClassification(val) {
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
    @change="changeClassification"
  >
    <el-option
      v-for="i in classificationList"
      :key="i.carrier + i.id"
      :label="i.name"
      :value="i.id"
    >
    </el-option>
  </el-select>
</template>
