<template>
  <el-select
    v-model="computedValue"
    placeholder="套餐周期"
    clearable
    style="width: 110px"
    :disabled="disabled"
    @change="onChange"
  >
    <el-option
      v-for="item in filteredValidityList"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
 
<script>
  export default {
    props: {
      value: {
        default: undefined
      },
      volumeList: {
        type: Array,
        default: []
      },
      volumeAndUnit: {
        type: String,
        default: ''
      },
      // 是否展示自然月，如果是false，会将0转成1
      showMonthly: {
        type: Boolean,
        default: false
      },
      disabled: {
        default: false
      },
      offerType: {
        type: String,
        default: ''
      }
    },
    methods: {
      onChange(v) {
        this.$emit('input', v)
        this.$emit('change', v)
      }
    },
    computed: {
      computedValue: {
        get() {
          return this.value
        },
        set() {}
      },
      filteredValidityList() {
        let volumeAndUnit = this.volumeAndUnit
        if (volumeAndUnit.indexOf('G') > -1) {
          const pattern = /([0-9]+)G/
          const gb = pattern.exec(volumeAndUnit)[1]
          volumeAndUnit = (gb * 1024) + 'MB'
        }
        const filtered = []
        const temp = JSON.parse(JSON.stringify(this.volumeList))
        temp
        .filter(e => {
          switch(this.offerType) {
            case '':
              return true
            case 'monthly':
              return e.validity === 0
            case 'custom':
              return e.validity !== 0
          }
        }).
        sort((a, b) => {
            return a.validity - b.validity
          }).forEach((item) => {
          const volume = item.volume + item.volumeUnit
          if (volume === volumeAndUnit || !volumeAndUnit) {
            if (item.validity === 0 && !this.showMonthly) {
              item.validity = 1
            }
            if (!filtered.map((e) => e.value).includes(item.validity)) {
              filtered.push({
                value: item.validity,
                label: item.validity === 0 ? '自然月' : item.validity
              })
            }
          }
        })
        return filtered
      }
    },
    watch: {
      volumeAndUnit() {
        this.computedValue = undefined
        this.onChange(undefined)
      }
    }
  }
</script>