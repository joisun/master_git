<script>
import CarrierHandleAdd from './carrier-handle-add.vue'
import OrgHandleAdd from './org-handle-add.vue'
import filterQueryParams from '@/global/function/filterQueryParams'
import volumeFormat from '@/global/filters/volume-format'
export default {
  components: {
    CarrierHandleAdd,
    OrgHandleAdd
  },
  data() {
    return {
      loading: false,
      carrierLoading: false,
      carrierSearch: {
        carrierAccountId: ''
      },
      search: {
        orgId: ''
      },
      carrierPage: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      page: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      tableData: [],
      carrierTableData: [],
      content: {},
      visible: false
    }
  },
  methods: {
    specificationFormat(row) {
      const obj = row.chargeTypeDetailVO
      let format = volumeFormat
      let unit = () => '月'
      if (row.chargeType === 'CUSTOM') unit = (i) => `${i}个月`
      if (obj.chargeUnit === 'USE_COUNT_AS_VOLUME') format = (i) => `${i}次`
      return `${format(obj.chargeSpecification)}/${unit(obj.chargeValidity)} * ${obj.cardPeriod}`
    },
    carrierHandleAdd() {
      this.$refs.carrierHandleAdd.open()
    },
    orgHandleAdd() {
      this.$refs.orgHandleAdd.open()
    },
    handleDelete(row, type) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.jaxLib.card.autoActive.deleteRule({
          id: row.id
        })
        if (res && res.success) {
          this.$message.success('操作成功')
          type === 'org' ? await this.getList() : await this.getCarrierList()
        }
      })
    },
    handlePageChange(val) {
      this.page.pageIndex = val
      this.getList()
    },
    handleCarrierPageChange(val) {
      this.carrierPage.pageIndex = val
      this.getCarrierList()
    },
    cancel() {
      this.visible = false
    },
    onSearch() {
      this.page.pageIndex = 1
      this.getList()
    },
    async getList() {
      this.loading = true
      let rst = await this.jaxLib.card.autoActive.autoAddOrgRule(
        filterQueryParams({
          currentPage: this.page.pageIndex,
          rowsPerPage: this.page.pageSize,
          ...this.search
        })
      )
      this.loading = false
      if (!rst.success) return false
      this.tableData = rst.data.list
      this.page.total = rst.data.page.allCount
    },
    onCarrierSearch() {
      this.carrierPage.pageIndex = 1
      this.getCarrierList()
    },
    async getCarrierList() {
      this.carrierLoading = true
      let rst = await this.jaxLib.card.autoActive.autoAddCarrierRule(
        filterQueryParams({
          currentPage: this.carrierPage.pageIndex,
          rowsPerPage: this.carrierPage.pageSize,
          ...this.carrierSearch
        })
      )
      this.carrierLoading = false
      if (!rst.success) return false
      this.carrierTableData = rst.data.list
      this.carrierPage.total = rst.data.page.allCount
    },
    open(content) {
      this.visible = true
      this.content = content
      this.getCarrierList()
      this.getList()
    },
    async submit() {}
  }
}
</script>

<template>
  <el-dialog :visible.sync="visible" title="自动加入规则" :close-on-click-modal="false">
    <carrier-handle-add ref="carrierHandleAdd" @confirm="getCarrierList" />
    <org-handle-add ref="orgHandleAdd" @confirm="getList" />
    <el-card shadow="none">
      <div slot="header" class="clearfix">
        <span>客户维度</span>
        <el-button type="primary" style="float: right" @click="orgHandleAdd">新增</el-button>
      </div>
      <el-input
        v-model.trim="search.orgId"
        style="width: 180px; margin-bottom: 20px"
        placeholder="请输入客户ID或者名称"
        @keyup.enter.native="onSearch"
      />
      <el-button @click="onSearch">搜索</el-button>
      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData">
            <el-table-column label="序号" width="80">
              <template #default="{ $index }">{{ $index + 1 }}</template>
            </el-table-column>
            <el-table-column label="客户ID" prop="orgId" />
            <el-table-column label="客户名称" prop="orgName" />
            <el-table-column label="所属销售" prop="saleName">
              <template #default="{ row }">
                {{ row.saleName | saleFilter }}
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="action" width="80">
              <template #default="{ row }">
                <el-button type="text" @click="handleDelete(row, 'org')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="wh__body--page">
          <el-pagination
            :current-page="page.currentPage"
            :page-size="page.pageSize"
            :total="page.total"
            layout="pager, total"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </el-card>
    <el-card shadow="none" style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <span>运营商纬度</span>
        <el-button type="primary" style="float: right" @click="carrierHandleAdd">新增</el-button>
      </div>
      <el-input
        v-model.trim="carrierSearch.carrierAccountId"
        style="width: 180px; margin-bottom: 20px"
        placeholder="运营商ID/运营商账号名称"
        @keyup.enter.native="onCarrierSearch"
      />
      <el-button @click="onCarrierSearch">搜索</el-button>
      <div v-loading="carrierLoading" class="wh__body">
        <div class="wh__body--table">
          <el-table :data="carrierTableData">
            <el-table-column label="序号" width="80">
              <template #default="{ $index }">{{ $index + 1 }}</template>
            </el-table-column>
            <el-table-column label="运营商" prop="carrrier">
              <template #default="{ row }">
                {{ row.carrier | carrierFilter }}
              </template>
            </el-table-column>
            <el-table-column label="运营商账号ID" prop="carrierAccountId" />
            <el-table-column label="运营商账号名称" prop="carrierAccountName" />
            <el-table-column label="套餐类型" prop="chargeType">
              <template #default="{ row }">
                {{ row.chargeType | ratePlanTypeFilter }}
              </template>
            </el-table-column>
            <el-table-column label="套餐规格" prop="action">
              <template #default="{ row }">
                {{ specificationFormat(row) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="action" width="80">
              <template #default="{ row }">
                <el-button type="text" @click="handleDelete(row, 'carrier')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="wh__body--page">
          <el-pagination
            :current-page="carrierPage.currentPage"
            :page-size="carrierPage.pageSize"
            :total="carrierPage.total"
            layout="pager, total"
            @current-change="handleCarrierPageChange"
          />
        </div>
      </div>
    </el-card>
  </el-dialog>
</template>

<style lang="scss">
.dialog-footer {
  text-align: right;
  margin-top: 15px;
}
</style>
