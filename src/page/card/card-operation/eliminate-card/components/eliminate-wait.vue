<script>
/**
 * Create by zeter on 2017/12/25
 */
import carrierMap from '@/collect/carrier-map'
import {waitList} from '../mixin/columns'
import duePinCard from './due-pin-card.vue'
import moment from 'moment'
import whSalesSelect from '@/page/components/wh-sales-select.vue'
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
import cardPanel from '@/page/components/panel/card-info-panel.vue'
import clientPanel from '@/page/components/panel/client-info-panel.vue'
import Download from '@/page/components/wh-download/wh-download'
import retireConfirm from '@/page/card/card-operation/eliminate-card/mixin/retire-confirm'
import DialogBatchIccidInputSearch from '@/page/components/DialogBatchIccidInputSearch'

const defaultDate = [moment().subtract(1, 'M'), moment()]
export default {
  components: {
    'due-pin-card': duePinCard,
    'wh-sales-select': whSalesSelect,
    'wh-carrier-account-select': whCarrierAccountSelect,
    'card-panel': cardPanel,
    'client-panel': clientPanel,
    DialogBatchIccidInputSearch
  },
  mixins: [retireConfirm],
  data() {
    return {
      defaultDate,
      pickDate: '',
      columns: waitList,
      carrierList: carrierMap.beTemplate(),
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
      form: {
        iccids: '',
        orgId: '',
        saleName: '',
        carrierAccountId: '',
        carrier: '',
        status: '',
        gmtCreated: defaultDate,
        cardRetiringType: '',
        submitter: ''
      },
      tableDate: [],
      loading: false,
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      dialogModel: {
        more: false,
        action: false,
        name: 'refuse'
      },
      moreCardActive: '',
      multipleSelection: [],
      iccidsOssKey: '',
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
    noBatchSearchData() {
      const {fileList, iccids} = this.batchDialogData
      return fileList.length === 0 && iccids.length === 0
    },
    dialogTitle() {
      return this.dialogModel.name === 'refuse' ? '批量驳回' : '批量销卡'
    },
    computedForm() {
      let form = {...this.form}
      form.gmtCreatedStart = form.gmtCreated ? moment(form.gmtCreated[0]).format('YYYY-MM-DD') : ''
      form.gmtCreatedEnd = form.gmtCreated ? moment(form.gmtCreated[1]).format('YYYY-MM-DD') : ''
      delete form.gmtCreated
      return form
    }
  },
  mounted() {
    this.onSearch()
  },
  methods: {
    onDateChange(v) {
      if (!v || !v.length) {
        this.$nextTick(() => {
          this.form.gmtCreated = defaultDate
          this.onSearch()
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
        this.form.iccids = ''
      }
    },
    async onSearch() {
      this.loading = true
      if (this.form.iccids) {
        // 如果单条输入框存在值则需要清除批量搜索的值
        this.resetSameIccidSearch('batchIccids')
      }
      let rst = await this.jaxLib.card.retiring.list({
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
      this.onSearch()
    },
    changeIndex(val) {
      this.page.pageIndex = val
      this.onSearch()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async outExcel() {
      if (this.form.iccids) {
        // 如果单条输入框存在值则需要清除批量搜索的值
        this.resetSameIccidSearch('batchIccids')
      }
      const checkRes = await this.jaxLib.card.retiring.checkNoRetiredBeforeExport({
        ...this.computedForm,
        iccids: this.form.iccids || this.batchIccids,
        iccidsOssKey: this.iccidsOssKey
      })
      if (!checkRes.success) {
        this.$message.error(checkRes.message)
        return
      }
      if (!(await this.retireConfirm(checkRes.data))) return
      const {success, data} = await this.jaxLib.card.retiring.listExport({
        ...this.computedForm,
        iccids: this.form.iccids || this.batchIccids,
        iccidsOssKey: this.iccidsOssKey
      })
      if (!success) return false
      await Download({...data})
      await this.onSearch()
    },
    pinCard() {
      this.dialogModel.name = 'retiring'
      this.moreCardActive = ''
      if (this.multipleSelection.length === 0) {
        this.dialogModel.more = true
      } else {
        this.moreCardActive = this.multipleSelection
        this.dialogModel.action = true
      }
    },
    cancelPin() {
      this.dialogModel.name = 'refuse'
      if (this.multipleSelection.length === 0) {
        this.dialogModel.more = true
      } else {
        this.moreCardActive = this.multipleSelection
        this.dialogModel.action = true
      }
    },
    nextAction() {
      this.dialogModel.more = false
      this.dialogModel.action = true
    },
    closeDialog(name, type) {
      this.dialogModel[name] = false
      this.moreCardActive = ''
      if (type) {
        this.onSearch()
      }
    },
    onCarrierChange() {
      if (!this.form.carrier) {
        this.form.carrierAccountId = ''
      }
      this.onSearch()
    },
    onBatchInput() {
      this.$refs.dialogBatchIccidInputSearch.open()
    }
  }
}
</script>

<template>
  <div class="eliminate-wait">
    <dialog-batch-iccid-input-search
        ref="dialogBatchIccidInputSearch"
        :file-list="batchDialogData.fileList"
        :iccids="batchDialogData.iccids"
        :file-url="iccidsOssKey"
        @confirm="onBatchInputConfirm"
    />
    <div class="wh__tools">
      <div class="wh__tools--search">
        <el-input
            v-model="form.iccids"
            placeholder="请输入ICCID或者手机号"
            class="wh__tools--search-input"
            @keyup.native.enter="onSearch"
        >
        </el-input>
        <el-badge is-dot class="item" :hidden="noBatchSearchData">
          <el-button icon="el-icon-plus" @click.native="onBatchInput"/>
        </el-badge>
        <el-select
            v-model="form.carrier"
            placeholder="选择运营商"
            clearable
            class="wh__tools--search-filter"
            style="width: 120px"
            @change="onCarrierChange"
        >
          <el-option
              v-for="(key, val) in enums.carrier.maps()"
              :key="val"
              :label="key"
              :value="val"
          >
          </el-option>
        </el-select>
        <wh-carrier-account-select
            v-if="form.carrier !== ''"
            v-model="form.carrierAccountId"
            style="width: 150px"
            placeholder="供应商账号"
            :carrier="form.carrier"
            @change="onSearch"
        >
        </wh-carrier-account-select>
        <wh-sales-select
            v-model="form.saleName"
            placeholder="请选择销售"
            clearable
            @change="onSearch"
        >
        </wh-sales-select>
        <el-input
            v-model="form.orgId"
            placeholder="请输入企业ID"
            style="width: 120px"
            class="wh__tools--search-input"
            @keyup.native.enter="onSearch"
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
        <el-select
            v-model="form.status"
            placeholder="选择状态"
            clearable
            style="width: 100px"
            class="wh__tools--search-filter"
            @change="onSearch"
        >
          <el-option label="未处理" value="submited"></el-option>
          <el-option label="处理中" value="dealing"></el-option>
        </el-select>
        <el-input
            v-model="form.submitter"
            placeholder="输入申请人"
            class="wh__tools--search-simple"
            @keyup.native.enter="onSearch"
        >
        </el-input>
        <el-select
            v-model="form.cardRetiringType"
            placeholder="销卡类型"
            clearable
            class="wh__tools--search-filter"
            style="width: 120px"
            @change="onSearch"
        >
          <el-option
              v-for="(key, value) in cardRetiringTypeMap"
              :key="value"
              :label="key"
              :value="value"
          >
          </el-option>
        </el-select>
        <el-button type="primary" @click.native="onSearch">搜索</el-button>
      </div>
      <div class="wh__tools--operate">
        <el-button size="mini" class="float-right ml10" @click.native="outExcel">导出</el-button>
        <el-button size="mini" class="float-right ml10" @click.native="pinCard">销卡</el-button>
        <el-button size="mini" class="float-right ml10" @click.native="cancelPin">驳回</el-button>
      </div>
    </div>
    <div v-loading="loading" class="wh__body">
      <div class="wh__body--table">
        <el-table
            :data="tableDate"
            height="calc(100vh - 260px)"
            @selection-change="handleSelectionChange"
        >
          <el-table-column fixed type="selection" width="46"></el-table-column>
          <el-table-column
              v-for="(item, index) in columns"
              v-if="item.key !== 'iccid' && item.key !== 'orgId'"
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
              <client-panel
                  v-if="scope.row.orgId !== -1"
                  :key="scope.row.orgId"
                  :org-id="scope.row.orgId"
              >
                <span>{{ scope.row.orgId }}</span>
              </client-panel>
              <span v-else> 无 </span>
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
    <el-dialog class="wh__dialog" :title="dialogTitle" :visible.sync="dialogModel.more">
      <div class="wh__dialog--body">
        <div style="margin-bottom: 10px">ICCID数据：</div>
        <el-input
            v-model="moreCardActive"
            type="textarea"
            rows="6"
            placeholder="可以直接复制excel中整列ICCID；手动输入多个ICCID，一行一个;"
        >
        </el-input>
      </div>
      <div class="wh__dialog--footer">
        <el-button type="primary" @click="nextAction">下一步</el-button>
      </div>
    </el-dialog>
    <el-dialog class="wh__dialog" :title="dialogTitle" :visible.sync="dialogModel.action">
      <due-pin-card
          :multiple-selection="moreCardActive"
          :type="dialogModel.name"
          dialog-name="action"
          @closeDialog="closeDialog"
      >
      </due-pin-card>
    </el-dialog>
  </div>
</template>
