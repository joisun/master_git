<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="报价设置"
    width="1300px"
    top="1%"
    class="wh__dialog"
    @close="closeDialog"
  >
    <el-form ref="form" :model="form" :rules="rules" :inline="true" :label-width="labelWidth">
      <div class="plan__dialog--block">
        <el-form-item label="报价类型" prop="offerType">
          <el-select
            v-model="form.offerType"
            placeholder="选择报价类型"
            disabled
            @change="onOfferTypeChange"
          >
            <el-option
              v-for="item in options.offerType"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="运营商类型" prop="operator">
          <el-select
            v-model="form.operator"
            placeholder="选择运营商"
            disabled
            @change="onOperatorChange"
          >
            <el-option
              v-for="(key, val) in enums.carrier.mapsByOrdinal()"
              :key="val"
              :label="val"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <template v-if="form.offerType === 'monthly' || form.offerType === 'custom'">
          <el-form-item label="套餐规格" prop="volumeAndUnit">
            <wh-volume-select
              v-model="form.volumeAndUnit"
              :volume-list="volumeList"
              :offer-type="form.offerType"
              disabled
              :show-times-options="form.offerType !== 'monthly'"
              :carrier="enums.carrier.ordinal2key(form.operator)"
            />
          </el-form-item>
        </template>
        <template v-if="form.offerType === 'custom'">
          <el-form-item label="周期定义">
            <el-radio
              v-for="item in options.periodDefinition"
              :key="item.value"
              v-model="form.periodDefinition"
              :label="item.value"
              :disabled="isEdit"
              @change="onPeriodDefinition"
              >{{ item.label }}</el-radio
            >
          </el-form-item>
          <el-form-item label="套餐结束方式">
            <el-radio
              v-for="item in options.periodEndTag"
              :key="item.value"
              v-model="form.periodEndTag"
              :label="item.value"
              :disabled="(item.value === 1 && form.periodDefinition !== 1) || isEdit"
              >{{ item.label }}</el-radio
            >
          </el-form-item>
          <el-form-item label="套餐开始时间定义" label-width="140px">
            <el-radio
              v-for="item in options.TIME_START_DEF"
              :key="item.value"
              v-model="form.offerBeginType"
              :label="item.value"
              :disabled="isEdit"
              >{{ item.label }}</el-radio
            >
          </el-form-item>
          <el-form-item label="续费触发激活卡" label-width="140px">
            <el-switch
              v-model="form.renewalTriggerCardActivation"
              active-text="是"
              inactive-text="否"
              :active-value="true"
              :inactive-value="false"
              :disabled="isEdit"
            />
          </el-form-item>
          <el-form-item label="无限流量套餐" label-width="140px">
            <el-switch
              v-model="form.unlimited"
              active-text="是"
              inactive-text="否"
              :active-value="true"
              :inactive-value="false"
              :disabled="isEdit"
            />
          </el-form-item>
        </template>
      </div>
      <div
        v-show="form.offerType !== 'monthly' && form.offerType !== 'custom'"
        class="plan__dialog--block"
        prop="packageVolume"
      >
        <el-form-item label="流量大小" prop="packageVolume">
          <el-input
            v-show="form.offerType === 'package'"
            v-model="form.packageVolume"
            placeholder="请填写流量大小"
            :disabled="isEdit"
            style="width: 200px"
          >
            <el-select
              slot="append"
              v-model="form.packageVolumeUnit"
              :disabled="isEdit"
              placeholder="请选择"
              style="width: 70px"
            >
              <el-option label="MB" value="MB" />
              <el-option label="GB" value="GB" />
            </el-select>
          </el-input>
          <span v-show="form.offerType === 'pool-package'">以GB为最小单位,设置1GB单价</span>
        </el-form-item>
      </div>
      <div class="plan__dialog--block">
        <el-form-item label="续费分类" prop="renewId">
          <el-select
            v-model="form.renewId"
            placeholder="选择续费分类"
            disabled
            @change="setRenewData"
          >
            <el-option
              v-for="option in renewList"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            />
          </el-select>
          <el-button
            v-show="form.offerType === 'monthly' || form.offerType === 'custom'"
            type="text"
            @click="formRenew.visible = !formRenew.visible"
            >{{ formRenew.visible ? '隐藏详情' : '显示详情' }}</el-button
          >
        </el-form-item>
        <form-renew
          v-show="
            formRenew.visible && (form.offerType === 'monthly' || form.offerType === 'custom')
          "
          :data="formRenew.data"
          :disabled="true"
          :default-margin="false"
        />
        <el-form-item v-show="form.offerType === 'package'" label="特殊标记" prop="specialMark">
          <el-checkbox v-model="form.specialMark" disabled>允许续费</el-checkbox>
        </el-form-item>
      </div>
      <div
        v-if="form.offerType === 'monthly' || form.offerType === 'custom'"
        class="plan__dialog--block"
      >
        <el-form-item label="卡功能分类" prop="cardFunctionId">
          <el-select
            v-model="form.cardFunctionId"
            disabled
            placeholder="选择卡功能分类"
            @change="setCardFunctionData"
          >
            <el-option
              v-for="item in functionList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-button type="text" @click="formCardFunction.visible = !formCardFunction.visible">{{
            formCardFunction.visible ? '隐藏详情' : '显示详情'
          }}</el-button>
        </el-form-item>
        <form-card-function
          v-show="formCardFunction.visible"
          :data="formCardFunction.data"
          :disabled="true"
          :default-margin="false"
        />
      </div>
      <div class="plan__dialog--block">
        <p class="plan__dialog--block-title">报价</p>
        <table-offer
          ref="tableOffer"
          :is-uni-pirce="isUniPirce"
          :is-on="form.isOn"
          :offer-price-table="tableOffer.offerPriceTable"
          :is-offer-setting="isOfferSetting"
          :data="data"
          :plan-list-clone="planListClone"
          :offer-type="isPlan ? 'plan' : 'notPlan'"
          :status-disabled="form.disabled || form.disableOnStatus"
          @onOfferPriceTableChanged="onOfferPriceTableChanged"
        />
      </div>
      <div
        v-if="form.offerType === 'monthly' || form.offerType === 'custom'"
        class="plan__dialog--block"
      >
        <p class="plan__dialog--block-title">材质/规格</p>
        <table-offer-price-material
          ref="tableOfferPriceMaterial"
          :is-uni-pirce="isUniPirce"
          :is-unique="isUnique"
          :offer-price-id-list="tableOffer.offerPriceIdList"
          :data="tableOfferPriceMaterial.data"
        />
      </div>
      <div v-if="!isUnique" class="plan__dialog--plan-satus">
        <span style="line-height: 35px; position: relative; left: 56px">套餐状态</span>
        <el-form-item label="上下架" prop="isOn">
          <el-switch
            v-model="form.isOn"
            active-text="上架"
            inactive-text="下架"
            :active-value="true"
            :inactive-value="false"
            :disabled="form.disabled || form.disableOnStatus"
            @change="onIsOnChanged"
          />
        </el-form-item>
        <el-form-item label="API续费次数" prop="apiRechargeCountLimit">
          <el-input-number v-model="form.apiRechargeCountLimit" :controls="false" />
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import getVolumeAndUnitArr from '@/global/function/getVolumeAndUnitArr'
import FormRenew from '../../finance-price-renew/components/FormRenew.vue'
import FormCardFunction from '../../finance-price-function/components/FormCardFunction.vue'
import TableOffer from './TableOffer.vue'
import TableOfferPriceMaterial from './TableOfferPriceMaterial.vue'
import { mapActions, mapGetters } from 'vuex'
import whVolumeSelect from '@/page/components/wh-volume-select.vue'
import { offerType, periodDefinition, periodEndTag } from '@/constant/options/planOffer'
import apis from '@/api/ajax'

function getMaterialParams(materialPriceData, priceOffer) {
  const materialParams = {
    cardFee: -1,
    pasterCardFee: -1,
    ceramicCardFee: -1,
    pasterCeramicCardFee: -1,
    epoxyCardFee: -1,
    vehicleCardFee: -1
  }
  materialPriceData.forEach((e) => {
    if (e.status && e.validOfferPrice.includes(priceOffer)) {
      if (e.material === 'plasticStick') {
        materialParams.pasterCardFee = e.offerPrice
      }
      if (e.material === 'plasticPlug') {
        materialParams.cardFee = e.offerPrice
      }
      if (e.material === 'ceramicsPlug') {
        materialParams.ceramicCardFee = e.offerPrice
      }
      if (e.material === 'ceramicsStick') {
        materialParams.pasterCeramicCardFee = e.offerPrice
      }
      if (e.material === 'epoxy') {
        materialParams.epoxyCardFee = e.offerPrice
      }
      if (e.material === 'vehicle') {
        materialParams.vehicleCardFee = e.offerPrice
      }
    }
  })
  return materialParams
}

function computeStatus(isPlan, rowStatus, formStatus) {
  rowStatus = rowStatus ? 'on' : 'off'
  formStatus = formStatus ? 'on' : 'off'
  return isPlan ? rowStatus : formStatus
}

function getVolumeAndUnit(volume, volumeUnit) {
  if (volumeUnit === 'M') {
    volumeUnit = 'MB'
  }
  if (volumeUnit === 'G') {
    volumeUnit = 'GB'
  }
  volumeUnit = volumeUnit ? volumeUnit : 'MB'
  if (volumeUnit === 'C' || volumeUnit === 'GB') {
    return volume + volumeUnit
  } else {
    if (volume && volume % 1024 === 0) {
      return volume / 1024 + 'GB'
    } else {
      return volume + volumeUnit
    }
  }
}
const TIME_START_DEF = [
  {
    label: '套餐生成时间',
    value: 1
  },
  {
    label: '上一个套餐结束时间',
    value: 2
  }
]
export default {
  components: {
    FormRenew,
    FormCardFunction,
    TableOffer,
    whVolumeSelect,
    TableOfferPriceMaterial
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
    // 是否是客户端报价设置
    isOfferSetting: {
      type: Boolean,
      default: false
    },
    // 是否只精确到当前id的套餐
    isUnique: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var packageVolumeValidator = (rule, value, callback) => {
      if (this.form.offerType === 'package') {
        let valid = true
        if (typeof value === 'string' || typeof value === 'number') {
          if (typeof parseFloat(value) !== 'number' || Number.isNaN(parseFloat(value))) {
            valid = false
          }
        } else {
          valid = false
        }
        if (!valid) {
          return callback(new Error('请输入数字类型的流量大小'))
        }
      }
      callback()
    }
    return {
      form: {
        operator: '',
        cardFunctionId: '',
        isOn: false,
        renewId: '',
        disableOnStatus: false,
        disabled: false,
        volumeAndUnit: '',
        validity: '',
        allowBuyCard: false,
        offerType: 'monthly',
        packageVolume: 0, // 流量包、流量池包流量
        specialMark: false, // 流量包、流量池包允许续费
        packageVolumeUnit: 'MB', // 流量包、流量池包流量单位
        periodDefinition: 1,
        periodEndTag: 1,
        apiRechargeCountLimit: -1,
        unlimited: false,
        offerBeginType: 2,
        renewalTriggerCardActivation: false
      },
      planList: [],
      planListClone: [],
      formRenew: {
        data: {},
        visible: false
      },
      formCardFunction: {
        data: {},
        visible: false
      },
      tableOffer: {
        offerPriceIdList: [],
        offerPriceTable: []
      },
      tableOfferPriceMaterial: {
        data: []
      },
      functionList: [],
      volumeList: [],
      labelWidth: '120px',
      options: {
        offerType,
        periodDefinition,
        periodEndTag,
        TIME_START_DEF
      },
      rules: {
        offerType: [
          {
            required: true,
            message: '请选择报价类型',
            trigger: 'blur'
          }
        ],
        packageVolume: [
          {
            validator: packageVolumeValidator,
            trigger: 'blur'
          }
        ],
        operator: [{ required: true, message: '请选择运营商', trigger: 'blur' }],
        volumeAndUnit: [{ required: true, message: '请选择规格', trigger: 'blur' }],
        validity: [{ required: true, message: '请选择周期', trigger: 'blur' }],
        renewId: [{ required: true, message: '请选择续费分类', trigger: 'blur' }],
        cardFunctionId: [{ required: true, message: '请选择卡功能分类', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters({
      renewList: 'getAvalableRenewList'
    }),
    isUniPirce() {
      return (
        `${this.$route.query.isMonitorIndustryChannels}` === 'true' &&
        this.formCardFunction.data.industryStandardPricing
      )
    },
    orgId() {
      return this.$route.query.orgId
    },
    // 是否是套餐
    isPlan() {
      return this.form.offerType === 'custom' || this.form.offerType === 'monthly'
    },
    isEdit() {
      return !!this.data.id
    },
    filteredVolumeList() {
      const filtered = []
      this.volumeList.forEach((item) => {
        const volume = item.volume + item.volumeUnit
        if (!filtered.includes(volume)) {
          filtered.push(volume)
        }
      })
      return filtered
    },
    filteredValidityList() {
      const filtered = []
      if (!this.form.volumeAndUnit) {
        return []
      }
      this.volumeList.forEach((item) => {
        const volume = item.volume + item.volumeUnit
        if (volume === this.form.volumeAndUnit) {
          if (!filtered.includes(item.validity)) {
            filtered.push(item.validity)
          }
        }
      })
      return filtered
    }
  },
  watch: {
    async visible(v) {
      if (v) {
        if (this.data.id) {
          await this.getPlanInfo(this.data.id)
          this.generateFormData()
        } else {
          this.tableOffer.offerPriceTable = [
            {
              id: 0
            }
          ]
        }
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    ...mapActions(['getPlanRenewClassificationList']),
    onOfferTypeChange() {
      this.form.volumeAndUnit = ''
      this.form.validity = ''
    },
    onPeriodDefinition(v) {
      if (v !== 1) {
        this.form.periodEndTag = 2
      }
    },
    onIsOnChanged(v) {
      if (this.$refs.tableOffer) {
        this.$refs.tableOffer.onGlobalIsOnToggled(v)
      }
    },
    // data数据转换成表单数据
    generateFormData() {
      console.log('🎸 DEBUG_490 DialogEditPriceOffer.vue 👉', this.data)
      this.form.specialMark = this.data.allowRecharge
      this.form.packageVolume = this.data.volume
      this.form.packageVolumeUnit = this.data.useCountAsVolume ? 'C' : 'MB'
      this.form.offerType = this.data.offerType
      // const planList = this.planList
      this.form.operator = this.data.operator
      this.form.renewId = this.data.categoryId
      this.form.periodDefinition = this.data.periodDefinition
      this.form.periodEndTag = this.data.periodEndTag
      this.form.unlimited = this.data.unlimited
      if (this.data.periodOver && this.data.usageOver) {
        this.form.periodEndTag = 1
      } else {
        this.form.periodEndTag = 2
      }
      this.setRenewData(this.form.renewId)
      this.form.cardFunctionId = this.data.fnCategoryId === 0 ? undefined : this.data.fnCategoryId
      this.setCardFunctionData(this.form.cardFunctionId)
      this.$nextTick(() => {
        this.form.volumeAndUnit = getVolumeAndUnit(
          this.data.volume,
          this.data.useCountAsVolume ? 'C' : 'MB'
        )
        this.$nextTick(() => {
          this.form.validity = this.data.validity
          this.form.offerBeginType = this.data.offerGenerationTime ? 1 : 2
          this.form.renewalTriggerCardActivation = this.data.renewalTriggerCardActivation || false
        })
      })
      this.tableOffer.offerPriceIdList = this.planList.map((e, index) => index + 1)
      this.form.apiRechargeCountLimit =
        this.planList && this.planList.length ? this.planList[0].apiRechargeCountLimit : -1
      const offerPriceTable = this.planList.map((e) => {
        let conditions = []
        if (e.conditions) {
          try {
            conditions = JSON.parse(e.conditions)
          } catch {
            conditions = []
          }
        }
        if (!conditions.length) {
          conditions = [
            {
              price: e.sysPrice,
              commission: 0,
              condition: {
                dateStart: '2000-01-01 00:00:00',
                dateEnd: '2999-12-31 23:59:59'
              }
            }
          ]
        }
        return {
          id: e.id,
          minActivateTime: e.minDeadline,
          maxActivateTime: e.deadline,
          orderInterval: e.rechargeUnit,
          orderSpanFrom: e.minPurchaseLimit,
          orderSpanTo: e.maxPurchaseLimit,
          officialPrice: e.officalPrice,
          platformPrice: e.sysPrice, // 系统报价取price；客户报价取sysPrice
          platformDiscount: 10,
          saleBottomPrice: e.bottomPrice,
          saleBottomDiscount: 10,
          saleRenewPrice: e.rechargeBottomPrice,
          saleRenewPriceDiscount: 10,
          isOn: e.status === 'on',
          bottomPrice: e.bottomPrice,
          commission: e.commission,
          price: typeof e.salePrice === 'number' ? e.salePrice : e.price, // 购卡价格
          buyCountStep: e.buyCountStep,
          minBuyCount: e.minBuyCount,
          buyCountStepSystem: e.buyCountStepSystem,
          minBuyCountSystem: e.minBuyCountSystem,
          conditions
        }
      })
      this.tableOffer.offerPriceTable = offerPriceTable
      this.tableOfferPriceMaterial.data = this.generateMaterialTable()
      this.form.disableOnStatus = JSON.parse(this.data.disableOnStatus)
      this.form.disabled = JSON.parse(this.data.disabled)
      this.form.isOn = JSON.parse(this.data.status)
      this.form.allowBuyCard = JSON.parse(this.data.allowBuyCard)
    },
    // 生成材质规格表格数据
    generateMaterialTable() {
      const plasticPlugSize = []
      const plasticStickSize = []
      const ceramicsPlugSize = []
      const ceramicsStickSize = []
      let epoxySize = []
      let vehicleSize = []
      const sizeMap = {
        STANDARD: 1,
        MICRO: 2,
        NANO: 3,
        MS_5X5: 4,
        MS_5X6: 5,
        MS_2X2: 6
      }
      ;(({
        standard,
        micro,
        nono,
        plasticPaster5x6,
        plasticPaster2x2,
        ceramicStandard,
        ceramicMicro,
        ceramicNono,
        ceramicPaster5x6,
        ceramicPaster2x2,
        epoxyCardSpecs,
        vehicleCardSpecs
      }) => {
        standard && plasticPlugSize.push(1)
        micro && plasticPlugSize.push(2)
        nono && plasticPlugSize.push(3)
        plasticPaster5x6 && plasticStickSize.push(5)
        plasticPaster2x2 && plasticStickSize.push(6)
        ceramicStandard && ceramicsPlugSize.push(1)
        ceramicMicro && ceramicsPlugSize.push(2)
        ceramicNono && ceramicsPlugSize.push(3)
        ceramicPaster5x6 && ceramicsStickSize.push(5)
        ceramicPaster2x2 && ceramicsStickSize.push(6)
        epoxySize = Object.keys(sizeMap)
          .filter((item) => epoxyCardSpecs.indexOf(item) > -1)
          .map((item) => sizeMap[item])
        vehicleSize = Object.keys(sizeMap)
          .filter((item) => vehicleCardSpecs.indexOf(item) > -1)
          .map((item) => sizeMap[item])
      })(this.planList[0])

      const materialTable = []
      const cardFeeList = this.planList.map((e) => e.cardFee)
      const pasterCardFeeList = this.planList.map((e) => e.pasterCardFee)
      const ceramicCardFeeList = this.planList.map((e) => e.ceramicCardFee)
      const pasterCeramicCardFeeList = this.planList.map((e) => e.pasterCeramicCardFee)
      const epoxyCardFeeList = this.planList.map((e) => e.epoxyCardFee)
      const vehicleCardFeeList = this.planList.map((e) => e.vehicleCardFee)
      generateMaterialObj(cardFeeList, 'plasticPlug')
      generateMaterialObj(pasterCardFeeList, 'plasticStick')
      generateMaterialObj(ceramicCardFeeList, 'ceramicsPlug')
      generateMaterialObj(pasterCeramicCardFeeList, 'ceramicsStick')
      generateMaterialObj(epoxyCardFeeList, 'epoxy')
      generateMaterialObj(vehicleCardFeeList, 'vehicle')
      function generateMaterialObj(data, type) {
        for (let i = 0; i < data.length; i++) {
          if (data[i] >= 0) {
            for (let j = -1; j < materialTable.length; j++) {
              if (
                materialTable[j] &&
                materialTable[j].material === type &&
                materialTable[j].offerPrice === data[i]
              ) {
                materialTable[j].validOfferPrice.push(i + 1)
                break
              } else {
                if (j === materialTable.length - 1) {
                  switch (type) {
                    case 'plasticPlug':
                      materialTable.push({
                        id: 1,
                        offerPrice: data[i],
                        material: type,
                        status: true,
                        validOfferPrice: [i + 1],
                        size: plasticPlugSize
                      })
                      break
                    case 'plasticStick':
                      materialTable.push({
                        id: 2,
                        offerPrice: data[i],
                        material: type,
                        status: true,
                        validOfferPrice: [i + 1],
                        size: plasticStickSize
                      })
                      break
                    case 'ceramicsPlug':
                      materialTable.push({
                        id: 3,
                        offerPrice: data[i],
                        material: type,
                        status: true,
                        validOfferPrice: [i + 1],
                        size: ceramicsPlugSize
                      })
                      break
                    case 'ceramicsStick':
                      materialTable.push({
                        id: 4,
                        offerPrice: data[i],
                        material: type,
                        status: true,
                        validOfferPrice: [i + 1],
                        size: ceramicsStickSize
                      })
                      break
                    case 'epoxy':
                      materialTable.push({
                        id: 4,
                        offerPrice: data[i],
                        material: type,
                        status: true,
                        validOfferPrice: [i + 1],
                        size: epoxySize
                      })
                      break
                    case 'vehicle':
                      materialTable.push({
                        id: 4,
                        offerPrice: data[i],
                        material: type,
                        status: true,
                        validOfferPrice: [i + 1],
                        size: vehicleSize
                      })
                      break
                  }
                  break
                }
              }
            }
          }
        }
      }
      return materialTable
    },
    onOfferPriceTableChanged($event) {
      this.tableOffer.offerPriceIdList = $event
    },
    // 重置页面数据
    resetData() {
      this.$refs.form.resetFields()
      this.formRenew.data = {}
      this.formCardFunction.data = {}
      this.tableOfferPriceMaterial.data = []
      if (this.$refs.tableOffer) {
        this.$refs.tableOffer.resetTable()
      }
      if (this.$refs.tableOfferPriceMaterial) {
        this.$refs.tableOfferPriceMaterial.resetTable()
      }
    },
    closeDialog() {
      this.resetData()
      this.$emit('update:visible', false)
    },
    onOperatorChange(operator) {
      const carrier = this.enums.carrier.ordinal2key(operator)
      this.form.renewId = ''
      this.formRenew.data = {}
      this.getRenewList(carrier)
      this.getVolumeList(carrier)
    },
    setCardFunctionData(id) {
      for (let i = 0; i < this.functionList.length; i++) {
        if (this.functionList[i].id === id) {
          this.formCardFunction.data = Object.assign(
            {},
            this.formCardFunction.data,
            this.functionList[i]
          )
        }
      }
    },
    computeVolume() {
      if (this.form.offerType === 'pool-package') {
        return 1024
      } else {
        let volumeAndUnitArr = [0, 'MB']
        if (this.isPlan) {
          volumeAndUnitArr = getVolumeAndUnitArr(this.form.volumeAndUnit)
        }
        return this.isPlan
          ? volumeAndUnitArr.length
            ? parseInt(volumeAndUnitArr[0])
            : 0
          : this.form.packageVolumeUnit === 'MB'
          ? parseInt(this.form.packageVolume)
          : parseInt(this.form.packageVolume) * 1024
      }
    },
    // 验证所有表单数据
    validate() {
      if (this.form.offerType === 'monthly') {
        this.form.validity = 1
      }
      return this.$refs.tableOffer.validate()
    },
    getPromiseList(offerTableList) {
      const price = offerTableList[0].price
      return offerTableList
        .filter((e) => {
          let valid = true
          if (e.conditions && e.conditions.length) {
            // 如果续费条件只有一个，且为默认值，则不需要保存
            if (e.conditions.length === 1 && !e.conditions[0].id) {
              const condition = e.conditions[0]
              if (this.isPlan) {
                if (condition.price === e.sysPrice && condition.commission === 0) {
                  valid = false
                }
              } else {
                if (condition.price === e.price && condition.commission === 0) {
                  valid = false
                }
              }
            }
          } else {
            valid = false
          }
          return valid
        })
        .map((e) => {
          const conditions = e.conditions
          const params = {
            orgId: JSON.parse(this.orgId),
            sysOfferId: e.id,
            conditions: conditions.map((item) => {
              const condition = {
                price: this.isPlan ? item.price : price,
                commission: item.commission,
                dateStart: item.condition.dateStart,
                dateEnd: item.condition.dateEnd
              }
              if (item.id) {
                condition.id = item.id
              }
              return condition
            })
          }
          return apis.customer.updateCustomConditionPrice(params)
        })
    },
    isStepTimes(custom, system) {
      return custom > 0 && custom >= system && custom % system === 0
    },
    async onSubmit() {
      const valid = this.validate()
      if (valid) {
        this.$confirm(`确定保存吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const offerTableDataList = this.$refs.tableOffer.getTableData()
          for (let i = 0; i < offerTableDataList.length; i++) {
            const offerTableDataListItem = offerTableDataList[i]
            // const { buyCountStep, buyCountStepSystem, minBuyCount, minBuyCountSystem } =
            //   offerTableDataListItem
            const {
              buyCountStep,
              buyCountStepSystem = 1,
              minBuyCount,
              minBuyCountSystem = 1
            } = offerTableDataListItem
            if (!this.isStepTimes(minBuyCount, minBuyCountSystem)) {
              this.$message.error(
                `报价【第${
                  i + 1
                }条】的【起订量】必须为（${minBuyCountSystem}）的整数倍，且大于等于（${minBuyCountSystem}）`
              )
              return
            }
            if (!this.isStepTimes(buyCountStep, buyCountStepSystem)) {
              this.$message.error(
                `报价【第${
                  i + 1
                }条】的【步长】必须为（${buyCountStepSystem}）的整数倍，且大于等于（${buyCountStepSystem}）`
              )
              return
            }
          }
          // 保存续费条件
          const promiseList = this.getPromiseList(offerTableDataList)
          if (promiseList.length) {
            Promise.all(promiseList)
              .then(() => {
                this.$message.success('设置续费条件成功！')
              })
              .catch(() => {
                this.$message.error('设置续费条件失败！')
              })
          }
          // 保存其它套餐信息
          const materialPriceData = this.$refs.tableOfferPriceMaterial
            ? this.$refs.tableOfferPriceMaterial.getTableData()
            : []
          const list = offerTableDataList.map((e, index) => {
            const offerTableData = e
            const materialPriceParams = getMaterialParams(materialPriceData, index + 1)
            const params = {
              orgId: this.orgId,
              minBuyCount: offerTableData.minBuyCount,
              buyCountStep: offerTableData.buyCountStep,
              systemOfferId: offerTableData.id,
              status: computeStatus(this.isPlan, e.isOn, this.form.isOn),
              minPurchaseLimit: offerTableData.orderSpanFrom,
              maxPurchaseLimit: offerTableData.orderSpanTo,
              apiRechargeCountLimit: this.form.apiRechargeCountLimit,
              cardFee: materialPriceParams.cardFee,
              pasterCardFee: materialPriceParams.pasterCardFee,
              ceramicCardFee: materialPriceParams.ceramicCardFee,
              pasterCeramicCardFee: materialPriceParams.pasterCeramicCardFee,
              epoxyCardFee: materialPriceParams.epoxyCardFee,
              vehicleCardFee: materialPriceParams.vehicleCardFee,
              salePrice: offerTableData.price,
              saleCommission: offerTableData.commission
            }
            if (!this.isPlan) {
              params.minPurchaseLimit = 3
              params.maxPurchaseLimit = 12
            }
            return params
          })
          let rst = await this.jaxLib.customer.priceTable.save({
            list
          })
          if (!rst.success) {
            this.$message.error('销售报价属性设置失败！' + rst.message)
            return false
          }
          this.$message.success('销售报价属性设置成功！')
          this.$emit('onRefreshTable')
          this.closeDialog()
        })
      }
    },
    generatePeriodInfo() {
      let periodInfo = {
        periodDefinition: this.form.periodDefinition,
        periodEndTag: this.form.periodEndTag
      }
      if (this.form.offerType === 'custom') {
        if (periodInfo.periodEndTag === 1) {
          periodInfo.periodOver = true
          periodInfo.usageOver = true
        } else if (periodInfo.periodEndTag === 2) {
          periodInfo.periodOver = true
          periodInfo.usageOver = false
        }
      } else if (this.form.offerType === 'package') {
        periodInfo.periodOver = true
        periodInfo.usageOver = true
        periodInfo.periodDefinition = 2
      } else if (this.form.offerType === 'pool-package') {
        if (!this.isEdit) delete periodInfo.periodDefinition
      } else {
        delete periodInfo.periodDefinition
      }
      delete periodInfo.periodEndTag
      return periodInfo
    },
    onVolumeAndUnitChange() {
      this.form.validity = undefined
    },
    async getRenewList(carrier = '') {
      const params = {
        carrier
      }
      this.getPlanRenewClassificationList(params)
    },
    async getVolumeList(carrier) {
      const params = {}
      if (carrier) {
        params.carrier = carrier
      }
      const rst = await this.jaxLib.financial.volume.getVolumeList(params)
      this.volumeList = rst.data
    },
    async getData() {
      this.getPlanRenewClassificationList()
      this.getFunctionList()
      this.getVolumeList()
    },
    setRenewData(v) {
      for (let i = 0; i < this.renewList.length; i++) {
        if (this.renewList[i].id === v) {
          this.formRenew.data = Object.assign({}, this.formRenew.data, this.renewList[i])
        }
      }
    },
    async getFunctionList() {
      let rst = await this.jaxLib.financial.function.getFunctionList()
      this.functionList = rst.data
    },
    async getPlanInfo(id) {
      let rst = await this.jaxLib.financial.plan.getCustom({
        orgId: this.orgId,
        id
      })
      let data = rst.data

      if (this.isUnique) {
        data = data.filter((item) => item.id === id)
      }
      this.planListClone = JSON.parse(JSON.stringify(data))
      this.planList = data
    }
  }
}
</script>

<style lang="scss">
.plan__dialog--plan-satus {
  .el-form-item__content {
    vertical-align: unset !important;
  }
}
</style>
