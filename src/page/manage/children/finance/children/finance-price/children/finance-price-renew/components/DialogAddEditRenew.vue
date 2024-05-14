<template>
  <el-dialog
    :visible="visible"
    @close="closeDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    class="wh__dialog"
  >
    <el-form :label-width="labelWidth" :model="form" :rules="rules" ref="form1">
      <el-form-item label="续费分类名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入续费分类名称"
          style="width: 200px"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="续费分类别名" prop="name">
        <el-input
          v-model="form.displayName"
          placeholder="请输入续费分类别名"
          style="width: 200px"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="运营商" prop="carrier">
        <el-radio
          :disabled="isEdit"
          v-for="(label, value) in this.enums.carrier.maps()"
          v-model="form.carrier"
          :label="value"
          :key="value"
          >{{ label }}</el-radio
        >
      </el-form-item>
    </el-form>
    <form-renew :data="form" ref="formRenew" :disabled="isEdit" />
    <el-form :label-width="labelWidth" :model="form" :rules="rules" ref="form2">
      <el-form-item label="续费分类状态" prop="status">
        <el-switch
          v-model="form.disabled"
          active-text="可用"
          :active-value="false"
          :inactive-value="true"
          inactive-text="禁用"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="套餐隐藏" prop="hide">
        <el-switch
            v-model="form.hide"
            active-text="隐藏"
            :active-value="1"
            :inactive-value="0"
            inactive-text="展示"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="onSubmit" v-loading="sureLoading"
        >提交</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
  import cardFunctionOptions from '@/constant/options/cardFunction'
  import FormRenew from './FormRenew.vue'

  function generateDefaultForm() {
    return {
      name: '',
      disabled: true,
      displayName: '',
      carrier: '',
      hide: 0
    }
  }

  export default {
    props: {
      // 是否显示弹框
      visible: {
        type: Boolean,
        required: true
      },
      data: {
        default: {}
      }
    },
    data() {
      return {
        sureLoading: false,
        rules: {},
        form: generateDefaultForm(),
        labelWidth: '120px',
        options: cardFunctionOptions
      }
    },
    methods: {
      onSubmit() {
        const form1 = this.$refs.form1
        form1.validate(async (valid) => {
          if (valid) {
            if (this.isEdit) {
              const params = {
                id: this.data.id,
                name: this.form.name,
                displayName: this.form.displayName,
                disabled: this.form.disabled,
                hide: this.form.hide,
                identification: '3,3',
                identificationA: true,
                identificationB: true
              }
              let rst = await this.jaxLib.financial.plan.updateClassificationDisplayName(
                params
              )
              if (!rst.success) return false
              this.$message.success('续费分类编辑成功')
              this.$emit('refreshList')
              this.closeDialog()
            } else {
              const formRenew = this.$refs.formRenew
              if (formRenew.validate()) {
                const params = formRenew.generateSubmitData()
                params.name = this.form.name
                params.displayName = this.form.displayName
                params.disabled = this.form.disabled
                params.hide = this.form.hide
                params.carrier = this.form.carrier
                this.$confirm(`确定保存该续费分类吗？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(async () => {
                  let res = await this.jaxLib.financial.plan.createPlanClassification(
                    params
                  )
                  if (!res.success) return false
                  this.$message({
                    type: 'success',
                    message: '操作成功!'
                  })
                  formRenew.resetFormData()
                  this.$emit('refreshList')
                  this.closeDialog()
                })
              }
            }
          }
        })
      },
      generateFormData() {
        if (this.data.id) {
          this.form = Object.assign({}, this.data)
        } else {
          this.form = generateDefaultForm()
        }
      },
      closeDialog() {
        const form1 = this.$refs.form1
        form1.resetFields()
        this.form = generateDefaultForm()
        this.$emit('update:visible', false)
      }
    },
    computed: {
      title() {
        return this.isEdit ? '编辑续费分类' : '添加续费分类'
      },
      isEdit() {
        return this.data.id ? true : false
      }
    },
    created() {
      this.generateFormData()
    },
    watch: {
      visible(v) {
        if (v) {
          this.generateFormData()
        }
      }
    },
    components: {
      FormRenew
    }
  }
</script>
