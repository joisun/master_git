<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'
export default {
  data() {
    return {
      visible: false,
      type: '',
      formData: {
        iccids: ''
      },
      rules: {
        iccids: {
          required: true,
          message: '请输入ICCID'
        }
      }
    }
  },
  computed: {
    title() {
      const mapper = {
        returnCard: '归还',
        lendCard: '出借'
      }
      return mapper[this.type]
    }
  },
  methods: {
    handleCancel() {
      this.visible = false
      this.reset()
    },
    reset() {
      this.$refs.form.resetFields()
      this.formData = {
        iccids: '',
        type: 'apply',
        returnTime: '',
        reason: ''
      }
    },
    open(type) {
      this.type = type
      this.visible = true
    },
    submit() {
      const { iccids: _iccids } = this.formData
      const iccids = iccidsTransfer(_iccids, ',')
      this.$confirm(`确定${this.title}吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          iccids
        }
        const res = await this.jaxLib.testCard[this.type](params)
        if (!res.success) return false
        this.$message({ type: 'success', message: `${this.title}成功` })
        this.$emit('confirm')
        this.reset()
        this.visible = false
      })
    }
  }
}
</script>
<template>
  <div class="test-card-operation-dialog">
    <el-dialog
      :title="title"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form ref="form" :model="formData" label-width="120px" :rules="rules">
        <el-form-item label="ICCID" prop="iccids">
          <el-input
            v-model="formData.iccids"
            type="textarea"
            placeholder="请输入iccid，一行一个"
            :rows="10"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="submit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.test-card-operation-dialog {
  .el-button {
    width: 100px;
  }
}
</style>
