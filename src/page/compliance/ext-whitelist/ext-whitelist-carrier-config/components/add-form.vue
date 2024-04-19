<template>
  <el-dialog title="申请" :visible.sync="visible" :before-close="handleClose" destroy-on-close>
    <el-form ref="form" :model="formData" label-width="120px" :rules="rules">
      <el-form-item label="运营商" prop="carrier">
        <el-select
          v-model="formData.carrier"
          placeholder="选择运营商"
          clearable
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
      <el-form-item label="运营商账号">
        <el-select v-model="formData.signedCarrierId">
          <el-option
            v-for="item in signedCarrierList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="运营商账号" prop="signedCarrierId">-->
      <!--        <wh-carrier-account-select-->
      <!--          v-model="formData.signedCarrierId"-->
      <!--          :carrier="formData.carrier"-->
      <!--        />-->
      <!--        -->
      <!--      </el-form-item>-->
      <el-form-item label="接入APN" prop="apn">
        <el-input v-model="formData.apn" style="width: 300px" />
      </el-form-item>
      <el-form-item label="目的" prop="purpose">
        <el-select
          v-model="formData.purpose"
          multiple
          allow-create
          default-first-option
          style="width: 300px"
        >
          <el-option
            v-for="item in purposeOptions"
            :key="item.purpose"
            :label="item.purpose"
            :value="item.purpose"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
const DEFAULT_FORM = JSON.stringify({
  purpose: [],
  apn: '',
  carrier: '',
  signedCarrierId: ''
})
export default {
  data() {
    return {
      allSignedCarrierList: [],
      signedCarrierList: [],
      purposeOptions: [],
      visible: false,
      formData: JSON.parse(DEFAULT_FORM),
      rules: {
        carrier: {
          required: true,
          message: '请选择运营商'
        },
        signedCarrierId: {
          required: true,
          message: '请选择运营商账号'
        },
        apn: {
          required: true,
          message: '请输入接入APN'
        },
        purpose: {
          required: true,
          message: '请选择目的'
        }
      }
    }
  },
  methods: {
    async getSignedCarrierList() {
      const { carrier } = this.formData
      if (this.allSignedCarrierList[carrier]) {
        this.signedCarrierList = this.allSignedCarrierList[carrier]
        return
      }
      const { success, data } = await this.jaxLib.store.signedCarrierListGet({
        carrier
      })
      if (!success) return false
      this.allSignedCarrierList[carrier] = data
      this.signedCarrierList = this.allSignedCarrierList[carrier]
    },
    onCancel() {
      this.visible = false
      this.resetForm()
    },
    async getPurposeList() {
      this.loading = true
      const { success, data } = await this.jaxLib.whitelist.workOrderCarrierConfigPuerposeList({})
      this.loading = false
      if (!success) return false
      this.purposeOptions = data
    },
    extractNewPurpose(pur) {
      if (!this.purposeOptions || !this.purposeOptions.length) return pur
      return pur.filter((item) => !this.purposeOptions.map((p) => p.purpose).includes(item))
    },
    async addPurpose(purpose) {
      this.loading = true
      const { success, data } = await this.jaxLib.whitelist.workOrderCarrierConfigPuerposeInsert({
        purpose
      })
      this.loading = false
      if (!success) return false
      this.purposeOptions = data
      return data
    },
    onConfirm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        const { carrier, signedCarrierId, apn, purpose } = this.formData
        const params = {
          carrier,
          signedCarrierId,
          apn,
          purpose: purpose.join()
        }
        const newPurpose = this.extractNewPurpose(purpose).join()
        if (newPurpose) {
          await this.addPurpose(newPurpose)
        }
        const res = await this.jaxLib.whitelist.workOrderCarrierConfigInsert(params)
        if (res && res.success) {
          this.$message.success('保存成功')
          this.resetForm()
          this.$emit('confirm')
          this.visible = false
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.formData = JSON.parse(DEFAULT_FORM)
    },
    handleClose() {
      this.visible = false
      this.resetForm()
    },
    async onCarrierChange() {
      await this.getSignedCarrierList()
    },
    async open() {
      await this.getPurposeList()
      this.visible = true
    }
  }
}
</script>
