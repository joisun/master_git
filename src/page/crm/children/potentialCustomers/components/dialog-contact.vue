<script>
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import regexp from '@/constant/regexps'
  const validatePhone = (rule, value, callback) => {
    if (value && !regexp.mobile.test(value)) {
      callback(new Error('请输入正确的手机号'))
      return
    }
    callback()
  }
  const validateEmail = (rule, value, callback) => {
    if (value && !regexp.email.test(value)) {
      callback(new Error('请输入正确的邮箱'))
      return
    }
    callback()
  }
  const form = {
    name: '',
    mobile: '',
    email: '',
    title: '',
    description: ''
  }
  const rules = {
    mobile: [{validator: validatePhone, trigger: 'blur'}],
    email: [{validator: validateEmail, trigger: 'blur'}]
  }
  export default {
    mixins: [DialogMixin],
    props: ['content', ''],
    data () {
      return {
        form: { ...form },
        rules: { ...rules }
      }
    },
    methods: {
      open () {
        let content = this.content
        if (content) {
          this.form = { ...content }
        }
      },
      close () {
        this.$refs.form.resetFields()
        this.form = { ...form }
      },
      cancel () {
        this.$emit('onClose', {refreshable: false})
      },
      confirm () {
        let form = this.form
        if (!form.email && !form.mobile && !form.description) {
          // 存在联系人 有三个字段没填完的
          this.$message.warning('联系人中【邮箱】【手机号】【备注】至少填一个')
          return
        }
        this.$refs.form.validate(valid => {
          if (!valid) return
          this.$emit('onClose', {refreshable: true, data: form})
        })
      }
    }
  }
</script>

<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-width="80px">
    <el-form-item class="is-spec" label="姓名" prop="name">
      <el-input placeholder="请输入姓名" v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item class="is-spec" label="手机号" prop="mobile">
      <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
    </el-form-item>
    <el-form-item class="" label="邮箱" prop="email">
      <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
    </el-form-item>
    <el-form-item label="职务" prop="title">
      <el-input placeholder="请输入公司职务" v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="description">
      <el-input type="textarea" v-model="form.description"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </el-form-item>
  </el-form>
</template>
