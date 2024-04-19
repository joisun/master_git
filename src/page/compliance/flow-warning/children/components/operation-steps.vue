<template>
  <el-dialog title="操作" :visible.sync="visible" width="400px" :before-close="handleClose">
    <el-steps
      :active="active"
      finish-status="success"
      direction="vertical"
      style="height: 200px; padding: 20px 20px 40px"
    >
      <el-step>
        <template #title>
          <span class="step-item">第一步： 已下载处理</span>
        </template>
      </el-step>
      <el-step>
        <template #title>
          <span class="step-item" :class="{ clickable: active < 1 }" @click="handleClick(1)"
            >第二步： 已发放给供应链</span
          >
        </template>
      </el-step>
      <el-step>
        <template #title>
          <span class="step-item" :class="{ clickable: active < 2 }" @click="handleClick(2)"
            >第三步： 运营商已处理</span
          >
        </template>
      </el-step>
    </el-steps>
  </el-dialog>
</template>
<script>
import apis from '@/api/ajax'

export default {
  data() {
    return {
      visible: false,
      active: 0
    }
  },
  methods: {
    open(content) {
      this.content = content
      this.active = content.processStatus
      this.visible = true
    },
    async handleClick(step) {
      if (step <= this.active) return
      this.$confirm('确定更改状态', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await apis.flowWarning.updateStatus({
          id: this.content.id,
          processStatus: step
        })
        if (res.success) {
          this.$message({ type: 'success', message: '操作成功' })
          this.$emit('confirm')
          this.visible = false
        }
      })
    },
    handleClose() {
      this.visible = false
    }
  }
}
</script>
<style lang='scss' scoped>
.step-item {
  &.clickable {
    &:hover {
      color: #ec407a;
      cursor: pointer;
    }
  }
}
</style>
