<script>
  export default {
    props: {
      billSerialId: {
        default: ''
      },
      name: { default: '' },
      phone: { default: '' },
      address: { default: '' }
    },

    data() {
      return {
        form: {
          name: this.name,
          phone: this.phone,
          address: this.address
        },

        rules: {
          name: [{ required: true, message: '不能为空', trigger: 'blur' }],
          phone: [{ required: true, message: '不能为空', trigger: 'blur' }],
          address: [{ required: true, message: '不能为空', trigger: 'blur' }]
        }
      }
    },

    methods: {
      modifyContactInfo() {
        this.jaxLib.bill.contact.update(this.billSerialId, this.form.name, this.form.phone, this.form.address).then(ret => {
          if (ret.success) {
            this.shortcuts.msg('收货信息保存成功', 'success')
            this.$emit('close', true)
          } else {
            this.shortcuts.notify('收货信息保存失败！' + ret.message, '操作失败', 'error')
          }
        }).catch(err => {
          console.error('modifyContactInfo:', err)
        })
      },

      onSubmitClick() {
        const thiz = this
        this.$refs.form.validate(valid => {
          if (valid) {
            const f = thiz.form
            if (f.name === thiz.name && f.phone === thiz.phone && f.address === thiz.address) {
              thiz.$alert('信息没有修改！')
            } else {
              thiz.shortcuts.confirm('确认提交对收货地址的修改？', () => {
                thiz.modifyContactInfo()
              })
            }
          }
        })
      },

      onCancelClick() {
        this.shortcuts.confirm('想要取消对收货地址的编辑？', () => {
          this.$emit('close')
        })
      }
    }
  }
</script>

<template>
  <div class="contact-info-editor">
    <el-form
      label-position="top"
      label-width="100px"
      :model="form"
      :rules="rules"
      ref="form">
      <el-form-item label="联系人" prop="name">
        <el-input v-model="form.name" placeholder="输入收货人姓名">
        </el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="form.phone" placeholder="输入收货人电话">
        </el-input>
      </el-form-item>
      <el-form-item label="收货地址" prop="address">
        <el-input v-model="form.address" placeholder="输入收货人地址">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitClick()">确定</el-button>
        <el-button @click="onCancelClick">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
