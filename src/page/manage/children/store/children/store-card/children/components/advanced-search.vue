<script>
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
import moment from 'moment'

const cardStatusMap = {
  activation: '已激活',
  deactivation: '已停卡',
  level2: '库存',
  retired: '已销卡',
  testing: '可测试',
  retiring: '已提交销卡',
  retainNumber: '停机保号'
}

export default {
  components: {
    whCarrierAccountSelect
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    orgList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchForm: {},
      isSelectLoading: false,
      listRatePlan: [],
      expireDate: [],
      silenceDate: [],
      activationDeadline: [],
      cardTypeMap: {
        STANDARD: '标准套餐卡',
        CUSTOM: '自定义卡',
        POOL: '流量池卡'
      },
      cardStatusMap
    }
  },
  watch: {
    value(val) {
      this.$emit('input', val)
    }
  },
  created() {
    this.getListRatePlan()
  },
  methods: {
    confirm() {
      if (this.expireDate && this.expireDate.length === 2) {
        this.value.expireDateStart = moment(this.expireDate[0]).format('YYYY-MM-DD')
        this.value.expireDateEnd = moment(this.expireDate[1]).format('YYYY-MM-DD')
      } else {
        delete this.value.expireDateStart
        delete this.value.expireDateEnd
      }
      if (this.silenceDate && this.silenceDate.length === 2) {
        this.value.silenceStart = moment(this.silenceDate[0]).format('YYYY-MM-DD')
        this.value.silenceEnd = moment(this.silenceDate[1]).format('YYYY-MM-DD')
      } else {
        delete this.value.silenceStart
        delete this.value.silenceEnd
      }
      if (this.activationDeadline && this.activationDeadline.length === 2) {
        this.value.activationDeadlineStart = moment(this.activationDeadline[0]).format('YYYY-MM-DD')
        this.value.activationDeadlineEnd = moment(this.activationDeadline[1]).format('YYYY-MM-DD')
      } else {
        delete this.value.activationDeadlineStart
        delete this.value.activationDeadlineEnd
      }
      this.$emit('search')
    },
    async getOrgList(content) {
      if (!content) return false
      this.$emit('getOrgList', content)
    },
    handleOrgChange(value) {
      if (!value) {
        this.$emit('getOrgList', '')
      }
    },
    async getListRatePlan() {
      let rst = await this.jaxLib.store.listRatePlan()
      if (!rst.success) {
        return false
      }
      this.listRatePlan = rst.data.list
    },
    resetSearchForm() {
      this.expireDate = []
      this.silenceDate = []
      this.activationDeadline = []
      this.$emit('reset')
    },
    handleCarrierChange(val) {
      this.$emit('carrierChange', val)
    },
    handleImportCardTypeChange(val) {
      if (['STANDARD', 'CUSTOM'].indexOf(val) > -1) {
        this.value.sysPoolIds = ''
      }
    },
    handleCardTypeChange(val) {
      if (['STANDARD', 'CUSTOM'].indexOf(val) > -1) {
        this.value.poolIds = ''
      }
    }
  }
}
</script>

<template>
  <div class="card-manage-advanced-search">
    <el-form label-width="140px" :model="searchForm" class="highLevelSearch">
      <el-form-item label="运营商">
        <el-select
          v-model="value.carrier"
          clearable
          placeholder="运营商"
          @change="handleCarrierChange"
        >
          <el-option
            v-for="(key, val) in enums.carrier.maps()"
            :key="val"
            :label="key"
            :value="val"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运营商账号">
        <wh-carrier-account-select
          v-model="value.carrierAccountId"
          style="width: 100%"
          placeholder="运营商账号"
          :carrier="value.carrier"
        >
        </wh-carrier-account-select>
      </el-form-item>
      <el-form-item label="库存状态">
        <el-select v-model="value.stockStatus" placeholder="库存状态" clearable>
          <el-option
            v-for="(value, key) in enums.cardStoreStatus.maps()"
            :key="key"
            :label="value"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡状态">
        <el-select v-model="value.cardStatus" placeholder="卡状态" clearable>
          <el-option v-for="(value, key) in cardStatusMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键词">
        <el-input v-model.trim="value.search" placeholder="ICCID、电话号码、IMSI、IP地址或批次号">
        </el-input>
      </el-form-item>
      <el-form-item label="卡所属组织">
        <el-select
          v-model="value.orgId"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="客户账号、ID、手机号"
          :remote-method="getOrgList"
          :loading="isSelectLoading"
          @change="handleOrgChange"
        >
          <el-option
            v-for="item in orgList"
            :key="item.orgId"
            :label="item.orgName + '(' + item.orgId + ')'"
            :value="item.orgId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入库ID">
        <el-input v-model="value.importIds" placeholder="多个使用','分割"></el-input>
      </el-form-item>
      <el-form-item label="入库状态">
        <el-select v-model="value.importResult" placeholder="请选择" clearable>
          <el-option
            v-for="(value, key) in { success: '成功', fail: '失败' }"
            :key="key"
            :label="value"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运营商套餐规格">
        <el-select v-model="value.carrierPlanName" clearable>
          <el-option v-for="item in listRatePlan" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运营商侧沉默期">
        <el-date-picker
          v-model="activationDeadline"
          style="width: 100%"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          type="daterange"
        />
      </el-form-item>
      <el-form-item label="入库卡类型">
        <el-select
          v-model="value.importCardType"
          placeholder="请选择"
          clearable
          @change="handleImportCardTypeChange"
        >
          <el-option
            v-for="(value, key) in enums.ratePlanType.maps()"
            :key="key"
            :label="value"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入库所属流量池ID">
        <el-input
          v-model="value.sysPoolIds"
          placeholder="多个使用','分割"
          :disabled="value.importCardType === 'STANDARD' || value.importCardType === 'CUSTOM'"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="出库ID">
        <el-input v-model="value.exportIds" placeholder="多个使用','分割"></el-input>
      </el-form-item>
      <el-form-item label="当前卡套餐ID">
        <el-input v-model="value.priceOfferIds" placeholder="多个使用','分割"></el-input>
      </el-form-item>
      <el-form-item label="卡过期时间">
        <el-date-picker
          v-model="expireDate"
          style="width: 100%"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          type="daterange"
        />
      </el-form-item>
      <el-form-item label="客户侧沉默期">
        <el-date-picker
          v-model="silenceDate"
          style="width: 100%"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          type="daterange"
        />
      </el-form-item>
      <el-form-item label="客户侧卡类型">
        <el-select v-model="value.cardType" clearable @change="handleCardTypeChange">
          <el-option v-for="(value, key) in cardTypeMap" :key="key" :label="value" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户侧所属流量池ID">
        <el-input
          v-model="value.poolIds"
          placeholder="多个使用','分割"
          :disabled="value.cardType === 'STANDARD' || value.cardType === 'CUSTOM'"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="网络状态">
        <el-select v-model="value.gprsStatus" clearable>
          <el-option
            v-for="(value, key) in enums.gprsStatus.maps()"
            :key="key"
            :label="value"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运营商状态">
        <el-select v-model="value.physicalStatus" clearable>
          <el-option
            v-for="(value, key) in enums.physicalStatus.maps()"
            :key="key"
            :label="value"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="button-wrapper">
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button @click="resetSearchForm">清空</el-button>
    </div>
  </div>
</template>

<style lang="scss">
.card-manage-advanced-search {
  padding-bottom: 60px;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .el-form {
    padding: 0 20px;
    flex: 1;
    overflow-y: scroll;
  }

  .el-select,
  .el-input,
  .el-date-picker {
    width: 100%;
  }

  .button-wrapper {
    height: 80px;
    padding: 15px 25px;
    border-top: 1px solid #efefef;
    background-color: #fff;
    text-align: right;
    margin-right: 10px;
  }
}
</style>
