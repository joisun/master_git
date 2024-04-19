<script>
  import { columns } from './mixins/const'

  export default {
    name: 'nb-apn-modify-list',
    data() {
      return {
        columns: columns,
        page: {
          pageIndex: 1,
          pageSize: 20,
          total: 0
        },
        search: {
          iccid: ''
        },
        tableData: [],
        loading: false
      }
    },
    methods: {
      enterDetail(row) {
        this.$router.push({ name: 'nb-apn-modify-add', query: { data: row } })
      },
      openAdd() {
        this.$router.push({ name: 'nb-apn-modify-add' })
      },
      onSearch() {
        this.page.pageIndex = 1
        this.getList()
      },
      async getList() {
        this.loading = true
        const { pageIndex, pageSize } = this.page
        const {
          data: {
            page: { allCount },
            list
          },
          success
        } = await this.jaxLib.store.nbApnModifyList({
          iccid: this.search.iccid,
          pageNo: pageIndex,
          pageSize: pageSize
        })
        this.loading = false
        if (!success) return false
        this.tableData = list
        this.page.total = allCount
      },
      changeIndex(val) {
        this.page.pageIndex = val
        this.getList()
      }
    },
    created() {
      this.getList()
    }
  }
</script>

<template>
  <div class="inventory-modify-list">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">NB卡APN修改</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--mix">
          <el-input
            v-model="search.iccid"
            placeholder="请输入iccid"
            style="width: 160px"
            @change="onSearch"
          />
          <el-button @click="openAdd()" size="mini" style="float: right"
            >发起申请</el-button
          >
        </div>
      </div>
      <div class="wh__body" v-loading="loading">
        <div class="wh__body--table">
          <el-table :data="tableData" height="calc(100vh - 210px)">
            <el-table-column
              v-for="(item, index) in columns"
              :key="index"
              :formatter="item.formatter"
              :prop="item.key"
              :label="item.name"
              :min-width="item.width"
              :align="item.align"
              :class-name="item.style"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  @click="enterDetail(scope.row)"
                  >查看详情</el-button
                >
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
            layout="pager, total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

