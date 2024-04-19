<template>
  <div class="carrier-account-modify-detail wh__warp">
    <div>
      <div class="wh__header">
        <h2 class="wh__header--title">运营商账号变更申请</h2>
        <span class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div class="wh__body" v-loading="loading">
        <p>
          每一批次的卡若存在套餐分类不同、所属运营商账号不同、同时存在vpdn和普通卡、存在分离计费的卡，则不允许同一批次修改运营商账号。一次不能超过5000张卡。
        </p>
        <p class="warning">
          （此功能影响卡所有功能，请反复确认后再使用！）
        </p> <br>
        <el-form label-position="top" label-width="80px" :model="form" style="width: 250px;" :rules="formRule"
          ref="form">
          <el-form-item label="ICCID" prop="iccids">
            <el-input rows="6" :disabled="isShowDiff" v-model="form.iccids" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="" v-if="!isShowDiff">
            <el-button type="primary" @click="submitCheckForm()">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-show="isShowDiff" class="show-package-diff">
      <div class="flex">
        <div class="wh__card flex1 mr20">
          <div class="wh__card--header">变更前</div>
          <ul class="wh__card--body">
            <li><span class="title">有效卡数：</span> <span class="value" v-text="cardData.iccidCount"></span></li>
            <li><span class="title">所属运营商账号：</span> <span class="value" v-text="cardData.carrierAccountName"></span></li>
            <li><span class="title">所属套餐分类：</span> <span class="value" v-text="cardData.priceOfferCategoryName"></span></li>
            <li v-if="!id"><span class="title">套餐总价：</span> <span class="value" v-text="cardData.oldTotalPrice"></span></li>
          </ul>
        </div>
        <div class="wh__card flex1 mr20">
          <div class="wh__card--header">变更后</div>
          <ul class="wh__card--body">
            <li><span class="title">有效卡数：</span> <span class="value" v-text="cardData.iccidCount"></span></li>
            <li>
              <span class="title">所属运营商账号：</span>
              <wh-carrier-account-select
                v-if="!id"
                ref="accountSelect"
                @change="onAccountChange"
                :clearable="false"
                :disabledName="[cardData.carrierAccountName]"
                :carrier="cardData.carrier"
                v-model="cardData.carrierAccountId"
                size="small">
              </wh-carrier-account-select>
              <span v-else class="value" v-text="cardData.newCarrierAccountName"></span>
            </li>
            <li v-if="!id || (id && cardData.newPriceOfferCategoryName)">
              <span class="title">所属套餐分类：</span>
              <wh-classification-select
                v-if="!id"
                :disabled="disabledPlanClassification"
                @change="calcTotalPrice"
                :clearable="false"
                :carrier="cardData.carrier"
                size="small"
                v-model="cardData.priceOfferCategoryId">
              </wh-classification-select>
              <span v-else class="value" v-text="cardData.newPriceOfferCategoryName"></span>
            </li>
            <li v-if="!id"><span class="title">套餐总价：</span> <span class="value" v-text="cardData.newTotalPrice"></span></li>
            <li v-if="!id"><span class="title">选择功能费：</span> <span class="value">
              <el-radio-group v-model="hasFeatureFee">
                <el-radio :label="false">无</el-radio>
                <el-radio :label="true">有</el-radio>
              </el-radio-group>
            </span></li>
          </ul>
        </div>
      </div>
      <p class="warning" v-show="!id && cardData.newTotalPrice !== cardData.oldTotalPrice && cardData.newTotalPrice !== ''">
        变更后套餐价格不同，此操作不会做客户余额变更！
      </p> <br>
      <div v-if="!id">
        <el-button @click="lastStep">上一步</el-button>
        <el-button type="primary" :disabled="loading" @click="confirm">确认</el-button>
      </div>
      <div v-else>
        <p>操作人：{{cardData.operator}}</p>
        <p>操作时间：{{cardData.operatorTime | dateFilter}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  import { iccidsTransfer } from '@/global/function/iccids-tool'
  import WhCarrierAccountSelect from '@/page/components/wh-carrier-account-select'
  import WhClassificationSelect from '@/page/components/wh-classification-select'
  import { toolsMixin } from '@/global/mixins/table-selection'

  const SELECTION_STORAGE_KEY = 'whitehouse_card_manager'
  export default {
    name: 'carrier-account-modify-detail',
    mixins: [toolsMixin],
    components: {
      WhCarrierAccountSelect,
      WhClassificationSelect
    },
    data() {
      return {
        id: '',
        isShowDiff: false,
        loading: false,
        formRule: {
          iccids: [
            { required: true, message: '请输入iccid', trigger: 'blur' }
          ]
        },
        form: {
          iccids: ''
        },
        hasFeatureFee: false,
        categoryList: [],
        cardData: {
          carrier: '',
          iccids: '',
          carrierAccountId: '',
          priceOfferCategoryId: '',
          iccidCount: '',
          carrierAccountName: '',
          priceOfferCategoryName: '',
          newCarrierAccountName: '',
          newPriceOfferCategoryName: '',
          oldTotalPrice: '',
          newTotalPrice: '',
          operator: '',
          operatorTime: '',
          originalCarrierAccountId: ''
        },
        disabledPlanClassification: false,
        storageKey: SELECTION_STORAGE_KEY
      }
    },
    created() {
      this.id = this.$route.query.id
      if (this.id) {
        this.getData(this.id)
      }
      if (this.$route.query.from === 'card-list') {
        const selected = this.getSelected('iccid')
        if (selected.length) {
          this.form.iccids = selected.join('\n')
        }
      }
    },
    methods: {
      async getData(id) {
        const res = await this.jaxLib.card.getCarrierAccountModifications({ id })
        if (!res.success) return false
        this.isShowDiff = true
        this.form.iccids = res.data.iccids.replace(/,/g, '\n')
        this.cardData.iccidCount = res.data.iccidCount
        this.cardData.carrierAccountName = res.data.originCarrierAccount
        this.cardData.priceOfferCategoryName = res.data.originPriceOfferCategory
        this.cardData.newCarrierAccountName = res.data.targetCarrierAccount
        this.cardData.newPriceOfferCategoryName = res.data.targetPriceOfferCategory
        this.cardData.operator = res.data.operator
        this.cardData.operatorTime = res.data.operationTime.time
      },
      onAccountChange(v) {
        const fromAccountId = this.cardData.originalCarrierAccountId 
        const toAccountId = v
        let fromIsVpdn, toIsVpdn
        const accountList = this.$refs.accountSelect.getCarrierAccountList()
        for (let i = 0; i < accountList.length; i++) {
          if (accountList[i].id === fromAccountId) {
            fromIsVpdn = accountList[i].vpdnAccount
          }
          if (accountList[i].id === toAccountId) {
            toIsVpdn = accountList[i].vpdnAccount
          }
        }
        this.disabledPlanClassification = fromIsVpdn === toIsVpdn // fromIsVpdn和toIsVpdn为相同，则禁用变更后所属套餐分类，即可以不选
        if (fromIsVpdn === toIsVpdn) {
          this.cardData.priceOfferCategoryId = ''
        }
        this.calcTotalPrice()
      },
      submitCheckForm() {
        this.disabledPlanClassification = false
        this.$refs.form.validate(async valid => {
          if (!valid) return false
          const iccids = iccidsTransfer(this.form.iccids)
          if (iccids.length > 5000) {
            this.$message({ type: 'warning', message: '一次不能超过5000张卡' })
            return false
          }
          let res = await this.jaxLib.card.validateCarrierAccountModification({ iccids })
          if (!res.success) return false
          this.cardData.carrier = res.data.carrier
          this.cardData.iccidCount = res.data.iccidCount
          this.cardData.carrierAccountName = res.data.carrierAccountName
          this.cardData.priceOfferCategoryName = res.data.priceOfferCategoryName
          this.cardData.originalCarrierAccountId = res.data.carrierAccountId
          this.loadCarrierData()
        })
      },
      async loadCarrierData() {
        // 获取套餐总价
        let res = await this.jaxLib.card.calcuteTotalPriceOffer({
          iccids: iccidsTransfer(this.form.iccids)
        })
        if (!res.success) {
          return false
        }
        this.cardData.oldTotalPrice = res.data
        this.isShowDiff = true
      },
      backList() {
        window.history.go(-1)
      },
      lastStep() {
        this.isShowDiff = false
        this.cardData.carrierAccountId = this.cardData.priceOfferCategoryId = this.cardData.newTotalPrice = ''
      },
      async calcTotalPrice() {
        if (!this.cardData.carrierAccountId || !this.cardData.priceOfferCategoryId) {
          return false
        }
        const res = await this.jaxLib.card.calcuteTotalPriceOffer({
          iccids: iccidsTransfer(this.form.iccids),
          carrierAccountId: this.cardData.carrierAccountId,
          priceOfferCategoryId: this.cardData.priceOfferCategoryId
        })
        if (!res.success) {
          this.cardData.newTotalPrice = ''
          return false
        }
        this.cardData.newTotalPrice = res.data
      },
      async confirm() {
        if (!this.cardData.carrierAccountId) {
          this.$message.error('请选择运营商账号')
          return false
        }
        if (!this.disabledPlanClassification && !this.cardData.priceOfferCategoryId) {
          this.$message.error('请选择套餐分类')
          return false
        }
        const res = await this.jaxLib.card.modifyCarrierAccount({
          iccids: iccidsTransfer(this.form.iccids),
          carrierAccountId: this.cardData.carrierAccountId,
          priceOfferCategoryId: this.cardData.priceOfferCategoryId,
          hasFeatureFee: this.hasFeatureFee
        })
        if (!res.success) {
          return false
        }
        this.$router.push({ name: 'carrier-account-modify-list' })
      }
    }
  }
</script>
