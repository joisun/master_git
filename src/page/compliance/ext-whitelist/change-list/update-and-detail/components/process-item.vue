<template>
  <el-card style="margin-bottom: 10px">
    <template #header>
      {{ currentStatus | complianceStatusFilter }}
      <span
          v-if="isHistory"
          style="font-size: 14px; color: #666; margin-left: 20px; line-height: 100%"
      >
        处理人：{{ flowData.submitter }}
        <span style="margin-left: 10px"> 处理时间：{{ flowData.gmtCreated | dateFilter }} </span>
      </span>
    </template>
    <el-form
        ref="form"
        :model="formData"
        label-width="80px"
        size="small"
        label-position="top"
        :rules="formRules"
    >
      <el-form-item v-if="currentSchema.FILE" label="提交附件">
        <file-list :flow-no="flowNo"/>
      </el-form-item>
      <el-form-item v-if="currentSchema.SALE_PRICE_ALERT_LIST" label="套餐变更情况">
        <sale-price-alert-list
            :data="formData.salePriceChangeDTOList"
            :flow-no="flowNo"
            :is-history="isHistory"
            @change="salePriceAlertListChange"
        />
      </el-form-item>
      <template v-if="currentSchema.SALE_PRICE_SUM">
        <el-row>
          <el-col :span="6">
            <el-form-item label="所有卡套餐变更前总价">
              {{ calculateMoney(formData.salePriceChangeDTOList, 'origTotalMoney') }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所有卡套餐变更后总价">
              {{ calculateMoney(formData.salePriceChangeDTOList, 'targetTotalMoney') }}

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所有卡套餐变更总计变更金额">
              {{ calculateMoney(formData.salePriceChangeDTOList, 'changeMoney') }}
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template v-if="currentSchema.AUDIT_RESULT">
        <h4 style="margin-bottom: 12px; color: #666">{{ currentProcessStatusSchema.title }}</h4>
        <el-form-item prop="processStatus">
          <el-radio-group
              v-model="formData.processStatus"
              :disabled="isHistory"
              @change="handleProcessStatusChange"
          >
            <el-radio label="PASS">{{ currentProcessStatusSchema.pass }}</el-radio>
            <el-radio label="NOT_PASS">{{ currentProcessStatusSchema.reject }}</el-radio>
          </el-radio-group>
          <span v-if="formData.processStatus === 'NOT_PASS'" style="margin-left: 12px"
          >驳回到：<strong>{{ currentProcessStatusSchema.rejectTo }}</strong></span
          >
        </el-form-item>
      </template>
      <template v-if="currentSchema.IS_FREE">
        <h4 style="margin-bottom: 12px; color: #666">是否免单</h4>
        <el-form-item prop="isFree">
          <el-radio-group
              v-model="formData.isFree"
              :disabled="isHistory"
          >
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <template v-if="formData.processStatus !== 'NOT_PASS'">
        <template v-if="currentSchema.GROUP_NO_LIST">
          <group-no-list
              :data="formData.extWhiteGroupNoDTOList"
              :flow-no="flowNo"
              :form-data="formData"
              :is-history="isHistory"
              @change="groupNoListChange"
          />
        </template>
        <package-alert-group
            v-if="currentSchema.PACKAGE_ALERT_GROUP"
            :form-data="formData"
            :flow-no="flowNo"
            :is-history="isHistory"
            @change="packageGroupChange"
        />
        <package-alert-group-whitehouse
            v-if="currentSchema.PACKAGE_ALERT_GROUP_WH"
            :form-data="formData"
            :flow-no="flowNo"
            :flow-type="flowData.type"
            :is-history="isHistory"
            @change="packageGroupWHChange"
        />
        <template v-if="currentSchema.AUDIT_REMARK">
          <h4 style="margin-bottom: 12px; color: #666">
            {{ currentProcessStatusSchema.infoTitle }}
          </h4>
        </template>
      </template>
      <el-form-item :label="currentProcessStatusSchema.infoSubTitle" prop="remark">
        <el-input
            v-model="formData.remark"
            :disabled="isHistory"
            style="width: 300px"
            type="textarea"
            rows="4"
            placeholder="请输入审核的理由和说明信息"
        />
      </el-form-item>
      <el-form-item v-if="!isHistory && !['FINISHED', 'CLOSED'].includes(currentStatus)">
        <el-button type="primary" :loading="loading" @click="onSubmit">提交</el-button>
        <el-button v-if="canClose" type="danger" :loading="loading" @click="handleFlowClose"
        >关闭
        </el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import FileList from '@/page/compliance/ext-whitelist/change-list/update-and-detail/components/file-list.vue'
import SalePriceAlertList
  from '@/page/compliance/ext-whitelist/change-list/update-and-detail/components/sale-price-alert-list.vue'
import PackageAlertGroupWhitehouse
  from '@/page/compliance/ext-whitelist/change-list/update-and-detail/components/package-alert-group-whitehouse.vue'
import PackageAlertGroup
  from '@/page/compliance/ext-whitelist/change-list/update-and-detail/components/package-alert-group.vue'
import {iccidsTransfer} from '@/global/function/iccids-tool'
import current from '../../../../../components/card-lifecycle/current.vue'
import GroupNoList from '@/page/compliance/ext-whitelist/change-list/update-and-detail/components/group-no-list.vue'
import mixins from '@/page/compliance/ext-whitelist/mixins'

const processSchemas = {
  OPERATION_CHANGE_CONFIRMATION: {
    AUDIT_RESULT: 1,
    PACKAGE_ALERT_GROUP: 1,
    AUDIT_REMARK: 1
  }, // 运营确定变更
  CONTENT_REVIEW_SUBMISSION: {
    AUDIT_RESULT: 1,
    AUDIT_REMARK: 1
  }, // 提交内容审核
  OPERATOR_CHANGE_SUBMISSION: {
    FILE: 1,
    AUDIT_RESULT: 1,
    AUDIT_REMARK: 1
  }, // 提交运营商
  OPERATOR_CHANGE_FINISHED: {
    GROUP_NO_LIST: 1,
    AUDIT_RESULT: 1,
    AUDIT_REMARK: 1
  }, //运营商变更完成
  OPERATOR_CHANGE_CONFIRMATION: {
    AUDIT_RESULT: 1,
    AUDIT_REMARK: 1
  }, // 运营商变更确认
  WHITEHOUSE_OPERATOR_INFORMATION_CHANGE: {
    PACKAGE_ALERT_GROUP_WH: 1
  },
  PRICE_MODIFICATION_AFTER_SALES_CHANGE: {
    SALE_PRICE_ALERT_LIST: 1,
    SALE_PRICE_SUM: 1,
    AUDIT_RESULT: 1,
    AUDIT_REMARK: 1,
    IS_FREE: 1,

  }, // 销售修改变更后价格
  SALES_CONFIRMATION: {
    AUDIT_RESULT: 1,
    AUDIT_REMARK: 1
  }
}
const commonSubmitData = {
  flowNo: '',
  processStatus: 'PASS',
  extensions: '',
  remark: '同意'
}
const cardPriceOfferChangeDTOListKeys = {
  origPriceOfferId: '', //变更前套餐ID
  origCategoryName: '', //变更前套餐分类
  origOfferName: '', //变更前套餐规格
  origCarrierAccountId: 0, //变更前运营商账号ID
  origCarrierAccountName: '', //变更前运营商账号名称
  targetCategoryName: '', //变更后套餐分类
  targetOfferName: '', //变更后套餐规格
  targetPriceOfferId: '' //变更后套餐ID
  // poolEnabled: false // 流量池
}
const defaultProcessStatusSchema = {
  title: '审核结果',
  pass: '通过',
  reject: '驳回',
  rejectTo: '新增变更',
  infoTitle: '审核信息',
  infoSubTitle: '审核说明'
}
const processStatusSchema = {
  OPERATOR_CHANGE_SUBMISSION: {
    title: '提交结果',
    pass: '已提交',
    reject: '提交失败',
    rejectTo: '新增变更',
    infoTitle: '提交信息',
    infoSubTitle: '提交说明'
  },
  OPERATOR_CHANGE_CONFIRMATION: {
    ...defaultProcessStatusSchema,
    pass: '已确认',
    reject: '确认不通过',
    rejectTo: '提交运营商变更'
  },
  OPERATOR_CHANGE_FINISHED: {
    ...defaultProcessStatusSchema,
    pass: '已确认',
    reject: '确认不通过',
    rejectTo: '提交运营商变更'
  },
  PRICE_MODIFICATION_AFTER_SALES_CHANGE: {
    ...defaultProcessStatusSchema,
    title: '修改价格',
    pass: '已修改',
    reject: '未修改'
  }
}
const whiteHousePriceChangeDTOListKeys = {
  carrier: '',
  origCarrierAccountId: '',
  origDbType: '',
  origPlanName: '',
  targetCarrierAccountId: '',
  targetDbType: '',
  targetCarrierChargeCategoryId: '',
  hasFeatureFee: false,
  targetPlanName: ''
}
const submitSchemas = {
  OPERATION_CHANGE_CONFIRMATION: {
    ...commonSubmitData,
    cardPriceOfferChangeDTOList: []
  },
  CONTENT_REVIEW_SUBMISSION: {
    ...commonSubmitData
  },
  OPERATOR_CHANGE_SUBMISSION: {
    ...commonSubmitData,
    ossKey: ''
  },
  OPERATOR_CHANGE_FINISHED: {
    ...commonSubmitData,
    extWhiteGroupNoDTOList: []
  },
  OPERATOR_CHANGE_CONFIRMATION: {
    ...commonSubmitData
  },
  WHITEHOUSE_OPERATOR_INFORMATION_CHANGE: {
    ...commonSubmitData,
    whiteHousePriceChangeDTOList: []
  },
  PRICE_MODIFICATION_AFTER_SALES_CHANGE: {
    ...commonSubmitData,
    salePriceChangeDTOList: []
  },
  SALES_CONFIRMATION: {
    ...commonSubmitData
  }
}
export default {
  components: {
    GroupNoList,
    PackageAlertGroupWhitehouse,
    FileList,
    SalePriceAlertList,
    PackageAlertGroup
  },
  props: {
    loading: {
      type: Boolean,
      require: false,
      default: false
    },
    flowNo: {
      type: String,
      default: ''
    },
    isHistory: {
      type: Boolean,
      default: false
    },
    flowData: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  mixins: [mixins],
  data() {
    return {
      formRules: {
        iccids: [{required: true, message: '请输入ICCID', trigger: 'submit'}],
        processStatus: [{required: true, message: '请选择', trigger: 'submit'}],
        remark: [{required: true, message: '请输入审核的理由和说明信息', trigger: 'submit'}]
      },
      activeName: 'first',
      formData: {
        cardPriceOfferChangeDTOList: [],
        whiteHousePriceChangeDTOList: [],
        salePriceChangeDTOList: [],
        remark: '',
        isFree: 0
      }
    }
  },
  computed: {
    current() {
      return current
    },
    currentStatus() {
      return this.flowData.status
    },
    currentSchema() {
      return processSchemas[this.currentStatus] || {}
    },
    currentProcessStatusSchema() {
      return processStatusSchema[this.currentStatus] || defaultProcessStatusSchema
    }
  },
  created() {
    if (this.isHistory) {
      this.formData = {
        ...this.flowData
      }
      if (this.flowData.salePriceChangeDTOList && this.flowData.salePriceChangeDTOList.length > 0) {
        const data = this.flowData.salePriceChangeDTOList
        this.formData.isFree = data[0] && data[0].isFree ? data[0].isFree : 0
      }
    } else {
      this.formData = {
        ...this.formData,
        ...submitSchemas[this.currentStatus]
      }
    }
  },
  methods: {
    calculateMoney(list, field) {
      let total = 0

      // Iterate over each object in the list
      list.forEach((item) => {
        if (item[field]) {
          // Add the value (divided by 10000) to the total
          total += item[field]
        }
      })
      // Return the total, rounded to 2 decimal places
      return (total / 10000).toFixed(2)
    },
    handleProcessStatusChange(v) {
      if (v === 'PASS' && !this.formData.remark) {
        this.formData.remark = '同意'
      }
      if (v === 'NOT_PASS' && this.formData.remark === '同意') {
        this.formData.remark = ''
      }
    },
    packageGroupChange(data) {
      this.formData.cardPriceOfferChangeDTOList = data
    },
    salePriceAlertListChange(data) {
      this.formData.salePriceChangeDTOList = data
      this.formData.isFree = data[0] && data[0].isFree ? data[0].isFree : 0
    },
    packageGroupWHChange(data) {
      this.formData.whiteHousePriceChangeDTOList = data
    },
    groupNoListChange(data) {
      this.formData.extWhiteGroupNoDTOList = data
    },
    filterSubProp(key, data) {
      if (key === 'whiteHousePriceChangeDTOList') {
        return data.map((item) => {
          const params = {}
          Object.keys(whiteHousePriceChangeDTOListKeys).forEach((key) => {
            params[key] = item[key]
          })
          return params
        })
      }
      if (key === 'salePriceChangeDTOList') {
        return data.map((item) => {
          return {
            ...item,
            isFree: this.formData.isFree
          }
        })
      }
      if (key === 'iccids') {
        return iccidsTransfer(data).filter((item) => !!item)
      }
      return data
    },
    filterParams() {
      const params = {}
      Object.keys(submitSchemas[this.currentStatus]).forEach((key) => {
        params[key] = this.filterSubProp(key, this.formData[key])
      })
      params.flowNo = this.flowNo
      return params
    },
    async onSubmit() {
      await this.$refs.form.validate(async (valid) => {
        if (valid) {
          const res = await this.jaxLib.whitelist.complianceProcess(this.filterParams())
          if (res && res.success) {
            this.$message.success('提交成功')
            this.$router.go(-1)
          }
        }
      })
    }
  }
}
</script>
