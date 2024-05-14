<script>
export default {
  props: {
    value: {
      default: ''
    },
    unit: {
      type: Boolean,
      default: true
    },
    showKb: {
      type: Boolean,
      default: false
    },
    showTb: {
      type: Boolean,
      default: false
    },
    countWay: {
      type: String,
      default: 'MB'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入流量大小'
    },
    isRound: {
      type: Boolean,
      default: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: Infinity
    }
  },
  data() {
    return {
      volume: '',
      unitValue: 1,
      conversionMap: ['KB', 'MB', 'GB', 'TB']
    }
  },
  computed: {
    conversion() {
      const countUnitSize = (index) => {
        let gap = 1024
        let obj = {}
        let splitIndex = this.conversionMap.indexOf(index)
        obj[index] = 1
        let perRate = 1 / gap
        let suffixRate = 1 * gap
        let perArray = this.conversionMap.slice(0, splitIndex).reverse()
        let suffixArray = this.conversionMap.slice(splitIndex + 1, this.conversionMap.length)
        perArray.map((e) => {
          obj[e] = perRate
          perRate /= gap
        })
        suffixArray.map((e) => {
          obj[e] = suffixRate
          suffixRate *= gap
        })
        return obj
      }
      return countUnitSize(this.countWay)
    },
    currentValue() {
      let val = ''
      if (this.volume !== '') val = this.volume * this.unitValue
      return val
    }
  },
  watch: {
    value(val) {
      this.transferVolume(val)
    },
    currentValue(val) {
      this.$emit('input', this.currentValue, {
        displayValue: this.volume,
        unit: this.unitValue
      })
    }
  },
  mounted() {
    this.transferVolume(this.value)
  },
  methods: {
    emit() {
      this.$emit('input', this.currentValue)
    },
    transferVolume(val) {
      if (val === '') {
        this.unitValue = 1
        this.volume = ''
        return
      }
      if (val >= this.conversion.TB && this.showTb) {
        this.unitValue = this.conversion.TB
        this.volume = val / this.conversion.TB
      } else if (val >= this.conversion.GB) {
        this.unitValue = this.conversion.GB
        this.volume = val / this.conversion.GB
      } else if (val < this.conversion.MB && this.showKb) {
        this.unitValue = this.conversion.KB
        this.volume = val / this.conversion.KB
      } else {
        this.unitValue = this.conversion.MB
        this.volume = val / this.conversion.MB
      }
      if (this.isRound) {
        this.volume = this.isRound ? Math.round(this.volume) : this.volume
      }
    }
  }
}
</script>

<template>
  <div class="wh-volume-input">
    <el-input
      v-model="volume"
      :placeholder="placeholder"
      :controls="false"
      :disabled="disabled"
      style="width: 100px"
      @change="emit"
      @blur="
        (e) =>
          $emit('blur', currentValue, {
            displayValue: volume,
            unit: unitValue
          })
      "
    />
    <el-select
      slot="append"
      v-model="unitValue"
      :disabled="!unit || disabled"
      style="width: 70px"
      @change="emit"
    >
      <el-option v-if="showKb" label="KB" :value="conversion.KB"> </el-option>
      <el-option label="MB" :value="conversion.MB"> </el-option>
      <el-option label="GB" :value="conversion.GB"> </el-option>
      <el-option v-if="showTb" label="TB" :value="conversion.TB"> </el-option>
    </el-select>
  </div>
</template>
