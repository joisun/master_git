<script>
/**
   * Create by zeter on 2018/11/21
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    mixins: [DialogMixin],
    name: 'batch-input',
    data() {
      return {
        iccids: ''
      }
    },
    props: {
      dialogName: {
        type: String,
        default: ''
      }
    },
    methods: {
      // 批量下一步
      next() {
        if (this.iccids.replace(/(^\s*)|(\s*$)/g, '')) {
          this.$emit('closeDialog', this.dialogName, false, this.iccids.replace(/\n/gm, ','))
        } else {
          this.$message.warning('您没有填写任何信息')
        }
      }
    }
  }
</script>

<template>
  <div class="batch-input wh__dialog">
    <div class="wh__dialog--body">
      <div>ICCID数据：</div>
      <el-input type="textarea" v-model="iccids" placeholder="可以直接复制excel中整列ICCID；手动输入多个ICCID，一行一个；">
      </el-input>
    </div>
    <div class="wh__dialog--footer">
      <el-button type="primary" @click="next">下一步</el-button>
    </div>
  </div>
</template>
