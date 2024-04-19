<script>
/**
 * Create by zeter on 2018/11/19
 * 本组件用于含有单位选择的流量大小输入
 * 使用max决定是否显示TB，使用unit决定是否可换单位
 */
export default {
  name: 'wh-volume-input',
  props: {
    value: {
      default: 0
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
    }
  },
  data() {
    return {
      volume: '',
      unitValue: 1,
      conversionMap: ['KB', 'MB', 'GB', 'TB']
      // conversion: {
      //   KB: 1 / 1024,
      //   MB: 1,
      //   GB: 1024,
      //   TB: 1024 * 1024,
      // },
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
      this.$emit('input', this.currentValue)
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
    }
  }
}
</script>

<template>
  <!--<div class="wh-volume-input">-->
  <el-input
    v-model="volume"
    :placeholder="placeholder"
    type.native="number"
    :disabled="disabled"
    style="width: 150px"
    @change="emit"
  >
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
  </el-input>
  <!--</div>-->
</template>
