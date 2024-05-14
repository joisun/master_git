<script>
import ListDialog from './components/list-dialog.vue'
// import SubmitCallback from '@/page/customer-service/components/submit-callback'
import { iccidsTransfer } from '@/global/function/iccids-tool'
import { safeGet } from '@/global/function/safe-operations'
export const ratePlanOptions = [
  {
    label: '电信100M/3年',
    value: '4020'
  },
  {
    label: '移动100M/3年',
    value: '4084'
  },
  {
    label: '联通100M/3年',
    value: '4218'
  }
]
const DEFAULT_FORM_DATA = JSON.stringify({
  iccid: '',
  ratePlanId: ''
})
export default {
  components: {
    // SubmitCallback,
    ListDialog
  },
  data() {
    return {
      ratePlanOptions,
      formData: JSON.parse(DEFAULT_FORM_DATA),
      visible: false,
      content: null,
      loading: false,
      formRules: {
        iccids: [{ required: true, message: '请输入ICCID', trigger: 'change' }],
        ratePlanId: [{ required: true, message: '请选择套餐', trigger: 'change' }]
      }
    }
  },
  methods: {
    viewLog() {
      this.$refs.listDialog.open()
    },
    handleClose() {
      this.reset()
      this.visible = false
    },
    reset() {
      this.formData = JSON.parse(DEFAULT_FORM_DATA)
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    async submit() {
      await this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true
          const { iccids, ratePlanId } = this.formData
          const res = await this.jaxLib.customerServices.deviceBatchResetDrp({
            iccids: iccidsTransfer(iccids)
              .filter((item) => !!item)
              .join(),
            ratePlanId,
            forceActiveDrp: true
          })
          this.loading = false
          if (safeGet(res, 'success', false)) {
            this.$message.success('操作成功')
            this.reset()
          }
        }
      })
    }
  }
}
</script>

<template>
  <div class="forcibly-activate" style="background-color: #fff">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">万佳安套餐重置</h2>
      </div>
      <div class="wh__body">
        <div class="edit-dialog">
          <!--          <submit-callback ref="submitCallback" fail-reason="提交失败原因可能为：卡不存在" />-->
          <!--          <el-alert type="success" effect="dark" style="margin-bottom: 20px" :closable="false">-->
          <!--            <template #title> </template>-->
          <!--          </el-alert>-->
          <el-steps direction="vertical">
            <el-step title="套餐重置" status="process">
              <template #description>
                <el-form ref="form" label-width="160px" :model="formData" :rules="formRules">
                  <el-form-item label="ICCID" prop="iccids">
                    <el-input v-model="formData.iccids" type="textarea" rows="6" />
                  </el-form-item>
                  <el-form-item label="套餐" prop="ratePlanId">
                    <el-select v-model="formData.ratePlanId" placeholder="请选择">
                      <el-option
                        v-for="item in ratePlanOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <!--                    <el-button @click="reset">重置</el-button>-->
                    <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
                  </el-form-item>
                </el-form>
              </template>
            </el-step>
            <el-step title="套餐续费" status="process" description="套餐续费"></el-step>
            <el-step title="被转移的卡套餐时间修改" status="process">
              <template #description>
                <ListDialog />
              </template>
            </el-step>
          </el-steps>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.search-form-inline {
  & > .el-form-item {
    display: inline-block;
    margin-right: 10px;
  }
}
</style>
