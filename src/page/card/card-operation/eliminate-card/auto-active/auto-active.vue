<template>
  <div class="eliminate-card">
    <batch-update ref="batchUpdate" @confirm="getList" />
    <auto-rules ref="autoRules" />
    <records ref="records" />
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">过期未销卡管理</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--mix">
          <el-input
            v-model="search.iccid"
            placeholder="请输入ICCID"
            class="wh__tools--search-input"
            clearable
            @change="onSearch"
            @keyup.enter.native="onSearch"
          />
          <el-select
            v-model="search.carrier"
            placeholder="请选择运营商"
            clearable
            @change="onSearch"
          >
            <el-option
              v-for="(val, key) in enums.carrier.maps()"
              :key="key"
              :label="val"
              :value="key"
            >
            </el-option>
          </el-select>
          <wh-carrier-account-select
            v-if="search.carrier"
            v-model="search.carrierAccountId"
            :carrier="search.carrier"
            placeholder="请选择"
            @change="onSearch"
          >
          </wh-carrier-account-select>
          <el-input
            v-model.trim="search.orgId"
            style="width: 180px"
            clearable
            placeholder="请输入客户ID"
            @change="onSearch"
            @keyup.enter.native="onSearch"
          />
          <el-select v-model="search.status" placeholder="请选择状态" clearable @change="onSearch">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="clearfix">
          <div class="float-right">
            <el-button type="primary" @click="autoRules()">自动加入规则</el-button>
            <el-button type="primary" @click="batchAlert('effective')">批量添加</el-button>
            <el-button type="primary" @click="batchAlert('ineffective')">批量移除</el-button>
          </div>
        </div>
      </div>
      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column label="序号" width="50px" align="center">
              <template #default="{ $index }">{{ $index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="iccid" label="ICCID" width="180" />
            <el-table-column prop="orgId" label="客户ID" width="80" />
            <el-table-column prop="orgName" label="客户名称" />
            <el-table-column prop="saleName" label="所属销售" width="80">
              <template #default="{ row }">
                {{ row.saleName | saleFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="cardStatus" label="卡状态">
              <template #default="{ row }">
                {{ row.cardStatus | cardStatusFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="carrier" label="运营商">
              <template #default="{ row }">
                {{ row.carrier | carrierFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="carrierAccountId" label="运营商账号ID" width="150" />
            <el-table-column prop="carrierAccountName" label="运营商账号名称" />
            <el-table-column prop="address" label="本月是否有激活">
              <template #default="{ row }">
                {{ row.activatedMonth | activatedMonthFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="当前状态" width="80">
              <template #default="{ row }">
                {{ row.status | statusFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="添加时间" width="150">
              <template #default="{ row }">
                {{ row.gmtCreated | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="最后变更时间" width="150">
              <template #default="{ row }">
                {{ row.gmtModified | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" width="150px">
              <template #default="{ row }">
                <el-button size="mini" type="primary" @click="modifyStatus(row)">{{
                  row.status === 'ineffective' ? '添加' : '移除'
                }}</el-button>
                <el-button size="mini" @click="openRecord(row.iccid)">记录</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="wh__body--page">
          <el-pagination
            :current-page="page.pageIndex"
            :page-size="page.pageSize"
            :total="page.total"
            layout="pager, total"
            @current-change="handlePageChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BatchUpdate from './components/batch-update.vue'
import AutoRules from './components/auto-rules.vue'
import Records from './components/records.vue'
import filterQueryParams from '@/global/function/filterQueryParams'
import consts from '../mixin/consts'
import WhCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
export default {
  components: {
    WhCarrierAccountSelect,
    BatchUpdate,
    AutoRules,
    Records
  },
  mixins: [consts],
  data() {
    return {
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      loading: false,
      search: {
        carrier: '',
        carrierAccountId: '',
        orgId: '',
        status: '',
        iccid: ''
      },
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handlePageChange(val) {
      this.page.pageIndex = val
      this.getList()
    },
    onSearch() {
      this.page.pageIndex = 1
      this.getList()
    },
    async modifyStatus(row) {
      this.$confirm('确定更改状态', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.jaxLib.card.autoActive.modifyStatus({
          iccids: [row.iccid],
          targetStatus: row.status === 'effective' ? 'ineffective' : 'effective'
        })
        if (res && res.success) {
          this.$message.success('操作成功')
          await this.getList()
        }
      })
    },
    async getList() {
      this.loading = true
      let rst = await this.jaxLib.card.autoActive.activateList(
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
    autoRules() {
      this.$refs.autoRules.open({})
    },
    batchAlert(targetStatus) {
      this.$refs.batchUpdate.open(targetStatus)
    },
    openRecord(iccid) {
      this.$refs.records.open(iccid)
    }
  }
}
</script>
