<template>
  <el-dialog
    title="熔断详情"
    :visible.sync="visible"
    :footer="null"
    fullscreen
    @close="visible = false"
  >
    <el-tabs v-model="activeTab" @tab-click="changeTab">
      <el-tab-pane label="运营商维度" name="carrier" />
      <el-tab-pane label="停卡原因维度" name="reason" />
      <el-tab-pane label="客户维度" name="customer" />
      <el-tab-pane label="停卡详情" name="detail" />
    </el-tabs>
    <el-table
      v-if="activeTab === 'carrier'"
      key="carrier"
      v-loading="loading"
      :data="tableDataMap.carrier"
      height="calc(100vh - 130px)"
    >
      <el-table-column prop="carrier" label="运营商">
        <template slot-scope="scope">{{ scope.row.carrier | carrierFilter }}</template>
      </el-table-column>
      <el-table-column prop="carrierName" label="运营商名" />
      <el-table-column prop="count" label="数量" />
    </el-table>
    <el-table
      v-if="activeTab === 'reason'"
      key="reason"
      v-loading="loading"
      :data="tableDataMap.reason"
      height="calc(100vh - 130px)"
    >
      <el-table-column prop="changeReason" label="停卡原因" />
      <el-table-column prop="carrier" label="运营商">
        <template slot-scope="scope">{{ scope.row.carrier | carrierFilter }}</template>
      </el-table-column>
      <el-table-column prop="count" label="数量" />
    </el-table>
    <el-table
      v-if="activeTab === 'customer'"
      key="customer"
      v-loading="loading"
      :data="tableDataMap.customer"
      height="calc(100vh - 130px)"
    >
      <el-table-column prop="orgName" label="客户名称" />
      <el-table-column prop="orgId" label="orgId" />
      <el-table-column prop="cardPoolId" label="所在流量池id" />
      <el-table-column prop="count" label="数量" />
    </el-table>
    <el-table
      v-if="activeTab === 'detail'"
      key="detail"
      v-loading="loading"
      :data="tableDataMap.detail"
      height="calc(100vh - 130px)"
    >
      <el-table-column prop="orgName" label="客户名称" />
      <el-table-column prop="iccid" label="iccid" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="gprsStatus" label="gprs状态" />
      <el-table-column prop="physicalStatus" label="停复机状态" />
      <el-table-column prop="carrierAccountId" label="供应商id" />
      <el-table-column prop="carrierName" label="供应商名称" />
      <el-table-column prop="cardPoolId" label="所在流量池id" />
      <el-table-column prop="cardPoolUsagePercentage" label="流量池用量占比" />
      <el-table-column prop="mouthUsage" label="本月月用量" />
      <el-table-column prop="dayUsage" label="停卡当天用量" />
      <el-table-column prop="changeReason" label="停卡原因" />
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      activeTab: 'carrier',
      loading: false,
      tableDataMap: {
        carrier: [],
        reason: [],
        customer: [],
        detail: []
      }
    }
  },
  async created() {},
  methods: {
    changeTab() {
      this.queryTableData()
    },
    async open() {
      this.visible = true
      await this.queryTableData()
    },
    async queryTableData() {
      const {
        deactivedCardFuseCarrier,
        deactivedCardFuseReason,
        deactivedCardFuseCustomer,
        deactivedCardFuseDetails
      } = this.jaxLib.stopCardFuse
      const tabMap = {
        carrier: deactivedCardFuseCarrier,
        reason: deactivedCardFuseReason,
        customer: deactivedCardFuseCustomer,
        detail: deactivedCardFuseDetails
      }
      this.loading = true
      const res = await tabMap[this.activeTab]()
      this.loading = false
      if (!res.success) return
      // this.tableData = res.data
      this.tableDataMap[this.activeTab] = res.data
    }
  }
}
</script>
