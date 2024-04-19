<!--
 * @Author: SerkeyWu
 * @Date: 2021-02-26 10:11:40
 * @Description: Do not edit
 * @LastEditors: SerkeyWu
 * @LastEditTime: 2021-02-26 10:17:31
-->
<template>
  <el-date-picker
    v-model="computedValue"
    format="yyyy-MM"
    type="month"
    placeholder="选择月份"
    value-format="yyyy-MM-dd"
    :clearable="false"
  />
</template>

<script>
  const getFirstDayOfMonth = () => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    let currentMonth = currentDate.getMonth() + 1
    currentMonth = currentMonth < 10 ? '0' + currentMonth : currentMonth
    return `${currentYear}-${currentMonth}-01`
  }

  export default {
    props: {
      value: {
        type: String
      }
    },
    created() {
      this.computedValue = getFirstDayOfMonth()
    },
    computed: {
      computedValue: {
        get() {
          return this.value
        },
        set(v) {
          this.$emit('input', v)
          this.$emit('change', v)
        }
      }
    }
  }
</script>