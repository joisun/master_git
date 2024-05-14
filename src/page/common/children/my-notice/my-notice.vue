<script>
  /**
   * Create by zeter on 2020/2/24
   */
  import NoticeDetail from './notice-detail'

  const getSimpleText = (html) => {
    const reg = new RegExp('(<[^<>]+>)|(&[a-z]{3,4};)', 'g')
    return html.replace(reg, '')
  }
  export default {
    name: 'my-notice',
    data() {
      return {
        loading: false,
        tableData: [],
        page: {
          pageIndex: 1,
          pageSize: 20,
          total: 0
        },
        notice: {},
        isShowDetail: false
      }
    },
    components: {
      NoticeDetail
    },
    computed: {
      officialHost() {
        return this.$store.state.overall.officialHost
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      changePageIndex(val) {
        this.page.pageIndex = val
        this.getList()
      },
      async getList() {
        this.loading = true
        const { success, data: { list, page } } = await this.jaxLib.notice.listGet({
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize
        })
        this.loading = false
        if (!success) return false
        this.tableData = list.map(e => {
          e.simpleContent = getSimpleText(e.content).slice(0, 30)
          return e
        })
        this.page.total = page.total
      },
      openDetail(row) {
        this.notice = row
        this.isShowDetail = true
      },
      closeDialog() {
        this.isShowDetail = false
      }
    }
  }
</script>

<template>
  <div class="my-notice">
    <div class="wh__warp">
      <div>
        <div class="wh__header">
          <h2 class="wh__header--title">我的通知</h2>
        </div>
      </div>
      <div class="wh__body" v-loading="loading">
        <el-table :data="tableData" height="calc(100vh - 220px)">
          <el-table-column
            prop="title"
            label="标题"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop="simpleContent"
            label="内容"
            min-width="300">
          </el-table-column>
          <el-table-column
            label="发布时间"
            min-width="170">
            <template slot-scope="scope">
              {{scope.row['gmt_created'] | dateFilter}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="160">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="openDetail(scope.row)">查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="changePageIndex"
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          layout="total, prev, pager, next"
          :total="page.total"
          class="wh__body--page">
        </el-pagination>
        <notice-detail v-if="isShowDetail" :visible="isShowDetail" @close="closeDialog" :notice="notice"/>
      </div>
    </div>
  </div>
</template>
