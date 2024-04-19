<script>
  /**
   * Create by zeter on 2019-02-27
   */
  import { packageModifyList as columns } from './mixins/const'
  export default {
    name: 'carrier-modify-package-list',
    data() {
      return {
        columns: columns,
        page: {
          pageIndex: 1,
          pageSize: 20,
          total: 0
        },
        tableData: [],
        loading: false
      }
    },
    methods: {
      enterDetail(id) {
        this.$router.push({ name: 'carrier-modify-package-detail', query: { id: id } })
      },
      openDetail() {
        this.$router.push({ name: 'carrier-modify-package-detail' })
      },
      async getList() {
        this.loading = true
        let rst = await this.jaxLib.card.modifyPackageList({
          refType: 'carrier_account_id',
          pageNo: this.page.pageIndex,
          pageSize: this.page.pageSize
        })
        this.loading = false
        if (!rst.success) return false
        this.tableData = rst.data.list
        this.page.total = rst.data.page.allCount
      },
      changeIndex(val) {
        this.page.pageIndex = val
        this.getList()
      }
    },
    mounted() {
      this.getList()
    }
  }
</script>

<template>
  <div class="modify-package-list">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">运营商侧套餐变更</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--mix">
          <el-button @click="openDetail()">发起申请</el-button>
        </div>
      </div>
      <div class="wh__body" v-loading="loading">
        <div class="wh__body--table">
          <el-table :data="tableData" height="calc(100vh - 260px)">
            <el-table-column v-for="(item, index) in columns"
              :key=index
              :formatter="item.formatter"
              :prop=item.key
              :label=item.name
              :min-width=item.width
              :align=item.align
              :class-name="item.style">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="enterDetail(scope.row.id)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="wh__body--page">
          <el-pagination
            @current-change="changeIndex"
            :current-page="page.pageIndex"
            :page-size="page.pageSize"
            :total="page.total"
            layout="pager, total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
