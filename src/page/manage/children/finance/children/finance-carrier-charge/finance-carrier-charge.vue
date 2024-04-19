<template>
  <div class="finance-carrier-charge">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">资费管理</h2>
      </div>
      <div class="wh__tabs">
        <el-tabs v-model="activeName" @tab-click="changeRoute">
          <el-tab-pane label="中国移动" name="cmcc"></el-tab-pane>
          <el-tab-pane label="中国联通" name="unicom"></el-tab-pane>
          <el-tab-pane label="中国电信" name="chinanet"></el-tab-pane>
          <el-tab-pane label="计费规则" name="rule"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="wh__body">
        <div v-if="activeName === 'rule'">
          <charge-rule :chargeRuleList="carrierChargeRuleList"></charge-rule>
        </div>
        <template v-else>
          <div class="tac mt20">
            <el-select v-model="carrierCharge" :disabled="isEdit" @change="changeCharge" class="float-left">
              <el-option :value="i.id" :label="i.chargeName" v-for="i in carrierChargeList" :key="i.id"></el-option>
            </el-select>
            <span> {{editChargeName}} </span>
            <el-button class="float-right ml10" @click="createCharge" v-if="!isEdit">新增</el-button>
            <el-button class="float-right ml10" type="primary" @click="editCharge" v-if="!isEdit && carrierCharge">编辑</el-button>
            <el-button class="float-right ml10" @click="cancelCreate" v-if="isEdit">取消</el-button>
            <el-button class="float-right ml10" type="primary" @click="sureCreate" v-if="isEdit">确认</el-button>
            <div class="clean-float"></div>
          </div>
          <div v-if="carrierCharge!== '' || isEdit" class="flex mt20">
            <carrier-charge-list class="flex4 mr20" v-model="chargeList" :carrierCharge="carrierCharge"
              :mode="isEdit" :carrier="activeName" :chargeRuleList="carrierChargeRuleList">
            </carrier-charge-list>
            <relation-carrier-account class="flex2" v-model="accountList" :carrierCharge="carrierCharge"
              :mode="isEdit" :carrier="activeName">
            </relation-carrier-account>
          </div>
          <div v-if="carrierCharge === '' && !isEdit" class="tac mt20 font20">
            请选择或新建资费表
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import carrierChargeList from './components/carrier-charge-list.vue'
  import relationCarrierAccount from './components/relation-carrier-account.vue'
  import chargeRule from './components/charge-rule.vue'
  import reg from '@/constant/regexps'

  export default {
    data() {
      return {
        activeName: 'cmcc',
        carrierCharge: '',
        carrierChargeList: [],
        mode: 'view',
        carrierChargeRuleList: [],

        // 编辑态字段
        editChargeName: '',
        chargeList: [],
        accountList: []
      }
    },
    computed: {
      isEdit() {
        return this.mode === 'edit'
      }
    },
    components: {
      carrierChargeList,
      relationCarrierAccount,
      chargeRule
    },
    methods: {
      async createCharge() {
        this.carrierCharge = ''
        this.editChargeName = ''
        this.mode = 'edit'
      },
      editCharge() {
        this.mode = 'edit'
      },
      // 取消创建
      async cancelCreate() {
        let k = this.carrierCharge
        this.$forceUpdate(() => {
          this.carrierCharge = '' // 用于置空一下筛选，用于切换
        })
        this.changeCharge(k)
        this.mode = 'view'
      },
      // 点击保存
      async sureCreate() {
        if (!this.accountList.length && !this.chargeList.length) {
          this.$message.error('请至少保存一条数据')
          return false
        }
        let data = {
          bindCarrierAccount: this.accountList,
          carrierChargeCategory: this.chargeList,
          carrier: this.activeName,
          chargeName: this.editChargeName
        }
        if (this.carrierCharge) data.carrierChargeId = this.carrierCharge
        let check = await this.checkChargeData(this.chargeList)
        if (check) return false
        if (!this.carrierCharge) {
          let rst = await this.checkNameRepeat(this.editChargeName)
          if (rst) {
            let rep = await this.writeChargeName()
            if (rep) {
              data.chargeName = this.editChargeName = rep
            } else return false
          }
        }
        await this.sendChargeData(data)
      },
      // 检查资费表选项
      async checkChargeData(data) {
        let error = false
        let errorTitle = ''
        data.map(e => {
          if (!e.chargeEntryId) {
            error = true
            errorTitle = '请选择续费类型'
          } else {
            let rule = this.carrierChargeRuleList.filter(i => i.id === e.chargeEntryId)[0]
            if (rule.chargeSpecification === 'POSITIVE' && !reg.realNumber.test(e.chargeSpecification)) {
              error = true
              errorTitle = '续费规则必须为正整数'
            }
            if ((rule.chargeSpecification === 'POSITIVE' || rule.chargeSpecification === 'NUMBER') && !e.chargeUnit) {
              error = true
              errorTitle = '续费规则单位必须选择'
            }
            if (rule.chargeSpecification === 'NUMBER' && e.chargeSpecification !== '-1' && !reg.realNumber.test(e.chargeSpecification)) {
              error = true
              errorTitle = '续费规则必须为正整数或选择无限大'
            }
            if (rule.chargeSpecification === 'VALUE' && !e.chargeSpecification.trim()) {
              error = true
              errorTitle = '续费规则不能为空'
            }
            if (rule.needValidity && !reg.positiveInteger.test(e.chargeValidity)) {
              error = true
              errorTitle = '请填写自定义套餐周期'
            }
            if (rule.allowCardPeriod && !reg.positiveInteger.test(e.cardPeriod)) {
              error = true
              errorTitle = '请填写有效的订购周期套餐周期'
            }
            if (!reg.longMoney.test(e.officialPrice)) {
              error = true
              errorTitle = '请输入正确的金额'
            }
          }
          return e
        })
        if (error) this.$message.error(errorTitle)
        return error
      },
      // 发送新增资费表请求并重置
      async sendChargeData(data) {
        let rst = await this.jaxLib.financial.carrierChargeSave(data)
        if (!rst.success) return false
        this.$message.success('资费表保存成功')
        this.mode = 'view'
        let k = this.carrierCharge
        this.carrierCharge = '' // 用于清除下当前的资费表数据
        await this.getChargeList()
        this.carrierCharge = k
      },
      async writeChargeName() {
        return new Promise(resolve => {
          this.$prompt(' ', '请输入资费表名称', {
            confirmButtonText: '确定',
            showCancelButton: false,
            closeOnClickModal: false,
            required: true,
            inputPattern: /^[^\s]+$/,
            inputErrorMessage: '请填写名称',
            closeOnPressEscape: false,
            beforeClose: async(action, instance, done) => {
              if (action === 'confirm') {
                let rst = await this.checkNameRepeat(instance.inputValue)
                if (rst) {
                  this.$message.error('资费表和现有资费表重复，请重新填写')
                } else {
                  done()
                }
              } else {
                resolve(false)
                done()
              }
            }
          }).then(({ value }) => {
            resolve(value)
          })
        })
      },
      async checkNameRepeat(name) {
        await this.getChargeList()
        if (name) {
          let len = this.carrierChargeList.filter(e => e.chargeName === name).length
          return !!len
        }
        return true
      },
      changeCharge(e) {
        if (!e) this.editChargeName = ''
        else {
          this.carrierCharge = Number(e)
          this.editChargeName = this.carrierChargeList.find(i => i.id === this.carrierCharge).chargeName
        }
      },
      changeRoute(e) {
        this.activeName = e.name
        this.carrierCharge = ''
        this.mode = 'view'
        this.getChargeList()
      },
      async getChargeRuleList() {
        let rst = await this.jaxLib.financial.carrierChargeRuleList()
        if (!rst.success) return false
        this.carrierChargeRuleList = rst.data
      },
      async getChargeList() {
        if (this.activeName === 'rule') return false
        let rst = await this.jaxLib.financial.getChargeCarrierList({
          carrier: this.activeName
        })
        if (!rst.success) return false
        this.carrierChargeList = rst.data || []
      }
    },
    mounted() {
      this.getChargeList()
      this.getChargeRuleList()
    }
  }
</script>
