<script>
import Download from '@/page/components/wh-download/wh-download'
import filterQueryParams from '@/global/function/filterQueryParams'
import dateFormat from '@/global/filters/date-format'
export default {
  name: 'blank-card-active-record',
  data() {
    return {
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      tableData: [],
      loading: false,
      search: {
        timeRange: [],
        iccid: '',
        carrier: '',
        carrierAccountId: '',
        netType: '',
        cardMaterial: '',
        cardSpecification: ''
      },
      signedCarrierList: [],
      materialTypeOptions: {},
      netTypeOptions: {},
      specificationTypeOptions: {}
    }
  },
  created() {
    this.getEnums()
    this.getList()
  },

  methods: {
    stringMap(str) {
      if (!str) str
      return str
        .split(',')
        .map((item) => this.netTypeOptions[item])
        .join()
    },
    onTimeChange() {
      this.onSearch()
    },
    onChargeTypeChange() {
      this.search.chargeCategoryId = ''
      this.onSearch()
    },
    onCarrierAcountIdChange() {
      this.onSearch()
    },
    onCarrierChange(v) {
      this.search.carrierAccountId = ''
      this.signedCarrierList = []
      v && this.getSignedCarrierList()
      this.onSearch()
    },
    async downloadIccid(row) {
      const { success, data } = await this.jaxLib.store.deviceBaseBlankOutputExportIccid({
        id: row.id
      })
      if (!success) return false
      if (data) {
        await Download({ ...data, loop: true })
      } else {
        this.$message.success('操作成功，文件过大，请到下载管理页面查看')
      }
    },
    onSearch() {
      this.page.pageIndex = 1
      this.getList()
    },
    async getList() {
      this.loading = true
      const { pageIndex, pageSize } = this.page
      const { timeRange, netType } = this.search
      let outputTimeStart = ''
      let outputTimeEnd = ''
      if (timeRange && timeRange.length === 2) {
        [outputTimeStart, outputTimeEnd] = [
          dateFormat(timeRange[0], 'YYYY-MM-DD'),
          dateFormat(timeRange[1], 'YYYY-MM-DD')
        ]
      }
      const params = filterQueryParams({
        ...this.search,
        outputTimeStart,
        outputTimeEnd,
        netType: netType ? netType.join() : '',
        pageNo: pageIndex,
        pageSize: pageSize
      })
      delete params.timeRange
      const {
        data: {
          page: { allCount },
          list
        },
        success
      } = await this.jaxLib.store.deviceBaseBlankExportList(params)
      this.loading = false
      if (!success) return false
      this.tableData = list
      this.page.total = allCount
    },
    changeIndex(val) {
      this.page.pageIndex = val
      this.getList()
    },
    async getSignedCarrierList() {
      const { success, data } = await this.jaxLib.store.signedCarrierListGet({
        carrier: this.search.carrier
      })
      if (!success) return false
      this.signedCarrierList = data
    },
    async getEnums() {
      const res = await this.jaxLib.store.deviceBaseBlankEnum({})
      if (res && res.success) {
        const { materialType, netType, specificationType } = res.data
        this.materialTypeOptions = materialType
        this.netTypeOptions = netType
        this.specificationTypeOptions = specificationType
      }
    }
  }
}
</script>

<template>
  <div class="inventory-modify-list">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">开卡记录</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--mix">
          <el-select
            v-model="search.carrier"
            clearable
            style="width: 100px"
            placeholder="选择运营商"
            @change="onCarrierChange"
          >
            <el-option
              v-for="(key, val) in enums.carrier.maps()"
              :key="val"
              :label="key"
              :value="val"
            />
          </el-select>
          <el-select
            v-model="search.carrierAccountId"
            placeholder="运营商账号"
            clearable
            @change="onCarrierAcountIdChange"
          >
            <el-option
              v-for="item in signedCarrierList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-date-picker
            v-model="search.timeRange"
            clearable
            start-placeholder="开卡时间起始时间"
            end-placeholder="开卡时间结束时间"
            type="daterange"
            placeholder="时间范围"
            @change="onTimeChange"
          />
          <el-select
            v-model="search.netType"
            placeholder="网络类型"
            clearable
            multiple
            style="width: 300px"
            @change="onChargeTypeChange"
          >
            <el-option
              v-for="key in Object.keys(netTypeOptions)"
              :key="key"
              :value="key"
              :label="netTypeOptions[key]"
            />
          </el-select>
          <el-select
            v-model="search.cardMaterial"
            placeholder="材质"
            clearable
            style="width: 100px"
            @change="onSearch"
          >
            <el-option
              v-for="key in Object.keys(materialTypeOptions)"
              :key="key"
              :value="key"
              :label="materialTypeOptions[key]"
            />
          </el-select>
          <el-select
            v-model="search.cardSpecification"
            placeholder="规格"
            clearable
            style="width: 100px"
            @change="onSearch"
          >
            <el-option
              v-for="key in Object.keys(specificationTypeOptions)"
              :key="key"
              :value="key"
              :label="specificationTypeOptions[key]"
            />
          </el-select>
          <el-input
            v-model="search.batchNo"
            placeholder="批次号"
            style="width: 220px"
            @change="onSearch"
          />
          <el-input
            v-model="search.iccid"
            placeholder="输入iccid查询批次号"
            style="width: 160px"
            @change="onSearch"
          />
          <el-button type="primary" @click="onSearch">查询</el-button>
        </div>
      </div>

      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData" height="calc(100vh - 210px)">
            <el-table-column label="序号" align="center" width="80">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="operator" label="操作人" />
            <el-table-column prop="outputTime" label="开卡时间" min-width="100px">
              <template slot-scope="{ row }">
                {{ row.outputTime | dateFilter('YYYY-MM-DD') }}
              </template>
            </el-table-column>
            <el-table-column label="运营商(ID)" min-width="230">
              <template slot-scope="scope">
                <wh-carrier-icon :carrier="scope.row.carrier" />
                <span class="card-manage__table--content">{{ scope.row.carrierName }}</span>
                <span class="card-manage__table--content">({{ scope.row.carrierAccountId }})</span>
              </template>
            </el-table-column>
            <el-table-column prop="cardMaterial" label="材质">
              <template slot-scope="{ row }">
                {{ materialTypeOptions[row.cardMaterial] }}
              </template>
            </el-table-column>

            <el-table-column prop="cardSpecification" label="规格">
              <template slot-scope="{ row }">
                {{ specificationTypeOptions[row.cardSpecification] }}
              </template>
            </el-table-column>
            <el-table-column prop="netType" label="网络类型" width="200">
              <template slot-scope="{ row }">
                {{ stringMap(row.netType) }}
              </template>
            </el-table-column>
            <el-table-column prop="deviceCount" label="开卡数量">
              <template slot-scope="{ row }">
                {{ row.deviceCount }}
              </template>
            </el-table-column>
            <el-table-column prop="detail" label="详细数据">
              <template slot-scope="{ row }">
                <el-button type="text" @click="downloadIccid(row)">iccid明细表</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="batchNo" label="批次号" min-width="170">
              <template slot-scope="{ row }">
                {{ row.batchNo }}
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
            @current-change="changeIndex"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
.wh__tools--mix {
  & > div {
    margin: 2px 0;
  }
}
</style>
