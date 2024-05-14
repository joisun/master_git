<template>
  <el-form ref="form" :model="formData" label-width="120px" :rules="rules">
    <template v-if="!isFlowTypeFirst">
      <el-form-item label="OA审批单号" prop="spOrder">
        <el-input
          v-model="formData.spOrder"
          :disabled="viewOnly"
          style="width: 300px"
          @change="sqOrderChange"
        />
      </el-form-item>
      <el-form-item label="甲方" prop="firstParty">
        <first-party-input
          v-model="formData.firstParty"
          :org-id="formData.orgId"
          :disabled="viewOnly || isFlowTypeFirst"
          @select="onFirstPartySelect"
        />
      </el-form-item>
      <el-form-item label="乙方" prop="myCompany">
        <el-select
          v-model="formData.myCompany"
          clearable
          style="width: 300px"
          placeholder="请选择乙方"
          :disabled="viewOnly || isFlowTypeFirst"
        >
          <el-option
            v-for="item in secondPartyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合同签订日期" prop="signDate">
        <el-date-picker
          v-model="formData.signDate"
          type="date"
          placeholder="选择日期"
          :disabled="viewOnly || isFlowTypeFirst"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="合同盖章要求" prop="requirementsForContract">
        <el-select
          v-model="formData.requirementsForContract"
          clearable
          style="width: 300px"
          placeholder="请选择合同盖章要求"
          :disabled="viewOnly"
        >
          <el-option
            v-for="item in REQ_FOR_ATTACH_CONTRACT_LIST"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="谁先寄出" prop="sendFirst">
        <el-select
          v-model="formData.sendFirst"
          style="width: 300px"
          clearable
          placeholder="请选择谁先寄出"
          :disabled="viewOnly || isFlowTypeFirst"
        >
          <el-option
            v-for="item in sendFirstOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收件人信息" prop="deliveryAddress">
        <el-input
          v-model="formData.deliveryAddress"
          style="width: 300px"
          type="textarea"
          rows="6"
          :disabled="viewOnly || isFlowTypeFirst"
        />
      </el-form-item>
      <el-form-item label="合同盖章备注" prop="requirementsForContractRemark">
        <el-input
          v-model="formData.requirementsForContractRemark"
          type="textarea"
          style="width: 300px"
          rows="4"
          :disabled="viewOnly"
        />
      </el-form-item>
    </template>
    <div>
      <el-collapse
        v-show="formData.attatchContracts.length > 0"
        v-model="activeNames"
        @change="onExpandChange"
      >
        <el-collapse-item
          v-for="(contact, index) in formData.attatchContracts"
          :key="index"
          :name="index"
        >
          <template #title>
            <span>{{ isInIntl ? '附件合同-国际卡' : '附件合同-国内卡' }} {{ index + 1 }}</span>
            <el-button
              v-if="!viewOnly"
              type="text"
              style="margin-left: 20px"
              @click="handleDelete(index)"
              >删除</el-button
            >
          </template>
          <el-form-item
            class="shopping-list-table-form"
            :prop="'attatchContracts.' + index + '.attachInfoList'"
            label-width="0"
            label=""
          >
            <shopping-list-table
              :view-only="viewOnly"
              :parent-index="index"
              :list="formData.attatchContracts[index].list"
              :headers="formData.attatchContracts[index].headers"
              @change="(list) => onShopingListChange(list, index)"
            />
          </el-form-item>
          <el-form-item
            v-if="!isFlowTypeRecharge"
            label="交货方式"
            :prop="'attatchContracts.' + index + '.deliveryMethod'"
            :rules="{ required: true, message: '请选择交货方式', trigger: 'submit' }"
          >
            <el-radio-group
              v-model="formData.attatchContracts[index].deliveryMethod"
              :disabled="viewOnly"
            >
              <el-radio label="快递">快递</el-radio>
              <el-radio label="自提">自提</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="!isFlowTypeRecharge && formData.attatchContracts[index].deliveryMethod === '快递'"
            label="交货地址"
            :prop="'attatchContracts.' + index + '.deliveryAddress'"
            :rules="{ required: true, message: '请选择交货地址', trigger: 'submit' }"
          >
            <el-input
              v-model="formData.attatchContracts[index].deliveryAddress"
              style="width: 300px"
              type="textarea"
              rows="4"
              :disabled="viewOnly"
            />
          </el-form-item>
          <el-form-item
            v-if="!isFlowTypeRecharge && formData.attatchContracts[index].deliveryMethod === '快递'"
            label="运费"
            :prop="'attatchContracts.' + index + '.freight'"
            :rules="{ required: true, message: '请输入运费', trigger: 'submit' }"
          >
            <el-input-number
              v-model="formData.attatchContracts[index].freight"
              :controls="false"
              style="width: 300px"
              :precision="2"
              :step="0.1"
              :min="0"
              :disabled="viewOnly"
              @change="handleFreightChange(index)"
            />
            元
          </el-form-item>
          <el-form-item
            label="采购款合计"
            :prop="'attatchContracts.' + index + '.totalPurchasePayment'"
          >
            {{ formData.attatchContracts[index].totalPurchasePayment }}

            元 (<span
              >大写:
              {{
                formatRMB(
                  formData.attatchContracts[index].totalPurchasePayment
                    ? +formData.attatchContracts[index].totalPurchasePayment
                    : ''
                ).value
              }}</span
            >)(税率6%)
          </el-form-item>
          <el-form-item
            label="业务"
            style="width: 300px"
            :prop="'attatchContracts.' + index + '.business'"
            :rules="{ required: true, message: '请输入业务', trigger: 'submit' }"
          >
            <el-input
              v-model="formData.attatchContracts[index].business"
              style="width: 200px"
              :disabled="viewOnly"
            />
          </el-form-item>
          <el-form-item
            label="备注"
            :prop="'attatchContracts.' + index + '.remark'"
            :rules="{ required: true, message: '请输入备注', trigger: 'submit' }"
          >
            <el-input
              v-model="formData.attatchContracts[index].remark"
              style="width: 300px"
              type="textarea"
              rows="4"
              :disabled="viewOnly"
            />
          </el-form-item>
          <el-form-item label="付款模式"> 预付费，乙方收到全额货款后发货 </el-form-item>
        </el-collapse-item>
      </el-collapse>

      <el-button
        v-if="!viewOnly"
        style="margin: 15px 0 30px"
        type="primary"
        size="mini"
        icon="el-icon-plus"
        @click="handleAdd"
        >添加附加合同</el-button
      >
    </div>
  </el-form>
</template>
<script>
import ShoppingListTable, {
  DETAULT_ITEM_FORM,
  INTL_DETAULT_ITEM_FORM
} from '@/page/manage/children/client/children/template-contract/components/shopping-list-table'
import formatRMB from 'format-rmb'
import FirstPartyInput from '@/page/manage/children/client/children/template-contract/components/first-party-input'
import { safeGet } from '@/global/function/safe-operations'
import Mixins from '@/page/manage/children/client/children/template-contract/mixins/consts'
import {
  BUSSNESS_SCOPE_TYPE_1,
  BUSSNESS_SCOPE_TYPE_2
} from '@/page/manage/children/client/children/template-contract/mixins/consts'

const DEFAULT_HEADERS = JSON.stringify([
  {
    name: '产品名称',
    value: 'productName'
  },
  {
    name: '运营商',
    value: 'carrier'
  },
  {
    name: '流量套餐',
    value: 'dataPlan'
  },
  {
    name: '沉默期(月)',
    value: 'silent'
  },
  {
    name: '采购周期(份)',
    value: 'purchaseCycle'
  },
  {
    name: '',
    value: 'custom1',
    isCustom: true
  },
  {
    name: '',
    value: 'custom2',
    isCustom: true
  },
  {
    name: '采购数量(张)',
    value: 'purchaseNum'
  },
  {
    name: '产品单价(元)',
    value: 'unitPrice'
  },
  {
    name: '单卡卡费(元/张)',
    value: 'cardFee'
  },
  {
    name: '合计(元)',
    value: 'subTotal'
  },
  {
    name: '操作',
    value: 'action'
  }
])
const DEFAULT_HEADERS_RECHARGE = JSON.stringify([
  {
    name: '产品名称',
    value: 'productName'
  },
  {
    name: '运营商',
    value: 'carrier'
  },
  {
    name: '流量套餐',
    value: 'dataPlan'
  },
  {
    name: '沉默期(月)',
    value: 'silent'
  },
  {
    name: '续费周期(份)',
    value: 'purchaseCycle'
  },
  {
    name: '',
    value: 'custom1',
    isCustom: true
  },
  {
    name: '',
    value: 'custom2',
    isCustom: true
  },
  {
    name: '续费数量(张)',
    value: 'purchaseNum'
  },
  {
    name: '产品单价(元)',
    value: 'unitPrice'
  },
  {
    name: '合计(元)',
    value: 'subTotal'
  },
  {
    name: '操作',
    value: 'action'
  }
])
const DEFAULT_HEADERS_INTL = JSON.stringify([
  {
    name: '产品名称',
    value: 'productName'
  },
  {
    name: '地区(代码)',
    value: 'countryCode'
  },
  {
    name: '流量套餐',
    value: 'dataPlan'
  },
  {
    name: '测试期(月)',
    value: 'test'
  },
  {
    name: '沉默期(月)',
    value: 'silent'
  },
  {
    name: '卡费(元/张)',
    value: 'cardFee'
  },
  {
    name: '采购数量(张)',
    value: 'purchaseNum'
  },
  {
    name: '',
    value: 'custom1',
    isCustom: true
  },
  {
    name: '产品单价(元)',
    value: 'unitPrice'
  },
  {
    name: '合计(元)',
    value: 'subTotal'
  },
  {
    name: '操作',
    value: 'action'
  }
])

const COMMON_DEFAULT_ATTACH_CONTRACT_ITEM = {
  list: [JSON.parse(DETAULT_ITEM_FORM)],
  deliveryMethod: '快递',
  totalPurchasePayment: undefined,
  remark: '',
  deliveryDate: undefined,
  deliveryAddress: '',
  business: '',
  freight: undefined
}
// 附件合同
const DEFAULT_ATTACH_CONTRACT_ITEM = JSON.stringify({
  ...COMMON_DEFAULT_ATTACH_CONTRACT_ITEM,
  headers: JSON.parse(DEFAULT_HEADERS)
})
// 续费合同
const DEFAULT_ATTACH_CONTRACT_ITEM_RECHARGE = JSON.stringify({
  ...COMMON_DEFAULT_ATTACH_CONTRACT_ITEM,
  headers: JSON.parse(DEFAULT_HEADERS_RECHARGE)
})

// 国际卡合同
const DEFAULT_ATTACH_CONTRACT_ITEM_INTL = JSON.stringify({
  ...{
    ...COMMON_DEFAULT_ATTACH_CONTRACT_ITEM,
    list: [JSON.parse(INTL_DETAULT_ITEM_FORM)]
  },
  headers: JSON.parse(DEFAULT_HEADERS_INTL)
})
const COMMON_DEFAULT_FORM_DATA = {
  spOrder: '',
  myCompany: '',
  firstParty: '',
  sendFirst: '',
  signDate: '',
  type: '',
  orgId: '',
  deliveryAddress: '',
  requirementsForContract: '', // 合同盖章要求,
  requirementsForContractRemark: ''
}
const DEFAULT_FORM_DATA = JSON.stringify({
  ...COMMON_DEFAULT_FORM_DATA,
  attatchContracts: [JSON.parse(DEFAULT_ATTACH_CONTRACT_ITEM)]
})
const RECHARGE_DEFAULT_FORM_DATA = JSON.stringify({
  ...COMMON_DEFAULT_FORM_DATA,
  attatchContracts: [JSON.parse(DEFAULT_ATTACH_CONTRACT_ITEM_RECHARGE)]
})
const INTL_DEFAULT_FORM_DATA = JSON.stringify({
  ...COMMON_DEFAULT_FORM_DATA,
  attatchContracts: [JSON.parse(DEFAULT_ATTACH_CONTRACT_ITEM_INTL)]
})
export default {
  components: {
    ShoppingListTable,
    FirstPartyInput
  },
  mixins: [Mixins],
  props: {
    businessScope: {
      type: String,
      require: true,
      default: ''
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    flowType: {
      type: String,
      require: true,
      default: ''
    },
    attachContractAlias: {
      type: Object,
      require: true,
      default: () => {}
    },
    viewOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formatRMB,
      orgNameList: [],
      formData: JSON.parse(DEFAULT_FORM_DATA),
      rules: {
        spOrder: {
          required: true,
          message: '请输入审批单号',
          trigger: 'submit'
        },
        requirementsForContract: {
          required: true,
          message: '请选择合同盖章要求',
          trigger: 'submit'
        },
        firstParty: {
          required: true,
          message: '请输入甲方',
          trigger: 'submit'
        },
        myCompany: {
          required: true,
          message: '请选择乙方',
          trigger: 'submit'
        },
        signDate: {
          required: true,
          message: '请选择合同签订日期',
          trigger: 'submit'
        },
        sendFirst: {
          required: true,
          message: '请选择谁先寄出',
          trigger: 'submit'
        },
        deliveryAddress: {
          required: true,
          message: '请输入收件人信息',
          trigger: 'submit'
        }
      },
      activeNames: []
    }
  },
  computed: {
    schemaByType() {
      return {
        framework: {
          contactItem: DEFAULT_ATTACH_CONTRACT_ITEM,
          restFormData: DEFAULT_FORM_DATA,
          secondPartyOptions: this.secondPartyOptions1,
          sendFirstOptions: this.sendFirstOptions1
        },
        attach: {
          contactItem: DEFAULT_ATTACH_CONTRACT_ITEM,
          restFormData: DEFAULT_FORM_DATA,
          secondPartyOptions: this.secondPartyOptions2,
          sendFirstOptions: this.sendFirstOptions2
        },
        attach_recharge: {
          contactItem: DEFAULT_ATTACH_CONTRACT_ITEM_RECHARGE,
          restFormData: RECHARGE_DEFAULT_FORM_DATA,
          secondPartyOptions: this.secondPartyOptions2,
          sendFirstOptions: this.sendFirstOptions2
        },
        attach_intl: {
          contactItem: DEFAULT_ATTACH_CONTRACT_ITEM_INTL,
          restFormData: INTL_DEFAULT_FORM_DATA,
          secondPartyOptions: this.secondPartyOptions2,
          sendFirstOptions: this.sendFirstOptions2
        }
      }
    },
    isInIntl() {
      return this.flowType === 'attach_intl' || this.businessScope === BUSSNESS_SCOPE_TYPE_1.intl
    },
    isFlowTypeFirst() {
      return this.flowType === 'framework'
    },
    isFlowTypeRecharge() {
      return this.flowType === 'attach_recharge'
    },
    secondPartyOptions() {
      // return this.isFlowTypeFirst ? this.secondPartyOptions1 : this.secondPartyOptions2
      return this.schemaByType[this.flowType].secondPartyOptions
    },
    sendFirstOptions() {
      // return this.isFlowTypeFirst ? this.sendFirstOptions1 : this.sendFirstOptions2
      return this.schemaByType[this.flowType].sendFirstOptions
    }
  },
  watch: {
    'attachContractAlias.firstParty'(newValue, oldValue) {
      if (!this.isFlowTypeFirst) return
      this.updateByParent(newValue, oldValue, 'firstParty')
    },
    'attachContractAlias.orgId'(newValue, oldValue) {
      if (!this.isFlowTypeFirst) return
      this.updateByParent(newValue, oldValue, 'orgId')
    },
    'attachContractAlias.myCompany'(newValue, oldValue) {
      if (!this.isFlowTypeFirst) return
      this.updateByParent(newValue, oldValue, 'myCompany')
    },
    'attachContractAlias.secondParty'(newValue, oldValue) {
      if (!this.isFlowTypeFirst) return
      this.updateByParent(newValue, oldValue, 'secondParty')
    },
    'attachContractAlias.signDate'(newValue, oldValue) {
      if (!this.isFlowTypeFirst) return
      this.updateByParent(newValue, oldValue, 'signDate')
    },
    'attachContractAlias.sendFirst'(newValue, oldValue) {
      if (!this.isFlowTypeFirst) return
      this.updateByParent(newValue, oldValue, 'sendFirst')
    },
    'attachContractAlias.deliveryAddress'(newValue, oldValue) {
      if (!this.isFlowTypeFirst) return
      this.updateByParent(newValue, oldValue, 'deliveryAddress')
    },
    'attachContractAlias.freight'(newValue, oldValue) {
      if (!this.isFlowTypeFirst) return
      this.updateByParent(newValue, oldValue, 'freight')
    },
    'attachContractAlias.requirementsForContract'(newValue, oldValue) {
      if (!this.isFlowTypeFirst) return
      this.updateByParent(newValue, oldValue, 'requirementsForContract')
    },
    'attachContractAlias.requirementsForContractRemark'(newValue, oldValue) {
      if (!this.isFlowTypeFirst) return
      this.updateByParent(newValue, oldValue, 'requirementsForContractRemark')
    },
    flowType: {
      immediate: true,
      handler(newValue) {
        if (!this.isAdd) return
        if (newValue === 'attach_recharge' || newValue === 'attach_intl') {
          this.formData = this.getRestFormData(newValue)
          return
        }
        if (newValue === 'framework') {
          this.formData.attatchContracts = []
          return
        }
        this.formData.attatchContracts = [JSON.parse(DEFAULT_ATTACH_CONTRACT_ITEM)]
      }
    }
  },
  methods: {
    async validate() {
      if (!this.isFlowTypeFirst && this.formData.attatchContracts.length === 0) {
        this.$message.error('请至少添加一份附件合同')
        return Promise.reject(false)
      }
      await this.$refs.form.validate()
    },
    getRestFormData(flowType) {
      console.log(
        '🎸 DEBUG_641 attach-contract.vue 👉',
        this.businessScope,
        this.BUSSNESS_SCOPE_TYPE_1.intl,
        this.flowType
      )
      if (this.businessScope === this.BUSSNESS_SCOPE_TYPE_1.intl) {
        return JSON.parse(this.schemaByType['attach_intl'].restFormData)
      }
      return JSON.parse(this.schemaByType[flowType].restFormData)
    },
    reset() {
      this.$refs.form.clearValidate()
      this.formData = this.getRestFormData(this.flowType)
    },
    handleAdd() {
      // 如果业务范围为国际卡，这只能添加国际卡
      if (this.businessScope === this.BUSSNESS_SCOPE_TYPE_1.intl) {
        this.formData.attatchContracts.push({
          ...JSON.parse(this.schemaByType['attach_intl'].contactItem)
        })
        return
      }
      this.formData.attatchContracts.push({
        ...JSON.parse(this.schemaByType[this.flowType].contactItem)
      })
    },
    handleDelete(index) {
      const { attatchContracts } = this.formData
      this.formData.attatchContracts = attatchContracts.filter((_, i) => i !== index)
    },
    async sqOrderChange(value) {
      this.formData = {
        ...this.formData,
        orgId: '',
        firstParty: '',
        myCompany: '',
        deliveryAddress: '',
        sendFirst: ''
      }
      if (!value) return
      const res = await this.jaxLib.customer.oaContract.getSpInfo({
        spOrder: this.formData.spOrder
      })
      const contents = safeGet(res, 'data.apply_data.contents', [])
      const mapper = {
        客户ID: 'orgId',
        对方单位名称: 'firstParty',
        我方公司: 'myCompany',
        收件人信息: 'deliveryAddress',
        谁先寄出: 'sendFirst',
        行业应用: 'business'
      }
      contents
        .filter((item) => ['Textarea', 'Selector', 'Text'].includes(item.control))
        .map((item) => {
          return {
            title: item.title[0].text,
            value:
              item.control === 'Selector'
                ? this.optionMapper[item.value.selector.options[0].key]
                : item.value.text
          }
        })
        .forEach((item) => {
          if (!mapper[item.title]) return
          this.formData[mapper[item.title]] = item.value
        })
    },
    updateByParent(newValue, oldValue, field) {
      if (oldValue === this.formData[field] || !this.formData[field]) {
        this.formData[field] = newValue
      }
    },
    setFormData(data) {
      this.formData = {
        ...this.formData,
        ...data,
        attatchContracts: data.list
      }
    },
    getFormData() {
      let attatchContracts = safeGet(this.formData, 'attatchContracts', [])
      attatchContracts = attatchContracts.map((item) => {
        // 兼容老数据, 需要要增加一个采购周期，但是国际卡不需要
        if (!this.isInIntl && item.headers.findIndex((h) => h.value === 'purchaseCycle') === -1) {
          item.headers = item.headers.filter((item) => item.value !== 'index')
          item.headers.splice(4, 0, {
            name: '采购周期',
            value: 'purchaseCycle'
          })
        }
        return {
          ...item,
          productInfo: JSON.stringify({
            list: item.list,
            headers: item.headers
          })
        }
      })
      let accounts = this.bankAccounts
      let businessScope = ''
      if (this.isFlowTypeFirst) {
        businessScope = this.businessScope
      } else if (this.flowType === 'attach_intl') {
        businessScope = BUSSNESS_SCOPE_TYPE_2.intl
      } else {
        businessScope = BUSSNESS_SCOPE_TYPE_2.domestic
      }
      if (this.isInIntl) {
        accounts = this.bankAccountsIntl
      }
      console.log('🎸 DEBUG_755 attach-contract.vue 👉', attatchContracts)
      return Object.assign(this.formData, {
        attatchContracts,
        businessScope,
        bankAccount: accounts[this.formData.myCompany]
      })
    },
    onFirstPartySelect(data) {
      const { id } = data
      this.formData = {
        ...this.formData,
        orgId: id
      }
    },
    onExpandChange() {},
    onShopingListChange(list, index) {
      this.formData.attatchContracts[index].totalPurchasePayment = (
        list.reduce((x, y) => {
          return x + (y.subTotal || 0)
        }, 0) + (this.formData.attatchContracts[index].freight || 0)
      ).toFixed(2)
      this.formData.attatchContracts[index].list = list
    },
    handleFreightChange(index) {
      this.formData.attatchContracts[index].totalPurchasePayment = (
        this.formData.attatchContracts[index].list.reduce((x, y) => {
          return x + (y.subTotal || 0)
        }, 0) + (this.formData.attatchContracts[index].freight || 0)
      ).toFixed(2)
    }
  }
}
</script>
<style lang="scss" scoped>
.attach-contract-collapse-wrap {
  margin-top: 50px;
}
</style>
