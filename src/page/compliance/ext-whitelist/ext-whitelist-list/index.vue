<script>
import Download from '@/page/components/wh-download/wh-download'
import whSaleSelect from '@/page/components/wh-sales-select.vue'
import mixins from '../mixins'
import DetailModal from './detail'
const removeEmptyField = (obj) => {
  for (const key in obj) {
    const element = obj[key]
    if (!element) delete obj[key]
  }
  return obj
}
export default {
  components: { whSaleSelect, DetailModal },
  mixins: [mixins],
  data() {
    return {
      search: {},
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      poolList: [],
      loading: false,
      poolId: '',
      carrierList: [],
      carrierAccountList: []
    }
  },
  computed: {
    computedCarrierAccountList() {
      if (!this.search.carrier) {
        return []
      }
      return this.carrierAccountList.filter(
        (item) => item.carrier.toUpperCase() === this.search.carrier.toUpperCase()
      )
    }
  },
  created() {
    this.getList()
    this.getCarrierList()
  },
  methods: {
    async getCarrierList() {
      this.loading = true
      const { success, data } = await this.jaxLib.whitelist.workOrderCarrierConfigList({})
      this.loading = false
      if (!success) return false
      this.carrierAccountList = data
      this.carrierList = Array.from(new Set(data.map((item) => item.carrier)))
    },

    async handleConfirm(id) {
      if (id) {
        await this.reConfig(id)
      }
    },
    async reConfig(id) {
      const res = await this.jaxLib.whitelist.configReConfig({ id })
      if (res && res.success) {
        this.$message.success('提交成功')
        await this.getList()
      }
    },
    openDetail(row) {
      this.$refs.detailModal.open(row.poolCarrierId)
    },
    filerDataByKeyword(keyword, list, fields) {
      if (!keyword) return list
      return list.filter((item) => {
        return fields.some((field) => `${item[field]}`.indexOf(keyword) > -1)
      })
    },
    onSearch() {
      this.getList(1)
    },
    async getList(currentPage = 1) {
      this.loading = true
      this.search = removeEmptyField(this.search)
      const { success, data } = await this.jaxLib.whitelist.extWhiteList({
        ...this.search,
        currentPage,
        rowsPerPage: this.page.pageSize
      })
      this.loading = false
      if (!success) return false
      this.poolList = data.list
      this.page.pageIndex = currentPage
      this.page.total = data.page.allCount
    },
    async exportPool() {
      this.search = removeEmptyField(this.search)
      const { success, data } = await this.jaxLib.whitelist.extWhiteListExportPool({
        ...this.search
      })
      if (!success) return false
      await Download({ ...data })
      await this.getList(1)
    }
  }
}
</script>

<template>
  <div class="ext-whitelist-pool-list">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-input
          v-model.trim="search.poolId"
          style="width: 160px"
          placeholder="请输入白名单池ID"
          @keyup.enter.native="onSearch"
        />
        <el-input
          v-model.trim="search.poolName"
          style="width: 160px"
          placeholder="请输入白名单池名称"
          @keyup.enter.native="onSearch"
        />
        <el-input
          v-model.trim="search.groupNo"
          style="width: 200px"
          placeholder="请输入白名单业务名称/白名单群组号"
          @keyup.enter.native="onSearch"
        />
        <el-select v-model="search.carrier" placeholder="选择运营商" clearable @change="getList()">
          <el-option
            v-for="item in carrierList"
            :key="item"
            :label="item | carrierFilter"
            :value="item"
          />
        </el-select>
        <el-select
          v-model="search.signedCarrierId"
          placeholder="选择运营商账号"
          clearable
          @change="getList()"
        >
          <el-option
            v-for="item in computedCarrierAccountList"
            :key="item.signedCarrierId"
            :label="item.signedCarrierName"
            :value="item.signedCarrierId"
          />
        </el-select>
        <el-input
          v-model.trim="search.orgNameOrId"
          style="width: 180px"
          placeholder="请输入客户ID或者名称"
          @keyup.enter.native="onSearch"
        />
        <el-input
          v-model.trim="search.address"
          style="width: 160px"
          placeholder="请输入白名单域名"
          @keyup.enter.native="onSearch"
        />
        <el-input
          v-model.trim="search.iccid"
          style="width: 160px"
          placeholder="请输入ICCID"
          @keyup.enter.native="onSearch"
        />
        <wh-sale-select v-model="search.saleName" style="width: 160px" @change="onSearch" />
        <div class="card-manage__search--button mr10">
          <el-button type="primary" size="mini" @click="getList(1)">查询</el-button>
        </div>
        <div style="display: flex; justify-content: flex-end; align-items: center">
          <el-button type="primary" icon="el-icon-download" @click="exportPool">导 出</el-button>
        </div>
      </div>
    </div>
    <div v-loading="loading" class="wh__body">
      <div class="wh__body--table">
        <el-table :data="poolList">
          <el-table-column label="白名单ID" prop="poolId" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="openDetail(scope.row)"
                >{{ scope.row.poolId }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="白名单名称" prop="poolName" align="center" />
          <el-table-column label="白名单业务名称/群组号" prop="groupNo" align="center" />
          <el-table-column key="submitter" label="销售" width="120px">
            <template slot-scope="scope">{{ scope.row.saleName | saleFilter }}</template>
          </el-table-column>
          <el-table-column label="运营商账号" prop="carrier" align="center">
            <template slot-scope="scope"
              >{{ scope.row.signedCarrierName }}({{ scope.row.signedCarrierId }})</template
            >
          </el-table-column>
          <el-table-column label="客户名称(ID)">
            <template slot-scope="scope">{{ scope.row.orgName }}({{ scope.row.orgId }})</template>
          </el-table-column>
          <el-table-column label="白名单IP/域名数" prop="addressCount" align="center" />
          <el-table-column label="关联卡数" prop="iccidCount" align="center" />
          <el-table-column label="备注" prop="poolDesc" align="center" />
        </el-table>
      </div>
      <div class="wh__body--page">
        <el-pagination
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          layout="total, prev, pager, next"
          :total="page.total"
          @current-change="getList"
        />
      </div>
    </div>
    <detail-modal ref="detailModal" status="POOL_LIST" @confirm="handleConfirm" />
  </div>
</template>

<style lang='scss' scoped>
.ext-whitelist-pool-list {
  .wh__tools--mix {
    & > div {
      margin: 2px 0;
    }
  }
}
</style>
