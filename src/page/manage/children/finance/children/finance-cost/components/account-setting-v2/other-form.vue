<script>
  /**
   * Create by zeter on 2017/12/13
   */
  import moment from 'moment'

  import planForm from './plan-form.vue'
  export default {
    name: 'other-form',
    data() {
      return {
        otherForm: {
          monthlyForwardFirstMonthVolumeDiscountByDay: '',
          monthlyForwardFirstMonthFeeDiscountByDay: '',
          poolForwardFirstMonthVolumeDiscountByDay: '',
          poolForwardFirstMonthFeeDiscountByDay: '',
          poolForwardNotFirstMonthEnterPoolType: '',
          poolForwardFirstMonthEnterPoolType: '',
          poolForwardChargeVolumeFee: '',
          chargePlatformToCardSmsFee: '',
          chargeCardToPlatformSmsFee: '',
          monthlyForwardOverflowFee: '',
          customForwardOverflowFee: '',
          chargeCardToCardSmsFee: '',
          ignoreCustomerPackage: '',
          poolBackwardMinVolume: '',
          gmtCreated: '',
          creator: '',
          rates: []
        },
        otherFormBackup: {},
        otherFormRule: {},
        carrierConfig: {
          costingEvaluate: 'true',
          costingCalcMethod: ''
        },
        carrierConfigRule: {
          costingEvaluate: [
            { required: true, message: `请选择`, trigger: 'blur' }
          ],
          costingCalcMethod: [
            { required: true, message: `请选择`, trigger: 'blur' }
          ]
        },
        carrierConfigLabel: {},
        monthForm: {
          billMonth: '',
          billMoney: '',
          billUsedDataVolume: '',
          carrierBillDetailList: [],
          gmtCreated: ''
        },
        loading: false,
        time: '',
        carrierConfigItemList: [],
        selectedConfigRow: [],
        resourceTimeEnd: null
      }
    },
    props: {
      carrierAccount: {
        type: Number,
        default: 0
      },
      carrier: {
        default: String,
        require: true
      }
    },
    created() {
      Object.keys(this.otherForm).forEach(item => {
        this.otherFormRule[item] = [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      })
      this.otherFormBackup = Object.assign({}, this.otherForm)
    },
    methods: {
      // 拉取运营商下的参数
      async pullAccountList() {
        this.loading = true
        let rst = await this.jaxLib.cost.account.getCarrierConfigItem({
          carrier: this.carrier,
          accountId: this.carrierAccount
        })
        this.loading = false
        if (!rst.success) return false
        this.carrierConfigItemList = rst.data.map(item => ({ ...item, resourceTimeEnd: null, rate: 100, discount: 0, absolute: false }))
        this.carrierConfig = {
          costingEvaluate: 'true',
          costingCalcMethod: ''
        }
        this.otherForm = Object.assign({}, this.otherFormBackup)

        rst = await this.jaxLib.cost.account.getNewCarrierConfig({
          carrier: this.carrier,
          carrierAccountId: this.carrierAccount
        })
        if (!rst.success) return false
        if (rst.data) {
          // eslint-disable-next-line no-unused-vars
          for (let key in this.otherForm) {
            if (rst.data[key] !== undefined && rst.data[key] !== null) {
              this.otherForm[key] = rst.data[key].toString()
            }
          }
          let rates = {}
          rst.data.rates.forEach(item => {
            rates[item.id] = { resourceTimeEnd: item.resourceTimeEnd || null, value: item.value, absolute: item.absolute}
          })
          if (Object.keys(rates).length > 0 && this.carrierConfigItemList.length > 0) {
            this.carrierConfigItemList.forEach(item => {
              if (rates[item.id]) {
                item.rate = !(rates[item.id].absolute) ? rates[item.id].value : 100
                item.discount = rates[item.id].absolute ? rates[item.id].value : 0
                item.absolute = rates[item.id].absolute
                item.resourceTimeEnd = rates[item.id].resourceTimeEnd || null
              }
            })
          }
          this.otherForm.gmtCreated = rst.data.gmtCreated
          this.carrierConfig.costingEvaluate = rst.data.costingEvaluate.toString()
          this.carrierConfig.costingCalcMethod = rst.data.costingCalcMethod
        }
      },
      async validateForm(form) {
        return new Promise((resolve, reject) => {
          if (this.carrierConfig.costingEvaluate === 'false') { // 选择不启用该账号是不校验
            resolve()
          } else {
            this.$refs[form].validate(valid => {
              if (valid) {
                resolve()
              } else {
                reject()
              }
            })
          }
        })
      },
      // 保存账号数据
      async saveAccountData() {
        Promise.all([this.validateForm('carrierForm'), this.validateForm('otherForm')])
          .then(async() => {
            let postData = {}
            if (this.carrierConfig.costingEvaluate === 'true') {
              let hasError = false
              let rates = this.carrierConfigItemList.map((item, index) => {
                if ((!item.absolute && !item.rate && item.rate !== 0) && (item.absolute && !item.discount && item.discount !== 0)) {
                  hasError = true
                  this.$set(this.carrierConfigItemList[index], 'errMsg', '折扣和价格不能都为空')
                }
                const timeEnd = item.resourceTimeEnd ? { resourceTimeEnd: moment(item.resourceTimeEnd).format('YYYY-MM-DD') } : {}
                return {
                  id: item.id,
                  value: item.absolute ? Number(item.discount) : Number(item.rate),
                  absolute: item.absolute,
                  ...timeEnd
                }
              })
              if (hasError) return false
              postData = Object.assign({}, this.otherForm)
              postData.rates = rates
              // 这三个字段不校验，没填不传
              const keys = [ 'poolBackwardMinVolume', 'poolForwardChargeVolumeFee', 'ignoreCustomerPackage' ]
              keys.forEach(item => {
                if (postData[item] === '') {
                  delete postData[item]
                }
              })
            } else { // 选择该账号不启用时不校验, 传填的参数，不填的不传
              Object.keys(this.otherForm).forEach(item => {
                if (this.otherForm[item] !== '') {
                  postData[item] = this.otherForm[item]
                }
              })
              let rates = this.carrierConfigItemList
                .filter(item => (item.rate || item.rate === 0 || item.discount))
                .map(item => {
                  const timeEnd = item.resourceTimeEnd ? { resourceTimeEnd: moment(item.resourceTimeEnd).format('YYYY-MM-DD') } : {}
                  return {
                    id: item.id,
                    value: item.absolute ? Number(item.discount) : Number(item.rate),
                    absolute: item.absolute,
                    ...timeEnd
                  }
                })
              if (rates.length > 0) {
                postData.rates = rates
              }
            }
            postData.costingEvaluate = this.carrierConfig.costingEvaluate
            postData.costingCalcMethod = this.carrierConfig.costingCalcMethod
            delete postData.gmtCreated
            delete postData.creator
            let res = await this.jaxLib.cost.account.saveNewCarrierConfig({
              carrier: this.carrier,
              carrierAccountId: this.carrierAccount,
              carrierCostParam: JSON.stringify(postData)
            })
            if (!res.success) return false
            this.$message.success('保存数据成功')
            this.pullAccountList()
          })
      },
      // 拉取月账单数据
      async pullMonthData() {
        let rst = await this.jaxLib.cost.month.get({
          carrier: this.carrier,
          carrierAccountId: this.carrierAccount,
          billMonth: moment(this.monthForm.billMonth).set('date', 1).format('YYYY-MM-DD')
        })
        if (!rst.success) return false
        if (rst.data.carrierBill) delete rst.data.carrierBill.billMonth
        else rst.data.carrierBill = {}
        this.monthForm = {
          billMonth: this.monthForm.billMonth,
          ...rst.data.carrierBill,
          billMoney: rst.data.carrierBill.billMoney ? (rst.data.carrierBill.billMoney / 10000).toFixed(2) : 0,
          carrierBillDetailList: rst.data.carrierBillDetailList.length ? rst.data.carrierBillDetailList.map(e => {
            e.billMoney = e.billMoney ? e.billMoney / 10000 : ''
            return e
          }) : []
        }
      },
      // 保存月账单数据
      async saveMonthData() {
        let billPoolList = this.monthForm.carrierBillDetailList ? this.monthForm.carrierBillDetailList.map(e => {
          let newObject = { ...e }
          newObject.billMoney = e.billMoney ? (e.billMoney * 10000).toFixed(0) : ''
          return newObject
        }) : []
        let rst = await this.jaxLib.cost.month.save({
          carrier: this.carrier,
          carrierAccountId: this.carrierAccount,
          billMonth: moment(this.monthForm.billMonth).set('date', 1).format('YYYY-MM-DD'),
          billMoney: this.monthForm.billMoney ? (this.monthForm.billMoney * 10000).toFixed(0) : 0,
          billUsedDataVolume: this.monthForm.billUsedDataVolume || 0,
          carrierBillDetailList: JSON.stringify(billPoolList)
        })
        if (!rst.success) return false
        this.$message.success(`${moment(this.monthForm.billMonth).format('YYYY-MM')}月账单提交成功`)
        this.pullMonthData()
      },
      saveAll() {
        this.saveMonthData()
        this.saveAccountData()
      },
      handleSelectionChange(selectedRow) {
        this.selectedConfigRow = selectedRow.map(item => item.id)
      },
      handleChangeRate(row, index) {
        const { id, rate } = row
        if (rate) this.$set(this.carrierConfigItemList[index], 'errMsg', '')
        if (this.selectedConfigRow.length > 1 && this.selectedConfigRow.indexOf(id) > -1) {
          this.carrierConfigItemList.forEach(item => {
            if (this.selectedConfigRow.indexOf(item.id) > -1) {
              item.rate = rate
            }
          })
        }
      },
      onDiscountChange(row, index) {
        let { discount, rate, absolute, id } = row
        if (this.selectedConfigRow.length > 1 && this.selectedConfigRow.indexOf(id) > -1) {
          this.carrierConfigItemList.forEach(item => {
            let { discount, rate } = item
            if (this.selectedConfigRow.indexOf(item.id) > -1) {
              item.absolute = absolute
            }
          })
        }
      },
      handleResourceTimeEndChange(val) {
        this.carrierConfigItemList = this.carrierConfigItemList.map(item => {
          item.resourceTimeEnd = val ? moment(val).format('YYYY-MM-DD') : null
          return item
        })
      }
    },
    watch: {
      carrierAccount() {
        this.pullAccountList()
        this.pullMonthData()
        this.monthForm.billMonth = moment().format('YYYY-MM')
      }
    },
    mounted() {
      this.pullAccountList()
      this.monthForm.billMonth = moment().format('YYYY-MM')
    },
    components: {
      'plan-form': planForm
    }
  }
</script>

<template>
  <div class="wh__body" v-loading="loading">
    <div class="cost-setting__other--item">
      <div>
        <el-form ref="carrierForm" :model="carrierConfig" :rules="carrierConfigRule">
          <el-form-item label="启用该账号" prop="costingEvaluate">
            <el-radio-group v-model="carrierConfig.costingEvaluate">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="算法选择" prop="costingCalcMethod">
            <el-radio-group v-model="carrierConfig.costingCalcMethod">
              <el-radio label="FORWARDORUNICOM">前向/联通</el-radio>
              <el-radio label="BACKWARD">后向</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="float-right mb10 font14">
          批量设置资源有效期：
          <el-date-picker placeholder="请选择日期" v-model="resourceTimeEnd" @change="handleResourceTimeEndChange"></el-date-picker>
        </div>
        <el-table :data="carrierConfigItemList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="序号" width="50px" align="center">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="计费类型" prop="chargeTypeName" width="150"></el-table-column>
          <el-table-column label="计费规格" prop="chargeSpecification" width="140"></el-table-column>
          <el-table-column label="订购周期" prop="cardPeriod" width="120" align="center"></el-table-column>
          <el-table-column label="计费周期" prop="chargePeriodRegulation" width="120"></el-table-column>
          <el-table-column label="列价表(元)" prop="officialPrice" width="130"></el-table-column>
          <el-table-column label="折扣" align="center">
            <template slot-scope="scope">
              <span>
              <el-radio
                v-model="scope.row.absolute"
                :label="false"
                @change="onDiscountChange(scope.row, scope.$index)"
                style="width:40%;"
              >
                <el-input-number
                  size="mini"
                  :controls="true"
                  :min="0"
                  :max="100"
                  :disabled="scope.row.absolute"
                  v-model="scope.row.rate"
                  @change="handleChangeRate(scope.row, scope.$index)"
                >
                </el-input-number>
                <span style="color:#3d3e3f;">%</span>
                <div class="warning" style="margin-top:5px;font-size:11px;" v-if="scope.row.errMsg" v-text="scope.row.errMsg"></div>
              </el-radio>
              </span>
              <span>
              <el-radio
                v-model="scope.row.absolute"
                :label="true"
                @change="onDiscountChange(scope.row, scope.$index)"
                style="width:40%;margin-left:10%;">
                <el-input-number
                  size="mini"
                  :precision="2"
                  :step="0.01"
                  :min="0"
                  :controls="true"
                  :disabled="!scope.row.absolute"
                  v-model="scope.row.discount"
                  @change="handleChangeRate(scope.row, scope.$index)"
                >
                </el-input-number>
                <span style="color:#3d3e3f;">元</span>
                <div class="warning" style="margin-top:5px;font-size:11px;" v-if="scope.row.errMsg" v-text="scope.row.errMsg"></div>
              </el-radio>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="资源有效期" width="160" align="center">
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.resourceTimeEnd"
                size="mini"
                style="width: 100%"
                placeholder="请选择日期"
              >
              </el-date-picker>
            </template>
          </el-table-column>
        </el-table>
        <br>
        <el-form label-width="240px" label-position="left" :rules="otherFormRule" :model="otherForm" ref="otherForm"
          class="cost-setting__form">
          <p class="cost-setting__form__title">前向按月套餐卡，首月激活</p>
          <el-form-item class="cost-setting__form--compact" label="费用按日折算"
            prop="monthlyForwardFirstMonthVolumeDiscountByDay">
            <el-radio-group v-model="otherForm.monthlyForwardFirstMonthFeeDiscountByDay">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="cost-setting__form--compact" label="流量按日折算"
            prop="monthlyForwardFirstMonthFeeDiscountByDay">
            <el-radio-group v-model="otherForm.monthlyForwardFirstMonthVolumeDiscountByDay">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <p class="cost-setting__form__title">前向流量池套餐卡，首月激活</p>
          <el-form-item class="cost-setting__form--compact" label="费用按日折算"
            prop="poolForwardFirstMonthVolumeDiscountByDay">
            <el-radio-group v-model="otherForm.poolForwardFirstMonthFeeDiscountByDay">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="cost-setting__form--compact" label="流量按日折算" prop="poolForwardFirstMonthFeeDiscountByDay">
            <el-radio-group v-model="otherForm.poolForwardFirstMonthVolumeDiscountByDay">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="cost-setting__form--compact" label="新卡入池规则" prop="poolForwardFirstMonthEnterPoolType">
            <el-radio-group v-model="otherForm.poolForwardFirstMonthEnterPoolType">
              <el-radio label="INSTANT">立即入池</el-radio>
              <el-radio label="NEXT_DAY">次日入池</el-radio>
              <el-radio label="NEXT_MONTH">次月入池</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="cost-setting__form--compact" label="老卡入池规则" prop="poolForwardNotFirstMonthEnterPoolType">
            <el-radio-group v-model="otherForm.poolForwardNotFirstMonthEnterPoolType">
              <el-radio label="INSTANT">立即入池</el-radio>
              <el-radio label="NEXT_DAY">次日入池</el-radio>
              <el-radio label="NEXT_MONTH">次月入池</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="cost-setting__form--compact" label="前向按月套餐卡收取超额流量费"
            prop="monthlyForwardOverflowFee">
            <el-radio-group v-model="otherForm.monthlyForwardOverflowFee">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="cost-setting__form--compact" label="前向自定义卡收取超额流量费" prop="customForwardOverflowFee">
            <el-radio-group v-model="otherForm.customForwardOverflowFee">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <p class="cost-setting__form__title">短信</p>
          <el-form-item class="cost-setting__form--compact" label="平台—>卡 费用" prop="chargePlatformToCardSmsFee">
            <el-radio-group v-model="otherForm.chargePlatformToCardSmsFee">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="cost-setting__form--compact" label="卡—>平台 费用" prop="chargeCardToPlatformSmsFee">
            <el-radio-group v-model="otherForm.chargeCardToPlatformSmsFee">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="cost-setting__form--compact" label="卡—>卡 费用" prop="chargeCardToCardSmsFee">
            <el-radio-group v-model="otherForm.chargeCardToCardSmsFee">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <p class="cost-setting__form__title">其它</p>
          <el-form-item class="cost-setting__form--compact" label="后向流量池卡均最低消费流量">
            <el-input size="small" type="number" v-model="otherForm.poolBackwardMinVolume"></el-input> MB
          </el-form-item>
          <el-form-item class="cost-setting__form--compact" label="前向流量池卡是否收取流量费">
            <el-radio-group v-model="otherForm.poolForwardChargeVolumeFee">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="cost-setting__form--compact" label="是否忽略客户侧套餐情况">
            <el-radio-group v-model="otherForm.ignoreCustomerPackage">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-form label-width="120px" class="cost-setting__form" :inline="true">
          <el-form-item label="上次保存时间">
            <span class="cost-setting__form--created">
              {{otherForm.gmtCreated | dateFilter}} {{otherForm.creator}}
            </span>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" @click="saveAccountData">保存基本参数</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="cost-setting__other--item">
      <div>
        <el-form label-width="120px" class="cost-setting__form" :inline="true">
          <el-form-item label="账单年月">
            <el-date-picker
              @change="pullMonthData"
              v-model="monthForm.billMonth"
              type="month"
              :clearable="false"
              placeholder="选择月">
            </el-date-picker>
          </el-form-item>
          <br>
          <el-form-item label="账单费用">
            <el-input v-model="monthForm.billMoney" class="cost-setting__input">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="总流量">
            <el-input v-model="monthForm.billUsedDataVolume" class="cost-setting__input">
              <template slot="append">MB</template>
            </el-input>
          </el-form-item>
          <br>
          <el-form-item label="流量池费用">
            <div v-if="monthForm.carrierBillDetailList.length">
              <p v-for="item in monthForm.carrierBillDetailList" :key="item.refId">
                <span class="cost-setting__form--pool">名称: {{item.billName}}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;<span>流量费用</span>
                <el-input v-model="item.billMoney" placeholder="" class="cost-setting__input">
                  <template slot="append">元</template>
                </el-input>
                &nbsp;&nbsp;&nbsp;&nbsp;<span>流量使用量</span>
                <el-input v-model="item.billUsedDataVolume" placeholder="" class="cost-setting__input">
                  <template slot="append">M</template>
                </el-input>
                <br>
              </p>
            </div>
            <div v-else>暂无流量池</div>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-form label-width="120px" class="cost-setting__form" :inline="true">
          <el-form-item label="上次保存时间">
            <span class="cost-setting__form--created">{{monthForm.gmtModified | dateFilter}}</span>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" @click="saveMonthData">保存月账单</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <plan-form v-if="carrier==='unicom'" :carrierAccount="carrierAccount" :carrier="carrier">
    </plan-form>
  </div>
</template>
