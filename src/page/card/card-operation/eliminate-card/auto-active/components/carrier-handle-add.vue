<script>
import WhCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
import volumeFormat from '@/global/filters/volume-format'
export default {
  components: {
    WhCarrierAccountSelect
  },
  data() {
    return {
      formRules: {
        carrier: [{ required: true, message: '请选择运营商', trigger: 'change' }],
        carrierAccountId: [{ required: true, message: '请选择运营商账号', trigger: 'change' }],
        chargeType: [{ required: true, message: '请选择套餐类型', trigger: 'change' }],
        chargeId: [{ required: true, message: '请选择套餐规格', trigger: 'change' }]
      },
      formData: {
        chargeType: '',
        carrierAccountId: '',
        carrier: '',
        chargeId: ''
      },
      carrierChargeId: '',
      baseContent: {},
      visible: false
    }
  },
  computed: {
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
    chargetTypeChange() {
      this.formData.chargeId = ''
    },
    specificationFormat(obj) {
      let format = volumeFormat
      let unit = () => '月'
      if (this.chooseType.chargeType === 'CUSTOM') unit = (i) => `${i}个月`
      if (obj.chargeUnit === 'USE_COUNT_AS_VOLUME') format = (i) => `${i}次`
      return `${format(obj.chargeSpecification)}/${unit(obj.chargeValidity)} * ${obj.cardPeriod}`
    },
    cancel() {
      this.formData = {
        chargeType: '',
        carrierAccountId: '',
        carrier: '',
        chargeId: ''
      }
      this.baseContent = {}
      this.chooseType = {}
      this.$refs.form.resetFields()
      this.visible = false
    },
    open() {
      this.visible = true
    },
    async carrierAccountChange(i, item) {
      this.carrierChargeId = item && item.carrierChargeId
      await this.getCarrierConfig()
    },
    carrierChange() {
      this.baseContent = {}
    },
    async getCarrierConfig() {
      this.loading = true
      if (!this.formData.carrier || !this.carrierChargeId) {
        this.baseContent = {}
        return
      }
      let rst = await this.jaxLib.financial.getChargeByCarrierId({
        carrier: this.formData.carrier,
        chargeId: this.carrierChargeId
      })
      this.loading = false
      if (!rst.success) return false
      this.baseContent = rst.data
    },
    async submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = await this.jaxLib.card.autoActive.insertRule({
            ...this.formData
          })
          if (res && res.success) {
            this.$message.success('操作成功')
            this.$emit('confirm')
            this.cancel()
            this.visible = false
          }
        }
      })
    }
  }
}
</script>

<template>
  <el-dialog
    :visible.sync="visible"
    title="新增"
    width="500px"
    :close-on-click-modal="false"
    append-to-body
    :before-close="cancel"
  >
    <el-form ref="form" :model="formData" label-width="120px" :rules="formRules">
      <el-form-item label="运营商" prop="carrier">
        <el-select v-model="formData.carrier" placeholder="选择运营商" @change="carrierChange">
          <el-option
            v-for="(key, val) in enums.carrier.maps()"
            :key="val"
            :label="key"
            :value="val"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运营商账号" prop="carrierAccountId">
        <wh-carrier-account-select
          v-model="formData.carrierAccountId"
          placeholder="选择运营商账号"
          :carrier="formData.carrier"
          @change="carrierAccountChange"
        />
      </el-form-item>
      <el-form-item label="套餐类型" prop="chargeType">
        <el-select
          v-model="formData.chargeType"
          placeholder="请选择入库套餐规格"
          @change="chargetTypeChange"
        >
          <el-option
            v-for="item in baseContent.offerTypeList"
            :key="item.chargeType + item.chargeEntryId"
            :value="item.chargeType"
            :label="item.chargeTypeName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="套餐规格" prop="chargeId">
        <el-select v-model="formData.chargeId" placeholder="请选择入库套餐规格">
          <el-option
            v-for="item in chooseType.chargeTypeDetailVOS"
            :key="item.id"
            :value="item.id"
            :label="specificationFormat(item)"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.dialog-footer {
  text-align: right;
  margin-top: 15px;
}
</style>
