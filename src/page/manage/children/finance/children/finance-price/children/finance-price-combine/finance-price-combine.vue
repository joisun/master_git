<template>
  <div class="plan-manager-list">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-button type="primary" class="float-right" size="mini" @click="handleEdit()"
          >新增</el-button
        >
      </div>
    </div>
    <div v-loading="loading" class="wh__body">
      <div class="wh__body--table">
        <el-table :data="tableData" style="width: 100%" height="calc(100vh - 220px)">
          <el-table-column prop="id" label="组合套餐ID" :min-width="40" />
          <el-table-column prop="name" label="自定义套餐名称" :min-width="100" />
          <el-table-column prop="cmcc" label="移动套餐(ID)">
            <template #default="{ row }">
              {{ row.cmccOfferName }}
            </template>
          </el-table-column>
          <el-table-column prop="unicom" label="联通套餐(ID)">
            <template #default="{ row }">
              {{ row.unicomOfferName }}
            </template>
          </el-table-column>
          <el-table-column prop="chinanet" label="电信套餐(ID)">
            <template #default="{ row }">
              {{ row.chinanetOfferName }}
            </template>
          </el-table-column>
          <el-table-column prop="offerTag" label="套餐标签">
            <template #default="{ row }">
              {{ row.offerTag | combineOfferTagFilter }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="wh__body--page">
          <el-pagination
            :current-page="page.pageIndex"
            :page-size="page.pageSize"
            :page-sizes="[20, 40, 60, 100, 200, 500]"
            :total="page.total"
            layout="sizes, pager, total"
            @size-change="handleSizeChange"
            @current-change="changeIndex"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <modify ref="modify" @confirm="onModify" />
  </div>
</template>

<script type="text/jsx">
import Modify from './components/modify'
import cardFunctionOptions from '@/constant/options/cardFunction'
import { safeGet } from '@/global/function/safe-operations'

export default {
  components: {
    Modify
  },
  data() {
    return {
      loading: true,
      tableData: [],
      search: {},
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      dialogAddEditFunction: {
        data: {
          generation: []
        },
        visible: false
      },
      options: cardFunctionOptions
    }
  },
  mounted() {
    this.getList()
  },
  created() {},
  methods: {
    // 切换页码
    changeIndex(val) {
      this.page.pageIndex = val
      this.getList()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    handleEdit(row) {
      this.$refs.modify.open(row)
    },
    onModify({ isAdd }) {
      if (isAdd) {
        this.page.pageIndex = 1
      }
      this.getList()
    },
    // 拉取列表
    async getList() {
      this.loading = true
      let rst = await this.jaxLib.financial.combine.list({
        currentPage: this.page.pageIndex,
        pageSize: this.page.pageSize
      })
      this.loading = false
      if (safeGet(rst, 'success', false)) {
        this.tableData = rst.data.list
        this.page.total = rst.data.page.allCount
      }
    }
  }
}
</script>
