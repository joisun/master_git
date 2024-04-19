<script>
import { columns } from './mixins/const'
import AddDialog from './components/add/add'
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select'
import volumeFormat from '@/global/filters/volume-format'
import dateFormat from '@/global/filters/date-format'
import CardTableDialog from '@/page/card/card-operation/components/card-table-dialog/card-table-dialog'
export default {
  name: 'carrier-nb-renew-record-list',
  components: {
    'add-dialog': AddDialog,
    whCarrierAccountSelect,
    'card-table-dialog': CardTableDialog
  },
  data() {
    return {
      columns: columns,
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      search: {
        iccid: '',
        chargeType: '',
        chargeCategoryId: ''
      },
      tableData: [],
      loading: false,
      baseContent: {},
      carrierChargeId: '',
      carrier: 'cmcc',
      cardListData: {}
    }
  },
  computed: {
    chooseType() {
      let offer = this.baseContent.offerTypeList
      if (offer && offer.length) {
        return (
          this.baseContent.offerTypeList.find((e) => e.chargeType === this.search.chargeType) || {}
        )
      }
      return {}
    }
  },
  created() {
    this.getList()
  },

  methods: {
    onAddConfirm() {
      this.onSearch()
    },
    onTimeChange() {
      this.onSearch()
    },
    onChargeTypeChange(value) {
      this.search.chargeCategoryId = ''
      this.onSearch()
    },
    async onCarrierAccountChange(value, extra) {
      this.carrierChargeId = extra ? extra.carrierChargeId : ''
      this.search.chargeType = ''
      this.search.chargeCategoryId = ''
      this.baseContent = {}
      this.carrierChargeId && (await this.getCarrierConfig())
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
    },
    async getList() {
      this.loading = true
      const { pageIndex, pageSize } = this.page
      const { iccid, chargeCategoryId, chargeType, carrierAccountId, timeRange } = this.search
      let startTime = ''
      let endTime = ''
      if (timeRange && timeRange.length === 2) {
        [startTime, endTime] = [
          dateFormat(timeRange[0], 'YYYY-MM-DD HH:mm:ss'),
          dateFormat(timeRange[1], 'YYYY-MM-DD HH:mm:ss')
        ]
      }
      const {
        data: {
          page: { allCount },
          list
        },
        success
      } = await this.jaxLib.store.carrierRechargeRecordList({
        iccid,
        carrierAccountId,
        chargeCategoryId,
        chargeType,
        startTime,
        endTime,
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
    specificationFormat(obj) {
      let format = volumeFormat
      let unit = () => '月'
      if (this.chooseType.chargeType === 'CUSTOM') unit = (i) => `${i}个月`
      if (obj.chargeUnit === 'USE_COUNT_AS_VOLUME') format = (i) => `${i}次`
      return `${format(obj.chargeSpecification)}/${unit(obj.chargeValidity)} * ${obj.cardPeriod}`
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
    }
  }
}
</script>

<template>
  <div class="inventory-modify-list">
    <add-dialog ref="addDialog" @confirm="onAddConfirm" />
    <card-table-dialog ref="cardTableDialog" :data="cardListData" :get-data="getCardDetail" />
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">运营商侧NB续费记录</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--mix">
          <wh-carrier-account-select
            v-model="search.carrierAccountId"
            placeholder="请选择运营商账号"
            carrier="cmcc"
            class="ml20"
            :list-filter="(list) => list.filter((item) => !!item.nbIoTAccount)"
            @change="onCarrierAccountChange"
          />
          <el-select
            v-model="search.chargeType"
            placeholder="套餐类型"
            clearable
            @change="onChargeTypeChange"
          >
            <el-option
              v-for="item in baseContent.offerTypeList"
              :key="item.chargeType + item.chargeEntryId"
              :label="item.chargeTypeName"
              :value="item.chargeType"
            />
          </el-select>
          <el-select
            v-model="search.chargeCategoryId"
            placeholder="请选择套餐规格"
            clearable
            @change="onSearch"
          >
            <el-option
              v-for="item in chooseType.chargeTypeDetailVOS"
              :key="item.id"
              :value="item.id"
              :label="specificationFormat(item)"
            >
            </el-option>
          </el-select>
          <el-date-picker
            v-model="search.timeRange"
            clearable
            type="datetimerange"
            placeholder="时间范围"
            @change="onTimeChange"
          />
          <el-input
            v-model="search.iccid"
            placeholder="请输入iccid"
            style="width: 160px"
            @change="onSearch"
          />
          <el-button type="primary" size="mini" style="float: right" @click="openAdd()"
            >新增</el-button
          >
        </div>
      </div>
      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData" height="calc(100vh - 210px)">
            <el-table-column prop="recordNo" label="单号" />
            <el-table-column prop="rechargeCount" label="续费卡数">
              <template slot-scope="{ row }">
                <el-button type="text" @click="handelOpenCardDetail(row)">{{
                  row.rechargeCount
                }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="运营商信息" min-width="230">
              <template slot-scope="scope">
                <wh-carrier-icon :carrier="scope.row.carrier" />
                <span class="card-manage__table--content">{{
                  scope.row.carrierAccountId | carrierAccountFilter(scope.row.carrier)
                }}</span>
                <span class="card-manage__table--content">({{ scope.row.carrierAccountId }})</span>
              </template>
            </el-table-column>
            <el-table-column prop="priceOfferName" label="续费套餐">
              <template slot-scope="{ row }">
                {{ row.chargeCategoryName }}
              </template>
            </el-table-column>
            <el-table-column prop="gmtCreated" label="操作时间">
              <template slot-scope="{ row }">
                {{ row.gmtCreated | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="operator" label="操作人">
              <template slot-scope="{ row }">
                {{ row.operator }}
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
