<script>
/**
 * Create by zeter on 2018/9/19
 */
import { innerColumns } from '../../mixins/consts'
import filterSession from '../../mixins/in-filter-session'
import FormWord from '../../mixins/in-form-word'
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
import Download from '@/page/components/wh-download/wh-download'
import StoreReceiveNoteDialog from '@/page/manage/children/store/children/store-receive-note-dialog/store-receive-note-dialog'
import ajax from '@/api/ajax'
import moment from 'moment'

const isOnlineBefore = (operationTime) => {
  return moment(operationTime.time).isBefore(moment('2022-06-22 00:00:00'))
}
export default {
  name: 'store-record-inner',
  components: {
    'wh-carrier-account-select': whCarrierAccountSelect,
    StoreReceiveNoteDialog
  },
  data() {
    return {
      isOnlineBefore,
      columns: innerColumns,
      isLoading: false,
      page: {
        pageSize: 20,
        pageIndex: 1,
        total: 0
      },
      tableData: [],
      searchForm: new FormWord(),
      filterFields: {
        full: filterSession.getStoredFilterSet(true),
        stored: filterSession.getStoredFilterSet()
      }
    }
  },
  computed: {
    computedCols() {
      return this.columns.filter((item) => this.showWhatRect[item.key])
    },
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
  mounted() {
    this.getData()
  },
  methods: {
    openDetail(row) {
      this.stockIn(row, {
        disabled: true,
        extraRestore: {
          openCardDate: 'openCardDate',
          importBatchNo: 'batchNo'
        }
      })
    },
    tagToCn(tagStr) {
      const tags = tagStr.split(',')
      return tags.map((item) => this.enums.deviceBaseTag.maps()[item]).join('，')
    },
    handleTerminate(row) {
      this.$confirm('确定中止入库?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.jaxLib.store.terminationImport({
            importRecordId: row.baseOperationId
          })
          if (res && res.success) {
            this.$message.success('操作成功')
            await this.getData()
          }
        })
        .catch((e) => {
          console.log('🎸 DEBUG_66 store-record-inner.vue 👉', e)
        })
    },
    changeSize(val) {
      this.page.pageSize = val
      this.getData()
    },
    changPage(val) {
      this.page.pageIndex = val
      this.getData()
    },
    onSearch() {
      this.page.pageIndex = 1
      this.getData()
    },
    async getData() {
      let rst = await this.jaxLib.store.innerStoreRecord({
        ...this.searchForm.toSearch(),
        recordId: this.recordId,
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize
      })
      if (!rst.success) return false
      this.tableData = rst.data.list
      this.page.total = rst.data.page.allCount
    },
    async downloadResult(operationId, type) {
      const { success, data } = await this.jaxLib.card.innerStoreRecordGet({
        operationId: operationId,
        importResult: type
      })
      if (!success) return false
      await Download({ ...data, loop: true })
      return data
    },
    async downloadTables() {
      const { success, data } = await this.jaxLib.store.innerStoreRecordDown({
        ...this.searchForm.toSearch(),
        recordId: this.recordId,
        type: 'import'
      })
      if (!success) return false
      await Download({ ...data })
    },
    handleFilterChange(filterList) {
      filterSession.setStorage(filterList)
    },
    async clearCard(row) {
      await this.downloadResult(row.baseOperationId, 'fail')
      this.$confirm(`此操作将清除失败卡${row.faildCount}张, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let rst = await this.jaxLib.card.store.clearFailCard(row.baseOperationId)
          if (!rst.success) return false
          await this.getData()
          this.$message.success('清除成功')
        })
        .catch(() => {})
    },
    async clearAndStockIn(row) {
      this.$confirm(`此操作将清除失败卡${row.faildCount}张, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // const { success, data } = await this.jaxLib.card.innerStoreRecordGet({
          //   operationId: row.baseOperationId,
          //   importResult: 'fail'
          // })
          // if (!success) return false
          const downloadResult = await this.downloadResult(row.baseOperationId, 'fail')
          if (!downloadResult) return
          const res = await ajax.common.getOssObjectAndUpload({ fileKey: downloadResult.fileKey })
          let rst = await this.jaxLib.card.store.clearFailCard(row.baseOperationId)
          if (!rst.success) return false
          await this.getData()
          this.$message.success('清除成功')
          const ossFileUrl = res.data.filePosition
          this.stockIn(
            {
              ossFileUrl,
              ...row
            },
            {
              extraRestore: {
                importBatchNo: 'batchNo',
                openCardDate: 'openCardDate'
              }
            }
          )
        })
        .catch(() => {})
    },
    closeTag() {
      this.$router.push({ name: 'store-record-inner' })
      this.getData()
    },
    stockIn(data, options) {
      this.$refs.storeReceiveNoteDialog.open(data, options)
    }
  }
}
</script>

<template>
  <div class="store-record-inner">
    <store-receive-note-dialog ref="storeReceiveNoteDialog" @confirm="onSearch" />
    <div class="wh__tools--mix">
      <el-select
        v-model="searchForm.carrier"
        placeholder="运营商"
        style="width: 100px"
        clearable
        @change="onSearch"
      >
        <el-option
          v-for="(value, key) in enums.carrier.maps()"
          :key="key"
          :label="value"
          :value="key"
        >
        </el-option>
      </el-select>
      <wh-carrier-account-select
        v-if="searchForm.carrier !== ''"
        v-model="searchForm.carrierAccountId"
        style="width: 150px"
        placeholder="供应商账号"
        :carrier="searchForm.carrier"
        @change="onSearch"
      >
      </wh-carrier-account-select>
      <el-select
        v-model="searchForm.ratePlanType"
        placeholder="套餐类型"
        style="width: 150px"
        clearable
        @change="onSearch"
      >
        <el-option
          v-for="(value, key) in enums.ratePlanType.maps()"
          :key="key"
          :label="value"
          :value="key"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="searchForm.hasTesting"
        placeholder="测试期"
        style="width: 100px"
        clearable
        @change="onSearch"
      >
        <el-option label="有测试期" :value="true"> </el-option>
        <el-option label="无测试期" :value="false"> </el-option>
      </el-select>
      <el-select
        v-model="searchForm.material"
        placeholder="材质"
        style="width: 100px"
        clearable
        @change="onSearch"
      >
        <el-option
          v-for="(value, key) in enums.materialType.maps()"
          :key="key"
          :label="value"
          :value="key"
        ></el-option>
      </el-select>
      <el-select
        v-model="searchForm.specification"
        placeholder="规格"
        style="width: 100px"
        clearable
        @change="onSearch"
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
        start-placeholder="入库开始日期"
        end-placeholder="入库结束日期"
        style="width: 220px"
        @change="onSearch"
      />
      <el-select v-model="searchForm.cardIssuer" clearable placeholder="制卡商" @change="onSearch">
        <el-option
          v-for="(key, val) in enums.cardIssuer.maps()"
          :key="val"
          :label="key"
          :value="val"
        />
      </el-select>
      <el-input
        v-model="searchForm.id"
        placeholder="请输入入库ID"
        style="width: 160px"
        class="wh__tools--search-input"
        @change="onSearch"
        @keyup.native.enter="onSearch"
      />
      <el-tag v-if="recordId" closable @close="closeTag">当前搜索ID {{ recordId }} </el-tag>
      <el-popover
        ref="popover-filter"
        title="字段过滤"
        placement="bottom"
        class="wh__tools--filter"
        trigger="click"
      >
        <el-checkbox-group v-model="filterFields.stored" @change="handleFilterChange">
          <el-checkbox
            v-for="(value, key) in filterFields.full"
            :key="key"
            :label="key"
            class="wh__tools--filter-item"
          >
            {{ value }}
          </el-checkbox>
        </el-checkbox-group>
      </el-popover>
    </div>
    <div class="wh__tools--mix">
      <el-button type="primary" @click="stockIn()">入 库</el-button>
      <el-button size="mini" class="float-right ml10" @click="downloadTables()">
        <wh-std-icon sign="&#xe635;"> </wh-std-icon>
      </el-button>
      <el-button v-popover:popover-filter class="float-right" size="mini">
        <wh-std-icon sign="&#xe693;"> </wh-std-icon>
      </el-button>
    </div>
    <div v-loading="isLoading" class="wh__body">
      <el-table :data="tableData" class="wh__body--table" height="calc(100vh - 260px)">
        <el-table-column prop="id" label="入库ID" width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="openDetail(scope.row)">{{ scope.row.id }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="operationTime" label="操作时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.operationTime | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in computedCols"
          :key="index"
          :formatter="item.formatter"
          :prop="item.key"
          :label="item.name"
          :min-width="item.width"
          :align="item.align"
          :class-name="item.style"
        />
        <el-table-column prop="cardIssuer" label="制卡商">
          <template #default="{ row }"> {{ row.cardIssuer | cardIssuerFilter }} </template>
        </el-table-column>
        <el-table-column prop="cardProductionDate" label="生产日期">
          <template #default="{ row }">
            {{ row.cardProductionDate | dateFilter('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column prop="productionBatch" label="生产批次号">
          <template #default="{ row }">
            {{ row.productionBatch }}
          </template>
        </el-table-column>
        <!--        <el-table-column-->
        <!--          v-if="showWhatRect.specialLimit"-->
        <!--          prop="successCount"-->
        <!--          label="特殊限制"-->
        <!--          width="150"-->
        <!--        >-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-tooltip-->
        <!--              class="item"-->
        <!--              effect="dark"-->
        <!--              :content="tagToCn(scope.row.specialLimit)"-->
        <!--              placement="bottom"-->
        <!--            >-->
        <!--              <span class="inner__cell&#45;&#45;long">-->
        <!--                {{ tagToCn(scope.row.specialLimit) }}-->
        <!--              </span>-->
        <!--            </el-tooltip>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column-->
        <!--          v-if="showWhatRect.refCategoryDesc"-->
        <!--          prop="successCount"-->
        <!--          label="套餐分类"-->
        <!--          width="150"-->
        <!--        >-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-tooltip-->
        <!--              class="item"-->
        <!--              effect="dark"-->
        <!--              :content="scope.row.refCategoryDesc"-->
        <!--              placement="bottom"-->
        <!--            >-->
        <!--              <span class="inner__cell&#45;&#45;long">-->
        <!--                {{ scope.row.refCategoryDesc }}-->
        <!--              </span>-->
        <!--            </el-tooltip>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column prop="totalCount" label="总数(张)" width="90" fixed="right" />
        <el-table-column prop="successCount" label="成功(张)" width="90" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="downloadResult(scope.row.baseOperationId, 'success')">
              {{ scope.row.successCount }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="failCount" label="失败(张)" width="90" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.faildCount > 0 && scope.row.clearCount <= 0"
              type="text"
              @click="downloadResult(scope.row.baseOperationId, 'fail')"
            >
              {{ scope.row.faildCount }}
            </el-button>
            <span v-else>{{ scope.row.faildCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="clearCount" label="清除卡" width="90" fixed="right">
          <template slot-scope="scope">
            {{ scope.row.clearCount ? scope.row.clearCount : 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="failCount" label="操作" width="230" fixed="right">
          <template slot-scope="{ row }">
            <el-button
              v-if="!isOnlineBefore(row.operationTime)"
              style="margin: 5px 0"
              size="mini"
              @click="stockIn(row)"
              >复制</el-button
            >
            <el-button
              v-if="row.totalCount - row.faildCount - row.clearCount - row.successCount > 0"
              style="margin: 5px 0"
              size="mini"
              @click="handleTerminate(row)"
              >中止入库</el-button
            >
            <el-button
              v-if="row.faildCount && !row.clearCount && !isOnlineBefore(row.operationTime)"
              style="margin: 5px 0"
              size="mini"
              type="primary"
              @click="clearAndStockIn(row)"
            >
              失败卡清除并重新入库
            </el-button>
            <el-button
              v-if="row.faildCount && !row.clearCount && isOnlineBefore(row.operationTime)"
              size="mini"
              type="primary"
              @click="clearCard(row)"
            >
              失败卡清除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="wh__body--page">
        <el-pagination
          :current-page="page.pageIndex"
          :page-sizes="[10, 20, 30, 50, 100, 200]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          @size-change="changeSize"
          @current-change="changPage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
