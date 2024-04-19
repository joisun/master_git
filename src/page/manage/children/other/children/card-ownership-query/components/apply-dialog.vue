<script>
  import { iccidsTransfer } from '@/global/function/iccids-tool'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      selectedIccids: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        iccids: ''
      }
    },
    methods: {
      closeDialog() {
        this.iccids = ''
        this.$emit('close', 'apply')
      },
      open() {
        if (this.selectedIccids.length > 0) {
          this.iccids = this.selectedIccids.join('\n')
        }
      },
      submit(type) {
        const iccids = iccidsTransfer(this.iccids, ',')
        if (!iccids.trim()) {
          this.$message({ type: 'error', message: 'iccid不能为空' })
          return false
        }
        const action = type === 'apply' ? '申请卡' : '取消申请卡'
        this.$confirm(`确定${action}吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let res = {}
          if (type === 'apply') {
            res = await this.jaxLib.testCard.apply({ iccids })
          } else {
            res = await this.jaxLib.testCard.cancel({ iccids })
          }
          if (!res.success) return false
          this.$message({ type: 'success', message: `${action}成功` })
          this.iccids = ''
          this.$emit('close', 'apply')
        })
      }
    }
  }
</script>
<template>
  <div class="test-card-apply-dialog">
    <el-dialog
      title="申请卡/取消申请卡"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @open="open"
      :show-close="false">
      <el-input type="textarea" v-model="iccids" placeholder="请输入iccid，一行一个" :rows="10"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submit('apply')">申请卡</el-button>
        <el-button type="primary" @click="submit('cancel')">取消申请卡</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
  .test-card-apply-dialog {
    .el-button {
      width: 100px;
    }
  }
</style>
