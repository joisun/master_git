<template>
  <div class="announcement">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">项目订单</h2>
        <el-select
          v-model="search.orgIdOrName"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="输入客户ID搜索"
          :remote-method="queryOrgAsync"
          @change="onSearchChange"
        >
          <el-option
            v-for="item in orgNameList"
            :key="item.id"
            :label="`${item.orgName}(${item.id})`"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model.trim="search.orderNos"
          placeholder="请输入订单号搜索"
          style="width: 250px"
          @change="onSearchChange"
        />
        <el-badge is-dot class="item" :hidden="noBatchSearchData">
          <el-button icon="el-icon-plus" @click.native="handleAdd('search')" />
        </el-badge>
        <el-date-picker
          v-model="search.monthDate"
          format="yyyy-MM"
          type="month"
          placeholder="下单月份"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :picker-options="pickerOptions"
          @change="onSearchChange"
        />
      </div>
      <div class="wh__tools">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          class="float-right"
          @click.native="handleAdd('add')"
          >新增项目订单</el-button
        >
      </div>
      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData">
            <el-table-column label="订单号" prop="orderNo" />
            <el-table-column label="客户名称(ID)">
              <template slot-scope="{ row }"> {{ row.orgName }}({{ row.orgId }}) </template>
            </el-table-column>
            <el-table-column label="下单时间" prop="orderTime" />
            <el-table-column label="金额" prop="totalMoney" />
            <el-table-column label="套餐id" prop="priceOfferId" />
            <el-table-column label="套餐名称" prop="priceOfferName" />
            <el-table-column label="套餐周期" prop="year">
              <template slot-scope="{ row }">
                {{ row.ratePlanType === 'MONTHLY' ? row.validity + '月' : '1份' }}
              </template>
            </el-table-column>
            <el-table-column label="卡数" prop="cardCount" />
            <el-table-column label="状态" prop="status">
              <template slot-scope="{ row }">
                {{ row.status | orderStatusFilter }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <add-or-search ref="addOrSearch" :type="dialogType" @confirm="dialogConfirm" />
  </div>
</template>

<script>
import filterQueryParams from '@/global/function/filterQueryParams'
import AddOrSearch from './AddOrSearch'
export default {
  name: 'ProjectOrder',
  components: {
    'add-or-search': AddOrSearch
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          const currentDate = new Date()
          return (
            time.getFullYear() >= currentDate.getFullYear() &&
            time.getMonth() > currentDate.getMonth()
          )
        }
      },
      orgNameList: [],
      dialogType: 'search',
      search: {
        monthDate: '',
        orgIdOrName: '',
        orderNos: ''
      },
      loading: false,
      tableData: [],
      sum: {},
      sellerList: [],
      sellerMap: {},
      page: {
        currentPage: 1,
        pageSize: 20,
        total: 0
      },
      DialogImportSalesComission: {
        visible: false
      },
      batchDialogData: {
        orders: []
      }
    }
  },
  computed: {
    noBatchSearchData() {
      const { orders } = this.batchDialogData
      return orders.length === 0
    }
  },
  async created() {
    await this.getList()
  },
  methods: {
    async dialogConfirm({ orders }) {
      if (this.dialogType === 'search') {
        this.search.orderNos = ''
        this.batchDialogData.orders = orders
        await this.onSearchChange()
        return
      }
      if (this.dialogType === 'add') {
        const res = await this.jaxLib.salesComission.salesCommissionMarkSave({
          orderNos: orders
        })
        if (res && res.success) {
          this.$message.success('新增成功')
          await this.onSearchChange()
        }
      }
    },
    handleAdd(type) {
      this.dialogType = type
      this.$refs.addOrSearch.open(type === 'search' ? this.batchDialogData : {})
    },
    async queryOrgAsync(queryString) {
      this.search.orgName = ''
      const res = await this.jaxLib.customer.list.get(
        {
          pageIndex: 1,
          pageSize: 100,
          orgName: queryString
        },
        false
      )
      if (!res.success) return false
      this.orgNameList = res.data.list.map((e) => ({
        id: e.id,
        orgName: e.orgName
      }))
    },
    handlePageChange(e) {
      this.page.currentPage = e
      this.getList()
    },
    onSearchChange() {
      this.page.currentPage = 1
      this.getList()
    },
    async getList() {
      if (this.search.orderNos) {
        this.batchDialogData.orders = []
      }
      const params = {
        ...this.search,
        pageIndex: this.page.currentPage,
        pageSize: this.page.pageSize,
        orderNos: this.search.orderNos || this.batchDialogData.orders.join()
      }
      this.loading = true
      try {
        const rst = await this.jaxLib.salesComission.salesCommissionMarkQuery(
          filterQueryParams(params)
        )
        this.loading = false
        if (!rst.success) {
          this.$message.error('获取列表失败')
        } else {
          this.tableData = rst.data.list
          this.page.total = rst.data.page.allCount
        }
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.alert-container {
  margin-top: -10px;
}
</style>
