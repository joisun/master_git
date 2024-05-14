<template>
  <el-dialog
    title=""
    :visible.sync="visible"
    :close-on-click-modal="true"
    :before-close="cancel"
    width="30%"
  >
    <el-table :data="fileList" style="width: 100%">
      <el-table-column prop="index" label="序号" width="100">
        <template #default="{ $index }">{{ $index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="name" label="文件名" align="left">
        <template #default="{ row }">
          <el-button type="text" @click="download(row)">{{ row.name }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import { safeParse } from '@/global/function/safe-operations'
import ajax from '@/api/ajax'

export default {
  data() {
    return {
      visible: false,
      content: {}
    }
  },
  computed: {
    fileList() {
      const obj = safeParse(this.content.fileInfo)
      return Object.keys(obj)
        .filter((key) => key !== 'spNo')
        .map((key) => {
          return {
            name: obj[key],
            fileKey: key
          }
        })
    }
  },
  methods: {
    async download(row) {
      const {
        success,
        data: { fileUrl }
      } = await ajax.common.getDownloadUrlByNode({ fileKey: row.fileKey })
      if (!success) return false
      window.open(fileUrl)
    },
    cancel() {
      this.tableData = []
      this.visible = false
    },
    open(content) {
      this.content = content
      this.visible = true
    }
  }
}
</script>
