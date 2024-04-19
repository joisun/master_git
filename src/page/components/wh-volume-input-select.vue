<!--
 * @Author: SerkeyWu
 * @Date: 2021-02-20 11:33:38
 * @Description: 通用套餐规格输入与选择组件，可选择规格单位（MB、GB、C）返回值为数字（MB）或者数字+C（意为次数）
 * @LastEditors: SerkeyWu
 * @LastEditTime: 2021-02-24 17:04:40
-->
<template>
  <span class="wh-volume-input-select">
    <el-input-number
      v-model="volume"
      :controls="false"
      style="width: 80px; margin-right: -6px"
      :precision="0"
      :min="0"
      @change="onVolumeChange"
    />
    <el-select v-model="unit" style="width: 70px">
      <el-option
        v-for="item in unitOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </span>
</template>

<script>
const volumePattern = /([0-9]+)(GB|MB|C)/

export default {
  props: {
    value: {
      type: String
    }
  },
  data() {
    return {
      unitOptions: [
        {
          value: 'MB',
          label: 'MB'
        },
        {
          value: 'GB',
          label: 'GB'
        },
        {
          value: 'C',
          label: '次'
        }
      ]
    }
  },
  computed: {
    volume: {
      get() {
        if (!this.value) {
          return undefined
        }
        const result = volumePattern.exec(this.value)
        const volume = parseFloat(result[1])
        const unit = result[2]
        if (unit === 'MB' && volume && volume % 1024 === 0) {
          return volume / 1024
        } else {
          return volume
        }
      },
      set(v) {}
    },
    unit: {
      get() {
        if (!this.value) {
          return 'MB'
        }
        const result = volumePattern.exec(this.value)
        const volume = parseFloat(result[1])
        const unit = result[2]
        if (unit === 'C') {
          return 'C'
        } else if (unit === 'MB' && volume && volume % 1024 === 0) {
          return 'GB'
        } else {
          return 'MB'
        }
      },
      set(v) {
        const volume = !this.volume ? 1 : this.volume
        const volumeAndUnit = v === 'GB' ? volume * 1024 + 'MB' : volume + v
        console.log(volumeAndUnit)
        this.$emit('input', volumeAndUnit)
        this.$emit('change', volumeAndUnit)
      }
    }
  },
  methods: {
    onVolumeChange(v) {
      let volumeAndUnit
      if (!v) {
        volumeAndUnit = ''
      } else {
        volumeAndUnit = this.unit === 'GB' ? v * 1024 + 'MB' : v + this.unit
      }
      this.$emit('input', volumeAndUnit)
      this.$emit('change', volumeAndUnit)
    }
  }
}
</script>
<style lang="scss">
.wh-volume-input-select {
}
</style>
