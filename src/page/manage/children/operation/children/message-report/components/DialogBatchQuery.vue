<template>
  <el-dialog
    :visible="visible"
    title="批量查询"
    :before-close="onCloseDialog"
    width="500px"
  >
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="ICCID" prop="iccids">
        <wh-iccid-input v-model="form.iccids" />
      </el-form-item>
      <el-form-item label="收件邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="onCloseDialog">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { mailValidator, iccidValidator } from '@/global/function/validator'
  import whIccidInput from '@/global/components/wh-iccid-input.vue'

  export default {
    props: {
      visible: {
        type: Boolean
      }
    },
    data() {
      return {
        form: {
          iccids: [],
          email: ''
        },
        rules: {
          iccids: [
            {
              validator: iccidValidator
            }
          ],
          email: [
            {
              validator: mailValidator
            }
          ]
        }
      }
    },
    methods: {
      onCloseDialog() {
        const form = this.$refs.form
        if (form) {
          form.clearValidate()
          form.resetFields()
        }
        this.$emit('update:visible', false)
      },
      onConfirm() {
        this.$refs.form.validate(async (valid) => {
          if (!valid) return false
          const params = {
            ...this.form
          }
          const rst = await this.jaxLib.customer.certification.batchQuery(params)
          if (rst.success) {
            this.$message.success('操作成功！')
            this.onCloseDialog()
          }
        })
      }
    },
    components: {
      whIccidInput
    }
  }
</script>