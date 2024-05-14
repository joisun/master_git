<template>
  <div style="width: 100%; overflow-x: auto">
    <el-table :data="tableData" class="table table--offer">
      <template v-if="offerType === 'plan'">
        <el-table-column label="ID" width="85" prop="id" fixed="left">
          <template slot-scope="scope"> {{ scope.$index + 1 }}（{{ scope.row.id }}） </template>
        </el-table-column>
        <el-table-column label="激活宽限期" width="160">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.minActivateTime"
              :disabled="isOfferSetting"
              @change="onActiveOrLimitChange(scope.row, 'minActivateTime')"
            >
              <el-option
                v-for="item in options.activateTime"
                :key="item"
                :value="item"
                :disabled="item > scope.row.maxActivateTime"
              >
                {{ item }}
              </el-option>
            </el-select>
            -
            <el-select
              v-model="scope.row.maxActivateTime"
              :disabled="isOfferSetting"
              @change="onActiveOrLimitChange(scope.row, 'maxActivateTime')"
            >
              <el-option
                v-for="item in options.activateTime"
                :key="item"
                :value="item"
                :disabled="item < scope.row.minActivateTime"
              >
                {{ item }}
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="订购限制" width="150">
          <template slot-scope="scope">
            <p style="margin-bottom: 2px">
              间隔
              <el-input-number
                v-model="scope.row.orderInterval"
                :disabled="isOfferSetting || isUniPirce"
                :controls="false"
                :step-strictly="true"
                :min="1"
                @change="onActiveOrLimitChange(scope.row, 'orderInterval')"
              />
            </p>
            <p>
              范围
              <el-input-number
                v-model="scope.row.orderSpanFrom"
                :controls="false"
                :step-strictly="true"
                :disabled="isUniPirce"
                :min="scope.row.orderInterval"
                :max="scope.row.orderSpanTo"
                @change="onActiveOrLimitChange(scope.row, 'orderSpanFrom')"
              />
              -
              <el-input-number
                v-model="scope.row.orderSpanTo"
                :controls="false"
                :step-strictly="true"
                :disabled="isUniPirce"
                :min="Math.max(scope.row.orderSpanFrom, scope.row.orderInterval)"
                @change="onActiveOrLimitChange(scope.row, 'orderSpanTo')"
              />
            </p>
          </template>
        </el-table-column>
        <el-table-column label="起订量限制" width="125">
          <template slot-scope="scope">
            <p style="margin-bottom: 2px">
              起订量
              <el-input-number
                v-model="scope.row.minBuyCount"
                :min="0"
                :disabled="isUniPirce"
                :controls="false"
                style="width: 60px"
              />
            </p>
            <p>
              步&nbsp;&nbsp;&nbsp;长
              <el-input-number
                v-model="scope.row.buyCountStep"
                :controls="false"
                :disabled="isUniPirce"
                :min="0"
                style="width: 60px"
              />
            </p>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        v-if="!isOfferSetting"
        label="运营商官方报价"
        :width="offerType === 'plan' ? '120' : ''"
        align="center"
      >
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.officialPrice"
            :controls="false"
            :min="0"
            @change="onOfficialPriceChanged(scope.row)"
          />
        </template>
      </el-table-column>
      <template v-if="isOfferSetting && offerType === 'plan'">
        <el-table-column label="购卡底价" width="70">
          <template slot-scope="scope">
            {{ scope.row.bottomPrice }}
          </template>
        </el-table-column>
        <el-table-column label="购卡价格" width="90">
          <template slot-scope="scope">
            <p>
              价格
              <el-input-number v-model="scope.row.price" :controls="false" :min="0" />
            </p>
            <p>
              佣金
              <span>
                <el-input-number v-model="scope.row.commission" :controls="false" :min="0" />
              </span>
            </p>
          </template>
        </el-table-column>
      </template>
      <template v-if="!isOfferSetting">
        <el-table-column label="平台售价">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.platformPrice"
              :controls="false"
              :min="0"
              :disabled="isUniPirce"
              @change="onPriceChanged(scope.row, 'platformPrice', 'platformDiscount')"
            />元
            <el-input-number
              v-model="scope.row.platformDiscount"
              :controls="false"
              :disabled="isUniPirce"
              @change="onDiscountChanged(scope.row, 'platformDiscount', 'platformPrice')"
            />%
          </template>
        </el-table-column>
        <el-table-column label="销售购卡底价">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.saleBottomPrice"
              :disabled="isUniPirce"
              :controls="false"
              :min="0"
              @change="onPriceChanged(scope.row, 'saleBottomPrice', 'saleBottomDiscount')"
            />元
            <el-input-number
              v-model="scope.row.saleBottomDiscount"
              :controls="false"
              :disabled="isUniPirce"
              @change="onDiscountChanged(scope.row, 'saleBottomDiscount', 'saleBottomPrice')"
            />%
          </template>
        </el-table-column>
        <el-table-column v-if="offerType === 'plan'" label="销售续费底价">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.saleRenewPrice"
              :controls="false"
              :min="0"
              :disabled="isUniPirce"
              @change="onPriceChanged(scope.row, 'saleRenewPrice', 'saleRenewPriceDiscount')"
            />元
            <el-input-number
              v-model="scope.row.saleRenewPriceDiscount"
              :controls="false"
              :disabled="isUniPirce"
              @change="onDiscountChanged(scope.row, 'saleRenewPriceDiscount', 'saleRenewPrice')"
            />%
          </template>
        </el-table-column>
      </template>
      <template v-if="offerType === 'plan'">
        <template v-if="isOfferSetting">
          <el-table-column label="销售续费底价（元）" width="80">
            <template slot-scope="scope">
              {{ scope.row.saleRenewPrice }}
            </template>
          </el-table-column>
          <el-table-column label="续费条件一" width="90">
            <template slot-scope="scope">
              <p>
                价格
                <span v-if="scope.row.conditions && scope.row.conditions[0]">
                  <el-input-number
                    v-model="scope.row.conditions[0].price"
                    :disabled="isUniPirce"
                    :min="0"
                    :controls="false"
                  />
                </span>
                <span v-else>——</span>
              </p>
              <p>
                佣金
                <span v-if="scope.row.conditions && scope.row.conditions[0]">
                  <el-input-number
                    v-model="scope.row.conditions[0].commission"
                    :controls="false"
                    :min="0"
                  />
                </span>
                <span v-else>——</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="续费条件二" width="90">
            <template slot-scope="scope">
              <p>
                价格
                <span v-if="scope.row.conditions && scope.row.conditions[1]">
                  <el-input-number
                    v-model="scope.row.conditions[1].price"
                    :disabled="isUniPirce"
                    :min="0"
                    :controls="false"
                  />
                </span>
                <span v-else>——</span>
              </p>
              <p>
                佣金
                <span v-if="scope.row.conditions && scope.row.conditions[1]">
                  <el-input-number
                    v-model="scope.row.conditions[1].commission"
                    :min="0"
                    :controls="false"
                  />
                </span>
                <span v-else>——</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="续费条件三" width="90">
            <template slot-scope="scope">
              <p>
                价格
                <span v-if="scope.row.conditions && scope.row.conditions[2]">
                  <el-input-number
                    v-model="scope.row.conditions[2].price"
                    :disabled="isUniPirce"
                    :min="0"
                    :controls="false"
                  />
                </span>
                <span v-else>——</span>
              </p>
              <p>
                佣金
                <span v-if="scope.row.conditions && scope.row.conditions[2]">
                  <el-input-number
                    v-model="scope.row.conditions[2].commission"
                    :min="0"
                    :controls="false"
                  />
                </span>
                <span v-else>——</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="续费条件四" width="90">
            <template slot-scope="scope">
              <p>
                价格
                <span v-if="scope.row.conditions && scope.row.conditions[3]">
                  <el-input-number
                    v-model="scope.row.conditions[3].price"
                    :disabled="isUniPirce"
                    :min="0"
                    :controls="false"
                  />
                </span>
                <span v-else>——</span>
              </p>
              <p>
                佣金
                <span v-if="scope.row.conditions && scope.row.conditions[3]">
                  <el-input-number
                    v-model="scope.row.conditions[3].commission"
                    :min="0"
                    :controls="false"
                  />
                </span>
                <span v-else>——</span>
              </p>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="状态" width="70">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isOn" :disabled="statusDisabled" />
          </template>
        </el-table-column>
        <el-table-column v-show="!isOfferSetting" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              v-if="isOfferSetting"
              type="text"
              @click="onConditionSetting(scope.row.conditions, scope.row.id)"
              >条件设置</el-button
            >
            <template v-else>
              <el-button
                icon="el-icon-minus"
                circle
                size="mini"
                @click="onDeleteClick(scope.row.id)"
              />
              <el-button
                v-show="scope.$index === tableData.length - 1"
                icon="el-icon-plus"
                circle
                size="mini"
                @click="onAddClick"
              />
            </template>
          </template>
        </el-table-column>
      </template>
      <template v-if="isOfferSetting && offerType !== 'plan'">
        <el-table-column label="运营商官方报价">
          <template slot-scope="scope">{{ scope.row.officialPrice }}</template>
        </el-table-column>
        <el-table-column label="平台售价">
          <template slot-scope="scope">{{ scope.row.platformPrice }}</template>
        </el-table-column>
        <el-table-column label="销售底价">
          <template slot-scope="scope">{{ scope.row.saleBottomPrice }}</template>
        </el-table-column>
        <el-table-column label="销售报价">
          <template slot-scope="scope"
            ><el-input-number v-model="scope.row.price" :controls="false" :min="0"
          /></template>
        </el-table-column>
      </template>
    </el-table>
    <dialog-edit-condition
      v-if="isOfferSetting"
      :id="currentConditionId"
      :visible.sync="dialogEditCondition.visible"
      :content="rowData"
      @onConditionsChange="onConditionsChange"
      @updateTable="updateConditionTable"
    />
  </div>
</template>

<script>
import { round } from 'lodash'
import apis from '@/api/ajax'
import DialogEditCondition from './DialogEditCondition.vue'

const cnMap = ['零', '一', '二', '三', '四', '五']

// 判断span和spanList是否存在区间相交
// spanList: [[1,2], [3,6]]
// span: [2,4]
// return true
function isItersect(spanList, span) {
  let result = false
  for (let i = 0; i < spanList.length; i++) {
    if (
      (span[0] > spanList[i][0] && span[0] < spanList[i][1]) ||
      (span[1] > spanList[i][0] && span[1] < spanList[i][1]) ||
      (spanList[i][0] > span[0] && spanList[i][0] < span[1]) ||
      (spanList[i][1] > span[0] && spanList[i][1] < span[1])
    ) {
      result = true
      break
    }
  }
  return result
}

// 计算折扣百分比
function computeDiscount(price, base) {
  if (base === 0) {
    return 0
  }
  return round((price / base) * 100, 2)
}

function isNum(n) {
  return typeof n === 'number'
}

export default {
  components: {
    DialogEditCondition
  },
  props: {
    isUniPirce: {
      type: Boolean,
      required: true,
      default: false
    },
    offerPriceTable: {
      type: Array,
      required: true
    },
    isOfferSetting: {
      type: Boolean,
      required: false
    },
    data: {
      type: Object,
      required: true
    },
    // 报价类型
    offerType: {
      default: 'plan',
      type: String
    },
    statusDisabled: {
      type: Boolean
    },
    planListClone: {
      type: Array
    }
  },
  data() {
    return {
      currentConditionId: '',
      options: {
        activateTime: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      },
      isOnCopy: {},
      dialogEditCondition: {
        visible: false,
        content: {}
      },
      conditionsTable: [],
      rowData: []
    }
  },
  computed: {
    orgId() {
      return this.$route.query.orgId
    },
    tableData() {
      return this.offerPriceTable.map((row) => {
        return {
          ...row,
          platformDiscount: computeDiscount(row.platformPrice, row.officialPrice),
          saleBottomDiscount: computeDiscount(row.saleBottomPrice, row.officialPrice),
          saleRenewPriceDiscount: computeDiscount(row.saleRenewPrice, row.officialPrice)
        }
      })
    }
  },
  watch: {
    'tableData.length'() {
      this.onAddOrDelete()
    },
    dialogVisible(v) {
      if (v) {
        this.flag = false
        this.onAddOrDelete()
      }
    }
  },
  created() {
    if (!this.tableData.length) {
      this.onAddClick()
    } else {
      this.onAddOrDelete()
    }
  },
  methods: {
    isStepTimes(custom, system) {
      return custom > 0 && custom >= system && custom % system === 0
    },
    updateConditionTable(table) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === this.currentConditionId) {
          this.tableData[i].conditions = table
          break
        }
      }
    },
    resetTable() {
      this.tableData.splice(0, this.tableData.length)
      this.onAddClick()
    },
    getTableData() {
      return this.tableData
    },
    // 表格校验，确保所有行所有值都填好了
    validate() {
      let valid = true
      const isNumber = (n) => typeof n === 'number'
      if (this.isOfferSetting && this.offerType === 'plan') {
        for (let i = 0; i < this.tableData.length; i++) {
          if (
            !isNumber(this.tableData[i].orderSpanFrom) ||
            !isNumber(this.tableData[i].orderSpanTo) ||
            !isNumber(this.tableData[i].price)
          ) {
            valid = false
            this.msg('报价表存在未填写的值，请填写', 'error')
            break
          }
          if (
            this.tableData[i].orderSpanFrom % this.tableData[i].orderInterval ||
            this.tableData[i].orderSpanTo % this.tableData[i].orderInterval
          ) {
            valid = false
            this.msg('订购周期起止范围应均为订购间隔的整数倍', 'error')
            break
          }
          const conditions = this.tableData[i].conditions
          for (let j = 0; j < conditions.length; j++) {
            if (!isNumber(conditions[j].commission) || !isNumber(conditions[j].price)) {
              valid = false
              this.msg('报价表存在未填写的值，请填写', 'error')
              break
            }
          }
        }
      } else {
        if (this.offerType === 'plan') {
          for (let i = 0; i < this.tableData.length; i++) {
            const keys = Object.keys(this.tableData[i])
            for (let j = 0; j < keys.length; j++) {
              let key = keys[j]
              if (key !== 'isOn' && key !== 'id') {
                if (!this.tableData[i][key] && this.tableData[i][key] !== 0) {
                  valid = false
                  this.msg('报价表存在未填写的值，请填写', 'error')
                  break
                }
              }
            }
            if (
              this.tableData[i].orderSpanFrom % this.tableData[i].orderInterval ||
              this.tableData[i].orderSpanTo % this.tableData[i].orderInterval
            ) {
              valid = false
              this.msg('订购周期起止范围应均为订购间隔的整数倍', 'error')
              break
            }
          }
        } else {
          const row = this.tableData[0]
          if (
            isNum(row.officialPrice) &&
            isNum(row.platformPrice) &&
            isNum(row.platformDiscount) &&
            isNum(row.saleBottomPrice) &&
            isNum(row.saleBottomDiscount)
          ) {
            return true
          } else {
            this.msg('报价表存在未填写的值，请填写', 'error')
            return false
          }
        }
      }

      return valid
    },
    // 每一行，激活宽限期和订购限制不能都相同
    onActiveOrLimitChange(row, key) {
      // 判断该行的激活宽限期和订购限制都已填写完毕
      const isInteger = Number.isInteger
      if (
        isInteger(row.minActivateTime) &&
        isInteger(row.maxActivateTime) &&
        isInteger(row.orderInterval) &&
        isInteger(row.orderSpanTo) &&
        isInteger(row.orderSpanFrom)
      ) {
        const sameOrderLimitArr = []
        for (let i = 0; i < this.tableData.length; i++) {
          const currentRow = this.tableData[i]
          if (currentRow.id !== row.id) {
            if (
              currentRow.orderInterval === row.orderInterval &&
              currentRow.orderSpanTo === row.orderSpanTo &&
              currentRow.orderSpanFrom === row.orderSpanFrom
            ) {
              if (
                currentRow.minActivateTime === row.minActivateTime &&
                currentRow.maxActivateTime === row.maxActivateTime
              ) {
                row[key] = undefined
                this.msg('此参数报价已存在，请重新选择！', 'error')
                break
              }
              sameOrderLimitArr.push([currentRow.minActivateTime, currentRow.maxActivateTime])
            }
          }
        }
        if (isItersect(sameOrderLimitArr, [row.minActivateTime, row.maxActivateTime])) {
          row[key] = undefined
          this.msg('相同订购限制情况下，激活宽限期不可相交，请重新选择！', 'error')
        }
      }
    },
    cnNumMap(number) {
      return cnMap[parseInt(number) + 1]
    },
    onConditionsChange($event) {
      this.conditionsTable = $event
    },
    onConditionSetting(conditions, id) {
      this.currentConditionId = id
      this.dialogEditCondition.visible = true
      this.rowData = conditions ? JSON.parse(JSON.stringify(conditions)) : []
    },
    onDeleteClick(id) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === id && this.tableData.length > 1) {
          this.tableData.splice(i, 1)
          break
        }
      }
      this.onAddOrDelete()
    },
    onOfficialPriceChanged(row) {
      const officialPrice = row.officialPrice
      row.platformDiscount = computeDiscount(row.platformPrice, officialPrice)
      row.saleBottomDiscount = computeDiscount(row.saleBottomPrice, officialPrice)
      row.saleRenewPriceDiscount = computeDiscount(row.saleRenewPrice, officialPrice)
    },
    onPriceChanged(row, from, to) {
      const officialPrice = row.officialPrice
      if (!officialPrice) {
        row[to] = 0
      } else {
        row[to] = computeDiscount(row[from], row.officialPrice)
      }
    },
    onDiscountChanged(row, from, to) {
      const officialPrice = row.officialPrice
      if (!officialPrice) {
        row[to] = 0
      } else {
        row[to] = round((row[from] * row.officialPrice) / 100, 2)
      }
    },
    onAddOrDelete() {
      this.$emit(
        'onOfferPriceTableChanged',
        this.tableData.map((e, index) => index + 1)
      )
    },
    onAddClick() {
      const maxId = this.tableData.length ? this.tableData[this.tableData.length - 1].id : 0
      this.tableData.push({
        id: maxId + 1,
        minBuyCount: 1,
        buyCountStep: 1,
        minActivateTime: undefined,
        maxActivateTime: undefined,
        orderInterval: undefined,
        orderSpanFrom: undefined,
        orderSpanTo: undefined,
        officialPrice: undefined,
        platformPrice: undefined,
        platformDiscount: undefined,
        saleBottomPrice: undefined,
        saleBottomDiscount: undefined,
        saleRenewPrice: undefined,
        saleRenewPriceDiscount: undefined,
        isOn: false,
        isNew: true
      })
      this.onAddOrDelete()
    },
    submitCondtionsTable() {
      const params = {
        orgId: this.orgId,
        sysOfferId: this.data.id,
        conditions: this.conditionsTable
      }
      return apis.customer.updateCustomConditionPrice(params)
    },
    onGlobalIsOnToggled(v) {
      if (!v) {
        this.tableData.forEach((e) => {
          this.isOnCopy[e.id] = e.isOn
          e.isOn = false
        })
      } else {
        this.tableData.forEach((e) => {
          e.isOn = this.isOnCopy[e.id]
          for (let i = 0; i < this.planListClone.length; i++) {
            if (this.planListClone[i].id === e.id) {
              e.isOn = this.planListClone[i].status === 'on'
              break
            }
          }
        })
      }
    }
  }
}
</script>
