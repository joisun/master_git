<script>
  import cardPanel from '@/page/components/panel/card-info-panel.vue'
  import filterSessionMixins from './mixins/single-card-filter-session'
  import enums from '@/constant/enums'
  import Download from '@/page/components/wh-download/wh-download'

  export default {
    name: 'single-card-list',
    mixins: [filterSessionMixins],
    data() {
      return {
        page: {
          pageSize: 10,
          pageIndex: 1,
          orderBy: '',
          total: 0
        },
        form: {
          iccid: ''
        },
        // 表格字段
        tableData: [],
        isLoading: false,
        popShowFilter: false,
        offerTypeMap: enums.offerTypeMap
      }
    },
    computed: {
      carrier() {
        return this.$route.query.carrier
      },
      carrierAccountId() {
        return this.$route.query.carrierAccountId
      }
    },
    created() {
      this.getList()
    },
    methods: {
      async getList() {
        this.isLoading = true
        const res = await this.jaxLib.single.list({
          iccid: this.form.iccid,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize,
          carrier: this.carrier,
          carrierAccountId: this.carrierAccountId
        })
        this.isLoading = false
        if (!res.success) return false
        this.tableData = res.data.list
        this.page.total = res.data.page.allCount
      },
      handleCurrentChange(val) {
        this.page.pageIndex = val
        this.getList()
      },
      handleIconClick() {
        this.page.pageIndex = 1
        this.getList()
      },
      closePage() {
        this.$router.push({ name: 'single-card-show', params: { carrier: this.carrier } })
      },
      async exportTable() {
        const {success, data} = await this.jaxLib.single.exportCardList({
          iccid: this.form.iccid,
          carrier: this.carrier,
          carrierAccountId: this.carrierAccountId
        })
        if (!success) return false
        await Download({...data})
      }
    },
    components: {
      cardPanel
    }
  }
</script>

<template>
  <div class="systemPoolList">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">单卡 - {{ Number(carrierAccountId) | carrierAccountFilter(carrier) }}
        </h2>
        <span class="wh__header--close">
          <wh-std-icon sign="xe6aa" @click="closePage">
          </wh-std-icon>
        </span>
      </div>
      <div class="wh__tools">
        <div class="wh__info--title">
          <span>卡片列表</span>
        </div>
        <el-input
          class="wh__tools--search-input"
          placeholder="请输入ICCID"
          v-model="form.iccid"
          @keyup.native.enter="handleIconClick">
          <el-button slot="append" icon="el-icon-search" @click="handleIconClick">
          </el-button>
        </el-input>
        <el-popover
          title="字段过滤"
          ref="popover-filter"
          placement="bottom"
          v-model="popShowFilter"
          class="wh__tools--filter"
          trigger="click">
          <el-checkbox-group
            v-model="revealFields.stored"
            @change="handleRevealChange"
            class="userPoolShow__filter">
            <el-checkbox
              v-for="(value, key) in revealFields.full"
              :label="key" :key="key" class="wh__tools--filter-item">
              {{value}}
            </el-checkbox>
          </el-checkbox-group>
        </el-popover>
        <el-button class="float-right" size="mini" v-popover:popover-filter>
          <wh-std-icon sign="&#xe693;">
          </wh-std-icon>
        </el-button>
        <el-button size="mini" class="float-right mr20" @click="exportTable">
          <wh-std-icon sign="&#xe635;">
          </wh-std-icon>
        </el-button>
      </div>
      <div class="wh__body">
        <el-table
          :data="tableData"
          v-loading="isLoading"
          height="calc(100vh - 180px)"
          class="wh__body--table">
          <el-table-column
            prop="iccid"
            label="ICCID"
            min-width="190">
            <template slot-scope="scope">
              <card-panel :iccid="scope.row.iccid" placement="right" :key="scope.row.iccid">
                <span>{{scope.row.iccid}}</span>
              </card-panel>
            </template>
          </el-table-column>
          <el-table-column
            label="电话号码"
            prop="msisdn"
            min-width="140">
          </el-table-column>
          <el-table-column
            label="库存状态"
            prop="storeStatus"
            v-if="revealWord.storeStatus"
            min-width="140">
            <template slot-scope="scope">
              <div>{{scope.row.storeStatus | cardStoreStatusFilter}}
                <span v-if="scope.row.storeStatus === 'locked'">
                  ({{scope.row.lockStatus | lockStatusFilter}})
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="运营商状态"
            v-if="revealWord.physicalStatus"
            min-width="110">
            <template slot-scope="scope">
              <div>{{scope.row.physicalStatus | physicalStatusFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="revealWord.offerType"
            min-width="110"
            label="套餐类型">
            <template slot-scope="scope">
              {{ offerTypeMap.get(scope.row.offerType) }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="revealWord.carrierPoolSpecification"
            label="运营商套餐规格"
            min-width="140">
            <template slot-scope="scope">
              <span v-if="scope.row.carrierValidity">
                <span v-if="scope.row.carrierValidity === 1">{{ scope.row.carrierVolume | volumeFilter }}/月</span>
                <span v-else>{{ scope.row.carrierVolume | volumeFilter }}/{{ scope.row.carrierValidity }}月</span>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="revealWord.poolSpecification"
            label="客户套餐规格"
            min-width="140">
            <template slot-scope="scope">
              <span v-if="scope.row.validity">
                <span v-if="scope.row.validity === 1">{{ scope.row.totalVolume | volumeFilter }}/月</span>
                <span v-else>{{ scope.row.totalVolume | volumeFilter }}/{{ scope.row.validity }}月</span>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="usage"
            v-if="revealWord.usage"
            label="本月用量(MB)"
            min-width="140">
            <template slot-scope="scope">
              <div>{{scope.row.usedVolume | volumeFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="dataUsage"
            v-if="revealWord.lastSyncTime"
            label="最近同步时间"
            min-width="170">
            <template slot-scope="scope">
              <div>{{scope.row.lastSyncTime | dateFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalDataVolume"
            v-if="revealWord.expireDate"
            label="套餐过期时间"
            min-width="170">
            <template slot-scope="scope">
              <div>{{scope.row.expireDate | dateFilter }}</div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          layout="prev, pager, next, jumper, total"
          :total="page.total"
          class="wh__body--page">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
