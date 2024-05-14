<template>
  <el-dialog
    title="新增运营商侧NB续费记录"
    :visible.sync="visible"
    width="30%"
    :before-close="beforeClose"
  >
    <el-form
      ref="form"
      label-width="120px"
      :model="formData"
      :rules="rules"
      :validate-on-rule-change="false"
    >
      <el-form-item label="运营商" props="carrier">
        <el-select v-model="formData.carrier" clearable placeholder="运营商" disabled>
          <el-option
            v-for="(key, val) in enums.carrier.maps()"
            :key="val"
            :label="key"
            :value="val"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运营商账号" class="account__item--long" prop="carrierAccountId">
        <wh-carrier-account-select
          v-model="formData.carrierAccountId"
          :carrier="formData.carrier"
          :list-filter="(list) => list.filter((item) => !!item.nbIoTAccount)"
          @change="onCarrierAccountChange"
        />
      </el-form-item>
      <el-form-item label="套餐类型" prop="chargeType">
        <el-select
          v-model="formData.chargeType"
          placeholder="套餐类型"
          clearable
          @change="onOfferTypeChange"
        >
          <el-option
            v-for="item in baseContent.offerTypeList"
            :key="item.chargeType + item.chargeEntryId"
            :label="item.chargeTypeName"
            :value="item.chargeType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="套餐规格" prop="chargeCategoryId">
        <el-select v-model="formData.chargeCategoryId" placeholder="请选择套餐规格">
          <el-option
            v-for="item in chooseType.chargeTypeDetailVOS"
            :key="item.id"
            :value="item.id"
            :label="specificationFormat(item)"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="ICCID" prop="iccids">
        <el-input v-model="formData.iccids" rows="6" type="textarea" />
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
import { maxIccidLength } from './mixins/const'
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select'
import volumeFormat from '@/global/filters/volume-format'

export default {
  components: {
    whCarrierAccountSelect
  },
  mixins: [toolsMixin],
  data() {
    return {
      visible: false,
      maxIccidLength,
      formData: {
        carrier: 'cmcc',
        chargeType: '',
        chargeCategoryId: '',
        carrierAccountId: '',
        iccids: ''
      },
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
        chargeType: [{ required: true, message: '请选择套餐类型', trigger: 'change' }],
        chargeCategoryId: [{ required: true, message: '请选择套餐规格', trigger: 'change' }],
        carrierAccountId: [{ required: true, message: '请选择运营商账号', trigger: 'change' }],
        iccids: [{ required: true, message: '请输入iccid', trigger: 'blur' }]
      }
    },
    chooseType() {
      let offer = this.baseContent.offerTypeList
      if (offer && offer.length) {
        return (
          this.baseContent.offerTypeList.find((e) => e.chargeType === this.formData.chargeType) ||
          {}
        )
      }
      return {}
    }
  },
  methods: {
    close() {
      this.$refs.form && this.$refs.form.resetFields()
      this.carrierChargeId = ''
      this.baseContent = {}
      this.visible = false
    },
    beforeClose(done) {
      this.close()
      done()
    },
    specificationFormat(obj) {
      let format = volumeFormat
      let unit = () => '月'
      if (this.chooseType.chargeType === 'CUSTOM') unit = (i) => `${i}个月`
      if (obj.chargeUnit === 'USE_COUNT_AS_VOLUME') format = (i) => `${i}次`
      return `${format(obj.chargeSpecification)}/${unit(obj.chargeValidity)} * ${obj.cardPeriod}`
    },
    onOfferTypeChange() {
      this.formData.chargeCategoryId = ''
    },
    async onCarrierAccountChange(value, record) {
      this.carrierChargeId = record ? record.carrierChargeId : ''

      this.formData.chargeType = ''
      this.formData.chargeCategoryId = ''
      await this.getCarrierConfig()
    },
    async getCarrierConfig() {
      if (!this.carrierChargeId) {
        this.baseContent = {}
        return
      }
      this.loading = true
      let rst = await this.jaxLib.financial.getChargeByCarrierId({
        chargeId: this.carrierChargeId,
        carrier: this.formData.carrier
      })
      this.loading = false
      if (!rst.success) return false
      this.baseContent = rst.data
    },
    open() {
      this.visible = true
    },
    // 提交保存
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        console.log('🎸 szy_164 add.vue 👉', this.formData)
        let rst = await this.jaxLib.store.carrierRechargeRecordSave({
          ...this.formData,
          iccids: iccidsTransfer(this.formData.iccids).join()
        })
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
