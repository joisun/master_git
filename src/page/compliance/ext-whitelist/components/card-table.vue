<template>
  <div class="whitelist-card-table">
    <!--    <el-form :inline="true" :model="searchData">-->
    <!--      <el-form-item>-->
    <!--        <el-input v-model.trim="searchData.iccid" style="width: 300px" placeholder="请输入卡号" />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item>-->
    <!--        <el-button type="primary" @click="onSearch">查询</el-button>-->
    <!--      </el-form-item>-->
    <!--    </el-form>-->
    <el-table :data="tableData" width="100%" :row-class-name="tableRowClassName">
      <el-table-column prop="iccid" label="ICCID" />
      <el-table-column v-if="showAction" prop="action" label="变更类型">
        <template slot-scope="scope">
          {{ actionMap[scope.row.action] }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page.pageIndex"
      :page-size="page.pageSize"
      :total="page.total"
      layout="pager, total"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'
import { safeGet } from '@/global/function/safe-operations'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    showAction: {
      type: Boolean,
      default: true
    },
    id: {
      type: Number,
      default: -1
    },
    api: {
      type: String,
      require: true,
      default: ''
    },
    idKey: {
      type: String,
      require: true,
      default: ''
    }
  },
  data() {
    return {
      actionMap: {
        ADD: '新增',
        DEL: '删除'
      },
      tableData: [],
      searchData: {},
      visible: false,
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      currentPageData: []
    }
  },
  watch: {
    'page.pageIndex'(newValue) {
      this.currentPageData = this.tableData.slice(
        (newValue - 1) * this.page.pageSize,
        this.page.pageSize * newValue
      )
    }
  },
  created() {
    // this.tableData = this.list
    // this.page = {
    //   ...this.page,
    //   pageIndex: 1,
    //   total: this.tableData.length
    // }
    // this.getCurrentPageData()
    this.getList()
  },
  methods: {
    async getList() {
      const res = await this.jaxLib.whitelist[this.api]({
        [this.idKey]: this.id,
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize
      })
      if (safeGet(res, 'success', false)) {
        this.tableData = res.data.list
        this.page.total = res.data.page.allCount
      }
    },
    handlePageChange(page) {
      this.page.pageIndex = page
      this.getList()
    },
    genIccidList() {
      return iccidsTransfer(this.formData.iccid, 'array').filter((item) => !!item)
    },
    // onSearch() {
    //   this.getCurrentPageData(this.getIccidList(this.searchData.iccid))
    // },
    add() {
      this.visible = true
    },
    tableRowClassName({ row }) {
      return row.isExist ? 'whitelist-exist-row' : ''
    },
    reset() {
      this.formData = {
        iccid: '',
        actionType: 'add'
      }
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
.whitelist-card-table {
  width: 100%;
  .whitelist-exist-row {
    background-color: #eee;
  }
}
</style>
