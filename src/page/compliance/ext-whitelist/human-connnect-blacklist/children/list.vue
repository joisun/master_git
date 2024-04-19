<script>
import AddForm from '../components/add-form'
export default {
  components: {
    AddForm
  },
  data() {
    return {
      carrier: 'cmcc',
      search: {
        urlOrIp: ''
      },
      loading: false,
      tableData: []
    }
  },
  watch: {
    async $route(val) {
      if (val.name === 'human-connect-blacklist-list' && val.params.carrier !== this.carrier) {
        this.carrier = val.params.carrier
        this.getList()
      }
    }
  },
  created() {
    this.carrier = this.$route.params.carrier
    this.getList()
  },
  methods: {
    tabsClick(tab) {
      this.$router.push({ name: 'human-connect-blacklist-list', params: { carrier: tab.name } })
      if (tab.name !== this.carrier) {
      }
    },
    async getList() {
      this.loading = true
      const { success, data } = await this.jaxLib.whitelist.peopleInternetList({
        carrier: this.carrier,
        urlOrIp: this.search.urlOrIp
      })
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
          const res = await this.jaxLib.whitelist.peopleInternetRemove({ id: row.id })
          if (res && res.success) {
            this.$message.success('操作成功')
            await this.getList()
          }
        })
        .catch(() => {})
    },
    handleAdd() {
      this.$refs.addForm.open({ carrier: this.carrier })
    }
  }
}
</script>
<template>
  <div class="wh__warp">
    <add-form ref="addForm" @confirm="getList()" />
    <div class="wh__header">
      <h2 class="wh-title">人联网黑名单</h2>
    </div>
    <el-tabs :value="carrier" class="wh__tabs" @tab-click="tabsClick">
      <el-tab-pane v-for="(key, val) in enums.carrier.maps()" :key="val" :label="key" :name="val">
      </el-tab-pane>
    </el-tabs>
    <div class="ext-whitelist-carrier-config">
      <add-form ref="addForm" @confirm="getList()" />
      <!--    <add-new-goal ref="addNewGoal" />-->
      <div v-loading="loading" class="wh__body">
        <div class="wh__tools">
          <div class="wh__tools--mix">
            <el-input
              v-model.trim="search.urlOrIp"
              style="width: 300px"
              placeholder="人联网黑名单"
              @keyup.enter.native="getList()"
            />
            <el-button style="float: right" type="primary" icon="el-icon-plus" @click="handleAdd"
              >新 增</el-button
            >
          </div>
        </div>
        <div class="wh__body--table">
          <el-table :data="tableData">
            <el-table-column label="人联网黑名单" prop="carrier">
              <template #default="{ row }">
                {{ row.url }}
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" align="center" />
            <el-table-column label="操作" prop="action" width="100px">
              <template slot-scope="{ row }">
                <el-button size="mini" type="primary" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
