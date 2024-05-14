<script>
/**
   * Create by zeter on 2018/1/12
   */
  export default {
    data() {
      return {
        rateOptimizeShow: false,
        rateOptimize: {
          allowance: '',
          receiver: ''
        },
        unicomForm: {
          ratePlanDiscount: '',
          packageDiscount: ''
        },
        planEditList: [
          { price: '', dataVolume: '', planName: '', ratePlanOptimize: true }
        ],
        packageEditList: [
          { price: '', dataVolume: '', planName: '', ratePlanOptimize: true }
        ]
      }
    },
    props: {
      carrierAccount: {
        default: String,
        require: true
      },
      carrier: {
        default: String,
        require: true
      }
    },
    watch: {
      carrierAccount() {
        this.queryData()
      }
    },
    methods: {
      // 打开资费优化窗口
      calculator() {
        this.rateOptimize = {
          allowance: '',
          receiver: ''
        }
        this.rateOptimizeShow = true
      },
      // 进行资费优化
      async sureCalculator() {
        let rst = await this.jaxLib.cost.plan.run({
          ...this.rateOptimize,
          carrierAccountId: this.carrierAccount
        })
        if (!rst.success) return false
        this.rateOptimizeShow = false
        this.$message.success('联通资费优化已经开始计算，计算结果将发送到指定邮箱')
      },
      // 查询数据
      async queryData() {
        this.loading = true
        let rst = await this.jaxLib.cost.plan.get({ carrierAccountId: this.carrierAccount })
        this.loading = false
        if (!rst.success) return false
        this.planEditList = []
        this.packageEditList = []
        rst.data.list.map(e => {
          let i = {
            id: e.id,
            price: e.price / 10000,
            planName: e.planName,
            dataVolume: e.dataVolume,
            ratePlanOptimize: e.ratePlanOptimize
          }
          if (e.type === 'package') this.packageEditList.push(i)
          else this.planEditList.push(i)
        })
        if (this.planEditList.length === 0) {
          this.planEditList.push({ price: '', dataVolume: '', planName: '', ratePlanOptimize: true })
        }
        if (this.packageEditList.length === 0) {
          this.packageEditList.push({ price: '', dataVolume: '', planName: '', ratePlanOptimize: true })
        }
      },
      // 保存账号数据
      async save() {
        if (this.planEditList.length === 1 && (!this.planEditList[0].dataVolume || !this.planEditList[0].planName)) {
          this.$message.warning('请输入至少一个有效的套餐值')
          return false
        }
        let ratePlanListName = [...this.planEditList.map(i => {
          let newObj = { ...i }
          newObj.price = (i.price * 10000).toFixed(0)
          return newObj
        }), ...this.packageEditList.map(i => {
          let newObj = { ...i }
          newObj.price = (i.price * 10000).toFixed(0)
          return newObj
        })]
        let resetRatePlanListName = ratePlanListName.filter(e => e.dataVolume && e.planName)
        let rst = await this.jaxLib.cost.plan.save({
          carrierAccountId: this.carrierAccount,
          ratePlanList: JSON.stringify(resetRatePlanListName)
        })
        if (!rst.success) return false
        this.$message.success('保存数据成功')
        this.queryData()
      }
    },
    mounted() {
      this.queryData()
    }
  }
</script>

<template>
  <div class="cost-setting__other--item">
    <el-form label-width="120px" class="cost-setting__form">
      <el-form-item label="套餐">
        <div v-for="(item, index) in planEditList" :key="index" class="cost-setting__other--item-list">
          <el-checkbox v-model="item.ratePlanOptimize">资费优化</el-checkbox>
          <el-input v-model="item.price" :disabled="true">
            <template slot="append">元(标准价)</template>
          </el-input>
          <el-input v-model="item.dataVolume" :disabled="true">
            <template slot="append">MB/月</template>
          </el-input>
          <el-input v-model="item.planName" placeholder="计划名称" :disabled="true"
            class="cost-setting__other--item-long">
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label="加油包">
        <div v-for="(item, index) in packageEditList" :key="index" class="cost-setting__other--item-list">
          <el-checkbox v-model="item.ratePlanOptimize">资费优化</el-checkbox>
          <el-input v-model="item.price" :disabled="true">
            <template slot="append">元(标准价)</template>
          </el-input>
          <el-input v-model="item.dataVolume" :disabled="true">
            <template slot="append">MB/月</template>
          </el-input>
          <el-input v-model="item.planName" placeholder="计划名称" :disabled="true"
            class="cost-setting__other--item-long">
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="save">保存资费参数</el-button>
        <el-button type="primary" @click="calculator">开始计算</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="提示" :visible.sync="rateOptimizeShow">
      <span>资费优化</span>
      <el-form>
        <el-form-item label="余量">
          <el-input v-model="rateOptimize.allowance">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="发送邮箱">
          <el-input v-model="rateOptimize.receiver" >
          </el-input>
        </el-form-item>
      </el-form>
      <el-button @click="rateOptimizeShow = false">取 消</el-button>
      <el-button type="primary" @click="sureCalculator">确 定</el-button>
    </el-dialog>

  </div>
</template>
