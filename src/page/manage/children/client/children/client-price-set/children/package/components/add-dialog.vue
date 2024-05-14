<template>
  <el-dialog title="添加专属套餐" :visible.sync="visible" width="50%" :before-close="handleClose">
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px" class="demo-formData">
      <el-form-item label="套餐ID" prop="packageIds">
        <el-input v-model="formData.packageIds" type="textarea" :rows="6" />
      </el-form-item>
      <el-form-item prop="type">
        <el-button type="primary" @click="handleTypeChange('1')">最近一年购买过的套餐</el-button>
        <el-button type="primary" @click="handleTypeChange('2')">历史所有购买过的套餐</el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'
import moment from 'moment'
import { safeGet } from '@/global/function/safe-operations'
export default {
  data() {
    return {
      visible: false,
      formData: {
        packageIds: ''
      },
      rules: {
        packageIds: {
          required: true,
          message: '套餐ID不能为空'
        }
      },
      content: {
        orgId: ''
      }
    }
  },
  methods: {
    open(content) {
      this.content = content
      this.visible = true
    },
    handleClose() {
      this.reset()
      this.visible = false
    },
    reset() {
      this.formData = {
        packageIds: ''
      }
      this.$refs.form.resetFields()
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        let res = await this.jaxLib.customer.priceTable.exclusiveAdd({
          ids: iccidsTransfer(this.formData.packageIds)
            .filter((item) => !!item)
            .join(),
          orgId: this.content.orgId
        })
        if (!res.success) return false
        this.$message.success('操作成功')
        this.$emit('confirm')
        this.reset()
        this.visible = false
      })
    },
    async handleTypeChange(v) {
      const formatter = 'YYYY-MM-DD 00:00:00'
      let params = {
        orgId: this.content.orgId
      }
      if (v === '1') {
        params = {
          ...params,
          begin: moment().subtract(1, 'years').format(formatter),
          end: moment().format(formatter)
        }
      }
      let res = await this.jaxLib.customer.priceTable.getRecentlyOfferId(params)
      if (safeGet(res, 'success', false)) {
        if (res.data.length === 0) {
          this.$message.warning('未查询到数据')
          return
        }
        this.formData.packageIds = res.data.join('\n')
      }
    }
  }
}
</script>
