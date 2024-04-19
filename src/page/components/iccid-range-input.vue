<template>
  <el-form-item prop="iccid" :label="label">
    <div v-for="(item, index) in iccidBatchs" :key="index" class="iccid-range-input-wrap">
      <div>
        <el-form-item
          label-width="80px"
          label="首ICCID"
          :prop="'iccidBatchs.' + index + '.iccidStart'"
          :rules="getEndRule(item, index, 'start')"
        >
          <el-input
            v-model="item.iccidStart"
            style="width: 200px"
            @change="startChange(item, index)"
          />
        </el-form-item>
        <el-form-item
          label="尾ICCID"
          label-width="80px"
          :prop="'iccidBatchs.' + index + '.iccidEnd'"
          :rules="getEndRule(item, index, 'end')"
        >
          <el-input
            v-model="item.iccidEnd"
            style="width: 200px"
            :disabled="!item.iccidStart"
            @change="endChange(item, index)"
          />
        </el-form-item>
      </div>
      <div class="action-wrap">
        <el-form-item style="display: inline-block; margin-bottom: 0">
          <el-input-number
            v-model="item.count"
            :min="0"
            :disabled="!item.iccidStart"
            @change="countChange(item, index)"
          />
        </el-form-item>
        <div style="display: inline-block; width: 80px">
          <el-button circle icon="el-icon-plus" @click="handleAdd" />
          <el-button
            v-show="index === 0 ? iccidBatchs.length > 1 : true"
            icon="el-icon-minus"
            circle
            @click="handleDelete(index)"
          />
        </div>
      </div>
    </div>
  </el-form-item>
</template>

<script>
const padZero = (s, tLen) => {
  const padLen = tLen - `${s}`.length
  return `${'0'.repeat(padLen)}${s}`
}
const getCommonPrefix = (start, end) => {
  if (start === end) return start
  start = `${start}`
  end = `${end}`
  let commonPrefix = ''
  for (let i = 0; i <= start.length; i++) {
    if (start[i] !== end[i]) {
      return commonPrefix
    }
    commonPrefix += start[i]
  }
}
export const getAllIccidByRange = (iccidBatchs) => {
  const result = []
  iccidBatchs.forEach((item) => {
    const commonPrefix = getCommonPrefix(item.iccidStart, item.iccidEnd)
    const restLen = item.iccidStart.length - commonPrefix.length
    const startNumber = +item.iccidStart.replace(commonPrefix, '')
    for (let i = 0; i < item.count; i++) {
      result.push(`${commonPrefix}${padZero(startNumber + i, restLen)}`)
    }
  })
  return result
}
export default {
  props: {
    label: {
      type: String,
      require: false,
      default: ''
    },
    iccidBatchs: {
      type: Array,
      require: false,
      default: () => []
    },
    required: {
      type: Boolean,
      require: false,
      default: true
    }
  },
  data() {
    return {}
  },
  methods: {
    getEndRule(item, index, type) {
      const typeMap = {
        start: '首部',
        end: '尾部'
      }
      return [
        { required: true, message: `${typeMap[type]}iccid必填` },
        {
          validator: (rule, value, callback) => {
            if (this.isInOtherRanges(value, index)) {
              callback(new Error('和其他首尾iccid区间重复'))
              return
            }
            if (type === 'end' && item.iccidStart.length !== item.iccidEnd.length) {
              callback(new Error('首尾iccid位数不一致'))
              return
            }
            if (type === 'end' && this.calIccidDiff(item.iccidStart, item.iccidEnd) < 0) {
              callback(new Error('尾iccid必须大于或等于首iccid'))
            } else {
              callback()
            }
          }
        }
      ]
    },
    handleDelete(idx) {
      const ranges = this.iccidBatchs.filter((_, i) => i !== idx)
      this.$emit('change', ranges)
    },
    handleAdd() {
      this.$emit('change', [
        ...this.iccidBatchs,
        {
          iccidStart: '',
          iccidEnd: '',
          count: 0
        }
      ])
    },
    isInOtherRanges(val, index) {
      return this.iccidBatchs.some((item, i) => {
        const commonPrefix = getCommonPrefix(item.iccidStart, item.iccidEnd)
        const number = Number(`${val}`.replace(commonPrefix, ''))
        const startNumber = +item.iccidStart.replace(commonPrefix, '')
        const endNumber = +item.iccidEnd.replace(commonPrefix, '')
        return i !== index && number && number >= startNumber && number <= endNumber
      })
    },

    countChange(item, index) {
      const { iccidStart } = item
      const number = this.getLastNumbers(iccidStart)[0]
      const prefix = iccidStart.replace(number, '')
      const rangs = this.iccidBatchs
      // TODO bigInt
      rangs[index].iccidEnd = `${prefix}${BigInt(number) - BigInt(1) + BigInt(item.count)}`
      this.$emit('change', rangs)
    },
    startChange(item, index) {
      const ranges = this.iccidBatchs
      ranges[index].iccidEnd = ''
      ranges[index].count = 0
    },
    endChange(item, index) {
      const ranges = this.iccidBatchs
      if (item.iccidStart.length !== item.iccidEnd.length) return
      ranges[index].count = this.calIccidDiff(item.iccidStart, item.iccidEnd)
      this.$emit('change', ranges)
    },
    getLastNumbers(str) {
      return str.match(/\d+$/)
    },
    calIccidDiff(start, end) {
      const commPrefix = getCommonPrefix(start, end)
      start = start.replace(commPrefix, '') || 0
      end = end.replace(commPrefix, '') || 0

      return end - start + 1 || 0
    }
  }
}
</script>
<style lang="scss" scoped>
.iccid-range-input-wrap {
  width: 620px;
  position: relative;
  display: flex;
  align-items: center;
  align-content: center;
  &:before {
    //position: absolute;
    //top: 50%;
    //left: -20px;
    padding-bottom: 18px;
    transform: translate(0, -9px);
    content: '[';
    font-size: 57px;
    color: #666;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #fff;
  }

  .action-wrap {
    display: flex;
    align-items: center;
    width: 280px;
    justify-content: space-around;
    &:before {
      transform: translate(0, -9px);
      line-height: 0;
      content: '}';
      font-size: 60px;
      color: #999;
      -webkit-text-stroke-width: 2px;
      -webkit-text-stroke-color: #fff;
    }
  }
}
</style>
