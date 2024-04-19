/** * 报价管理 => 套餐列表 => 新增or编辑套餐 * @ author: szy * @ date: 2022/3/1 15:03 */
<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
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
            :disabled="isOfferSetting || isEdit"
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
            :disabled="isOfferSetting || isEdit"
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
              :disabled="isOfferSetting || isEdit"
              :show-times-options="form.offerType !== 'monthly'"
              :carrier="enums.carrier.ordinal2key(form.operator)"
            />
          </el-form-item>
          <el-form-item v-if="!isOfferSetting" label="套餐周期" prop="validity">
            <wh-validity-select
              v-show="form.offerType !== 'monthly'"
              v-model="form.validity"
              :volume-list="volumeList"
              :offer-type="form.offerType"
              :volume-and-unit="form.volumeAndUnit"
              :disabled="isEdit"
            />
            <span v-show="form.offerType === 'monthly'">1个月</span>
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
              <el-option label="次" value="C" />
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
            :disabled="isOfferSetting || isEdit"
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
            v-show="isOfferSetting && (form.offerType === 'monthly' || form.offerType === 'custom')"
            type="text"
            @click="formRenew.visible = !formRenew.visible"
            >{{ formRenew.visible ? '隐藏详情' : '显示详情' }}</el-button
          >
        </el-form-item>
        <form-renew
          v-show="
            (!isOfferSetting || formRenew.visible) &&
            (form.offerType === 'monthly' || form.offerType === 'custom')
          "
          :data="formRenew.data"
          :disabled="true"
          :default-margin="false"
        />
        <el-form-item v-show="form.offerType === 'package'" label="特殊标记" prop="specialMark">
          <el-checkbox v-model="form.specialMark" :disabled="isOfferSetting">允许续费</el-checkbox>
        </el-form-item>
      </div>
      <div
        v-if="form.offerType === 'monthly' || form.offerType === 'custom'"
        class="plan__dialog--block"
      >
        <el-form-item label="卡功能分类" prop="cardFunctionId">
          <el-select
            v-model="form.cardFunctionId"
            :disabled="isOfferSetting"
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
          <el-button
            v-show="isOfferSetting"
            type="text"
            @click="formCardFunction.visible = !formCardFunction.visible"
            >{{ formCardFunction.visible ? '隐藏详情' : '显示详情' }}</el-button
          >
        </el-form-item>
        <form-card-function
          v-show="!isOfferSetting || formCardFunction.visible"
          :data="formCardFunction.data"
          :disabled="true"
          :default-margin="false"
        />
      </div>
      <div class="plan__dialog--block">
        <p class="plan__dialog--block-title">报价</p>
        <table-offer
          ref="tableOffer"
          :is-on="form.isOn"
          :offer-price-table="tableOffer.offerPriceTable"
          :is-offer-setting="isOfferSetting"
          :data="data"
          :plan-list-clone="planListClone"
          :offer-type="isPlan ? 'plan' : 'notPlan'"
          :status-disabled="form.disabled || (isOfferSetting && form.disableOnStatus)"
          @onOfferPriceTableChanged="onOfferPriceTableChanged"
        />
      </div>
      <div
        v-if="form.offerType === 'monthly' || form.offerType === 'custom'"
        class="plan__dialog--block"
      >
        <p class="plan__dialog--block-title">材质/规格</p>
        <table-material
          v-if="!isOfferSetting"
          ref="tableMaterial"
          :offer-price-id-list="tableOffer.offerPriceIdList"
          :is-offer-setting="isOfferSetting"
          :data="tableMaterial.data"
        />
        <table-offer-price-material
          v-else
          ref="tableOfferPriceMaterial"
          :offer-price-id-list="tableOffer.offerPriceIdList"
          :data="tableMaterial.data"
        />
      </div>
      <div class="plan__dialog--plan-satus">
        <span style="line-height: 35px; position: relative; left: 56px">套餐状态</span>
        <el-form-item label="上下架" prop="isOn">
          <el-switch
            v-model="form.isOn"
            active-text="上架"
            inactive-text="下架"
            :active-value="true"
            :inactive-value="false"
            :disabled="form.disabled || (isOfferSetting && form.disableOnStatus)"
            @change="onIsOnChanged"
          />
        </el-form-item>
        <template v-if="!isOfferSetting">
          <el-form-item label="允许购买" prop="allowBuyCard">
            <el-switch
              v-model="form.allowBuyCard"
              active-text="是"
              inactive-text="否"
              :active-value="true"
              :inactive-value="false"
            />
          </el-form-item>
          <el-form-item label="是否禁止上架" prop="disableOnStatus">
            <el-switch
              v-model="form.disableOnStatus"
              active-text="是"
              inactive-text="否"
              :active-value="true"
              :disabled="form.disabled"
              :inactive-value="false"
            />
          </el-form-item>
          <el-form-item label="是否禁用" prop="disabled">
            <el-switch
              v-model="form.disabled"
              active-text="是"
              inactive-text="否"
              :active-value="true"
              :inactive-value="false"
            />
          </el-form-item>
          <el-form-item label="是否隐藏" prop="hide">
            <el-switch
              v-model="form.hide"
              active-text="是"
              inactive-text="否"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </template>
        <template v-if="isOfferSetting">
          <el-form-item label="API续费次数" prop="apiRechargeCountLimit">
            <el-input-number v-model="form.apiRechargeCountLimit" :controls="false" />
          </el-form-item>
        </template>
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
import TableMaterial from './TableMaterial.vue'
import TableOfferPriceMaterial from './TableOfferPriceMaterial.vue'
import { mapActions, mapGetters } from 'vuex'
import whVolumeSelect from '@/page/components/wh-volume-select.vue'
import whValiditySelect from '@/page/components/wh-validity-select.vue'
import { offerType, periodDefinition, periodEndTag } from '@/constant/options/planOffer'
import apis from '@/api/ajax'

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

function getMaterialParams(materialPriceData) {
  const materialParams = {
    cardFee: -1,
    pasterCardFee: -1,
    ceramicCardFee: -1,
    pasterCeramicCardFee: -1
  }
  materialPriceData.forEach((e) => {
    if (e.material === 'plasticStick' && e.status) {
      materialParams.pasterCardFee = e.offerPrice
    }
    if (e.material === 'plasticPlug' && e.status) {
      materialParams.cardFee = e.offerPrice
    }
    if (e.material === 'ceramicsPlug' && e.status) {
      materialParams.ceramicCardFee = e.offerPrice
    }
    if (e.material === 'ceramicsStick' && e.status) {
      materialParams.pasterCeramicCardFee = e.offerPrice
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

function generateMaterialData(materialTable, offerId, getDefaultParams) {
  const materialParams = {
    cardType: 'PRODUCTION',
    ceramicPaster2x2: false,
    plasticPaster2x2: false,
    cardFee: -1,
    pasterCardFee: -1,
    plasticPaster5x6: false,
    materialSpecificationForPaster: '',
    materialSpecification: '',
    ceramicCardFee: -1,
    pasterCeramicCardFee: -1,
    ceramicPaster5x6: false,
    materialSpecificationForCeramicPaster: '',
    epoxyCardFee: -1,
    vehicleCardFee: -1,
    epoxyCardSpecs: [],
    vehicleCardSpecs: []
  }
  if (getDefaultParams) {
    return materialParams
  }
  const validMaterial = materialTable.filter((e) => e.validOfferPrice.includes(offerId))
  const specsPositionMap = {
    1: 'STANDARD',
    2: 'MICRO',
    3: 'NANO',
    4: 'MS_5X5',
    5: 'MS_5X6',
    6: 'MS_2X2'
  }
  validMaterial.forEach((m) => {
    switch (m.material) {
      // 塑料贴片卡
      case 'plasticStick':
        materialParams.pasterCardFee = m.status ? m.offerPrice : -1
        materialParams.plasticPaster5x6 = false
        materialParams.materialSpecificationForPaster = m.size
          .map((item) => specsPositionMap[item])
          .join(',')
          .replace('MS_2X2', 'PLASTIC_PASTER_2x2')
          .replace('MS_5X6', 'PLASTIC_PASTER_5x6')
        break
      // 塑料插拔卡
      case 'plasticPlug':
        materialParams.cardFee = m.status ? m.offerPrice : -1
        materialParams.plasticPaster5x6 = false
        materialParams.materialSpecification = m.size
          .map((item) => specsPositionMap[item])
          .join(',')
        break
      // 陶瓷插拔卡
      case 'ceramicsPlug':
        materialParams.ceramicCardFee = m.status ? m.offerPrice : -1
        materialParams.materialSpecificationForCeramic = m.size
          .map((item) => specsPositionMap[item])
          .join(',')
        break
      // 陶瓷贴片卡
      case 'ceramicsStick':
        materialParams.pasterCeramicCardFee = m.status ? m.offerPrice : -1
        materialParams.ceramicPaster5x6 = m.size.includes(4)
        materialParams.materialSpecificationForCeramicPaster = m.size
          .map((item) => specsPositionMap[item])
          .join(',')
          .replace('MS_2X2', 'CERAMIC_PASTER_2x2')
          .replace('MS_5X6', 'CERAMIC_PASTER_5x6')
        break
      // 环氧树脂
      case 'epoxy':
        materialParams.epoxyCardFee = m.status ? m.offerPrice : -1
        materialParams.epoxyCardSpecs = m.size.map((item) => specsPositionMap[item])
        break
      case 'vehicle':
        materialParams.vehicleCardFee = m.status ? m.offerPrice : -1
        materialParams.vehicleCardSpecs = m.size.map((item) => specsPositionMap[item])
    }
  })
  return materialParams
}

export default {
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
    }
  },
  data() {
    const packageVolumeValidator = (rule, value, callback) => {
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
        hide: 0,
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
        renewalTriggerCardActivation: false,
        offerBeginType: 2,
        unlimited: false
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
      tableMaterial: {
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
      this.form.specialMark = this.data.allowRecharge
      this.form.packageVolume = this.data.volume
      this.form.packageVolumeUnit = this.data.useCountAsVolume ? 'C' : 'MB'
      this.form.offerType = this.data.offerType
      const planList = this.planList
      this.form.operator = this.data.operator
      this.form.renewId = this.data.categoryId
      this.form.periodDefinition = this.data.periodDefinition
      this.form.periodEndTag = this.data.periodEndTag
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
          this.form.renewalTriggerCardActivation = this.data.renewalTriggerCardActivation || false
          this.form.unlimited = this.data.unlimited || false
          this.form.offerBeginType = this.data.offerGenerationTime ? 1 : 2
        })
      })
      this.tableOffer.offerPriceIdList = this.planList.map((e, index) => index + 1)
      if (this.isOfferSetting) {
        this.form.apiRechargeCountLimit =
          this.planList && this.planList.length ? this.planList[0].apiRechargeCountLimit : -1
      }
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
          platformPrice: this.isOfferSetting ? e.sysPrice : e.price, // 系统报价取price；客户报价取sysPrice
          platformDiscount: 10,
          saleBottomPrice: e.bottomPrice,
          saleBottomDiscount: 10,
          saleRenewPrice: e.rechargeBottomPrice,
          saleRenewPriceDiscount: 10,
          isOn: e.status === 'on',
          bottomPrice: e.bottomPrice,
          price: typeof e.salePrice === 'number' ? e.salePrice : e.price, // 购卡价格
          buyCountStep: e.buyCountStep,
          minBuyCount: e.minBuyCount,
          hide: e.hide,
          conditions
        }
      })
      let materialTable = generateMaterialTable(
        this.planList.length ? this.planList[0] : this.data,
        planList
      )
      materialTable = updateOfferPrice(materialTable, this.planList)
      function updateOfferPrice(materialTable, planList) {
        function updateMaterialPrice(material, price) {
          for (let i = 0; i < materialTable.length; i++) {
            if (materialTable[i].material === material) {
              materialTable[i].offerPrice = price
              break
            }
          }
        }
        for (let i = 0; i < planList.length; i++) {
          if (planList[i].cardFee > 0) {
            updateMaterialPrice('plasticPlug', planList[i].cardFee)
          }
          if (planList[i].pasterCardFee > 0) {
            updateMaterialPrice('plasticStick', planList[i].pasterCardFee)
          }
          if (planList[i].ceramicCardFee > 0) {
            updateMaterialPrice('ceramicsPlug', planList[i].ceramicCardFee)
          }
          if (planList[i].pasterCeramicCardFee > 0) {
            updateMaterialPrice('ceramicsStick', planList[i].pasterCeramicCardFee)
          }
          if (planList[i].epoxyCardFee > 0) {
            updateMaterialPrice('epoxy', planList[i].epoxyCardFee)
          }
          if (planList[i].vehicleCardFee > 0) {
            updateMaterialPrice('vehicle', planList[i].vehicleCardFee)
          }
        }
        return materialTable
      }
      this.tableOffer.offerPriceTable = offerPriceTable
      this.tableMaterial.data = materialTable
      this.form.disableOnStatus = JSON.parse(this.data.disableOnStatus)
      this.form.disabled = JSON.parse(this.data.disabled)
      this.form.hide = +this.data.hide || 0
      this.form.isOn = JSON.parse(this.data.status)
      this.form.allowBuyCard = JSON.parse(this.data.allowBuyCard)
      function generateMaterialTable(data, planList) {
        const arr = []
        const sizeMap = {
          STANDARD: 1,
          MICRO: 2,
          NANO: 3,
          MS_5X5: 4,
          MS_5X6: 5,
          MS_2X2: 6
        }
        // 塑料插拔卡
        arr.push({
          id: 0,
          material: 'plasticPlug',
          offerPrice: data.cardFee >= 0 ? data.cardFee : 0,
          status: planList.some((plan) => plan.cardFee >= 0),
          validOfferPrice: planList
            .map((plan, index) => index + 1)
            .filter((index) => planList[index - 1].cardFee >= 0),
          size: (({ standard, micro, nono }) => {
            const size = []
            standard && size.push(1)
            micro && size.push(2)
            nono && size.push(3)
            !size.length && size.push(1)
            return size
          })(data)
        })

        // 塑料贴片卡
        arr.push({
          id: 1,
          material: 'plasticStick',
          offerPrice: data.pasterCardFee >= 0 ? data.pasterCardFee : 0,
          status: planList.some((plan) => plan.pasterCardFee >= 0),
          validOfferPrice: planList
            .map((plan, index) => index + 1)
            .filter((index) => planList[index - 1].pasterCardFee >= 0),
          size: (({ plasticPaster5x6, plasticPaster2x2 }) => {
            const size = []
            plasticPaster5x6 && size.push(5)
            plasticPaster2x2 && size.push(6)
            !size.length && size.push(5)
            return size
          })(data)
        })
        // 陶瓷插拔卡
        arr.push({
          id: 2,
          material: 'ceramicsPlug',
          offerPrice: data.ceramicCardFee >= 0 ? data.ceramicCardFee : 0,
          status: planList.some((plan) => plan.ceramicCardFee >= 0),
          validOfferPrice: planList
            .map((plan, index) => index + 1)
            .filter((index) => planList[index - 1].ceramicCardFee >= 0),
          size: (({ ceramicStandard, ceramicMicro, ceramicNono }) => {
            const size = []
            ceramicStandard && size.push(1)
            ceramicMicro && size.push(2)
            ceramicNono && size.push(3)
            !size.length && size.push(1)
            return size
          })(data)
        })
        // 陶瓷贴片卡
        arr.push({
          id: 3,
          material: 'ceramicsStick',
          offerPrice: data.pasterCeramicCardFee >= 0 ? data.pasterCeramicCardFee : 0,
          status: planList.some((plan) => plan.pasterCeramicCardFee >= 0),
          validOfferPrice: planList
            .map((plan, index) => index + 1)
            .filter((index) => planList[index - 1].pasterCeramicCardFee >= 0),
          size: (({ ceramicPaster5x6, ceramicPaster2x2 }) => {
            const size = []
            ceramicPaster5x6 && size.push(5)
            ceramicPaster2x2 && size.push(6)
            !size.length && size.push(5)
            return size
          })(data)
        })
        // 环氧树脂
        arr.push({
          id: 3,
          material: 'epoxy',
          offerPrice: data.epoxyCardFee >= 0 ? data.epoxyCardFee : 0,
          status: planList.some((plan) => plan.epoxyCardFee >= 0),
          validOfferPrice: planList
            .map((plan, index) => index + 1)
            .filter((index) => planList[index - 1].epoxyCardFee >= 0),
          size: (() => {
            const size = Object.keys(sizeMap)
              .filter((item) => data.epoxyCardSpecs.indexOf(item) > -1)
              .map((item) => sizeMap[item])
            !size.length && size.push(1)
            return size
          })()
        })
        // 车规级
        arr.push({
          id: 3,
          material: 'vehicle',
          offerPrice: data.vehicleCardFee >= 0 ? data.vehicleCardFee : 0,
          status: planList.some((plan) => plan.vehicleCardFee >= 0),
          validOfferPrice: planList
            .map((plan, index) => index + 1)
            .filter((index) => planList[index - 1].vehicleCardFee >= 0),
          size: (() => {
            const size = Object.keys(sizeMap)
              .filter((item) => data.vehicleCardSpecs.indexOf(item) > -1)
              .map((item) => sizeMap[item])
            !size.length && size.push(1)
            return size
          })()
        })
        return arr
      }
    },
    onOfferPriceTableChanged($event) {
      this.tableOffer.offerPriceIdList = $event
    },
    // 重置页面数据
    resetData() {
      this.$refs.form.resetFields()
      this.form.renewalTriggerCardActivation = false
      this.form.unlimited = false
      this.form.offerBeginType = 2
      this.formRenew.data = {}
      this.formCardFunction.data = {}
      this.tableMaterial.data = []
      if (this.$refs.tableOffer) {
        this.$refs.tableOffer.resetTable()
      }
      if (this.$refs.tableMaterial) {
        this.$refs.tableMaterial.resetTable()
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
          : this.form.packageVolumeUnit === 'MB' || this.form.packageVolumeUnit === 'C'
          ? parseInt(this.form.packageVolume)
          : parseInt(this.form.packageVolume) * 1024
      }
    },
    // 验证所有表单数据
    validate() {
      if (this.form.offerType === 'monthly') {
        this.form.validity = 1
      }
      let result = true
      if (!this.isOfferSetting) {
        // 表单一
        this.$refs.form.validate((valid) => {
          result = valid
        })
        if (!result) {
          return false
        }
      }
      // 报价表格
      result = this.$refs.tableOffer.validate()
      if (!result) {
        return false
      }
      if (!this.isOfferSetting) {
        if (!result) {
          return false
        }
        // 材质表格
        if (this.form.offerType === 'monthly' || this.form.offerType === 'custom') {
          result = this.$refs.tableMaterial.validate()
          if (!result) {
            return false
          }
        }
      }
      return true
    },
    async getPromiseList(offerTableList) {
      const price = offerTableList[0].price
      const promiseList = offerTableList
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
      return promiseList
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
          if (this.isOfferSetting) {
            // 保存续费条件
            const promiseList = this.getPromiseList(offerTableDataList)
            if (promiseList.length) {
              try {
                await Promise.all(promiseList)
                this.$message.success('设置续费条件成功！')
              } catch {
                this.$message.error('设置续费条件失败！')
              }
            }
            // 保存其它套餐信息
            const materialPriceData = this.$refs.tableOfferPriceMaterial
              ? this.$refs.tableOfferPriceMaterial.getTableData()
              : []
            const materialPriceParams = getMaterialParams(materialPriceData)
            const list = offerTableDataList.map((e) => {
              const offerTableData = e
              const params = {
                orgId: this.orgId,
                minBuyCount: offerTableData.minBuyCount,
                buyCountStep: offerTableData.buyCountStep,
                systemOfferId: offerTableData.id,
                status: computeStatus(this.isPlan, e.isOn, this.form.isOn),
                minPurchaseLimit: offerTableData.orderSpanFrom,
                maxPurchaseLimit: offerTableData.orderSpanTo,
                apiRechargeCountLimit: this.form.apiRechargeCountLimit,
                renewalTriggerCardActivation: this.form.renewalTriggerCardActivation,
                unlimited: this.form.unlimited,
                offerBeginType: this.form.offerBeginType,
                cardFee: materialPriceParams.cardFee,
                pasterCardFee: materialPriceParams.pasterCardFee,
                ceramicCardFee: materialPriceParams.ceramicCardFee,
                pasterCeramicCardFee: materialPriceParams.pasterCeramicCardFee,
                salePrice: offerTableData.price
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
          } else {
            const formRenewData = this.formRenew.data
            const cardFunctionParams = {}
            if (this.isPlan) {
              cardFunctionParams.fnCategoryId = this.form.cardFunctionId // 卡功能分类Id
            }
            const materialPriceData = this.isPlan ? this.$refs.tableMaterial.getTableData() : {}
            const volumeAndUnitArr = this.isPlan
              ? getVolumeAndUnitArr(this.form.volumeAndUnit)
              : [this.form.packageVolume, this.form.packageVolumeUnit]
            const submitData = offerTableDataList.map((offer, index) => {
              const materialPriceParams = this.isPlan
                ? generateMaterialData(materialPriceData, index + 1)
                : generateMaterialData(undefined, undefined, true)
              const offerPriceParams = {
                minBuyCount: offer.minBuyCount,
                buyCountStep: offer.buyCountStep,
                minDeadline: offer.minActivateTime, // 激活宽限期开始期
                deadline: offer.maxActivateTime, // 激活宽限期终止期
                bottomPrice: offer.saleBottomPrice, // 底价
                minPurchaseLimit: offer.orderSpanFrom,
                maxPurchaseLimit: offer.orderSpanTo, // '最大订购限制'
                maxTestLimit: 1,
                minTestLimit: 3,
                officalPrice: offer.officialPrice,
                price: offer.platformPrice,
                rechargeUnit: offer.orderInterval, // 订购周期间隔
                status: computeStatus(this.isPlan, offer.isOn, this.form.isOn),
                rechargeBottomPrice: offer.saleRenewPrice
              }
              offerPriceParams.id = !offer.isNew ? offer.id : 0 //新增的id为0
              const volume = this.computeVolume()
              if (!this.isPlan) {
                offerPriceParams.allowRecharge = this.form.specialMark
                offerPriceParams.minPurchaseLimit = 3
                offerPriceParams.maxPurchaseLimit = 12
              }
              const periodInfo = this.generatePeriodInfo()
              return {
                validityUnit: 'M',
                ...cardFunctionParams,
                ...offerPriceParams,
                ...materialPriceParams,
                categoryId: formRenewData.id, // 续费分类id
                disableOnStatus: JSON.parse(this.form.disableOnStatus), // 是否禁止上下架
                disabled: this.form.disabled, // 是否禁用
                hide: this.form.hide, // 是否隐藏
                allowBuyCard: this.form.allowBuyCard, // 是否允许购买
                extendField: '{"carrierCode":""}', // 运营商套餐id {"carrierCode":"4"}
                offerType: this.form.offerType, // 按月套餐
                operator: this.form.operator, // 运营商类型 1
                validity: this.form.validity ? this.form.validity : 1, //
                sharePriceFactor: 1,
                volumeUnit: volumeAndUnitArr.length ? volumeAndUnitArr[1] : 'MB', //
                volume,
                renewalTriggerCardActivation: this.form.renewalTriggerCardActivation,
                unlimited: this.form.unlimited,
                offerBeginType: this.form.offerBeginType,
                useCountAsVolume: !!(volumeAndUnitArr[1] && volumeAndUnitArr[1] === 'C'),
                ...periodInfo
              }
            })
            const rst = await this.jaxLib.financial.plan.put({
              list: submitData
            })
            this.sureLoading = false
            if (!rst.success) {
              return false
            }
            this.$message.success(`${this.isCreate ? '新增' : '编辑'}报价成功, 赶快去推广套餐吧~`)
            this.$emit('onRefreshTable')
            this.closeDialog()
          }
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
      let rst
      if (this.isOfferSetting) {
        rst = await this.jaxLib.financial.plan.getCustom({
          orgId: this.orgId,
          id
        })
      } else {
        rst = await this.jaxLib.financial.plan.get({
          id
        })
      }
      this.planListClone = JSON.parse(JSON.stringify(rst.data))
      this.planList = rst.data
    }
  },
  computed: {
    ...mapGetters({
      renewList: 'getAvalableRenewList'
    }),
    orgId() {
      return this.$route.query.orgId
    },
    title() {
      if (!this.isOfferSetting) {
        return this.isEdit ? '编辑套餐' : '添加套餐'
      } else {
        return '报价设置'
      }
    },
    // 是否是套餐
    isPlan() {
      return this.form.offerType === 'custom' || this.form.offerType === 'monthly'
    },
    isEdit() {
      return !!this.data.id
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
              id: 0,
              minBuyCount: 1,
              buyCountStep: 1
            }
          ]
        }
      }
    }
  },
  created() {
    this.getData()
  },
  components: {
    FormRenew,
    FormCardFunction,
    TableOffer,
    TableMaterial,
    whVolumeSelect,
    whValiditySelect,
    TableOfferPriceMaterial
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
