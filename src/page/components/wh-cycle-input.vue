<template>
  <div class="wh-cycle-input">
    <el-input-number
      :disabled="disabled"
      :value="computedValue"
      @change="onValueChange"
      :min="min"
      class="wh-cycle-input__input"
    />
    <el-select
      placeholder="单位"
      v-model="unit"
      class="wh-cycle-input__select"
      @change="onUnitChange"
      :disabled="disabled"
    >
      <el-option label="月" value="M" />
      <el-option label="年" value="Y" />
    </el-select>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Number,
        default: 1
      },
      disabled: {
        type: Boolean,
        required: false
      },
      min: {
        default: 0
      },
      isMonthly: {
        type: Boolean
      }
    },
    data() {
      return {
        unit: 'M'
      }
    },
    methods: {
      onValueChange(v) {
        if (this.unit === 'M') {
          this.$emit('input', v)
        } else {
          this.$emit('input', parseInt(v) * 12)
        }
      },
      onUnitChange(v) {
        if (v === 'M') {
          this.$emit('input', this.computedValue)
        } else {
          this.$emit('input', this.computedValue * 12)
        }
      }
    },
    computed: {
      computedValue: {
        get() {
          this.unit = 'M'
          if (this.value === 0) {
            return 1
          }
          if (this.value % 12 === 0) {
            this.unit = 'Y'
            return this.value / 12
          }
          return this.value
        }
      }
    },
    watch: {
      isMonthly (v) {
        if (v) {
          this.unit = 'M'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wh-cycle-input {
    display: flex;
    .wh-cycle-input__input {
      flex: 1 1 auto;
    }
    .wh-cycle-input__select {
      flex: 0 1 70px;
    }
  }
</style>


