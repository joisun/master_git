<script>
/**
 * Create by zeter on 2018/11/16
 * 本组件用于销售选择器的下拉
 * 需要store中暴露salesList参数和getSales方法用于获取销售列表
 */
import { mapState } from 'vuex'

export default {
  name: 'wh-sales-select',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择销售'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentValue: ''
    }
  },
  computed: {
    ...mapState({
      salesList: (state) => state.salesPerson.salesList
    })
  },

  watch: {
    value(val) {
      this.currentValue = val
    },
    currentValue(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  },
  created() {
    this.$store.dispatch('getSales')
  },
  methods: {
    changeSale(val) {
      this.currentValue = val
    }
  }
}
</script>

<template>
  <el-select
    v-model="currentValue"
    :placeholder="placeholder"
    style="width: 120px"
    :disabled="disabled"
    clearable
    @change="changeSale"
  >
    <el-option v-for="(i, index) in salesList" :key="index" :label="i.name" :value="i.key">
    </el-option>
  </el-select>
</template>
