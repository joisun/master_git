<script>
import poolCard from './components/pool-card.vue'
import alarmSettingDialog from './components/alarm-setting-dialog.vue'
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
import whMonthSelect from '@/global/components/wh-month-select.vue'
const IS_SYS_POOL_HIDE_EMPTY = 'IS_SYS_POOL_HIDE_EMPTY'
export default {
  name: 'system-pool-show',
  components: {
    'pool-card': poolCard,
    'alarm-setting-dialog': alarmSettingDialog,
    'wh-carrier-account-select': whCarrierAccountSelect,
    whMonthSelect
  },
  data() {
    return {
      isHideEmpty: false,
      poolId: '',
      carrierAccount: '', // 用户选中地区值
      signedCarrierId: '', // 所属运营商
      signedCarrierList: [], // 所属运营商
      tableData: [], // 套餐列表
      month: '', // 所选月份
      summary: {
        totalCount: 0,
        totalGrossProfit: 0,
        totalIncome: 0,
        totalRealCost: 0,
        grossProfitMargin: 0
      }, // 汇总
      loading: true,
      dialog: {
        alarmVisible: false
      },
      carrier: ''
    }
  },
  computed: {
    filteredData() {
      if (this.isHideEmpty) {
        return this.tableData.filter((item) => {
          const checkEmptyArray = [
            'totalVolume',
            'useVolume',
            'egroupUseVolume',
            'groupTotalVolume',
            'enterPoolCount',
            'currentInventoryCount',
            'userTotalVolume'
          ]
          return checkEmptyArray.some((d) => item[d] && item[d] !== 0)
        })
      }
      return this.tableData
    }
  },
  watch: {
    async carrier() {
      await this.getSignedCarrierList()
      this.getPoolList()
    },
    async $route(val) {
      if (val.name === 'system-pool-show' && val.params.carrier !== this.carrier) {
        this.carrier = val.params.carrier
        this.poolId = ''
        this.signedCarrierId = ''
        await this.getSignedCarrierList()
        this.getPoolList()
      }
    }
  },
  created() {
    this.isHideEmpty = localStorage.getItem(IS_SYS_POOL_HIDE_EMPTY) === 'true'
  },
  async mounted() {
    this.carrier = this.$route.params.carrier
    this.poolId = this.$route.query.poolId ? `${this.$route.query.poolId}` : ''
    await this.getSignedCarrierList()
    this.getPoolList()
  },
  methods: {
    onHideEmptyChange(value) {
      localStorage.setItem(IS_SYS_POOL_HIDE_EMPTY, value)
    },
    showDialog(name) {
      this.dialog[name] = true
    },
    closeDialog(name, flag) {
      this.dialog[name] = false
      if (flag) this.getPoolList()
    },
    transitionToDetail(item) {
      this.$router.push({ name: 'system-pool-detail', query: { id: item.id } })
    },
    tabsClick(tab) {
      this.$router.push({ name: 'system-pool-show', params: { carrier: tab.name } })
      if (tab.name !== this.carrier) {
        this.carrier = tab.name
        this.poolId = ''
        this.signedCarrierId = ''
        this.getSignedCarrierList()
        this.getPoolList()
      }
    },
    async getSignedCarrierList() {
      if (!this.carrier) return false
      let res = await this.jaxLib.store.signedCarrierListGet({ carrier: this.carrier })
      if (!res.success) return false
      this.signedCarrierList = res.data
    },
    // 加载流量池套餐数据
    async getPoolList() {
      if (!this.carrier) return false
      const sortFun = (a, b) => {
        a.useRate = a.totalVolume ? a.useVolume / a.totalVolume : 0
        a.groupUseRate = a.groupTotalVolume ? a.groupUseVolume / a.groupTotalVolume : 0
        a.useRate = a.useRate > a.groupUseRate ? a.useRate : a.groupUseRate
        b.useRate = b.totalVolume ? b.useVolume / b.totalVolume : 0
        b.groupUseRate = b.groupTotalVolume ? b.groupUseVolume / b.groupTotalVolume : 0
        b.useRate = b.useRate > b.groupUseRate ? b.useRate : b.groupUseRate
        if (b.useRate === a.useRate) return b.useVolume - a.useVolume
        return b.useRate - a.useRate
      }
      this.loading = true
      let postData = {
        carrier: this.carrier,
        carrierAccountId: this.carrierAccount,
        signedCarrierId: this.signedCarrierId,
        month: this.month
      }
      if (this.poolId.trim()) {
        postData.poolId = this.poolId.trim()
      }
      let rst = await this.jaxLib.pool.list(postData)
      if (!rst.success) return false
      let { list, summary } = rst.data
      this.tableData = list.sort(sortFun)
      this.summary = summary
      this.loading = false
    }
  }
}
</script>

<template>
  <div class="systemPoolShow">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">系统流量池</h2>
        <wh-month-select v-model="month" @change="getPoolList" />
        <el-checkbox v-model="isHideEmpty" @change="onHideEmptyChange">隐藏空流量池</el-checkbox>

        <el-button type="primary" class="wh__header--operate" @click="showDialog('alarmVisible')"
          >告警设置
        </el-button>
      </div>
      <el-tabs :value="carrier" class="wh__tabs" @tab-click="tabsClick">
        <el-tab-pane v-for="(key, val) in enums.carrier.maps()" :key="val" :label="key" :name="val">
        </el-tab-pane>
      </el-tabs>
      <div class="wh__tools">
        <div class="wh__tools--search">
          <el-input
            v-model="poolId"
            class="wh__tools--search-input"
            placeholder="请输入流量池ID"
            size="small"
            @keyup.native.enter="getPoolList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getPoolList"> </el-button>
          </el-input>
          <el-select
            v-model="signedCarrierId"
            placeholder="请选择所属运营商"
            clearable
            size="small"
            @change="getPoolList"
          >
            <el-option
              v-for="item in signedCarrierList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <wh-carrier-account-select
            v-model="carrierAccount"
            :carrier="carrier"
            size="small"
            :signed-carrier-id="signedCarrierId"
            @change="getPoolList"
          >
          </wh-carrier-account-select>
        </div>
        <div class="collect-content">
          <p class="collect-content__box align-middle">
            <span>
              总卡数 <br />
              {{ summary.totalCount }}
            </span>
            <span>
              总收入 <br />
              {{ summary.totalIncome.toFixed(3) }}
            </span>
            <span>
              总实际成本 <br />
              {{ summary.totalRealCost.toFixed(3) }}
            </span>
            <span>
              总毛利 <br />
              {{ summary.totalGrossProfit.toFixed(3) }}
            </span>
            <span>
              总毛利率 <br />
              {{ (summary.grossProfitMargin * 100).toFixed(2) }}%
            </span>
          </p>
        </div>
        <div v-loading="loading" class="wh__body">
          <div v-if="filteredData.length === 0 && !loading" class="noValue">暂无数据</div>
          <div v-else-if="!loading">
            <pool-card
              v-for="i in filteredData"
              :key="i.poolId"
              :content="i"
              :signed-carrier-list="signedCarrierList"
              class="pool-card"
              :carrier="carrier"
              @on-click-panel="transitionToDetail"
            >
            </pool-card>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="告警设置" :visible.sync="dialog.alarmVisible" class="wh__dialog">
      <alarm-setting-dialog dialog-name="alarmVisible" @closeDialog="closeDialog">
      </alarm-setting-dialog>
    </el-dialog>
  </div>
</template>
