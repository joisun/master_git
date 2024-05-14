<script>
import international from '@/api/international'
import filterQueryParams from '@/global/function/filterQueryParams'

const DEFAULT_FORM_DATA = JSON.stringify({
  money: undefined,
  syncInvoice: 0,
  remark: ''
})
export default {
  data() {
    return {
      activeName: '1',
      content: {},
      formData: JSON.parse(DEFAULT_FORM_DATA),
      visible: false
    }
  },
  methods: {
    cancel() {
      this.formData = JSON.parse(DEFAULT_FORM_DATA)
      this.$refs.form.resetFields()
      this.visible = false
    },
    open(content) {
      this.content = content
      this.visible = true
    },
    async submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const apiMap = {
            1: 'balanceAllocation',
            2: 'balanceRefund'
          }
          const { money, remark, syncInvoice } = this.formData
          let res = await this.jaxLib.international[apiMap[this.activeName]](
            filterQueryParams({
              orgId: this.content.id,
              money,
              remark,
              syncInvoice: this.activeName === '1' ? Number(syncInvoice) : undefined
            })
          )
          if (res && res.success) {
            this.$message({ type: 'success', message: '操作成功' })
            this.cancel()
            this.visible = false
            this.$emit('confirm')
          }
        }
      })
    }
  }
}
</script>

<template>
  <el-dialog
    :visible.sync="visible"
    title="国际卡分配额度"
    width="600px"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form ref="form" :model="formData" label-width="130px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="分配额度" name="1">
          <el-form-item
            label="分配额度"
            prop="money"
            :rules="[{ required: true, message: '请输入分配额度', trigger: 'change' }]"
          >
            <el-input v-model="formData.money" placeholder="填写额度">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formData.syncInvoice">不开发票</el-checkbox>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="余额退款" name="2">
          <el-form-item
            label="退款额度"
            prop="money"
            :rules="[{ required: true, message: '请输入退款额度', trigger: 'change' }]"
          >
            <el-input v-model="formData.money" placeholder="填写额度">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item
        label="备注"
        prop="remark"
        :rules="[{ required: true, message: '请输入备注', trigger: 'change' }]"
      >
        <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="请输入备注">
        </el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
