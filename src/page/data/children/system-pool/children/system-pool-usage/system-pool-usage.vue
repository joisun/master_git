<script>
  import poolInfo from './components/pool-info.vue'
  import dailyRecord from './components/system-daily-record.vue'
  import moment from 'moment'

  export default {
    name: 'system-pool-usage',
    data() {
      return {
        userNowMonthly: {},
        loading: false,

        currentPage: 1,
        rowsPerPage: 15,
        allCount: 0,
        tableData: [],
        dialogVisible: false,
        chooseDay: {
          start: '',
          end: ''
        },
        popShowFilter: false,
        poolDetail: {
          poolSpecification: ''
        },
        groupColumType: {
          isShowUseGroup: false,
          isShowLeftGroup: false,
          isShowTotalGroup: false
        }
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      }
    },
    created() {
      this.getList()
      this.getHistoryList()
    },
    methods: {
      // 获取列表
      async getList() {
        this.loading = true
        let rst = await this.jaxLib.pool.details({
          poolId: this.id
        })
        this.loading = false
        if (!rst.success) return false
        this.poolDetail = rst.data
      },
      async getHistoryList(page = 1) {
        this.loading = true
        this.currentPage = page
        let rst = await this.jaxLib.pool.history({
          poolId: this.id,
          pageIndex: page,
          pageSize: this.rowsPerPage
        })
        this.loading = false
        if (!rst.success) return false
        this.tableData = rst.data.list
        this.allCount = rst.data.page.allCount
        this.setGroupType()
      },
      viewDailyUsage(val) {
        this.chooseDay.start = moment(val.time).startOf('month').format('YYYY-MM-DD')
        this.chooseDay.end = moment(val.time).endOf('month').format('YYYY-MM-DD')
        this.dialogVisible = true
      },
      // 关闭页面
      closePage() {
        this.$router.push({ name: 'system-pool-show', params: { carrier: this.poolDetail.carrier } })
      },
      // 设置表列判断条件
      setGroupType() {
        this.tableData.forEach(element => {
          if (element.groupUseVolume !== 0) this.groupColumType.isShowUseGroup = true
          if ((element.groupTotalVolume - element.groupUseVolume) !== 0) this.groupColumType.isShowLeftGroup = true
          if (element.groupTotalVolume !== 0) this.groupColumType.isShowTotalGroup = true
        })
      }
    },
    components: {
      'pool-info': poolInfo,
      'daily-record': dailyRecord
    }
  }
</script>

<template>
  <div class="systemPoolUsage">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">系统流量池 -
          <span v-tag-extract="{volume: poolDetail.poolSpecification}"></span>
        </h2>
        <span class="wh__header--close">
          <wh-std-icon sign="xe6aa" @click="closePage">
          </wh-std-icon>
        </span>
      </div>
      <div class="wh__info" v-loading="loading">
        <div class="wh__info--title">
          <span>用量数据
            <span class="gridFont">
              最近同步时间: {{poolDetail.lastSyncTime | dateFilter}}
            </span>
          </span>
        </div>
        <div class="wh__info--body">
          <pool-info :pool="poolDetail">
          </pool-info>
        </div>
      </div>
      <div class="systemPoolHis">
        <el-table
          :data="tableData"
          v-loading="loading"
          height="calc(100vh - 180px)"
          class="wh__body--table">
          <el-table-column
            prop="month"
            label="时间"
            min-width="90">
            <template slot-scope="scope">
              <div>{{scope.row.month | dateFilter(`YYYY-MM`)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="groupColumType.isShowUseGroup"
            prop="useVolume"
            align="center"
            min-width="180">
            <template slot="header">
              <p>使用量</p>
              <p>单卡累加/流量池接口</p>
            </template>
            <template slot-scope="scope">
              <p>{{ scope.row.useVolume | volumeFilter }}/{{ scope.row.groupUseVolume | volumeFilter }}<br>({{ scope.row.groupUseVolume !==0 ? Number((scope.row.useVolume - scope.row.groupUseVolume)*100/scope.row.groupUseVolume).toFixed(2) : 0 }}%)</p>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            label="使用量"
            prop="useVolume"
            min-width="100">
            <template slot-scope="scope">
              <p>{{scope.row.useVolume | volumeFilter}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalCount"
            label="每日用量明细"
            min-width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="viewDailyUsage(scope.row.month)">
                点击查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="来源">
            <p>运营商</p>
            <p>客户</p>
          </el-table-column>
          <el-table-column
            v-if="groupColumType.isShowTotalGroup"
            prop="totalVolume"
            align="center"
            min-width="180">
            <template slot="header">
              <p>流量池总量</p>
              <p>单卡累加/流量池接口</p>
            </template>
            <template slot-scope="scope">
              <p>{{ scope.row.totalVolume | volumeFilter }}/{{ scope.row.groupTotalVolume | volumeFilter }}<br>({{scope.row.groupTotalVolume !==0 ? Number((scope.row.totalVolume - scope.row.groupTotalVolume)*100/scope.row.groupTotalVolume).toFixed(2) : 0}}%)</p>
              <p>{{ scope.row.userTotalVolume | volumeFilter }}/{{ scope.row.groupTotalVolume | volumeFilter }}<br>({{scope.row.groupTotalVolume !==0 ? Number((scope.row.userTotalVolume - scope.row.groupTotalVolume)*100/scope.row.groupTotalVolume).toFixed(2) : 0}}%)
              </p>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            label="流量池总量"
            prop="totalVolume"
            min-width="120">
            <template slot-scope="scope">
              <p>{{ scope.row.totalVolume | volumeFilter}}</p>
              <p>{{ scope.row.userTotalVolume| volumeFilter }}
              </p>
            </template>
          </el-table-column>

          <el-table-column
            v-if="groupColumType.isShowLeftGroup"
            prop="leftVolume"
            align="center"
            min-width="180">
            <template slot="header">
              <p>剩余流量</p>
              <p>单卡累加/流量池接口</p>
            </template>
            <template slot-scope="scope">
              <p>{{ (scope.row.totalVolume - scope.row.useVolume) | volumeFilter }}/{{ (scope.row.groupTotalVolume - scope.row.groupUseVolume) | volumeFilter }}<br>({{ (scope.row.groupTotalVolume - scope.row.groupUseVolume)!==0 ? Number(((scope.row.totalVolume - scope.row.useVolume) - (scope.row.groupTotalVolume - scope.row.groupUseVolume))*100/(scope.row.groupTotalVolume - scope.row.groupUseVolume)).toFixed(2) : 0 }}%)</p>
              <p>{{ (scope.row.userTotalVolume - scope.row.useVolume) | volumeFilter }}/{{ (scope.row.groupTotalVolume - scope.row.groupUseVolume) | volumeFilter }}<br>({{ (scope.row.groupTotalVolume - scope.row.groupUseVolume)!==0 ? Number(((scope.row.userTotalVolume - scope.row.useVolume) - (scope.row.groupTotalVolume - scope.row.groupUseVolume))*100/(scope.row.groupTotalVolume - scope.row.groupUseVolume)).toFixed(2) : 0 }}%)</p>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            label="剩余流量"
            prop="leftVolume"
            min-width="120">
            <template slot-scope="scope">
              <p>{{ (scope.row.totalVolume - scope.row.useVolume) | volumeFilter }}</p>
              <p>{{ (scope.row.userTotalVolume - scope.row.useVolume) | volumeFilter }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="总卡数"
            min-width="90">
            <template slot-scope="scope">
              <p>{{ scope.row.carrierTotalCount }}</p>
              <p>{{ scope.row.userTotalCount }}</p>
            </template>
          </el-table-column>
          <el-table-column label="计费卡数" min-width="100">
            <template slot-scope="scope">
              <p>{{ scope.row.carrierChargeCount }}</p>
              <p>{{ scope.row.userChargeCount }}</p>
            </template>
          </el-table-column>
          <el-table-column label="入池卡数(接口)" min-width="100">
            <template slot-scope="scope">
              <p>{{ scope.row.enterPoolCount + (poolDetail.poolSpecification === 0 ? '(0)' : ('(' + Math.ceil(scope.row.groupTotalVolume / poolDetail.poolSpecification) + ')')) }}</p>
              <p>-</p>
            </template>
          </el-table-column>
          <el-table-column
            label="库存卡数"
            min-width="100">
            <template slot-scope="scope">
              <p>{{ scope.row.carrierInventoryCount }}</p>
              <p>{{ scope.row.userInventoryCount }}</p>
            </template>
          </el-table-column>
          <el-table-column label="锁卡卡数" min-width="100">
            <template slot-scope="scope">
              <p>{{ scope.row.lockedCount }}</p>
              <p>-</p>
            </template>
          </el-table-column>
          <el-table-column
            label="测试期"
            min-width="100">
            <template slot-scope="scope">
              <p>{{ scope.row.carrierTestingCount }}</p>
              <p>{{ scope.row.userTestingCount }}</p>
            </template>
          </el-table-column>
          <el-table-column label="沉默期">
            <template slot-scope="scope">
              <p>{{ scope.row.carrierSilenceCount }}</p>
              <p>{{ scope.row.userSilenceCount }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="激活"
            min-width="100">
            <template slot-scope="scope">
              <p>{{ scope.row.carrierActivationCount }}</p>
              <p>{{ scope.row.userActivationCount }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="停卡"
            min-width="100">
            <template slot-scope="scope">
              <p>{{ scope.row.carrierDeactivationCount }}</p>
              <p>{{ scope.row.userDeactivatoinCount }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="销卡"
            min-width="100">
            <template slot-scope="scope">
              <p>{{ scope.row.carrierRetiredCount }}</p>
              <p>{{ scope.row.userRetiredCount }}</p>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="getHistoryList"
          :current-page="currentPage"
          :page-size="rowsPerPage"
          layout="prev, pager, next, jumper, total"
          :total="allCount"
          class="wh__body--page">
        </el-pagination>
        <el-dialog title="日用量情况" :visible.sync="dialogVisible" class="wh__dialog">
          <daily-record
            :poolId="id"
            :startDay="chooseDay.start"
            :endDay="chooseDay.end">
          </daily-record>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
