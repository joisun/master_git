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
      open() {
        if (this.selectedIccids.length > 0) {
          this.iccids = this.selectedIccids.join('\n')
        }
      },
      closeDialog() {
        this.iccids = ''
        this.$emit('close', 'delete')
      },
      submit() {
        const iccids = iccidsTransfer(this.iccids, ',')
        if (!iccids.trim()) {
          this.$message({ type: 'error', message: 'iccid不能为空' })
          return false
        }
        this.$confirm(`确定删除吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = await this.jaxLib.testCard.delete({ iccids })
          if (!res.success) return false
          this.$message({ type: 'success', message: `删除成功` })
          this.iccids = ''
          this.$emit('close', 'delete')
        })
      }
    }
  }
</script>
<template>
  <div class="test-card-delete-dialog">
    <el-dialog
      title="申请卡/取消申请卡"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @open="open"
      :show-close="false">
      <el-input type="textarea" v-model="iccids" placeholder="请输入iccid，一行一个" :rows="10"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submit">删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>
