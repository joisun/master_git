<template>
  <el-dialog title="预定卡片" :visible.sync="visible" :before-close="beforeClose">
    <el-form
      ref="form"
      label-width="150px"
      :model="formData"
      :rules="rules"
      :validate-on-rule-change="false"
    >
      <el-form-item label="运营商" props="carrier">
        <el-select
          v-model="formData.carrier"
          :disabled="disabledSome"
          clearable
          placeholder="运营商"
          @change="onCarrierChange"
        >
          <el-option
            v-for="(key, val) in enums.carrier.maps()"
            :key="val"
            :label="key"
            :value="val"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否指定所属运营商" prop="hasSignCarrierId">
        <el-radio-group v-model="formData.hasSignCarrierId" :disabled="disabledSome">
          <el-radio label="0">不指定，满足需求即可</el-radio>
          <el-radio label="1">指定</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="formData.hasSignCarrierId === '1'"
        label="所属运营商"
        prop="signCarrierId"
      >
        <el-select
          v-model="formData.signCarrierId"
          placeholder="请选择所属运营商"
          clearable
          :disabled="disabledSome"
        >
          <el-option
            v-for="item in signedCarrierList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="网络类型" prop="netType">
        <el-radio-group v-model="formData.netType" :disabled="disabledSome">
          <el-radio v-for="item in NET_TYPE_EMUN_LIST" :key="item.value" :label="item.value">{{
            item.label
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="材质（可多选）" prop="material">
        <el-checkbox-group v-model="formData.material" :disabled="disabledSome">
          <el-checkbox v-for="item in MATERIAL_EMUN_LIST" :key="item.value" :label="item.value">{{
            item.label
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="规格（可多选）" prop="specification">
        <el-checkbox-group v-model="formData.specification" :disabled="disabledSome">
          <el-checkbox v-for="item in SPEC_EMNU_LIST" :key="item.value" :label="item.value">{{
            item.label
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="合规管控" prop="control">
        <el-checkbox-group v-model="formData.control">
          <el-checkbox
            v-for="item in CONTROL_EMUN_LIST"
            :key="item.value"
            :label="item.value"
            name="specification"
          >
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="价格满足交期满足" prop="underwritingWill">
        <el-radio-group v-model="formData.underwritingWill">
          <el-radio label="will">愿意包销</el-radio>
          <el-radio label="unWill">不愿意包销</el-radio>
          <el-radio label="donotwill">把握度高，但不想包销</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预定数量" prop="reserveNum">
        <el-input-number v-model="formData.reserveNum" />
      </el-form-item>
      <el-form-item label="客户套餐" prop="customerPackage">
        <el-input v-model="formData.customerPackage" />
      </el-form-item>
      <el-form-item label="售卖价格" prop="salePrice">
        <el-input v-model="formData.salePrice" />
      </el-form-item>
      <el-form-item label="到货时间" prop="arrivalTime">
        <el-date-picker
          v-model="formData.arrivalTime"
          :clearable="false"
          type="date"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" row="6" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="onSubmit"> 提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'
import { toolsMixin } from '@/global/mixins/table-selection'
import {
  CONTROL_EMUN,
  CONTROL_EMUN_LIST,
  MATERIAL_EMUN,
  MATERIAL_EMUN_LIST,
  NET_TYPE_EMUN_LIST,
  SPEC_EMNU,
  SPEC_EMNU_LIST
} from '@/page/manage/children/store/children/inventory-reservation/constants'
import dateFormat from '@/global/filters/date-format'
const DEFAULT_FORM_OBJ = JSON.stringify({
  carrier: '', // 运营商
  signCarrierId: '', // 所属运营商
  netType: '', // 网络类型
  material: [], // 材质
  specification: [], // 规格
  control: [], // 合规管控
  underwritingWill: '', // 价格满足交期满足
  reserveNum: undefined, // 预定数量
  customerPackage: '', // 客户套餐
  arrivalTime: '', // 到货时间
  remark: '', // 备注
  salePrice: '', // 售卖价格
  hasSignCarrierId: '0'
})
export default {
  mixins: [toolsMixin],
  data() {
    return {
      CONTROL_EMUN_LIST,
      CONTROL_EMUN,
      NET_TYPE_EMUN_LIST,
      MATERIAL_EMUN,
      SPEC_EMNU,
      MATERIAL_EMUN_LIST,
      SPEC_EMNU_LIST,
      signedCarrierList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      disabledSome: false,
      visible: false,
      formData: JSON.parse(DEFAULT_FORM_OBJ),
      success: [],
      isLoading: false,
      data: {},
      baseContent: {},
      carrierChargeId: ''
    }
  },
  computed: {
    rules() {
      return {
        carrier: [{ required: true, message: '请选择运营商' }],
        hasSignCarrierId: [{ required: true, message: '请选择是否指定所属运营商' }],
        signCarrierId: [{ required: true, message: '请选择所属运营商' }],
        netType: [{ required: true, message: '请选择网络类型' }],
        material: [{ required: true, message: '请选择材质' }],
        specification: [{ required: true, message: '请选择规格' }],
        control: [{ required: true, message: '请选择合规管控' }],
        underwritingWill: [{ required: true, message: '请选择价格满足交期满足' }],
        reserveNum: [{ required: true, message: '请输入预定数量' }],
        customerPackage: [{ required: true, message: '请输入客户套餐' }],
        salePrice: [{ required: true, message: '请输入售卖价格' }],
        arrivalTime: [{ required: true, message: '请输入到货时间' }],
        remark: [{ required: true, message: '请输入备注' }]
      }
    }
  },
  methods: {
    close() {
      this.formData = JSON.parse(DEFAULT_FORM_OBJ)
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
      this.visible = false
    },
    beforeClose() {
      this.close()
    },
    onCarrierChange() {
      this.signedCarrierList = []
      this.getSignedCarrierList()
    },
    async getSignedCarrierList() {
      if (!this.formData.carrier) return false
      let res = await this.jaxLib.store.signedCarrierListGet({ carrier: this.formData.carrier })
      if (!res.success) return false
      this.signedCarrierList = res.data
    },
    open(content) {
      this.content = content
      this.disabledSome = false
      if (content) {
        const { carrier, signCarrierId, material, specification, netType } = content
        const reg = /(4G)?(5G)?(NB)?/g
        const netTypes = (netType.match(reg) || []).filter((item) => !!item)
        this.formData = {
          ...this.formData,
          carrier: carrier,
          signCarrierId: signCarrierId,
          hasSignCarrierId: signCarrierId ? '1' : '0',
          material: [material],
          netType: netTypes.length > 1 || netTypes.length === 0 ? '4G' : netTypes[0],
          specification: [specification]
        }
        this.disabledSome = true
        this.getSignedCarrierList()
      }
      this.visible = true
    },
    // 提交保存
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        const {
          carrier,
          signCarrierId,
          netType,
          material,
          specification,
          control,
          underwritingWill,
          reserveNum,
          customerPackage,
          arrivalTime,
          remark,
          salePrice,
          hasSignCarrierId
        } = this.formData
        const params = {
          carrier,
          signCarrierId,
          netType,
          material: material.join(),
          specification: specification.join(),
          control: control.join(),
          underwritingWill,
          reserveNum,
          customerPackage,
          arrivalTime: dateFormat(arrivalTime, 'YYYY-MM-DD'),
          remark,
          salePrice
        }
        if (!hasSignCarrierId) {
          delete params.signCarrierId
        }
        let rst = await this.jaxLib.store.inventoryReserve(params)
        if (rst.success) {
          this.$message.success('操作成功！')
          this.$emit('confirm')
          this.close()
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
