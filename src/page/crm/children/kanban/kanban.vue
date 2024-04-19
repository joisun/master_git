<script>
import BaseInfo from './components/base-info.vue'
import CustomerFunnel from './components/customer-funnel.vue'
import SalesPerformance from './components/sales-performance.vue'
import IndustryAnalysis from './components/industry-analysis.vue'
import ConsumeDate from './components/consume-date.vue'
import apis from '@/api/ajax'
import Ranks from '@/page/crm/children/kanban/components/ranks.vue'
export default {
  components: {
    CustomerFunnel,
    IndustryAnalysis,
    ConsumeDate,
    BaseInfo,
    Ranks
  },
  data() {
    return {
      sellerList: [],
      saleId: '',
      baseInfo: {}
    }
  },
  created() {
    this.getSubordinates()
    this.getBaseInfo()
  },
  methods: {
    async getSubordinates() {
      const { success, data } = await apis.crm.getSubordinates()
      if (!success) {
        return false
      }
      this.sellerList = data
    },
    // 获取基本信息和客户漏斗信息
    async getBaseInfo() {
      let { success, data } = await apis.crm.customerReportBaseInfo({ saleId: this.saleId })
      if (!success) return false
      this.baseInfo = data
    }
  }
}
</script>

<template>
  <div class="kanban wh__warp">
    <div class="wh__header">
      <h2 class="wh-title">销售看板</h2>
    </div>
    <div class="wh__tools">
      <el-select v-model="saleId" placeholder="选择销售" clearable @change="getBaseInfo">
        <el-option
          v-for="item in sellerList"
          :key="item.saleId"
          :value="item.saleId"
          :label="item.realName"
        >
        </el-option>
      </el-select>
    </div>
    <div class="wh__body">
      <el-card class="mb20">
        <base-info :base-info="baseInfo"></base-info>
      </el-card>
      <div class="flex">
        <div class="flex2 mr20">
          <el-card class="box-card">
            <div slot="header">客户漏斗</div>
            <customer-funnel :base-info="baseInfo"></customer-funnel>
          </el-card>
        </div>
        <div class="flex1">
          <el-card class="box-card">
            <ranks />
            <!--            <div slot="header">销售当月业绩排行</div>-->
            <!--            <sales-performance></sales-performance>-->
          </el-card>
        </div>
      </div>
      <div class="mt20">
        <el-card>
          <div slot="header">客户行业分析</div>
          <industry-analysis :sale-id="saleId"></industry-analysis>
        </el-card>
      </div>
      <div class="mt20">
        <el-card>
          <div slot="header">消费时间统计</div>
          <consume-date :sale-id="saleId"></consume-date>
        </el-card>
      </div>
    </div>
  </div>
</template>
