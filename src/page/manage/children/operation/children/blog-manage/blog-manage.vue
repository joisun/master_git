<template>
  <div>
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">博客页管理</h2>
      </div>
      <div class="wh__tools--search" style="margin-bottom: 10px">
        <el-form ref="searchForm" :model="searchForm">
          <el-row>
            <el-col :span="5">
              <el-form-item label="标题">
                <el-input
                  v-model="searchForm.title"
                  placeholder="请输入要查找的标题"
                  style="width: 200px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="分类">
                <el-select v-model="searchForm.category" clearable>
                  <el-option
                    v-for="(item, index) in categoryList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="状态">
                <el-select v-model="searchForm.status" clearable>
                  <el-option
                    v-for="(item, index) in statusList"
                    :key="index"
                    :label="item"
                    :value="resetStatus(item)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="栏目">
                <el-select v-model="searchForm.type" clearable>
                  <el-option
                    v-for="(item, index) in typeList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-button type="primary" icon="el-icon-search" @click="queryList">搜索</el-button>
            <el-button class="float-right" type="primary" @click="openTypeDialog"
              >分类编辑</el-button
            >
          </el-row>
        </el-form>
        <el-button type="primary" @click="onAdd">新增</el-button>
      </div>
      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table :data="articleList">
            <el-table-column
              v-for="(item, index) in columns"
              :key="index"
              :prop="item.key"
              :label="item.name"
              :formatter="item.formatter"
            >
            </el-table-column>
            <el-table-column label="栏目">
              <template slot-scope="scope">
                {{ typeFilter(scope.row.type) }}
              </template>
            </el-table-column>
            <el-table-column label="分类">
              <template slot-scope="scope">
                {{ categoryFilter(scope.row.category) }}
              </template>
            </el-table-column>
            <el-table-column label="发布时间">
              <template slot-scope="scope">
                {{ scope.row.gmtCreated | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column label="最后编辑时间">
              <template slot-scope="scope">
                {{ scope.row.gmtModified | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-text="展示"
                  inactive-text="隐藏"
                  @change="updateStatus(scope.row)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="onPreview(scope.row)">查看</el-button>
                <el-button type="text" size="mini" @click="onEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="onDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- <div class="wh__body--page">
          <el-pagination
            @current-change="changeIndex"
            :current-page="pagin.pageIndex"
            :page-size="pagin.pageSize"
            :total="pagin.totalCount">
          </el-pagination>
        </div> -->
      </div>
      <edit-category-dialog
        :is-visible="isEditTypeVisible"
        :category-list="categoryList"
        @closeDialog="closeTypeDialog"
      />
    </div>
  </div>
</template>
<script>
import { columns } from './mixins/article-column'
import EditCategoryDialog from './edit-category-dialog'
import BlogMixins from './mixins/blog-mixins'

export default {
  name: 'blog-manage',
  components: {
    'edit-category-dialog': EditCategoryDialog
  },
  mixins: [BlogMixins],
  data() {
    return {
      pagin: {
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0
      },
      searchForm: {
        title: '', // 标题
        category: '', // 分类
        status: null, // 状态
        type: '' // 投放种类(栏目)
      },
      statusList: ['展示', '隐藏'],
      loading: false,
      columns,
      isEditTypeVisible: false
    }
  },
  created() {
    this.queryType()
    this.queryCategory()
    this.queryList()
  },
  methods: {
    async queryList() {
      this.loading = true
      let { title, category, status, type } = this.searchForm
      let param = this.searchForm
      for (const key in param) {
        if (param.hasOwnProperty(key)) {
          if (!param[key]) {
            this.$delete(param, key)
          }
        }
      }
      const result = await this.jaxLib.blog.queryList(param)
      this.loading = false
      if (!result.success) return
      this.articleList = result.data
    },
    async queryType() {
      const result = await this.jaxLib.blog.queryType()
      if (!result.success) return
      this.typeList = result.data
    },
    async queryCategory() {
      const result = await this.jaxLib.blog.queryCategory()
      if (!result.success) return
      this.categoryList = result.data
    },
    resetStatus(value) {
      if (typeof value === 'boolean') {
        return value ? '展示' : '隐藏'
      } else {
        return value === '展示'
      }
    },
    async updateStatus({ status, id, title }) {
      const result = await this.jaxLib.blog.saveArticle({ id: id, status: status })
      if (!result.success) return
      this.$message.success(`${title}在官网被${this.resetStatus(status)}`)
    },
    onDelete(selectItem) {
      this.$confirm('此操作将删除该文章，是否继续？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const result = await this.jaxLib.blog.deleteArticle({ id: selectItem.id })
          if (!result.success) return
          this.$message.success('删除成功')
          this.queryList()
        })
        .catch(() => {})
    },
    onAdd() {
      this.$router.push({
        name: 'add-article',
        query: {
          articleList: this.articleList,
          typeList: this.typeList,
          categoryList: this.categoryList
        }
      })
    },
    onEdit(selectItem) {
      this.$router.push({
        name: 'add-article',
        query: {
          articleList: this.articleList,
          selectItem: selectItem,
          typeList: this.typeList,
          categoryList: this.categoryList
        }
      })
    },
    onPreview(row) {
      window.open(`http://www.simboss.com/www/blog/article/${row.id}`)
    },
    openTypeDialog() {
      this.isEditTypeVisible = true
    },
    closeTypeDialog() {
      this.isEditTypeVisible = false
      this.queryCategory()
    }
  }
}
</script>
