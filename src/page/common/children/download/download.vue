<script>
  /**
   * Create by zeter on 2020/1/2
   */
  import ajax from '@/api/ajax'
  export default {
    name: 'download',
    data() {
      return {
        tableData: [],
        page: {
          pageSize: 20,
          pageIndex: 1,
          total: 0
        },
        loading: false
      }
    },
    methods: {
      async download(row) {
        const {success, data: { fileUrl }} = await  ajax.common.getDownloadUrl({fileKey: row.fileKey})
        if(!success) return false
        window.location.href = fileUrl
      },
      async deleteRecord(row) {
       const {success} = await ajax.common.deleteExportRecord({id: row.id})
        if(!success) return false
        this.$message.success('删除成功')
        this.getList()
      },
      async getList() {
        this.loading = true
        const {success, data: {list, page: {allCount}}} = await  ajax.common.getExportRecordList({
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize
        })
        this.loading = false
        if(!success) return false
        this.tableData = list.map(e => {
          e.canDown = e.expireDate ? e.expireDate.time > +new Date() : true
          return e
        })
        this.page.total = allCount
        if (list.findIndex(e => e.status === 'exporting') >= 0) {
          setTimeout(()=> this.getList(), 3000)
        }
      },
      changePageIndex(val) {
        this.page.pageIndex = val
        this.getList()
      },
    },
    computed: {
      exportStatus() {
        return this.$store.getters.getEnum('exportStatus')
      }
    },
    mounted() {
      this.getList()
    }
  }
</script>

<template>
    <div class="download">
      <div class="wh__warp">
        <div>
          <div class="wh__header">
            <h2 class="wh__header--title">下载管理</h2>
          </div>
        </div>
        <div class="wh__body" v-loading="loading">
          <el-table
            :data="tableData"
            border
            height="calc(100vh - 180px)"
            style="width: 100%">
            <el-table-column
              prop="gmtCreated"
              label="下载时间">
              <template slot-scope="scope">
                {{scope.row.gmtCreated | dateFilter}}
              </template>
            </el-table-column>
            <el-table-column
              prop="taskName"
              label="任务名称">
            </el-table-column>
            <el-table-column
              prop="fileKey"
              label="文件名">
            </el-table-column>
            <el-table-column
              prop="address"
              label="文件到期时间">
              <template slot-scope="scope">
                <span v-if="scope.row.status !== 'exported'"> </span>
                <span v-else-if="scope.row.expireDate">{{scope.row.expireDate | dateFilter}}</span>
                <span v-else>长期有效</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="状态">
              <template slot-scope="scope">
                  {{exportStatus[scope.row.status]}}
              </template>
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button @click="download(scope.row)" :disabled="!scope.row.canDown" v-if="scope.row.status === 'exported'">
                  {{scope.row.canDown ?  '下载' : '已过期'}}
                </el-button>
                <el-button v-if="scope.row.status !== 'exporting'" @click="deleteRecord(scope.row)">删除</el-button>
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
        </div>
      </div>
    </div>
</template>

