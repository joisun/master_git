<script>
import apis from '@/api/ironman-api'
import EditTopic from './edit-topic'
import TopicDetail from './topic-detail'
import { categoryMap } from './index'

export default {
  components: {
    EditTopic,
    TopicDetail
  },
  props: {
    versionId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      categoryMap,
      search: {},
      isShowDetailDialog: false,
      isShowEditDialog: false,
      dialogType: 'add',
      rowId: 0,
      topicList: [],
      allVersionList: [],
      isLoading: false,
      page: {
        pageIndex: 1,
        pageSize: 30,
        total: 0
      }
    }
  },
  created() {
    this.getList()
    this.getAllVersion()
  },
  watch: {
    versionId(val) {
      if (val) {
        this.getAllVersion()
        this.search.versionId = val
        this.getList()
      }
    }
  },
  methods: {
    async getAllVersion() {
      const { success, data } = await apis.mqttVersionList({ pageIndex: 1, pageSize: 10000 })
      if (!success) return false
      this.allVersionList = data.list
    },
    async getList(pageIndex = 1) {
      this.pageIndex = pageIndex
      this.isLoading = true
      const params = { pageIndex, pageSize: 30 }
      const { category, name, topic, versionId } = this.search
      if (category) params.category = category
      if (name) params.name = name
      if (topic) params.topic = topic
      if (versionId) params.versionId = versionId
      const { success, data } = await apis.mqttTopicList(params)
      this.isLoading = false
      if (!success) return false
      this.topicList = data.list
      this.page.total = data.page.allCount
    },
    editSubmit() {
      this.$refs.editDialogRef.submit()
    },
    closeDialog() {
      this.dialogType = 'add'
      this.isShowEditDialog = false
      this.getList()
    },
    showDialog(type, id) {
      this.rowId = id
      if (type === 'detail') {
        this.isShowDetailDialog = true
      } else {
        this.dialogType = type
        this.isShowEditDialog = true
      }
    }
  }
}
</script>

<template>
  <div class="cpe-mqtt-topic">
    <div class="wh__tools">
        <div class="wh__tools--search">
          <el-select placeholder="选择分类" v-model="search.category" @change="getList(1)" clearable>
            <el-option v-for="(item, key) in categoryMap" :key="key" :value="key" :label="item"></el-option>
          </el-select>
          <el-select placeholder="选择版本" v-model="search.versionId" @change="getList(1)" clearable>
            <el-option v-for="item in allVersionList" :key="item.id" :value="item.id" :label="item.version"></el-option>
          </el-select>
          <el-input
            placeholder="搜索名称"
            name="searchField"
            @keyup.enter.native="getList(1)"
            v-model.trim="search.name"
            class="wh__tools--search-input"
          >
            <el-button slot="append" icon="el-icon-search" @click.native="getList(1)">
            </el-button>
          </el-input>
          <el-input
            placeholder="搜索topic"
            name="searchField"
            @keyup.enter.native="getList(1)"
            v-model.trim="search.topic"
            class="wh__tools--search-input"
          >
            <el-button slot="append" icon="el-icon-search" @click.native="getList(1)">
            </el-button>
          </el-input>
          <div class="float-right">
            <div class="card-manage__search--button">
              <el-button type="primary" @click="showDialog('add')">新增</el-button>
            </div>
          </div>
        </div>
      </div>
    <div class="wh__body">
        <el-table :data="topicList" v-loading="isLoading">
          <el-table-column label="分类" align="center" width="120px">
            <template slot-scope="scope">{{ categoryMap[scope.row.category] }}</template>
          </el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="说明" prop="desc"></el-table-column>
          <el-table-column label="请求topic" prop="requestTopic"></el-table-column>
          <el-table-column label="发布时间" prop="releaseDate" width="160px"></el-table-column>
          <el-table-column label="操作" align="center" width="160px">
            <template slot-scope="scope">
              <el-button size="mini" @click="showDialog('detail', scope.row.id)">查看</el-button>
              <el-button size="mini" @click="showDialog('edit', scope.row.id)">编辑</el-button>
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
      v-if="isShowEditDialog"
      :title="(dialogType === 'add' ? '新增' : '编辑') + 'topic'"
      :visible.sync="isShowEditDialog"
      width="1000px"
      :close-on-click-modal="false"
    >
      <edit-topic
        :category-map="categoryMap"
        ref="editDialogRef"
        @close="closeDialog"
        :edit-row-id="rowId"
        :type="dialogType"
      >
      </edit-topic>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="isShowDetailDialog"
      title="topic详情"
      :visible.sync="isShowDetailDialog"
      width="1000px"
      :close-on-click-modal="false"
    >
      <topic-detail
        :category-map="categoryMap"
        ref="detailDialogRef"
        :row-id="rowId"
        @close="closeDialog"
      >
      </topic-detail>
    </el-dialog>
  </div>
</template>
