<script>
import ListDialog from '@/page/customer-service/children/forcibly-activate/components/list-dialog'
import SubmitCallback from '@/page/customer-service/components/submit-callback'
import { iccidsTransfer } from '@/global/function/iccids-tool'
import { safeGet } from '@/global/function/safe-operations'
const DEFAULT_FORM_DATA = JSON.stringify({
  iccids: '',
  remark: ''
})
export default {
  name: 'forcibly-activate',
  components: {
    ListDialog,
    SubmitCallback
  },
  props: {},
  data() {
    return {
      formData: JSON.parse(DEFAULT_FORM_DATA),
      content: null,
      formRules: {
        iccids: [{ required: true, message: '请输入ICCID', trigger: 'change' }],
        remark: [{ required: false, message: '请输入备注', trigger: 'change' }]
      }
    }
  },
  created() {},
  methods: {
    viewLog() {
      this.$refs.listDialog.open()
    },
    handleClose() {
      this.reset()
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
          const { iccids, remark } = this.formData
          const res = await this.jaxLib.customerServices.activeStatus({
            iccids: iccidsTransfer(iccids)
              .filter((item) => !!item)
              .join(),
            remark
          })
          if (safeGet(res, 'success', false)) {
            this.$refs.submitCallback.open(res.data)
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
        <h2 class="wh__header--title">强制激活</h2>
      </div>
      <submit-callback
        ref="submitCallback"
        fail-reason="提交失败原因可能为：卡不存在，不是沉默期，测试期"
      />
      <el-alert
        title="仅支持库存卡，测试卡进行激活，强制激活的是SIMBOSS的设备状态，使其直接进入正式套餐周期，并非激活卡的网络状态。"
        type="success"
        effect="dark"
        style="margin-bottom: 20px"
        :closable="false"
      />
      <el-form ref="form" label-width="80px" :model="formData" :rules="formRules">
        <el-form-item label="ICCID" prop="iccids">
          <el-input v-model="formData.iccids" type="textarea" rows="6" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" rows="4" />
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
          <el-button type="text" @click="viewLog">查看操作日志</el-button>
        </el-form-item>
      </el-form>
      <list-dialog ref="listDialog" />
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
