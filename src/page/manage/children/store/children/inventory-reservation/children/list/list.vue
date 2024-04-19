<script>
import Download from '@/page/components/wh-download/wh-download'
import reserveCardModal from '@/page/manage/children/store/children/inventory-reservation/children/list/components/reserve-card-modal'
import {
  MATERIAL_EMUN,
  SPEC_EMNU,
  MATERIAL_EMUN_LIST,
  SPEC_EMNU_LIST,
  CONTROL_EMUN_LIST,
  CONTROL_EMUN
} from '@/page/manage/children/store/children/inventory-reservation/constants'
import filterQueryParams from '@/global/function/filterQueryParams'
export default {
  name: 'inventory-reservation-list',
  components: {
    reserveCardModal
  },
  data() {
    return {
      MATERIAL_EMUN,
      SPEC_EMNU,
      MATERIAL_EMUN_LIST,
      SPEC_EMNU_LIST,
      CONTROL_EMUN_LIST,
      CONTROL_EMUN,
      isLoading: false,
      page: {
        pageSize: 20,
        pageIndex: 1,
        total: 0
      },
      tableData: [],
      searchForm: {
        carrier: '',
        signCarrierId: '',
        material: '',
        specification: ''
      },
      signedCarrierList: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    onSearch() {
      this.page.pageIndex = 1
      this.getData()
    },
    onCarrierChange() {
      this.signedCarrierList = []
      this.searchForm.signCarrierId = ''
      this.getSignedCarrierList()
      this.onSearch()
    },
    async getSignedCarrierList() {
      if (!this.searchForm.carrier) return false
      let res = await this.jaxLib.store.signedCarrierListGet({ carrier: this.searchForm.carrier })
      if (!res.success) return false
      this.signedCarrierList = res.data
    },
    goToMyReserve() {
      this.$router.push({ name: 'inventory-reservation-my-list' })
    },
    handleReserve(row) {
      this.$refs.reserveCardModal.open(row)
    },
    changeSize(val) {
      this.page.pageSize = val
      this.getData()
    },
    changPage(val) {
      this.page.pageIndex = val
      this.getData()
    },
    async getData() {
      let rst = await this.jaxLib.store.reserveGetInventory(
        filterQueryParams({
          ...this.searchForm,
          currentPage: this.page.pageIndex,
          pageSize: this.page.pageSize
        })
      )
      if (!rst.success) return false
      this.tableData = rst.data.list
      this.page.total = rst.data.page.allCount
    }
  }
}
</script>

<template>
  <div class="store-record-inner">
    <div class="wh__header">
      <h2 class="wh-title">库存查看和预定</h2>
    </div>
    <reserve-card-modal ref="reserveCardModal" />
    <div class="wh__tools--mix">
      <el-select
        v-model="searchForm.carrier"
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
        >
        </el-option>
      </el-select>
      <el-select v-model="searchForm.signCarrierId" placeholder="请选择所属运营商" clearable @change="onSearch">
        <el-option
          v-for="item in signedCarrierList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="searchForm.material"
        placeholder="材质"
        style="width: 200px"
        clearable
        @change="getData"
      >
        <el-option
          v-for="item in MATERIAL_EMUN_LIST"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="searchForm.specification"
        placeholder="规格"
        style="width: 200px"
        clearable
        @change="getData"
      >
        <el-option
          v-for="item in SPEC_EMNU_LIST"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary">查询</el-button>
      <div class="clearfix" style="margin-bottom: 20px">
        <el-button
          class="float-right"
          style="margin-left: 20px"
          type="primary"
          @click="goToMyReserve"
          >我的预定</el-button
        >
        <el-button class="float-right" type="primary" @click="handleReserve()">预定卡片</el-button>
      </div>
    </div>
    <div v-loading="isLoading" class="wh__body">
      <el-table :data="tableData" class="wh__body--table" height="calc(100vh - 260px)">
        <el-table-column prop="successCount" label="运营商">
          <template slot-scope="scope">
            {{ scope.row.carrier | carrierFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="successCount" label="所属运营商">
          <template slot-scope="scope">
            {{ scope.row.carrierName }}
          </template>
        </el-table-column>
        <el-table-column prop="successCount" label="网络类型" width="150">
          <template slot-scope="{ row }">
            {{ row.netType }}
          </template>
        </el-table-column>
        <el-table-column prop="successCount" label="材质" width="150">
          <template slot-scope="{ row }">
            {{ MATERIAL_EMUN[row.material] }}
          </template>
        </el-table-column>
        <el-table-column prop="successCount" label="规格" width="150">
          <template slot-scope="{ row }">
            {{ SPEC_EMNU[row.specification] }}
          </template>
        </el-table-column>
        <el-table-column prop="successCount" label="当前库存">
          <template slot-scope="{ row }">
            {{ row.currentStockName }}
          </template>
        </el-table-column>
        <el-table-column prop="failCount" label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleReserve(scope.row)">
              预定
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="wh__body--page">
        <el-pagination
          :current-page="page.pageIndex"
          :page-sizes="[10, 20, 30, 50, 100, 200]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          @size-change="changeSize"
          @current-change="changPage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
