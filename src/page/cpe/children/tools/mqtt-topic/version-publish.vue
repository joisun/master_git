<script>
import apis from '@/api/ironman-api'
import PublishDialog from './publish-dialog'
import VersionDiff from './version-diff'

export default {
  components: {
    PublishDialog,
    VersionDiff
  },
  data() {
    return {
      versionList: [],
      isLoading: false,
      isShowPublishDialog: false,
      isShowDiffDialog: false,
      dialogType: 'add',
      editRow: {},
      page: {
        pageIndex: 1,
        pageSize: 30,
        total: 0
      },
      allTopics: {},
      selectedVersion: []
    }
  },
  created() {
    this.getList()
    this.getAllTopics()
  },
  methods: {
    async getList(pageIndex = 1) {
      this.pageIndex = pageIndex
      this.isLoading = true
      const params = { pageIndex, pageSize: 30 }
      const { success, data } = await apis.mqttVersionList(params)
      this.isLoading = false
      if (!success) return false
      this.versionList = data.list
      this.page.total = data.page.allCount
    },
    async getAllTopics() {
      const { success, data } = await apis.mqttTopicList({ pageIndex: 1, pageSize: 10000 })
      if (!success) return false
      const allTopics = {}
      data.list.forEach(item => {
        if (allTopics[item.category]) {
          allTopics[item.category].push(item)
        } else {
          allTopics[item.category] = [ item ]
        }
      })
      this.allTopics = allTopics
    },
    closeDialog() {
      this.isShowPublishDialog = false
      this.getList()
    },
    showDialog(type, editRow = {}) {
      this.dialogType = type
      this.editRow = editRow
      this.isShowPublishDialog = true
    },
    submit() {
      this.$refs.publishDialogRef.submit()
    },
    handleSelectionChange(val) {
      this.selectedVersion = val
    },
    showVersionTopic(versionId) {
      this.$emit('show-version-topic', versionId)
    },
    showDiffDialog() {
      if (!this.selectedVersion.length) {
        return this.$message({ type: 'warning', message: '请选择版本' })
      }
      this.isShowDiffDialog = true
    }
  }
}
</script>

<template>
  <div class="cpe-mqtt-version-publish">
    <div class="wh__tools">
      <div class="wh__tools--search">
        <div class="float-right">
          <div class="card-manage__search--button">
            <el-button @click="showDiffDialog">对比</el-button>
            <el-button type="primary" @click="showDialog('add')">发版</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="wh__body">
      <el-table :data="versionList" v-loading="isLoading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80" align="center"></el-table-column>
        <el-table-column label="序号" width="100px" align="center">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="版本" prop="version" width="200px"></el-table-column>
        <el-table-column label="支持的topic" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showVersionTopic(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="releaseDate"></el-table-column>
        <el-table-column label="备注" prop="desc"></el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template slot-scope="scope">
            <el-button size="mini" @click="showDialog('edit', scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="wh__body--page">
        <el-pagination
          @current-change="getList"
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          layout="total, prev, pager, next"
          :total="page.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      v-if="isShowPublishDialog"
      :visible.sync="isShowPublishDialog"
      :title="dialogType === 'add' ? '版本发布' : '编辑版本'"
      width="1000px"
    >
      <publish-dialog
        :all-topics="allTopics"
        ref="publishDialogRef"
        :editRow="editRow"
        :type="dialogType"
        @close="closeDialog"
      >
      </publish-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowPublishDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog v-if="isShowDiffDialog" :visible.sync="isShowDiffDialog" title="版本对比" width="1000px">
      <version-diff :selected-version="selectedVersion"></version-diff>
    </el-dialog>
  </div>
</template>
