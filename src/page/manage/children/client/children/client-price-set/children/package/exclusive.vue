<script>
import Vue from 'vue'
import { PRICE_SET_COLUMNS, PRICE_CONDITIONS_LIST } from './mixins/const'
import editPrice from './components/edit-price.vue'
import editCondition from './components/edit-condition.vue'
import whClassificationSelect from '@/page/components/wh-classification-select.vue'
import regexps from '@/constant/regexps'
import pricePanel from '@/page/components/panel/price-info-panel.vue'
import priceClassPanel from '@/page/components/panel/price-class-info-panel.vue'
import batchSetting from './components/batch-setting.vue'
import volumeFormat from '@/global/filters/volume-format'
import filterSession from './mixins/table-filter'
import apis from '@/api/ajax'
import DialogEditPriceOffer from '@/page/manage/children/finance/children/finance-price/children/finance-price-list/components/DialogEditPriceOffer.vue'
import whValiditySelect from '@/page/components/wh-validity-select.vue'
import filterQueryParams from '@/global/function/filterQueryParams'
import renewOptions from '@/constant/options/renew'
import cardFunctionOptions from '@/constant/options/cardFunction'
import whVolumeInputSelect from '@/page/components/wh-volume-input-select.vue'
import AddDialog from '@/page/manage/children/client/children/client-price-set/children/package/components/add-dialog'
import { safeGet } from '@/global/function/safe-operations'

const rangeMap = [0, 5, 10, 30, 100, 500, 1024, 5120, 10240, 204800, '无限']
export default {
  components: {
    'edit-price': editPrice,
    'edit-condition': editCondition,
    'wh-classification-select': whClassificationSelect,
    'price-panel': pricePanel,
    'price-class-panel': priceClassPanel,
    'batch-setting': batchSetting,
    DialogEditPriceOffer,
    whValiditySelect,
    whVolumeInputSelect,
    AddDialog
  },
  mixins: [filterSession],
  data() {
    return {
      PRICE_SET_COLUMNS,
      PRICE_CONDITIONS_LIST,
      loading: true,
      // 更改判断
      prices: {},
      // 表格
      page: {
        pageNo: 1,
        rowsPerPage: 20,
        totalAmount: 0
      },
      planData: [],
      // 搜索
      popoverStatus: false,
      search: {
        carrier: '',
        offerType: '',
        categoryId: '',
        apiRechargeCountLimit: '',
        id: '',
        volume: undefined,
        disableOnStatus: false,
        validity: undefined, // 套餐周期
        rechargeUnit: undefined, // 订购周期
        deadline: undefined // 激活宽限期
      },
      content: {},
      editDialog: false,
      editConditionDialog: false,
      batchDialog: false,
      classificationList: [],
      multipleSelection: [],
      priceList: {},
      batchDialogType: '',
      popShowFilter: false,
      DialogEditPriceOffer: {
        visible: false,
        data: {}
      },
      volumeAndUnit: '', // 筛选项：套餐规格
      volumeList: [],
      form: {
        generationArr: [],
        networkAttribute: [],
        packageAttribute: '',
        cardFunction: [],
        platform: '',
        renewRestriction: [],
        carrierSpecialRestriction: [],
        bottomPrice: undefined,
        status: undefined,
        vpdn: undefined
      },
      formParams: {},
      options: {
        ...renewOptions,
        ...cardFunctionOptions
      }
    }
  },
  computed: {
    batchContent() {
      return this.multipleSelection.length ? this.multipleSelection : this.planData
    },
    orgId() {
      return this.$route.query.orgId
    },
    customerName() {
      return this.$route.query.orgName
    },
    platformOptions() {
      if (!this.search.carrier) {
        return []
      }
      return this.enums.platformTypes.get(this.search.carrier).platforms
    },
    tableHeight() {
      const screenHeight = window.innerHeight
      return screenHeight - 280
    }
  },
  watch: {
    'search.carrier'(carrier) {
      this.getVolumeOptions(carrier)
    }
  },
  async created() {
    this.$store.dispatch('changeClassificationList')
    this.getVolumeOptions()
  },
  async mounted() {
    await this.getUserInfo()
    await this.loadPriceTable()
  },
  methods: {
    async handleRemove() {
      const { multipleSelection } = this
      console.log('🎸 DEBUG_134 exclusive.vue 👉', multipleSelection)
      const res = await this.jaxLib.customer.priceTable.exclusiveRemove({
        ids: multipleSelection.map((item) => item.id).join(),
        orgId: this.orgId
      })
      if (safeGet(res, 'success', false)) {
        this.$message.success('操作成功')
        this.changeType()
      }
    },
    handleAdd() {
      this.$refs.addDialog.open({
        orgId: this.$route.query.orgId
      })
    },
    transferValue(e) {
      return e === 10 ? rangeMap[e] : volumeFormat(rangeMap[e])
    },
    // 获取用户信息
    async getUserInfo() {
      let rst = await this.jaxLib.customer.info({
        orgId: this.orgId
      })
      if (!rst.success) return false
      this.tableDate = {
        ...rst.data.qualification,
        ...rst.data.information,
        ...rst.data.information.orgAdmin
      }
    },
    // 切换页码
    changePage(val) {
      this.page.pageNo = val
      this.loadPriceTable()
    },
    // 切换页数量
    handleSizeChange(val) {
      this.page.rowsPerPage = val
      this.loadPriceTable()
    },
    // 切换多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    generateFormParams() {
      let formParams = {
        categoryType: this.form.packageAttribute,
        platform: this.form.platform
      }
      if (this.form.renewRestriction.length) {
        formParams = {
          ...formParams,
          allowAppendPackage: this.form.renewRestriction.includes('ALLOW_APPEND_PACKAGE')
            ? true
            : undefined,
          allowAppendPoolPackage: this.form.renewRestriction.includes('ALLOW_APPEND_POOL_PACKAGE')
            ? true
            : undefined,
          allowAutoRecharge: this.form.renewRestriction.includes('ALLOW_AUTO_RECHARGE')
            ? true
            : undefined,
          allowChangeRatePlan: this.form.renewRestriction.includes('ALLOW_CHANGE_RATE_PLAN')
            ? true
            : undefined,
          allowAutoRecharge: this.form.renewRestriction.includes('ALLOW_AUTO_RECHARGE')
            ? true
            : undefined,
          rechargeTimeLimit: this.form.renewRestriction.includes('RECHARGE_TIME_LIMIT')
            ? true
            : undefined
        }
      }
      if (this.form.carrierSpecialRestriction.length) {
        formParams = {
          ...formParams,
          carrierImeiBind: this.form.carrierSpecialRestriction.includes('carrierImeiBinding')
            ? true
            : undefined,
          carrierRealName: this.form.carrierSpecialRestriction.includes('carrierRealnamed')
            ? true
            : undefined
        }
      }
      if (typeof this.form.networkAttribute === 'boolean') {
        formParams.vpdn = this.form.networkAttribute
      }
      if (typeof this.form.status === 'boolean') {
        formParams.status = this.form.status ? 'on' : 'off'
      }
      if (this.form.generationArr.length) {
        formParams.generation = this.form.generationArr.join(',')
      }
      if (this.form.cardFunction.length) {
        formParams = {
          ...formParams,
          sms: this.form.cardFunction.includes('smsType') ? true : undefined,
          locating: this.form.cardFunction.includes('locating') ? true : undefined,
          realnamed: this.form.cardFunction.includes('realnamed') ? true : undefined,
          apn: this.form.cardFunction.includes('apn') ? true : undefined,
          imeiBinding: this.form.cardFunction.includes('imeiBinding') ? true : undefined,
          testing: this.form.cardFunction.includes('testing') ? true : undefined
        }
      }
      return formParams
    },
    // 加载弹窗报价表
    async loadPriceTable() {
      this.loading = true
      this.planData = []
      let obj = {
        orgId: this.$route.query.orgId,
        // currentPage: this.page.pageNo,
        // rowsPerPage: this.page.rowsPerPage,
        carrier: this.search.carrier,
        offerType: this.search.offerType,
        categoryId: this.search.categoryId,
        id: this.search.id.trim(),
        rechargeUnit: this.search.rechargeUnit,
        purchaseLimit: this.search.purchaseLimit,
        deadline: this.search.deadline,
        validity: this.search.validity,
        ...this.formParams
      }
      if (this.search.volume) {
        const pattern = /([0-9]+)(C|MB)/
        const rst = pattern.exec(this.search.volume)
        const volume = parseFloat(rst[1])
        const unit = rst[2]
        obj.minVolume = volume
        obj.maxVolume = volume
        obj.useCountAsVolume = unit === 'C'
      }
      if (this.search.disableOnStatus !== '') {
        obj.disableOnStatus = this.search.disableOnStatus
      }
      if (this.search.apiRechargeCountLimit !== '')
        obj.isApiRechargeCountLimit = Boolean(this.search.apiRechargeCountLimit)
      const rst = await this.jaxLib.customer.priceTable.exclusive(filterQueryParams(obj))
      this.loading = false
      if (!rst.success) return false
      // this.page.totalAmount = rst.data.page.allCount
      let hash = {}
      let priceList = {}
      let base = rst.data.map((e) => {
        let j = Object.assign({}, e)
        // 销售报价保存
        hash[e.id] = typeof e.salePrice === 'number' ? e.salePrice : e.price
        priceList[e.id] = typeof e.salePrice === 'number' ? e.salePrice : e.price
        // 表单校验初始化
        j.enterError = false
        j.errorTitle = ''
        j.status = e.status === 'on'
        if (!j.conditions || !j.conditions.length)
          j.conditions = [{ price: j.price, commission: 0, invalid: true }]
        return j
      })
      Vue.set(this, 'prices', hash)
      Vue.set(this, 'priceList', priceList)
      Vue.set(this, 'planData', base)
      this.$nextTick(() => {
        this.$refs.table.doLayout()
      })
    },
    // 提交设置报价
    async submitPriceForm(data) {
      let rst = await apis.customer.batchUpdateCustomePrice({
        orgId: this.$route.query.orgId,
        form: data
      })
      if (!rst.success) {
        this.message.error('销售报价保存失败！' + rst.message)
        return false
      }
      this.$message.success({ message: '销售报价保存成功！', duration: 1000 })
      this.loadPriceTable()
    },
    // 点击表单
    onCreateBtnClick() {
      // 转化
      let sendData = []
      // eslint-disable-next-line no-unused-vars
      for (let i of Object.keys(this.prices)) {
        let priceChange = this.prices[i] !== this.priceList[i]
        console.log(priceChange)
        if (priceChange) {
          sendData.push({
            systemOfferId: i,
            salePrice: Number(this.prices[i])
          })
        }
      }
      this.submitPriceForm(sendData)
    },
    // 高级搜索
    changeType() {
      this.page.pageNo = 1
      this.loadPriceTable()
    },
    // 关闭页面
    backToCustomerList() {
      this.$router.push('client-list')
    },
    // 价格校验
    validatePrice(value, row) {
      row.enterError = true
      if (value === '') {
        row.errorTitle = '输入不能为空'
        return false
      }
      if (!regexps.money.test(value)) {
        row.errorTitle = '请输入有效值'
        return false
      }
      this.prices[row.id] = value
      row.errorTitle = ''
      row.enterError = false
      return true
    },
    // 打开弹窗
    openDialog(name, idx, type = '') {
      if (idx) {
        this.content = idx
      } else {
        this.content = null
      }
      this[name] = true
      this.batchDialogType = type
    },
    // 关闭弹窗
    closeDialog(idx, flag) {
      this[idx] = false
      if (flag) {
        this.loadPriceTable()
      }
    },
    onDialogBatchSettingClosed() {
      const batchSetting = this.$refs.batchSetting
      if (batchSetting) {
        const form = batchSetting.$refs.form
        if (form) {
          form.resetFields()
          form.clearValidate()
        }
      }
    },
    handleEdit(row) {
      this.DialogEditPriceOffer.visible = true
      this.DialogEditPriceOffer.data = Object.assign({}, row)
    },
    async statusChange(row) {
      let rst = await this.jaxLib.financial.plan.batchChangeStatus({
        ids: row.id,
        orgId: this.orgId,
        status: row.status ? 'on' : 'off',
        exactId: true
      })
      if (!rst.success) return false
      this.$message.success('修改成功')
    },
    async getVolumeOptions(carrier) {
      const params = {
        carrier
      }
      const rst = await this.jaxLib.financial.volume.getVolumeList(filterQueryParams(params))
      this.volumeList = rst.data
    },
    onRefresh() {
      this.loadPriceTable()
    },
    onClearAdvancedFilter() {
      this.form = Object.assign({}, this.form, {
        generationArr: [],
        networkAttribute: [],
        packageAttribute: '',
        cardFunction: [],
        platform: '',
        renewRestriction: [],
        carrierSpecialRestriction: [],
        bottomPrice: undefined,
        status: false
      })
      this.formParams = {}
      this.changeType()
    },
    onConfirmAdvancedFilter() {
      this.formParams = this.generateFormParams()
      this.changeType()
    },
    handleAddChange() {
      this.changeType()
    }
  }
}
</script>

<template>
  <div class="customer-price-set-package">
    <add-dialog ref="addDialog" @confirm="handleAddChange" />
    <div class="wh__tools--mix">
      <el-select
        v-model="search.carrier"
        placeholder="请选择运营商"
        clearable
        style="width: 110px"
        @change="changeType"
      >
        <el-option v-for="(key, val) in enums.carrier.maps()" :key="val" :label="key" :value="val">
        </el-option>
      </el-select>
      <el-select
        v-model="search.offerType"
        placeholder="请选择类型"
        clearable
        style="width: 110px"
        @change="changeType"
      >
        <el-option v-for="(key, val) in enums.planType.maps()" :key="val" :label="key" :value="val">
        </el-option>
      </el-select>
      <wh-volume-input-select v-model="search.volume" @change="loadPriceTable" />
      <wh-validity-select
        v-model="search.validity"
        :volume-list="volumeList"
        :volume-and-unit="volumeAndUnit"
        @change="changeType"
      />
      <wh-classification-select
        v-model="search.categoryId"
        style="width: 110px"
        :carrier="search.carrier"
        :show-disabled="false"
        placeholder="请选择分类"
        size="small"
        clearable
        @change="changeType"
      />
      <el-input-number
        v-model="search.rechargeUnit"
        placeholder="订购周期"
        clearable
        style="width: 80px"
        :controls="false"
        @change="changeType"
      />
      <el-input-number
        v-model="search.purchaseLimit"
        placeholder="购卡周期范围"
        clearable
        :controls="false"
        style="width: 110px"
        @change="changeType"
      />
      <el-select
        v-model="search.deadline"
        placeholder="激活宽限期"
        clearable
        style="width: 115px"
        @change="changeType"
      >
        <el-option
          v-for="(item, index) in Array(12)"
          :key="index"
          :label="index + 1"
          :value="index + 1"
        >
        </el-option>
      </el-select>
      <el-input
        v-model="search.id"
        style="width: 70px"
        placeholder="套餐ID"
        @keyup.enter.native="changeType"
      >
      </el-input>
      <el-select
        v-model="search.disableOnStatus"
        style="width: 80px"
        placeholder="是否禁止上架"
        clearable
        @change="changeType"
      >
        <el-option label="是" :value="true" />
        <el-option label="否" :value="false" />
      </el-select>
    </div>
    <div>
      <el-popover ref="popover-filter" v-model="popShowFilter" placement="bottom" trigger="click">
        <div style="height: 450px; overflow: auto; width: 320px">
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="网络制式" prop="generationArr">
              <el-select v-model="form.generationArr" multiple>
                <el-option
                  v-for="option in options.generation"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="网络属性" prop="networkAttribute">
              <el-select v-model="form.networkAttribute">
                <el-option
                  v-for="option in options.networkAttribute"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="套餐属性" prop="packageAttribute">
              <el-select v-model="form.packageAttribute">
                <el-option
                  v-for="option in options.packageAttribute"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="卡功能" prop="cardFunction">
              <el-select v-model="form.cardFunction" multiple>
                <el-option
                  v-for="option in options.cardFunction"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属平台" prop="platform">
              <el-select v-model="form.platform" :disabled="!search.carrier">
                <el-option
                  v-for="item in platformOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="续费限制" prop="renewRestriction">
              <el-select v-model="form.renewRestriction" multiple
                ><el-option
                  v-for="item in options.renewRestriction"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              /></el-select>
            </el-form-item>
            <el-form-item label="运营商特殊限制" prop="carrierSpecialRestriction">
              <el-select v-model="form.carrierSpecialRestriction"
                ><el-option
                  v-for="item in options.carrierSpecialRestriction"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              /></el-select>
            </el-form-item>
            <el-form-item label="销售底价" prop="bottomPrice">
              <el-input-number v-model="search.bottomPrice" clearable :controls="false" />
            </el-form-item>
            <el-form-item label="套餐上下架状态" prop="status">
              <el-switch v-model="form.status" active-text="上架" inactive-text="下架" />
            </el-form-item>
          </el-form>
        </div>
        <div style="text-align: right">
          <el-button @click="onClearAdvancedFilter">清空</el-button>
          <el-button type="primary" @click="onConfirmAdvancedFilter">确认</el-button>
        </div>
      </el-popover>
      <el-button v-popover:popover-filter class="float-right ml10"> 高级搜索 </el-button>
      <el-button
        type="primary"
        class="float-right ml10"
        size="mini"
        @click="openDialog('batchDialog', '', 'discount')"
      >
        批量修改折扣
      </el-button>
      <el-button
        type="primary"
        class="float-right ml10"
        size="mini"
        @click="openDialog('batchDialog', '', 'status')"
      >
        批量上下架
      </el-button>
      <el-button type="primary" class="float-right ml10" size="mini" @click="handleRemove()">
        批量移除
      </el-button>
      <el-button type="primary" class="float-right ml10" size="mini" @click="handleAdd">
        新增
      </el-button>
    </div>
    <div class="wh__body">
      <div v-loading="loading" class="wh__body--table">
        <el-table
          ref="table"
          :data="planData"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="ID" width="76">
            <template slot-scope="scope">
              <price-panel :id="scope.row.id" :key="scope.row.id">
                <span>{{ scope.row.id }}</span>
              </price-panel>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(column, index) in PRICE_SET_COLUMNS"
            v-if="column.key !== 'categoryId'"
            :key="index"
            :label="column.label"
            :formatter="column.formatter"
            :prop="column.key"
            :min-width="column.width"
            :fixed="column.fixed"
          >
          </el-table-column>
          <el-table-column
            v-else
            :label="column.label"
            :min-width="column.width"
            :fixed="column.fixed"
          >
            <template slot-scope="scope">
              <price-class-panel :id="scope.row.categoryId" :key="scope.row.categoryId">
                <span>{{ scope.row.categoryId | classificationFilter }}</span>
              </price-class-panel>
            </template>
          </el-table-column>
          <el-table-column
            v-if="revealFields.stored.indexOf('profitRate') > -1"
            label="返佣配置(%)"
            min-width="120"
          >
            <template slot-scope="scope">
              <div>
                <el-input
                  v-model="profitRateList[scope.row.id]"
                  size="mini"
                  :disabled="
                    search.offerType === 'pool-package' || search.offerType === 'overflow-package'
                  "
                  :class="{ 'error-input': scope.row.errorTitle }"
                  @change="changeProfitRate($event, scope.row)"
                >
                </el-input>
                <div v-if="scope.row.enterError" class="price-set__error">
                  {{ scope.row.errorTitle }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="revealFields.stored.indexOf('profitPrice') > -1"
            label="返佣配置(元)"
            min-width="120"
          >
            <template slot-scope="scope">
              <div>
                <el-input
                  v-model="profitPriceList[scope.row.id]"
                  size="mini"
                  :disabled="
                    search.offerType === 'pool-package' || search.offerType === 'overflow-package'
                  "
                  :class="{ 'error-input': scope.row.errorTitle }"
                  @change="changeProfitPrice($event, scope.row)"
                >
                </el-input>
                <div v-if="scope.row.enterError" class="price-set__error">
                  {{ scope.row.errorTitle }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="套餐状态" width="140">
            <template slot-scope="scope">
              <el-switch
                :key="scope.row.id"
                :disabled="scope.row.disableOnStatus"
                :value="scope.row.status"
                active-text="上架"
                inactive-text="下架"
                @input="(val) => (scope.row.status = val)"
                @change="statusChange(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleEdit(scope.row)"
                >报价设置
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--      <div class="wh__body&#45;&#45;page">-->
      <!--        <el-pagination-->
      <!--          :current-page="page.pageNo"-->
      <!--          :page-size="page.rowsPerPage"-->
      <!--          layout="sizes, prev, pager, next, jumper"-->
      <!--          :total="page.totalAmount"-->
      <!--          @size-change="handleSizeChange"-->
      <!--          @current-change="changePage"-->
      <!--        >-->
      <!--        </el-pagination>-->
      <!--      </div>-->
    </div>
    <el-dialog
      :visible.sync="batchDialog"
      class="wh__dialog"
      size="tiny"
      width="400px"
      :title="batchDialogType === 'status' ? '批量上下架' : '批量修改折扣'"
      @close="onDialogBatchSettingClosed"
    >
      <batch-setting
        ref="batchSetting"
        :content="batchContent"
        :org-id="orgId"
        :org-name="customerName"
        dialog-name="batchDialog"
        :type="batchDialogType"
        @closeDialog="closeDialog"
      >
      </batch-setting>
    </el-dialog>
    <el-dialog
      :visible.sync="editDialog"
      :close-on-click-modal="false"
      class="wh__dialog"
      size="small"
      title="编辑套餐"
    >
      <edit-price
        :org-id="orgId"
        :org-name="customerName"
        :content="content"
        dialog-name="editDialog"
        @closeDialog="closeDialog"
      >
      </edit-price>
    </el-dialog>
    <el-dialog
      :visible.sync="editConditionDialog"
      :close-on-click-modal="false"
      class="wh__dialog"
      width="90%"
      title="报价设置"
    >
      <edit-condition
        v-if="editConditionDialog"
        :org-id="orgId"
        :org-name="customerName"
        :content="content"
        dialog-name="editConditionDialog"
        @closeDialog="closeDialog"
      >
      </edit-condition>
    </el-dialog>
    <DialogEditPriceOffer
      :visible.sync="DialogEditPriceOffer.visible"
      :data="DialogEditPriceOffer.data"
      :is-offer-setting="true"
      :is-unique="true"
      @onRefreshTable="onRefresh"
    />
  </div>
</template>
