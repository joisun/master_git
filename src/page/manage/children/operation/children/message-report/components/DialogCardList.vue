<template>
  <el-dialog title="ICCID明细" :visible="visible" :before-close="onCloseDialog">
    <el-table :data="tableData">
      <el-table-column label="ICCID" prop="iccids">
        <template slot-scope="scope">{{ scope.row }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="deleteIccid(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="wh__body--page">
      <el-pagination
        @current-change="handlePageChange"
        :current-page="page.pageIndex"
        :page-size="page.pageSize"
        :total="page.total"
        layout="pager, total, jumper"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCloseDialog">取 消</el-button>
      <el-button type="primary" @click="saveDelete">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      orgId: {
        type: Number
      },
      visible: {
        type: Boolean
      },
      caseHash: {
        type: String
      }
    },
    data() {
      return {
        page: {
          pageIndex: 1,
          pageSize: 10,
          total: 0
        },
        tableData: []
      }
    },
    methods: {
      saveDelete() {
        this.$emit('refresh')
        this.onCloseDialog()
      },
      async deleteIccid(iccid) {
        const res = await this.jaxLib.customer.certification.deleteCaseRecord(
          iccid
        )
        if (!res.success) return
        this.$message.success('删除成功')
        this.tableData = this.tableData.filter((item) => item !== iccid)
      },
      handlePageChange(pageIndex) {
        this.page.pageIndex = pageIndex
        this.getCardList()
      },
      onCloseDialog() {
        this.$emit('update:visible', false)
      },
      async getCardList() {
        const params = {
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize,
          orgId: this.orgId,
          caseHash: this.caseHash
        }
        const res = await this.jaxLib.customer.certification.getDetailCardList(
          params
        )
        if (res.success) {
          this.page.total = res.data.page.allCount
          this.tableData = res.data.list
        }
      }
    },
    watch: {
      visible(v) {
        if (v) {
          this.getCardList()
        }
      }
    }
  }
</script>