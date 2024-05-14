<template>
  <div class="edit-dialog">
    <el-dialog title="发起申请" :visible.sync="visible" width="50%" @close="handleClose">
      <el-form ref="form" label-width="120px" :model="formData" :rules="formRules">
        <el-form-item label="ICCID" prop="iccids">
          <el-input v-model="formData.iccids" type="textarea" rows="6" />
        </el-form-item>
        <el-form-item label="需要变更的状态" prop="iccids"> </el-form-item>
        <el-form-item label="变更为" prop="iccids"> </el-form-item>
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
export default {
  props: {},
  data() {
    return {
      formData: {},
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
    open(content) {
      this.content = content
      this.formData = {
        ...content
      }
      this.visible = true
    },
    handleClose() {
      this.visible = false
    },
    async submit() {
      await this.$refs.form.validate(async (valid) => {
        if (valid) {
          const res = await this.jaxLib.vpdn.apn[this.content ? 'update' : 'add']({
            ...this.formData
          })
          if (safeGet(res, 'success', false)) {
            this.$message.success('操作成功')
            this.$emit('confirm')
            this.visible = false
          }
        }
      })
    }
  }
}
</script>
