<script>
/**
   * Create by zeter on 2018/11/20
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    mixins: [DialogMixin],
    name: 'industry-dialog',
    data() {
      return {
        industry: '',
        industryScope: ''
      }
    },
    props: {
      orgId: {
        default: String
      },
      orgContent: {
        default: Object
      },
      dialogName: {
        default: String
      }
    },
    methods: {
      open() {
        this.industry = this.orgContent.industry
        this.industryScope = this.orgContent.industryScope
      },
      close() {
        this.$emit('closeDialog', this.dialogName)
      },
      async submit() {
        let rst = await this.jaxLib.customer.list.update({
          id: this.orgId,
          industry: this.industry,
          industryScope: this.industryScope
        })
        if (!rst.success) return false
        this.$message.success('行业修改成功')
        this.$emit('closeDialog', this.dialogName, true)
      }
    }
  }
</script>

<template>
  <div class="industry-dialog wh__dialog">
    <div class="wh__dialog--body">
      <el-input v-model="industry" placeholder="行业分类">
      </el-input>
      <br>
      <el-input v-model="industryScope" placeholder="行业">
      </el-input>
    </div>
    <div class="wh__dialog--footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">提 交</el-button>
    </div>
  </div>
</template>
