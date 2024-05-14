<!--
 * @Author: wushiji
 * @Date: 2021-03-01 11:58:48
 * @Description: 
 * @LastEditors: wushiji
 * @LastEditTime: 2021-03-10 15:22:24
-->
<template>
  <el-input
    v-model="computedValue"
    type="textarea"
    :rows="3"
    placeholder="可以直接复制excel中整列ICCID；手动输入多个ICCID，一行一个；最多10000个；"
  />
</template>

<script>
  export default {
    props: {
      value: {
        type: Array
      }
    },
    computed: {
      computedValue: {
        get() {
          return this.value.join('\n')
        },
        set(v) {
          if (!v) {
            this.$emit('input', [])
          } else {
            const arr = v.split('\n')
            this.$emit('input', arr)
          }
        }
      }
    }
  }
</script>