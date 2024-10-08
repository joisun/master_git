<template>
  <div class="plan-manager-list">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-input
          v-model="search.combinationId"
          style="width: 200px"
          placeholder="组合套餐ID"
          @keyup.enter.native="onSearch"
        />
        <el-input
          v-model="search.name"
          style="width: 200px"
          placeholder="自定义套餐名称"
          @keyup.enter.native="onSearch"
        />
        <el-select
          v-model="search.status"
          placeholder="套餐状态"
          clearable
          style="width: 110px"
          @change="onSearch"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-button
          :disabled="multipleSelection.length === 0"
          class="float-right"
          size="mini"
          @click="handleBatchStatus('2')"
          >下架</el-button
        >
        <el-button
          :disabled="multipleSelection.length === 0"
          type="primary"
          class="float-right"
          size="mini"
          style="margin-right: 10px"
          @click="handleBatchStatus('1')"
          >上架</el-button
        >
      </div>
    </div>
    <div v-loading="loading" class="wh__body">
      <div class="wh__body--table">
        <el-table
          :data="tableData"
          style="width: 100%"
          height="calc(100vh - 220px)"
          row-key="id"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
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
          <el-table-column label="套餐状态" width="140">
            <template slot-scope="scope">
              <el-switch
                :key="scope.row.id"
                :disabled="scope.row.disableOnStatus"
                :value="scope.row.status"
                :active-value="1"
                :inactive-value="2"
                active-text="上架"
                inactive-text="下架"
                @change="statusChange(scope.row)"
              />
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
  </div>
</template>

<script type="text/jsx">
import cardFunctionOptions from '@/constant/options/cardFunction'
import { safeGet } from '@/global/function/safe-operations'

export default {
  components: {},
  data() {
    return {
      statusOptions: [
        {
          label: '上架',
          value: 1
        },
        {
          label: '下架',
          value: 2
        }
      ],
      multipleSelection: [],
      loading: true,
      tableData: [],
      search: {
        status: '',
        combinationId: '',
        name: ''
      },
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
    handleBatchStatus(action) {
      this.$confirm(`确认批量${action === 2 ? '下架' : '上架'}组合套餐吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const idList = this.multipleSelection.map((item) => item.id)
        const { success } = await this.jaxLib.customer.combine.shelves({
          combinationId: idList,
          status: action,
          orgId: this.$route.query.orgId
        })
        if (success) {
          this.$message({ type: 'success', message: '操作成功' })
          this.getList(this.pageIndex)
        }
      })
    },
    async statusChange(row) {
      const rst = await this.jaxLib.customer.combine.shelves({
        combinationId: [row.id],
        orgId: this.$route.query.orgId,
        status: row.status === 2 ? 1 : 2
      })
      if (!rst.success) return false
      this.$message.success('修改成功')
      await this.getList()
    },
    // 切换多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
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
    onSearch() {
      this.page.pageIndex = 1
      this.getList()
    },
    // 拉取列表
    async getList() {
      this.loading = true
      let rst = await this.jaxLib.customer.combine.listByOrgId({
        currentPage: this.page.pageIndex,
        pageSize: this.page.pageSize,
        orgId: this.$route.query.orgId,
        ...this.search
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
