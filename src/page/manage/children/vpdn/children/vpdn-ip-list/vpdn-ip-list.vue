<script>
/**
 * Create by zeter on 2018/6/6
 */
import { IPListColumns } from './mixins/const'
import ipMappingList from './components/ip-mapping-list.vue'
import ipEdit from './components/ip-edit.vue'
import ipBind from './components/ip-bind.vue'
import { mapState } from 'vuex'
import Download from '@/page/components/wh-download/wh-download'
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
import filterQueryParams from '@/global/function/filterQueryParams'

export default {
  components: {
    'wh-carrier-account-select': whCarrierAccountSelect,
    'ip-edit': ipEdit,
    'ip-mapping-list': ipMappingList,
    'ip-bind': ipBind
  },
  data() {
    return {
      dialogVisible: {
        displayEditorIp: false,
        displayIpShow: false,
        displayIpBind: false
      },
      search: {
        carrier: '',
        carrierAccountId: '',
        apn: '',
        routerIp: ''
      },
      columns: IPListColumns,
      dataList: [],
      loading: false,
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      nowRow: {}
    }
  },
  computed: {
    ...mapState({
      unicomAccountList: (state) => state.carrierAccount.unicomAccountList,
      cmccAccountList: (state) => state.carrierAccount.cmccAccountList,
      chinanetAccountList: (state) => state.carrierAccount.chinanetAccountList
    })
  },
  async mounted() {
    await this.$store.dispatch('changeAccountList')
    this.getList()
  },
  methods: {
    onSearch() {
      this.page.pageIndex = 1
      this.getList()
    },
    // 加载列表
    async getList() {
      this.loading = true
      let rst = await this.jaxLib.vpdn.ip.plans(
        filterQueryParams({
          pageNo: this.page.pageIndex,
          ...this.search
        })
      )
      this.loading = false
      if (!rst.success) return false
      this.dataList = rst.data.list.map((e) => {
        let keys = this[`${e.carrier}AccountList`].filter((i) => i.id === e.carrierAccountId)
        e.carrierAccountName = keys.length ? keys[0].name : ''
        return e
      })
      this.page.total = rst.data.page.allCount
    },
    // 切换页面
    changePage(index) {
      this.page.pageIndex = index
      this.getList()
    },
    // 切换大小
    handleSizeChange(size) {
      this.page.pageSize = size
      this.getList()
    },
    // 打开弹窗
    openDialog(row, type) {
      if (row) this.nowRow = row
      this.dialogVisible[type] = true
    },
    // 关闭弹窗
    closeDialog(name, flag) {
      this.dialogVisible[name] = false
      if (flag) {
        this.getList()
      }
    },
    // 导出失败
    async outFailure(item) {
      const { success, data } = await this.jaxLib.vpdn.ip.failDown({
        planId: item.id
      })
      if (!success) return false
      await Download({ ...data })
    },
    async outSuccess(item) {
      const { success, data } = await this.jaxLib.vpdn.ip.successDown({
        planId: item.id
      })
      if (!success) return false
      await Download({ ...data })
    },
    handleDownload(item, type) {
      const typeMap = {
        okCount: this.outSuccess,
        failCount: this.outFailure
      }
      typeMap[type](item)
    },
    // 失败重试
    failRetry(item) {
      this.$confirm('将对此条的失败卡进行重试?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let rst = await this.jaxLib.vpdn.ip.failRetry({
            planId: item.id
          })
          if (!rst.success) return false

          this.$message.success('重试已提交')
          this.getList()
        })
        .catch(() => {})
    },
    onCarrierChange() {
      this.onSearch()
    }
  }
}
</script>

<template>
  <div class="vpdn-ip-list">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">IP地址管理</h2>
      </div>
      <div class="wh__tools--mix">
        <el-select
          v-model="search.carrier"
          placeholder="选择运营商"
          clearable
          class="wh__tools--search-filter"
          style="width: 120px"
          @change="onCarrierChange"
        >
          <el-option
            v-for="(key, val) in enums.carrier.maps()"
            :key="val"
            :label="key"
            :value="val"
          />
        </el-select>
        <wh-carrier-account-select
          v-model="search.carrierAccountId"
          placeholder="运营商账号"
          :carrier="search.carrier"
          @change="onSearch"
        />
        <el-input
          v-model.trim="search.apn"
          class="wh__tools--search-input"
          placeholder="请输入APN"
          size="small"
          @keyup.native.enter="onSearch"
        />
        <el-input
          v-model.trim="search.routerIp"
          class="wh__tools--search-input"
          placeholder="请输入路由器IP"
          size="small"
          @keyup.native.enter="onSearch"
        />
        <el-button
          class="float-right wh__tools--mix-btn"
          size="mini"
          type="primary"
          @click="openDialog(null, 'displayEditorIp')"
          >新增</el-button
        >
      </div>
      <div class="wh__body">
        <el-table
          v-loading="loading"
          :data="dataList"
          style="width: 100%"
          height="calc(100vh - 220px)"
          class="wh__body--table"
        >
          <el-table-column label="运营商" min-width="50">
            <template slot-scope="scope">
              {{ scope.row.carrier | carrierFilter }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in columns"
            :key="index"
            :prop="item.key"
            :label="item.name"
            :min-width="item.width"
            :align="item.align"
            :class-name="item.style"
          >
            <template #default="{ row }">
              <template v-if="!item.downloadRenderKey">
                {{ item.formatter ? item.formatter(row) : row[item.key] }}
              </template>
              <template v-else>
                <el-button
                  v-if="row[item.downloadRenderKey] > 0"
                  type="text"
                  @click="handleDownload(row, item.downloadRenderKey)"
                >
                  {{ row[item.downloadRenderKey] }}
                </el-button>
                <template v-else>
                  {{ row[item.downloadRenderKey] }}
                </template>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作" :min-width="160" class-name="vpdn-ip-list__table--other">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.mappingCount"
                type="button"
                size="mini"
                @click="openDialog(scope.row, 'displayIpBind')"
                >制作IP映射</el-button
              >
              <el-button type="button" size="mini" @click="openDialog(scope.row, 'displayIpShow')"
                >查看映射</el-button
              >
              <el-button
                v-if="scope.row.failCount"
                type="button"
                size="mini"
                @click="failRetry(scope.row)"
                >失败重试</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="wh__body--page">
          <el-pagination
            :current-page="page.pageIndex"
            :page-size="page.pageSize"
            layout="prev, pager, next, jumper"
            :total="page.total"
            class="wh__body--page"
            @current-change="changePage"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      title="新增"
      width="439px"
      size="small"
      :visible.sync="dialogVisible.displayEditorIp"
      class="wh__dialog"
      top="7%"
    >
      <ip-edit dialog-name="displayEditorIp" @closeDialog="closeDialog"> </ip-edit>
    </el-dialog>
    <el-dialog
      title="IP映射列表"
      size="large"
      :visible.sync="dialogVisible.displayIpShow"
      width="70%"
      class="wh__dialog"
    >
      <ip-mapping-list :now="nowRow" dialog-name="displayIpShow" @closeDialog="closeDialog">
      </ip-mapping-list>
    </el-dialog>
    <el-dialog
      title="IP映射"
      size="small"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="dialogVisible.displayIpBind"
      class="wh__dialog"
    >
      <ip-bind
        v-if="dialogVisible.displayIpBind"
        :now="nowRow"
        dialog-name="displayIpBind"
        @closeDialog="closeDialog"
      >
      </ip-bind>
    </el-dialog>
  </div>
</template>
