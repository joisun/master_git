<script>
import { safeGet } from '@/global/function/safe-operations'
import SubmitCallback from '@/page/customer-service/components/submit-callback'
import { iccidsTransfer } from '@/global/function/iccids-tool'
import ListDialog from '@/page/customer-service/children/imei-unbind/components/list-dialog'
const DEFAULT_FORM_DATA = JSON.stringify({
  iccids: '',
  remark: ''
})
export default {
  components: {
    SubmitCallback,
    ListDialog
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
  methods: {
    reset() {
      this.formData = JSON.parse(DEFAULT_FORM_DATA)
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    viewLog() {
      this.$refs.listDialog.open()
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
    <list-dialog ref="listDialog" />

    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">IMEI解绑</h2>
      </div>
      <div class="wh__body">
        <submit-callback
          ref="submitCallback"
          fail-reason="提交失败原因可能为：卡不存在或超过解绑次数"
        />
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
          <el-form-item>
            <el-button @click="reset">重置</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
            <el-button type="text" @click="viewLog">查看操作日志</el-button>
          </el-form-item>
        </el-form>
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
