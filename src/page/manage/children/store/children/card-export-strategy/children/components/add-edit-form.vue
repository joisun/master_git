<template>
  <el-dialog
    title="新增"
    :visible.sync="visible"
    :before-close="handleClose"
    destroy-on-close
    width="80%"
  >
    <el-form ref="form" :model="formData" label-width="120px" :rules="rules">
      <el-form-item label="套餐大类" prop="packageCategory">
        <el-input v-model="formData.packageCategory" style="width: 200px" />
      </el-form-item>
      <el-form-item label="关联分类" prop="priceOfferCategoryIds">
        <el-select
          v-model="formData.priceOfferCategoryIds"
          multiple
          placeholder="请选择"
          style="width: 700px"
        >
          <el-option-group
            v-for="group in planClassificationList"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.id + item.name"
              :disabled="!!(content.usedPriceOfferCategoryIds || [])[item.id]"
              :label="item.name"
              :value="item.id"
            />
          </el-option-group>
        </el-select>
        <!--        <el-checkbox-group v-model="formData.priceOfferCategoryIds">-->
        <!--          <el-checkbox-->
        <!--            v-for="item in planClassificationList"-->
        <!--            :key="item.id + item.name"-->
        <!--            :disabled="!!(content.usedPriceOfferCategoryIds || [])[item.id]"-->
        <!--            :label="item.id"-->
        <!--            >{{ item.name }}-->
        <!--          </el-checkbox>-->
        <!--        </el-checkbox-group>-->
      </el-form-item>
      <el-form-item label="套餐大小" required>
        <package-size-range
          :data="formData.packageSize"
          :carrier="content.carrier"
          @change="handlePackageSizeChange"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import PackageSizeRange from './package-size-range'
const DETAULT_CARRIER_ACCOUNT_ITEM = JSON.stringify({
  id: ''
})
const DEFAULT_FORM_DATA = JSON.stringify({
  priceOfferCategoryIds: [],
  packageSize: [
    {
      lowerLimit: '',
      upperLimit: '',
      carrierAccount: [JSON.parse(DETAULT_CARRIER_ACCOUNT_ITEM)]
    }
  ]
})
export default {
  components: {
    PackageSizeRange
  },
  data() {
    return {
      content: {},
      visible: false,
      formData: {
        ...JSON.parse(DEFAULT_FORM_DATA)
      },
      rules: {
        packageCategory: {
          required: true,
          message: '请输入客户名称'
        },
        priceOfferCategoryIds: {
          required: true,
          message: '请选择关联分类'
        }
      },
      planClassificationList: []
    }
  },
  methods: {
    async getClassificationList() {
      let rst = await this.jaxLib.financial.plan.getClassifications({
        carrier: this.content.carrier
      })
      if (!rst.success) return
      const forward = rst.data.filter((item) => item.type === 'forward')
      const backward = rst.data.filter((item) => item.type === 'backward')
      this.planClassificationList = [
        {
          label: '前向',
          options: forward
        },
        {
          label: '后向',
          options: backward
        }
      ]
    },
    handlePackageSizeChange(data) {
      this.formData.packageSize = data
    },
    onCancel() {
      this.resetForm()
      this.visible = false
    },
    getPackageParams() {
      const { packageCategory, priceOfferCategoryIds, packageSize } = this.formData
      const { carrier } = this.content
      return packageSize.map((item) => {
        return {
          carrier,
          id: item.id,
          priceOfferCategoryIds: priceOfferCategoryIds.join(),
          packageCategory,
          packageSizeStart: item.lowerLimit,
          packageSizeEnd: item.upperLimit !== '' ? item.upperLimit : -1,
          carrierAccountIds: item.carrierAccount.map((c) => c.id).join()
        }
      })
    },
    onConfirm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        const params = {
          oldPackageCategory: this.content.packageCategory,
          strategy: this.getPackageParams()
        }
        const res = await this.jaxLib.store.deviceBaseExportStrategySave(params)
        if (res && res.success) {
          this.$message.success('保存成功')
          this.$emit('confirm', res)
          this.resetForm()
          this.visible = false
        }
      })
    },
    handleClose() {
      this.resetForm()
      this.visible = false
    },
    async open(content) {
      this.content = content
      this.formData = {
        ...this.formData,
        ...JSON.parse(JSON.stringify(content))
      }
      this.getClassificationList().then()
      this.visible = true
    },
    resetForm() {
      // this.$refs.form.resetFields()
      this.formData = JSON.parse(DEFAULT_FORM_DATA)
    }
  }
}
</script>
