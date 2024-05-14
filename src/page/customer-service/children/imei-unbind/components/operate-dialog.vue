<template>
  <div class="edit-dialog">
    <submit-callback ref="submitCallback" fail-reason="提交失败原因可能为：卡不存在" />
    <el-dialog
      title="发起申请"
      :visible.sync="visible"
      width="50%"
      destroy-on-close
      @close="handleClose"
    >
      <el-alert
        title="仅支持电信卡，并且已经入库成功的卡。"
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
  data() {
    return {
      formData: JSON.parse(DEFAULT_FORM_DATA),
      visible: false,
      content: null,
      formRules: {
        iccids: [{ required: true, message: '请输入ICCID', trigger: 'change' }],
        remark: [{ required: false, message: '请输入备注', trigger: 'change' }]
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
      this.$refs.form.clearValidate()
      this.formData = JSON.parse(DEFAULT_FORM_DATA)
    },
    async submit() {
      await this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { iccids, remark } = this.formData
          const res = await this.jaxLib.customerServices.imeiUnbind({
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
