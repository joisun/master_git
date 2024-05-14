<script>
import moment from 'moment'
import carrierMap from '@/collect/carrier-map'
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
import Download from '@/page/components/wh-download/wh-download'
import MultiCarrierAccountSelect from '@/page/manage/children/finance/children/finance-ledger/children/finance-ledger-carrier/multi-carrier-account-select.vue'
import filterQueryParams from '@/global/function/filterQueryParams'

export default {
  data() {
    return {
      signedCarrierList: [],
      allSignedCarrierList: {},
      carriers: carrierMap.beTemplate(),
      listPlace: [],
      search: {
        carrier: 'cmcc',
        signedCarrierId: '',
        accountId: [],
        time: moment().subtract(1, 'months').format('YYYY-MM')
      },
      tableData: [],
      page: {
        pageSize: 20,
        pageIndex: 1,
        total: 0
      },
      totalVolumeFee: 0,
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      file: {
        fileUploadLoading: false,
        displayImport: false,
        fileMulti: [],
        computedId: ''
      }
    }
  },
  components: {
    MultiCarrierAccountSelect,
    'wh-carrier-account-select': whCarrierAccountSelect
  },
  created() {
    this.getSignedCarrierList()
  },
  methods: {
    async getSignedCarrierList() {
      if (this.allSignedCarrierList[this.search.carrier]) {
        this.signedCarrierList = this.allSignedCarrierList[this.search.carrier]
        return
      }
      const { success, data } = await this.jaxLib.store.signedCarrierListGet({
        carrier: this.search.carrier
      })
      if (!success) return false
      this.allSignedCarrierList[this.search.carrier] = data
      this.signedCarrierList = this.allSignedCarrierList[this.search.carrier]
    },
    changeIndex(val) {
      this.page.pageIndex = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.fetchData()
    },
    searchOther() {
      this.page.pageIndex = 1
      this.fetchData()
    },
    fetchData() {
      const { accountId } = this.search
      if (accountId.length > 1 || !this.search.accountId.length) {
        this.getListSummary()
      } else {
        if (!this.search.accountId.length) return
        this.getList()
      }
    },
    async getListSummary() {
      if (!this.search.signedCarrierId) {
        this.tableData = []
        this.totalVolumeFee = 0
        return
      }
      this.loading = true
      let rst = await this.jaxLib.financial.recordBill.listSummary(
        filterQueryParams({
          carrierAccountIds: this.search.accountId,
          month: moment(this.search.time).format('YYYY-MM-01'),
          signedCarrierId: this.search.signedCarrierId,
          carrier: this.search.carrier
        })
      )
      this.getSum({
        carrierAccountIds: this.search.accountId,
        signedCarrierId: this.search.signedCarrierId,
      })
      this.loading = false
      if (!rst.success)  {
        this.tableData = []
        return false
      }
      this.tableData = rst.data.map((item, index) => {
        return {
          id: index+1,
          ...item,
          isParent: true,
          cardCount: item.totalCardCount,
          volumeFee: item.totalVolumeFee,
          usageVolume: item.totalUsageVolume,
          offerPrice: item.averageOfferPrice,
          offerVolume: item.totalOfferVolume,
          discount: item.averageDiscount
        }
      })
    },
    async getList() {
      if (!this.search.accountId) return false
      this.loading = true
      let rst = await this.jaxLib.financial.recordBill.get(
        filterQueryParams({
          carrierAccountId: this.search.accountId[0],
          month: moment(this.search.time).format('YYYY-MM-01'),
          signedCarrierId: this.search.signedCarrierId,
          carrier: this.search.carrier,
          rowsPerPage: this.page.pageSize,
          currentPage: this.page.pageIndex
        })
      )
      this.getSum({ carrierAccountId: this.search.accountId[0] })
      this.loading = false
      if (!rst.success) return false
      this.tableData = rst.data.list
      this.page.total = rst.data.page.allCount
    },
    async getSum(params) {
      let rst = await this.jaxLib.financial.recordBill.getSum(
        filterQueryParams({
          ...params,
          month: moment(this.search.time).format('YYYY-MM-01'),
          carrier: this.search.carrier,
        })
      )
      if (!rst.success) return false
      this.totalVolumeFee = rst.data.totalVolumeFee
    },
    handleCarrierChange(){
      this.search.signedCarrierId = ''
      this.search.accountId = []
      this.getSignedCarrierList()
      // this.getListSummary()
      // this.getSum()
    },
    carrierAccountParams() {
      const { accountId } = this.search
      if (!accountId.length) return {}
      return accountId.length > 1
        ? {
            carrierAccountIds: this.search.accountId
          }
        : {
            carrierAccountId: this.search.accountId[0]
          }
    },
    async downLedger() {
      const { data, success } = await this.jaxLib.financial.recordBill.down({
        ...this.carrierAccountParams(),
        month: moment(this.search.time).format('YYYY-MM-01'),
        carrier: this.search.carrier,
        signedCarrierId: this.search.signedCarrierId
      })
      if (!success) return false
      await Download({ ...data })
    },
    openFileDiff(row) {
      this.file.displayImport = true
      this.file.computedId =
        row.list && row.list.length ? row.list.map((item) => item.id).join(',') : row.id
    },
    onExportClick(response) {
      this.file.fileUploadLoading = false
      if (response.success && response.data.url) {
        this.file.displayImport = false
        window.location.href = response.data.url
      } else {
        this.fileMulti = []
        this.$message.error('上传失败')
      }
    }
  },
  computed: {
    computedSystem() {
      return { system: 'captain', filter: '', id: this.file.computedId }
    }
  }
}
</script>

<template>
  <div class="record-bill-carrier">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-select v-model="search.carrier" placeholder="请选择运营商" @change="handleCarrierChange">
          <el-option
            v-for="(val, key) in enums.carrier.maps()"
            :label="val"
            :value="key"
            :key="key"
          />
        </el-select>
        <el-select v-model="search.signedCarrierId" @change="searchOther" clearable>
          <el-option
            v-for="item in signedCarrierList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          />
        </el-select>
        <multi-carrier-account-select
          style="width: 400px"
          v-if="search.carrier && search.signedCarrierId"
          v-model="search.accountId"
          :signedCarrierId="search.signedCarrierId"
          :carrier="search.carrier"
          placeholder="请选择运营商账号，不选查询全部"
          @change="searchOther"
        />
        <el-date-picker
          v-model="search.time"
          type="month"
          placeholder="选择月"
          :clearable="false"
          format="yyyy-MM"
          :picker-options="pickerOptions"
          @change="searchOther"
        >
        </el-date-picker>
        <div style="margin-top: 20px"  v-if="this.search.signedCarrierId">
          <el-tooltip class="item" effect="dark" content="不包括卡费、短信费" placement="top-start">
            <span
              >账单金额：
              <span style="font-weight: 600; font-size: 22px;" v-loading="loading">
                ¥ {{ totalVolumeFee | numberFilter }}
              </span>
            </span>
          </el-tooltip>
        </div>
        <el-button
          @click="downLedger"
          class="float-right"
          :disabled="!tableData.length"
          style="margin-bottom: 10px"
          >导出对账单</el-button
        >
      </div>
    </div>
    <div class="wh__body" v-loading="loading" v-if="this.search.signedCarrierId">
      <template>
        <div class="wh__body--table">
          <el-table
            :data="tableData"
            height="calc(100vh - 260px)"
            default-expand-all
            :row-key="row => row.id"
            :tree-props="{ children: 'list', hasChildren: 'hasChildren' }"
          >
            <el-table-column label="收费类目" min-width="200px" prop="name">
              <template #default="{ row }">
                {{ row.isParent ? `${row.feeCategory}` : search.accountId.length === 1 ? row.name : '' }}
              </template>
            </el-table-column>
            <el-table-column label="序号" :min-width="60" prop="id">
              <template #default="{$index, row }">
                {{row.id}}
              </template>
            </el-table-column>
            <el-table-column label="运营商账号"  :min-width="240" v-if="search.accountId.length !==1">
              <template #default="{row}">
                {{row.isParent ? '汇总' : row.carrierAccountName }}
              </template>
            </el-table-column>

            <el-table-column label="计费卡数(张)" prop="cardCount"> </el-table-column>
            <el-table-column label="费用(元)">
              <template slot-scope="scope">
                <div>{{ scope.row.volumeFee | numberFilter }}</div>
              </template>
            </el-table-column>
            <el-table-column label="用量(MB/次/条)" :min-width="140">
              <template slot-scope="scope">
                <div>{{ scope.row.usageVolume }}</div>
              </template>
            </el-table-column>
            <el-table-column label="套餐总量">
              <template slot-scope="scope">
                <div>{{ scope.row.offerVolume | volumeFilter }}</div>
              </template>
            </el-table-column>
            <el-table-column label="套餐标准价">
              <template slot-scope="scope">
                <div>{{ scope.row.offerPrice | numberFilter }}</div>
              </template>
            </el-table-column>
            <el-table-column label="套餐折扣" prop="discount" width="80px">
              <template slot-scope="scope">
                <div>{{ scope.row.discount | numberFilter }}</div>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button @click="openFileDiff(scope.row)" class="float-right" size="small"
                  >详单比较
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="wh__body--page" v-if="search.accountId.length === 1">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="changeIndex"
            :current-page="page.pageIndex"
            :page-size="page.pageSize"
            :page-sizes="[20, 40, 60, 100, 200, 500]"
            :total="page.total"
            layout="sizes, pager, total"
          />
        </div>
      </template>
    </div>
    <el-dialog title="导入比较文件" size="tiny" :visible.sync="file.displayImport">
      <div v-loading="file.fileUploadLoading">
        <el-upload
          accept="xlsx"
          name="price-excel"
          :show-file-list="false"
          :data="computedSystem"
          :multiple="false"
          :file-list="file.fileMulti"
          :on-success="onExportClick"
          :before-upload="() => (file.fileUploadLoading = true)"
          action="/ajax/financial/ledger/diff"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传xlsx文件，且应当是序号{{
              file.computedId
            }}的详单,请确认详单中含有iccid或msisdn列
          </div>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>
