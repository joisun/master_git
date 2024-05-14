<script type="text/ecmascript-6">
import { safeGet, safeParse } from '@/global/function/safe-operations'
import EditDialog from '../components/edit-dialog'
import filterQueryParams from '@/global/function/filterQueryParams'
import FileDialog from '@/page/manage/children/client/children/template-contract/components/file-dialog'
export default {
  name: 'template-contract',
  components: {
    EditDialog,
    FileDialog
  },
  data() {
    return {
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      tableData: [],
      search: {
        firstParty: ''
      }
    }
  },
  computed: {},
  created() {
    this.getList()
  },
  methods: {
    handlePageChange(val) {
      this.page.pageIndex = val
      this.getList()
    },
    checkFile(row) {
      this.$refs.fileDialog.open(row)
    },
    handleDelete(row) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.jaxLib.customer.oaContract.delete({ id: row.id })
          if (safeGet(res, 'success', false)) {
            this.$message.success('操作成功')
            await this.getList()
          }
        })
        .catch(() => {})
    },
    async handelCopy(row) {
      const res = await this.jaxLib.customer.oaContract.copyById({ id: row.id })
      if (safeGet(res, 'success', false)) {
        this.$message.success('操作成功')
        await this.getList()
      }
    },
    viewDetail(row) {
      this.$refs.editDialog.open({
        ...row,
        viewOnly: true
      })
    },
    handelEdit(row) {
      this.$refs.editDialog.open(row)
    },
    handleAdd() {
      this.$refs.editDialog.open()
    },
    onSearch() {
      this.page.pageIndex = 1
      this.getList()
    },
    async getList() {
      this.tableData = []
      this.loading = true
      let res = await this.jaxLib.customer.oaContract.list(
        filterQueryParams({
          firstParty: this.search.firstParty,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize
        })
      )
      if (safeGet(res, 'success', false)) {
        this.tableData = res.data.list.map((item) => {
          const { info = '', attachUrl = '' } = item
          const { firstParty } = safeParse(info, {})

          return {
            ...item,
            firstParty,
            attachUrl: safeParse(attachUrl, [])
          }
        })
        this.page.total = res.data.page.allCount
        this.loading = false
      }
    },
    editConfirm() {
      this.getList()
    }
  }
}
</script>

<template>
  <div class="l-customers">
    <file-dialog ref="fileDialog" />
    <edit-dialog ref="editDialog" @confirm="editConfirm" />
    <div class="wh-app-wrap">
      <div class="wh__header">
        <div class="wh__header--title">模版合同</div>
      </div>
      <!-- tools -->
      <div class="wh__tools">
        <div class="wh__tools--search clearfix">
          <el-input
            v-model.trim="search.firstParty"
            style="width: 300px"
            placeholder="请输入甲方"
            class="input-with-select"
            @keydown.enter.native="onSearch"
          >
            <el-button slot="append" icon="el-icon-search" @click="getList" />
          </el-input>
          <el-button type="primary" class="float-right" @click="handleAdd">新增</el-button>
        </div>
      </div>
      <!-- list-->
      <div class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData" height="calc(100vh - 260px)">
            <el-table-column label="ID" prop="id" width="80px" />
            <el-table-column label="甲方" prop="firstParty" width="200px" />
            <el-table-column label="流程类型" prop="approvalType" min-width="140px">
              <template #default="{ row }">
                {{
                  row.approvalType === 'framework'
                    ? '流程1：框架合同+附加合同'
                    : row.approvalType === 'attach'
                    ? '流程2：附加合同（关联流程1）'
                    : row.approvalType === 'attach_recharge'
                    ? '流程3：续费合同（关联流程1）'
                    : '流程4: 附件国际卡采购合同（关联流程1）'
                }}
              </template>
            </el-table-column>
            <el-table-column label="创建时间" width="140px" align="center">
              <template #default="{ row }">
                <span>{{ row.gmtCreated | dateFilter }}</span>
              </template>
            </el-table-column>

            <el-table-column label="上次编辑时间" width="140px" align="center">
              <template #default="{ row }">
                <span>{{ row.gmtModified | dateFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="最近提交时间" width="140px" align="center">
              <template #default="{ row }">
                <span>{{ row.gmtSubmitted | dateFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="附件" width="140px" align="center">
              <template #default="{ row }">
                <el-button v-if="row.gmtSubmitted" type="text" @click="checkFile(row)"
                  >查看附件</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="400px" align="right">
              <template #default="{ row }">
                <el-button @click="viewDetail(row)">查看详情</el-button>
                <el-button icon="el-icon-document-copy" @click="handelCopy(row)">复制</el-button>
                <el-button
                  v-if="!row.gmtSubmitted"
                  icon="el-icon-edit"
                  type="primary"
                  @click="handelEdit(row)"
                  >编辑</el-button
                >
                <el-button icon="el-icon-delete" @click="handleDelete(row)" />
              </template>
            </el-table-column>
          </el-table>
          <div class="wh__body--page">
            <el-pagination
              :current-page="page.pageIndex"
              :page-size="page.pageSize"
              :total="page.total"
              layout="pager, total"
              @current-change="handlePageChange"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
