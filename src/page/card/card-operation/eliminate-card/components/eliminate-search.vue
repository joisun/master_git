<script>
/**
   * Create by zeter on 2018/11/12
   */
  import { iccidsTransfer } from '@/global/function/iccids-tool'

  export default {
    name: 'eliminate-search',
    data() {
      return {
        form: {
          iccid: '',
          reason: ''
        },
        formRule: {
          iccid: [{ type: 'string',
                    required: true,
                    transform(value) { return value.trim() },
                    message: '请输入iccid',
                    trigger: 'blur' }],
          email: [{ type: 'email', required: true, message: '请输入正确的邮箱', trigger: 'blur' }]
        }
      }
    },
    methods: {
      onSubmit() {
        this.$refs.form.validate(async(valid) => {
          if (valid) {
            let rst = await this.jaxLib.card.retiring.realSearch({
              iccids: iccidsTransfer(this.form.iccid).join(','),
              email: this.form.email
            })
            if (!rst.success) return false
            this.$message.success(rst.message)
          }
        })
      }
    }
  }
</script>

<template>
  <div class="eliminate-search">
    <div class="tool__info">
      <div class="tool__info--title">提示</div>
      本工具查询结果仅供参考，实际请以运营商实际状态为准。<br>
      操作时，请输入iccid，卡片全部查询完毕，我们将会结果发送到填写的邮箱。
    </div>
    <el-form :model="form" :rules="formRule" ref="form" label-width="120px" class="tool__card--item">
      <el-form-item label="ICCID" prop="iccid">
        <el-input type="textarea" v-model="form.iccid">
        </el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
