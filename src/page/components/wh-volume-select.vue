<template>
  <el-select
    v-model="computedValue"
    placeholder="套餐规格"
    clearable
    :disabled="disabled"
    style="width: 120px"
    @change="onChange"
  >
    <el-option
      v-for="item in filteredVolumeList"
      :key="item.value"
      :label="item.label"
      v-show="item.volumeUnit !== 'C' ? true : showTimesOptions ? true : false"
      :value="item.value"
    />
  </el-select>
</template>

<script>
  const volumeUnitObj = {
    'MB': 'MB',
    'GB': 'GB',
    'C': '次'
  }

  export default {
    props: {
      value: {
        type: String,
        default: ''
      },
      volumeList: {
        type: Array,
        default: []
      },
      carrier: {
        default: ''
      },
      showTimesOptions: {
        default: true,
        type: Boolean
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
      filteredVolumeList() {
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
          })
          .sort((a, b) => {
            if (a.volumeUnit === 'C' && b.volumeUnit !== 'C') {
              return 1
            } 
            if (a.volumeUnit !== 'C' && b.volumeUnit === 'C') {
              return -1
            } 
            return a.volume - b.volume
          })
          .forEach((item) => {
            if (item.volumeUnit === 'M') {
              item.volumeUnit = 'MB'
            }
            if (item.volumeUnit !== 'C' && item.volume && item.volume % 1024 === 0) {
              item.volume = item.volume / 1024
              item.volumeUnit = 'GB'
            }
            const volumeAndUnit = item.volume + item.volumeUnit
            const label = item.volume + volumeUnitObj[item.volumeUnit]
            if (!filtered.map((e) => e.value).includes(volumeAndUnit)) {
              filtered.push({
                value: volumeAndUnit,
                label,
                volumeUnit: item.volumeUnit
              })
            }
          })
        return filtered
      }
    },
    watch: {
      carrier() {
        this.computedValue = ''
        this.onChange('')
      }
    }
  }
</script>