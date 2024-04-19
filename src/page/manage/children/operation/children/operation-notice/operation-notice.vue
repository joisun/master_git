<script>
/**
 * Create by zeter on 2017/7/18
 */
import editArticle from './cpmponents/edit-article.vue'

export default {
  components: {
    'edit-article': editArticle
  },
  data() {
    return {
      loading: false,
      pagin: {
        pageIndex: 1,
        pageSize: 20,
        totalCount: 1
      },
      tableDate: [],
      dialogShow: false,
      choose: '',
      userType: '',
      DialogAddEditNotice: {
        title: '文章新建'
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    closeDialog(idx, flag) {
      this[idx] = false
      if (flag) this.getList()
    },
    async getList() {
      this.loading = true
      let rst = await this.jaxLib.announcement.query({
        pageSize: this.pagin.pageSize,
        pageIndex: this.pagin.pageIndex,
        userType: this.userType
      })
      this.loading = false
      this.tableDate = rst.data.list
      this.pagin.totalCount = rst.data.page.total
    },
    openDialog() {
      this.choose = ''
      this.DialogAddEditNotice.title = '文章新建'
      this.dialogShow = true
    },
    onBindClickOk(val) {
      this.choose = val
      this.DialogAddEditNotice.title = '文章编辑'
      this.dialogShow = true
    },
    changeIndex(val) {
      this.pagin.pageIndex = val
      this.getList()
    },
    onBindClickCancle(val) {
      this.$confirm('你确定要删除这条公告吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let rst = await this.jaxLib.announcement.delete(val)
          if (!rst.success) return false
          this.$message.success('删除成功')
          this.getList()
        })
        .catch(() => {})
    },
    intoView(val) {
      window.open(`${this.$store.state.overall.officialHost}announcement?id=${val}`, '_blank')
    }
  }
}
</script>

<template>
  <div class="announcement">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">公告管理</h2>
      </div>
      <div class="wh__tools--search">
        <el-select v-model="userType" clearable @change="getList">
          <el-option value="seller" label="销售">销售</el-option>
          <el-option value="customer" label="客户">客户</el-option>
        </el-select>
        <el-button class="float-right" @click="openDialog">新建</el-button>
      </div>
      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableDate" height="calc(100vh - 220px)">
            <el-table-column prop="article_id" label="编号" min-width="120">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.user_type !== 'seller'"
                  type="text"
                  @click="intoView(scope.row.article_id)"
                >
                  {{ scope.row.article_id }}
                </el-button>
                <span v-else style="color: #666; font-size: 12px">{{ scope.row.article_id }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="300"> </el-table-column>
            <el-table-column prop="time" label="发布时间" min-width="170">
              <template slot-scope="scope">
                {{ scope.row['gmt_created'] | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column label="修改时间" min-width="170">
              <template slot-scope="scope">
                {{ scope.row['gmt_modify'] | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column label="所属对象">
              <template slot-scope="scope">
                {{ scope.row.user_type === 'seller' ? '销售' : '客户' }}
              </template>
            </el-table-column>
            <el-table-column label="置顶状态" min-width="90">
              <template slot-scope="scope">
                {{ scope.row['top_state'] ? '置顶' : '不置顶' }}
              </template>
            </el-table-column>
            <el-table-column label="是否弹窗" min-width="90">
              <template slot-scope="scope">
                {{ scope.row.popups ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="160">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="onBindClickOk(scope.row)"
                  >编辑
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="onBindClickCancle(scope.row.article_id)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="wh__body--page">
          <el-pagination
            :current-page="pagin.pageIndex"
            :page-size="pagin.pageSize"
            :total="pagin.totalCount"
            @current-change="changeIndex"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      :title="DialogAddEditNotice.title"
      :visible.sync="dialogShow"
      :lock-scroll="true"
      class="wh__dialog"
      top="5%"
    >
      <edit-article
        v-if="dialogShow"
        show-close="dialogShow"
        :article="choose"
        @close="closeDialog"
      >
      </edit-article>
    </el-dialog>
  </div>
</template>
