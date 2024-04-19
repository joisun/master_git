<!--
 * @Author: SerkeyWu
 * @Date: 2021-02-20 16:49:00
 * @Description: Do not edit
 * @LastEditors: SerkeyWu
 * @LastEditTime: 2021-02-26 19:19:49
-->
<template>
  <el-dialog :visible="visible" :title="title" :before-close="onCloseDialog" width="600px">
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="套餐ID" prop="priceOfferId">
        <el-input
          v-model="form.priceOfferId"
          :disabled="isEdit"
          style="width: 160px"
          @change="onOfferIdChange"
        ></el-input>
      </el-form-item>
      <el-form-item label="成本月份" prop="monthDate">
        <el-date-picker
          v-model="form.monthDate"
          :disabled="isEdit"
          format="yyyy-MM"
          type="month"
          style="width: 160px"
          placeholder="选择月份"
          value-format="yyyy-MM-dd HH:mm:ss"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item label="运营商" prop="carrier"
        ><span v-loading="loadingPriceOfferInfo">{{ form.carrier }}</span></el-form-item
      >
      <el-form-item label="套餐规格" prop="volume"
        ><span v-loading="loadingPriceOfferInfo">{{ form.volume }}</span></el-form-item
      >
      <el-form-item label="运营商价" prop="officalPrice"
        ><span v-loading="loadingPriceOfferInfo">{{ form.officalPrice }}</span></el-form-item
      >
      <el-form-item label="销售成本" prop="cost">
        <el-input-number v-model="form.cost" :controls="false" style="width: 160px" />
      </el-form-item>
      <el-form-item label="续费成本" prop="rechargeCost">
        <el-input-number v-model="form.rechargeCost" :controls="false" style="width: 160px" />
      </el-form-item>
      <el-form-item label="提成方式" prop="commissionType">
        <el-select v-model="form.commissionType" style="width: 160px">
          <el-option
            v-for="item in commissionTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <template v-if="!['pool-package'].includes(form.offerType)">
        <el-form-item label="供应商" prop="signedCarrierId">
          <el-select
            v-model="form.signedCarrierId"
            placeholder="请选择所属运营商"
            style="width: 160px"
            clearable
            :disabled="isEdit"
            size="small"
          >
            <el-option
              v-for="item in signedCarrierList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商账号" prop="carrierAccountId">
          <wh-carrier-account-select
            v-model="form.carrierAccountId"
            :empty="false"
            :disabled="isEdit"
            style="width: 160px"
            :carrier="enums.carrier.invert().get(form.carrier)"
            size="small"
            :signed-carrier-id="form.signedCarrierId"
          />
        </el-form-item>
      </template>
      <el-form-item label="插拔卡费" prop="cardCost.PLASTIC">
        <el-input-number v-model="form.cardCost.PLASTIC" :controls="false" style="width: 160px" />
      </el-form-item>
      <el-form-item label="陶瓷插拔" prop="cardCost.CERAMICS">
        <el-input-number v-model="form.cardCost.CERAMICS" :controls="false" style="width: 160px" />
      </el-form-item>
      <el-form-item label="消费级贴片卡费" prop="cardCost.PLASTIC_PASTER">
        <el-input-number
          v-model="form.cardCost.PLASTIC_PASTER"
          :controls="false"
          style="width: 160px"
        />
      </el-form-item>
      <el-form-item label="工业级贴片卡费" prop="cardCost.CERAMICS_PASTER">
        <el-input-number
          v-model="form.cardCost.CERAMICS_PASTER"
          :controls="false"
          style="width: 160px"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <div>
        <el-button @click="onCloseDialog">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import tagExtract from '@/global/directive/tag-extract'
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
const commissionTypeOptions = [
  {
    label: '运营',
    value: 'OPERATION'
  },
  {
    label: '转售',
    value: 'RESALE'
  }
]
// 所有数字转成保留一位有效数字的字符串
const adjustment = (obj) => {
  const returnObj = {}
  Object.keys(obj).forEach((e) => {
    const s = obj[e] ? obj[e].toString() : '0.0'
    if (s.indexOf('.') < 0) {
      returnObj[e] = s + '.0'
    } else {
      returnObj[e] = s
    }
  })
  return returnObj
}

// 去除字符串所有数字中的引号
const removeQuotes = (s) => {
  const pattern = /("([0-9.]+)")/g
  return s.replace(pattern, '$2')
}

export default {
  components: {
    whCarrierAccountSelect
  },
  props: {
    visible: {
      type: Boolean
    },
    data: {
      type: Object
    },
    monthDate: {
      type: String
    }
  },
  data() {
    return {
      commissionTypeOptions,
      form: {
        priceOfferId: '',
        cost: undefined,
        rechargeCost: undefined,
        carrier: '',
        volume: '',
        officalPrice: '',
        offerType: '',
        carrierAccountId: '',
        signedCarrierId: '',
        monthDate: '',
        commissionType: 'OPERATION',
        cardCost: {
          PLASTIC: undefined,
          CERAMICS: undefined,
          CERAMICS_PASTER: 4,
          PLASTIC_PASTER: undefined
        }
      },
      signedCarrierList: [],
      rules: {
        commissionType: [
          {
            message: '请选择提成方式',
            required: true
          }
        ],
        priceOfferId: [
          {
            message: '该项为必填项',
            required: true,
            trigger: 'blur'
          }
        ],
        cost: [
          {
            message: '该项为必填项',
            required: true,
            trigger: 'blur'
          }
        ],
        rechargeCost: [
          {
            message: '该项为必填项',
            required: true,
            trigger: 'blur'
          }
        ],
        carrierAccountId: [
          {
            message: '该项为必填项',
            required: true,
            trigger: 'blur'
          }
        ],
        signedCarrierId: [
          {
            message: '该项为必填项',
            required: true,
            trigger: 'blur'
          }
        ]
      },
      loadingPriceOfferInfo: false
    }
  },
  computed: {
    isEdit() {
      return this.data ? true : false
    },
    title() {
      return this.isEdit ? '编辑考核成本' : '新增考核成本'
    }
  },
  watch: {
    'form.carrier'() {
      this.getSignedCarrierList()
    },
    'form.signedCarrierId'() {
      this.form.carrierAccountId = ''
      this.$forceUpdate()
    },
    visible(v) {
      if (v && this.data) {
        this.form = Object.assign({}, this.form, this.data)
        this.form.carrier = this.enums.carrier.get(this.form.carrier)
        this.form.volume = this.data.planName
        this.form.signedCarrierId = this.data.signedCarrierId
        this.form.offerType = this.data.offerType
        this.form.monthDate = this.data.monthDate
        this.$nextTick(() => {
          this.form.carrierAccountId = this.data.carrierAccountId
        })
      } else {
        this.form = {
          priceOfferId: '',
          cost: undefined,
          rechargeCost: undefined,
          carrier: '',
          volume: '',
          officalPrice: '',
          offerType: undefined,
          carrierAccountId: '',
          signedCarrierId: '',
          monthDate: this.monthDate + ' 00:00:00',
          cardCost: {
            PLASTIC: undefined,
            CERAMICS: undefined,
            CERAMICS_PASTER: 4,
            PLASTIC_PASTER: undefined
          }
        }
      }
    }
  },
  methods: {
    async getSignedCarrierList() {
      if (!this.form.carrier) return false
      let res = await this.jaxLib.store.signedCarrierListGet({
        carrier: this.enums.carrier.invert().get(this.form.carrier)
      })
      if (!res.success) return false
      this.signedCarrierList = res.data
    },
    async onOfferIdChange(v) {
      this.form.carrier = ''
      this.form.volume = ''
      this.form.officalPrice = ''
      this.form.carrierAccountId = ''
      this.form.signedCarrierId = ''
      this.form.offerType = ''
      const params = {
        id: v
      }
      this.loadingPriceOfferInfo = true
      const rst = await this.jaxLib.financial.plan.getAll(params)
      this.loadingPriceOfferInfo = false
      if (rst.success && rst.data.list.length === 1) {
        const row = rst.data.list[0]
        this.form.carrier = this.enums.carrier.get(row.operator)
        this.form.offerType = row.offerType
        this.form.volume = tagExtract(null, {
          value: {
            offerType: row.offerType,
            validity: row.validity,
            validityUnit: row.validityUnit,
            volume: row.volume,
            unlimited: row.unlimitedVolume,
            useCountAsVolume: row.useCountAsVolume,
            cardPeriod: 1 // 期限不显示（其实就是订购周期），传1
          }
        })
        this.form.officalPrice = row.officalPrice
        this.$nextTick(() => {
          this.getSignedCarrierList()
          this.$forceUpdate()
        })
      } else {
        this.$message.warning('获取不到该套餐ID的相关信息')
      }
    },
    onCloseDialog() {
      const form = this.$refs.form
      if (form) {
        form.clearValidate()
        form.resetFields()
      }
      this.$emit('update:visible', false)
    },
    onConfirm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        let rst
        if (!this.isEdit) {
          const params = {
            priceOfferId: this.form.priceOfferId,
            cost: this.form.cost,
            rechargeCost: this.form.rechargeCost,
            monthDate: this.form.monthDate,
            cardCost: removeQuotes(JSON.stringify(adjustment(this.form.cardCost))),
            commissionType: this.form.commissionType
          }
          if (this.form.offerType !== 'pool-package') {
            params.carrierAccountId = this.form.carrierAccountId
          }
          rst = await this.jaxLib.salesComission.addComissionCost(params)
        } else {
          const params = {
            id: this.data.id,
            cost: this.form.cost,
            rechargeCost: this.form.rechargeCost,
            monthDate: this.form.monthDate,
            cardCost: removeQuotes(JSON.stringify(adjustment(this.form.cardCost))),
            commissionType: this.form.commissionType
          }
          rst = await this.jaxLib.salesComission.modifyComissionCost(params)
        }
        if (rst.success) {
          this.$message.success('操作成功！')
          this.$emit('refresh')
          this.onCloseDialog()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  overflow: hidden;
}
.el-form-item {
  width: 50%;
  float: left;
}
</style>
