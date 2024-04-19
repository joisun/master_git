<script>
/**
   * Create by zeter on 2017/8/8
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import formObject from '../mixins/form-object'
  import volumeFormat from '@/global/filters/volume-format'
  import moment from 'moment'
  import reg from '@/constant/regexps'

  const isValidRechargeUnit = (value) => {
    if (isNaN(value)) return false
    let num = +value
    return !(!Number.isInteger(num) || (num < 1 || num > 99))
  }

  export default {
    mixins: [DialogMixin],
    props: {
      dialogName: {
        default: ''
      },
      planId: {
        type: Number,
        required: true
      }
    },
    computed: {
      // 是否是新增报价
      isCreate() {
        return !this.planId
      },
      // 有效期值
      setValidity() {
        if (this.form.offerType === 'custom') {
          return true
        }
        this.form.validity = 1
        this.form.validityUnit = 'M'
        return false
      },
      // 套餐分类
      classificationList() {
        let carrier = this.enums.carrier.ordinal2key(this.form.operator)
        let list = this.$store.getters.getClassificationList(carrier)
        if (list.length === 0) this.form.categoryId = ''
        else this.form.categoryId = Number(list[0].id)
        if (!this.isCreate) this.form.categoryId = this.plan.categoryId
        return list
      }
    },
    data() {
      let numberValidator = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请填写充值金额'))
        }
        if (!reg.money.test(value)) {
          return callback(new Error('请填写符合要求的金额'))
        }
        callback()
      }
      let cardFeeValidator = (rule, value, callback) => {
        let cardSure = false
        let cardNumber = true
        let cardFeeSpecification = true;
        ['cardFee', 'ceramicCardFee', 'pasterCardFee', 'pasterCeramicCardFee'].forEach(e => {
          if (this.cardFrom[e]) cardSure = true
          if (!reg.money.test(this.form[e])) cardNumber = false
        })
        if (this.cardFrom.cardFee) {
          cardFeeSpecification = this.cardFeeSpecificationList.length > 0
        }
        if (!cardSure) {
          return callback(new Error('请至少勾选一种卡类型'))
        } else if (!cardFeeSpecification) {
          return callback(new Error('请至少勾选一种塑料插拔卡的规格类型'))
        } else if (!cardNumber) {
          return callback(new Error('请填写正确的金额'))
        }
        callback()
      }
      let volumeValidator = (rule, value, callback) => {
        if (this.form.useCountAsVolume) {
          return callback()
        }
        if (!rule) {
          return callback(new Error('流量不能为空'))
        } else if (!reg.volume.test(value)) {
          return callback(new Error('请填写正确的流量'))
        }
        callback()
      }
      let countValidator = (rule, value, callback) => {
        if (!this.form.useCountAsVolume) {
          return callback()
        }
        if (!rule) {
          return callback(new Error('次数不能为空'))
        } else if (!reg.positiveInteger.test(value)) {
          return callback(new Error('请填写正确的次数'))
        }
        callback()
      }
      let dateLineValidator = (rule, value, callback) => {
        if(value > this.form.deadline) {
          return callback(new Error('结束日期要大于开始日期'))
        }
        callback()
      }
      let rechargeUnitValidator = (rule, value, callback) => {
        if (!isValidRechargeUnit(value)) {
          return callback(new Error('请输入1-99之间的正数字'))
        }
        callback()
      }
      return {
        cardFeeSpecificationList: [],
        cardFeePasterSplaticList: [],
        cardFeePasterCeramicList: [],
        cardFrom: {
          cardFee: true,
          ceramicCardFee: false,
          pasterCardFee: false,
          pasterCeramicCardFee: false
        },
        rule: {
          volume: [{ validator: volumeValidator, trigger: 'blur' }],
          count: [{ validator: countValidator, trigger: 'blur' }],
          minDeadline: [{ validator: dateLineValidator, trigger: 'change' }],
          categoryId: [{ required: true, message: '请选择套餐分类' }],
          price: [{ validator: numberValidator, trigger: 'blur' }],
          officalPrice: [{ validator: numberValidator, trigger: 'blur' }],
          bottomPrice: [{ validator: numberValidator, trigger: 'blur' }],
          cardFee: [{ validator: cardFeeValidator, trigger: 'blur' }],
          rechargeUnit: [{ validator: rechargeUnitValidator, trigger: 'change' }],
          generation: [{ required: true, message: '请选择网络模式' }]
        },
        // eslint-disable-next-line new-cap
        form: new formObject(0),
        formSub: {
          priceDiscount: 0,
          bottomPriceDiscount: 0
        },
        categoryList: [],
        sureLoading: false,
        volumeControl: 1,
        plan: {},
        stepDisabled: false,
        mouthList: [0,1,2,3,4,5,6,7,8,9,10,11,12],
        networkList: ['2G','3G','4G','5G']
      }
    },
    watch: {
      'cardFrom.cardFee'(current) {
        if (!current) {
          this.cardFeeSpecificationList = []
        }
      },
      'form.periodDefinition'(current) {
        if (current === 2 || current === 3) {
          this.form.periodEndTag = 2
        }
      },
      'form.operator'(current) {
        if (this.form.operator !== 2 && this.form.offerType === 'package') {
          this.form.useCountAsVolume = false
        }
      },
      'form.offerType'(current) {
        if ((this.form.operator !== 2 && this.form.offerType === 'package') ||
          this.form.offerType === 'monthly') {
          this.form.useCountAsVolume = false
        }
      }
    },
    methods: {
      onChangeFormOfferType: function(current) {
        this.form.rechargeUnit = 1
        if (current === 'custom') {
          this.form.step = [1, 1]
        } else {
          this.form.step = [3, 12]
        }
      },
      onInputCustomRechargeUnit: function(value) {
        if (isValidRechargeUnit(value)) {
          let num = +value
          this.form.step = [+num, +num]
        }
        this.form.rechargeUnit = value
      },
      onInputMonthRechargeUnit: function(value) {
        if (isValidRechargeUnit(value)) {
          let num = +value
          this.form.step = num === 1 ? [3, 12] : [num, num * 4]
          this.stepDisabled = false
        } else {
          this.stepDisabled = true
        }
        this.form.rechargeUnit = value
      },
      // 正向计算价格
      computedPrice() {
        if (this.form.officalPrice) {
          this.form.price = (this.form.officalPrice * this.formSub.priceDiscount).toFixed(2)
          this.form.bottomPrice = (this.form.officalPrice * this.formSub.bottomPriceDiscount).toFixed(2)
        } else {
          this.form.price = 0
          this.form.bottomPrice = 0
        }
      },
      // 反向计算价格
      computedDiscount() {
        if (this.form.officalPrice) {
          this.formSub = {
            priceDiscount: (this.form.price / this.form.officalPrice).toFixed(2),
            bottomPriceDiscount: (this.form.bottomPrice / this.form.officalPrice).toFixed(2)
          }
        } else {
          this.formSub = {
            priceDiscount: 0,
            bottomPriceDiscount: 0
          }
        }
      },
      resetFrom() {
        // eslint-disable-next-line new-cap
        this.form = new formObject(0)
        let { generation } = this.form
        if (!generation) {
          this.form = {
            ...this.form,
            generation: []
          }
        }
        this.cardFrom = {
          cardFee: true,
          ceramicCardFee: false,
          pasterCardFee: false,
          pasterCeramicCardFee: false
        }
        this.cardFeeSpecificationList = []
        this.cardFeePasterSplaticList = [] // 塑料贴片
        this.cardFeePasterCeramicList = [] // 陶瓷贴片
        this.volumeControl = 1
        this.computedDiscount()
        this.sureLoading = false
      },
      open() {
        this.sureLoading = true
        if (this.planId) {
          this.loadPlanValue(this.planId).then(_ => {
            this.formOfferTypeWatcher = this.$watch('form.offerType', this.onChangeFormOfferType)
          })
        } else {
          this.resetFrom()
          this.formOfferTypeWatcher = this.$watch('form.offerType', this.onChangeFormOfferType)
        }
      },
      close() {
        if (this.formOfferTypeWatcher) {
          this.formOfferTypeWatcher()
        }
        this.resetFrom()
        this.$emit('closeDialog', this.dialogName)
      },
      resetPasterDataToObjc(plasticList, ceramicList) {
        let resultDic = {}
        if (plasticList.length > 0) {
          let plasticStr = plasticList.map(item => {
            if (item === 'plasticPaster5x6') {
              return item = 'PLASTIC_PASTER_5x6'
            } else if (item === 'plasticPaster2x2') {
              return item = 'PLASTIC_PASTER_2x2'
            }
          }).join(',')
          resultDic = {
            'materialSpecificationForPaster': plasticStr
          }
        }
        if (ceramicList.length > 0) {
          let ceramicStr = ceramicList.map(item => {
            if (item === 'ceramicPaster5x6') {
             return item = 'CERAMIC_PASTER_5x6'
            } else if (item === 'ceramicPaster2x2') {
              return item = 'CERAMIC_PASTER_2x2'
            }
          }).join(',')
          resultDic = {
            ...resultDic,
            'materialSpecificationForCeramicPaster': ceramicStr
          }
        }
        return resultDic
      },
      onSubmit() {
        if (this.sureLoading) return false
        this.$refs.form.validate(async(valid) => {
          if (valid) {
            let form = { ...this.form }
            if ((form.offerType === 'custom' || form.offerType === 'package') && form.useCountAsVolume) {
              form.volume = +form.count
            } else {
              form.volume *= this.volumeControl
            }
            if (this.cardFeePasterSplaticList || this.cardFeePasterCeramicList) {
              form = {
                ...form,
                ...this.resetPasterDataToObjc(this.cardFeePasterSplaticList, this.cardFeePasterCeramicList)
              }
            }
            if (Object.prototype.hasOwnProperty.call(form, 'generation')) {
              form = {
                ...form,
                generation: form.generation.length > 0 ? form.generation.join(',') : ''
              }
            }
            form.status = form.status ? 'on' : 'off'
            form.cardType = form.cardType ? 'TESTING' : 'PRODUCTION'
            form.extendField = JSON.stringify({ carrierCode: form.extendField })
            form.minPurchaseLimit = form.step[0]
            form.maxPurchaseLimit = form.step[1]
            form.rechargeUnit = +form.rechargeUnit
            form.materialSpecification = this.cardFeeSpecificationList.join(',');
            ['cardFee', 'ceramicCardFee', 'pasterCardFee', 'pasterCeramicCardFee'].forEach(e => {
              if (!this.cardFrom[e]) {
                form[e] = -1
              }
            })
            if (form.offerType === 'custom') {
              if (form.periodEndTag === 1) {
                form.periodOver = true
                form.usageOver = true
              } else if (form.periodEndTag === 2) {
                form.periodOver = true
                form.usageOver = false
              }
            } else if (form.offerType === 'package') {
              form.periodOver = true
              form.usageOver = true
              form.periodDefinition = 2
            } else if (form.offerType === 'pool-package') {
              if (this.isCreate) delete form.periodDefinition
              delete form.useCountAsVolume
            } else {
              delete form.periodDefinition
              delete form.useCountAsVolume
            }

            delete form.created
            delete form.modified
            delete form.step
            delete form.count
            delete form.periodEndTag
            delete form.foreverPackage

            this.sureLoading = true
            let rst = await this.jaxLib.financial.plan.put(form)
            this.sureLoading = false
            if (!rst.success) {
              return false
            }
            this.$message.success(`${this.isCreate ? '新增' : '编辑'}报价成功, 赶快去推广套餐吧~`)
            this.resetFrom()
            this.$emit('closeDialog', this.dialogName, 1)
          }
        })
      },
      async loadPlanValue(id) {
        this.sureLoading = true
        let rst = await this.jaxLib.financial.plan.get({
          id: id
        })
        this.sureLoading = false
        if (!rst.success) return false
        let e = { ...rst.data }
        e.cardType = e.cardType === 'TESTING'
        e.status = e.status === 'on'
        if ((e.offerType === 'custom' || e.offerType === 'package') && e.useCountAsVolume) {
          e.count = e.volume
          e.volume = ''
        } else if (e.volume >= 1024) {
          e.volume = volumeFormat(e.volume, false)
          this.volumeControl = 1024
        } else {
          this.volumeControl = 1
        }
        e.step = [Number(e.minPurchaseLimit), Number(e.maxPurchaseLimit)]
        e.extendField = e.extendField ? JSON.parse(e.extendField).carrierCode : ''
        this.cardFeeSpecificationList = e.materialSpecification.split(',')
        let cardFeeList = ['cardFee', 'ceramicCardFee', 'pasterCardFee', 'pasterCeramicCardFee']
        cardFeeList.forEach(i => {
          if (e[i] < 0) {
            this.cardFrom[i] = false
            e[i] = 0
          } else {
            this.cardFrom[i] = true
          }
        })
        if (e.periodOver && e.usageOver) {
          e.periodEndTag = 1
        } else if (e.periodOver) {
          e.periodEndTag = 2
        }
        let { generation } = e
        if (generation && typeof generation === 'string') {
          e.generation = generation.split(',')
        } else {
          e.generation = []
        }
        this.plan = { ...e }
        this.form = { ...this.form, ...e }
        let { monthlySmsPackage, yearlySmsPackage } = this.form
        this.form = {
          ...this.form,
          foreverPackage: !monthlySmsPackage && !yearlySmsPackage
        }
        this.resetPasterList(e)
        this.computedDiscount()
      },
      resetPasterList(data) {
        let splaticlist = []
        const ceramics = ['ceramicPaster5x6', 'ceramicPaster2x2']
        const splatics = ['plasticPaster5x6', 'plasticPaster2x2']
        splatics.map(item => {
          if (Object.prototype.hasOwnProperty.call(data, item) && data[item] == true) {
            splaticlist.push(item)
          }
        })
        let ceramiclist = []
        ceramics.map(item => {
          if (Object.prototype.hasOwnProperty.call(data, item) && data[item] == true) {
            ceramiclist.push(item)
          }
        })
        this.cardFeePasterSplaticList = splaticlist
        this.cardFeePasterCeramicList = ceramiclist
      },
      smsOnChange(value) {
        let { monthlySmsPackage, yearlySmsPackage, foreverPackage } = this.form
        if (value === 'forever' && foreverPackage) {
          this.form.monthlySmsPackage = !foreverPackage
          this.form.yearlySmsPackage = !foreverPackage
        } else{
          this.form.foreverPackage = false
        }
      }
    },
    async created() {
      await this.$store.dispatch('changeClassificationList')
      this.resetFrom()
    }
  }
</script>

<template>
  <div class="plan-add-edit" v-loading="sureLoading">
    <el-form
      :model="form"
      :inline="true"
      ref="form"
      :rules="rule">
      <div class="wh__dialog--body">
        <div class="plan__dialog--block">
          <div v-if="!isCreate">
            ID:{{ form.id }}
          </div>
          <el-form-item label="运营商类型" prop="operator">
            <el-select v-model="form.operator" placeholder="选择运营商" :disabled="!isCreate">
              <el-option :label="val" :value="key" v-for="(key, val) in enums.carrier.mapsByOrdinal()" :key="val">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="套餐类型" prop="offerType" placeholder="选择套餐类型">
            <el-select
              v-model="form.offerType"
              :disabled="!isCreate">
              <el-option v-for="(key, val) in enums.planType.maps()" :key="val" :label="key" :value="val">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="plan__dialog--block" v-if="form.offerType === 'overflow-package'">
          <el-form-item>
            超额流量按照超过套餐流量后的每Mb计算
          </el-form-item>
        </div>
        <div class="plan__dialog--block" v-if="form.offerType === 'pool-package'">
          <el-form-item>
            流量大小：以GB为最小单位,设置1GB单价
          </el-form-item>
        </div>
        <div class="plan__dialog--block" v-else>
          <el-form-item label="流量大小(MB)" prop="volume">
            <span slot="label" v-if="form.offerType === 'custom' || form.offerType === 'package'">
              <el-radio
                :value="Number(form.useCountAsVolume)"
                @input="form.useCountAsVolume = Boolean(arguments[0])"
                :disabled="!isCreate"
                :label="0">流量大小(MB)</el-radio>
            </span>
            <el-input placeholder="请填写测试期流量"
              v-model="form.volume"
              :disabled="!isCreate || form.useCountAsVolume"
              style="width: 200px;">
              <el-select v-model="volumeControl"
                slot="append"
                :disabled="!isCreate || form.useCountAsVolume"
                placeholder="请选择"
                style="width:70px;">
                <el-option label="MB" :value="1">
                </el-option>
                <el-option label="GB" :value="1024">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="连接次数" prop="count" key="count" v-if="form.offerType === 'custom' || form.offerType === 'package'">
            <span slot="label">
              <el-radio
                :value="Number(form.useCountAsVolume)"
                :disabled="!isCreate || (form.operator !== 2 && form.offerType === 'package')"
                @input="form.useCountAsVolume = Boolean(arguments[0])"
                :label="1">连接次数</el-radio>
            </span>
            <el-input
              placeholder="请填写"
              v-model="form.count"
              :disabled="!isCreate || !form.useCountAsVolume" >
            </el-input>
          </el-form-item>

          <el-form-item label="套餐周期" v-if="form.offerType !== 'package'">
            <span slot="label">
              {{form.offerType === 'custom' ? '(单个)套餐周期' : '套餐周期'}}
            </span>
            <el-form-item prop="validity">
              <el-input-number
                v-model="form.validity"
                :min="0"
                size="small"
                :disabled="!setValidity || !isCreate">
              </el-input-number>
            </el-form-item>
            <el-form-item prop="validityUnit">
              <el-select
                v-model="form.validityUnit"
                placeholder="单位"
                size="small"
                :disabled="!isCreate"
                class="plan__dialog--unit">
                <el-option label="月" value="M">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>

          <el-form-item label="订购周期(份)" prop="rechargeUnit"  v-if="form.offerType === 'custom'">
            <el-input
              style="width: 60px;"
              size="small"
              :value="form.rechargeUnit"
              @input="onInputCustomRechargeUnit">
            </el-input>
          </el-form-item>
          <el-form-item label="订购周期间隔" prop="rechargeUnit" v-if="form.offerType === 'monthly'">
            <el-input
              @input="onInputMonthRechargeUnit"
              :value="form.rechargeUnit"
              style="width: 60px;"
              size="small">
            </el-input>
          </el-form-item>
          <el-form-item label="购买周期" v-if="form.offerType === 'monthly' || form.offerType === 'custom'">
            <div class="plan__dialog--step">
              <el-slider
                v-model="form.step"
                :step="+form.rechargeUnit"
                :disabled="stepDisabled || form.offerType === 'custom'"
                range
                show-stops
                :max="+form.rechargeUnit * 24"
                :min="+form.rechargeUnit">
              </el-slider>
              <span class="plan__dialog--step-show" style="user-select: none;">
                {{form.step ? form.step[0] : ''}} - {{form.step ? form.step[1] : ''}}
              </span>
            </div>
          </el-form-item>
          <el-form-item label="激活宽限期（月）" prop="minDeadline" v-if="form.offerType === 'monthly' || form.offerType === 'custom'">
            <el-select v-model="form.minDeadline" placeholder="请输入" style="width:100px;">
              <el-option v-for="(index, item) in mouthList" :key="index" :value="item" :disabled="(item>form.deadline) && !isCreate"></el-option>
            </el-select>
            <span>-</span>
            <el-select v-model="form.deadline" placeholder="请输入" style="width:100px;">
              <el-option v-for="(item, index) in mouthList" :key="index" :value="item" :disabled="item<form.minDeadline"></el-option>
            </el-select>
          </el-form-item>
          <br>
          <el-form-item label="周期定义" v-if="form.offerType === 'custom'">
            <el-radio v-model="form.periodDefinition" :disabled="!isCreate" :label="1">每月30天</el-radio>
            <el-radio v-model="form.periodDefinition" :disabled="!isCreate" :label="2">自然月月底</el-radio>
            <el-radio v-model="form.periodDefinition" :disabled="!isCreate" :label="3">自然月叠加</el-radio>
          </el-form-item>
          <el-form-item label="套餐结束方式" v-if="form.offerType === 'custom'" style="margin-left: 15px;">
            <el-radio v-model="form.periodEndTag" :disabled="!isCreate ||(form.periodDefinition == 2 || form.periodDefinition == 3)" :label="1">时间到期或用量用尽</el-radio>
            <el-radio v-model="form.periodEndTag" :disabled="!isCreate" :label="2">时间到期</el-radio>
          </el-form-item>
        </div>
        <div class="plan__dialog--block plan__dialog--tags"
          v-if="form.offerType === 'monthly' || form.offerType ==='custom'">
          <el-form-item label="套餐分类" prop="categoryId">
            <el-select v-model="form.categoryId" size="small" :disabled="!isCreate">
              <el-option v-for="item in classificationList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <br>
          <el-form-item label="附加功能">
            <el-checkbox v-model="form.sharable"
              v-if="form.offerType === 'monthly' || form.offerType === 'custom'">流量池共享
            </el-checkbox>
            <el-checkbox v-model="form.supportSms">短信接收</el-checkbox>
            <el-checkbox v-model="form.locationService">基站定位</el-checkbox>
            <el-checkbox v-model="form.realnameRequire">实名认证</el-checkbox>
            <el-checkbox v-model="form.apnSetting">APN设置</el-checkbox>
            <el-checkbox v-model="form.cardDeviceBundling">机卡绑定</el-checkbox>
            <el-checkbox v-model="form.supportTestingCard">测试期</el-checkbox>
          </el-form-item>
          <br>
          <el-form-item label="短信服务方式" v-if="form.supportSms">
            <el-checkbox v-model="form.foreverPackage" @change="smsOnChange('forever')">永久有效</el-checkbox>
            <el-checkbox v-model="form.monthlySmsPackage" @change="smsOnChange">包月</el-checkbox>
            <el-checkbox v-model="form.yearlySmsPackage" @change="smsOnChange">包年</el-checkbox>
          </el-form-item>
          <br>
          <el-form-item label="特殊标记">
            <el-checkbox v-model="form.whiteCardEnable">支持0元购买白卡</el-checkbox>
            <el-checkbox v-model="form.activeAfterOutput">出库并激活</el-checkbox>
            <el-checkbox v-model="form.testEnable">支持测试卡</el-checkbox>
            <el-checkbox v-model="form.unlimitedVolume">不限流量</el-checkbox>
            <el-checkbox :disabled="form.disabled" v-model="form.allowRecharge">允许续费</el-checkbox>
          </el-form-item>
          <br>
          <el-form-item label="卡片费用" prop="cardFee" class="plan__dialog--fee">
            <div class="plan__dialog--fee-type">
              <el-checkbox v-model="cardFrom.cardFee">塑料插拔卡(元)</el-checkbox>
              <el-input v-model="form.cardFee" size="small">
              </el-input>
              <el-checkbox-group v-model="cardFeeSpecificationList">
                <el-checkbox label="STANDARD">标准卡</el-checkbox>
                <el-checkbox label="MICRO">micro卡</el-checkbox>
                <el-checkbox label="NANO">nano卡</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="plan__dialog--fee-type">
              <el-checkbox v-model="cardFrom.pasterCardFee">塑料贴片卡</el-checkbox>
              <el-input v-model="form.pasterCardFee" size="small">
              </el-input>
              <el-checkbox-group v-model="cardFeePasterSplaticList">
                <el-checkbox label="plasticPaster5x6">5*6MM</el-checkbox>
                <el-checkbox label="plasticPaster2x2" disabled="true">2*2MM</el-checkbox>
              </el-checkbox-group>
            </div>
            <br>
            <div class="plan__dialog--fee-type">
              <el-checkbox v-model="cardFrom.ceramicCardFee">陶瓷插拔卡</el-checkbox>
              <el-input v-model="form.ceramicCardFee" size="small">
              </el-input>
            </div>
            <div class="plan__dialog--fee-type">
              <el-checkbox v-model="cardFrom.pasterCeramicCardFee">陶瓷贴片卡</el-checkbox>
              <el-input v-model="form.pasterCeramicCardFee" size="small">
              </el-input>
              <el-checkbox-group v-model="cardFeePasterCeramicList">
                <el-checkbox label="ceramicPaster5x6">5*6MM</el-checkbox>
                <el-checkbox label="ceramicPaster2x2" disabled="true">2*2MM</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <br>
          <br>
          <el-form-item label="网络模式">
            <el-select v-model="form.generation" size="small" multiple >
              <el-option v-for="item in networkList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <br>
          <el-form-item label="运营商特殊限制">
            <el-checkbox v-model="form.carrierImeiBind">机卡绑定</el-checkbox>
            <el-checkbox v-model="form.carrierRealName">实名认证</el-checkbox>
          </el-form-item>
        </div>
        <div class="plan__dialog--block plan__dialog--tags"
          v-if="form.offerType === 'package' || form.offerType ==='pool-package'">
          <el-form-item label="关联分类">
            <el-select v-model="form.categoryId" size="small" :disabled="!isCreate">
              <el-option v-for="item in classificationList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="特殊标记" v-if="form.offerType === 'package'">
            <el-checkbox :disabled="form.disabled" v-model="form.allowRecharge">允许续费</el-checkbox>
          </el-form-item>
        </div>
        <div class="plan__dialog--block plan__dialog--price">
          <el-form-item label="价格">
            <div class="plan__dialog--price-box">
              <div class="plan__dialog--price-cloums">
                <div class="plan__dialog--price-label">运营商官方报价(元)</div>
                <div class="plan__dialog--price-value">
                  <el-form-item prop="officalPrice">
                    <el-input v-model="form.officalPrice" size="small">
                    </el-input>
                  </el-form-item>
                </div>
                <div class="plan__dialog--price-computed" v-if="form.offerType === 'overflow-package'">
                  折合1G为{{form.officalPrice * 1024}}元
                </div>
              </div>
              <div class="plan__dialog--price-cloums">
                <div class="plan__dialog--price-label">平台售价(元)</div>
                <div>
                  <el-form-item prop="price">
                    <el-input v-model="form.price" class="plan__dialog--price-value" size="small"
                      @blur="computedDiscount"
                      @keyup.enter.native="computedDiscount">
                    </el-input>
                    <el-input v-model="formSub.priceDiscount" class="plan__dialog--price-value"
                      size="small" @blur="computedPrice"
                      @keyup.enter.native="computedPrice">
                    </el-input>
                  </el-form-item>
                </div>
                <div class="plan__dialog--price-computed" v-if="form.offerType === 'overflow-package'">
                  折合1G为{{form.price * 1024}}元
                </div>
              </div>
              <div class="plan__dialog--price-cloums">
                <div class="plan__dialog--price-label">销售底价(元)</div>
                <div>
                  <el-form-item prop="bottomPrice">
                    <el-input v-model="form.bottomPrice" class="plan__dialog--price-value"
                      size="small" @blur="computedDiscount"
                      @keyup.enter.native="computedDiscount">
                    </el-input>
                    <el-input v-model="formSub.bottomPriceDiscount"
                      class="plan__dialog--price-value" size="small" @blur="computedPrice"
                      @keyup.enter.native="computedPrice">
                    </el-input>
                  </el-form-item>
                </div>
                <div class="plan__dialog--price-computed" v-if="form.offerType === 'overflow-package'">
                  折合1G为{{form.bottomPrice * 1024}}元
                </div>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="plan__dialog--block">
          <el-form-item label="套餐状态">
            <p>上下架</p>
            <p>
              <el-switch
                :disabled="form.disabled"
                v-model="form.status"
                active-text="上架"
                inactive-text="下架">
              </el-switch>
            </p>
          </el-form-item>
          <el-form-item class="ml20">
            <p>是否禁止上架</p>
            <p>
              <el-switch
                :disabled="form.disabled"
                v-model="form.disableOnStatus"
                active-text="是"
                inactive-text="否">
              </el-switch>
            </p>
          </el-form-item>
          <el-form-item class="ml20">
            <p>是否禁用</p>
            <p>
              <el-switch
                v-model="form.disabled"
                active-text="是"
                inactive-text="否">
              </el-switch>
            </p>
          </el-form-item>
          <el-form-item class="ml20">
            <p>运营商套餐id</p>
            <p>
              <el-input v-model="form.extendField" size="small" :disabled="!isCreate"></el-input>
            </p>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="wh__dialog--footer">
      <el-button type="primary" @click="onSubmit" v-loading="sureLoading">提交</el-button>
    </div>
  </div>
</template>
