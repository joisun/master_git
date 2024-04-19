<template>
  <el-input v-model="computedValue" type="textarea" :rows="6" :disabled="disabled" style="width:220px"/>
</template>

<script>
  export default {
    props: {
      value: {
        type: String
      },
      disabled: {
        type: Boolean
      }
    },
    computed: {
      computedValue: {
        get() {
          return this.value.split(',').join('\n')
        },
        set(v) {
          this.$emit('input', v.split('\n').join(','))
        }
      }
    }
  }
</script>