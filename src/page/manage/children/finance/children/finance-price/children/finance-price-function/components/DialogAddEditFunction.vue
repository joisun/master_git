<template>
  <el-dialog
    :visible="visible"
    @close="closeDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    class="wh__dialog"
  >
    <el-form label-width="130px" :model="form" :rules="rules" ref="form">
      <el-form-item label="卡功能分类名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入卡功能分类名称"
          style="width: 200px"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <form-card-function
      :data="data"
      ref="formCardFunction"
      :disabled="!isAdd"
    />
    <div slot="footer">
      <el-button type="primary" @click="onSubmit" v-loading="sureLoading"
        >提交</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
  import cardFunctionOptions from '@/constant/options/cardFunction'
  import FormCardFunction from './FormCardFunction.vue'

  export default {
    props: {
      // 是否显示弹框
      visible: {
        type: Boolean,
        required: true
      },
      // 表单数据
      data: {
        type: Object,
        required: false
      }
    },
    watch: {
      visible(val) {
        if (val) {
          if (this.data.id) {
            this.form.name = this.data.name
          } else {
            this.form.name = ''
          }
        }
      }
    },
    data() {
      return {
        sureLoading: false,
        rules: {
          carrier: [{ required: true, message: '运营商不能为空' }]
        },
        form: {
          name: ''
        },
        options: cardFunctionOptions
      }
    },
    methods: {
      onSubmit() {
        let valid = true
        if (this.isAdd && this.$refs.formCardFunction) {
          valid = this.$refs.formCardFunction.validate()
          if (!valid) {
            return
          }
        }
        const form = this.$refs.form
        form.validate((valid) => {
          if (valid) {
            const formCardFunction = this.$refs.formCardFunction
            if (formCardFunction.validate()) {
              const params = formCardFunction.generateSubmitData()
              params.name = this.form.name
              if (!this.isAdd) {
                params.id = this.data.id
              }
              this.$confirm(`确定保存该卡功能分类吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(async () => {
                let res = await this.jaxLib.financial.function.saveFunction(
                  params
                )
                if (!res.success) return false
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
                this.$emit('refreshList')
                this.closeDialog()
              })
            }
          }
        })
      },
      closeDialog() {
        const form = this.$refs.form
        form.resetFields()
        this.$refs.formCardFunction.resetFormData()
        this.$emit('update:visible', false)
      }
    },
    computed: {
      isAdd() {
        return !this.data.id
      },
      title() {
        return this.isAdd ? '添加卡功能分类' : '编辑卡功能分类'
      }
    },
    components: {
      FormCardFunction
    }
  }
</script>