<script>
import apis from '@/api/ironman-api'
import CpeDeviceTerminal from '@/page/cpe/children/device/device-list/terminal'

export default {
  components: {
    CpeDeviceTerminal
  },
  data() {
    return {
      search: { hideHandled: true },
      tableData: [],
      selectedRow: [],
      isLoading: true,
      page: {
        pageIndex: 1,
        pageSize: 30,
        total: 0
      },
      deviceTypeMap: {
        CPE: '路由器',
        CLIENT: '终端'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    terminalOpen(data) {
      this.$refs.cpeDeviceTerminal.open(data)
    },
    async getList(pageIndex = 1) {
      this.page.pageIndex = pageIndex
      this.isLoading = true
      const { deviceName, macAddr, orgName, deviceType, hideHandled } = this.search
      const params = { pageIndex, pageSize: 30, hideHandled }
      if (deviceName) params.deviceName = deviceName
      if (macAddr) params.macAddr = macAddr
      if (orgName) params.orgName = orgName
      if (deviceType) params.deviceType = deviceType
      const {
        success,
        data: { list, page }
      } = await apis.alertRecordList(params)
      this.isLoading = false
      if (!success) return false
      this.tableData = list
      this.page.total = page.allCount
    },
    async alertHandle(id, status, type) {
      if (type === 'single') {
        const { success } = await apis.alertHandle({ idList: [id], status })
        if (success) {
          this.$message({ type: 'success', message: '操作成功' })
        }
      } else {
        if (!this.selectedRow.length) {
          return this.$message({ type: 'warning', message: '请选择需要处理的告警' })
        }
        this.$confirm('确认批量处理所选告警吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const idList = this.selectedRow.map((item) => item.id)
          const { success } = await apis.alertHandle({ idList, status: 'HANDLED' })
          if (success) {
            this.$message({ type: 'success', message: '操作成功' })
            this.getList(this.pageIndex)
          }
        })
      }
    },
    handleSelectionChange(val) {
      this.selectedRow = val
    },
    switchToList(row) {
      if (row.deviceType === 'CPE') {
        this.$router.push({ name: 'cpe-device-list', query: { macAddr: row.macAddr } })
      } else if (row.deviceType === 'CLIENT') {
        this.terminalOpen({
          macAddr: row.parentMacAddr,
          client: row.macAddr
        })
      }
    }
  }
}
</script>

<template>
  <div class="cpe-alarm-list wh__warp">
    <div class="wh__header">
      <div class="wh__header--title">告警列表</div>
    </div>
    <div class="wh__tools">
      <div class="wh__tools--search">
        <el-input
          v-model.trim="search.deviceName"
          placeholder="请输入设备名称"
          class="wh__tools--search-input"
          style="width: 250px"
          @keyup.enter.native="getList(1)"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="getList(1)"> </el-button>
        </el-input>
        <el-input
          v-model.trim="search.macAddr"
          placeholder="请输入Mac地址"
          class="wh__tools--search-input"
          style="width: 250px"
          @keyup.enter.native="getList(1)"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="getList(1)"> </el-button>
        </el-input>
        <el-input
          v-model.trim="search.orgName"
          placeholder="请输入客户名称"
          class="wh__tools--search-input"
          @keyup.enter.native="getList(1)"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="getList(1)"> </el-button>
        </el-input>
        <el-select
          v-model="search.deviceType"
          placeholder="请选择设备类型"
          clearable
          @change="getList(1)"
        >
          <el-option v-for="(item, key) in deviceTypeMap" :key="key" :value="key" :label="item">{{
            item
          }}</el-option>
        </el-select>
        <el-checkbox v-model="search.hideHandled" class="ml10" @change="getList(1)"
          >隐藏已处理设备</el-checkbox
        >
        <div class="float-right">
          <div class="card-manage__search--button">
            <el-button type="primary" @click="alertHandle">批量处理</el-button>
          </div>
          <div class="card-manage__search--button">
            <el-button type="primary" @click="$router.push({ name: 'cpe-alarm-setting' })"
              >告警设置</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="wh__body">
      <el-table v-loading="isLoading" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column label="序号" width="70px" align="center">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="Mac地址" prop="macAddr">
          <template slot-scope="scope">
            <span class="link" @click="switchToList(scope.row)">{{ scope.row.macAddr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="90px">
          <template slot-scope="scope">
            {{ deviceTypeMap[scope.row.deviceType] }}
          </template>
        </el-table-column>
        <el-table-column label="设备名称" prop="deviceName"></el-table-column>
        <!--        <el-table-column label="星标">-->
        <!--          <template slot-scope="scope">{{ scope.row.follow ? '是' : '否' }}</template>-->
        <!--        </el-table-column>-->
        <el-table-column label="客户名称" prop="orgName"></el-table-column>
        <el-table-column label="关联设备" prop="parentMacAddr">
          <template slot-scope="scope">
            <span
              v-if="scope.row.parentMacAddr"
              class="link"
              @click="switchToList({ deviceType: 'CPE', macAddr: scope.row.parentMacAddr })"
            >
              {{ scope.row.parentMacAddr }}
            </span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column label="告警规则" prop="desc"></el-table-column>
        <el-table-column label="告警时间" prop="time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-text="处理"
              inactive-text="挂起"
              active-value="HANDLED"
              inactive-value="HOLDING"
              inactive-color="#ff4949"
              @change="alertHandle(scope.row.id, $event, 'single')"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div class="wh__body--page">
        <el-pagination
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          layout="total, prev, pager, next"
          :total="page.total"
          @current-change="getList"
        >
        </el-pagination>
      </div>
    </div>
    <cpe-device-terminal ref="cpeDeviceTerminal" />
  </div>
</template>

<style lang="scss" scoped>
.link {
  color: #1c8de0;
  cursor: pointer;
  text-decoration: underline;
}
</style>
