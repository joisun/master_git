<!-- bo: Business Opportunity -->
<script>
import apis from "@/api/ajax";
import BaseInfo from "./components/base-info.vue";
import CustomerFunnel from "./components/customer-funnel.vue";
export default {
  components: {
    CustomerFunnel,
    BaseInfo,
  },
  data() {
    return {
      // filter options
      sellerList: [],
      sourceList: [],
      tagList: [],
      areaList: [],
      // filter params
      timeRange: [],
      saleId: "",
      areaId: "",
      sourceId: "",
      tagId: "",

      // base info
      baseInfo: {},

      //loadings
      loadingRemoteInputTag: false,
    };
  },
  created() {
    this.getSubordinates();
    this.getBaseInfo();
  },
  methods: {
    async getSubordinates() {
      const { success, data } = await apis.crm.getSubordinates();
      if (!success) {
        return false;
      }
      this.sellerList = data;
    },
    // 获取基本信息和客户漏斗信息
    async getBaseInfo() {
      let { success, data } = await apis.crm.customerReportBaseInfo({
        saleId: this.saleId,
      });
      if (!success) return false;
      this.baseInfo = data;
    },
    async onSearch() {},
    async getRemoteInputTagList(query) {
      this.loadingRemoteInputTag = true;
      const ret = await apis.crm.inputTagSearch({ keyword: query || "" });
      this.tagList = ret.data.records;
      this.loadingRemoteInputTag = false;
    },
  },
};
</script>

<template>
  <div class="kanban wh__warp">
    <div class="wh__header">
      <h2 class="wh-title">BO看板</h2>
    </div>
    <div
      class="wh__tools"
      style="display: flex; justify-content: flex-start; gap: 10px"
    >
      <el-select clearable multiple v-model="areaID" placeholder="选择地区">
        <el-option
          v-for="item in areaList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>

      <el-select
        v-model="saleId"
        placeholder="选择销售"
        clearable
        @change="getBaseInfo"
      >
        <el-option
          v-for="item in sellerList"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        >
        </el-option>
      </el-select>

      <el-date-picker 
        style="width: 15em"
        v-model="timeRange"
        type="monthrange"
        start-placeholder="开始月份"
        end-placeholder="结束月份"
        @change="onSearch"
      />

      <el-select
        clearable
        filterable
        remote
        :remote-method="getRemoteInputTagList"
        :loading="loadingRemoteInputTag"
        v-model="tagId"
        placeholder="选择标签"
        @change="onSearch"
      >
        <el-option
          v-for="item in tagList"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        >
        </el-option>
      </el-select>

      <el-select
        v-model="sourceId"
        placeholder="选择来源"
        clearable
        @change="onSearch"
      >
        <el-option
          v-for="item in sourceList"
          :key="item.id"
          :value="item.id"
          :label="item.name"
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
      </div>
    </div>
  </div>
</template>
