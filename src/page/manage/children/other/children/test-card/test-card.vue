<script>
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
import editDialog from './components/edit-dialog.vue'
import applyDialog from './components/apply-dialog.vue'
import deleteDialog from './components/delete-dialog'
import historyDialog from './components/history-dialog'
import { cardTagMap } from './mixin/consts'
import { safeGet } from '@/global/function/safe-operations'
import OperationDialog from '@/page/manage/children/other/children/test-card/components/operation-dialog'
const statusMap = {
  1: '已借出',
  0: '已归还',
  2: '已申请'
}
export default {
  components: {
    editDialog,
    applyDialog,
    deleteDialog,
    whCarrierAccountSelect,
    historyDialog,
    OperationDialog
  },
  data() {
    return {
      loading: false,
      statusMap,
      userList: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      form: {
        user: '',
        env: '',
        iccid: '',
        carrier: '',
        cardType: '',
        locationNo: '',
        testCardTags: [],
        carrierAccountId: ''
      },
      tagList: [],
      cardList: [],
      isEditDialogVisible: false,
      isApplyDialogVisible: false,
      isDeleteDialogVisible: false,
      editContent: {},
      editType: 'add',
      selectedIccids: [],
      cardTagMap
    }
  },
  computed: {
    envMap() {
      return this.$store.state.overall.enum.env || []
    },
    cardCarrierType() {
      return this.$store.state.overall.enum.cardCarrierType || []
    },
    carrierMap() {
      return this.enums.carrier.maps()
    }
  },
  created() {
    this.getTestTags()
    this.getCardList()
    this.getUserList()
  },
  methods: {
    batchOperation(type) {
      this.$refs.operationDialog.open(type)
    },
    async getUserList() {
      const res = await this.jaxLib.testCard.getUserList({})
      if (safeGet(res, 'success', false)) {
        this.userList = res.data
      }
    },
    showHistory(row) {
      this.$refs.historyDialog.open(row.iccid)
    },
    returnCard() {},
    handleReturn(row) {
      this.$confirm('确认归还', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { success } = await this.jaxLib.testCard.returnCard({ iccids: row.iccid })
        if (success) {
          this.$message({ type: 'success', message: '操作成功' })
          await this.getCardList()
        }
      })
    },
    handleRent(row) {
      this.$confirm('确认出借', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { success } = await this.jaxLib.testCard.lendCard({ iccids: row.iccid })
        if (success) {
          this.$message({ type: 'success', message: '操作成功' })
          await this.getCardList()
        }
      })
    },
    handleApply() {
      this.$refs.applyDialog.open()
    },
    async getTestTags() {
      const res = await this.jaxLib.testCard.getTags()
      if (!res.success) return false
      this.tagList = res.data
    },
    onApplyConfirm() {
      this.getCardList()
    },
    handleDialogClose(type) {
      const dialogMap = {
        edit: 'isEditDialogVisible',
        apply: 'isApplyDialogVisible',
        delete: 'isDeleteDialogVisible'
      }
      if (dialogMap[type]) {
        this[dialogMap[type]] = false
        this.getCardList()
      }
    },
    onSearch() {
      this.page.pageIndex = 1
      this.getCardList()
    },
    changeIndex(val) {
      this.page.pageIndex = val
      this.getCardList()
    },
    async getCardList() {
      this.loading = true
      const { env, cardType, carrier, iccid, carrierAccountId, testCardTags, locationNo, user } =
        this.form
      const res = await this.jaxLib.testCard.getCardList({
        currentPage: this.page.pageIndex,
        pageSize: this.page.pageSize,
        env,
        cardType,
        carrier,
        iccid,
        locationNo,
        carrierAccountId,
        user,
        testCardTags: testCardTags.join(',')
      })
      this.loading = false
      if (!res.success) return false
      this.cardList = res.data.list
      this.page.total = res.data.page.allCount
    },
    handleSelectionChange(val) {
      this.selectedIccids = []
      val.forEach((item) => {
        this.selectedIccids.push(item.iccid)
      })
    },
    showEditDialog(type, content) {
      this.editType = type
      this.editContent = content
      this.isEditDialogVisible = true
    }
  }
}
</script>
<template>
  <div class="test-card wh__warp">
    <div class="wh__header">
      <h2 class="wh-title">测试卡管理</h2>
    </div>
    <div class="wh__tools">
      <div class="wh__tools--search">
        <el-select v-model="form.env" placeholder="选择环境" clearable @change="onSearch">
          <el-option v-for="(val, key) in envMap" :key="key" :label="val" :value="key"></el-option>
        </el-select>
        <el-select v-model="form.carrier" placeholder="选择运营商" clearable @change="onSearch">
          <el-option v-for="(val, key) in carrierMap" :key="key" :label="val" :value="key" />
        </el-select>
        <wh-carrier-account-select
          v-model="form.carrierAccountId"
          :carrier="form.carrier"
          @change="onSearch"
        >
        </wh-carrier-account-select>
        <el-select v-model="form.cardType" placeholder="选择套餐分类" clearable @change="onSearch">
          <el-option
            v-for="(val, key) in cardCarrierType"
            :key="key"
            :label="val"
            :value="key"
          ></el-option>
        </el-select>
        <el-input
          v-model="form.iccid"
          class="wh__tools--search-input"
          placeholder="请输入iccid"
          @keyup.native.enter="onSearch"
        >
        </el-input>
        <el-input
          v-model="form.locationNo"
          class="wh__tools--search-input"
          placeholder="请输入编号"
          @keyup.native.enter="onSearch"
        >
        </el-input>

        <el-select v-model="form.user" placeholder="卡归属人" clearable @change="onSearch">
          <el-option v-for="(val, key) in userList" :key="key" :label="val" :value="val" />
        </el-select>
        <el-checkbox-group v-model="form.testCardTags" class="mt10" @change="onSearch">
          <el-checkbox
            v-for="item in tagList"
            :key="item.name"
            :label="item.name"
            :class="{ 'search-checkbox--checked': form.testCardTags.indexOf(item.name) > -1 }"
            class="search-checkbox"
          >
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="wh__tools--operate">
        <el-button class="float-right mb10 ml10" @click="batchOperation('returnCard')"
          >批量归还卡</el-button
        >
        <el-button class="float-right mb10" @click="batchOperation('lendCard')"
          >批量出借卡</el-button
        >
        <el-button class="float-right" @click="isDeleteDialogVisible = true">删 除</el-button>

        <el-button class="float-right mb10" type="primary" @click="showEditDialog('add')"
          >新 增</el-button
        >
        <el-button type="primary" class="float-right" @click="handleApply"
          >申请卡/取消申请卡</el-button
        >
      </div>
    </div>
    <div class="wh__body">
      <el-table
        v-loading="loading"
        :data="cardList"
        height="calc(100vh - 260px)"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" fixed></el-table-column>
        <el-table-column label="编号" prop="locationNo"></el-table-column>
        <el-table-column label="iccid" prop="iccid" width="160px" />
        <el-table-column label="ip" prop="ip" width="100px" />
        <el-table-column label="环境" min-width="100px">
          <template slot-scope="scope">
            {{ envMap[scope.row.env] }}
          </template>
        </el-table-column>
        <el-table-column label="运营商" min-width="95px">
          <template slot-scope="scope">
            {{ carrierMap[scope.row.carrier] }}
          </template>
        </el-table-column>
        <el-table-column
          label="运营商账号"
          prop="carrierAccountName"
          min-width="135px"
        ></el-table-column>
        <el-table-column label="运营商套餐分类" min-width="100px">
          <template slot-scope="scope">
            {{ cardCarrierType[scope.row.cardType] }}
          </template>
        </el-table-column>
        <el-table-column label="套餐规格" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.ratePlan" v-tag-extract="{ volume: scope.row.ratePlan }"></span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="测试期" min-width="100px" align="center">
          <template slot-scope="scope">
            <div
              v-if="scope.row.testDataVolume"
              v-tag-extract="{ volume: scope.row.testDataVolume }"
            ></div>
            <div v-if="scope.row.testDeadline">
              {{ scope.row.testDeadline | dateFilter('YYYY-MM-DD') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="特殊功能" align="center" width="200px">
          <template slot-scope="scope">
            <el-tag
              v-for="item in cardTagMap"
              v-if="scope.row[item.key]"
              :key="item.key"
              type="primary"
              size="medium"
              style="width: auto"
            >
              {{ item.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="卡归属人" prop="user" />
        <el-table-column label="申请理由" prop="reason" />
        <el-table-column label="预计归还时间" min-width="140px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.returnTime | dateFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" min-width="140px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.applyTime | dateFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100px" align="center" fixed="right">
          <template slot-scope="{ row }">
            <span>{{ statusMap[row.state] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditDialog('edit', scope.row)">编辑</el-button>
            <el-button size="small" @click="showHistory(scope.row)">历史记录</el-button>
            <el-button
              v-if="scope.row.state === 2"
              type="primary"
              size="small"
              @click="handleRent(scope.row)"
              >已出借</el-button
            >
            <el-button
              v-if="scope.row.state === 1"
              type="primary"
              size="small"
              @click="handleReturn(scope.row)"
              >已归还</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
      <edit-dialog
        :content="editContent"
        :type="editType"
        :dialog-visible="isEditDialogVisible"
        :card-tag-list="tagList"
        @close="handleDialogClose"
      >
      </edit-dialog>
      <apply-dialog ref="applyDialog" :selected-iccids="selectedIccids" @confirm="onApplyConfirm" />
      <delete-dialog
        :dialog-visible="isDeleteDialogVisible"
        :selected-iccids="selectedIccids"
        @close="handleDialogClose"
      >
      </delete-dialog>
      <history-dialog ref="historyDialog" />
      <operation-dialog ref="operationDialog" @confirm="getCardList" />
    </div>
  </div>
</template>

<style lang="scss">
.test-card {
  .search-checkbox {
    border: 1px solid #dcdfe6;
    width: 115px;
    padding: 4px 8px;
    margin-right: 10px;
    margin-bottom: 5px;
    background-color: #fff;
    text-align: center;
    border-radius: 5px;

    &--checked {
      color: #409eff;
      border-color: #409eff;
    }

    .el-checkbox__inner {
      margin-right: 3px;
    }
  }
  .el-tag {
    width: 70px;
    margin: 0 3px;
    text-align: center;
  }
  .wh__tools--search {
    & > div {
      margin-bottom: 5px;
    }
  }
}
</style>
