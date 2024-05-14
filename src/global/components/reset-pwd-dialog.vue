<template>
  <el-dialog title="操作提示" :visible.sync="visible" width="30%">
    <p><i class="el-icon-success" style="color: #0dbb49; margin-right: 10px" />密码重置成功</p>
    <el-form style="margin-top: 20px" label-width="80px" label-position="left">
      <el-form-item label="账户名">
        {{ content[0] }}
      </el-form-item>
      <el-form-item label="密码">
        {{ content[1] }}
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCopy">一键复制</el-button>
      <el-button type="primary" @click="visible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import PalClipboard from '@/global/function/pal-clipboard'

export default {
  data() {
    return {
      visible: false,
      content: []
    }
  },
  methods: {
    handleCopy() {
      const string = `账户名: ${this.content[0]}\n密码：${this.content[1]} \n`
      PalClipboard.getInstance(string)
        .execCopy()
        .then(() => {
          this.$message.success('复制成功')
        })
        .catch(() => {
          this.$message.error('复制失败，请手动Ctrl + C')
        })
    },
    async open(content = {}) {
      this.visible = true
      this.content = Object.entries(content)[0]
    }
  }
}
</script>
