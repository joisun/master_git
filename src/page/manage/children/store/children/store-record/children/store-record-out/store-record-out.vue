<script>
/**
 * Create by zeter on 2018/9/19
 */
import { outterColumns } from '../../mixins/consts'
import filterSession from '../../mixins/out-filter-session'
import FormWord from '../../mixins/out-form-word'
import { LIST_RATE_PLAN_RANKS } from '@/page/manage/children/store/mixins/consts'
import { mapState } from 'vuex'
import volumeFormat from '@/global/filters/volume-format'
import orderPanel from '@/page/components/panel/order-info-panel.vue'
import Download from '@/page/components/wh-download/wh-download'

export default {
  name: 'store-record-out',
  data() {
    return {
      LIST_RATE_PLAN_RANKS: [...LIST_RATE_PLAN_RANKS],
      columns: outterColumns,
      loading: false,
      page: {
        pageSize: 20,
        pageIndex: 1,
        total: 0
      },
      popShowFilter: false,
      tableData: [],
      searchForm: new FormWord(),
      selectedRatePlanRank: null,
      filterFields: {
        full: filterSession.getStoredFilterSet(true),
        stored: filterSession.getStoredFilterSet()
      }
    }
  },
  computed: {
    ...mapState({
      unicomAccountList: (state) => state.carrierAccount.unicomAccountList,
      cmccAccountList: (state) => state.carrierAccount.cmccAccountList,
      chinanetAccountList: (state) => state.carrierAccount.chinanetAccountList
    }),
    showWhatRect() {
      let middleValue = {}
      this.filterFields.stored.forEach((e) => {
        middleValue[e] = 'true'
      })
      return middleValue
    },
    recordId() {
      return this.$route.query.id || ''
    }
  },
  methods: {
    volumeFormat(value) {
      return volumeFormat(value)
    },
    changeSize(val) {
      this.page.pageSize = val
      this.getData()
    },
    changPage(val) {
      this.page.pageIndex = val
      this.getData()
    },
    async getData() {
      this.loading = true
      let rst = await this.jaxLib.card.store.history.getV2({
        ...this.searchForm.toSearch(),
        recordId: this.recordId,
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize
      })
      this.loading = false
      if (!rst.success) return false
      this.tableData = rst.data.list
      this.page.total = rst.data.page.allCount
    },
    async downloadResult(operationId, carrier) {
      const { success, data } = await this.jaxLib.card.outStoreRecordGet({
        operationId: operationId
      })
      if (!success) return false
      await Download({ ...data })
    },
    handleFilterChange(filterList) {
      filterSession.setStorage(filterList)
    },
    closeTag() {
      this.$router.push({ name: 'store-record-out' })
      this.getData()
    },
    onRatePlanRankChange(rank) {
      if (!rank) {
        this.selectedRatePlanRank = null
        this.searchForm.totalDataVolume = ''
        this.searchForm.useCountAsVolume = ''
        return
      }
      this.selectedRatePlanRank = rank
      this.searchForm.totalDataVolume = rank.value
      this.searchForm.useCountAsVolume = !!rank.useCountAsVolume
    },
    showError(messgae) {
      this.$alert(messgae, '出库错误原因', {
        confirmButtonText: '确定',
        callback: (action) => {}
      })
    }
  },
  mounted() {
    this.LIST_RATE_PLAN_RANKS.shift()
    this.getData()
  },
  components: {
    'order-panel': orderPanel
  }
}
</script>

<template>
  <div class="store-record-out">
    <div class="wh__tools--mix">
      <el-select
        v-model="searchForm.carrier"
        placeholder="运营商"
        style="width: 100px"
        @change="getData"
        clearable
      >
        <el-option
          v-for="(value, key) in enums.carrier.maps()"
          :key="key"
          :label="value"
          :value="key"
        >
        </el-option>
      </el-select>
      <el-select
        :value="selectedRatePlanRank"
        @input="onRatePlanRankChange"
        placeholder="套餐档位"
        value-key="value"
        style="width: 150px"
        @change="getData"
        clearable
      >
        <el-option
          v-for="item in LIST_RATE_PLAN_RANKS"
          :key="item.value"
          :value="item"
          :label="item.useCountAsVolume ? `${item.value}次` : volumeFormat(item.value)"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="searchForm.testValidity"
        placeholder="测试期"
        style="width: 100px"
        @change="getData"
        clearable
      >
        <el-option label="有测试期" :value="1"></el-option>
        <el-option label="无测试期" :value="0"></el-option>
      </el-select>
      <el-select
        v-model="searchForm.cardMaterial"
        placeholder="材质"
        style="width: 100px"
        @change="getData"
        clearable
      >
        <el-option
          v-for="(value, key) in enums.materialType.maps()"
          :label="value"
          :value="key"
          :key="key"
        ></el-option>
      </el-select>
      <el-select
        v-model="searchForm.cardSpecification"
        placeholder="规格"
        style="width: 100px"
        @change="getData"
        clearable
      >
        <el-option
          v-for="(value, key) in enums.specificationType.maps()"
          :key="key"
          :label="value"
          :value="key"
        >
        </el-option>
      </el-select>
      <el-date-picker
        v-model="searchForm.time"
        type="daterange"
        @change="getData"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 220px"
      >
      </el-date-picker>
      <el-tag v-if="recordId" closable @close="closeTag">当前搜索ID {{ recordId }} </el-tag>
      <el-popover
        ref="popover-filter"
        v-model="popShowFilter"
        title="字段过滤"
        placement="bottom"
        class="wh__tools--filter"
        trigger="click"
      >
        <el-checkbox-group v-model="filterFields.stored" @change="handleFilterChange">
          <el-checkbox
            v-for="(value, key) in filterFields.full"
            :label="key"
            :key="key"
            class="wh__tools--filter-item"
          >
            {{ value }}
          </el-checkbox>
        </el-checkbox-group>
      </el-popover>
      <el-button class="float-right" size="mini" v-popover:popover-filter>
        <wh-std-icon sign="&#xe693;"> </wh-std-icon>
      </el-button>
    </div>
    <div class="wh__body" v-loading="loading">
      <el-table :data="tableData" class="wh__body--table" height="calc(100vh - 260px)">
        <template v-for="(item, index) in columns">
          <el-table-column
            :key="index"
            :formatter="item.formatter"
            :prop="item.key"
            :label="item.name"
            :min-width="item.width"
            :align="item.align"
            :class-name="item.style"
            v-if="
              ['carrierAccountList', 'orgName', 'orderNo'].indexOf(item.key) < 0 &&
              showWhatRect[item.key]
            "
          >
          </el-table-column>
          <el-table-column
            v-else-if="item.key === 'carrierAccountList' && showWhatRect[item.key]"
            :prop="item.key"
            :key="item.key"
            :label="item.name"
            :min-width="item.width"
          >
            <template slot-scope="scope">
              <el-popover placement="left" width="200" trigger="hover">
                <div>
                  <p
                    v-for="(carrierAccount, index) in scope.row.carrierAccountList"
                    :key="index"
                    v-text="`${carrierAccount.name}(${carrierAccount.id})`"
                  ></p>
                </div>
                <div class="" slot="reference">
                  {{
                    scope.row.carrierAccountList
                      .map((carrierAccount) => `${carrierAccount.name}(${carrierAccount.id})`)
                      .join(',')
                  }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.key === 'orderNo' && showWhatRect[item.key]"
            :prop="item.key"
            :label="item.name"
            :key="item.key"
            :min-width="item.width"
          >
            <template slot-scope="scope">
              <order-panel :id="scope.row.orderNo" :key="scope.row.orderNo" placement="right">
                <span>{{ scope.row.orderNo }}</span>
              </order-panel>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.key === 'orgName' && showWhatRect[item.key]"
            :prop="item.key"
            :label="item.name"
            :key="item.key"
            :min-width="item.width"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.orgName }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column v-if="showWhatRect.status" prop="status" label="出库状态">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showError(scope.row.failMessage)"
              v-if="scope.row.status === '失败'"
            >
              {{ scope.row.status }}
            </el-button>
            <span v-else>
              {{ scope.row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="showWhatRect.successCount" prop="successCount" label="出库数量">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="downloadResult(scope.row.exportRecordId, scope.row.carrier)"
            >
              {{ scope.row.successCount }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="wh__body--page">
        <el-pagination
          @size-change="changeSize"
          @current-change="changPage"
          :currentPage="page.pageIndex"
          :page-sizes="[10, 20, 30, 50, 100, 200]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
