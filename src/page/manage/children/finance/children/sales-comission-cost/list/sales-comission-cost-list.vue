<template>
  <div class="announcement">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">销售考核成本</h2>
        <el-date-picker
          v-model="search.monthDate"
          format="yyyy-MM"
          type="month"
          placeholder="选择月份"
          value-format="yyyy-MM-dd"
          :clearable="false"
          @change="onSearchChange"
        />
      </div>
      <div class="wh__tools">
        <div class="wh__tools--search">
          <el-select
            v-model="search.carrier"
            placeholder="请选择运营商"
            style="width: 140px"
            clearable
            @change="onSearchChange('carrier')"
          >
            <el-option
              v-for="(key, val) in enums.carrier.maps()"
              :key="val"
              :label="key"
              :value="val.toUpperCase()"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="search.signedCarrierId"
            placeholder="请选择所属运营商"
            clearable
            size="small"
            @change="getList"
          >
            <el-option
              v-for="item in signedCarrierList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <wh-carrier-account-select
            v-model="search.carrierAccountId"
            :carrier="search.carrier.toLowerCase()"
            size="small"
            :signed-carrier-id="search.signedCarrierId"
            @change="getList"
          />
          <wh-volume-input-select v-model="search.volume" @change="getList" />
          <el-select
            v-model="search.offerType"
            placeholder="选择套餐类型"
            clearable
            @change="getList"
          >
            <el-option
              v-for="item in offerTypeOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
          <el-input
            v-model="search.priceOfferId"
            style="width: 120px"
            placeholder="请输入套餐ID"
            @change="getList"
            @keyup.enter.native="changeType"
          />
          <el-button class="float-right wh__tools--mix-btn" @click="onExport"> 导出 </el-button>
          <el-button class="float-right wh__tools--mix-btn" @click="onImport"> 导入成本 </el-button>
          <el-button class="float-right wh__tools--mix-btn" @click="onAdd"> 新增 </el-button>
        </div>
      </div>
      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData" height="calc(100vh - 210px)">
            <el-table-column
              v-for="(item, index) in COLUMNS"
              :key="index"
              :formatter="item.formatter"
              :prop="item.key"
              :label="item.name"
              :min-width="item.width"
              :align="item.align"
              :class-name="item.style"
              :sortable="item.sortable"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="onEdit(scope.row)">修改</el-button>
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
    </div>
    <DialogAddEditSalesComissionCost
      :month-date="search.monthDate"
      :visible.sync="DialogAddEditSalesComissionCost.visible"
      :data="DialogAddEditSalesComissionCost.data"
      @refresh="getList"
    />
    <DialogImportSalesComissionCost
      :month-date="search.monthDate"
      :visible.sync="DialogImportSalesComissionCost.visible"
      @refresh="getList"
    />
  </div>
</template>

<script>
import { COLUMNS } from '../mixins/const'
import filterQueryParams from '@/global/function/filterQueryParams'
import Download from '@/page/components/wh-download/wh-download'
import { getFirstDayOfMonth } from '../functions/index'
import Regexps from '@/constant/regexps'
import whVolumeInputSelect from '@/page/components/wh-volume-input-select.vue'
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
import DialogAddEditSalesComissionCost from '../components/DialogAddEditSalesComissionCost.vue'
import numberFilter from '@/global/filters/number-fixed'
import DialogImportSalesComissionCost from '../components/DialogImportSalesComissionCost.vue'

export default {
  name: 'sales-comission-list',
  components: {
    DialogImportSalesComissionCost,
    whVolumeInputSelect,
    whCarrierAccountSelect,
    DialogAddEditSalesComissionCost
  },
  data() {
    return {
      COLUMNS,
      search: {
        monthDate: '',
        carrier: '',
        signedCarrierId: '',
        volume: ''
      },
      loading: false,
      tableData: [],
      summary: {},
      page: {
        currentPage: 1,
        pageSize: 20,
        total: 0
      },
      signedCarrierList: [],
      offerTypeOptions: [
        {
          value: 'monthly',
          label: '按月套餐'
        },
        {
          value: 'custom',
          label: '自定义套餐'
        }
      ],
      DialogAddEditSalesComissionCost: {
        visible: false,
        data: undefined
      },
      DialogImportSalesComissionCost: {
        visible: false
      }
    }
  },
  watch: {
    async 'search.carrier'() {
      await this.getSignedCarrierList()
    }
  },
  async created() {
    this.search.monthDate = getFirstDayOfMonth()
    await this.getSignedCarrierList()
    this.getList()
  },
  methods: {
    async getSignedCarrierList() {
      if (!this.search.carrier) return false
      let res = await this.jaxLib.store.signedCarrierListGet({
        carrier: this.search.carrier
      })
      if (!res.success) return false
      this.signedCarrierList = res.data
    },
    handlePageChange(e) {
      this.page.currentPage = e
      this.getList()
    },
    onSearchChange(type) {
      if (type === 'carrier') {
        this.search.signedCarrierId = ''
        this.signedCarrierList = []
      }
      if (type === 'priceOfferId' && this.search.priceOfferId) {
        if (!Regexps.number.test(this.search.priceOfferId)) {
          this.search.priceOfferId = ''
          return
        }
      }
      this.page.currentPage = 1
      this.getList()
    },
    async onExport() {
      const { success, data } = await this.jaxLib.salesComission.comissionCostExport({
        monthDate: this.search.monthDate
      })
      if (!success) return false
      await Download({ ...data })
    },
    async onImport() {
      this.DialogImportSalesComissionCost.visible = true
    },
    onAdd() {
      this.DialogAddEditSalesComissionCost.visible = true
      this.DialogAddEditSalesComissionCost.data = undefined
    },
    onEdit(row) {
      this.DialogAddEditSalesComissionCost.visible = true
      this.DialogAddEditSalesComissionCost.data = JSON.parse(JSON.stringify(row))
    },
    async getList() {
      const params = {
        ...this.search,
        pageIndex: this.page.currentPage,
        pageSize: this.page.pageSize,
        useCountAsVolume: false
      }
      if (this.search.volume) {
        const pattern = /([0-9]+)(C|MB)/
        console.log(this.search.volume)
        const rst = pattern.exec(this.search.volume)
        const volume = parseFloat(rst[1])
        const unit = rst[2]
        params.volume = volume
        params.useCountAsVolume = unit === 'C'
      }
      this.loading = true
      try {
        const rst = await this.jaxLib.salesComission.getCostList(filterQueryParams(params))
        this.loading = false
        if (!rst.success) {
          this.$message.error('获取列表失败')
        } else {
          rst.data.list.forEach((e) => {
            e.cardCost = JSON.parse(e.cardCost)
            e.cost = numberFilter(e.cost, 4)
            e.rechargeCost = numberFilter(e.rechargeCost, 4)
          })
          this.tableData = rst.data.list
          this.page.total = rst.data.page.allCount
        }
      } catch {
        this.loading = false
      }
    },
    enterDetail(row) {
      this.$router.push({
        name: 'sales-comission-detail',
        query: {
          orgId: row.orgId,
          orgName: row.orgName,
          sales: row.sales,
          monthDate: this.search.monthDate
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.alert-container {
  width: 600px;
  margin-top: -10px;
}
</style>
