<template>
  <div class="compliance-change-list">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-input
          v-model.trim="search.iccids"
          style="width: 160px"
          placeholder="请输入iccid"
          @keyup.enter.native="onSearch"
        >
        </el-input>
        <el-select
          v-model="search.carrier"
          placeholder="运营商"
          style="width: 100px"
          clearable
          @change="onSearch()"
        >
          <el-option
            v-for="(value, key) in enums.carrier.maps()"
            :key="key"
            :label="value"
            :value="key"
          >
          </el-option>
        </el-select>
        <wh-carrier-account-select
          v-model="search.carrierAccountId"
          class="card-manage__search--select"
          placeholder="运营商账号"
          :carrier="search.carrier"
          @change="onSearch()"
        />
        <el-date-picker
          v-model="search.timeRange"
          :editable="false"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          type="daterange"
          style="width: 210px"
          class="wh__tools--search-filter"
          @change="onSearch"
        >
        </el-date-picker>
        <div class="card-manage__search--button mr10">
          <el-button icon="el-icon-search" type="primary" @click="getList(1)"> 搜索 </el-button>
        </div>
        <div style="display: flex; justify-content: flex-end; align-items: center">
          <el-button class="float-right wh__tools--mix-btn" icon="el-icon-upload" @click="onImport"
            >导入</el-button
          >
          <el-button icon="el-icon-plus" type="primary" @click="openDetail()"> 发起变更 </el-button>
        </div>
      </div>
    </div>
    <div v-loading="loading" class="wh__body">
      <div class="wh__body--table">
        <el-table :data="tableData">
          <el-table-column label="ID" prop="id" align="center" width="120px">
            <template slot-scope="scope">
              <el-button type="text" @click="openDetail(scope.row.id)"
                >{{ scope.row.id }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="运营商(ID)" prop="carrierAccountName" align="center">
            <template slot-scope="scope">
              {{ scope.row.carrierAccountName }}({{ scope.row.carrierAccountId }})
            </template>
          </el-table-column>
          <el-table-column label="增加限制" prop="addLimitation" align="center" />
          <el-table-column label="减少限制" prop="delLimitation" align="center" />
          <el-table-column label="变更卡数" prop="cardCount" align="center" />
          <el-table-column label="生效时间" prop="effectiveDate" align="center">
            <template slot-scope="scope">{{ scope.row.effectiveDate.time | dateFilter }}</template>
          </el-table-column>
        </el-table>
      </div>
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
    <detail-modal ref="detailModal" @confirm="getList" />
    <file-import :visible.sync="importDialog.visible" @refresh="getList" />
  </div>
</template>

<script>
import apis from '@/api/ajax'
import moment from 'moment'
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select'
import DetailModal from '../components/detail-modal'
import FileImport from '../components/file-import'
const carrierGroupMap = {
  unicomAccountList: '中国联通',
  cmccAccountList: '中国移动',
  chinanetAccountList: '中国电信'
}
export default {
  name: 'compliance-change',
  components: {
    'wh-carrier-account-select': whCarrierAccountSelect,
    'detail-modal': DetailModal,
    'file-import': FileImport
  },
  data() {
    return {
      tableData: [],
      loading: false,
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      carrierAccountGroups: [],
      search: {},
      importDialog: {
        visible: false
      }
    }
  },
  async created() {
    await this.getList()
  },
  methods: {
    onImport() {
      this.importDialog.visible = true
    },
    openDetail(id) {
      this.$refs.detailModal.open(id)
    },
    createChange() {},
    async getList(currentPage = 1) {
      this.loading = true
      const { timeRange, iccids, carrierAccountId, carrier } = this.search
      let startDate = '',
        endDate = ''
      if (timeRange && timeRange.length) {
        startDate = moment(timeRange[0]).format('YYYY-MM-DD HH:mm:ss')
        endDate = moment(timeRange[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      const res = await apis.whitelist.cardLimitationChangeList({
        currentPage,
        rowsPerPage: 10,
        iccids,
        carrierAccountId,
        carrier,
        startDate,
        endDate
      })
      this.loading = false
      if (!res || !res.success) {
        return false
      }
      this.tableData = res.data.list
      this.page.pageIndex = res.data.page.currentPage
      this.page.total = res.data.page.allCount
    },
    onSearch() {
      this.getList(1)
    },
    filerDataByKeyword(keyword, list, fields) {
      if (!keyword) return list
      return list.filter((item) => {
        return fields.some((field) => `${item[field]}`.indexOf(keyword) > -1)
      })
    }
  }
}
</script>

<style scoped></style>
