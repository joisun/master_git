<script>
import whSaleSelect from '@/page/components/wh-sales-select.vue'
import DeviceOperation from './components/operation.vue'
import DeviceDetail from './components/detail.vue'
import DeviceTag from './components/device-tag.vue'
import apis from '@/api/ajax'
import { selectionMixin } from '@/global/mixins/table-selection'
import CpeDeviceTerminal from './terminal'
import { getIccidCarrier } from '@/global/function/iccids-tool'
import moment from 'moment'
import cpeUserLogin from '@/global/function/cpe-super-login'

const SELECTION_STORAGE_KEY = 'whitehouse_cpe_device_list'
export default {
  name: 'CpeDeviceList',
  components: {
    'wh-sales-select': whSaleSelect,
    DeviceOperation,
    DeviceDetail,
    DeviceTag,
    CpeDeviceTerminal
  },
  mixins: [selectionMixin],
  data() {
    return {
      deviceDialogShow: false,
      form: {
        searchOrg: '',
        searchDevice: this.$route.query.macAddr || '',
        saler: '',
        isTestingDevice: null,
        model: ''
      },
      tableData: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      system: '',
      loading: false,
      storageKey: SELECTION_STORAGE_KEY
    }
  },
  computed: {
    selectedMacAddr() {
      return this.selected.map((item) => item.macAddr)
    }
  },
  mounted() {
    this.getBannerUrl()
    this.getList()
    this.clearStorageSelection()
  },
  methods: {
    isExpired(expireDate) {
      return moment().isAfter(expireDate)
    },
    handleWanLan(row) {
      this.$router.push({
        name: 'cpe-tool-wan2lan',
        query: { macAddr: row.macAddr }
      })
    },
    handleTopic(row) {
      this.$router.push({
        name: 'cpe-tool-mqtt-topic',
        query: { tab: 'third', macAddr: row.macAddr }
      })
    },
    handleYunLogin(yunUrl) {
      window.open(yunUrl)
    },
    goWebSsh(port) {
      window.open(`http://net-forward-01.simboss.com:2222/view/?port=${port}`)
    },
    async changeSsh(row, enable) {
      try {
        this.sshLoading = true
        const { success, message } = await apis.cpe.sshConfig({
          macAddr: row.macAddr,
          enable
        })
        if (success) {
          this.$message({ type: 'success', message })
          this.$emit('updateList')
        }
      } catch (e) {
      } finally {
        this.sshLoading = false
      }
    },
    handleSelfExame(row) {
      this.$router.push({
        name: 'cpe-tool-self-check',
        query: { from: 'device-list', macAddr: row.macAddr }
      })
    },
    handleTag(row) {
      this.$refs.deviceTag.open(row)
    },
    terminalOpen(data) {
      this.$refs.cpeDeviceTerminal.open(data)
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
      this.form.searchOrg = this.form.searchOrg.trim()
      this.form.searchDevice = this.form.searchDevice.trim()
      this.form.model = this.form.model.trim()
      const {
        success,
        data: { page, list }
      } = await apis.cpe.getDeviceList({
        pageIndex,
        pageSize,
        ...this.form
      })
      this.loading = false
      if (!success) return false
      this.tableData = list.map((item) => ({
        ...item,
        ssid: (item.ssid || '').split(','),
        iccid: (item.iccid || '')
          .split(',')
          .map((iccid) => ({ iccid, carrier: getIccidCarrier(iccid) }))
      }))
      this.page.total = page.allCount
      if (this.tableData.length === 1) {
        // 只有一条数据的时候默认选中
        this.handleSelectionChange(this.tableData)
        this.$nextTick(() => {
          this.$refs.tableRef.clearSelection()
          this.$refs.tableRef.toggleRowSelection(this.tableData[0])
        })
      } else if (this.selected.length) {
        const selected = this.tableData.filter(
          (item) => this.selectedMacAddr.indexOf(item.macAddr) > -1
        )
        this.handleSelectionChange(selected)
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
    async setFollow(macAddr, follow, index) {
      const { success } = await apis.cpe.deviceSetFollow({ macAddr, follow })
      if (success) {
        this.$message({ type: 'success', message: '操作成功' })
        this.$set(this.tableData[index], 'isFollowedDevice', follow)
      }
    },
    closeTagDialog({ refresh } = {}) {
      refresh && this.getList()
    }
  }
}
</script>

<template>
  <div class="wh__warp cpe-device-list">
    <div class="wh__header">
      <div class="wh__header--title">设备列表</div>
    </div>
    <!-- tools -->
    <div class="wh__tools">
      <el-popover ref="operationPopover" title="操作" placement="bottom" trigger="click">
        <device-operation :selected="selected" @updateList="getList" />
      </el-popover>
      <div class="wh__tools--search">
        <wh-sales-select v-model="form.saler" @change="search"> </wh-sales-select>
        <el-input
          v-model.trim="form.searchOrg"
          placeholder="客户名称"
          name="searchField"
          class="wh__tools--search-input"
          @keyup.enter.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="search"> </el-button>
        </el-input>
        <el-input
          v-model.trim="form.searchDevice"
          placeholder="请输入设备名称/Mac地址/ICCID"
          name="searchField"
          class="wh__tools--search-input"
          style="width: 280px"
          @keyup.enter.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="search"> </el-button>
        </el-input>
        <el-select
          v-model="form.isTestingDevice"
          placeholder="选择设备类型"
          clearable
          @change="search"
        >
          <el-option :value="true" label="测试设备"></el-option>
          <el-option :value="false" label="正式设备"></el-option>
        </el-select>
        <el-input
          v-model.trim="form.model"
          placeholder="请输入设备型号"
          name="searchField"
          class="wh__tools--search-input"
          @keyup.enter.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="search"> </el-button>
        </el-input>
        <div class="float-right">
          <div class="card-manage__search--button">
            <el-button
              type="primary"
              @click="() => $router.push({ name: 'cpe-tool-logs', query: { from: 'device-list' } })"
            >
              日志统计
            </el-button>
          </div>
          <div class="card-manage__search--button">
            <el-button v-popover:operationPopover type="primary">操作</el-button>
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
          row-key="macAddr"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <device-detail :device="scope.row" />
            </template>
          </el-table-column>
          <el-table-column type="selection" width="40" align="center" :reserve-selection="true" />
          <el-table-column label="星标" width="45" align="center">
            <template slot-scope="scope">
              <span
                v-if="scope.row.isFollowedDevice"
                class="el-icon-star-on icon-star icon-star--on"
                @click="setFollow(scope.row.macAddr, false, scope.$index)"
              >
              </span>
              <span
                v-else
                class="el-icon-star-off icon-star"
                @click="setFollow(scope.row.macAddr, true, scope.$index)"
              >
              </span>
            </template>
          </el-table-column>
          <el-table-column label="客户/归属" width="300">
            <template slot-scope="scope">
              <el-button
                type="text"
                style="text-decoration: none; white-space: nowrap"
                @click="userLogin(scope.row)"
                >{{ scope.row.orgId }} -
                {{ scope.row.orgName }}
              </el-button>
              <span> ({{ scope.row.saleName | saleFilter }})</span>
            </template>
          </el-table-column>
          <el-table-column label="设备名称" prop="name"></el-table-column>
          <el-table-column label="型号/固件版本/mqtt版本" prop="model" width="155">
            <template slot-scope="scope">
              <span
                >{{ scope.row.model || '-' }}
                <span class="separate">/</span>
                {{ scope.row.version || '-' }}
                <span class="separate">/</span>
                {{ scope.row.mqttVersion || '-' }}
              </span>
            </template>
          </el-table-column>
          <!--          <el-table-column label="出库类型" width="80" align="center">-->
          <!--            <template slot-scope="scope">-->
          <!--              {{ scope.row.isTestingDevice ? '测试设备' : '正式设备' }}-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column label="MAC地址" prop="macAddr" width="180" align="left">
            <template slot-scope="{ row }">
              <span style="width: 110px; display: inline-block">{{ row.macAddr }}</span>
              <span v-if="row.isTestingDevice" class="test-device-tag">测</span>
              <span
                v-if="isExpired(row.expireDate)"
                class="test-device-tag"
                style="background-color: red"
              >
                E
              </span>
              <span
                v-if="row.tags && row.tags.includes('PACKAGE_ITEM')"
                class="test-device-tag"
                style="background-color: green"
                >包
              </span>
            </template>
          </el-table-column>
          <el-table-column label="ICCID" prop="iccid" width="200">
            <template slot-scope="scope">
              <div v-for="item in scope.row.iccid" :key="item.iccid">
                <wh-carrier-icon v-if="item.carrier" :carrier="item.carrier"></wh-carrier-icon>
                {{ item.iccid }}
                <span
                  v-if="scope.row.tags.includes('THREE_IN_ONE_CARD')"
                  class="test-device-tag"
                  style="background-color: #1c8de0"
                  >合</span
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column label="网络状态/连接数" prop="networkStatus" align="center" width="120">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.networkStatus" type="success">在线</el-tag>
              <el-tag v-else>离线</el-tag>
              (
              <span class="link" @click="terminalOpen({ macAddr: scope.row.macAddr })">
                {{ scope.row.wifiClients }}
              </span>
              )
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="action" width="110">
            <template slot-scope="{ row }">
              <!--              <el-button size="mini" @click="handleSelfExame(row)">自检</el-button>-->
              <!--              <template v-if="row.platform === 'JARVIS'">-->
              <!--                <el-button-->
              <!--                  v-if="!row.sshPort"-->
              <!--                  style="margin-left: 2px"-->
              <!--                  type="primary"-->
              <!--                  @click="changeSsh(row, true)"-->
              <!--                  >开启ssh</el-button-->
              <!--                >-->
              <!--                <el-button-->
              <!--                  type="primary"-->
              <!--                  style="margin-left: 2px"-->
              <!--                  @click="handleSelfExame(row, false)"-->
              <!--                  >关闭ssh</el-button-->
              <!--                >-->
              <!--              </template>-->
              <!--              <el-button type="text" @click="handleTag(row)">标记</el-button>-->
              <!--              <el-button type="text" @click="handleTopic(row)">Topic下发</el-button>-->
              <el-button
                v-if="row.yunUrl"
                style="margin-left: 2px"
                size="mini"
                type="text"
                @click="handleYunLogin(row.yunUrl)"
                >云登录</el-button
              >
              <el-dropdown style="margin-left: 2px">
                <el-button type="text">
                  更多<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleSelfExame(row)">自检</el-dropdown-item>
                  <el-dropdown-item @click.native="handleTag(row)">标记</el-dropdown-item>
                  <el-dropdown-item @click.native="handleTopic(row)">Topic下发</el-dropdown-item>
                  <template v-if="row.platform === 'JARVIS'">
                    <el-dropdown-item v-if="!row.sshPort" @click.native="changeSsh(row, true)">
                      开启ssh</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="changeSsh(row, false)">
                      关闭ssh</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="goWebSsh(row.sshPort)">
                      web ssh</el-dropdown-item
                    >
                  </template>
                  <el-dropdown-item @click.native="handleWanLan(row)">WAN/LAN切换</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
      <device-tag ref="deviceTag" @close="closeTagDialog" />
      <cpe-device-terminal ref="cpeDeviceTerminal" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cpe-device-list {
  .test-device-tag {
    display: inline-block;
    user-select: none;
    width: 15px;
    height: 15px;
    line-height: 15px;
    border-radius: 8px;
    font-size: 10px;
    text-align: center;
    color: #fff;
    background-color: #e6a23c;
  }
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
