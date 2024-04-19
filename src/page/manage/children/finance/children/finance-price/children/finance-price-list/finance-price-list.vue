<script type="text/jsx">
import planAddEdit from './components/dialog-add-edit-plan.vue'
import batchEditPlan from './components/dialog-batch-edit-plan.vue'
import { PRICE_SET_COLUMNS, PRICE_COLUMNS } from './mixins/const'
import whClassificationSelect from '@/page/components/wh-classification-select.vue'
import priceClassPanel from '@/page/components/panel/price-class-info-panel.vue'
import Download from '@/page/components/wh-download/wh-download'
import DialogAddEditPlan from './components/DialogAddEditPlan.vue'
import whValiditySelect from '@/page/components/wh-validity-select.vue'
import filterQueryParams from '@/global/function/filterQueryParams'
import whVolumeInputSelect from '@/page/components/wh-volume-input-select.vue'

export default {
  components: {
    'plan-add-edit': planAddEdit,
    'batch-edit-plan': batchEditPlan,
    'wh-classification-select': whClassificationSelect,
    'price-class-panel': priceClassPanel,
    DialogAddEditPlan,
    whValiditySelect,
    whVolumeInputSelect
  },
  directives: {
    typeShow: {
      // 指令定义对象
      twoWay: true,
      bind: function (el, binding) {
        if (
          ['monthly', 'custom'].indexOf(binding.value.offerType) < 0 &&
          ['cardFee', 'ceramicCardFee', 'pasterCardFee', 'pasterCeramicCardFee'].indexOf(
            binding.value.keyName
          ) >= 0
        ) {
          el.parentNode.removeChild(el)
        }
      }
    }
  },
  data() {
    return {
      PRICE_COLUMNS,
      PRICE_SET_COLUMNS,
      loading: true,
      tableData: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      search: {
        carrier: '',
        offerType: undefined,
        categoryId: '',
        id: '',
        volume: undefined,
        validity: undefined
      },
      dialogVisible: {
        displayEditorWin: false,
        batchChange: false
      },
      fileMulti: [],
      indexPlan: 0,
      // 表格多选
      multipleSelection: [],
      batchEditType: '',
      dialogAddEditPlan: {
        visible: false,
        data: {}
      },
      volumeAndUnit: '',
      volumeList: []
    }
  },
  watch: {
    'search.carrier'(carrier) {
      this.getVolumeOptions(carrier)
    }
  },
  mounted() {
    const query = this.$route.query
    if (query.carrier) {
      this.search.carrier = query.carrier
    }
    if (typeof query.validity !== 'undefined') {
      this.search.offerType = query.validity ? 'custom' : 'monthly'
    }
    this.$nextTick(() => {
      if (query.volume && query.volumeUnit) {
        this.volumeAndUnit = query.volume + query.volumeUnit
      }
      this.$nextTick(() => {
        if (typeof query.validity !== 'undefined') {
          this.search.validity = parseInt(query.validity) === 0 ? 1 : parseInt(query.validity)
        }
        this.getList(this.search)
      })
    })
  },
  created() {
    this.$store.dispatch('changeClassificationList')
    this.getVolumeOptions()
  },
  methods: {
    // 列表样式
    tableRowClassName({ row }) {
      if (row.status === 'off') return 'table__extra--color'
    },
    // 拉取列表
    async getList() {
      this.loading = true
      let obj = {
        currentPage: this.page.pageIndex,
        rowsPerPage: this.page.pageSize,
        carrier: this.search.carrier,
        offerType: this.search.offerType,
        categoryId: this.search.categoryId,
        id: this.search.id,
        validity: this.search.validity
      }
      if (this.search.volume) {
        const pattern = /([0-9]+)(C|MB)/
        console.log(this.search.volume)
        const rst = pattern.exec(this.search.volume)
        const volume = parseFloat(rst[1])
        const unit = rst[2]
        obj.minVolume = volume
        obj.maxVolume = volume
        obj.useCountAsVolume = unit === 'C'
      }
      let rst = await this.jaxLib.financial.plan.getAll(obj)
      this.loading = false
      if (!rst.success) {
        this.$message.error('获取报价失败')
        return false
      }
      this.page.total = rst.data.page.allCount
      this.tableData = rst.data.list.map((item) => {
        item.status = item.status === 'on'
        return item
      })
    },
    // 切换类型
    changeType() {
      this.page.pageIndex = 1
      this.getList()
    },
    // 切换页码
    changeIndex(val) {
      this.page.pageIndex = val
      this.getList()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    // 新增按钮点击回调
    onCreateClick() {
      this.dialogAddEditPlan.visible = true
      this.dialogAddEditPlan.data = {}
    },
    // 修改按钮点击回调
    handleEdit(val) {
      this.dialogAddEditPlan.visible = true
      this.dialogAddEditPlan.data = Object.assign({}, val)
    },
    handleDelete(val) {
      this.$confirm(`确定删除套餐"${val.name}"吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.jaxLib.financial.plan.deleteOffer({
          priceOfferId: val.id
        })
        if (!res.success) return false
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getList()
      })
    },
    // 关闭弹窗
    closeDialog(idx, flag) {
      this.dialogVisible[idx] = false
      this.indexPlan = 0
      if (flag) this.getList()
    },
    // 数据导出回调
    async onExportClick() {
      const { data, success } = await this.jaxLib.financial.plan.exportData()
      if (!success) return false
      await Download({ ...data })
    },
    // 多选处理
    handleSelectionChange(val) {
      this.multipleSelection = val.map((e) => e.id)
    },
    // 批量修改
    onBatchChange(type) {
      if (this.multipleSelection.length) {
        this.batchEditType = type
        this.dialogVisible.batchChange = true
      } else {
        this.$message.warning('请勾选你需要修改的套餐')
      }
    },
    async statusChange(row) {
      let rst = await this.jaxLib.financial.plan.batchChangePackageStatus({
        ids: row.id,
        status: row.status ? 'on' : 'off'
      })
      if (!rst.success) return false
    },
    async getVolumeOptions(carrier) {
      const params = {
        carrier
      }
      const rst = await this.jaxLib.financial.volume.getVolumeList(filterQueryParams(params))
      this.volumeList = rst.data
    }
  }
}
</script>
<template>
  <div class="plan-manager-list">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-select
          v-model="search.carrier"
          placeholder="请选择运营商"
          clearable
          style="width: 110px"
          @change="changeType"
        >
          <el-option
            v-for="(key, val) in enums.carrier.maps()"
            :key="val"
            :label="key"
            :value="val"
          >
          </el-option>
        </el-select>
        <wh-volume-input-select v-model="search.volume" @change="getList" />
        <wh-validity-select
          v-model="search.validity"
          :volume-list="volumeList"
          :volume-and-unit="volumeAndUnit"
          @change="changeType"
        />
        <el-select
          v-model="search.offerType"
          placeholder="请选择类型"
          style="width: 140px"
          clearable
          @change="changeType"
        >
          <el-option
            v-for="(key, val) in enums.planType.maps()"
            :key="val"
            :label="key"
            :value="val"
          >
          </el-option>
        </el-select>
        <wh-classification-select
          v-model="search.categoryId"
          :show-disabled="false"
          :carrier="search.carrier"
          @change="changeType"
        >
        </wh-classification-select>
        <el-input
          v-model="search.id"
          style="width: 120px"
          placeholder="请输入套餐ID"
          @keyup.enter.native="changeType"
        >
        </el-input>
        <div class="float-right mb10">
          <el-button class="float-right wh__tools--mix-btn" size="mini" @click="onExportClick"
            >导出</el-button
          >
          <el-button
            class="float-right wh__tools--mix-btn"
            size="mini"
            @click="onBatchChange('discount')"
            >批量改折扣</el-button
          >
          <el-button
            class="float-right wh__tools--mix-btn"
            size="mini"
            @click="onBatchChange('status')"
            >批量上下架</el-button
          >
          <el-button type="primary" class="float-right" size="mini" @click="onCreateClick"
            >新增套餐</el-button
          >
        </div>
      </div>
    </div>
    <div v-loading="loading" class="wh__body">
      <div class="wh__body--table">
        <el-table
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          height="calc(100vh - 260px)"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item
                  v-for="(i, index) in PRICE_SET_COLUMNS"
                  :key="index"
                  v-typeShow="{
                    offerType: props.row.offerType,
                    keyName: i.key
                  }"
                  :label="i.label"
                >
                  <span>
                    {{
                      i.formatter ? i.formatter(props.row, { property: i.key }) : props.row[i.key]
                    }}
                  </span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="50"> </el-table-column>
          <el-table-column
            v-for="(item, index) in PRICE_COLUMNS"
            v-if="item.key !== 'categoryId'"
            :key="index"
            :formatter="item.formatter"
            :prop="item.key"
            :label="item.name"
            :min-width="item.width"
            :class-name="item.className"
          >
          </el-table-column>
          <el-table-column
            v-else
            :label="item.name"
            :min-width="item.width"
            :class-name="item.className"
          >
            <template slot-scope="scope">
              <price-class-panel :id="scope.row.categoryId" :key="scope.row.categoryId">
                <span>{{ scope.row.categoryId | classificationFilter }}</span>
              </price-class-panel>
            </template>
          </el-table-column>
          <el-table-column label="套餐状态" width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :disabled="scope.row.disabled"
                @change="statusChange(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="160">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleDelete(scope.row)">删除</el-button>
              <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="wh__body--page">
        <el-pagination
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          :page-sizes="[20, 40, 60, 100, 200, 500]"
          :total="page.total"
          layout="sizes, pager, total"
          @size-change="handleSizeChange"
          @current-change="changeIndex"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      :title="indexPlan ? `修改套餐` : `新增套餐`"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
      :visible.sync="dialogVisible.displayEditorWin"
      class="wh__dialog plan__dialog"
      top="3%"
    >
      <plan-add-edit :plan-id="indexPlan" dialog-name="displayEditorWin" @closeDialog="closeDialog">
      </plan-add-edit>
    </el-dialog>
    <el-dialog
      :title="batchEditType === 'discount' ? '批量改折扣' : '批量上下架'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
      :visible.sync="dialogVisible.batchChange"
      class="wh__dialog"
    >
      <batch-edit-plan
        :select-array="multipleSelection"
        dialog-name="batchChange"
        :type="batchEditType"
        @closeDialog="closeDialog"
      >
      </batch-edit-plan>
    </el-dialog>
    <dialog-add-edit-plan
      :visible.sync="dialogAddEditPlan.visible"
      :data="dialogAddEditPlan.data"
      @onRefreshTable="getList"
    />
  </div>
</template>
