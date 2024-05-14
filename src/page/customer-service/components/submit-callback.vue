<template>
  <div class="edit-dialog">
    <el-dialog title="提示" :visible.sync="visible" width="30%" @close="handleClose">
      提交成功，其中成功
      <el-button v-if="success" type="text" @click="download(id, 'success')">{{
        success
      }}</el-button>
      <span v-else>{{ success }}</span> 个 , 失败
      <el-button v-if="fail" type="text" @click="download(id, 'fail')"> {{ fail }}</el-button>
      <span v-else>{{ fail }}</span
      >个
      <div>生效时间可能存在一定时间的延迟</div>
      <div v-if="fail">
        {{ failReason }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Download from '@/page/components/wh-download/wh-download'
export default {
  props: {
    failReason: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      success: 0,
      fail: 0,
      id: -1
    }
  },
  methods: {
    open(content) {
      const { success, id, fail } = content
      this.success = success
      this.id = id
      this.fail = fail
      this.visible = true
    },
    async download(row, exportType) {
      const res = await this.jaxLib.customerServices.toolLogExport({
        exportType,
        id: this.id
      })
      await Download({ ...res.data })
    },
    handleClose() {
      this.visible = false
    }
  }
}
</script>
