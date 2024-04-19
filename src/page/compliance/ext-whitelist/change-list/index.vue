<script>
import whSaleSelect from '@/page/components/wh-sales-select.vue'
import mixins from '@/page/compliance/ext-whitelist/mixins'
import DetailDialog from '../components/detail'
import moment from 'moment'
import filterQueryParams from '@/global/function/filterQueryParams'
export default {
  components: {
    whSaleSelect,
    DetailDialog
  },
  mixins: [mixins],
  data() {
    return {
      search: {
        timeRange: [],
        flowNo: '',
        orgId: '',
        orgName: '',
        type: '',
        status: '',
        saleName: '',
        carrier: '',
        iccid: ''
      },
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      changeList: [],
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changePage(val) {
      this.page.pageIndex = val
      this.getList()
    },
    async openDetail(row) {
      this.$router.push({ name: 'ext-whitelist-update-and-detail', query: { flowNo: row.flowNo } })
    },
    handleAdd() {
      this.$router.push({ name: 'ext-whitelist-update-and-detail' })
    },
    onSearch() {
      this.page.pageIndex = 1
      this.getList()
    },
    async getList() {
      const pathToApiMap = {
        'my-todos': 'complianceMyList',
        'compliance-change-list': 'complianceList'
      }
      this.loading = true
      const { search } = this
      const { timeRange = [] } = search
      const { success, data } = await this.jaxLib.whitelist[pathToApiMap[this.$route.name]](
        filterQueryParams({
          ...this.search,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize,
          begin: timeRange.length ? moment(timeRange[0]).format('YYYY-MM-DD') : '',
          end: timeRange.length ? moment(timeRange[1]).format('YYYY-MM-DD') : ''
        })
      )
      this.loading = false
      if (!success) return false
      this.changeList = data.list
      this.page.total = data.page.allCount
    }
  }
}
</script>

<template>
  <div :key="$route.name" class="ext-whitelist-apply-list">
    <detail-dialog ref="detail" />
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-input
          v-model.trim="search.flowNo"
          style="width: 160px"
          placeholder="流程编号"
          @keyup.enter.native="onSearch"
        />

        <el-input
          v-model.trim="search.orgId"
          style="width: 180px"
          placeholder="请输入客户ID"
          @keyup.enter.native="onSearch"
        />
        <el-input
          v-model.trim="search.orgName"
          style="width: 180px"
          placeholder="请输入客户名称"
          @keyup.enter.native="onSearch"
        />
        <el-select v-model="search.type" placeholder="变更类型" clearable @change="onSearch">
          <el-option
            v-for="(key, val) in enums.complianceType.maps()"
            :key="val"
            :label="key"
            :value="val"
          />
        </el-select>
        <el-date-picker
          v-model="search.timeRange"
          :editable="false"
          start-placeholder="提交时间开始时间"
          end-placeholder="提交时间结束时间"
          type="daterange"
          style="width: 300px"
          class="wh__tools--search-filter"
          @change="onSearch"
        />
        <el-select v-model="search.status" placeholder="当前状态" clearable @change="getList()">
          <el-option
            v-for="(key, val) in enums.complianceStatus.maps()"
            :key="val"
            :label="key"
            :value="val"
          />
        </el-select>
        <wh-sale-select v-model="search.saleName" style="width: 160px" @change="onSearch" />
        <el-select
          v-model="search.carrier"
          placeholder="卡所属运营商"
          clearable
          style="width: 120px"
          @change="onSearch"
        >
          <el-option label="中国移动" value="cmcc" />
          <el-option label="中国电信" value="chinanet" />
        </el-select>
        <el-input
          v-model="search.iccid"
          placeholder="请输入ICCID"
          class="wh__tools--search-input"
          @keyup.native.enter="onSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="onSearch" />
        </el-input>
        <div class="card-manage__search--button mr10">
          <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
        </div>
        <div style="display: flex; align-items: center">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd()">新 增</el-button>
        </div>
      </div>
    </div>
    <div v-loading="loading" class="wh__body">
      <div class="wh__body--table">
        <el-table :data="changeList">
          <el-table-column key="index" label="序号" fixed width="80px">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column key="flowNo" label="流程编号" fixed min-width="100px">
            <template slot-scope="scope">
              <el-button type="text" @click="openDetail(scope.row)"
                >{{ scope.row.flowNo }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column key="type" label="变更类型">
            <template slot-scope="scope">{{ scope.row.type | complianceTypeFilter }}</template>
          </el-table-column>
          <el-table-column key="changeReason" label="变更原因">
            <template slot-scope="scope">{{
              scope.row.changeReason | complianceChangeReasonFilter
            }}</template>
          </el-table-column>
          <el-table-column key="customId" label="客户名称(ID)" min-width="200px">
            <template slot-scope="scope">{{ scope.row.orgName }}({{ scope.row.orgId }})</template>
          </el-table-column>
          <el-table-column key="saleName" label="所属销售" width="100px">
            <template slot-scope="scope">{{ scope.row.sale | saleFilter }}</template>
          </el-table-column>
          <el-table-column key="gmtModified" label="最后处理时间" align="center" min-width="200px">
            <template #default="{ row }">{{ row.gmtModified | dateFilter }}</template>
          </el-table-column>
          <el-table-column key="status" prop="status" width="110px" label="当前处理状态">
            <template #default="{ row }">
              <span>{{ row.status | complianceStatusFilter }}</span>
            </template>
          </el-table-column>

          <el-table-column key="submitter" label="当前处理人" width="120px">
            <template slot-scope="scope">{{ scope.row.processor }}</template>
          </el-table-column>
          <el-table-column key="carrier" label="卡所属运营商" prop="carrier" align="center">
            <template #default="{ row }">{{ row.carrier | carrierFilter }}</template>
          </el-table-column>
          <el-table-column key="iccidCount" label="关联ICCID数" prop="count" align="center" />
          <el-table-column key="submitDate" label="提交时间" align="center" min-width="200px">
            <template #default="{ row }">{{ row.gmtCreated | dateFilter }}</template>
          </el-table-column>
        </el-table>
      </div>
      <div class="wh__body--page">
        <el-pagination
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          layout="total, prev, pager, next"
          :total="page.total"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ext-whitelist-apply-list {
  .status-hint {
    margin-right: 3px;
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .wh__tools--mix {
    & > div {
      margin: 2px 0;
    }
  }
}
</style>
