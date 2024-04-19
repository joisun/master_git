<script>
import Modify from './components/modify.vue'
import Add from './components/add.vue'
import apis from '@/api/ajax'
import { selectionMixin } from '@/global/mixins/table-selection'
import cpeUserLogin from '@/global/function/cpe-super-login'

const SELECTION_STORAGE_KEY = 'whitehouse_cpe_openvpn_config'
export default {
  name: 'OpenVPNConfig',
  components: {
    Modify,
    Add
  },
  mixins: [selectionMixin],
  data() {
    return {
      typeMap: {
        '-1': '禁用',
        0: '全量',
        1: '部分',
        2: '非部分'
      },
      form: {
        searchDevice: this.$route.query.macAddr || ''
      },
      tableData: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      system: '',
      loading: false,
      storageKey: SELECTION_STORAGE_KEY,
      serverOptions: []
    }
  },
  computed: {
    selectedIds() {
      return this.selected.map((item) => item.macAddr)
    },
    hasSelected() {
      return this.selected.length > 0
    }
  },
  mounted() {
    this.getBannerUrl()
    this.getList()
    this.clearStorageSelection()
    this.getServerList()
  },
  methods: {
    async getServerList() {
      this.loading = true
      const { success, data } = await apis.cpe.vpnServerList()
      this.loading = false
      if (!success) return false
      this.serverOptions = data
    },
    modifyConfirm() {
      this.search()
    },
    addConfirm() {
      this.search()
    },
    handleSwitch(row) {
      let message = '确认切换?'
      if (!row) {
        const offline = this.selected.map((item) => item.networkStatus).filter((status) => !status)
        const offlineLen = offline.length
        if (offlineLen === this.selected.length) {
          this.$message.warning('所选设备离线，无法切换')
          return
        }
        if (offlineLen) {
          message = `所选设备包含${offlineLen}台离线设备，离线设备无法切换，只切换在线设备？`
        }
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const macAddrs = row ? row.macAddr : this.selected.map((item) => item.macAddr).join()
          const { success } = await apis.cpe.vpnConfigBatchSwitch({ macAddrs })
          if (!success) return
          this.$message({
            type: 'success',
            message: '切换中，请稍等2-3分钟!'
          })
          await this.getList()
        })
        .catch(() => {})
    },
    handleCreate() {
      this.$refs.modify.open()
    },
    handleModify(row) {
      if (row) {
        this.$refs.modify.open([row])
        return
      }
      this.$refs.modify.open(this.selected)
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
          const { success } = await apis.cpe.vpnConfigBatchDelete({
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
    changePageIndex(val) {
      this.page.pageIndex = val
      this.$refs.tableRef.clearSelection()
      this.clearStorageSelection()
      this.getList()
    },
    async getList() {
      const { pageIndex, pageSize } = this.page
      this.loading = true
      const { success, data } = await apis.cpe.vpnConfigList({
        pageIndex,
        pageSize,
        ...this.form,
        sourceServer: this.form.sourceServer ? this.form.sourceServer.split(':')[0] : ''
      })
      this.loading = false
      if (!success) return false
      const { page, list } = data
      this.tableData = list
      this.page.total = page.allCount
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
    async userLogin(item) {
      await cpeUserLogin(item, {
        system: this.system,
        netboxPath: `/#/device?macAddr=${item.macAddr}`
      })
    },
    search() {
      this.page.pageIndex = 1
      this.getList()
    },
    closeTagDialog({ refresh } = {}) {
      this.isShowTagDialog = false
      refresh && this.getList()
    }
  }
}
</script>

<template>
  <div class="wh__warp cpe-device-list">
    <div class="wh__header">
      <div class="wh__header--title">openVPN配置</div>
    </div>
    <!-- tools -->
    <div class="wh__tools">
      <div class="wh__tools--search">
        <el-input
          v-model.trim="form.searchDevice"
          placeholder="请输入Mac地址/ICCID"
          name="searchField"
          class="wh__tools--search-input"
          style="width: 280px"
          @keyup.enter.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="search"> </el-button>
        </el-input>
        <el-select
          v-model="form.networkStatus"
          placeholder="选择网络状态"
          clearable
          @change="search"
        >
          <el-option :value="1" label="在线"></el-option>
          <el-option :value="0" label="离线"></el-option>
        </el-select>
        <el-select
          v-model="form.sourceServer"
          placeholder="选择数据来源"
          clearable
          @change="search"
        >
          <el-option
            v-for="item in serverOptions"
            :key="item.id"
            :label="`${item.addr}(${item.provider})`"
            :value="item.addr"
          />
        </el-select>
        <div class="float-right">
          <div class="card-manage__search--button">
            <el-button type="primary" @click="handleCreate">新增</el-button>
            <el-button type="primary" :disabled="!hasSelected" @click="handleModify()"
              >编辑</el-button
            >
            <el-button type="primary" :disabled="!hasSelected" @click="handleSwitch()"
              >切换</el-button
            >
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
          fit
          :data="tableData"
          row-key="id"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" :reserve-selection="true" />
          <el-table-column label="客户/归属" width="180">
            <template slot-scope="scope">
              <el-button type="text" style="text-decoration: none" @click="userLogin(scope.row)"
                >{{ scope.row.orgId }} -
                {{ scope.row.orgName }}
              </el-button>
              <span> ({{ scope.row.saleName | saleFilter }})</span>
            </template>
          </el-table-column>
          <el-table-column label="设备名称" prop="name" />
          <el-table-column label="MAC地址" prop="macAddr" width="135" align="center" />
          <el-table-column label="ICCID" prop="iccid" width="180" />
          <el-table-column label="类型" prop="networkStatus" width="135" align="center">
            <template slot-scope="scope">{{ typeMap[scope.row.type] }}</template>
          </el-table-column>
          <el-table-column label="网络状态" prop="networkStatus" width="135" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.networkStatus" type="success">在线</el-tag>
              <el-tag v-else>离线</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="在线时长" prop="onlineDuration" width="135" align="center" />
          <el-table-column label="最后一次ping" prop="lastPingTime" width="150" align="center" />
          <el-table-column label="数据来源" prop="sourceServer" width="220" align="center">
            <span
              slot-scope="scope"
              :style="
                scope.row.vpnMaster.indexOf(scope.row.sourceServer) === -1 ? { color: '#f00' } : {}
              "
            >
              {{ scope.row.sourceServer }}
              {{ scope.row.sourceServerProvider ? `(${scope.row.sourceServerProvider})` : '' }}
            </span>
          </el-table-column>
          <el-table-column label="vpn-master" prop="vpnMaster" width="220" align="center">
            <template slot-scope="scope">
              {{ scope.row.vpnMaster }}
              {{ scope.row.vpnMasterProvider ? `(${scope.row.vpnMasterProvider})` : '' }}
            </template>
          </el-table-column>
          <el-table-column label="vpn-slave" prop="vpnSlave" width="220" align="center">
            <template slot-scope="scope">
              {{ scope.row.vpnSlave }}
              {{ scope.row.vpnSlaveProvider ? `(${scope.row.vpnSlaveProvider})` : '' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button :disabled="!scope.row.networkStatus" @click="handleSwitch(scope.row)"
                >切换</el-button
              >
              <el-button @click="handleModify(scope.row)">编辑</el-button>
              <el-button @click="handleDelete(scope.row.id)">删除</el-button>
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
          class="wh__body--page"
          @current-change="changePageIndex"
        >
        </el-pagination>
      </div>
    </div>
    <modify ref="modify" @confirm="modifyConfirm" />
    <add ref="add" @confirm="addConfirm" />
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
