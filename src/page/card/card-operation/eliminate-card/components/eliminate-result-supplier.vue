<script>
/**
 * Create by zeter on 2017/12/25
 */
import { restltSupplierList } from '../mixin/columns'
import moment from 'moment'
import whSalesSelect from '@/page/components/wh-sales-select.vue'
import cardPanel from '@/page/components/panel/card-info-panel.vue'
import clientPanel from '@/page/components/panel/client-info-panel.vue'
import Download from '@/page/components/wh-download/wh-download'
import DialogBatchIccidInputSearch from '@/page/components/DialogBatchIccidInputSearch'
import RetiredRecover from "@/page/card/card-operation/eliminate-card/components/retired-recover.vue";
const defaultDate = [moment().subtract(1, 'M'), moment()]

export default {
  components: {
    'wh-sales-select': whSalesSelect,
    'card-panel': cardPanel,
    'client-panel': clientPanel,
    DialogBatchIccidInputSearch,
    RetiredRecover
  },
  data() {
    return {
      defaultDate,
      pickDate: '',
      pickerOptions: {
        onPick: this.getPickDate,
        disabledDate: (time) => {
          const {minDate, maxDate} = this.pickDate;
          if (minDate && !maxDate) {
            const diff = Math.abs(minDate.valueOf() - time.valueOf());
            if (diff > 1000 * 3600 * 24 * 90) {
              return true;
            }
          }
          return time.getTime() > Date.now();
        },
      },
      columns: restltSupplierList,
      iccidsOssKey: '',
      tableDate: [],
      loading: false,
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      form: {
        iccids: '',
        orgId: '',
        saleName: '',
        carrier: '',
        gmtCreated: defaultDate,
        cardRetiringType: '',
        submitter: ''
      },
      batchDialogData: {
        fileList: [],
        iccids: []
      }
    }
  },
  computed: {
    cardRetiringTypeMap() {
      return this.$store.state.overall.enum.cardRetiringType
    },
    computedForm() {
      let form = { ...this.form }
      form.gmtCreatedStart = form.gmtCreated[0]
        ? moment(form.gmtCreated[0]).format('YYYY-MM-DD')
        : ''
      form.gmtCreatedEnd = form.gmtCreated[1] ? moment(form.gmtCreated[1]).format('YYYY-MM-DD') : ''
      delete form.gmtCreated
      return form
    },
    noBatchSearchData() {
      const { fileList, iccids } = this.batchDialogData
      return fileList.length === 0 && iccids.length === 0
    }
  },
  mounted() {
    this.simpleSearch()
  },
  methods: {
    onIccidChange(v) {
      this.simpleSearch()
    },
    onDateChange(v) {
      if (!v || !v.length) {
        this.$nextTick(() => {
          this.form.gmtCreated = ''
          this.simpleSearch()
        })
      }
    },
    getPickDate(pick) {
      this.pickDate = pick;
    },
    onBatchInputConfirm($event) {
      this.batchIccids = $event.iccids.filter((item) => !!item).join()
      this.iccidsOssKey = $event.iccidsOssKey
      this.batchDialogData = {
        iccids: $event.iccids.filter((item) => !!item),
        fileList: $event.fileList
      }
      if (!this.noBatchSearchData) this.resetSameIccidSearch('iccids')
      this.simpleSearch()
    },
    onBatchInput() {
      this.$refs.dialogBatchIccidInputSearch.open()
    },
    // 搜索
    async simpleSearch() {
      if (this.form.iccids) {
        // 如果单条输入框存在值则需要清除批量搜索的值
        this.resetSameIccidSearch('batchIccids')
      }
      if (!this.form.iccids && !this.iccidsOssKey && !this.batchIccids && (!this.form.gmtCreated || this.form.gmtCreated.length !== 2)) {
        this.$message.warning('数据量过大，请选择时间范围或者指定ICCIDs查询')
        return
      }
      this.loading = true
      let rst = await this.jaxLib.card.retiring.listOver({
        ...this.computedForm,
        pageNo: this.page.pageIndex,
        iccids: this.form.iccids || this.batchIccids,
        iccidsOssKey: this.iccidsOssKey
      })
      this.loading = false
      if (!rst.success) return false
      this.tableDate = rst.data.list
      this.page.total = rst.data.page.allCount
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.simpleSearch()
    },
    changeIndex(val) {
      this.page.pageIndex = val
      this.simpleSearch()
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
        this.form.iccids = ''
      }
    },
    recover() {
      this.$refs.retiredRecover.open()
    },
    async outExcel() {
      if (this.form.iccids) {
        // 如果单条输入框存在值则需要清除批量搜索的值
        this.resetSameIccidSearch('batchIccids')
      }
      const { success, data } = await this.jaxLib.card.retiring.listOverExport({
        ...this.computedForm,
        iccids: this.form.iccids || this.batchIccids,
        iccidsOssKey: this.iccidsOssKey
      })
      if (!success) return false
      await Download({ ...data })
    }
  }
}
</script>

<template>
  <div class="eliminate-result-supplier">
    <retired-recover ref="retiredRecover" @confirm="simpleSearch"/>
    <dialog-batch-iccid-input-search
      ref="dialogBatchIccidInputSearch"
      :file-list="batchDialogData.fileList"
      :iccids="batchDialogData.iccids"
      :file-url="iccidsOssKey"
      @confirm="onBatchInputConfirm"
    />
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-input
          v-model.trim="form.iccids"
          placeholder="请输入ICCID或者手机号"
          class="wh__tools--search-input"
          @keyup.native.enter="onIccidChange"
        >
        </el-input>
        <el-badge is-dot class="item" :hidden="noBatchSearchData">
          <el-button icon="el-icon-plus" @click.native="onBatchInput" />
        </el-badge>
        <el-select
          v-model="form.carrier"
          placeholder="选择运营商"
          clearable
          class="wh__tools--search-filter"
          style="width: 120px"
          @change="simpleSearch"
        >
          <el-option
            v-for="(key, val) in enums.carrier.maps()"
            :key="val"
            :label="key"
            :value="val"
          >
          </el-option>
        </el-select>
        <wh-sales-select
          v-model="form.saleName"
          placeholder="请选择销售"
          clearable
          @change="simpleSearch"
        >
        </wh-sales-select>
        <el-input
          v-model="form.orgId"
          placeholder="请输入企业ID"
          style="width: 120px"
          class="wh__tools--search-input"
          @keyup.native.enter="simpleSearch"
        >
        </el-input>
        <el-date-picker
            v-model="form.gmtCreated"
            :default-value="defaultDate"
            type="daterange"
            style="width: 230px"
            clearable
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="onDateChange"
            :picker-options="pickerOptions"
        >
        </el-date-picker>
        <el-input
          v-model="form.submitter"
          placeholder="输入申请人"
          class="wh__tools--search-simple"
          @keyup.native.enter="simpleSearch"
        >
        </el-input>
        <el-select
          v-model="form.cardRetiringType"
          placeholder="销卡类型"
          clearable
          class="wh__tools--search-filter"
          style="width: 120px"
          @change="simpleSearch"
        >
          <el-option
            v-for="(key, value) in cardRetiringTypeMap"
            :key="value"
            :label="key"
            :value="value"
          >
          </el-option>
        </el-select>
        <el-button type="primary" size="small" @click.native="simpleSearch">搜索</el-button>
      </div>
      <div class="clearfix">
        <el-button size="small"class="float-right" @click.native="outExcel" style="margin-left: 10px">导出</el-button>
        <el-button size="small"  type="primary"  class="float-right" @click.native="recover">销卡恢复</el-button>
      </div>
    </div>
    <div v-loading="loading" class="wh__body">
      <div class="wh__body--table">
        <el-table :data="tableDate" height="calc(100vh - 260px)">
          <el-table-column
            v-for="(item, index) in columns"
            v-if="['refuseCause', 'iccid', 'orgId'].indexOf(item.key) < 0"
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
            fixed
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
          <el-table-column
            v-else-if="item.key === 'orgId'"
            :label="item.name"
            :min-width="item.width"
            :align="item.align"
            :class-name="item.style"
          >
            <template slot-scope="scope">
              <client-panel :key="scope.row.orgId" :org-id="scope.row.orgId">
                <span>{{ scope.row.orgId }}</span>
              </client-panel>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.key === 'refuseCause'"
            key="refuseCause"
            label="理由"
            :min-width="190"
          >
            <template slot-scope="scope">
              <p>申请: {{ scope.row.submitCause }}</p>
              <p v-if="scope.row.status === 'refused'">拒绝: {{ scope.row.refuseCause }}</p>
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
  </div>
</template>
