<template>
  <div class="compliance-change-list">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-input
          v-model.trim="search.id"
          style="width: 160px"
          placeholder="请输入任务ID"
          @keyup.enter.native="onSearch"
        />
        <el-input
          v-model.trim="search.taskName"
          style="width: 160px"
          placeholder="请输入任务名"
          @keyup.enter.native="onSearch"
        />
        <el-select
          v-model="search.carrier"
          placeholder="运营商"
          style="width: 100px"
          clearable
          @change="onCarrierChange"
        >
          <el-option
            v-for="(value, key) in enums.carrier.maps()"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
        <el-select
          v-model="search.signCarrierId"
          placeholder="请选择归属运营商"
          style="width: 160px"
          clearable
          size="small"
          @change="signedCarrierChange"
        >
          <el-option
            v-for="item in signedCarrierList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <wh-carrier-account-select
          v-model="search.carrierAccountId"
          class="card-manage__search--select"
          placeholder="运营商账号"
          :signed-carrier-id="search.signCarrierId"
          :carrier="search.carrier"
          @change="onSearch()"
        />
        <div class="card-manage__search--button mr10">
          <el-button icon="el-icon-search" type="primary" @click="getList(1)">搜索</el-button>
        </div>
        <div style="display: flex; justify-content: flex-end; align-items: center">
          <el-button icon="el-icon-plus" type="primary" @click="handleAdd()">新建任务</el-button>
        </div>
      </div>
    </div>
    <div v-loading="loading" class="wh__body">
      <div class="wh__body--table">
        <el-table :data="tableData">
          <el-table-column label="任务ID" prop="id" align="center" width="120px">
            <!--            <template #default="scope">-->
            <!--              <el-button type="text">{{ scope.row.id }} </el-button>-->
            <!--            </template>-->
          </el-table-column>
          <el-table-column label="任务名称" prop="taskName" />
          <el-table-column
            label="运营商(ID)"
            prop="carrierAccountName"
            align="center"
            width="200px"
          >
            <template #default="scope">
              {{ scope.row.conditions.carrierAccountName }}({{
                scope.row.conditions.carrierAccountId
              }})
            </template>
          </el-table-column>
          <el-table-column label="卡片材质" prop="addLimitation" align="center">
            <template #default="{ row }">
              {{ getMaterial(row.conditions.material) }}
            </template>
          </el-table-column>
          <el-table-column label="目前管控措施" prop="delLimitation" align="center">
            <template #default="{ row }">
              <el-tag
                v-for="item in getLimitControl(row.conditions.currentControl)"
                :key="item"
                size="mini"
                style="margin-right: 2px"
                >{{ item }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="预警条件" prop="predictDays" align="center">
            <template #default="{ row }">
              <div>
                未来<strong>{{ row.conditions.predictDays }}天</strong>内
              </div>
              <div>
                达到<strong>{{ row.conditions.monthFlow }}M</strong>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="上次更新时间" prop="effectiveDate" align="center" width="150px">
            <template #default="scope">{{ scope.row.gmtModified | dateFilter }}</template>
          </el-table-column>
          <el-table-column label="数据量" prop="processNum" align="center" />
          <el-table-column label="状态" prop="status" align="center">
            <template #default="{ row }">
              {{ statusMap[row.status] }}
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="action" align="center" width="250px">
            <template #default="{ row }">
              <el-button @click="handleRun(row)">重跑</el-button>
              <el-button type="primary" @click="handleEdit(row)">修改</el-button>
              <el-button v-if="row.status === 2" @click="handleDownload(row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="wh__body--page">
        <el-pagination
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          layout="total, prev, pager, next"
          :total="page.total"
          @current-change="changePageIndex"
        >
        </el-pagination>
      </div>
    </div>
    <edit-dialog ref="editDialog" @confirm="getList" />
    <file-import :visible.sync="importDialog.visible" @refresh="getList" />
  </div>
</template>

<script>
import apis from '@/api/ajax'
import moment from 'moment'
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select'
import EditDialog, { limitMap } from '../components/edit-dialog'
import FileImport from '../components/file-import'
import { safeGet, safeParse } from '@/global/function/safe-operations'
import Download from '@/page/components/wh-download/wh-download'
import ajax from '@/api/ajax'
import filterQueryParams from '@/global/function/filterQueryParams'
const carrierGroupMap = {
  unicomAccountList: '中国联通',
  cmccAccountList: '中国移动',
  chinanetAccountList: '中国电信'
}
const statusMap = {
  0: '未执行',
  1: '执行中',
  2: '已完成'
}
export default {
  name: 'flow-warning-list',
  components: {
    'wh-carrier-account-select': whCarrierAccountSelect,
    'edit-dialog': EditDialog,
    'file-import': FileImport
  },
  data() {
    return {
      statusMap,
      signedCarrierList: [],
      tableData: [],
      loading: false,
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      carrierAccountGroups: [],
      search: {
        carrier: '',
        carrierAccountId: '',
        signCarrierId: '',
        id: '',
        taskName: ''
      },
      importDialog: {
        visible: false
      }
    }
  },
  async created() {
    await this.getList()
  },
  methods: {
    changePageIndex(val) {
      this.page.pageIndex = val
      this.getList()
    },
    getLimitControl(limit) {
      if (!limit) return ''
      return limit.map((item) => limitMap[item])
    },
    getMaterial(material) {
      if (!material) return ''
      if (material.includes('PASTER')) {
        return '贴片卡'
      }
      return '插拔卡'
    },
    onCarrierChange() {
      this.search.carrierAccountId = ''
      this.search.signCarrierId = ''
      this.signedCarrierList = []
      this.getSignedCarrierList()
      this.onSearch()
    },
    async getSignedCarrierList() {
      if (!this.search.carrier) return false
      let res = await this.jaxLib.store.signedCarrierListGet({ carrier: this.search.carrier })
      if (!res.success) return false
      this.signedCarrierList = res.data
    },
    signedCarrierChange() {
      this.search.carrierAccountId = ''
      this.onSearch()
    },
    handleRun(row) {
      this.$confirm('确定重跑改任务', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { success } = await apis.flowWarning.executeTask({ id: row.id })
        if (success) {
          this.$message({ type: 'success', message: '操作成功' })
          await this.getList(this.pageIndex)
        }
      })
    },
    async handleDownload(row) {
      const res = await apis.flowWarning.getOsskey({
        id: row.id
      })
      if (safeGet(res, 'success', false)) {
        const {
          success,
          data: { fileUrl }
        } = await ajax.common.getDownloadUrl({ fileKey: res.data })
        if (!success) return false
        window.open(fileUrl)
      }
    },
    handleEdit(row) {
      this.$refs.editDialog.open(row)
    },
    onImport() {
      this.importDialog.visible = true
    },
    handleAdd() {
      this.$refs.editDialog.open()
    },
    createChange() {},
    async getList() {
      this.loading = true
      const { carrierAccountId, carrier, signCarrierId, taskName, id } = this.search
      const res = await apis.flowWarning.getTaskList(
        filterQueryParams({
          currentPage: this.page.pageIndex,
          pageSize: this.page.pageSize,
          signCarrierId,
          carrierAccountId,
          carrier,
          taskName,
          id
        })
      )
      this.loading = false
      if (!res || !res.success) {
        return false
      }
      this.tableData = res.data.list.map((item) => {
        return {
          ...item,
          conditions: safeParse(item.conditions, {})
        }
      })
      this.page.pageIndex = res.data.page.currentPage
      this.page.total = res.data.page.allCount
    },
    onSearch() {
      this.page.pageIndex = 1
      this.getList()
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
