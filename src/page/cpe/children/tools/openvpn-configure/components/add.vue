<script>
import apis from '@/api/ajax'

export default {
  props: {
    selected: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      json: '',
      serverOptions: []
    }
  },
  methods: {
    async getServerList() {
      this.loading = true
      const { success, data } = await apis.cpe.vpnServerList()
      this.loading = false
      if (!success) return false
      this.serverOptions = data
    },
    open() {
      this.visible = true
      this.getServerList()
    },
    async confirm() {
      const { success } = await apis.cpe.vpnConfigBatchInsert({ batchInfo: this.json })
      if (!success) return false
      this.visible = false
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.$emit('confirm', success)
    }
  }
}
</script>

<template>
  <el-dialog :visible.sync="visible" width="50%" :close-on-click-modal="false">
    <template #title>
      新增配置
      <el-popover placement="right" width="400" trigger="click">
        <el-table :data="serverOptions" row-key="id">
          <el-table-column label="服务器地址" prop="addr" />
          <el-table-column label="服务商" prop="provider" width="135" align="center" />
        </el-table>
        <el-button slot="reference" type="text">查看服务器</el-button>
      </el-popover>
    </template>

    <el-input
      v-model="json"
      type="textarea"
      :rows="10"
      placeholder='请输入配置数据，格式：[{ "iccid": "", "macAddr": "", "type": 0, "vpnMaster": "", "vpnSlave": "" }]'
    />
    <div style="margin-top: 8px; color: #666; font-size: 12px">
      格式：[{ "iccid": "", "macAddr": "", "type": 0, "vpnMaster": "", "vpnSlave": "" }]
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button :disabled="!json" type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<style lang="scss"></style>
