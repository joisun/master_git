<script>
/**
 * Create by zeter on 2019-06-03
 */
import { settlementColumns as columns } from '../../mixins/const'
import configDialog from './components/config-dialog.vue'
import Download from '@/page/components/wh-download/wh-download'
import moment from 'moment'

export default {
  name: 'FinanceProfitSettlement',
  components: {
    'config-dialog': configDialog
  },
  data() {
    return {
      columns: columns,
      loading: false,
      downLoading: false,
      list: [],
      search: {
        month: moment().format('YYYY-MM-01')
      },
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      dialogStatus: {
        configDialog: false
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    onSearch() {
      this.page.pageIndex = 1
      this.getList()
    },
    async getList() {
      this.loading = true
      let rst = await this.jaxLib.financial.getProfitList({
        currentPage: this.page.pageIndex,
        rowsPerPage: this.page.pageSize,
        ...this.search
      })
      this.loading = false
      if (!rst.success) return false
      this.list = rst.data.list
      this.page.total = rst.data.page.allCount
    },
    async onDownloadFile() {
      const { success, data } = await this.jaxLib.financial.downProfitList({
        ...this.search
      })
      if (!success) return false
      await Download({ ...data })
    },
    changeSize(val) {
      this.page.pageSize = val
      this.getList()
    },
    changeIndex(val) {
      this.page.pageIndex = val
      this.getList()
    },
    openDialog(name, item) {
      this.item = item
      this.dialogStatus[name] = true
    },
    closeDialog(name, refresh) {
      this.dialogStatus[name] = false
      if (refresh) this.getList()
    }
  }
}
</script>

<template>
  <div class="finance-profit-settlement">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-date-picker
          v-model="search.month"
          format="yyyy-MM"
          type="month"
          placeholder="选择月份"
          value-format="yyyy-MM-dd"
          :clearable="false"
          @change="onSearch"
        />
        <el-button
          class="float-right wh__tools--mix-btn"
          size="mini"
          :disabled="downLoading"
          @click="onDownloadFile"
          >导出</el-button
        >
        <el-button
          class="float-right wh__tools--mix-btn"
          size="mini"
          @click="openDialog('configDialog')"
          >配置信息</el-button
        >
      </div>
    </div>
    <div v-loading="loading" class="wh__body">
      <div class="wh__body--table">
        <el-table :data="list" height="calc(100vh - 260px)" style="width: 100%">
          <el-table-column
            v-for="(item, index) in columns"
            :key="index"
            :formatter="item.formatter"
            :prop="item.key"
            :label="item.name"
            :min-width="item.width"
            :class-name="item.className"
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="wh__body--page">
        <el-pagination
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          :page-sizes="[10, 20, 50, 100, 200]"
          :total="page.total"
          layout="sizes, pager, total"
          @size-change="changeSize"
          @current-change="changeIndex"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog title="配置信息" size="tiny" :visible.sync="dialogStatus.configDialog">
      <config-dialog dialog-name="configDialog" @closeDialog="closeDialog"> </config-dialog>
    </el-dialog>
  </div>
</template>
