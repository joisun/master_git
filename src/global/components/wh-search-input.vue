<script>
  export default {
    data() {
      return {}
    },
    model: {
      prop: 'inputValue',
      event: 'change'
    },
    props: {
      button: {
        type: Boolean,
        default: true
      },
      placeholder: {
        default: '请选择'
      },
      disabled: {
        default: false
      }
    },
    methods: {
      handleBlur(event) {
        this.$emit('blur', event)
      },
      handleFocus(event) {
        this.$emit('focus', event)
      },
      handleClick(event) {
        this.$emit('click', event)
      },
      handleChange(val) {
        this.$emit('change', val)
      }
    }
  }
</script>

<template>
  <el-input :placeholder="placeholder"
    v-model="inputValue"
    :disabled="disabled"
    type="text"
    @blur="handleBlur"
    @focus="handleFocus"
    @click="handleClick"
    @change="handleChange"
    @keyup.enter.native="handleClick">
    <template slot="prepend" v-if="$slots.prepend">
      <slot name="prepend">
      </slot>
    </template>
    <el-button slot="append" icon="el-icon-search" @click="handleClick" v-if="button">
    </el-button>
  </el-input>
</template>
