<script>
import Modify from './components/modify.vue'
import apis from '@/api/ajax'
import { selectionMixin } from '@/global/mixins/table-selection'

const SELECTION_STORAGE_KEY = 'whitehouse_cpe_openvpn_server'
export default {
  name: 'OpenVPNServer',
  components: {
    Modify
  },
  mixins: [selectionMixin],
  data() {
    return {
      form: {
        addr: '',
        provider: ''
      },
      tableData: [],
      system: '',
      loading: false,
      storageKey: SELECTION_STORAGE_KEY
    }
  },
  computed: {
    selectedIds() {
      return this.selected.map((item) => item.id)
    },
    hasSelected() {
      return this.selected.length > 0
    }
  },
  mounted() {
    this.getBannerUrl()
    this.getList()
    this.clearStorageSelection()
  },
  methods: {
    modifyConfirm() {
      this.getList()
    },
    addConfirm() {},
    handleCreate() {
      this.$refs.modify.open()
    },
    handleModify(row) {
      this.$refs.modify.open(row)
    },
    async handleDelete(rowId) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let ids
          if (rowId) {
            ids = rowId
          } else {
            ids = this.selected.map((item) => item.id).join()
          }
          const { success } = await apis.cpe.vpnServerBatchDelete({
            ids
          })
          if (!success) return
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          await this.getList()
        })
        .catch(() => {})
    },
    async getBannerUrl() {
      const { success, data } = await apis.common.getBannerUrl({
        needSystem: true
      })
      if (!success) return false
      this.system = data
    },
    async getList() {
      this.loading = true
      const { success, data } = await apis.cpe.vpnServerList({
        ...this.form
      })
      this.loading = false
      if (!success) return false
      this.tableData = data
      if (this.tableData.length === 1) {
        // 只有一条数据的时候默认选中
        this.handleSelectionChange(this.tableData)
        this.$nextTick(() => {
          this.$refs.tableRef.clearSelection()
          this.$refs.tableRef.toggleRowSelection(this.tableData[0])
        })
      } else if (this.selected.length) {
        this.selected = []
        this.$refs.tableRef.clearSelection()
      }
    },
    search() {
      this.getList()
    }
  }
}
</script>

<template>
  <div class="wh__warp cpe-device-list">
    <div class="wh__header">
      <div class="wh__header--title">openVPN服务器</div>
    </div>
    <!-- tools -->
    <div class="wh__tools">
      <div class="wh__tools--search">
        <el-input
          v-model.trim="form.addr"
          placeholder="请输入服务器地址"
          name="searchField"
          class="wh__tools--search-input"
          style="width: 280px"
          @keyup.enter.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="search"> </el-button>
        </el-input>
        <el-input
          v-model.trim="form.provider"
          placeholder="请输入服务商"
          name="searchField"
          class="wh__tools--search-input"
          style="width: 280px"
          @keyup.enter.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="search"> </el-button>
        </el-input>
        <div class="float-right">
          <div class="card-manage__search--button">
            <el-button type="primary" @click="handleCreate">新增</el-button>
            <el-button type="primary" :disabled="!hasSelected" @click="handleDelete()"
              >删除</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <!-- list-->
    <div v-loading="loading" class="wh__body">
      <div class="wh__body--table">
        <el-table
          ref="tableRef"
          :data="tableData"
          row-key="id"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" :reserve-selection="true" />
          <el-table-column label="服务器地址" prop="addr" />
          <el-table-column label="服务商" prop="provider" width="135" align="center" />
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handleModify(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <modify ref="modify" @confirm="modifyConfirm" />
  </div>
</template>

<style lang="scss" scoped>
.cpe-device-list {
  .icon-star {
    font-size: 16px;
    cursor: pointer;

    &--on {
      font-size: 20px;
      color: orange;
    }
  }

  .separate {
    color: #999;
  }

  .link {
    color: #1c8de0;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
