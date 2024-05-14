<template>
  <div>
    <el-select
      v-model="form.fromDate"
      style="width: 120px"
      @change="onRangeChange"
    >
      <el-option
        v-for="(item, index) in Array(31)"
        :key="index + 1"
        :label="index + 1"
        :value="index + 1"
      />
    </el-select>
    <el-time-picker
      class="width25"
      v-model="form.fromTime"
      value-format="HH:mm:ss"
      @input="onRangeChange"
    />
    <el-select
      v-model="form.toDate"
      style="width: 120px"
      @change="onRangeChange"
    >
      <el-option :value="-1" label="最后一天" />
      <el-option
        v-for="(item, index) in Array(31)"
        :key="index + 1"
        :label="index + 1"
        :value="index + 1"
      />
    </el-select>
    <el-time-picker
      class="width25"
      v-model="form.toTime"
      value-format="HH:mm:ss"
      @input="onRangeChange"
    />
  </div>
</template>

<script>
  function getTimeAndDate(dateAndTimeStr) {
    const dateAndTimeArr = dateAndTimeStr.split('/')
    return [parseInt(dateAndTimeArr[0]), dateAndTimeArr[1]]
  }

  function padZero(number) {
    if (number < 0) {
      return number
    }
    return number < 10 ? '0' + number : number
  }

  function checkTime (minTime, maxTime, fromDate, toDate) {
    if (fromDate === toDate) {
      const fromTime = '2000-01-01 ' + minTime
      const toTime = '2000-01-01 ' + maxTime
      return new Date(fromTime).getTime() <= new Date(toTime).getTime()
    }
    return true
  }

  export default {
    props: {
      value: {
        type: String,
        default: ''
      },
      disabled: {
        default: false
      }
    },
    computed: {
      form() {
        if (!this.value) {
          return {
            fromDate: 1,
            fromTime: '',
            toDate: 1,
            toTime: ''
          }
        } else {
          const dateAndTimeArr = this.value.split('~')
          const from = getTimeAndDate(dateAndTimeArr[0])
          const to = getTimeAndDate(dateAndTimeArr[1])
          return {
            fromDate: from[0],
            fromTime: from[1],
            toDate: to[0],
            toTime: to[1]
          }
        }
      }
    },
    methods: {
      checkValid () {
        if (!this.form.fromDate || !this.form.toDate || !this.form.fromTime || !this.form.toTime) {
          return {
            valid: false,
            msg: '请填写完整'
          }
        }
        if ((this.form.fromDate > this.form.toDate && this.form.toDate !== -1) || !checkTime(this.form.fromTime, this.form.toTime, this.form.fromDate, this.form.toDate)) {
          return {
            valid: false,
            msg: '开始时间应小于结束时间'
          }
        }
        return {
          valid: true,
          msg: ''
        }
      },
      generateCurrentRange() {
        const fromDate = this.form.fromDate ? padZero(this.form.fromDate) : '01'
        const fromTime = this.form.fromTime ? this.form.fromTime : '00:00:00'
        const toDate = this.form.toDate ? padZero(this.form.toDate) : '01'
        const toTime = this.form.toTime ? this.form.toTime : '00:00:00'
        return `${fromDate}/${fromTime}~${toDate}/${toTime}`
      },
      onRangeChange() {
        const currentRange = this.generateCurrentRange()
        this.$emit('input', currentRange)
      }
    }
  }
</script>