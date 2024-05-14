<script>
import DetailForm from '@/page/cpe/children/deviceExchange/components/detail-form'
import dateFormat from '@/global/filters/date-format'
const allColumns = {
  apply: [
    {
      label: '编号',
      prop: 'serialNo'
    },
    {
      label: '旧设备订单号',
      prop: 'oldTradeNo'
    },
    {
      label: '新设备订单号',
      prop: 'newTradeNo'
    },
    {
      label: '公司名称',
      prop: 'orgName'
    },
    {
      label: '申请人',
      prop: 'submitter'
    },
    {
      label: '申请时间',
      prop: 'requestDate'
    },
    {
      label: '处理状态',
      prop: 'linkStatusName'
    }
  ],
  audit: [
    {
      label: '编号',
      prop: 'serialNo'
    },
    {
      label: '旧设备订单号',
      prop: 'oldTradeNo'
    },
    {
      label: '公司名称',
      prop: 'orgName'
    },
    {
      label: '申请人',
      prop: 'submitter'
    },
    {
      label: '申请时间',
      prop: 'requestDate'
    },
    {
      label: '审核时间',
      prop: 'reviewDate'
    }
  ],
  shipment: [
    {
      label: '编号',
      prop: 'serialNo'
    },
    {
      label: '旧设备订单号',
      prop: 'oldTradeNo'
    },
    {
      label: '新设备订单号',
      prop: 'newTradeNo'
    },
    {
      label: '公司名称',
      prop: 'orgName'
    },
    {
      label: '申请人',
      prop: 'submitter'
    },
    {
      label: '申请时间',
      prop: 'requestDate'
    },
    {
      label: '寄货物时间',
      prop: 'deliveryDate'
    }
  ],
  recycle: [
    {
      label: '编号',
      prop: 'serialNo'
    },
    {
      label: '旧设备订单号',
      prop: 'oldTradeNo'
    },
    {
      label: '公司名称',
      prop: 'orgName'
    },
    {
      label: '申请人',
      prop: 'submitter'
    },
    {
      label: '申请时间',
      prop: 'requestDate'
    }
  ],
  examine: [
    {
      label: '旧MAC地址',
      prop: 'macAddr'
    },
    {
      label: '编号',
      prop: 'serialNo'
    },
    {
      label: '验收结果',
      prop: 'acceptanceStatusName'
    },
    {
      label: '申请人',
      prop: 'submitter'
    },
    {
      label: '申请验收时间',
      prop: 'requestDate'
    },
    {
      label: '备注',
      prop: 'remark'
    }
  ],
  factory: [
    {
      label: 'MAC地址',
      prop: 'macAddr'
    },
    {
      label: '返厂编号',
      prop: 'outSerialNo'
    },
    {
      label: '厂家寄回编号',
      prop: 'inSerialNo'
    },
    {
      label: '申请人',
      prop: 'submitter'
    },
    {
      label: '返厂状态',
      prop: 'returnFactoryStatusName'
    },
    {
      label: '寄回厂商快递单号',
      prop: 'outLogisticsNo'
    },
    {
      label: '厂商寄回快递单号',
      prop: 'inLogisticsNo'
    },
    {
      label: '备注',
      prop: 'remark'
    },
    {
      label: '返厂申请时间',
      prop: 'submitDate'
    },
    {
      label: '寄回厂家时间',
      prop: 'outDate'
    },
    {
      label: '厂家寄回收货时间',
      prop: 'inDate'
    }
  ]
}
const statusEnums = {
  linkStatus: {
    REVIEW: '待审核',
    DELIVERING: '待寄货',
    RECYCLING: '待回收',
    TESTING: '待测试',
    RETURN_FACTORY: '返厂维修',
    DONE: '完成',
    REFUSE: '拒绝'
  },
  reviewStatus: {
    REJECT: '拒绝',
    INIT: '新建',
    PASS: '通过'
  },
  returnFactoryStatus: {
    TO_BE_RETURN: '待返厂',
    RETURNING: '返厂中',
    DONE: '返厂完成'
  },
  acceptanceStatus: {
    RETURN_FACTORY: '返厂维修',
    INVENTORY: '库存',
    SEND_BACK: '寄回客户',
    TESTING: '待测试'
  }
}
const getPartialFieldsFromObj = (obj, fields = []) => {
  if (!obj) return {}
  if (!fields || fields.length === 0) return obj
  const _obj = {}
  Object.keys(obj).forEach((key) => {
    if (fields.includes(key)) {
      _obj[key] = obj[key]
    }
  })
  return _obj
}
export default {
  components: {
    'detail-form': DetailForm
  },
  props: {
    currentType: {
      type: String,
      require: true,
      default: ''
    },
    deviceList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      search: {},
      tableData: [],
      isLoading: false,
      page: {
        pageIndex: 1,
        pageSize: 30,
        total: 0
      },
      columns: [],
      dialogMount: false
    }
  },
  async created() {
    this.columns = allColumns[this.currentType]
    await this.getList()
  },
  methods: {
    async handleExport() {
      const params = {}
      const { tradeNo, macAddr, iccid } = this.search
      if (tradeNo) params.tradeNo = tradeNo
      if (macAddr) params.macAddr = macAddr
      if (iccid) params.iccid = iccid
      const { success, data } = await this.jaxLib.cpe.exportReturnFactory(params)
      if (!success) return false
      window.open(data)
      await this.getList(1)
    },
    detailFormConfrim() {
      this.getList()
      this.$emit('reload')
    },
    async handleDetailForm(row, type) {
      const noDetailApiWhitelist = ['examine']
      const detailDataField = {
        examine: ['id', 'macAddr', 'remark']
      }
      const data = noDetailApiWhitelist.includes(type) ? row : await this.getDetail(row.id)
      this.dialogMount = true
      this.$nextTick(() => {
        this.$refs.detailForm.open(getPartialFieldsFromObj(data, detailDataField[type] || []), type)
      })
    },
    async getDetail(id) {
      const apiMapper = {
        apply: 'getAfterSaleRequestListDetail',
        audit: 'getAfterSaleRequestListReviewDetail',
        shipment: 'getAfterSaleRequestListDeliverDetail',
        recycle: 'getAfterSaleRequestListRecyleDetail',
        examine: 'getAfterSaleRequestListAcceptanceDetail'
      }
      if (!apiMapper[this.currentType] || !id) return {}
      const res = await this.jaxLib.cpe[apiMapper[this.currentType]]({ id })
      if (res && res.success) {
        return res.data
      }
    },
    formatData(
      data,
      keys = ['requestDate', 'submitDate', 'inDate', 'outDate', 'reviewDate', 'deliveryDate'],
      enumKeys = ['linkStatus', 'reviewStatus', 'acceptanceStatus', 'returnFactoryStatus']
    ) {
      return data.map((item) => {
        Object.keys(item).forEach((key) => {
          if (keys.includes(key)) {
            item[key] = dateFormat(item[key])
          }
          if (enumKeys.includes(key)) {
            item[`${key}Name`] = statusEnums[key][item[key]]
          }
        })
        return item
      })
    },
    async getList(pageIndex = 1) {
      const apiMap = {
        apply: 'getAfterSaleRequestApplyList',
        audit: 'getAfterSaleRequestReviewList',
        shipment: 'getAfterSaleRequestDeliverList',
        recycle: 'getAfterSaleRequestRecycleList',
        examine: 'getAfterSaleAcceptanceList',
        factory: 'getAfterSaleReturnFactoryList'
      }
      this.pageIndex = pageIndex
      this.isLoading = true
      const params = { pageIndex, pageSize: 30 }
      const { tradeNo, macAddr, iccid } = this.search
      if (tradeNo) params.tradeNo = tradeNo
      if (macAddr) params.macAddr = macAddr
      if (iccid) params.iccid = iccid
      const { success, data } = await this.jaxLib.cpe[apiMap[this.currentType]](params)
      this.isLoading = false
      if (!success) return false
      this.tableData = this.formatData(data.list)
      this.page.total = data.page.allCount
    }
  }
}
</script>

<template>
  <div class="device-shipment-apply-list">
    <div class="wh__tools">
      <div class="wh__tools--search">
        <el-input
          v-model.trim="search.tradeNo"
          placeholder="输入订单号"
          name="searchField"
          class="wh__tools--search-input"
          style="width: 400px"
          @keyup.enter.native="getList(1)"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="getList(1)"> </el-button>
        </el-input>
        <el-input
          v-model.trim="search.macAddr"
          placeholder="输入MAC地址"
          name="searchField"
          class="wh__tools--search-input"
          style="width: 400px"
          @keyup.enter.native="getList(1)"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="getList(1)"> </el-button>
        </el-input>
        <el-input
          v-model.trim="search.iccid"
          placeholder="输入ICCID"
          name="searchField"
          class="wh__tools--search-input"
          style="width: 400px"
          @keyup.enter.native="getList(1)"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="getList(1)"> </el-button>
        </el-input>
        <div class="float-right">
          <div class="card-manage__search--button">
            <el-button
              v-if="currentType === 'apply'"
              type="primary"
              @click="handleDetailForm({}, 'apply')"
              >退换申请</el-button
            >
            <template v-else-if="currentType === 'examine'">
              <el-button type="primary" @click="handleDetailForm({}, 'batchExamineApply')"
                >批量测试申请</el-button
              >
              <el-button type="primary" @click="handleDetailForm({}, 'batchExamine')"
                >批量验收操作</el-button
              >
            </template>
            <template v-else-if="currentType === 'factory'">
              <el-button type="primary" @click="handleDetailForm({}, 'batchFactoryApply')"
                >批量返厂申请</el-button
              >
              <el-button type="primary" @click="handleDetailForm({}, 'batchFactory')"
                >批量返厂操作</el-button
              >
              <el-button type="primary" @click="handleDetailForm({}, 'batchFactoryDone')"
                >批量返厂完成</el-button
              >
              <el-button type="primary" :disabled="tableData.length === 0" @click="handleExport()"
                >导出</el-button
              >
            </template>
          </div>
        </div>
      </div>
    </div>
    <div v-loading="isLoading" class="wh__body">
      <el-table :data="tableData">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
        />
        <el-table-column v-if="currentType !== 'factory'" label="操作" align="center" width="250px">
          <template slot-scope="scope">
            <el-button
              v-if="currentType === 'apply'"
              size="mini"
              @click="handleDetailForm(scope.row, 'applyDetail')"
              >查看详情</el-button
            >
            <template v-else-if="currentType === 'audit'">
              <el-button
                v-if="scope.row.reviewStatus === 'INIT'"
                size="mini"
                @click="handleDetailForm(scope.row, 'audit')"
                >审核</el-button
              >
              <el-button v-else size="mini" @click="handleDetailForm(scope.row, 'auditDetail')"
                >审核详情</el-button
              >
            </template>
            <template v-else-if="currentType === 'shipment'">
              <el-button
                v-if="scope.row.reviewStatus === 'INIT'"
                size="mini"
                @click="handleDetailForm(scope.row, 'shipment')"
                >寄货</el-button
              >
              <el-button v-else size="mini" @click="handleDetailForm(scope.row, 'shipmentDetail')"
                >处理详情</el-button
              >
            </template>
            <template v-else-if="currentType === 'recycle'">
              <el-button
                v-if="scope.row.reviewStatus === 'INIT'"
                size="mini"
                @click="handleDetailForm(scope.row, 'recycle')"
                >回收</el-button
              >
              <el-button v-else size="mini" @click="handleDetailForm(scope.row, 'recycleDetail')"
                >回收详情</el-button
              >
            </template>
            <template v-else-if="currentType === 'examine'">
              <el-button
                v-if="scope.row.acceptanceStatus === 'TESTING'"
                size="mini"
                @click="handleDetailForm(scope.row, 'examine')"
                >验收</el-button
              >
              <el-button v-else size="mini" @click="handleDetailForm(scope.row, 'examineDetail')"
                >验收详情</el-button
              >
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="wh__body--page">
        <el-pagination
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          layout="total, prev, pager, next"
          :total="page.total"
          @current-change="getList"
        >
        </el-pagination>
      </div>
    </div>
    <detail-form
      v-if="dialogMount"
      ref="detailForm"
      :type="currentType"
      :device-list="deviceList"
      @confirm="detailFormConfrim"
    />
  </div>
</template>
