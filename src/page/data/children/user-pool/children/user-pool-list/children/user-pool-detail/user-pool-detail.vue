<script type="text/ecmascript-6">
/**
   * Create by zeter on 2017/4/5
   */
  import cardPanel from '@/page/components/panel/card-info-panel.vue'

  export default {
    name: 'user-pool-detail',
    data() {
      return {
        carrier: '',
        poolSpecification: '',
        userMonth: {},
        // 搜索字段
        searchValue: '',
        // 搜索状态
        searchStatus: '',
        // 表格字段
        tableLoading: true,
        tableData: [],
        currentPage: 1,
        rowsPerPage: 20,
        allCount: 0
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      },
      /**
       * 库存比例
       * @returns {number}
       */
      inventory() {
        let { currentInventoryCount, totalCount } = this.userMonth
        return currentInventoryCount / totalCount * 100
      },
      /**
       * 激活比例
       * @returns {number}
       */
      activated() {
        let { currentActivationCount, totalCount } = this.userMonth
        return currentActivationCount / totalCount * 100
      },
      /**
       * 已停卡比例
       * @returns {number}
       */
      deactivation() {
        let { currentDeactivationCount, totalCount } = this.userMonth
        return currentDeactivationCount / totalCount * 100
      },
      /**
       * 测试期比例
       * @returns {string}
       */
      testing() {
        let { currentTestingCount, totalCount } = this.userMonth
        return currentTestingCount / totalCount * 100
      },
      /**
       * 已销卡比例
       * @returns {string}
       */
      retired() {
        let { currentRetiredCount, totalCount } = this.userMonth
        return currentRetiredCount / totalCount * 100
      }
    },
    methods: {
      // 获取列表
      async getList() {
        this.tableLoading = true
        let rst = await this.jaxLib.pool.userDetails({
          iccid: this.searchStatus,
          poolId: this.id,
          pageIndex: this.currentPage,
          pageSize: this.rowsPerPage
        })
        if (rst.success) {
          this.tableData = rst.data.list
          this.allCount = rst.data.page.allCount
          this.userMonth = rst.data.pool
          this.poolSpecification = rst.data.pool.poolSpecification
          this.carrier = rst.data.pool.carrier
        }
        this.tableLoading = false
      },
      // 关闭页面
      closePage() {
        this.$router.push({ name: 'user-pool-show', query: { enter: false } })
      },
      // 去往查看历史数据
      toHistoryPage() {
        this.$router.push({ name: 'user-pool-history', query: { id: this.id } })
      },
      // 搜索
      handleIconClick() {
        this.currentPage = 1
        this.searchStatus = this.searchValue
        this.getList()
      },
      // 切换页面
      handleCurrentChange(val) {
        this.currentPage = val
        this.getList()
      }
    },
    mounted() {
      this.getList()
    },
    components: {
      'card-panel': cardPanel
    }
  }
</script>

<template>
  <div class="userPoolList">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">用户流量池 -
          <span>
            {{carrier | carrierFilter}}
          </span>
          <span v-tag-extract="{volume: poolSpecification}">
          </span></h2>
        <span class="wh__header--close">
          <wh-std-icon sign="xe6aa" @click="closePage">
          </wh-std-icon>
        </span>
      </div>
      <div class="wh__info" v-loading="tableLoading">
        <div class="wh__info--title">
          <span>本月概览</span>
          <el-button type="text" @click="toHistoryPage" class="toHisBtn">查看历史数据</el-button>
        </div>
        <div class="wh__info--body">
          <div class="flex userPoolList__info">
            <div class="info__volume">
              <p>
                <span class="info__volume--total">使用 </span>
                <span class="info__volume--number"> {{userMonth.useVolume | volumeFilter}}
                  <span v-if="carrier==='cmcc'">/ {{userMonth.totalVolume | volumeFilter}}
                  </span>
                </span>
                <span class="info__volume--other" v-if="carrier==='cmcc'">
                  剩余{{userMonth.leftVolume| volumeFilter}} 使用率:{{userMonth.useRate*100 | numberFilter(2)}}%
                </span>
              </p>
            </div>
            <div class="info__card">
              <div>
                <p class="detail-title"><span class="align-middle">
                                          总数 <br>
                                          {{userMonth.totalCount}}
                                        </span>
                  <span class="align-middle">
                    已激活 <br>
                    {{userMonth.currentActivationCount}}
                  </span>
                  <span class="align-middle">
                    已停卡 <br>
                    {{userMonth.currentDeactivationCount}}
                  </span>
                  <span class="align-middle">
                    库存 <br>
                    {{userMonth.currentInventoryCount}}
                  </span>
                  <span class="align-middle">
                    测试期 <br>
                    {{userMonth.currentTestingCount}}
                  </span>
                  <span class="align-middle">
                    已销卡 <br>
                    {{userMonth.currentRetiredCount}}
                  </span>
                </p>
                <div class="progress-wrapper">
                  <div class="progress-bar thin" style="height: 30px" v-if="userMonth.totalCount">
                    <el-tooltip class="item" effect="dark" content="已激活" placement="bottom">
                      <span class="seg-first" :style="{ width: activated + '%'}"></span>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="已停卡" placement="bottom">
                      <span class="seg-second"
                        :style="{ left: activated + '%', width: deactivation + '%'}"></span>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="库存" placement="bottom">
                      <span class="seg-three"
                        :style="{ left: (activated + deactivation) + '%', width: inventory + '%'}"></span>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="测试期" placement="bottom">
                      <span class="seg-four"
                        :style="{ left: (activated + deactivation + inventory) + '%', width: testing + '%'}"></span>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="已销卡" placement="bottom">
                      <span class="seg-fir"
                        :style="{ left: (activated + deactivation + inventory + testing) + '%', width: retired + '%'}"></span>
                    </el-tooltip>
                  </div>
                  <div v-else>
                    <el-tooltip class="item" effect="dark" content="暂无卡片" placement="bottom">
                      <div class="progress-bar__none progress-bar thin" style="height: 30px">
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="wh__tools--search">
        <el-input placeholder="请输入ICCID" v-model="searchValue" @keyup.native.enter="handleIconClick"
          class="wh__tools--search-input float-right">
          <el-button slot="append" icon="el-icon-search" @click="handleIconClick">
          </el-button>
        </el-input>
      </div>
      <div class="wh__body">
        <el-table
          :data="tableData"
          v-loading="tableLoading"
          class="wh__body--table">
          <el-table-column
            prop="iccid"
            label="ICCID"
            min-width="190">
            <template slot-scope="scope">
              <card-panel :iccid="scope.row.iccid" placement="right" :key="scope.row.iccid" >
                <span>{{scope.row.iccid}}</span>
              </card-panel>
            </template>
          </el-table-column>
          <el-table-column
            label="电话号码"
            prop="msisdn"
            min-width="170">
          </el-table-column>
          <el-table-column
            label="设备状态"
            prop="status"
            min-width="90">
            <template slot-scope="scope">
              <div>{{scope.row.status | cardStatusFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="网络状态"
            prop="gprsStatus"
            min-width="90">
            <template slot-scope="scope">
              <div>{{scope.row.gprsStatus | gprsStatusFilter}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="poolSpecification"
            label="用户套餐规格"
            min-width="100">
            <template slot-scope="scope">
              <div>{{scope.row.poolSpecification | volumeFilter}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="usage"
            label="本月用量"
            min-width="100">
            <template slot-scope="scope">
              <div>{{scope.row.usage | volumeFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="dataUsage"
            label="最近同步时间"
            min-width="180">
            <template slot-scope="scope">
              <div>{{scope.row.lastUpgradeTime | dateFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalDataVolume"
            label="过期时间"
            min-width="180">
            <template slot-scope="scope">
              <div>{{scope.row.expriseDate | dateFilter }}</div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="rowsPerPage"
          layout="prev, pager, next, jumper, total"
          :total="allCount"
          class="wh__body--page">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
