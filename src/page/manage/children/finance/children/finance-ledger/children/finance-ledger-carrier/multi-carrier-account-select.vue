<script>
import kg from "element-ui/src/locale/lang/kg";

export default {
  name: 'multi-carrier-account-select',
  props: {
    value: {
      default: ''
    },
    carrier: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择运营商账号'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    empty: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    },
    disabledName: {
      type: Array,
      default: () => []
    },
    disableIds: {
      type: Array,
      default: () => []
    },
    signedCarrierId: {
      // 所属运营商账
      type: [String, Number],
      default: ''
    },
    listFilter: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      loading: true,
      currentValue: [],
      carrierAccountList: []
    }
  },
  watch: {
    value(val) {
      this.currentValue = val
    },
    carrier(val) {
      this.changeCarrier(val)
    },
    signedCarrierId(val) {
      this.changeCarrier(val)
    },
    currentValue(val) {
      let selected = null
      if (this.carrierAccountList.length) {
        this.carrierAccountList.map((e) => {
          if (e.id === val) selected = e
        })
      }
      this.$emit('input', val, selected)
      this.$emit('change', val, selected)
    }
  },
  async created() {
    this.loading = true
    await this.$store.dispatch('changeAccountList')
    this.loading = false
    this.changeCarrier()
    this.currentValue = this.value
  },
  methods: {
    getCarrierAccountList() {
      return this.carrierAccountList
    },
    changeCarrier() {
      this.carrierAccountList = this.$store.state.carrierAccount[`${this.carrier}AccountList`]
      if (this.listFilter) {
        this.carrierAccountList = this.listFilter(this.carrierAccountList)
      }
      if (this.carrierAccountList == null) {
        this.carrierAccountList = []
      }
      if (this.carrierAccountList.length > 0 && this.signedCarrierId) {
        this.carrierAccountList = this.carrierAccountList.filter(
          (item) => item.signedCarrierId === Number(this.signedCarrierId)
        )
      }
      if (this.empty) {
        this.currentValue = []
      } else {
        console.log('🎸 DEBUG_105 multi-carrier-account-select.vue 👉', this.carrierAccountList)
        if (this.carrierAccountList && this.carrierAccountList.length) {
          this.currentValue = [this.carrierAccountList[0].id]
          console.log('🎸 DEBUG_110 multi-carrier-account-select.vue 👉', this.currentValue,this.carrierAccountList[0].id)
        } else {
          this.currentValue = []
        }
      }
    },
    changeCarrierAccount(val) {
      this.currentValue = val
    }
  }
}
</script>

<template>
  <el-select
    v-model="currentValue"
    v-loading="loading"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :size="size"
    multiple
    collapse-tags
    clearable
    @change="changeCarrierAccount"
  >
    <el-option
      v-for="i in carrierAccountList"
      :key="i.id + i.name"
      :label="i.name"
      :disabled="disabledName.indexOf(i.name) > -1 || disableIds.indexOf(i.id) > -1"
      :value="i.id"
    >
    </el-option>
  </el-select>
</template>
