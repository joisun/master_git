<template>
  <el-form-item prop="packageSize" class="package-size-list">
    <div
      v-for="(row, index) in data"
      :key="index"
      class="package-size-item"
      style="white-space: nowrap"
    >
      <!--      <div class="package-size-item-left">{{ index + 1 }}</div>-->
      <div class="package-size-item-middle">
        <el-card style="width: 600px; margin-bottom: 8px" shadow="never">
          <template #header>
            <div style="display: flex; align-items: center">
              <el-form-item
                style="margin-bottom: 0"
                :prop="`packageSize.${index}.lowerLimit`"
                :rules="{ required: true, message: '请输入下限' }"
              >
                <!--                <el-input-number v-model="row.lowerLimit" size="small" style="width: 200px" />-->
                <volume-input-select
                  v-model="row.lowerLimit"
                  @blur="(...args) => onLowerBlur(index, row, args)"
                />
              </el-form-item>
              <span style="margin: 0 10px">
                <span>&#60;</span> X
                <span>≤</span>
              </span>
              <el-form-item
                style="margin-bottom: 0"
                :prop="`packageSize.${index}.upperLimit`"
                :rules="{ required: index !== data.length - 1, message: '请输入上限' }"
              >
                <!--                <el-input-number v-model="row.upperLimit" size="small" style="width: 200px" />-->
                <volume-input-select
                  v-model="row.upperLimit"
                  @input="(...args) => onUpperChange(index, row, args)"
                />
              </el-form-item>
              <el-button
                style="margin-left: 20px"
                circle
                icon="el-icon-minus"
                @click="handlePackageDelete(index, row)"
              />
              <el-button
                type="primary"
                circle
                icon="el-icon-plus"
                @click="handlePackageInsert(index, row)"
              />
            </div>
          </template>
          <div v-for="(ca, i) in row.carrierAccount" :key="i">
            <div class="package-size-item-carrier">
              <el-form-item
                :prop="`packageSize.${index}.carrierAccount.${i}.id`"
                required
                :label="`运营商账号${i + 1}`"
                :rules="{
                  required: true,
                  message: '请选择运营商账号'
                }"
              >
                <wh-carrier-account-select
                  v-model="ca.id"
                  :disable-ids="disableAccountIds(index)"
                  placeholder="选择运营商账号"
                  :carrier="carrier"
                  :list-filter="carrierAccountListFilter"
                />
              </el-form-item>
              <div style="margin: 0 0 18px 18px">
                <el-button
                  :disabled="i === 0"
                  circle
                  icon="el-icon-caret-top"
                  @click="handleCarrierUp(index, i)"
                />
                <el-button circle icon="el-icon-minus" @click="handleCarrierDel(index, i)" />
                <el-button
                  type="primary"
                  circle
                  icon="el-icon-plus"
                  @click="handleCarrierInsert(index, i)"
                />
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <div class="package-size-item-right"></div>
    </div>
  </el-form-item>
</template>

<script>
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select'
import VolumeInputSelect from './volume-input-select'
const DEFAULT_CARRIER = JSON.stringify({
  id: ''
})

const DEFAULT_ITEM = JSON.stringify({
  lowerLimit: '',
  upperLimit: '',
  // carrierAccount: [...JSON.parse(DEFAULT_CARRIER)]
})
export default {
  components: {
    'wh-carrier-account-select': whCarrierAccountSelect,
    VolumeInputSelect
  },
  props: {
    carrier: {
      type: String,
      default: 'cmcc'
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      changePosition: -1,
      changeType: 'insert'
    }
  },
  computed: {
    tableLen() {
      return this.data.length
    }
  },
  methods: {
    disableAccountIds(index) {
      const selectedCarrierAccount = []
      const item = this.data[index]
      item.carrierAccount.forEach((c) => selectedCarrierAccount.push(c.id))
      return selectedCarrierAccount
    },
    carrierAccountListFilter(list) {
      return list
    },
    handleCarrierUp(index, i) {
      const data = [...this.data]
      const current = { ...data[index].carrierAccount[i] }
      data[index].carrierAccount[i] = data[index].carrierAccount[i - 1]
      data[index].carrierAccount[i - 1] = current
      this.$emit('change', data)
    },
    handleCarrierInsert(index, i) {
      const data = [...this.data]
      data[index].carrierAccount.splice(i + 1, 0, JSON.parse(DEFAULT_CARRIER))
      this.$emit('change', data)
    },
    handleCarrierDel(index, i) {
      const data = [...this.data]
      data[index].carrierAccount.splice(i, 1)
      if (data[index].carrierAccount.length === 0) {
        data[index].carrierAccount = [...JSON.parse(DEFAULT_CARRIER)]
      }
      this.$emit('change', data)
    },
    handlePackageInsert(index, row) {
      const data = [...this.data]
      if (!this.canInsert(index, row)) return
      this.changePosition = index
      this.changeType = 'insert'
      const current = data[index]
      if (data[index + 1]) {
        data[index + 1].lowerLimit = undefined
      }
      data.splice(index + 1, 0, {
        ...JSON.parse(DEFAULT_ITEM),
        lowerLimit: current.upperLimit,
        upperLimit: undefined
      })
      this.$emit('change', data)
    },
    handlePackageDelete(index) {
      const { tableLen, data } = this
      const [removeItem] = data.splice(index, 1)
      // 删除当前条目时，需要将下一条下限设置为当前条目的下限
      // 如果只有一条，则不操作
      // 如果为最后一条，则不操作
      if (tableLen > 1 && removeItem.lowerLimit && index !== tableLen - 1) {
        data[index].lowerLimit = removeItem.lowerLimit
      }
      this.insertOneIfEmpty()
    },
    canInsert(index) {
      const { tableLen, data } = this
      return !(
        index !== tableLen - 1 && data[index + 1].upperLimit - data[index + 1].lowerLimit === 1
      )
    },
    insertOneIfEmpty() {
      if (this.data.length === 0) {
        this.$emit('change', [JSON.parse(DEFAULT_ITEM)])
      }
    },
    onLowerBlur(index, value, args) {},
    onLowerChange(index, value, args) {},
    onUpperChange(index, value, args) {}
  }
}
</script>

<style scoped lang="scss">
.package-size-list {
  .package-size-item {
    display: flex;
    align-items: center;
    .package-size-item-carrier {
      display: flex;
      align-items: center;
    }
    .package-size-item-left {
      width: 30px;
      flex-grow: 0;
      flex-shrink: 0;
    }
    .package-size-item-middle {
      flex-grow: 0;
      width: 500px;
    }
    .package-size-item-right {
      width: 200px;
      flex-grow: 0;
      flex-shrink: 0;
    }
  }
}
</style>
