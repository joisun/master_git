<template>
  <div class="compliance-change-list">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-input
          v-model.trim="search.id"
          style="width: 160px"
          placeholder="下载ID"
          @keyup.enter.native="onSearch"
        />
        <el-input
          v-model.trim="search.taskName"
          style="width: 160px"
          placeholder="请输入任务名称"
          @keyup.enter.native="onSearch"
        />
        <el-select
          v-model="search.carrier"
          placeholder="运营商"
          style="width: 100px"
          clearable
          @change="onCarrierChange"
        >
          <el-option
            v-for="(value, key) in enums.carrier.maps()"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
        <el-select
          v-model="search.signCarrierId"
          placeholder="请选择归属运营商"
          style="width: 160px"
          clearable
          size="small"
          @change="signedCarrierChange"
        >
          <el-option
            v-for="item in signedCarrierList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <wh-carrier-account-select
          v-model="search.carrierAccountId"
          class="card-manage__search--select"
          placeholder="运营商账号"
          :carrier="search.carrier"
          @change="onSearch()"
        />
        <div class="card-manage__search--button mr10">
          <el-button icon="el-icon-search" type="primary" @click="getList(1)"> 搜索 </el-button>
        </div>
      </div>
    </div>
    <div v-loading="loading" class="wh__body">
      <div class="wh__body--table">
        <el-table :data="tableData">
          <el-table-column label="下载列表" prop="id" align="center" width="120px" />
          <el-table-column label="下载日期" prop="effectiveDate" align="center">
            <template #default="{ row }">{{ row.gmtCreated | dateFilter }}</template>
          </el-table-column>
          <el-table-column label="任务名称" prop="taskName">
            <template #default="{ row }"> {{ row.taskName }}({{ row.conditionTaskId }}) </template>
          </el-table-column>
          <el-table-column label="数据量" prop="processNum" align="center" />
          <el-table-column label="处理进度" prop="processStatus" align="center">
            <template #default="{ row }">
              {{ processStatusMap[row.processStatus] }}
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="effectiveDate" align="center">
            <template #default="{ row }">
              <el-button v-if="row.processStatus !== 2" type="primary" @click="openOperation(row)"
                >操作</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="wh__body--page">
        <el-pagination
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          layout="total, prev, pager, next"
          :total="page.total"
          @current-change="changePageIndex"
        />
      </div>
    </div>
    <operation-steps ref="operationSteps" @confirm="getList" />
  </div>
</template>

<script>
import apis from '@/api/ajax'
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select'
import OperationSteps from '@/page/compliance/flow-warning/children/components/operation-steps'
import filterQueryParams from '@/global/function/filterQueryParams'
const processStatusMap = {
  0: '已下载处理',
  1: '已经发放供应链',
  2: '运营商已经处理'
}
export default {
  components: {
    'wh-carrier-account-select': whCarrierAccountSelect,
    OperationSteps
  },
  data() {
    return {
      processStatusMap,
      tableData: [],
      loading: false,
      signedCarrierList: [],
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      search: {}
    }
  },
  async created() {
    await this.getList()
  },
  methods: {
    changePageIndex(val) {
      this.page.pageIndex = val
      this.getList()
    },
    openOperation(row) {
      this.$refs.operationSteps.open(row)
    },
    onCarrierChange() {
      this.search.carrierAccountId = ''
      this.search.signCarrierId = ''
      this.signedCarrierList = []
      this.getSignedCarrierList()
      this.onSearch()
    },
    async getSignedCarrierList() {
      if (!this.search.carrier) return false
      let res = await this.jaxLib.store.signedCarrierListGet({ carrier: this.search.carrier })
      if (!res.success) return false
      this.signedCarrierList = res.data
    },
    signedCarrierChange() {
      this.search.carrierAccountId = ''
      this.onSearch()
    },
    async getList() {
      this.loading = true
      const { carrierAccountId, carrier, signCarrierId, id, taskName } = this.search
      const res = await apis.flowWarning.getDownLoadList(
        filterQueryParams({
          currentPage: this.page.pageIndex,
          pageSize: this.page.pageSize,
          signCarrierId,
          carrierAccountId,
          carrier,
          id,
          taskName
        })
      )
      this.loading = false
      if (!res || !res.success) {
        return false
      }
      this.tableData = res.data.list
      this.page.pageIndex = res.data.page.currentPage
      this.page.total = res.data.page.allCount
    },
    onSearch() {
      this.page.pageIndex = 1
      this.getList()
    }
  }
}
</script>

<style scoped></style>
