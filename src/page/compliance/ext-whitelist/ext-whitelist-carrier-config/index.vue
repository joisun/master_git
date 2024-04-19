<script>
import AddForm from './components/add-form'
export default {
  components: {
    AddForm
  },
  data() {
    return {
      loading: false,
      tableData: [],
      purposes: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const { success, data } = await this.jaxLib.whitelist.workOrderCarrierConfigList({})
      this.loading = false
      if (!success) return false
      this.tableData = data
    },

    handleDelete(row) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.jaxLib.whitelist.workOrderCarrierConfigDelete({ id: row.id })
          if (res && res.success) {
            this.$message.success('操作成功')
            await this.getList()
          }
        })
        .catch(() => {})
    },
    addNewGoals(row) {
      this.$refs.addNewGoal.open(row, 'goal')
    },
    handleAdd() {
      this.$refs.addForm.open()
    }
  }
}
</script>
<template>
  <div class="ext-whitelist-carrier-config">
    <add-form ref="addForm" @confirm="getList()" />
    <!--    <add-new-goal ref="addNewGoal" />-->
    <div v-loading="loading" class="wh__body">
      <div class="wh__tools">
        <div class="wh__tools--mix">
          <el-button style="float: right" type="primary" icon="el-icon-plus" @click="handleAdd"
            >新 增</el-button
          >
        </div>
      </div>
      <div class="wh__body--table">
        <el-table :data="tableData">
          <el-table-column label="运营商(ID)" prop="carrier">
            <template #default="{ row }">
              {{ row.signedCarrierName }}({{ row.signedCarrierId }})
            </template>
          </el-table-column>
          <el-table-column label="接入APN" prop="apn" align="center" width="120px" />
          <el-table-column label="支持目的" prop="purpose" align="center" />
          <el-table-column label="操作" prop="action" width="100px">
            <template slot-scope="{ row }">
              <!--              <el-button @click="addNewGoals(row)">新增目的</el-button>-->
              <el-button size="mini" type="primary" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
