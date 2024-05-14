<script>
import batchInputDialog from './components/batch-input-dialog.vue'
import activeCardDialog from './components/active-card-dialog.vue'
import cardPanel from '@/page/components/panel/card-info-panel.vue'
import filterSessionMixins from './mixins/pool-filter-session'
import Download from '@/page/components/wh-download/wh-download'
import DialogBatchIccidInput from '@/page/components/DialogBatchIccidInput.vue'
import DialogBatchIccidInputSearch from '@/page/components/DialogBatchIccidInputSearch'

export default {
  name: 'SystemPoolDetail',
  components: {
    'active-card-dialog': activeCardDialog,
    'batch-input-dialog': batchInputDialog,
    'card-panel': cardPanel,
    DialogBatchIccidInputSearch
  },
  mixins: [filterSessionMixins],
  data() {
    return {
      batchIccids: [],
      page: {
        pageSize: 10,
        pageIndex: 1,
        orderBy: '',
        total: 0
      },
      form: {
        iccid: '',
        searchType: '',
        physicalStatus: '',
        iccids: [],
        iccidsOssKey: ''
      },
      userNowMonthly: {},
      // 表格字段
      tableData: [],
      multipleSelection: [],
      loading: false,
      // 弹窗功能
      activeIccid: '',
      dialog: {
        batchInputVisible: false,
        activeVisible: false
      },
      pool: {},
      popShowFilter: false,
      physicalStatusMap: {
        TEST_READY_NAME: '可测试',
        ACTIVATION_READY_NAME: '待激活',
        ACTIVATED_NAME: '已激活',
        DEACTIVATED_NAME: '已停卡',
        RETIRED_NAME: '已销卡'
      },
      batchDialogData: {
        fileList: [],
        iccids: []
      }
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    noBatchSearchData() {
      const { fileList, iccids } = this.batchDialogData
      return fileList.length === 0 && iccids.length === 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    closeDialog(name, flag, iccids) {
      this.dialog[name] = false
      if (flag) this.getList()
      if (iccids) this.showDialog('activeVisible', iccids)
    },
    showDialog(name, iccids) {
      this.dialog[name] = true
      if (iccids) this.activeIccid = iccids
    },
    openActiveDialog() {
      if (this.multipleSelection.length) {
        this.showDialog('activeVisible', this.multipleSelection.map((e) => e.iccid).join(','))
      } else {
        this.showDialog('batchInputVisible')
      }
    },
    // 获取列表
    async getList() {
      this.loading = true
      if (this.form.iccid) {
        // 如果单条输入框存在值则需要清除批量搜索的值
        this.resetSameIccidSearch('batchIccids')
      }
      let rst = await this.jaxLib.pool.cardList({
        storeStatus: this.form.searchType,
        poolId: this.id,
        iccid: this.form.iccid,
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize,
        physicalStatus: this.form.physicalStatus,
        orderBy: this.page.orderBy,
        iccids: this.batchIccids,
        iccidsOssKey: this.form.iccidsOssKey
      })
      this.loading = false
      if (!rst.success) return false
      this.tableData = rst.data.list
      this.page.total = rst.data.page.allCount
      this.pool = rst.data.pool
    },
    // 页码切换
    handleCurrentChange(val) {
      this.page.pageIndex = val
      this.getList()
    },
    // 点击搜索
    handleIconClick() {
      this.page.pageIndex = 1
      this.getList()
    },
    // 多选变化
    tableSelectionChange(val) {
      this.multipleSelection = val
    },
    // 排序变化
    tableSortChange(val) {
      if (val.prop) {
        this.page.orderBy = `${val.prop} ${val.order === 'descending' ? 'desc' : 'asc'}`
      } else {
        this.page.orderBy = ''
      }
      this.page.pageIndex = 1
      this.getList()
    },
    // 关闭页面
    closePage() {
      this.$router.push({ name: 'system-pool-show', params: { carrier: this.pool.carrier } })
    },
    // 导出
    async exportTable(type) {
      if (this.form.iccid) {
        // 如果单条输入框存在值则需要清除批量搜索的值
        this.resetSameIccidSearch('batchIccids')
      }
      const params = {
        storeStatus: this.form.searchType,
        poolId: this.id,
        iccid: this.form.iccid,
        orderBy: this.page.orderBy,
        physicalStatus: this.form.physicalStatus,
        iccids: this.batchIccids,
        iccidsOssKey: this.form.iccidsOssKey
      }
      const { data, success } = await this.jaxLib.pool.exportTable(params, type)
      if (!success) return false
      await Download({ ...data })
    },
    // 打开批量输入弹框
    onBatchInput() {
      this.$refs.dialogBatchIccidInputSearch.open()
    },
    resetSameIccidSearch(resetTarget) {
      if (resetTarget === 'batchIccids') {
        this.batchIccids = []
        this.form.iccidsOssKey = ''
        this.batchDialogData = {
          iccids: [],
          fileList: []
        }
      } else {
        this.form.iccid = ''
      }
    },
    onBatchInputConfirm($event) {
      this.batchIccids = $event.iccids.filter((item) => !!item)
      this.form.iccidsOssKey = $event.iccidsOssKey
      this.batchDialogData = {
        iccids: $event.iccids.filter((item) => !!item),
        fileList: $event.fileList
      }
      if (!this.noBatchSearchData) this.resetSameIccidSearch('iccids')
      this.getList()
    }
  }
}
</script>

<template>
  <div class="systemPoolList">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">
          系统流量池 -
          <span v-tag-extract="{ volume: pool.poolSpecification }"></span>
        </h2>
        <span class="wh__header--close">
          <wh-std-icon sign="xe6aa" @click="closePage"> </wh-std-icon>
        </span>
      </div>
      <div class="wh__tools">
        <div class="wh__info--title">
          <span>卡片列表</span>
        </div>
        <el-input
          v-model="form.iccid"
          class="wh__tools--search-input"
          placeholder="请输入ICCID"
          @keyup.native.enter="handleIconClick"
        />
        <el-badge is-dot class="item" :hidden="noBatchSearchData">
          <el-button icon="el-icon-plus" @click.native="onBatchInput" />
        </el-badge>
        <el-select
          v-model="form.searchType"
          clearable
          placeholder="请选择库存状态"
          @change="handleIconClick"
        >
          <el-option
            v-for="(key, val) in enums.cardStoreStatus.maps()"
            :key="val"
            :label="key"
            :value="val"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="form.physicalStatus"
          clearable
          placeholder="请选择运营商状态"
          @change="handleIconClick"
        >
          <el-option
            v-for="(item, key) in physicalStatusMap"
            :key="key"
            :label="item"
            :value="key"
          ></el-option>
        </el-select>
        <el-button icon="el-icon-search" @click="handleIconClick" />
        <el-popover
          ref="popover-filter"
          v-model="popShowFilter"
          title="字段过滤"
          placement="bottom"
          class="wh__tools--filter"
          trigger="click"
        >
          <el-checkbox-group
            v-model="revealFields.stored"
            class="userPoolShow__filter"
            @change="handleRevealChange"
          >
            <el-checkbox
              v-for="(value, key) in revealFields.full"
              :key="key"
              :label="key"
              class="wh__tools--filter-item"
            >
              {{ value }}
            </el-checkbox>
          </el-checkbox-group>
        </el-popover>
        <el-button v-popover:popover-filter class="float-right ml10" size="mini">
          <wh-std-icon sign="&#xe693;"> </wh-std-icon>
        </el-button>
        <el-popover placement="bottom" trigger="hover">
          <div style="margin-bottom: 8px">
            <el-button type="primary" @click="exportTable(0)">导出卡运营商内容</el-button>
          </div>
          <div>
            <el-button type="primary" @click="exportTable(1)">导出客户侧信息</el-button>
          </div>
          <el-button slot="reference" size="mini" class="float-right ml10">
            <wh-std-icon sign="&#xe635;"> </wh-std-icon>
          </el-button>
        </el-popover>
        <el-button class="float-right ml10" type="primary" size="mini" @click="openActiveDialog">
          <wh-std-icon sign="xe676"> </wh-std-icon>
          扩池锁卡
        </el-button>
      </div>
      <div class="wh__body">
        <el-table
          v-loading="loading"
          :data="tableData"
          height="calc(100vh - 260px)"
          class="wh__body--table"
          @selection-change="tableSelectionChange"
          @sort-change="tableSortChange"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column prop="iccid" label="ICCID" min-width="190">
            <template slot-scope="scope">
              <card-panel :key="scope.row.iccid" :iccid="scope.row.iccid" placement="right">
                <span>{{ scope.row.iccid }}</span>
              </card-panel>
            </template>
          </el-table-column>
          <el-table-column label="电话号码" prop="msisdn" min-width="140"> </el-table-column>
          <el-table-column
            v-if="revealWord.storeStatus"
            label="库存状态"
            prop="storeStatus"
            min-width="140"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.storeStatus | cardStoreStatusFilter }}
                <span v-if="scope.row.storeStatus === 'locked'">
                  ({{ scope.row.lockStatus | lockStatusFilter }})
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="revealWord.gprsStatus" label="网络状态" min-width="110">
            <template slot-scope="scope">
              {{ scope.row.gprsStatus | gprsStatusFilter }}
            </template>
          </el-table-column>
          <el-table-column v-if="revealWord.deviceStatus" label="设备状态" min-width="110">
            <template slot-scope="scope">
              {{ scope.row.deviceStatus | deviceStatusFilter }}
            </template>
          </el-table-column>
          <el-table-column v-if="revealWord.physicalStatus" label="运营商状态" min-width="110">
            <template slot-scope="scope">
              <div>{{ scope.row.physicalStatus | physicalStatusFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="revealWord.poolSpecification"
            prop="poolSpecification"
            label="客户套餐规格"
            min-width="140"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.validity">
                <span v-if="scope.row.validity === 1"
                  >{{ scope.row.totalVolume | volumeFilter }}/月</span
                >
                <span v-else
                  >{{ scope.row.totalVolume | volumeFilter }}/{{ scope.row.validity }}月</span
                >
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="revealWord.usage"
            prop="usage"
            label="单卡累加本月用量（MB）"
            sortable="custom"
            min-width="200"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.usedVolume | volumeFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="revealWord.carrierUsedVolume"
            prop="usage"
            label="流量池接口本月用量（MB）"
            sortable="custom"
            min-width="200"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.carrierUsedVolume | volumeFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="revealWord.dataUsage"
            prop="dataUsage"
            label="最近同步时间"
            min-width="170"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.lastSyncTime | dateFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="revealWord.totalDataVolume"
            prop="totalDataVolume"
            label="套餐过期时间"
            min-width="170"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.expireDate | dateFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="revealWord.lockDate"
            prop="lockDate"
            label="锁卡时间"
            min-width="130"
          >
            <template slot-scope="scope">
              {{ scope.row.lockDate | dateFilter }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          layout="prev, pager, next, jumper, total"
          :total="page.total"
          class="wh__body--page"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog title="激活" :visible.sync="dialog.activeVisible">
      <active-card-dialog
        :multiple-selection="activeIccid"
        dialog-name="activeVisible"
        @closeDialog="closeDialog"
      >
      </active-card-dialog>
    </el-dialog>
    <el-dialog title="批量激活" :visible.sync="dialog.batchInputVisible">
      <batch-input-dialog dialog-name="batchInputVisible" @closeDialog="closeDialog">
      </batch-input-dialog>
    </el-dialog>
    <dialog-batch-iccid-input-search
      ref="dialogBatchIccidInputSearch"
      :file-list="batchDialogData.fileList"
      :iccids="batchDialogData.iccids"
      :file-url="form.iccidsOssKey"
      @confirm="onBatchInputConfirm"
    />
  </div>
</template>
