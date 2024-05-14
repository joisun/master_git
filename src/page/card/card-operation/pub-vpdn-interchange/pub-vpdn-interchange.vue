<script>
import { packageModifyList as columns } from './mixins/const'
import Add from './components/add.vue'
export default {
  name: 'public-vpdn-interchange',
  components: { Add },
  data() {
    return {
      columns: columns,
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      tableData: [],
      loading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    enterDetail(id) {
      this.$refs.addDialog.open(id)
    },
    openDetail() {
      this.$refs.addDialog.open()
    },
    async getList() {
      this.loading = true
      let rst = await this.jaxLib.card.publicVpdn.list({
        refType: 'org_id',
        pageNo: this.page.pageIndex,
        pageSize: this.page.pageSize
      })
      this.loading = false
      if (!rst.success) return false
      this.tableData = rst.data.list
      this.page.total = rst.data.page.allCount
    },
    changeIndex(val) {
      this.page.pageIndex = val
      this.getList()
    }
  }
}
</script>

<template>
  <div class="modify-package-list">
    <add ref="addDialog" />
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">公网VPDN互转工具</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--mix">
          <el-button class="float-right" type="primary" @click="openDetail()">发起申请</el-button>
        </div>
      </div>
      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData" height="calc(100vh - 260px)">
            <el-table-column label="ID" prop="id" />
            <el-table-column label="客户(ID)">
              <template #default="{ row }"> {{ row.orgName }}({{ row.orgId }}) </template>
            </el-table-column>
            <el-table-column label="卡数量" prop="iccidCount" />
            <el-table-column label="变更前运营商账号">
              <template #default="{ row }">
                {{ row.originCarrierAccount }}
              </template>
            </el-table-column>
            <el-table-column label="变更后运营商账号">
              <template #default="{ row }">
                {{ row.targetCarrierAccount }}
              </template>
            </el-table-column>
            <el-table-column label="操作人">
              <template #default="{ row }">{{ row.operator }}</template>
            </el-table-column>
            <el-table-column label="操作时间">
              <template #default="{ row }">{{ row.operationTime | dateFilter }}</template>
            </el-table-column>
            <el-table-column label="备注">
              <template #default="{ row }">{{ row.remark }}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="text" size="mini" @click="enterDetail(row.id)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
      </div>
    </div>
  </div>
</template>
