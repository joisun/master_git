<style lang="scss">
</style>

<template>
  <div>
    <div>
      确定完成订单并填写备注
    </div>
    <el-input v-model="form.remark" placeholder="填写备注" style="margin: 10px 0;">
    </el-input>
    <el-button type="primary" @click="onSubmit">提 交</el-button>
    <el-button @click="$emit('close')">取 消</el-button>
  </div>
</template>

<script>
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    mixins: [DialogMixin],
    props: {
      billSerialId: {
        default: ''
      }
    },
    data() {
      return {
        form: {
          remark: ''
        }
      }
    },
    watch: {},
    methods: {
      open() {
        this.form.remark = ''
      },
      onSubmit() {
        this.shortcuts.confirm('确认提交？', () => {
          this.jaxLib.bill.done(this.billSerialId, this.form.remark).then(ret => {
            if (ret.success) {
              this.$emit('close', true)
            } else {
              this.shortcuts.notify(ret.message, '失败错误', 'error')
            }
          }).catch(err => {
            console.error('onSubmit:', err)
          })
        })
      }
    }
  }
</script>
