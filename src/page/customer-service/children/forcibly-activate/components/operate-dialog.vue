<template>
  <div class="edit-dialog">
    <submit-callback
      ref="submitCallback"
      fail-reason="提交失败原因可能为：卡不存在，不是沉默期，测试期"
    />
    <el-dialog
      title="发起申请"
      :visible.sync="visible"
      width="50%"
      destroy-on-close
      @close="handleClose"
    >
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { safeGet } from '@/global/function/safe-operations'
import SubmitCallback from '@/page/customer-service/components/submit-callback'
import { iccidsTransfer } from '@/global/function/iccids-tool'
const DEFAULT_FORM_DATA = JSON.stringify({
  iccids: '',
  remark: ''
})
export default {
  components: {
    SubmitCallback
  },
  props: {},
  data() {
    return {
      formData: JSON.parse(DEFAULT_FORM_DATA),
      visible: false,
      content: null,
      formRules: {
        iccids: [{ required: true, message: '请输入ICCID', trigger: 'change' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'change' }]
      }
    }
  },
  created() {},
  methods: {
    open() {
      this.visible = true
    },
    handleClose() {
      this.reset()
      this.visible = false
    },
    reset() {
      this.formData = JSON.parse(DEFAULT_FORM_DATA)
      this.$refs.form.clearValidate()
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
            this.$emit('confirm')
            this.$refs.submitCallback.open(res.data)
            this.reset()
            this.visible = false
          }
        }
      })
    }
  }
}
</script>
