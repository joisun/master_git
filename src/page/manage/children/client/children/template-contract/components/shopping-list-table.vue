<template>
  <div class="shopping-list-table-form">
    <div class="table-header">
      <div
        v-for="item in headers"
        :key="item.value"
        class="table-col"
        :style="{ width: `${colWidthMap[item.value]}px` }"
      >
        <template v-if="!item.isCustom">
          {{ item.name }}
        </template>
        <template v-else>
          <el-input
            v-model.trim="item.name"
            style="width: 100%"
            size="mini"
            placeholder="自定义列"
            :disabled="viewOnly"
            :maxlength="5"
          />
        </template>
      </div>
    </div>
    <div class="table-body">
      <div v-for="(item, index) in list" :key="index" class="table-body-row">
        <template v-for="headerItem in headers">
          <div
            v-if="headerItem.value === 'productName'"
            :key="headerItem.value"
            class="table-col"
            :style="{ width: `${colWidthMap.productName}px` }"
          >
            <el-form-item
              :prop="'attatchContracts.' + parentIndex + '.list.' + index + '.productName'"
              :rules="{ required: true, message: '请选择产品名称', trigger: 'submit' }"
            >
              {{ item.productName }}
            </el-form-item>
          </div>
          <div
            v-if="headerItem.value === 'countryCode'"
            :key="headerItem.value"
            class="table-col"
            :style="{ width: `${colWidthMap.countryCode}px` }"
          >
            <el-form-item
              :rules="{ required: true, message: '请选择地区代码', trigger: 'submit' }"
              :prop="'attatchContracts.' + parentIndex + '.list.' + index + '.countryCode'"
            >
              <el-select
                v-model="item.countryCode"
                size="mini"
                placeholder="选择地区代码"
                style="width: 95px"
                :disabled="viewOnly"
                multiple
              >
                <el-option
                  v-for="item in countryCodeList"
                  :key="item.code"
                  :label="item.country"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </div>
          <div
            v-if="headerItem.value === 'carrier'"
            :key="headerItem.value"
            class="table-col"
            :style="{ width: `${colWidthMap.carrier}px` }"
          >
            <el-form-item
              :prop="'attatchContracts.' + parentIndex + '.list.' + index + '.carrier'"
              :rules="{ required: true, message: '请选择运营商', trigger: 'submit' }"
            >
              <el-select
                v-model="item.carrier"
                size="mini"
                placeholder="选择运营商"
                style="width: 95px"
                :disabled="viewOnly"
              >
                <el-option
                  v-for="(key, val) in enums.carrier.maps()"
                  :key="val"
                  :label="key"
                  :value="val"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div
            v-if="headerItem.value === 'dataPlan'"
            :key="headerItem.value"
            class="table-col"
            :style="{ width: `${colWidthMap.dataPlan}px` }"
          >
            <el-form-item
              :prop="'attatchContracts.' + parentIndex + '.list.' + index + '.dataPlan'"
              :rules="{
                required: true,
                message: '请完善流量套餐',
                validator: (_, r, callback) => dataPlanValidator(index, r, callback),
                trigger: 'submit'
              }"
            >
              <el-select
                v-model="item.volumeType"
                :disabled="viewOnly"
                placeholder=""
                style="width: 65px"
                size="mini"
                @change="dataPlanChange(parentIndex, index, item)"
              >
                <el-option
                  v-for="t in volumeType"
                  :key="t.value"
                  :label="t.label"
                  :value="t.value"
                />
              </el-select>
              <el-input-number
                v-model="item.volume"
                size="mini"
                :disabled="viewOnly"
                :controls="false"
                style="width: 70px"
                @change="dataPlanChange(parentIndex, index, item)"
              />
              <el-select
                v-model="item.volumeUnit"
                :disabled="viewOnly"
                placeholder=""
                style="width: 65px"
                size="mini"
                @change="dataPlanChange(parentIndex, index, item)"
              >
                <el-option
                  v-for="t in volumeUnitOptions"
                  :key="t.value"
                  :label="t.label"
                  :value="t.value"
                />
              </el-select>
              /
              <el-input-number
                v-model="item.time"
                size="mini"
                :disabled="viewOnly"
                :controls="false"
                style="width: 70px"
                @change="dataPlanChange(parentIndex, index, item)"
              />
              <el-select
                v-model="item.timeUnit"
                size="mini"
                :disabled="viewOnly || item.volumeType === '按月套餐'"
                placeholder=""
                style="width: 60px"
                @change="dataPlanChange(parentIndex, index, item)"
              >
                <el-option
                  v-for="t in timeUnitOptions"
                  :key="t.value"
                  :label="t.label"
                  :value="t.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div
            v-if="headerItem.value === 'test'"
            :key="headerItem.value"
            class="table-col"
            :style="{ width: `${colWidthMap.test}px` }"
          >
            <el-form-item
              :rules="{ required: true, message: '请输入测试期', trigger: 'submit' }"
              :prop="'attatchContracts.' + parentIndex + '.list.' + index + '.test'"
            >
              <el-input v-model="item.test" size="mini" style="width: 80px" :disabled="viewOnly" />
            </el-form-item>
          </div>
          <div
            v-if="headerItem.value === 'silent'"
            :key="headerItem.value"
            class="table-col"
            :style="{ width: `${colWidthMap.silent}px` }"
          >
            <el-form-item
              :rules="{ required: true, message: '请输入沉默期', trigger: 'submit' }"
              :prop="'attatchContracts.' + parentIndex + '.list.' + index + '.silent'"
            >
              <el-input
                v-model="item.silent"
                size="mini"
                style="width: 80px"
                :disabled="viewOnly"
              />
            </el-form-item>
          </div>
          <div
            v-if="headerItem.value === 'purchaseCycle'"
            :key="headerItem.value"
            class="table-col"
            :style="{ width: `${colWidthMap.purchaseCycle}px` }"
          >
            <el-form-item
              :prop="'attatchContracts.' + parentIndex + '.list.' + index + '.purchaseCycle'"
              :rules="{
                required: true,
                message: '请完善采购周期',
                trigger: 'submit'
              }"
            >
              <el-input-number
                v-model="item.purchaseCycle"
                size="mini"
                :disabled="viewOnly"
                :controls="false"
                style="width: 70px"
              />
            </el-form-item>
          </div>
          <div
            v-if="headerItem.value === 'custom1'"
            :key="headerItem.value"
            class="table-col"
            :style="{ width: `${colWidthMap.custom1}px` }"
          >
            <el-form-item :prop="'attatchContracts.' + parentIndex + '.list.' + index + '.custom1'">
              <el-input
                v-model="item.custom1"
                size="mini"
                :disabled="!custom1HasName || viewOnly"
                style="width: 100%"
                :maxlength="10"
              />
            </el-form-item>
          </div>
          <div
            v-if="headerItem.value === 'custom2'"
            :key="headerItem.value"
            class="table-col"
            :style="{ width: `${colWidthMap.custom2}px` }"
          >
            <el-form-item :prop="'attatchContracts.' + parentIndex + '.list.' + index + '.custom2'">
              <el-input
                v-model="item.custom2"
                size="mini"
                :disabled="!custom2HasName || viewOnly"
                style="width: 100%"
                :maxlength="10"
              />
            </el-form-item>
          </div>
          <div
            v-if="headerItem.value === 'purchaseNum'"
            :key="headerItem.value"
            class="table-col"
            :style="{ width: `${colWidthMap.purchaseNum}px` }"
          >
            <el-form-item
              :rules="{ required: true, message: '请输入采购数量', trigger: 'submit' }"
              :prop="'attatchContracts.' + parentIndex + '.list.' + index + '.purchaseNum'"
            >
              <el-input-number
                v-model="item.purchaseNum"
                size="mini"
                :controls="false"
                style="width: 80px"
                :disabled="viewOnly"
              />
            </el-form-item>
          </div>
          <div
            v-if="headerItem.value === 'unitPrice'"
            :key="headerItem.value"
            class="table-col"
            :style="{ width: `${colWidthMap.unitPrice}px` }"
          >
            <el-form-item
              :rules="{
                required: true,
                message: '请完善产品单价',
                // validator: (_, r, callback) => unitPriceUnitValidator(index, r, callback),
                trigger: 'submit'
              }"
              :prop="'attatchContracts.' + parentIndex + '.list.' + index + '.unitPrice'"
            >
              <!--            @change="unitPriceUnitChange(parentIndex, index, item)"-->

              <el-input-number
                v-model="item.unitPrice"
                size="mini"
                :controls="false"
                style="width: 80px"
                :disabled="viewOnly"
              />
              <!--            <el-select-->
              <!--              v-model="item.unitPriceUnit"-->
              <!--              size="mini"-->
              <!--              :disabled="viewOnly"-->
              <!--              placeholder=""-->
              <!--              style="width: 75px"-->
              <!--              @change="unitPriceUnitChange(parentIndex, index, item)"-->
              <!--            >-->
              <!--              <el-option-->
              <!--                v-for="t in purchaseCycleUnitOptions"-->
              <!--                :key="t.value"-->
              <!--                :label="t.label"-->
              <!--                :value="t.value"-->
              <!--              />-->
              <!--            </el-select>-->
            </el-form-item>
          </div>
          <div
            v-if="headerItem.value === 'cardFee'"
            :key="headerItem.value"
            class="table-col"
            :style="{ width: `${colWidthMap.cardFee}px` }"
          >
            <el-form-item
              :rules="{ required: true, message: '请输入单卡卡费', trigger: 'submit' }"
              :prop="'attatchContracts.' + parentIndex + '.list.' + index + '.cardFee'"
            >
              <el-input-number
                v-model="item.cardFee"
                size="mini"
                :controls="false"
                style="width: 100px"
                :disabled="viewOnly"
              />
            </el-form-item>
          </div>
          <div
            v-if="headerItem.value === 'subTotal'"
            :key="headerItem.value"
            class="table-col"
            :style="{ width: `${colWidthMap.subTotal}px` }"
          >
            <el-form-item
              :rules="{ required: true, message: '请输入合计', trigger: 'submit' }"
              :prop="'attatchContracts.' + parentIndex + '.list.' + index + '.subTotal'"
            >
              <el-input-number
                v-model="item.subTotal"
                size="mini"
                :controls="false"
                style="width: 80px"
                :disabled="viewOnly"
                @change="subTotalChange"
              />
            </el-form-item>
          </div>
        </template>
        <div v-if="!viewOnly" class="table-col" :style="{ width: `${colWidthMap.action}px` }">
          <el-button
            v-if="list.length > 1"
            size="mini"
            type="text"
            icon="el-icon-minus"
            @click="handleRemove(index)"
          />
          <el-button
            v-if="index === list.length - 1"
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Mixins from '@/page/manage/children/client/children/template-contract/mixins/consts'

export const DETAULT_ITEM_FORM = JSON.stringify({
  productName: '物联网卡',
  carrier: '',
  volumeType: '',
  volume: undefined,
  volumeUnit: '',
  time: undefined,
  timeUnit: '',
  silent: undefined,
  purchaseNum: undefined,
  unitPrice: undefined,
  subTotal: undefined,
  cardFee: undefined,
  custom1: undefined,
  custom2: undefined
})
export const INTL_DETAULT_ITEM_FORM = JSON.stringify({
  productName: '物联网卡',
  carrier: '',
  volumeType: '',
  volume: undefined,
  volumeUnit: '',
  time: undefined,
  timeUnit: '',
  test: undefined,
  silent: undefined,
  purchaseNum: undefined,
  unitPrice: undefined,
  subTotal: undefined,
  cardFee: undefined,
  custom1: undefined
})
const purchaseCycleUnitOptions = [
  {
    label: '元/月',
    value: '元/月'
  },
  {
    label: '元/年',
    value: '元/年'
  },
  {
    label: '元/张',
    value: '元/张'
  }
]
const timeUnitOptions = [
  {
    label: '月',
    value: '月'
  },
  {
    label: '年',
    value: '年'
  }
]
const productOptions = [
  {
    label: '物联网卡',
    value: '物联网卡'
  },
  {
    label: '物联网卡+模组',
    value: '物联网卡+模组'
  }
]
const volumeType = [
  {
    label: '按月套餐',
    value: '按月套餐'
  },
  {
    label: '自定义套餐',
    value: '自定义套餐'
  }
]
const volumeUnitOptions = [
  {
    label: 'MB',
    value: 'MB'
  },
  {
    label: 'GB',
    value: 'GB'
  },
  {
    label: '次',
    value: '次'
  }
]
export default {
  mixins: [Mixins],
  props: {
    viewOnly: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      require: true,
      default: () => []
    },
    headers: {
      type: Array,
      require: true,
      default: () => []
    },
    parentIndex: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      timeUnitOptions,
      colWidthMap: {
        productName: 80,
        carrier: 110,
        countryCode: 140,
        dataPlan: 370,
        silent: 100,
        purchaseCycle: 100,
        custom1: 90,
        custom2: 90,
        purchaseNum: 100,
        unitPrice: 100,
        subTotal: 100,
        cardFee: 120,
        action: 70
      },
      // colWidths: [0, 120, 110, 300, 100, 200, 90, 90, 100, 100, 100, 70],
      volumeUnitOptions,
      volumeType,
      productOptions,
      purchaseCycleUnitOptions
    }
  },
  computed: {
    custom1HasName() {
      return !!(this.headers.find((item) => item.value === 'custom1') || {}).name
    },
    custom2HasName() {
      return !!(this.headers.find((item) => item.value === 'custom2') || {}).name
    }
  },
  created() {
    this.getCountryCode()
  },
  methods: {
    subTotalChange() {
      this.$emit('change', [...this.list])
    },

    dataPlanValidator(index, rule, callback) {
      const { volume, volumeUnit, time, timeUnit, volumeType } = this.list[index]
      if (!volume || !volumeUnit || !time || !timeUnit || !volumeType) {
        return callback('请完善流量套餐')
      }
      callback()
    },
    dataPlanChange(parentIdx, idx, item) {
      const { volume, volumeUnit, time, timeUnit, volumeType } = item
      if (volumeType === '按月套餐') {
        item.timeUnit = '月'
      }
      // eslint-disable-next-line vue/no-mutating-props
      this.list[idx].dataPlan = `${volumeType}${volume}${volumeUnit}/${time}${timeUnit}`
    },
    handleAdd() {
      this.$emit('change', [...this.list, JSON.parse(DETAULT_ITEM_FORM)], 'ADD')
    },
    handleRemove(idx) {
      if (this.list.length <= 1) return
      const list = this.list.filter((_, index) => index !== idx)
      this.$emit('change', list, 'DEL')
    }
  }
}
</script>
<style scoped lang="scss">
.shopping-list-table-form {
  overflow-x: auto;
  .table-header {
    display: flex;
    width: auto;
    .table-col {
      padding: 4px 6px;
      background-color: #eaeef0;
      flex-grow: 0;
      flex-shrink: 0;
    }
  }
  .table-body {
    .table-body-row {
      display: flex;
      .table-col {
        padding: 4px 6px;
        flex-grow: 0;
        flex-shrink: 0;
      }
    }
  }
}
</style>
