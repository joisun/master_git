<script>
/**
   * Create by zeter on 2018/11/26
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    mixins: [DialogMixin],
    name: 'manual-confirm-dialog',
    props: {
      id: {
        default: ''
      },
      dialogName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        loading: false,

        orgId: '',
        remark: ''
      }
    },
    methods: {
      close() {
        this.$emit('closeDialog', this.dialogName)
        this.remark = ''
        this.orgId = ''
      },
      async onConfirmBindClick() {
        this.loading = true
        const rst = await this.jaxLib.financial.cashin.bind(this.id, this.orgId, this.remark)
        this.loading = false
        if (rst.success) {
          this.$message.success('确认到账成功~')
          this.$emit('closeDialog', this.dialogName, true)
        } else {
          this.$message.error('确认到账失败！' + rst.message, '操作失败', 'error')
        }
      }
    }
  }
</script>

<template>
  <div class="confirm-panel wh__dialog" v-loading="loading">
    <div class="wh__dialog--title">邮件订单ID: {{ id }}</div>
    <el-form label-position="right" class="wh__dialog--body">
      <el-form-item label="组织ID">
        <el-input v-model="orgId" placeholder="组织ID">
        </el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="remark">
        </el-input>
      </el-form-item>
    </el-form>
    <div class="wh__dialog--footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="onConfirmBindClick">确 定</el-button>
    </div>
  </div>
</template>
