<template>
  <el-dialog
    :visible="visible"
    @close="closeDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="编辑续费分类"
    class="wh__dialog"
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="昵称" prop="displayName">
        <el-input type="text" v-model="form.displayName"></el-input>
      </el-form-item>
      <el-form-item label="分类状态">
        <el-switch
          v-model="form.disabled"
          active-text="可用"
          :active-value="false"
          :inactive-value="true"
          inactive-text="禁用"
        >
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      // 是否显示弹框
      visible: {
        type: Boolean,
        required: true
      },
      data: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        form: {
          displayName: '',
          disabled: true,
          identification: '3,3',
          identificationA: true,
          identificationB: true
        },
        rules: {
          displayName: [
            { required: true, message: '套餐分类昵称不能为空', trigger: 'blur' },
            { max: 20, message: '套餐分类昵称不能超不20个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      closeDialog() {
        const form = this.$refs.form
        form.resetFields()
        this.$emit('update:visible', false)
      },
      onSubmit() {
        const form = this.$refs.form
        form.validate(async (valid) => {
          if (valid) {
            const params = {
              id: this.data.id,
              ...this.form
            }
            let rst = await this.jaxLib.financial.plan.updateClassificationDisplayName(
              params
            )
            if (!rst.success) return false
            this.$message.success('续费分类编辑成功')
            this.closeDialog()
            this.$emit('refreshList')
          } else {
            return false
          }
        })
      }
    },
    watch: {
      'data.id'() {
        this.form.displayName = this.data.displayName
        this.form.disabled = this.data.disabled
      }
    }
  }
</script>

