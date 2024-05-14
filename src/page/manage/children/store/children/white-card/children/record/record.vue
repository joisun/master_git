<script>
import ActiveCards from '@/page/manage/children/store/children/white-card/children/record/components/active-cards'
function toLine(name) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase()
}
export default {
  name: 'carrier-nb-renew-record-list',
  components: {
    ActiveCards
  },
  data() {
    return {
      summary: {
        allCount: 0,
        outputCount: 0,
        remainingCount: 0
      },
      signedCarrierList: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      search: {
        iccid: '',
        carrier: '',
        carrierAccountId: '',
        netType: '',
        cardMaterial: '',
        cardSpecification: '',
        orderByClause: ''
      },
      materialTypeOptions: {},
      netTypeOptions: {},
      specificationTypeOptions: {},
      tableData: [],
      loading: false,
      baseContent: {},
      carrierChargeId: '',
      carrier: 'cmcc',
      cardListData: {}
    }
  },
  created() {
    this.getEnums()
    this.getList()
    this.getOverviewData()
  },

  methods: {
    handleDelete(row) {
      this.$confirm('仅删除未开卡数据，已开卡数据保留。确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { success } = await this.jaxLib.store.deviceBaseBlankDelete({ id: row.id })
          if (success) {
            this.$message.success('操作成功')
            await this.getList()
          }
        })
        .catch(() => {})
    },
    onActiveCardsChange(isOnlyExport) {
      !isOnlyExport && this.onSearch()
    },
    stringMap(str) {
      if (!str) str
      return str
        .split(',')
        .map((item) => this.netTypeOptions[item])
        .join()
    },
    onSortChange({ prop, order }) {
      const orderMap = {
        descending: 'desc',
        ascending: 'asc'
      }
      if (!order) {
        this.search.orderByClause = ''
      } else {
        this.search.orderByClause = `${toLine(prop)} ${orderMap[order]}`
      }
      this.onSearch()
    },
    onCarrierAcountIdChange() {
      this.onSearch()
      this.getOverviewData()
    },
    onCarrierChange(v) {
      this.search.carrierAccountId = ''
      this.signedCarrierList = []
      v && this.getSignedCarrierList()
      this.onSearch()
      this.getOverviewData()
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
    },
    handleActiveCard(item, isAll = false) {
      this.$refs.activeCard.open(item, isAll)
    },
    onAddConfirm() {
      this.onSearch()
    },
    // onTimeChange() {
    //   this.onSearch()
    // },
    onChargeTypeChange() {
      this.search.chargeCategoryId = ''
      this.onSearch()
    },
    async getCarrierConfig() {
      this.loading = true
      let rst = await this.jaxLib.financial.getChargeByCarrierId({
        carrier: this.carrier,
        chargeId: this.carrierChargeId
      })
      this.loading = false
      if (!rst.success) return false
      this.baseContent = rst.data
    },
    openAdd() {
      this.$refs.addDialog.open()
    },
    onSearch() {
      this.page.pageIndex = 1
      this.getList()
      this.getOverviewData()
    },
    async getList() {
      this.loading = true
      const { pageIndex, pageSize } = this.page
      // const { iccid, cardMaterial, cardSpecification, batchNo } = this.search
      // let startTime = ''
      // let endTime = ''
      // if (timeRange && timeRange.length === 2) {
      //   ;[startTime, endTime] = [
      //     dateFormat(timeRange[0], 'YYYY-MM-DD HH:mm:ss'),
      //     dateFormat(timeRange[1], 'YYYY-MM-DD HH:mm:ss')
      //   ]
      // }
      const {
        data: {
          page: { allCount },
          list
        },
        success
      } = await this.jaxLib.store.deviceBaseBlankImportList({
        ...this.search,
        netType: this.search.netType ? this.search.netType.join() : '',
        pageNo: pageIndex,
        pageSize: pageSize
      })
      this.loading = false
      if (!success) return false
      this.tableData = list
      this.page.total = allCount
    },
    changeIndex(val) {
      this.page.pageIndex = val
      this.getList()
    },
    handelOpenCardDetail(row) {
      this.$refs.cardTableDialog.open(row.id)
    },
    async getCardDetail({ id, pageNo = 1, pageSize = 10, iccid = '' }) {
      const { data, success } = await this.jaxLib.store.carrierRechargeRecordCardList({
        id,
        iccid,
        pageNo,
        pageSize
      })
      this.loading = false
      if (!success) return false
      this.cardListData = data
    },
    async getOverviewData() {
      const { carrier, carrierAccountId, netType, cardMaterial, cardSpecification, batchNo } =
        this.search
      const { data, success } = await this.jaxLib.store.deviceBaseBlankSummary({
        carrier,
        carrierAccountId,
        netType: this.search.netType ? this.search.netType.join() : '',
        cardMaterial,
        cardSpecification,
        batchNo
      })
      if (success) {
        this.summary = data
      }
    }
  }
}
</script>

<template>
  <div class="inventory-modify-list">
    <active-cards ref="activeCard" @confirm="onActiveCardsChange" />
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">白卡入库记录</h2>
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
          <!-- <el-date-picker
            v-model="search.timeRange"
            clearable
            type="datetimerange"
            placeholder="时间范围"
            @change="onTimeChange"
          /> -->
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
      <el-row :gutter="10" class="blank-card-overview">
        <el-col :span="8">
          <el-card shadow="never">
            <div class="blank-card-overview-item">
              <div class="blank-card-overview-item-title">白卡总数</div>
              <div class="blank-card-overview-item-value">
                {{ summary.allCount | toLocaleString }}
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <div class="blank-card-overview-item">
              <div class="blank-card-overview-item-title">开卡总数</div>
              <div class="blank-card-overview-item-value">
                {{ summary.outputCount | toLocaleString }}
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <div class="blank-card-overview-item">
              <div class="blank-card-overview-item-title">库存总数</div>
              <div class="blank-card-overview-item-value">
                {{ summary.remainingCount | toLocaleString }}
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData" height="calc(100vh - 210px)" @sort-change="onSortChange">
            <el-table-column prop="index" label="序号" width="50">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="batchNo" label="批次号" min-width="200" />
            <el-table-column label="运营商(ID)" min-width="230">
              <template slot-scope="scope">
                <wh-carrier-icon :carrier="scope.row.carrier" />
                <span class="card-manage__table--content">{{ scope.row.carrierName }}</span>
                <span class="card-manage__table--content">({{ scope.row.carrierAccountId }})</span>
              </template>
            </el-table-column>
            <el-table-column prop="gmtCreated" label="白卡入库时间" sortable="custom" width="150">
              <template slot-scope="{ row }">
                {{ row.gmtCreated | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="netType" label="网络类型" width="200">
              <template slot-scope="{ row }">
                {{ stringMap(row.netType) }}
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
            <el-table-column prop="deviceCount" label="入库白卡数量" align="center" />
            <el-table-column prop="deviceRemainingCount" label="白卡剩余数量" align="center" />
            <el-table-column prop="operator" label="操作人" sortable="custom" />
            <el-table-column
              prop="operator"
              label="操作"
              width="300px"
              align="center"
              fixed="right"
            >
              <template slot-scope="{ row }">
                <el-button @click="handleDelete(row)">删除</el-button>
                <el-button @click="handleActiveCard(row)">部分开卡</el-button>
                <el-button type="primary" @click="handleActiveCard(row, true)">全部开卡</el-button>
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

<style lang="scss" scoped>
.blank-card-overview {
  margin: 15px 0;
  .blank-card-overview-item {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .blank-card-overview-item-title {
      font-size: 16px;
      color: #999;
    }
    .blank-card-overview-item-value {
      font-size: 20px;
      color: #333;
    }
  }
}
</style>
