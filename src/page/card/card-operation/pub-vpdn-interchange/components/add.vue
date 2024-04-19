<template>
  <el-dialog
    title="发起申请"
    :visible.sync="visible"
    width="70%"
    :before-close="beforeClose"
    destroy-on-close
  >
    <el-form
      ref="form"
      label-width="100px"
      :model="formData"
      :rules="rules"
      :validate-on-rule-change="false"
    >
      <el-form-item prop="iccids" label-width="0">
        <el-input v-model="formData.iccids" rows="6" type="textarea" :disabled="step === 2" />
      </el-form-item>
      <el-form-item v-if="step === 1" label-width="0">
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </el-form-item>
      <el-form-item v-if="step === 2" label-width="0">
        <el-col :span="11">
          <el-card class="box-card" shadow="none" header="变更前">
            <el-form-item label="运营商" props="carrier">
              {{ originDetail.carrier | carrierFilter }}
            </el-form-item>
            <el-form-item label="运营商账号" class="account__item--long" prop="carrierAccountId">
              {{ originDetail.carrierAccountName }}
            </el-form-item>
            <el-form-item label="套餐类型" props="carrier">
              {{ originDetail.originDbType || enums.ratePlanType.maps()[originDetail.dbType] }}
            </el-form-item>
            <el-form-item label="套餐规格" props="carrier">
              {{ originDetail.carrierPlanName }}
            </el-form-item>
          </el-card>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-card v-if="id" class="box-card" shadow="none" header="变更后">
            <el-form-item label="运营商" props="carrier">
              {{ targetDetail.carrier | carrierFilter }}
            </el-form-item>
            <el-form-item label="运营商账号" class="account__item--long" prop="carrierAccountId">
              {{ targetDetail.targetCarrierAccount }}
            </el-form-item>
            <el-form-item label="套餐类型" props="carrier">
              {{ targetDetail.targetDbType }}
            </el-form-item>
            <el-form-item label="套餐规格" props="carrier">
              {{ targetDetail.targetCarrierPlanName }}
            </el-form-item>
            <el-form-item label="功能费" props="carrier">
              {{ targetDetail.targetFeatureFee ? '是' : '否' }}
            </el-form-item>
            <el-form-item label="100M限额" props="carrier">
              {{ targetDetail.targetVolumeLimit ? '是' : '否' }}
            </el-form-item>
          </el-card>
          <el-card v-else class="box-card" shadow="none" header="变更后">
            <el-form-item label="运营商" props="carrier">
              <el-select
                v-model="formData.carrier"
                disabled
                placeholder="运营商"
                @change="onCarrierChange"
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
            <el-form-item label="运营商账号" class="account__item--long" prop="carrierAccountId">
              <wh-carrier-account-select
                v-model="formData.carrierAccountId"
                :carrier="formData.carrier"
                @change="onCarrierAccountChange"
              />
            </el-form-item>
            <el-form-item label="套餐类型" props="dbType">
              <el-select
                v-model="formData.dbType"
                clearable
                placeholder="套餐类型"
                @change="dbTypeChange"
              >
                <el-option
                  v-for="(key, val) in enums.ratePlanType.maps()"
                  :key="val"
                  :label="key"
                  :value="val"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="套餐规格" props="carrierChargeCategoryId">
              <el-select
                v-model="formData.carrierChargeCategoryId"
                clearable
                placeholder="套餐规格"
              >
                <el-option
                  v-for="item in cateGoryOptons"
                  :key="item.carrierChargeCategoryId"
                  :label="item.carrierPlanName"
                  :value="item.carrierChargeCategoryId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="功能费" prop="hasFeatureFee">
              <el-radio-group v-model="formData.hasFeatureFee">
                <el-radio :label="true">有</el-radio>
                <el-radio :label="false">无</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="100M限额" prop="isVolumeLimit100">
              <el-radio-group v-model="formData.isVolumeLimit100">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-card>
        </el-col>
      </el-form-item>
    </el-form>
    <div v-if="!id && step === 2" slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="onSubmit"> 提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'
import WhCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
import { safeGet } from '@/global/function/safe-operations'
const DEFAULT_FORM_DATA = JSON.stringify({
  carrier: '',
  carrierAccountId: '',
  carrierChargeCategoryId: '',
  dbType: '',
  hasFeatureFee: false,
  iccids: '',
  isVolumeLimit100: false
})
export default {
  components: { WhCarrierAccountSelect },
  data() {
    const iccidValidator = async (_, value, callback) => {
      if (this.id) {
        return callback()
      }
      if (this.formData.iccids === '') {
        return callback(new Error('请输入ICCID'))
      }
      const res = await this.jaxLib.card.publicVpdn.validateCarrierAccount4Compliance({
        iccids: iccidsTransfer(this.formData.iccids).join()
      })
      if (safeGet(res, 'success', false)) {
        this.originDetail = res.data
        this.formData.carrier = res.data.carrier
        callback()
      } else {
        callback(new Error('卡号校验失败'))
      }
      callback()
    }
    return {
      id: null,
      step: 1,
      originDetail: {},
      targetDetail: {},
      rules: {
        type: [{ required: true, message: '请选择对齐方式', trigger: 'blur' }],
        dateActivated: [{ required: true, message: '请选择指定激活时间', trigger: 'blur' }],
        iccids: [{ required: !this.id, validator: iccidValidator, trigger: 'blur' }]
      },
      visible: false,
      formData: JSON.parse(DEFAULT_FORM_DATA),
      cateGoryOptons: []
    }
  },
  methods: {
    nextStep() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        this.step = 2
      })
    },
    async onCarrierChange() {
      this.formData.carrierAccountId = ''
      this.formData.carrierChargeCategoryId = ''
      await this.getCategoryOptions()
    },
    async onCarrierAccountChange() {
      this.formData.carrierChargeCategoryId = ''
      await this.getCategoryOptions()
    },
    async dbTypeChange() {
      this.formData.carrierChargeCategoryId = ''
      await this.getCategoryOptions()
    },
    async getCategoryOptions() {
      const { carrier, carrierAccountId, dbType, iccids } = this.formData
      if ([carrier, carrierAccountId, dbType, iccids].some((item) => !item || item.length === 0)) {
        this.cateGoryOptons = []
        return
      }
      const res = await this.jaxLib.card.publicVpdn.listChargeCategoryId4Compliance({
        iccids: iccidsTransfer(iccids).join(),
        carrier,
        carrierAccountId,
        dbType
      })
      if (safeGet(res, 'success', false)) {
        this.cateGoryOptons = res.data
      }
    },
    async getDetail(id) {
      this.loading = true
      let rst = await this.jaxLib.card.publicVpdn.list({
        id,
        refType: 'org_id'
      })
      const [
        {
          iccids,
          carrier,
          originDbType,
          originCarrierAccount,
          originCarrierPlanName,
          targetCarrierAccount,
          targetCarrierPlanName,
          targetDbType,
          targetFeatureFee,
          targetVolumeLimit
        }
      ] = rst.data
      this.formData = {
        ...this.formData,
        iccids: iccids.split(',').join('\n'),
        carrier: carrier.toLowerCase()
      }
      this.originDetail = {
        carrier,
        carrierAccountName: originCarrierAccount,
        dbType: originDbType,
        // 查看详情时后段直接返回中文
        originDbType,
        carrierPlanName: originCarrierPlanName
      }
      this.targetDetail = {
        carrier,
        targetCarrierAccount,
        targetDbType,
        targetCarrierPlanName,
        targetFeatureFee,
        targetVolumeLimit
      }
      this.loading = false
    },
    async open(id) {
      if (id) {
        this.id = id
        await this.getDetail(id)
        this.step = 2
      }
      this.visible = true
    },
    close() {
      this.$refs.form && this.$refs.form.resetFields()
      this.step = 1
      this.originDetail = {}
      this.targetDetail = {}
      this.formData = JSON.parse(DEFAULT_FORM_DATA)
      this.id = null
      this.visible = false
    },
    beforeClose(done) {
      this.close()
      done()
    },
    // 提交保存
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        let rst = await this.jaxLib.card.publicVpdn.modifyCarrierAccount4Compliance({
          ...this.formData,
          iccids: iccidsTransfer(this.formData.iccids).join()
        })
        if (rst.success) {
          this.$message.success('操作成功！')
          this.$emit('confirm')
          this.close()
        }
      })
    }
  }
}
</script>
