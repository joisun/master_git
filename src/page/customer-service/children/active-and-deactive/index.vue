<script>
import ListDialog from '@/page/customer-service/children/active-and-deactive/components/list-dialog'
import SubmitCallback from '@/page/customer-service/components/submit-callback'
import { iccidsTransfer } from '@/global/function/iccids-tool'
import { safeGet } from '@/global/function/safe-operations'
export const statusTypeOptions = [
  {
    label: '网络状态',
    value: 'network'
  },
  {
    label: '设备状态',
    value: 'device'
  }
]
export const actionOptions = [
  {
    label: '激活',
    value: 'ACTIVATED_NAME'
  },
  {
    label: '停卡',
    value: 'DEACTIVATED_NAME'
  }
]
export const networkActionOptions = [
  {
    label: '开启',
    value: 'ACTIVATED_NAME'
  },
  {
    label: '关闭',
    value: 'DEACTIVATED_NAME'
  }
]
const DEFAULT_FORM_DATA = JSON.stringify({
  statusType: '',
  action: '',
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
      statusTypeOptions,
      actionOptions,
      networkActionOptions,
      formData: JSON.parse(DEFAULT_FORM_DATA),
      visible: false,
      content: null,
      formRules: {
        iccids: [{ required: true, message: '请输入ICCID', trigger: 'change' }],
        statusType: [{ required: true, message: '请选择变更的类型', trigger: 'change' }],
        action: [{ required: true, message: '请选择需要变更为的状态', trigger: 'change' }],
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
          const { statusType, iccids, action, remark } = this.formData
          const res = await this.jaxLib.customerServices.modifyDeviceStatus({
            statusType,
            action,
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
        <h2 class="wh__header--title">激活停卡</h2>
      </div>
      <div class="wh__body">
        <div class="edit-dialog">
          <submit-callback ref="submitCallback" fail-reason="提交失败原因可能为：卡不存在" />
          <el-alert type="success" effect="dark" style="margin-bottom: 20px" :closable="false">
            <template #title>
              <p>设备状态：只能操作已经激活或已经停卡的卡</p>
              <p>网络状态：变更的是运营商侧的网络状态</p>
            </template>
          </el-alert>
          <el-form ref="form" label-width="160px" :model="formData" :rules="formRules">
            <el-form-item label="ICCID" prop="iccids">
              <el-input v-model="formData.iccids" type="textarea" rows="6" />
            </el-form-item>
            <el-form-item label="需要变更的类型" prop="statusType">
              <el-select v-model="formData.statusType" placeholder="请选择">
                <el-option
                  v-for="item in statusTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="变更为" prop="action">
              <el-select v-model="formData.action" placeholder="请选择">
                <el-option
                  v-for="item in formData.statusType === 'device'
                    ? actionOptions
                    : networkActionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
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
