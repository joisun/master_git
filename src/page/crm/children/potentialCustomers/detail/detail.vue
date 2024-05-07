<script>
import { mapState } from 'vuex'
import * as appTypes from '@/store/types'
import DetailHeader from './detail-header'
import Conflict from './conflict.vue'
import BaseInfo from './base-info.vue'
import Clues from './clues.vue'
import PreliminaryApproach from './preliminary-approach.vue'
import DemandConfirm from './demand-confirm.vue'
import Negotiation from './negotiation.vue'
import Win from './win.vue'
import DialogAbandon from '../components/dialog-abandon.vue'
import DialogSetSalesman from '../components/dialog-set-salesman.vue'
import DialogMergeCustomer from '../components/dialog-merge-customer'
import CatalogInteraction from '../mixins/catalog-interaction'
import Events from '@/constant/events'
import EventBus from '@/page/bus'
import DialogFailure from './../components/dialog-failure'
import FollowRecords from './follow-records.vue'
import MissionRecords from './mission-records.vue'
import apis from '@/api/ajax'
import crmApi from "@/api/crm-api";

const catalogs = [
  { name: '基础信息', id: 'baseInfo', mToStage: '4', finished: false },
  { name: '线索审查', id: 'clues', mToStage: '4', finished: false },
  { name: '初步接洽', id: 'preliminary', mToStage: '7', finished: false },
  { name: '需求确认', id: 'demandConfirm', mToStage: '8', finished: false },
  { name: '商务谈判', id: 'negotiation', mToStage: '10', finished: false },
  { name: '赢单', id: 'win', mToStage: '12', finished: false }
]
export default {
  components: {
    DetailHeader,
    Conflict,
    BaseInfo,
    Clues,
    PreliminaryApproach,
    DemandConfirm,
    Negotiation,
    Win,
    DialogAbandon,
    DialogSetSalesman,
    DialogMergeCustomer,
    DialogFailure,
    FollowRecords,
    MissionRecords
  },
  mixins: [CatalogInteraction],
  provide() {
    const tuple = {
      user: '',
      stages: '',
      sources: '',
      salesGroups: '',
      currentSupplierLists: '',
      areaGroups: '',
      industries: '',
      cascaderProps: '',
      discardReasons: '',
      competitors: '',
      settles: '',
      payMethod: '',
      customerStages: '',
      customerId: '',
      processedStage: '',
      catalogs: '',
      useMeals: ''
    }
    Object.keys(tuple).forEach((key) => {
      Object.defineProperty(tuple, key, {
        enumerable: true,
        get: () => this[key]
      })
    })
    return { tuple }
  },
  data() {
    return {
      cascaderProps: {
        label: 'name',
        value: 'id'
      },
      catalogs: [...catalogs],
      loading: false,
      dialogStatus: {
        isAbandonDialogShow: false,
        isSetSalesmanShow: false,
        isMergeCustomer: false,
        isFailureDialogShow: false
      },
      states: {
        abandonStage: '',
        failureStage: ''
      },
      serviceType: '1',
      serviceDetail: {
        id: null,
        balance: 0,
        clearingForm: 1,
        price: 0,
        userPrice: [],
        smsCount: null,
        chargeType: 1
      }
    }
  },
  created() {
    let { customerId } = this.$route.params
    this.fetch(customerId)
  },
  beforeDestroy() {
    EventBus.$off(Events.dimensionsDidChange, this._handleDimensionsChange)
    this._handleDimensionsChange = null
  },
  computed: {
    ...mapState({
      user: (state) => state.overall.user,
      stages: (state) => state.overall.crmEnum.stage,
      sources: (state) => state.overall.crmEnum.source,
      industries: (state) => state.industry.list,
      discardReasons: (state) => state.overall.crmEnum.discardReason,
      competitors: (state) => state.overall.crmEnum.competitor,
      customerStages: (state) => state.overall.crmEnum.customerStage,
      settles: (state) => state.overall.crmEnum.settle,
      payMethod: (state) => state.overall.crmEnum.payMethod,
      useMeals: (state) => state.overall.crmEnum.useMeal,
      areaGroups: (state) => state.overall.crmEnum.smallRegion,
      salesGroups: (state) => state.overall.crmEnum.salesGroup,
      currentSupplierLists: (state) => state.overall.crmEnum.currentSuppliers,
      detail: (state) => state.customer.detail,
      customerId: (state) => state.customer.detail.id,
      processedStage: (state) => state.customer.detail.stage
    }),
    wined() {
      let { processedStage } = this
      return Number(processedStage) >= 12
    }
  },
  watch: {
    detail: 'initProcessed',
    customerId(val) {
      this.fetchFollow(val)
    }
  },
  methods: {
    baseInfoChange(data) {
      this.detail.baseInfo = data
    },
    back() {
      if (this.$route.name === 'potential-customer-detail') {
        this.$router.push({ name: 'potential-customers-index' })
        return false
      }
      if (this.$route.name === 'customer-clues-detail') {
        this.$router.push({ name: 'customer-clues-index' })
        return false
      }
      this.$router.go(-1)
    },
    // 这里设置了finfished值
    initProcessed() {
      let { processedStage, catalogs } = this
      // let availableStages = catalogs.map(item => item.mToStage)
      catalogs.forEach((item) => {
        item.finished = +processedStage > +item.mToStage
      })
      this.catalogs = catalogs
    },
    async fetchFollow(val) {
      await this.$store.dispatch(appTypes.CUSTOMER_CONTACT_SEARCH, val)
    },
    async fetch(id) {
      this.loading = true
      await Promise.all([await this.$store.dispatch(appTypes.CUSTOMER_DETAIL_GET, id)])
      this.loading = false
    },

    async save({ stage, targetId, similarCustomer }) {
      // 进行拷贝-深拷贝
      let detail = JSON.parse(JSON.stringify(this.detail))
      let { processedStage, customerId } = this
      detail.stage = processedStage
      detail.baseInfo.stage = +processedStage
      detail.editStage = stage
      detail.customerId = customerId
      detail.targetId = targetId
      detail.similarCustomer = similarCustomer
      this.loading = true
      if (detail.usageScenario) {
        detail.usageScenario = detail.usageScenario.join(',')
      }
      delete detail.isSubCustomer
      let { success } = await this.$store.dispatch(appTypes.CUSTOMER_PUT, detail)
      this.loading = false
      if (!success) return false
      this.$message.success('阶段信息保存成功')
      if (this.detail.baseInfo.newIndustry) {
        this.$store.dispatch(appTypes.CRM_INDUSTRY)
      }
      this.fetch(detail.id)
    },

    openAbandon({ stage }) {
      this.dialogStatus.isAbandonDialogShow = true
      this.states.abandonStage = stage
    },

    async doReceive({ stage }) {
      let { customerId } = this
      await this.$store.dispatch(appTypes.CUSTOMER_RECEIVE, { customerId })
      this.$message.success('接受客户成功')
      this.fetch(customerId)
    },

    async doAudit({ stage, command }) {
      let {
        customerId,
        user: { id }
      } = this
      let hash = {
        customerId, // 潜在客户id
        userId: id, // 核实人的id
        isPass: +command // 0不通过，1通过
      }
      await this.$store.dispatch(appTypes.CUSTOMER_AUDIT_PUT, hash)
      this.$message.success('审核客户成功')
      this.fetch(customerId)
    },
    async getRemoteInputTagList() {
      const res = await crmApi.inputTagSearch({ keyword: '无效客户' })
      if (res && res.success) {
        return res.data.records ? res.data.records[0] : null
      }
      return null
    },
    async closeDialog({ type, refreshable, data }) {
      switch (type) {
        case 'abandon':
          this.dialogStatus.isAbandonDialogShow = false
          if (refreshable === true) {
            data.customerId = this.customerId
            data.stage = this.states.abandonStage
            await this.$store.dispatch(appTypes.CUSTOMER_ABANDON, data)
            this.$message.success('丢弃客户成功')
            this.$router.push({ name: 'potential-customers-index' })
          }
          break
        case 'failure':
          if (refreshable === true) {
            data.customerId = this.customerId
            data.stage = this.states.failureStage
            if (data.tag === 'invalid') {
              const tag = await this.getRemoteInputTagList()
              if (!tag) {
                this.$message.error('输单类型设置失败，请检查是否存在【无效客户】跟踪标签')
                return
              }
              await this.$store.dispatch(appTypes.INPUT_TAG_CUSTOMER_POST, {
                taggedIds: this.customerId,
                inputTagId: tag.tagId
              })
            }
            this.dialogStatus.isFailureDialogShow = false
            await apis.crm.customerFailurePut(data)
            this.$message.success('设置为输单成功')
            this.fetch(this.customerId)
          }
          break
        case 'setSalesman':
          this.dialogStatus.isSetSalesmanShow = false
          if (refreshable === true) {
            Object.assign(data, {
              transferedIds: this.customerId,
              userId: data.salesmanId
            })
            delete data.salesmanId
            const { success } = await this.$store.dispatch(appTypes.CUSTOMERS_TRANSFER, data)
            if (!success) return false
            this.$message.success('指定销售转单成功')
            this.fetch(this.customerId)
          }
          break
        case 'mergeCustomer':
          this.dialogStatus.isMergeCustomer = false
          if (refreshable === true) {
            const res = await apis.crm.customerMerge({ ...data })
            if (res.success) {
              this.$message.success('合并客户成功')
              this.fetch(this.customerId)
            }
          }
          break
      }
    },
    // 自动分配
    async doSaveAutoSend({ stage, similarCustomId, targetSaleId }) {
      let detail = JSON.parse(JSON.stringify(this.detail))
      let { processedStage, customerId } = this
      detail.stage = processedStage
      detail.editStage = stage
      detail.customerId = customerId
      let tip = (type) => `自动转单${type}`
      await this.$store.dispatch(appTypes.CUSTOMER_PUT, detail)
      const { success } = await this.$store.dispatch(appTypes.CUSTOMER_AUTO_SEND, {
        id: customerId,
        similarCustomId,
        targetSaleId
      })
      if (!success) return false
      this.$message.success(tip('成功'))
      this.fetch(customerId)
    },

    async doSaveSetSalesman({ stage }) {
      let detail = JSON.parse(JSON.stringify(this.detail))
      let { processedStage, customerId } = this
      detail.stage = processedStage
      detail.editStage = stage
      detail.customerId = customerId
      await this.$store.dispatch(appTypes.CUSTOMER_PUT, detail)
      this.doSetSalesman()
    },

    doSetSalesman() {
      this.dialogStatus.isSetSalesmanShow = true
    },

    // 删除客户
    doDelete() {
      this.$confirm('确认删除客户吗？删除后将无法恢复，请谨慎操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$store.dispatch(appTypes.CUSTOMER_DELETE, {
            customerId: this.customerId.toString()
          })
          this.$message.success('删除客户成功')
          this.fetch(this.customerId)
        })
        .catch(() => {})
    },

    // 合并客户
    mergeCustomer() {
      this.dialogStatus.isMergeCustomer = true
    },

    // async ServiceSave (value) {
    //   await this.$store.dispatch(appTypes.REGISTER_DETAIL_PUT, {...value})
    //   this.$message.success('信息保存成功')
    //   this.fetch(this.customerId)
    // },

    // 设置为输单
    openFailure({ stage }) {
      this.dialogStatus.isFailureDialogShow = true
      this.states.failureStage = stage
    },

    // 输单重新启动
    failureReset() {
      this.$confirm('确认要重新启动', '提示').then(async () => {
        const { success } = await apis.crm.customerFailureReset({ id: this.customerId })
        if (!success) return false
        this.$message.success('重新启动成功')
        this.fetch(this.customerId)
      })
    },

    // 切换关注
    async focus(isSpecialFocus) {
      let {
        user: { id }
      } = this
      let hash = {
        userId: id,
        customerId: this.customerId,
        isSpecialFocus: isSpecialFocus === '0' ? '1' : '0' // 0 表示不特别关注，1表示特别关注
      }
      await this.$store.dispatch(appTypes.CUSTOMER_FOCUS, hash)
      this.fetch(this.customerId)
    },

    fetchFolowRecords() {
      this.$refs.followRecords.fetch()
    }
  }
}
</script>
<template>
  <div class="wh__warp">
    <div class="wh__header">
      <div class="wh__header--title">客户信息</div>
      <span class="wh__header--close">
        <wh-std-icon sign="xe6aa" @click="back"> </wh-std-icon>
      </span>
    </div>
    <div class="wh__body">
      <p v-if="detail.isSubCustomer" class="merged-warning">
        当前客户已被合并，以下信息为主客户信息
      </p>
      <div v-loading="loading" class="customer-detail">
        <div class="article">
          <!--冲突报备阶段-->
          <Conflict
            v-if="processedStage === '3'"
            :content="detail.conflict"
            @onAudit="doAudit"
            @onDelete="doDelete"
          ></Conflict>

          <DetailHeader
            :content="detail"
            @onSetSalesman="doSetSalesman"
            @onDelete="doDelete"
            @onMergeCustomer="mergeCustomer"
            @onReset="failureReset"
            @onFocus="focus"
          ></DetailHeader>

          <template v-if="+processedStage <= 12 || serviceType === '2'">
            <BaseInfo
              stage="1"
              stage-name="baseInfo"
              :content="detail.baseInfo"
              @change="baseInfoChange"
              @onSave="save"
              @onAbandon="openAbandon"
              @onReceive="doReceive"
              @onAudit="doAudit"
            ></BaseInfo>

            <FollowRecords v-if="customerId" ref="followRecords" :customer-id="customerId">
            </FollowRecords>

            <MissionRecords
              v-if="customerId"
              :need-update="detail.needUpdate"
              :customer-id="customerId"
              @updateFollow="fetchFolowRecords"
            >
            </MissionRecords>

            <Clues
              stage="2"
              stage-name="clues"
              :content="detail.clues"
              :base-info="detail.baseInfo"
              @onAbandon="openAbandon"
              @onSave="save"
              @onSaveAutoSend="doSaveAutoSend"
              @onSaveSetSalesman="doSaveSetSalesman"
            ></Clues>

            <!--非线索审查池-->
            <template v-if="processedStage !== '3' && processedStage !== '4'">
              <PreliminaryApproach
                stage="7"
                stage-name="preliminary"
                :content="detail.preliminary"
                :relative-customer="detail.relativeCustomer"
                class="margin-top25"
                @onSave="save"
                @onAbandon="openAbandon"
                @onFailure="openFailure"
              ></PreliminaryApproach>

              <DemandConfirm
                stage="8"
                stage-name="demandConfirm"
                :content="detail.demandConfirm"
                @onSave="save"
                @onAbandon="openAbandon"
                @onFailure="openFailure"
              ></DemandConfirm>

              <Negotiation
                stage="10"
                stage-name="negotiation"
                :content="detail.negotiation"
                @onSave="save"
                @onAbandon="openAbandon"
                @onFailure="openFailure"
              ></Negotiation>

              <Win v-if="wined" stage="12" stage-name="win" :wined="wined" :content="detail.win">
              </Win>
            </template>
          </template>
        </div>
      </div>
    </div>
    <el-dialog
      title="丢弃客户"
      width="30%"
      :close-on-click-modal="false"
      :visible.sync="dialogStatus.isAbandonDialogShow"
    >
      <DialogAbandon @onClose="closeDialog"></DialogAbandon>
    </el-dialog>

    <el-dialog
      title="设置输单"
      width="30%"
      :close-on-click-modal="false"
      :visible.sync="dialogStatus.isFailureDialogShow"
    >
      <DialogFailure @onClose="closeDialog"></DialogFailure>
    </el-dialog>

    <el-dialog
      title="指定销售"
      width="30%"
      :close-on-click-modal="false"
      :visible.sync="dialogStatus.isSetSalesmanShow"
    >
      <dialog-set-salesman :content="detail.baseInfo" @onClose="closeDialog"></dialog-set-salesman>
    </el-dialog>
    <el-dialog
      title="合并客户"
      width="35%"
      :close-on-click-modal="false"
      :visible.sync="dialogStatus.isMergeCustomer"
    >
      <dialog-merge-customer :id="customerId" @onClose="closeDialog"></dialog-merge-customer>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.customer-detail {
  display: flex;

  i {
    font-style: normal;
  }
}

.merged-warning {
  height: 30px;
  line-height: 30px;
  font-size: 15px;
  font-weight: 600;
  color: #1c8de0;
  margin-bottom: 10px;
}

.customer-detail .catalog {
  width: 150px;

  ul li {
    text-align: right;
    display: block;
    background-color: #fff;

    & > a {
      display: block;
      padding: 8px 10px;
      cursor: pointer;
    }

    &.active > a {
      color: #03a9f4;
      border-right: 2px solid #03a9f4;
    }
  }
}

.margin-top25 {
  margin-top: 25px;
}
</style>
