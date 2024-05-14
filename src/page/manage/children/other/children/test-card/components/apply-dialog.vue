<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'
import moment from 'moment'
export default {
  props: {
    selectedIccids: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      iccids: '',
      visible: false,
      formData: {
        iccids: '',
        type: 'apply',
        returnTime: '',
        reason: ''
      },
      rules: {
        type: {
          required: true
        },
        iccids: {
          required: true,
          message: '请输入ICCID'
        },
        reason: {
          required: true,
          message: '请输入原因'
        },
        returnTime: {
          required: true,
          message: '请选择预计归还时间'
        }
      }
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
    closeDialog() {
      this.iccids = ''
      this.$emit('close', 'apply')
    },
    open() {
      if (this.selectedIccids.length > 0) {
        this.formData.iccids = this.selectedIccids.join('\n')
      }
      this.visible = true
    },
    submit() {
      const { iccids: _iccids, type, returnTime, reason } = this.formData
      const iccids = iccidsTransfer(_iccids, ',')
      const action = type === 'apply' ? '申请卡' : '取消申请卡'
      this.$confirm(`确定${action}吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let params = {
          iccids
        }
        if (type === 'apply') {
          params = {
            ...params,
            reason,
            returnTime: moment(returnTime).format('YYYY-MM-DD 23:59:59')
          }
        }
        const res = await this.jaxLib.testCard[type](params)
        if (!res.success) return false
        this.$message({ type: 'success', message: `${action}成功` })
        this.$emit('confirm')
        this.reset()
        this.visible = false
      })
    }
  }
}
</script>
<template>
  <div class="test-card-apply-dialog">
    <el-dialog
      title="申请卡/取消申请卡"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form ref="form" :model="formData" label-width="120px" :rules="rules">
        <el-form-item label="申请类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio label="apply">申请卡</el-radio>
            <el-radio label="cancel">取消申请卡</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="ICCID" prop="iccids">
          <el-input
            v-model="formData.iccids"
            type="textarea"
            placeholder="请输入iccid，一行一个"
            :rows="10"
          />
        </el-form-item>
        <template v-if="formData.type === 'apply'">
          <el-form-item label="申请理由" prop="reason">
            <el-input
              v-model="formData.reason"
              type="textarea"
              placeholder="请输入申请理由,最多100字"
              :rows="6"
              maxlength="100"
            />
          </el-form-item>
          <el-form-item label="预计归还时间" prop="returnTime">
            <el-date-picker
              v-model="formData.returnTime"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="submit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.test-card-apply-dialog {
  .el-button {
    width: 100px;
  }
}
</style>
