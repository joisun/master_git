<script type="text/ecmascript-6">
/**
 * Create by zeter on 2017/4/5
 */
import filterSession from './mixins/user-pool-filter-session'
import goSystem from '@/global/function/go-system'
import clientPanel from '@/page/components/panel/client-info-panel.vue'

export default {
  name: 'UserPoolShow',
  components: {
    'client-panel': clientPanel
  },
  mixins: [filterSession],
  data() {
    return {
      // 页码相关
      page: {
        pageIndex: 1,
        pageSize: 20,
        allCount: 0
      },
      // 表格相关
      tableData: [],
      tableLoading: true,
      // 搜索相关
      popShow: false,
      searchForm: {
        carrier: '',
        poolSpecification: '',
        orgName: '',
        orderBy: '',
        poolId: '',
        upperLimit: 'all'
      },
      orgNameBar: '',
      // 规格列表
      poolSizeList: [],
      // 过滤条件
      popShowFilter: false
    }
  },
  created() {
    this.changeOperator()
    this.getList()
  },
  methods: {
    async getList() {
      this.tableLoading = true
      this.tableData = []
      let postData = {
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize,
        carrier: this.searchForm.carrier,
        orgName: this.searchForm.orgName,
        orderBy: this.searchForm.orderBy,
        poolId: this.searchForm.poolId,
        upperLimit: this.searchForm.upperLimit,
        poolSpecification: this.searchForm.poolSpecification
      }
      if (this.searchForm.upperLimit === 'all') delete postData.upperLimit
      else postData.upperLimit = this.searchForm.upperLimit ? 1 : 1.2
      if (!this.searchForm.poolSpecification) delete postData.poolSpecification
      let rst = await this.jaxLib.pool.userList(postData)
      this.tableLoading = false
      if (!rst.success) return false
      this.tableData = rst.data.list.map((e) => {
        e.closePoolCard = e.upperLimit === 1
        return e
      })
      this.page.allCount = rst.data.page.allCount
    },
    // 切换页码
    handleCurrentChange(val) {
      this.page.pageIndex = val
      this.getList()
    },
    // 切换排序
    sortChange(e) {
      if (e.prop)
        this.searchForm.orderBy = e.prop + ' ' + (e.order === 'descending' ? 'desc' : 'asc')
      else this.searchForm.orderBy = ''
      this.page.pageIndex = 1
      this.getList()
    },
    // 点击快速搜索
    clickOutSearch() {
      this.page.pageIndex = 1
      this.getList()
    },
    // 运营商变化
    async changeOperator() {
      let rst = await this.jaxLib.pool.getPoolSize(this.searchForm.carrier)
      if (rst.success) {
        this.poolSizeList = rst.data.map((e) => {
          if (e.key === '-1M') {
            return { key: '全套餐', value: e.value }
          }
          return e
        })
      }
      this.clickOutSearch()
    },
    // 点击进入详情页面
    enterDetails(val) {
      this.$router.push({ name: 'user-pool-detail', query: { id: val } })
    },
    // 超级登录
    async goSystem(orgId) {
      let preRst = await this.jaxLib.customer.list.orgHasUser({ orgId: orgId })
      if (!preRst.success || !preRst.data) return false
      goSystem(preRst.data.id, this.pointOrgName, '/#/card/pool')
    },
    // 修改爆池相关
    changeThisWay(val, index) {
      let pre = { ...val }
      this.$confirm(
        `此操作将对编号为${val.id}的流量池爆池停卡阈值调整为${
          val.closePoolCard ? '100%' : '120%'
        }，确认要继续吗？`,
        '提示',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      )
        .then(async () => {
          let rst = await this.jaxLib.pool.userPoolStopCard({
            poolId: val.id,
            upperLimit: val.closePoolCard ? 1 : 1.2
          })
          if (!rst.success) return false
          this.$message.success('操作成功')
          this.getList()
        })
        .catch(() => {
          pre.closePoolCard = !pre.closePoolCard
          this.tableData.splice(index, 1, pre)
        })
    },
    // 搜索展示什么
    showWhatSearch() {
      this.getList()
    }
  }
}
</script>

<template>
  <div class="userPoolShow">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">用户流量池</h2>
      </div>
      <div class="wh__tools--search">
        <!--搜索-->
        <el-select
          v-model="searchForm.carrier"
          placeholder="请选择运营商"
          style="width: 150px"
          clearable
          @change="changeOperator"
        >
          <el-option
            v-for="(key, val) in enums.carrier.maps()"
            :key="val"
            :label="key"
            :value="val"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="searchForm.poolSpecification"
          placeholder="请选择套餐规格"
          style="width: 150px"
          clearable
          @change="clickOutSearch"
        >
          <el-option
            v-for="item in poolSizeList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="searchForm.poolId"
          placeholder="请输入流量池ID"
          class="wh__tools--search-input"
          @keyup.native.enter="clickOutSearch"
        >
        </el-input>
        <el-input
          v-model="searchForm.orgName"
          placeholder="客户名称或ID"
          class="wh__tools--search-input"
          @keyup.native.enter="clickOutSearch"
        >
        </el-input>
        <el-button icon="el-icon-search" @click="clickOutSearch"> </el-button>
        <!--字段过滤相关-->
        <el-popover
          ref="popover-filter"
          v-model="popShowFilter"
          title="字段过滤"
          placement="bottom"
          class="userPoolShow__filter wh__tools--filter"
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
          <hr />
          <el-radio-group
            v-model="searchForm.upperLimit"
            class="userPoolShow__filter"
            @change="showWhatSearch"
          >
            <el-radio label="all" class="wh__tools--filter-item"> 全部 </el-radio>
            <el-radio :label="false" class="wh__tools--filter-item"> 仅已爆池停卡池 </el-radio>
            <el-radio :label="true" class="wh__tools--filter-item"> 仅没有爆池停卡池 </el-radio>
          </el-radio-group>
        </el-popover>
        <el-button v-popover:popover-filter class="float-right" size="mini">
          <wh-std-icon sign="&#xe693;"></wh-std-icon>
        </el-button>
      </div>
      <div class="wh__body">
        <div class="wh__body--table">
          <el-table
            v-loading="tableLoading"
            :data="tableData"
            height="calc(100vh - 210px)"
            @sort-change="sortChange"
          >
            <el-table-column prop="id" label="ID" min-width="70"> </el-table-column>
            <el-table-column prop="poolSpecification" label="套餐规格" min-width="130">
              <template slot-scope="scope">
                <wh-carrier-icon  :carrier="scope.row.carrier"/>
                <el-tooltip class="item" effect="dark" content="点击进入详情" placement="left">
                  <el-button
                    v-if="scope.row.poolSpecification !== -1"
                    type="text"
                    @click="enterDetails(scope.row.id)"
                  >
                    {{ scope.row.poolSpecification | volumeFilter }}/月
                  </el-button>
                  <el-button v-else type="text" @click="enterDetails(scope.row.id)">
                    全套餐
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="orgName" label="客户名称" min-width="270">
              <template slot-scope="scope">
                <client-panel :key="scope.row.orgId" :org-id="scope.row.orgId">
                  <div class="userPoolShow__orgName">
                    {{ scope.row.orgId }}
                    <el-button type="text" @click="goSystem(scope.row.orgId)"
                      >{{ scope.row.orgName }}
                    </el-button>
                  </div>
                </client-panel>
              </template>
            </el-table-column>
            <el-table-column
              v-if="revealWord.totalVolume"
              label="流量池总量"
              prop="totalVolume"
              min-width="120"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.totalVolume | volumeFilter }}</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="revealWord.useVolume"
              label="已使用量"
              prop="useVolume"
              min-width="120"
              sortable="custom"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.useVolume | volumeFilter }}</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="revealWord.leftVolume"
              prop="leftVolume"
              label="剩余流量"
              min-width="140"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.leftVolume | volumeFilter }}</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="revealWord.usage"
              prop="useRate"
              label="流量使用占比"
              min-width="150"
              sortable="custom"
            >
              <template slot-scope="scope">
                <div>{{ (scope.row.useRate * 100) | numberFilter }}%</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="revealWord.totalCount"
              prop="totalCount"
              label="流量池总卡量"
              min-width="130"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.totalCount }}</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="revealWord.currentActivationCount"
              prop="totalDataVolume"
              label="已激活卡量"
              min-width="130"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.currentActivationCount }}</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="revealWord.currentInventoryCount"
              prop="totalDataVolume"
              label="库存卡量"
              min-width="130"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.currentInventoryCount }}</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="revealWord.currentDeactivationCount"
              prop="totalDataVolume"
              label="已停卡卡量"
              min-width="130"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.currentDeactivationCount }}</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="revealWord.currentTestingCount"
              prop="totalDataVolume"
              label="测试期卡量"
              min-width="130"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.currentTestingCount }}</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="revealWord.currentRetiredCount"
              prop="currentRetiredCount"
              label="已销卡卡量"
              min-width="130"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.currentRetiredCount }}</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="revealWord.lastUpgradeTime"
              prop="totalDataVolume"
              label="最近同步时间"
              min-width="180"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.lastUpgradeTime | dateFilter }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="totalDataVolume"
              label="爆池停卡设置"
              fixed="right"
              min-width="170"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.closePoolCard"
                  inactive-text="120%"
                  active-text="100%"
                  @change="changeThisWay(scope.row, scope.$index)"
                >
                </el-switch>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="wh__body--page">
          <el-pagination
            :current-page="page.pageIndex"
            :page-size="page.pageSize"
            layout="prev, pager, next, jumper, total"
            :total="page.allCount"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
