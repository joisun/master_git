<script>
  import regexps from '@/constant/regexps'
  import { mapState } from 'vuex'
  import { round } from 'lodash'

  export default {
    name: 'order-change',
    data() {
      return {
        isAllDisable: false,
        isSeller: false,
        content: {},
        queryList: [],
        queryCopyList: null,
        loading: false,
        form: {
          orderNo: '',
          remark: '',
          freeShipping: false,
          logisticsFee: '',
          logisticsCompany: '',
          freightCollect: false,
          orderType: 'PRODUCTION'
        },
        freightCollectDisabled: false,
        freeShippingDisabled: false,
        logisticsFeeDisabled: false,
        formRule: {
          logisticsCompany: [{
            validator: (rule, value, callback) => {
              if (value === '') return callback(new Error('请选择快递公司'))
              callback()
            },
            trigger: 'change'
          }],
          logisticsFee: [{
            validator: (rule, value, callback) => {
              let moneyReg = regexps.money
              if (value === '') return callback(new Error('请填写邮费金额'))
              if (!moneyReg.test(value)) return callback(new Error('请填写符合要求的金额'))
              callback()
            },
            trigger: 'change'
          }],
          remark: [{
            validator: (rule, value, callback) => {
              if (!value.trim()) return callback(new Error('请填写备注'))
              callback()
            },
            trigger: 'change'
          }]
        }
      }
    },
    computed: {
      billId() {
        return this.$route.query.id
      },
      options() {
        return this.enums.logisticsCompany.includes('中通', '顺丰', '自提').maps()
      },
      orderMoney() {
        return this.queryList.reduce((value, e) => {
          return Number(e.changeMoney) + Number(e.changeCardFee) + Number(e.changeSmsFee) + Number(e.changeNetworkRate) * Number(e.changeMoney) / 100 + value
        }, 0).toFixed(2)
      },
      totalMoney() {
        if (this.form.freightCollect) return (Number(this.orderMoney)).toFixed(2)
        return ((Number(this.orderMoney * 10000) + Number(this.form.logisticsFee * 10000)) / 10000).toFixed(2)
      },
      ...mapState({
        user: state => state.overall.user
      }),
      // isSeller() {
      //   return this.user.category === 'seller'
      // },
      beforeOrderFee(){
        return (this.queryList.reduce((value, e) => {
          return value + Number(e.totalMoney)
        }, 0)) / 10000
      },
    },
    methods: {
      // 返回页面
      backPage() {
        this.$router.go(-1)
      },
      async getAuthInfo() {
        const res = await this.jaxLib.bill.modifyLogisticsAuth({})
        this.isSeller = res.data.onlyFreight
        this.isAllDisable = !res.data.all && !res.data.onlyFreight
      },
      // 查询订单
      async searchBill() {
        let rst = await this.jaxLib.bill.query({
          orderNo: this.billId,
          pageSize: '1',
          pageIndex: '1',
          enableFilter: 'off'
        })
        if (!rst.success) return false
        if (rst.data.list.length === 0) {
          this.$message.warning('没有找到订单')
        } else {
          this.content = rst.data.list[0]
          this.form.freightCollect = !!this.content.freightCollect
          this.form.freeShipping = !!this.content.freeShipping
          this.form.logisticsFee = Number(this.content.logisticsFee / 10000).toFixed(2)
          this.form.logisticsCompany = this.content.logisticsCompany
          this.form.orderType = this.content.cardType
        }
         if (this.form.logisticsCompany === '自提') {
           this.freightCollectDisabled = true
           this.freeShippingDisabled = true
           this.logisticsFeeDisabled = true
           this.form.freightCollect = false
           this.form.logisticsFee = 0
         }
      },
      // 查询订单要求
      async getBillQuery() {
        let rst = await this.jaxLib.bill.specification.get(this.billId)
        if (!rst.success) {
          this.$message.error(rst.message)
          return false
        }
        this.queryList = rst.data.list.map(e => {
          e.changeMoney = Number(this.categoryPrice(e) * e.buyCount).toFixed(2)
          e.changeCardFee = Number(e.cardFee / 10000).toFixed(2)
          e.changeNetworkRate = (Number(e.networkRate) * 100).toFixed(2)
          e.changeSmsFee = Number(this.smsFee(e)).toFixed(2)
          return e
        })
      },
      // 点击免单
      onClickFree() {
        this.queryList = this.queryList.map(e => {
          e.changeMoney = 0
          e.changeCardFee = 0
          e.changeNetworkRate = 0
          e.changeSmsFee = 0
          return e
        })
        // this.form.freeShipping = false
      },
      // 修改订单
      changeOrder() {
        let valid = true
        let ob = this.queryList.map(e => {
          if (e.changeMoney === '' || !regexps.money.test(e.changeMoney)) {
            this.$message.error('请填写正确的价格')
            valid = false
          }
          if (e.changeCardFee === '' || !regexps.money.test(e.changeCardFee)) {
            this.$message.error('请填写正确的卡费')
            valid = false
          }
          return {
            bcsId: e.id,
            ratePlanTotalFee: (e.changeMoney * 10000).toFixed(0),
            cardFee: (e.changeCardFee * 10000).toFixed(0),
            networkRate: (Number(e.changeNetworkRate) / 100).toFixed(4),
            smsFee: (e.changeSmsFee * 10000).toFixed(0)
          }
        })
        if (!valid) return false
        this.$refs.formRule.validate(async valid => {
          if (valid) {
            let rst = await this.jaxLib.bill.changeBill({
              orderNo: this.billId,
              remark: this.form.remark,
              logisticsFee: (this.form.freightCollect) ? 0 : (this.form.logisticsFee * 10000).toFixed(0),
              logisticsCompany: this.form.logisticsCompany,
              freeShipping: Boolean(this.form.freeShipping),
              freightCollect: Boolean(this.form.freightCollect),
              orderType: this.form.orderType,
              price: ob
            })
            if (!rst.success) return false
            this.$message.success(`订单${this.form.orderNo}修改成功`)
            this.loading = true
            await [this.searchBill(), this.getBillQuery()]
            this.loading = false
          }
        })
      },
      // 改变到付情况
      changeCollect() {
        if (!this.form.freightCollect) {
          this.queryLogisticsMoney(this.form.logisticsCompany)
        } else {
          this.form.logisticsFee = 0
        }
      },
      // 改变快递公司
      changeCompany(val) {
        if (val === '自提') {
          this.freightCollectDisabled = true
          this.freeShippingDisabled = true
          this.logisticsFeeDisabled = true
          this.form.freightCollect = false
          this.form.logisticsFee = 0
        } else {
          this.freightCollectDisabled = false
          this.freeShippingDisabled = false
          this.logisticsFeeDisabled = false
          this.queryLogisticsMoney(val)
        }
      },
      // 是否包邮
      changeFreeShipping(value) {
        if (!value) {
          this.queryLogisticsMoney(this.form.logisticsCompany)
        } else {
          this.form.logisticsFee = 0
        }
      },
      // 查询邮费
      async queryLogisticsMoney(logisticsCompany) {
        try {
          const param = {
            orderNo: this.billId,
            logisticsCompany: logisticsCompany
          }
          let result = await this.jaxLib.bill.specification.queryLogisticsMoney(param)
          if (!result.success) return
          const  { logisticsFee } = result.data
          if (logisticsFee === 0) {
            this.form.freeShipping = true
          } else {
            this.form.freeShipping = false
          }
          this.form.logisticsFee = (logisticsFee / 10000).toFixed(2)
        } catch (error) {
          console.log(error)
        }
      },
      categoryPrice(item) {
        let { rechargeUnit, validity, ratePlanType, ratePlanDiscountPrice } = item
        let rechangeNum = Number(validity) / Number(rechargeUnit)
        return item.ratePlanType === 'MONTHLY' ? (Number(item.ratePlanDiscountPrice) * rechangeNum) / 10000 : Number(item.ratePlanDiscountPrice) / 10000
      },
      smsFee(item) {
        let { totalMoney, supportSms, yearlySmsPackage, monthlySmsPackage, cardFee, networkRate, buyCount } = item
        if (!totalMoney) return 0
        let categoryTotalFee = (this.categoryPrice(item)) * 10000 * Number(buyCount)
        return round((totalMoney - cardFee - categoryTotalFee - categoryTotalFee * Number(networkRate))/10000, 2)

      },
      onOrderTypeChange(value) {
        if (value === 'TESTING') {
          this.queryCopyList = JSON.parse(JSON.stringify(this.queryList))
          this.queryList = this.queryList.map(e => {
          e.changeMoney = 0
          e.changeCardFee = 0
          e.changeNetworkRate = 0
          e.changeSmsFee = 0
          return e
        })
        } else {
          if (this.queryCopyList) this.queryList = this.queryCopyList
          this.queryLogisticsMoney(this.form.logisticsCompany)
        }
      }
    },
    async created() {
      this.loading = true
      await new Promise.all([this.getAuthInfo(),this.searchBill(), this.getBillQuery()])
      this.loading = false
    }
  }
</script>

<template>
  <div class="order-change">
    <div class="wh__warp">
      <div>
        <div class="wh__header">
          <h2 class="wh__header--title">订单修改</h2>
          <span class="wh__header--close">
            <wh-std-icon sign="xe6aa" @click="backPage"></wh-std-icon>
          </span>
        </div>
      </div>
      <div class="wh__body">
        <div>
          <p>订单号: {{billId}}</p>
          <div class="flex mt10">
            <div class="flex1">客户名称: {{content.orgName}}</div>
            <div class="flex1">订单状态: {{content.status | orderStatusFilter}}</div>
            <div class="flex1">快递公司: {{content.logisticsCompany}}</div>
          </div>
          <div class="order-change__table">
            <div class="order-change__table--header flex">
              <div class="flex7 flex">
                <div class="flex3 cell first-cell">套餐</div>
                <div class="flex1 cell">套餐单价</div>
                <div class="flex1 cell">订购周期</div>
                <div class="flex1 cell">卡数</div>
                <div class="flex1 cell">单张卡费</div>
                <div class="flex1 cell">网络增值服务费(%)</div>
                <div class="flex1 cell">短信费用</div>
                <div class="flex1 cell">套餐总价</div>
              </div>
              <div class="flex1 flex">
                <div class="cell">订单总价</div>
              </div>
              <div class="flex3 flex">
                <div class="cell flex1">修改总卡费(元)</div>
                <div class="cell flex1">修改网络增值服务费(%)</div>
                <div class="cell flex1">修改短信费用(元)</div>
                <div class="cell flex1">修改套餐总价(元)</div>
              </div>
            </div>
            <div class="order-change__table--body flex">
              <div class="flex7">
                <div class="flex1 flex" v-for="i in queryList" :key="i.volume + i.ratePlanType + i.validity">
                  <div class="flex3 cell first-cell">
                    {{i.carrier | carrierFilter }}
                    {{i.priceOfferCategory ? i.priceOfferCategory.name : ''}}
                    <span v-tag-extract="{
                      offerType: i.ratePlanType,
                      validity: (i.ratePlanType === 'CUSTOM') ? (i.validity / i.rechargeUnit) : i.validity,
                      validityUnit: i.validityUnit,
                      volume: i.volume,
                      unlimited: i.unlimitedVolume}">
                    </span>
                  </div>
                  <div class="flex1 cell">
                    <!-- 套餐单价 -->
                    <span>
                      {{ Number(i.ratePlanDiscountPrice)/10000 | numberFilter }}
                    </span>
                  </div>
                  <!-- 订购周期 -->
                  <div class="flex1 cell">
                    <span v-if="i.ratePlanType === 'MONTHLY'">{{i.validity}}月</span>
                    <span v-else>{{i.rechargeUnit}}份</span>
                  </div>
                  <!-- 卡数 -->
                  <div class="flex1 cell">{{i.buyCount}}</div>
                  <!-- 单张卡费 -->
                  <div class="flex1 cell">
                    {{(Number(i.cardFee) / Number(i.buyCount) / 10000) | numberFilter}}
                  </div>
                  <!-- 网络增值服务费 -->
                  <div class="flex1 cell">
                    {{ (Number(i.networkRate) * 100).toFixed(2) }}
                  </div>
                  <!-- 短信费用 -->
                  <div class="flex1 cell">
                    {{ smsFee(i) | numberFilter }}
                  </div>
                  <!-- 当前套餐总价 -->
                  <div class="flex1 cell">
                    {{ (categoryPrice(i) * i.buyCount) | numberFilter }}元
                  </div>
                </div>
              </div>
              <!-- 订单总价 -->
              <div class="flex1 flex">
                <div class="cell flex1" style="text-align: center;">
                  {{ beforeOrderFee | numberFilter}}元
                </div>
              </div>
              <div class="flex3 flex">
                <div class="flex flex1" v-for="(i, index) in queryList" :key="i.volume + i.ratePlanType + i.validity">
                  <!-- 修改总卡费 -->
                  <div class="flex1 cell">
                    <el-input
                      size="small"
                      class="order-change__table--input"
                      v-model="queryList[index].changeCardFee"
                      :disabled="isSeller ||isAllDisable"
                      type="number">
                    </el-input>
                  </div>
                  <!-- 修改网络增值服务费 -->
                  <div class="flex1 cell">
                    <el-input
                      size="small"
                      class="order-change__table--input"
                      v-model="queryList[index].changeNetworkRate"
                      :disabled="isSeller || (queryList[index].netProductType).length === 0 || isAllDisable"
                      type="number">
                    </el-input>
                  </div>
                  <!-- 修改短信费用 -->
                  <div class="flex1 cell">
                    <el-input
                      size="small"
                      class="order-change__table--input"
                      v-model="queryList[index].changeSmsFee"
                      :disabled="isAllDisable|| isSeller || !(queryList[index].supportSms) || (queryList[index].supportSms && !(queryList[index].yearlySmsPackage) && !(queryList[index].monthlySmsPackage))"
                      type="number">
                    </el-input>
                  </div>
                  <!-- 修改套餐价格 -->
                  <div class="flex1 cell">
                    <el-input
                      size="small"
                      class="order-change__table--input"
                      v-model="queryList[index].changeMoney"
                      :disabled="isSeller || isAllDisable"
                      type="number"
                    >
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-form label-width="80px" :rules="formRule" ref="formRule" :model="form" class="tool__order--item">
          <el-form-item label="订单总价(修改后)" label-width="130px">
            <el-input :value="orderMoney" style="width: 250px;" :disabled="isSeller || isAllDisable">
            </el-input>
            <el-button @click="onClickFree" :disabled="isSeller || isAllDisable">
              免单
            </el-button>
          </el-form-item>
          <el-form-item label="订单类型">
            <el-select
              v-model="form.orderType"
              :disabled="isSeller || isAllDisable"
              @change="onOrderTypeChange">
              <el-option label="测试卡" value="TESTING">
              </el-option>
              <el-option label="正式卡" value="PRODUCTION">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="快递公司" prop="logisticsCompany">
            <el-select v-model="form.logisticsCompany" placeholder="请选择快递公司" @change="changeCompany" :disabled="isAllDisable">
              <el-option v-for="(label, value) in options" :label="label" :value="value" :key="value">
              </el-option>
            </el-select>
            <el-checkbox v-model="form.freightCollect" @change="changeCollect" :disabled="freightCollectDisabled || isAllDisable">
              到付
            </el-checkbox>
          </el-form-item>
          <el-form-item label="是否包邮" v-if="!form.freightCollect && !freeShippingDisabled">
            <el-select v-model="form.freeShipping" :disabled="isSeller || isAllDisable" @change="changeFreeShipping">
              <el-option label="包邮" :value="true">
              </el-option>
              <el-option label="不包邮" :value="false">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮费" prop="logisticsFee" style="width: 250px;"
            v-if="(!form.freightCollect && !form.freeShipping) && !logisticsFeeDisabled">
            <el-input v-model="form.logisticsFee" placeholder="请输入邮费金额"  :disabled="isSeller || isAllDisable">
            </el-input>
          </el-form-item>
          <el-form-item label="合计" prop="totalMoney" style="width: 250px;">
            <el-input :value="totalMoney" placeholder="请输入邮费金额" :disabled="isSeller || isAllDisable">
            </el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="" type="textarea" :disabled="isAllDisable">
            </el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="changeOrder">确定修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
