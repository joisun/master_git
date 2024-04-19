<script>
/**
 * Create by zeter on 2017/12/25
 */
import { restltCustomerList } from '../mixin/columns'
import cardPanel from '@/page/components/panel/card-info-panel.vue'
import Download from '@/page/components/wh-download/wh-download'
import DialogBatchIccidInputSearch from '@/page/components/DialogBatchIccidInputSearch.vue'

export default {
  components: {
    'card-panel': cardPanel,
    DialogBatchIccidInputSearch
  },
  data() {
    return {
      columns: restltCustomerList,
      tableDate: [],
      loading: false,
      iccids: '',
      iccidsOssKey: '',
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      batchDialogData: {
        fileList: [],
        iccids: []
      }
    }
  },
  computed: {
    noBatchSearchData() {
      const { fileList, iccids } = this.batchDialogData
      return fileList.length === 0 && iccids.length === 0
    }
  },
  mounted() {
    this.onSearch()
  },
  methods: {
    onBatchInputConfirm($event) {
      this.batchIccids = $event.iccids.filter((item) => !!item).join()
      this.batchDialogData = {
        iccids: $event.iccids.filter((item) => !!item),
        fileList: $event.fileList
      }
      if (!this.noBatchSearchData) this.resetSameIccidSearch('iccids')
      this.iccidsOssKey = $event.iccidsOssKey

      this.onSearch()
    },
    resetSameIccidSearch(resetTarget) {
      if (resetTarget === 'batchIccids') {
        this.batchIccids = ''
        this.iccidsOssKey = ''
        this.batchDialogData = {
          iccids: [],
          fileList: []
        }
      } else {
        this.iccids = ''
      }
    },
    // 搜索
    async onSearch() {
      this.loading = true
      if (this.iccids) {
        // 如果单条输入框存在值则需要清除批量搜索的值
        this.resetSameIccidSearch('batchIccids')
      }
      let rst = await this.jaxLib.card.retiring.query({
        iccids: this.iccids || this.batchIccids,
        iccidsOssKey: this.iccidsOssKey,
        pageNo: this.page.pageIndex
      })
      this.loading = false
      if (!rst.success) return false
      this.tableDate = rst.data.list
      this.page.total = rst.data.page.allCount
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.onSearch()
    },
    changeIndex(val) {
      this.page.pageIndex = val
      this.onSearch()
    },
    async outExcel() {
      if (this.iccids) {
        // 如果单条输入框存在值则需要清除批量搜索的值
        this.resetSameIccidSearch('batchIccids')
      }
      const { success, data } = await this.jaxLib.card.retiring.export({
        iccids: this.iccids || this.batchIccids,
        iccidsOssKey: this.iccidsOssKey
      })
      if (!success) return false
      await Download({ ...data })
    },
    onBatchInput() {
      this.$refs.dialogBatchIccidInputSearch.open()
    }
  }
}
</script>

<template>
  <div class="eliminate-result-customer">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-input
          v-model.trim="iccids"
          placeholder="请输入ICCID"
          class="wh__tools--search-input"
          @keyup.native.enter="onSearch"
        >
        </el-input>
        <el-badge is-dot class="item" :hidden="noBatchSearchData">
          <el-button icon="el-icon-plus" @click.native="onBatchInput" />
        </el-badge>
        <el-button type="primary" size="small" @click.native="onSearch">搜索</el-button>
        <el-button class="float-right" @click.native="outExcel">导出</el-button>
      </div>
    </div>
    <div v-loading="loading" class="wh__body">
      <div class="wh__body--table">
        <el-table :data="tableDate" height="calc(100vh - 260px)">
          <el-table-column
            v-for="(item, index) in columns"
            v-if="item.key !== 'iccid'"
            :key="index"
            :formatter="item.formatter"
            :prop="item.key"
            :label="item.name"
            :min-width="item.width"
            :align="item.align"
            :class-name="item.style"
          >
          </el-table-column>
          <el-table-column
            v-else-if="item.key === 'iccid'"
            :label="item.name"
            :min-width="item.width"
            :align="item.align"
            :class-name="item.style"
          >
            <template slot-scope="scope">
              <card-panel :key="scope.row.iccid" :iccid="scope.row.iccid" placement="right">
                <span>{{ scope.row.iccid }}</span>
              </card-panel>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="wh__body--page">
        <el-pagination
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          :total="page.total"
          layout="pager, total"
          @current-change="changeIndex"
        >
        </el-pagination>
      </div>
    </div>
    <dialog-batch-iccid-input-search
      ref="dialogBatchIccidInputSearch"
      :file-list="batchDialogData.fileList"
      :iccids="batchDialogData.iccids"
      :file-url="iccidsOssKey"
      @confirm="onBatchInputConfirm"
    />
  </div>
</template>
