<script>
  import echarts from 'echarts'
  import dateFormat from '@/global/filters/date-format'
  import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
  import { echartOption } from './mixins/const'
  export default {
    data() {
      return {
        form: {
          carrier: '',
          signedCarrierId: '',
          carrierAccountId: '',
          offerType: '',
          poolType: '',
          month: ''
        },
        signedCarrierList: [],
        poolTypeMap: {
          PRE_POOL: '前向流量池',
          BACK_POOL: '后向流量池',
          SINGLE_CARD: '单卡'
        },
        offerTypeMap: {
          monthly: '按月套餐',
          custom: '自定义套餐'
        }
      }
    },
    components: {
      whCarrierAccountSelect
    },
    mounted() {
      this.getHistory()
    },
    methods: {
      async getSignedCarrierList() {
        if (!this.form.carrier) return false
        let res = await this.jaxLib.store.signedCarrierListGet({ carrier: this.form.carrier })
        if (!res.success) return false
        this.signedCarrierList = res.data
      },
      handleCarrierChange() {
        if (this.form.carrier) {
          this.getSignedCarrierList()
        } else {
          this.form.signedCarrierId = ''
          this.form.carrierAccountId = ''
          this.signedCarrierList = []
        }
        this.getHistory()
      },
      async getHistory() {
        let params = Object.assign({}, this.form)
        if (params.month) {
          params.monthStart = dateFormat(params.month[0], 'YYYY-MM-DD')
          params.monthEnd = dateFormat(params.month[1], 'YYYY-MM-DD')
        } else {
          delete params.month
        }
        Object.keys(params).forEach(key => {
          if (!params[key]) {
            delete params[key]
          }
        })
        let res = await this.jaxLib.cost.statistic.getHistory(params)
        if (!res.success) return false
        this.drawDetail(res.data)
      },
      drawDetail(data) {
        let myChart = echarts.init(document.getElementById('poolDetail'))
        myChart.setOption(echartOption(data))
      }
    }
  }
</script>

<template>
  <div class="statistic-detail">
    <div class="statistic-detail__search">
      <el-date-picker
        size="small"
        v-model="form.month"
        type="monthrange"
        @change="getHistory"
        style="width: 185px;"
        range-separator="-"
        start-placeholder="开始月份"
        end-placeholder="结束月份">
      </el-date-picker>
      <el-select size="small" v-model="form.carrier" placeholder="请选择运营商" @change="handleCarrierChange" clearable>
        <el-option v-for="(key, val) in enums.carrier.maps()" :label="key" :key="val" :value="val"></el-option>
      </el-select>
      <el-select size="small" v-model="form.signedCarrierId" placeholder="请选择所属运营商" @change="getHistory" clearable>
        <el-option v-for="item in signedCarrierList" :label="item.name" :key="item.id" :value="item.id"></el-option>
      </el-select>
      <wh-carrier-account-select
        size="small"
        :carrier="form.carrier"
        v-model="form.carrierAccountId"
        @change="getHistory"
        :signedCarrierId="form.signedCarrierId">
      </wh-carrier-account-select>
      <el-select size="small" v-model="form.offerType" placeholder="请选择套餐类型" @change="getHistory" clearable>
        <el-option
          v-for="(key, val) in offerTypeMap"
          :disabled="val === 'custom' && ['PRE_POOL', 'BACK_POOL'].indexOf(form.poolType) > -1"
          :label="key"
          :key="val"
          :value="val">
        </el-option>
      </el-select>
      <el-select size="small" v-model="form.poolType" placeholder="请选择流量池类型" @change="getHistory" clearable>
        <el-option
          v-for="(key, val) in poolTypeMap"
          :disabled="form.offerType === 'custom' && ['PRE_POOL', 'BACK_POOL'].indexOf(val) > -1"
          :label="key"
          :key="val"
          :value="val">
        </el-option>
      </el-select>
    </div>
    <div class="info__detail">
      <div id="poolDetail" class="info__detail--canvas"></div>
    </div>
  </div>
</template>

<style lang="scss">
  .statistic-detail {
    .info__detail {
      width: 100%;
      height: 450px;
      margin-top: 30px;
      padding: 10px 0;

      &--canvas {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
