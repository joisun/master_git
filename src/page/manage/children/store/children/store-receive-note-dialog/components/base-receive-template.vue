<script>
import WhVolumeInput from '@/page/components/wh-volume-input.vue'
import volumeFormat from '@/global/filters/volume-format'
import { PLAN_TYPE, METERIAL_NAME } from '../mixins/const'
import { iccidsTransfer } from '@/global/function/iccids-tool'
import reg from '@/constant/regexps'
import moment from 'moment'
import { pcData } from '@/constant/address'
import IccidRangeInput, { getAllIccidByRange } from '@/page/components/iccid-range-input'

// 需要保存到DB 和 回显的表单字段
const FORM_CONFIG_TO_RESTORE = {
  testingEndType: 'testingEndType', // 测试期结束方式
  type: 'ratePlanType', // 套餐类型
  testingType: 'hasTesting', // 是否有测试期
  testDataVolume: 'testDataVolume', // 测试期流量
  // testDeadline: 'testDeadline', // 测试期结束时间
  chargeCategoryId: 'chargeCategoryId', //入库套餐规格,需要返回套餐规格id(id)
  // activationDeadline: 'activationDeadLine', // 激活宽限期结束时间
  cardMaterialId: 'cardMaterialId', // 卡片材质，需要返回材质id (chargeEntryId)
  specification: 'cardSpecification', // 规格
  featureFee: 'featureFee', //  功能费(如果有则返回)
  tags: 'specialLimit', // 运营商特殊限， 特殊限制
  locationService: 'locationService', //  定位功能
  freeForFirstMonth: 'freeForFirstMonth', // 首月不计入套餐时间
  cardIssuer: 'cardIssuer',
  protocolStack: 'protocolStack',
  productionBatch: 'productionBatch'
}
const FORM_CONFIG_TO_STORE = {
  testingEndType: 'testingEndType', // 测试期结束方式
  type: 'ratePlanType', // 套餐类型
  testingType: 'hasTesting', // 是否有测试期
  testDataVolume: 'testDataVolume', // 测试期流量
  testDeadline: 'testDeadline', // 测试期结束时间
  chargeCategoryId: 'chargeCategoryId', //入库套餐规格,需要返回套餐规格id(id)
  activationDeadline: 'activationDeadLine', // 激活宽限期结束时间
  cardMaterialId: 'cardFeeChargeCategoryId', // 卡片材质
  specification: 'cardSpecification', // 规格
  featureFee: 'featureFee', // 功能费(如果有则返回)
  tags: 'specialLimit', // 运营商特殊限， 特殊限制
  locationService: 'locationService', // 定位功能
  freeForFirstMonth: 'freeForFirstMonth', // 首月不计入套餐时间
  openCardDate: 'openCardDate',
  cardIssuer: 'cardIssuer',
  protocolStack: 'protocolStack'
}
const FORM_SCHEME = {
  openCardDate: {
    show: true,
    disabled: false
  },
  freeForFirstMonth: {
    show: true,
    disabled: false
  },
  refCategory: {
    show: false,
    disabled: true
  },
  importBatchNo: {
    show: true,
    disabled: false
  },
  ICCID: {
    show: true,
    disabled: false
  },
  remark: {
    show: false
  }
}
const genDBKey = (carrier, carrierAccountId) => {
  return `stock-in-orders-${carrier}-${carrierAccountId}`
}
const diffDate = (date1, date2, unit = 'months') => {
  date1 = date1.time ? moment(date1.time) : moment(date1)
  date2 = date2.time ? date2.time : date2
  const result = date1.diff(date2, unit)
  if (unit === 'days') {
    return (result / 30).toFixed(0)
  } else {
    return result + 1
  }
}
export default {
  name: 'base-receive-template',
  components: {
    'wh-volume-input': WhVolumeInput,
    'iccid-range-input': IccidRangeInput
  },
  filters: {
    dateCalculator(v, diffDate, type) {
      return moment(v).diff(moment(diffDate), 'days')
    }
  },
  props: {
    formConfigToStore: {
      type: Object,
      require: false,
      default: () => FORM_CONFIG_TO_STORE
    },
    formConfigToRestore: {
      type: Object,
      require: false,
      default: () => FORM_CONFIG_TO_RESTORE
    },
    formScheme: {
      type: Object,
      require: false,
      default: () => FORM_SCHEME
    },
    disabled: {
      type: Boolean,
      default: false,
      require: false
    },
    needDb: {
      type: Boolean,
      default: true,
      require: false
    },
    title: {
      type: String,
      required: false,
      default: 'SIMBOSS 物联网卡入库单'
    },
    config: {
      required: true,
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      addressOptions: pcData,
      carrier: '',
      isNBIoTAccount: '',
      carrierAccountId: '',
      batchPrefix: '',
      carrierChargeId: '',
      carrierRealName: '',
      carrierType: '',
      DB: null,
      PLAN_TYPE,
      METERIAL_NAME,
      allTags: [],
      realTags: [],
      baseContent: {},
      fileList: [],
      fileData: '',
      loading: false,
      form: {
        refCategory: [],
        activationDeadlineMonths: '',
        openCardDate: new Date(),
        testDeadlineMonths: '',
        testingEndType: 'days',
        iccidBatchs: [
          {
            iccidStart: '',
            iccidEnd: '',
            count: 0
          }
        ],
        type: '',
        testingType: false,
        testDataVolume: '',
        testDeadline: '',
        chargeCategoryId: '',
        activationDeadline: '',
        cardMaterialId: '',
        specification: '',
        featureFee: false,
        categoryList: [],
        tags: [],
        importBatchNo: '',
        iccids: '',
        locationService: true,
        freeForFirstMonth: false
      },

      iccidPostWay: '1'
    }
  },
  computed: {
    formRules() {
      return {
        openCardDate: [{ required: true, message: '请选择开卡日期', trigger: 'change' }],
        type: [{ required: true, message: '请选择套餐类型', trigger: 'change' }],
        testDataVolume: [
          {
            validator: (rule, value, callback) =>
              this.form.testingType && !reg.volume.test(value)
                ? callback('请输入正确的测试期流量')
                : callback(),
            trigger: 'input'
          }
        ],
        testDeadline: [
          {
            validator: (rule, value, callback) =>
              this.form.testingType && !value ? callback('请输入测试期时长') : callback(),
            trigger: 'change'
          }
        ],
        chargeCategoryId: [
          {
            required: true,
            validator: (rule, value, callback) =>
              this.chooseType.showSpecification && !value ? callback('请选择套餐规则') : callback(),
            trigger: 'change'
          }
        ],
        activationDeadline: [
          {
            required: true,
            validator: (rule, value, callback) =>
              this.chooseType.showSpecification && !value
                ? callback('请输入激活宽限期时长')
                : callback(),
            trigger: 'change'
          }
        ],
        cardMaterialId: [
          {
            required: true,
            validator: (rule, value, callback) =>
              !value ? callback('请选择卡片材质') : callback(),
            trigger: 'blur'
          }
        ],
        specification: [{ required: true, message: '请选择卡片规格', trigger: 'change' }],
        importBatchNo: [
          this.computedFormSchema.importBatchNo.disabled
            ? {}
            : {
                required: true,
                validator: (rule, value, callback) => {
                  if (!this.batchPrefix) callback('当前运营商没有批次前缀，请添加运营商前缀')
                  if (this.batchPrefix && !value) callback('请填写批次号')
                  else callback()
                },
                trigger: 'blur'
              }
        ],
        iccids: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.iccidPostWay === '1' && !this.form.iccids) callback('请填写ICCID')
              if (this.iccidPostWay === '3' && !this.fileData) callback('请上传文件')
              else callback()
            },
            trigger: 'change'
          }
        ]
      }
    },
    computedFormSchema() {
      return {
        ...FORM_SCHEME,
        ...this.formScheme
      }
    },
    featureFeeExits() {
      let feature = this.baseContent.featureFeeList
      if (feature && feature.length) {
        return !!this.baseContent.featureFeeList.find((e) => e.chargeType === 'FEATURE_FEE')
      }
      return false
    },
    planClassificationList() {
      return this.$store.getters.getClassificationList(this.carrier)
    },
    locationFeeExits() {
      let feature = this.baseContent.featureFeeList
      if (feature && feature.length) {
        return !!this.baseContent.featureFeeList.find(
          (e) => e.chargeType === 'LBS_FEE_UNICOM' || e.chargeType === 'LBS_FEE'
        )
      }
      return false
    },
    datePickerOptions() {
      return {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      }
    },
    chooseType() {
      let offer = this.baseContent.offerTypeList
      if (offer && offer.length) {
        return this.baseContent.offerTypeList.find((e) => e.chargeType === this.form.type) || {}
      }
      return {}
    },

    selectedMaterial() {
      const material = (this.baseContent.materialList || []).find(
        (item) => item.chargeEntryId === this.form.cardMaterialId
      )
      if (!material) return null
      return material.chargeType
    }
  },
  async created() {
    this.needDb && this.createDb()

    await this.initData()
    await this.$store.dispatch('changeClassificationList')
    this.getCardTags().then()
    this.getRealTags()
  },
  methods: {
    onTestingTypeChange() {
      this.testDeadLineMonthChange(this.form.testDeadlineMonths)
      this.activationDeadLineMonthChange(this.form.activationDeadlineMonths)
    },
    onOpenCardChange() {
      this.testingEndTypeChange()
    },
    async restoreDbData() {
      if (!this.needDb) return {}
      const dbData = await this.DB.getItem(genDBKey(this.carrier, this.carrierAccountId))
      if (dbData) {
        this.$message.info('已自动填入上次该运营商账号下的入库单配置，请检查')
        const result = {}
        Object.keys(this.formConfigToRestore).forEach((key) => {
          result[key] = dbData[key] !== undefined ? dbData[key] : this.form[key]
        })
        return { restoreData: result, allData: dbData }
      }
      return { restoreData: {}, allData: {} }
    },
    calcDeadlineDays(data) {
      if (!data || Object.keys(data).length === 0) return
      const hasTesting = (data.testingType || data.hasTesting) && data.testDeadline
      if (hasTesting) {
        this.form.testDeadlineMonths = diffDate(
          data.testDeadline,
          data.openCardDate,
          data.testingEndType
        )
        this.testingEndTypeChange()
      }
      if (data.activationDeadLine || data.activationDeadline) {
        this.form.activationDeadlineMonths = diffDate(
          data.activationDeadLine || data.activationDeadline,
          hasTesting ? data.testDeadline : data.openCardDate,
          'months'
        )
        this.testingEndTypeChange()
      }
    },
    async initData() {
      ;[
        'carrier',
        'isNBIoTAccount',
        'carrierAccountId',
        'batchPrefix',
        'carrierChargeId',
        'carrierRealName',
        'carrierType'
      ].forEach((item) => {
        this[item] = this.config[item]
      })
      this.iccidPostWay = this.carrierType !== 'NO_API_ACCOUNT' ? '1' : '3'
      this.form.testingType = this.carrierType !== 'NO_API_ACCOUNT'
      await this.getCarrierConfig()
      let dbData = {}
      if (this.config.noDb) {
        Object.keys(this.formConfigToRestore).forEach((key) => {
          this.form[key] =
            this.config[this.formConfigToRestore[key]] !== undefined
              ? this.config[this.formConfigToRestore[key]]
              : this.form[key]
          this.specialFormValueSetting()
          this.calcDeadlineDays(this.config)
        })
      } else {
        const db = await this.restoreDbData()
        dbData = db.restoreData
        this.calcDeadlineDays(db.allData)
      }
      if (this.config.ossFileUrl) {
        this.fileData = this.config.ossFileUrl
        this.fileList = [
          {
            name: this.config.ossFileUrl.split('/')[1],
            status: 'success'
          }
        ]
        this.iccidPostWay = '3'
      }
      this.form = {
        ...this.form,
        ...dbData
      }
    },
    specialFormValueSetting() {
      if (this.config.specialLimit) {
        this.form.tags = this.config.specialLimit.split(',')
      }
      this.form.tags = this.form.tags.concat(
        this.config.carrierSpecialLimit ? this.config.carrierSpecialLimit.split(',') : []
      )
      this.form.type =
        (
          this.baseContent.offerTypeList.find(
            (item) => item.chargeEntryId === this.config.chargeEntryId
          ) || {}
        ).chargeType || this.config.ratePlanType
      // TODO 优化写法
      if (this.formConfigToRestore.openCardDate && this.config.openCardDate) {
        this.form.openCardDate = this.config.openCardDate.time
          ? moment(this.config.openCardDate.time)
          : moment(this.config.openCardDate)
      }
      if (this.formConfigToRestore.cardProductionDate && this.config.cardProductionDate) {
        this.form.cardProductionDate = this.config.cardProductionDate.time
          ? moment(this.config.cardProductionDate.time)
          : moment(this.config.cardProductionDate)
      }
      if (this.formConfigToRestore.city && this.config.city) {
        this.form.city = Array.isArray(this.config.city)
          ? this.config.city
          : this.config.city.split(',')
      }
      // TODO 写法优化
      if (this.formConfigToRestore.importBatchNo && this.config.batchNo) {
        this.form.importBatchNo = this.config.batchNo.replace(`${this.batchPrefix}-`, '')
      }
    },
    testingEndTypeChange() {
      this.testDeadLineMonthChange(this.form.testDeadlineMonths)
      this.activationDeadLineMonthChange(this.form.activationDeadlineMonths)
    },
    testDeadLineMonthChange(v) {
      if (this.form.testingEndType === 'months') {
        // 自然月直接取到月底
        this.form.testDeadline = moment(moment(this.form.openCardDate).endOf('month'))
          .add(v - 1, 'months')
          .endOf('month')
          .format('YYYY-MM-DD 23:59:59')
      } else {
        v = v * 30
        this.form.testDeadline = moment(this.form.openCardDate)
          .add(v, 'days')
          .format('YYYY-MM-DD 23:59:59')
      }
      this.activationDeadLineMonthChange(this.form.activationDeadlineMonths)
    },
    activationDeadLineMonthChange(v) {
      if (!this.form.activationDeadlineMonths) {
        this.form.activationDeadline = ''
        return
      }
      if (this.form.testDeadline && this.form.testingType) {
        const isEndOfMonth =
          moment(this.form.testDeadline).format('YYYYMMDD') ===
          moment(this.form.testDeadline).endOf('month').format('YYYYMMDD')
        this.form.activationDeadline = isEndOfMonth
          ? moment(this.form.testDeadline)
              .add(v, 'months')
              .endOf('month')
              .format('YYYY-MM-DD 23:59:59')
          : moment(this.form.testDeadline)
              .endOf('month')
              .add(v - 1, 'months')
              .endOf('months')
              .format('YYYY-MM-DD 23:59:59')
        return
      }
      this.form.activationDeadline = moment(this.form.openCardDate)
        .endOf('month')
        .add(v - 1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD 23:59:59')
    },
    onDatePickerChange() {},
    iccidRangeChange(data) {
      this.form.iccidBatchs = data
    },
    createDb() {
      this.DB = this.$vlf.createInstance({
        storeName: 'store-receive-note'
      })
    },
    specificationFormat(obj) {
      let format = volumeFormat
      let unit = () => '月'
      if (this.chooseType.chargeType === 'CUSTOM') unit = (i) => `${i}个月`
      if (obj.chargeUnit === 'USE_COUNT_AS_VOLUME') format = (i) => `${i}次`
      return `${format(obj.chargeSpecification)}/${unit(obj.chargeValidity)} * ${obj.cardPeriod}`
    },
    changeCarrierType() {
      this.form.testingType = false
      this.form.chargeCategoryId = ''
      this.form.cardMaterialId = ''
      this.form.freeForFirstMonth = false
    },
    async getCardTags() {
      let rst = await this.jaxLib.card.tags.list({
        carrier: this.carrier
      })
      if (!rst.success) return false
      this.allTags = rst.data
    },
    async getCarrierConfig() {
      this.loading = true
      let rst = await this.jaxLib.financial.getChargeByCarrierId({
        carrier: this.carrier,
        chargeId: this.carrierChargeId
      })
      this.loading = false
      if (!rst.success) return false
      this.baseContent = rst.data
    },
    onFileUploadSuccess(res, file) {
      this.fileList = [file]
      this.fileData = res.data.filePosition
    },
    onFileUploadDel() {
      this.file = []
      this.fileData = ''
    },
    saveToDb(raw) {
      raw = raw || this.form
      const data = {}
      Object.keys(this.formConfigToStore).forEach((key) => {
        data[key] = raw[key]
      })
      this.DB.setItem(genDBKey(this.carrier, this.carrierAccountId), data)
    },
    async onSubmit() {
      if (this.loading) return false
      const lastTime = (time) => moment(time).endOf('Day').format('YYYY-MM-DD')
      try {

        const valid = await this.$refs.form.validate()
        if (valid) {
          const {voiceFunction} = this.form
          if (voiceFunction) {
            this.form.tags = this.form.tags ? [...this.form.tags, 'VOICE_CARD'] : ['VOICE_CARD']
          } else {
            this.form.tags = this.form.tags ? this.form.tags.filter(t => t!== 'VOICE_CARD') : this.form.tags
          }
          let postData = {
            chargeType: this.form.type,
            chargeEntryId: this.chooseType.chargeEntryId,
            carrier: this.carrier,
            accountId: this.carrierAccountId,
            chargeId: this.carrierChargeId,
            activationDeadline: lastTime(this.form.activationDeadline),
            cardMaterialId: this.form.cardMaterialId,
            cardSpecification: this.form.specification,
            categoryList: this.form.categoryList.join(','),
            chargeCategoryId: this.form.chargeCategoryId,
            importBatchNo: this.batchPrefix + '-' + this.form.importBatchNo,
            tags: this.form.tags ? this.form.tags.join(',') : '',
            carrierSpecialLimit: this.form.tags
              ? this.form.tags
                  .filter((item) => this.realTags.map((rt) => rt.name).includes(item))
                  .join()
              : '',
            specialLimit: this.form.tags
              ? this.form.tags
                  .filter((item) => this.allTags.map((at) => at.name).includes(item))
                  .join()
              : '',
            locationService: this.form.locationService,
            freeForFirstMonth: this.form.freeForFirstMonth,
            openCardDate: moment(this.form.openCardDate).format('YYYY-MM-DD'),
            protocolStack: this.form.protocolStack,
            productionBatch: this.form.productionBatch,
            city: this.form.city.join(),
            cardProductionDate: moment(this.form.cardProductionDate).format('YYYY-MM-DD'),
            cardIssuer: this.form.cardIssuer
          }
          if (!this.locationFeeExits) {
            delete postData.locationService
          }
          if (this.form.testingType) {
            postData.testDataVolume = this.form.testDataVolume
            postData.testDeadline = lastTime(this.form.testDeadline)
            postData.testingEndType = this.form.testingEndType
          }
          if (this.iccidPostWay === '1') {
            postData.iccids = getAllIccidByRange(this.form.iccidBatchs).join()
          } else if (this.iccidPostWay === '2') {
            postData.iccids = iccidsTransfer(this.form.iccids, ',')
          } else {
            postData.ossFileUrl = this.fileData
          }
          postData.featureFee = this.featureFeeExits ? this.form.featureFee : false
          postData.categoryList = this.planClassificationList
            ? this.planClassificationList.map((item) => item.id).join(',')
            : ''
          return postData
        }
      } catch (e) {
        return false
      }
    },
    async cardImport(form) {
      this.loading = true
      this.$emit('loading', true)
      let ret = await this.jaxLib.card.postReceiveNote(form)
      if (ret.success) {
        this.$message.success('入库单提交成功！正在进入入库记录页面')
        this.enterRouter('store-record-inner')
      } else {
        this.$message.error(ret.message)
      }
      this.$emit('loading', false)
      this.loading = false
    },
    onCancel() {
      this.form = {
        type: '',
        testingType: false,
        testDataVolume: '',
        testDeadline: '',
        chargeCategoryId: '',
        activationDeadline: '',
        cardMaterialId: '',
        specification: '',
        featureFee: false,
        categoryList: [],
        tags: [],
        importBatchNo: '',
        iccids: '',
        freeForFirstMonth: false
      }
      this.$refs.form.resetFields()
    },
    enterRouter(name) {
      this.$router.push({ name: name })
    },
    getRealTags() {
      let tags = [
        { name: 'CARRIER_IMEI_BIND', desc: '机卡绑定', disabled: false },
        { name: 'CARRIER_REAL_NAME', desc: '实名认证', disabled: this.carrierRealName }
      ]
      if (this.carrierRealName) this.form.tags.push('CARRIER_REAL_NAME')
      this.realTags = tags
    }
  }
}
</script>

<template>
  <div v-loading="loading" class="base-receive-template pt20 pb20" style="background: #fff">
    <h4 class="tac mb20">{{ title }}</h4>
    <el-form ref="form" :model="form" label-width="120px" :rules="formRules" :disabled="disabled">
      <div class="form-group-wrap">
        <el-form-item label="运营商">
          <span class="underline">{{ carrier | carrierFilter }}</span>
        </el-form-item>
        <el-form-item label="运营商账号">
          <span class="underline">{{ carrierAccountId | carrierAccountFilter(carrier) }}</span>
        </el-form-item>
      </div>
      <el-form-item label="套餐类型" prop="type">
        <el-radio-group v-model="form.type" @change="changeCarrierType">
          <el-radio
            v-for="item in baseContent.offerTypeList"
            :key="item.chargeType + item.chargeEntryId"
            :label="item.chargeType"
          >
            {{ item.chargeTypeName }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="支持功能">
        <el-checkbox v-model="form.voiceFunction">语音功能</el-checkbox>
      </el-form-item>
      <div v-if="computedFormSchema.openCardDate.show" class="form-group-wrap">
        <el-form-item label="开卡日期" prop="openCardDate">
          <el-date-picker
            v-model="form.openCardDate"
            type="date"
            :clearable="false"
            placeholder="请选择"
            @change="onOpenCardChange"
          />
        </el-form-item>
        <el-form-item v-if="computedFormSchema.freeForFirstMonth.show" label-width="0">
          <el-checkbox v-model="form.freeForFirstMonth">首月不计入套餐时间</el-checkbox>
        </el-form-item>
      </div>
      <template v-if="carrier === 'cmcc' || (carrier === 'chinanet' && isNBIoTAccount)">
        <div class="form-group-wrap">
          <el-form-item label="测试期">
            <el-radio-group
              v-model="form.testingType"
              :disabled="carrierType === 'NO_API_ACCOUNT'"
              @change="onTestingTypeChange"
            >
              <el-radio :label="true">有</el-radio>
              <el-radio :label="false">无</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div v-if="form.testingType" class="form-group-wrap">
          <el-form-item label="测试期流量" prop="testDataVolume">
            <wh-volume-input v-model="form.testDataVolume" placeholder="测试期流量" />
          </el-form-item>
          <el-form-item label="测试期结束方式" label-width="140px">
            <el-radio-group v-model="form.testingEndType" @change="testingEndTypeChange">
              <el-radio label="months">按自然月</el-radio>
              <el-radio label="days">按天</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="测试期时长" prop="testDeadline" required label-width="140px">
            <el-input-number
              v-model="form.testDeadlineMonths"
              :min="0"
              style="margin-right: 8px"
              @change="testDeadLineMonthChange"
            />个月
            <span v-if="form.testDeadlineMonths"
              ><strong>{{ form.testDeadline }}</strong
              >距离今天还有<strong>{{
                form.testDeadline | dateCalculator(new Date(), form.testingEndType)
              }}</strong
              >天</span
            >
          </el-form-item>
        </div>
      </template>
      <el-form-item label="激活宽限期" prop="activationDeadline">
        <el-input-number
          v-model="form.activationDeadlineMonths"
          :min="0"
          style="margin-right: 8px"
          @change="activationDeadLineMonthChange"
        />个月
        <span v-if="form.activationDeadlineMonths"
          ><strong>{{ form.activationDeadline }}</strong
          >距离今天还有<strong>{{ form.activationDeadline | dateCalculator(new Date()) }}</strong
          >天</span
        >
      </el-form-item>
      <el-form-item v-if="chooseType.showSpecification" label="套餐规格" prop="chargeCategoryId">
        <el-select v-model="form.chargeCategoryId" placeholder="请选择入库套餐规格">
          <el-option
            v-for="item in chooseType.chargeTypeDetailVOS"
            :key="item.id"
            :value="item.id"
            :label="specificationFormat(item)"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <div class="form-group-wrap">
        <el-form-item label="材质" prop="cardMaterialId">
          <el-select v-model="form.cardMaterialId" placeholder="请选择">
            <el-option
              v-for="item in baseContent.materialList"
              :key="item.chargeEntryId"
              :value="item.chargeEntryId"
              :label="METERIAL_NAME[item.chargeType]"
              clearable
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-select v-model="form.specification" placeholder="请选择">
            <el-option
              v-for="(label, value) in enums.specificationType.maps()"
              :key="value"
              :label="label"
              :value="value"
              :disabled="
                !(
                  (selectedMaterial === 'PLASTIC_CARD_FEE' &&
                    ['STANDARD', 'MICRO', 'NANO'].indexOf(value) > -1) ||
                  (selectedMaterial === 'CERAMICS_CARD_FEE' &&
                    ['STANDARD', 'MICRO', 'NANO'].indexOf(value) > -1) ||
                  (selectedMaterial === 'PLASTIC_PASTER_CARD_FEE' &&
                    ['STANDARD', 'MS_2X2'].indexOf(value) > -1) ||
                  (selectedMaterial === 'PASTER_CARD_FEE' &&
                    ['MS_5X5', 'MS_5X6', 'MS_2X2'].indexOf(value) > -1) ||
                  (selectedMaterial === 'EPOXY_CARD_FEE' &&
                    ['STANDARD', 'MICRO', 'NANO', 'MS_5X5', 'MS_5X6', 'MS_2X2'].indexOf(value) >
                      -1) ||
                  (selectedMaterial === 'VEHICLE_CARD_FEE' &&
                    ['STANDARD', 'MICRO', 'NANO', 'MS_5X5', 'MS_5X6', 'MS_2X2'].indexOf(value) > -1)
                )
              "
              clearable
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item v-if="featureFeeExits" label="功能费">
        <el-radio-group v-model="form.featureFee">
          <el-radio :label="true">有</el-radio>
          <el-radio :label="false">无</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="locationFeeExits" label="定位功能">
        <el-radio-group v-model="form.locationService">
          <el-radio :label="true">有</el-radio>
          <el-radio :label="false">无</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="特殊限制">
        <el-checkbox-group v-model="form.tags">
          <el-checkbox
            v-for="item in allTags"
            :key="item.desc"
            :label="item.name"
            :disabled="!config.isExtWhitelistEnable && item.name === 'EXTRANET_WHITE_LIST'"
          >
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="运营商特殊限制">
        <el-checkbox-group v-model="form.tags">
          <el-checkbox
            v-for="item in realTags"
            :key="item.desc"
            :label="item.name"
            :disabled="item.disabled"
          >
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item
            label="制卡商"
            prop="cardIssuer"
            :rules="[{ required: true, message: '请选择制卡商' }]"
          >
            <el-select v-model="form.cardIssuer" clearable placeholder="制卡商">
              <el-option
                v-for="(key, val) in enums.cardIssuer.maps()"
                :key="val"
                :label="key"
                :value="val"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="协议栈"
            prop="protocolStack"
            :rules="[{ required: true, message: '请选择协议栈' }]"
          >
            <el-select v-model="form.protocolStack" clearable placeholder="协议栈">
              <el-option
                v-for="(key, val) in enums.protocolStack.maps()"
                :key="val"
                :label="key"
                :value="val"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="生产批次"
            prop="productionBatch"
            :rules="[{ required: true, message: '请输入生产批次' }]"
          >
            <el-input v-model="form.productionBatch" placeholder="生产批次" style="width: 200px" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="生产时间"
            prop="cardProductionDate"
            :rules="[{ required: true, message: '请选择生产时间' }]"
          >
            <el-date-picker
              v-model="form.cardProductionDate"
              type="date"
              :clearable="false"
              placeholder="请选择"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            prop="city"
            label="制卡城市"
            :rules="[{ required: true, message: '请选择制卡城市' }]"
          >
            <el-cascader v-model="form.city" :options="addressOptions" filterable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="computedFormSchema.refCategory.show" label="关联分类">
        <el-select
          v-model="form.refCategory"
          multiple
          placeholder="请选择"
          filterable
          style="width: 400px"
        >
          <el-option
            v-for="item in planClassificationList()"
            :key="item.id + item.name"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="批次号" prop="importBatchNo">
        <div v-if="!computedFormSchema.importBatchNo.disabled" class="flex">
          <div class="mr5">{{ batchPrefix }}-</div>
          <div class="flex1">
            <el-input v-model="form.importBatchNo" placeholder="请输入内容" style="width: 200px" />
          </div>
        </div>
        <div v-else>{{ config.importBatchNo }}</div>
      </el-form-item>
      <el-form-item
        v-if="computedFormSchema.remark.show"
        label="备注"
        prop="remark"
        :rules="[{ required: true, message: '备注不能为空', trigger: 'blur' }]"
      >
        <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
      </el-form-item>
      <template v-if="computedFormSchema.ICCID.show">
        <el-form-item v-if="carrierType !== 'NO_API_ACCOUNT'" label="ICCID">
          <div>
            <el-radio-group v-model="iccidPostWay">
              <el-radio label="1">填写首尾ICCID</el-radio>
              <el-radio label="2">输入所有ICCID</el-radio>
              <el-radio label="3">上传Excel附件</el-radio>
            </el-radio-group>
          </div>
          <iccid-range-input
            v-if="iccidPostWay === '1'"
            :iccid-batchs="form.iccidBatchs"
            @change="iccidRangeChange"
          />
          <el-form-item v-if="iccidPostWay === '2'" prop="iccids">
            <el-input
              v-model="form.iccids"
              type="textarea"
              placeholder="请输入ICCID，一个一行"
              style="width: 500px"
              class="mb20"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-if="iccidPostWay === '3'" prop="iccids">
            <el-upload
              accept="xlsx"
              name="price-excel"
              :show-file-list="true"
              :multiple="false"
              :file-list="fileList"
              :on-success="onFileUploadSuccess"
              :on-remove="onFileUploadDel"
              style="width: 300px"
              action="/ajax/common/file/upload"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传excel文件，且必须要有iccid列</div>
            </el-upload>
          </el-form-item>
        </el-form-item>
        <el-form-item v-else label="ICCID" prop="iccids">
          <el-upload
            accept="xlsx"
            name="price-excel"
            :show-file-list="true"
            :multiple="false"
            :file-list="fileList"
            :on-success="onFileUploadSuccess"
            :on-remove="onFileUploadDel"
            style="width: 300px"
            action="/ajax/common/file/upload"
          >
            <el-button size="small" type="primary">上传文件</el-button>
            <a
              slot="tip"
              target="_blank"
              style="color: #1c8de0; margin-left: 5px"
              href=" https://simboss-public.oss-cn-hangzhou.aliyuncs.com/template/device/input/device_input_template.xlsx"
            >
              下载示例excel模板
            </a>
          </el-upload>
          <div class="el-upload__tip">
            1.上传excel文件中必须包含iccid，msisdn，imsi。<br />
            2.上传excel的文件大小请勿超过2M。
          </div>
        </el-form-item>
      </template>
      <!-- <el-form-item>
        <el-button type="primary" :disabled="loading" @click="onSubmit">提 交</el-button>
        <el-button @click="onCancel">清 空</el-button>
      </el-form-item> -->
    </el-form>
  </div>
</template>
<style lang="scss">
.base-receive-template {
  .form-group-wrap {
    display: flex;
    .el-form-item {
      margin-right: 15px;
    }
  }
}
</style>
