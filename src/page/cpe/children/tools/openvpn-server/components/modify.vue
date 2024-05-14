<script>
import apis from '@/api/ajax'

export default {
  data() {
    return {
      visible: false,
      form: {
        addr: '',
        provider: ''
      },
      rules: {
        addr: [{ required: true, message: '请输入服务器地址', trigger: 'change' }],
        provider: [{ required: true, message: '请输入服务商', trigger: 'change' }]
      }
    }
  },
  methods: {
    cancel() {
      this.$refs.form.resetFields()
      this.visible = false
    },
    confirm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { success } = await apis.cpe.vpnServerSave(this.form)
          if (!success) return false
          this.visible = false
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.$emit('confirm', success)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    open(data) {
      if (data) {
        const { id, addr, provider } = data
        this.form = {
          id,
          addr,
          provider
        }
      } else {
        this.form = {
          addr: '',
          provider: ''
        }
      }
      this.visible = true
    }
  }
}
</script>

<template>
  <el-dialog
    width="500px"
    :visible.sync="visible"
    :title="form.id ? '编辑' : '新增'"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" label-width="100px" size="mini" :rules="rules">
      <el-form-item label="服务器地址" prop="addr">
        <el-input v-model="form.addr"></el-input>
      </el-form-item>
      <el-form-item label="服务商" prop="provider">
        <el-input v-model="form.provider"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<style lang="scss"></style>
