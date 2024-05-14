<script>
/**
 * Create by zeter on 2017/9/21
 */
import cardDeatil from '../components/card-detail.vue'
import advancedSearch from './components/advanced-search.vue'
import cardOperation from './components/card-operation.vue'
import goSystem from '@/global/function/go-system'
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
import orderPanel from '@/page/components/panel/order-info-panel.vue'
import clientPanel from '@/page/components/panel/client-info-panel.vue'
import Download from '@/page/components/wh-download/wh-download'
import { selectionMixin } from '@/global/mixins/table-selection'
import DialogBatchIccidInputSearch from '@/page/components/DialogBatchIccidInputSearch'

const clearObjectEmptyItem = (obj) => {
  const newObj = { ...obj }
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === '') {
      delete newObj[key]
    }
  })
  return newObj
}
const SELECTION_STORAGE_KEY = 'whitehouse_card_manager'
export default {
  name: 'StoreCardList',
  components: {
    'card-detail': cardDeatil,
    'wh-carrier-account-select': whCarrierAccountSelect,
    'order-panel': orderPanel,
    'client-panel': clientPanel,
    'advanced-search': advancedSearch,
    'card-operation': cardOperation,
    DialogBatchIccidInputSearch
  },
  mixins: [selectionMixin],
  data() {
    return {
      batchDialogData: {
        fileList: [],
        iccids: []
      },
      batchIccids: undefined,
      limitMap: {
        ICCID_BIND_IMEI: '机卡绑定',
        REGIONAL_RESTRICTIONS: '区域限制',
        VOLUME_LIMIT: '限额',
        PERSONAL_REAL_NAME: '个人实名',
        INTERNET_OF_PEOPLE_RESTRICTIONS: '人联网',
        EXT_WHITE_LIST: '公网白名单'
      },
      // 加载状态
      loading: {
        loadingTop: true,
        loadingBottom: false
      },
      // 统计数据
      countList: [
        { name: '中国移动' },
        { name: '中国联通' },
        { name: '中国电信' },
        { name: '小计' }
      ],
      // 卡片列表
      cleanCards: [],
      pageConfig: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0
      },
      // 搜索状态
      popShow: false,
      searchCarrier: '',
      searchInput: '',
      searchForm: {
        search: ''
      },
      emptyText: '',
      // 弹窗
      toolBoxFun: false,
      storageKey: SELECTION_STORAGE_KEY,
      orgList: [],
      isSelectLoading: false,
      isExportBtnLoading: false,
      badgeCount: 0
    }
  },
  computed: {
    noBatchSearchData() {
      const { fileList, iccids } = this.batchDialogData
      return fileList.length === 0 && iccids.length === 0
    },
    toolShow() {
      return this.$store.state.show.cardTools
    }
  },
  watch: {
    '$route.query.search': {
      handler(newValue) {
        if (newValue) {
          this.searchForm.search = newValue
          this.getList()
        }
      },
      immediate: true
    }
  },
  created() {
    this.emptyText = '请输入ICCID、电话号码、IMSI、IP地址或批次号'
    this.statistical()
    this.resetSearchForm()
    if (this.$route.query.search) {
      this.searchForm.search = this.$route.query.search
      this.getList()
    }
    this.clearStorageSelection()
  },
  methods: {
    changeToolShow() {
      this.$store.dispatch('changeCardTools')
    },
    // 进入路由
    enterRouter(route) {
      if (typeof route === 'string') {
        this.$router.push({ name: route })
      } else if (route.type === 'open') {
        let { href } = this.$router.resolve({ name: route.name, query: route.query })
        window.open(href, '_blank')
      } else {
        this.$router.push({ name: route.name, query: route.query, params: route.params })
      }
    },
    // 导出文件
    async outFile(obj, type = 1) {
      const { success, data } =
        type === 1
          ? await this.jaxLib.card.export2CardData(obj)
          : await this.jaxLib.card.exportCardData(obj)
      if (!success) return false
      await Download({ ...data })
    },
    async exportFile() {
      this.isExportBtnLoading = true
      if (this.searchForm.search) {
        // 如果单条输入框存在值则需要清除批量搜索的值
        this.resetSameIccidSearch('batchIccids')
      }
      const { success, data } = await this.jaxLib.card.exportCardCount({
        ...clearObjectEmptyItem({ ...this.searchForm }),
        iccids: this.batchIccids
      })
      this.isExportBtnLoading = false
      if (!success) return false
      if (!data) {
        this.$message({ type: 'warning', message: '导出数据为空' })
        return false
      }
      this.$confirm(`总共${data}条数据, 确定导出吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.outFile(
          {
            ...clearObjectEmptyItem({ ...this.searchForm, pageSize: data }),
            iccids: this.batchIccids
          },
          2
        )
      })
    },
    // 导出过期卡文件
    async outExpired() {
      const { success, data } = await this.jaxLib.card.exportExpiredData()
      if (!success) return false
      await Download({ ...data })
    },
    // 加载统计信息
    async statistical() {
      this.loading.loadingTop = true
      let rst = await this.jaxLib.card.statistic.get('inventory')
      let ret = await this.jaxLib.card.statistic.get('delivered')
      let middleCountList = []
      this.enums.carrier.entries().forEach(([value, label]) => {
        middleCountList.push({
          name: label,
          delivered: ret.data[value] || 0,
          inventory: rst.data[value] || 0,
          total: (rst.data[value] || 0) + (ret.data[value] || 0)
        })
      })
      const middleFunction = (name) =>
        middleCountList.reduce((prev, curr) => {
          prev += curr[name]
          return prev
        }, 0)
      middleCountList.push({
        name: '小计',
        delivered: middleFunction('delivered'),
        inventory: middleFunction('inventory'),
        total: middleFunction('total')
      })
      this.countList = middleCountList
      this.loading.loadingTop = false
    },
    // 切页面
    onPageSizeChange(val) {
      this.pageConfig.pageSize = val
      this.getList()
    },
    handleCurrPage(val) {
      this.pageConfig.pageIndex = val
      this.getList(true)
    },
    // 运营商改变
    searchSelectChange(val) {
      this.pageConfig.pageIndex = 1
      this.searchForm.carrier = val
    },
    // 清空搜索
    resetSearchForm() {
      this.searchForm = { search: '' }
    },
    // 加载卡片
    async getList(fromPagination = false) {
      if (fromPagination !== true) {
        this.pageConfig.pageIndex = 1
      }
      if (!this.searchForm.orgId) {
        this.orgList = []
      }
      if (this.searchForm.search) {
        // 如果单条输入框存在值则需要清除批量搜索的值
        this.resetSameIccidSearch('batchIccids')
      }
      const validSearchForm = clearObjectEmptyItem({
        ...this.searchForm
      })
      if (!Object.keys(validSearchForm).length && (!this.batchIccids || !this.batchIccids.length)) {
        return this.$message.warning('禁止无条件查询')
      }
      this.loading.loadingBottom = true

      let rst = await this.jaxLib.card.get({
        pageIndex: this.pageConfig.pageIndex,
        pageSize: this.pageConfig.pageSize,
        ...validSearchForm,
        iccids: this.batchIccids
      })
      this.loading.loadingBottom = false
      if (!rst.success) return false
      this.emptyText = '暂无数据'
      this.pageConfig.totalCount = rst.data.page.allCount
      this.drawList(rst.data.list)
    },
    handleDrawerSearch() {
      this.popShow = false
      let badgeCount = 0
      Object.keys(this.searchForm).forEach((item) => {
        if (
          [
            'carrier',
            'carrierAccountId',
            'search',
            'expireDateStart',
            'silenceStart',
            'activationDeadlineStart'
          ].indexOf(item) === -1 &&
          this.searchForm[item]
        ) {
          badgeCount++
        }
      })
      this.badgeCount = badgeCount
      this.getList()
    },
    // 字段处理
    drawList(list) {
      this.cleanCards = list.map((e) => {
        e.importStatus = { success: true, fail: false }[e.importResult] // 入库结果
        e.typeName = this.enums.ratePlanType.get(e.type)
        e.show = false
        // 字段处理
        return e
      })
    },
    // 超级登录
    async goSystem(idx) {
      let preRst = await this.jaxLib.customer.list.orgHasUser({
        orgId: idx.originalOrgId
      })
      if (!preRst.success || !preRst.data) return false
      let paramConfig = {
        iccidSt: idx.iccid
      }
      goSystem(
        preRst.data.id,
        this.pointOrgName,
        `/#/card/card-list?carrier=${idx.carrier}&queryConfig=${encodeURIComponent(
          JSON.stringify(paramConfig)
        )}&enterWay=SIMPLE_SEARCH`
      )
    },
    // 列表渲染
    tableRowClassName({ row }) {
      if (!row.importStatus) {
        return 'card-manage__table--fail'
      }
      return ''
    },
    // 加载卡片详情
    async tableRowExpandOpen(row, expanded) {
      if (!expanded.length) return
      if (row.show) return
      let rst = await this.jaxLib.card.detail({ iccid: row.iccid })
      if (!rst.success) return false
      row.detailContent = rst.data
      if (!row.detailContent.runningCardInfoVO) row.detailContent.runningCardInfoVO = {}
      row.show = true
    },
    async getOrgList(content) {
      if (!content) {
        this.orgList = []
        return false
      }
      this.isSelectLoading = true
      const res = await this.jaxLib.card.organizationSearch({ content })
      this.isSelectLoading = false
      if (!res.success) return false
      this.orgList = res.data
    },
    // 打开批量输入弹框
    onBatchInput() {
      this.$refs.dialogBatchIccidInputSearch.open()
    },
    resetSameIccidSearch(resetTarget) {
      if (resetTarget === 'batchIccids') {
        this.batchIccids = undefined
        this.searchForm.iccidsOssKey = ''
        this.batchDialogData = {
          iccids: [],
          fileList: []
        }
      } else {
        this.searchForm.search = ''
      }
    },
    onBatchInputConfirm($event) {
      const batchIccids = $event.iccids.filter((item) => !!item)
      this.batchIccids = batchIccids.length ? batchIccids : undefined
      this.searchForm.iccidsOssKey = $event.iccidsOssKey
      this.batchDialogData = {
        iccids: $event.iccids.filter((item) => !!item),
        fileList: $event.fileList
      }
      if (!this.noBatchSearchData) this.resetSameIccidSearch('iccids')
      this.getList(false)
    }
  }
}
</script>

<template>
  <div class="card-manage">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">卡片管理</h2>
      </div>
      <div class="wh__tools--mix">
        <div class="card-manage__info" :class="{ hidden: toolShow }">
          <div class="card-manage__info--toolbox" @click="changeToolShow">
            <span v-if="toolShow">展开</span><span v-else>缩小</span>
          </div>
          <div class="card-manage__info--body">
            <div class="card-manage__info--body-content">
              <el-table v-loading="loading.loadingTop" :data="countList" border style="width: 100%">
                <el-table-column prop="name" label=""> </el-table-column>
                <el-table-column
                  prop="delivered"
                  header-align="center"
                  :resizable="false"
                  label="已出库"
                >
                </el-table-column>
                <el-table-column
                  prop="inventory"
                  header-align="center"
                  :resizable="false"
                  label="未出库"
                >
                </el-table-column>
                <el-table-column
                  prop="total"
                  header-align="center"
                  :resizable="false"
                  label="总卡量"
                >
                </el-table-column>
              </el-table>
            </div>
            <div class="card-manage__info--body-tools">
              <!--              <el-button type="primary" @click="enterRouter('store-receive-note')">-->
              <!--                入 库-->
              <!--              </el-button>-->
              <el-button type="primary" @click="enterRouter('store-delivery-note')">
                出 库
              </el-button>
              <el-button @click="outFile({ carrierNotRetired: false })">过期卡导出</el-button>
              <el-button @click="outFile({ carrierNotRetired: true })">未及时销卡导出</el-button>
              <el-button @click="outExpired">沉默期过期卡导出</el-button>
              <el-button @click="outFile({ isOnlyLastMonthExpired: true })"
                >上月过期卡导出</el-button
              >
            </div>
          </div>
        </div>

        <el-drawer title="高级搜索" :visible.sync="popShow" size="500px">
          <advanced-search
            v-model="searchForm"
            :org-list="orgList"
            @search="handleDrawerSearch"
            @reset="resetSearchForm"
            @carrierChange="searchSelectChange"
            @getOrgList="getOrgList"
          />
        </el-drawer>
        <el-popover ref="cardOperationPopover" title="卡操作" placement="bottom" trigger="click">
          <card-operation />
        </el-popover>
        <div class="wh__tools--search">
          <el-select
            v-model="searchForm.carrier"
            clearable
            placeholder="运营商"
            class="card-manage__search--select"
            @change="searchSelectChange"
          >
            <el-option
              v-for="(key, val) in enums.carrier.maps()"
              :key="val"
              :label="key"
              :value="val"
            >
            </el-option>
          </el-select>
          <wh-carrier-account-select
            v-model="searchForm.carrierAccountId"
            class="card-manage__search--select"
            placeholder="运营商账号"
            :carrier="searchForm.carrier"
          >
          </wh-carrier-account-select>
          <el-input
            v-model.trim="searchForm.search"
            placeholder="ICCID、电话号码、IMSI、IP地址或批次号"
            class="card-manage__search--input-lg"
            @keyup.native.enter="getList"
          >
          </el-input>
          <div class="card-manage__search--button">
            <el-badge is-dot class="item" :hidden="noBatchSearchData">
              <el-button icon="el-icon-plus" @click="onBatchInput" />
            </el-badge>
          </div>
          <div class="card-manage__search--button">
            <el-button icon="el-icon-search" @click="getList"></el-button>
          </div>

          <div class="card-manage__search--button">
            <el-badge v-if="badgeCount > 0" :value="badgeCount" class="item">
              <el-button @click="popShow = true">高级搜索</el-button>
            </el-badge>
            <el-button v-else @click="popShow = true">高级搜索</el-button>
          </div>
          <div class="float-right">
            <div class="card-manage__search--button">
              <el-button type="primary" :loading="isExportBtnLoading" @click="exportFile"
                >导出</el-button
              >
            </div>
            <div class="card-manage__search--button">
              <el-button v-popover:cardOperationPopover type="primary">卡操作</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="wh__body">
        <el-table
          v-loading="loading.loadingBottom"
          :data="cleanCards"
          :empty-text="emptyText"
          class="wh__body--table"
          border
          :row-class-name="tableRowClassName"
          @expand-change="tableRowExpandOpen"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column type="expand" width="20px">
            <template slot-scope="props">
              <card-detail v-if="props.row.show" :content="props.row" @enterRouter="enterRouter">
              </card-detail>
            </template>
          </el-table-column>
          <el-table-column label="卡信息" min-width="210">
            <template slot-scope="scope">
              <div style="padding: 4px 0 6px">
                <p v-if="scope.row.iccid">
                  <span class="card-manage__table--tips">ICCID: </span>
                  <span class="card-manage__table--content">{{ scope.row.iccid }}</span>
                </p>
                <p v-if="scope.row.msisdn">
                  <span class="card-manage__table--tips">MSISDN: </span>
                  <span class="card-manage__table--content">{{ scope.row.msisdn }}</span>
                </p>
                <p v-if="scope.row.imsi">
                  <span class="card-manage__table--tips">IMSI: </span>
                  <span class="card-manage__table--content">{{ scope.row.imsi }}</span>
                </p>
                <p v-if="scope.row.apn">
                  <span class="card-manage__table--tips">APN: </span>
                  <span class="card-manage__table--content">{{ scope.row.apn }}</span>
                </p>
                <p v-if="scope.row.ip">
                  <span class="card-manage__table--tips">IP: </span>
                  <span class="card-manage__table--content">{{ scope.row.ip }}</span>
                  <router-link
                    class="el-button--text"
                    :to="{
                      name: 'vpdn-network-detail',
                      query: {
                        iccid: scope.row.iccid,
                        carrier: scope.row.carrier,
                        carrierAccountId: scope.row.carrierAccountId,
                        ip: scope.row.ip
                      }
                    }"
                    >网络状态
                  </router-link>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="运营商信息" min-width="230">
            <template slot-scope="scope">
              <wh-carrier-icon :carrier="scope.row.carrier"></wh-carrier-icon>
              <span class="card-manage__table--content">{{ scope.row.carrierName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="卡片状态" min-width="120">
            <template slot-scope="scope">
              <div>
                <span class="card-manage__table--tips">卡状态: </span>
                <template v-if="scope.row.retainNumber">
                  <span>已停卡（停机保号）</span>
                </template>
                <template v-else>
                  <span v-if="scope.row.cardStatus" class="card-manage__table--content">{{
                    scope.row.cardStatus | cardStatusFilter
                  }}</span>
                  <span v-else>-</span>
                </template>
              </div>
              <div>
                <span class="card-manage__table--tips">网络状态: </span>
                <span v-if="scope.row.gprsStatus" class="card-manage__table--content">{{
                  scope.row.gprsStatus | gprsStatusFilter
                }}</span>
                <span v-else>-</span>
              </div>
              <div>
                <span class="card-manage__table--tips">运营商状态: </span>
                <span v-if="scope.row.physicalStatus" class="card-manage__table--content">{{
                  scope.row.physicalStatus | physicalStatusFilter
                }}</span>
                <span v-else>-</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="库存状态" min-width="110">
            <template slot-scope="scope">
              <div>
                <p>
                  <span class="card-manage__table--content">
                    {{ scope.row.stockStatus | cardStoreStatusFilter }}
                  </span>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="入库信息" min-width="280">
            <template slot-scope="scope">
              <div>
                <div>
                  <span class="card-manage__table--tips">入库状态: </span>
                  <i
                    :class="{
                      'el-icon-check': scope.row.importStatus,
                      'el-icon-error': !scope.row.importStatus
                    }"
                  >
                  </i>
                  <span>{{ scope.row.importStatus ? '成功' : '失败' }}</span>
                </div>
                <div class="flex">
                  <div class="flex1">
                    <span class="card-manage__table--tips">操作ID: </span>
                    <span class="card-manage__table--content">
                      <el-button
                        type="text"
                        size="mini"
                        @click="
                          enterRouter({
                            name: 'store-record-inner',
                            query: { id: scope.row.importRecordId }
                          })
                        "
                      >
                        {{ scope.row.importRecordId }}
                      </el-button>
                    </span>
                  </div>
                  <div class="flex1">
                    <span class="card-manage__table--tips">类型: </span>
                    <span class="card-manage__table--content">
                      <el-button
                        v-if="scope.row.poolId !== 0"
                        type="text"
                        size="mini"
                        @click="
                          enterRouter({
                            name: 'system-pool-show',
                            params: { carrier: scope.row.carrier },
                            query: { poolId: scope.row.poolId }
                          })
                        "
                      >
                        {{ scope.row.typeName }}
                      </el-button>
                      <el-button
                        v-else
                        type="text"
                        size="mini"
                        @click="
                          enterRouter({
                            name: 'single-card-show',
                            params: { carrier: scope.row.carrier },
                            query: { carrierAccountId: scope.row.carrierAccountId }
                          })
                        "
                      >
                        {{ scope.row.typeName }}</el-button
                      >
                    </span>
                  </div>
                </div>
                <div class="flex">
                  <div class="flex1">
                    <div class="flex1">
                      <span class="card-manage__table--tips">材质: </span>
                      <span
                        v-material-extract="{
                          specification: scope.row.cardSpecification,
                          material: scope.row.cardMaterial
                        }"
                        class="card-manage__table--content"
                      ></span>
                    </div>
                  </div>
                  <div class="flex1">
                    <span class="card-manage__table--tips">规格: </span>
                    <span class="card-manage__table--content">{{ scope.row.importPlanName }}</span>
                  </div>
                </div>
                <div>
                  <span class="card-manage__table--tips">时间: </span>
                  <span class="card-manage__table--content">{{
                    scope.row.importDate | dateFilter
                  }}</span>
                </div>
                <div>
                  <span class="card-manage__table--tips">批次号: </span>
                  <span class="card-manage__table--content">{{ scope.row.importBatchNo }}</span>
                </div>
                <div>
                  <span class="card-manage__table--tips">特殊限制: </span>
                  <span class="card-manage__table--content">{{
                    scope.row.dbTagNames ? scope.row.dbTagNames.join('、') : ''
                  }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="出库信息" min-width="240">
            <template slot-scope="scope">
              <div v-if="scope.row.stockStatus === 'delivered'">
                <div class="flex">
                  <div class="flex4">
                    <span class="card-manage__table--tips">规格: </span>
                    <span>{{ scope.row.exportPlanName }}</span>
                  </div>
                </div>
                <div>
                  <span class="card-manage__table--tips">订单号: </span>
                  <span class="card-manage__table--content">
                    <order-panel :id="scope.row.orderNo" :key="scope.row.orderNo" placement="top">
                      <el-button
                        type="text"
                        @click="
                          enterRouter({ name: 'order-list', query: { id: scope.row.orderNo } })
                        "
                      >
                        {{ scope.row.orderNo }}
                      </el-button>
                    </order-panel>
                  </span>
                </div>
                <div>
                  <span class="card-manage__table--tips">出库时间: </span>
                  <span class="card-manage__table--content">{{
                    scope.row.exportDate | dateFilter
                  }}</span>
                </div>
                <div>
                  <span class="card-manage__table--tips">客户侧激活时间: </span>
                  <span v-if="scope.row.startDate" class="card-manage__table--content">{{
                    scope.row.startDate | dateFilter
                  }}</span>
                </div>
                <div>
                  <span class="card-manage__table--tips">客户: </span>
                  <client-panel :key="scope.row.originalOrgId" :org-id="scope.row.originalOrgId">
                    <span class="card-manage__table--content">
                      <a href="#" class="el-button--text" @click.prevent="goSystem(scope.row)">
                        {{ scope.row.orgName }}({{ scope.row.originalOrgId }})
                      </a>
                    </span>
                  </client-panel>
                </div>
              </div>
              <div v-else class="tac">暂未出库</div>
            </template>
          </el-table-column>
          <el-table-column label="合规信息" min-width="240">
            <template slot-scope="scope">
              <template v-if="scope.row.cardLimitations && scope.row.cardLimitations.length > 0">
                <div v-for="(item, index) in scope.row.cardLimitations" :key="index">
                  <span class="card-manage__table--tips">{{ item.type }}: </span>
                  <span>是</span>
                  <template v-if="item.val">
                    <span class="card-manage__table--tips"
                      >{{ item.type === '限额' ? '限额' : '群组号' }}:</span
                    >
                    <span>{{ item.val }}</span>
                  </template>
                </div>
              </template>
              <div v-else class="tac">无</div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="pageConfig.pageIndex"
          :page-sizes="[10, 20, 50, 100, 200]"
          :page-size="pageConfig.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="pageConfig.totalCount"
          class="wh__body--page"
          @size-change="onPageSizeChange"
          @current-change="handleCurrPage"
        >
        </el-pagination>
      </div>
    </div>
    <dialog-batch-iccid-input-search
      ref="dialogBatchIccidInputSearch"
      title="iccid批量查询"
      :file-list="batchDialogData.fileList"
      :iccids="batchDialogData.iccids"
      :file-url="searchForm.iccidsOssKey"
      @confirm="onBatchInputConfirm"
    />
  </div>
</template>
