<template>
  <div class="test-card wh__warp">
    <div class="wh__header">
      <h2 class="wh-title">黑白名单列表</h2>
    </div>
    <div class="wh__tools--search">
      <el-form :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="searchForm.cardNo" placeholder="ICCID、MSISDN" @change="queryWhiteList" :clearable="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="searchForm.reason" placeholder="原因" style="width:100%" @change="queryWhiteList" :clearable="true">
                <el-option v-for="(item, index) in reasonList" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="searchForm.status" placeholder="状态" @change="queryWhiteList" :clearable="true">
                <el-option
                  v-for="(value, key) in alertWhiteListStatus"
                  :key="key"
                  :label="value"
                  :value="key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="searchForm.type" placeholder="类型" @change="queryWhiteList" :clearable="true">
                <el-option
                  v-for="(value, key) in blackWhiteListType"
                  :key="key"
                  :label="value"
                  :value="key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3" class="float-right">
            <el-button @click="cancel" type="primary" size="small"  >
              删除
            </el-button>
            <el-button @click="toAdd" type="primary" size="small" >
              新增
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="wh__body" style="height: calc(100% - 130px)">
      <el-table :data="whiteLists" height="100%" v-loading="loading">
        <el-table-column label="iccid" prop="iccid"/>
        <el-table-column label="类型" prop="type">
          <template slot-scope="scope">
            {{blackWhiteListType[scope.row.type]}}
          </template>
        </el-table-column>
        <el-table-column label="原因" prop="reason"/>
        <el-table-column label="开始时间" prop="effectiveDate">
          <template slot-scope="scope">
            {{scope.row.effectiveDate | dateFilter}}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" prop="expireDate">
          <template slot-scope="scope">
            {{scope.row.expireDate | dateFilter}}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            {{alertWhiteListStatus[scope.row.status]}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="wh__body--page">
      <el-pagination :total="page.total" :current-page="page.pageNo" :page-size="page.pageSize" @current-change="onPageChange" layout="total, prev, pager, next,jumper"></el-pagination>
    </div>
    <add-white-list
      :visible="isAddDialogVisible"
      :reasonList="reasonList"
      :defaultData="currentRow"
      @closeAdd="closeAdd">
    </add-white-list>
  </div>
</template>

<script>
import addWhiteList from './components/add-whitelist-dialog'

export default {
  name: 'white-list',
  components: { 'add-white-list' : addWhiteList },
  data() {
    return {
      page: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      searchForm: {
        cardNo: '',
        reason: '',
        status: ''
      },
      reasonList: [],
      whiteLists: [],
      isAddDialogVisible: false,
      currentRow: null,
      loading: false
    }
  },
  computed: {
    alertWhiteListStatus() {
      return this.$store.getters.getEnum('blackWhiteListStatus') || {ACTIVE: "生效", INACTIVE: "失效"}
    },
    blackWhiteListType() {
      return this.$store.getters.getEnum('blackWhiteListType') || {WHITE_CARRIER_DEACTIVE: "运营商停机白名单", WHITE_DAILY_ALERT: "告警白名单"}
    }
  },
  created() {
    this.queryWhiteList()
    this.getReasonList()
  },
  methods: {
    async queryWhiteList() {
      this.loading = true
      let param = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      }
      for (const key in this.searchForm) {
        if (this.searchForm.hasOwnProperty(key)) {
          const element = this.searchForm[key];
          if (element) {
            param = {
              ...param,
              [key]: element
            }
          }
        }
      }
      const res = await this.jaxLib.whitelist.getWhiteList(param)
      this.loading = false
      if (!res.success) return
      this.whiteLists = res.data.list
      this.page.total = res.data.page.allCount
    },
    async getReasonList() {
      const res = await this.jaxLib.whitelist.getReasonList()
      if (!res.success) return
      this.reasonList = res.data
    },
    onPageChange(value) {
      this.page.pageNo = value
      this.queryWhiteList()
    },
    toAdd() {
      this.currentRow = null
      this.isAddDialogVisible = true
    },
    closeAdd() {
      this.isAddDialogVisible = false
      this.queryWhiteList()
    },
    cancel() {
      this.currentRow = this.whiteLists
      this.isAddDialogVisible = true
    }
  }
}
</script>
