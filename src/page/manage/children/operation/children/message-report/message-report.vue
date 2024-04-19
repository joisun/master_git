<script>
import addMessageReport from './components/add-message-report'
import WhImage from '@/global/components/wh-image/src/main.vue'
import DialogBatchQuery from './components/DialogBatchQuery.vue'
import DialogCardList from './components/DialogCardList.vue'

export default {
  name: 'message-report',
  components: { 'add-message-report': addMessageReport, DialogCardList, WhImage, DialogBatchQuery },
  data() {
    return {
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      searchForm: {
        iccid: '',
        org: ''
      },
      reportsList: [],
      isAddDialogVisible: false,
      isShowICCIDInfoVisible: false,
      currentRow: {
        iccids: []
      },
      loading: false,
      DialogBatchAdd: {
        visible: false
      },
      DialogBatchQuery: {
        visible: false
      },
      DialogCardList: {
        visible: false,
        orgId: 0,
        caseHash: ''
      }
    }
  },
  created() {
    this.queryCaseRecord()
  },
  methods: {
    async queryCaseRecord() {
      this.loading = true
      let param = {
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize
      }
      for (const key in this.searchForm) {
        if (this.searchForm.hasOwnProperty(key)) {
          const element = this.searchForm[key]
          if (element) {
            param = {
              ...param,
              [key]: element
            }
          }
        }
      }
      const res = await this.jaxLib.customer.certification.queryCaseRecord(param)
      this.loading = false
      if (!res.success) return
      this.reportsList = res.data.list
      this.page.total = res.data.page.allCount
    },
    onPageChange(value) {
      this.page.pageIndex = value
      this.queryCaseRecord()
    },
    toAdd() {
      this.isAddDialogVisible = true
    },
    // iccid操作
    checkIccids(row) {
      this.currentRow = row
      this.DialogCardList.visible = true
      this.DialogCardList.orgId = row.orgId
      this.DialogCardList.caseHash = row.caseHash
    },
    closeDialog() {
      this.isShowICCIDInfoVisible = false
    },
    onBatchAddClick() {
      this.DialogBatchAdd.visible = true
    },
    onBatchQueryClick() {
      this.DialogBatchQuery.visible = true
    },
    onSearch() {
      this.page.pageIndex = 1
      this.queryCaseRecord()
    }
  }
}
</script>
<template>
  <div class="test-card wh__warp">
    <div class="wh__header">
      <h2 class="wh-title">信息报备</h2>
    </div>
    <div class="wh__tools--search">
      <el-form :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item>
              <el-input
                v-model="searchForm.org"
                placeholder="客户账号、ID、手机号"
                @keyup.native.enter="onSearch"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-input
                v-model="searchForm.iccid"
                placeholder="请输入ICCID"
                @keyup.native.enter="onSearch"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3" class="float-right">
            <el-button type="primary" size="small" @click="toAdd"> 新增 </el-button>
            <el-button type="primary" size="small" @click="onBatchQueryClick"> 批量查询 </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-loading="loading" class="wh__body">
      <el-table :data="reportsList" height="100%">
        <el-table-column label="客户名称" prop="orgName"></el-table-column>
        <el-table-column label="相关ICCID" prop="iccids">
          <template slot-scope="scope">
            <el-button type="text" @click="checkIccids(scope.row)">查看明细</el-button>
          </template>
        </el-table-column>
        <el-table-column label="报备图片" prop="photos">
          <template slot-scope="scope">
            <WhImage
              v-for="(item, index) in scope.row.photos"
              :key="index"
              :src="item"
              style="width: 100px; height: 100px"
              :preview-src-list="scope.row.photos"
            />
          </template>
        </el-table-column>
        <el-table-column label="场景使用说明" prop="remark"></el-table-column>
      </el-table>
    </div>
    <div class="wh__body--page">
      <el-pagination
        :total="page.total"
        :current-page="page.pageIndex"
        :page-size="page.pageSize"
        layout="total, prev, pager, next,jumper"
        @current-change="onPageChange"
      ></el-pagination>
    </div>
    <DialogCardList
      :visible.sync="DialogCardList.visible"
      :org-id="DialogCardList.orgId"
      :case-hash="DialogCardList.caseHash"
      @refresh="queryCaseRecord"
    />
    <add-message-report :visible.sync="isAddDialogVisible" @refresh="queryCaseRecord">
    </add-message-report>
    <DialogBatchQuery :visible.sync="DialogBatchQuery.visible" />
  </div>
</template>

<style lang="scss" scoped>
.test-card {
  height: 100%;
  .wh__body {
    height: calc(100% - 125px);
  }
}
</style>
