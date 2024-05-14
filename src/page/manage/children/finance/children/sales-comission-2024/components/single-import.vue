<script>
import whSalesSelect from '@/page/components/wh-sales-select.vue'
import dateFormat from '@/global/filters/date-format'

const DEFAULT_FORM_DATA = JSON.stringify({
  orgId: '',
  saleName: '',
  orderType: '',
  type: '',
  orderNo: '',
  transactionDate: '',
  income: undefined,
  cost: undefined,
  commission: undefined,
  remark: ''
})
export default {
  components: { whSalesSelect },
  data() {
    return {
      content: {},
      formData: JSON.parse(DEFAULT_FORM_DATA),
      visible: false,
      isConfirming: false,
      orgNameList: [],
      rules: {
        orgId: [{ required: true, message: '请选择客户ID' }],
        saleName: [{ required: true, message: '请选择所属销售' }],
        orderType: [{ required: true, message: '请选择订单类型' }],
        type: [{ required: true, message: '请选择收入类型' }],
        transactionDate: [{ required: true, message: '请选择交易时间' }],
        income: [{ required: true, message: '请输入收入金额' }],
        cost: [{ required: true, message: '请输入成本' }],
        commission: [{ required: true, message: '请输入提成' }],
        remark: [{ required: true, message: '请输入原因' }]
      }
    }
  },
  methods: {
    async queryOrgAsync(queryString) {
      this.formData.orgName = ''
      const res = await this.jaxLib.customer.list.get(
        {
          pageIndex: 1,
          pageSize: 100,
          orgName: queryString,
          saler: ''
        },
        false
      )
      if (!res.success) return false
      this.orgNameList = res.data.list.map((e) => ({
        id: e.id,
        orgName: e.orgName,
        saleName: e.saleName
      }))
    },
    cancel() {
      this.formData = JSON.parse(DEFAULT_FORM_DATA)
      this.$refs.form.resetFields()
      this.content = {}
      this.isConfirming = false
      this.visible = false
    },
    open(content) {
      this.content = content
      this.visible = true
    },
    async submit() {
      if (this.isConfirming) {
        let res = await this.jaxLib.salesComission.salesCommission2024.addDetail({
          ...this.formData,
          monthDate: this.content.monthDate,
          transactionDate: dateFormat(this.formData.transactionDate, 'YYYY-MM-DD')
        })
        if (res && res.success) {
          this.$message({ type: 'success', message: '操作成功' })
          this.cancel()
          this.visible = false
          this.$emit('confirm')
        }
        return
      }
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.isConfirming = true
        }
      })
    }
  }
}
</script>

<template>
  <el-dialog
    :visible.sync="visible"
    title="单个录入"
    width="600px"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-alert
      v-if="isConfirming"
      show-icon
      style="margin-bottom: 20px"
      title="请确认一下输入内容是否正确，确认无误后，按确认键提交！"
      type="warning"
      :closable="false"
    />
    <el-form
      ref="form"
      :model="formData"
      label-width="130px"
      :disabled="isConfirming"
      :rules="rules"
    >
      <el-form-item label="客户ID" prop="orgId">
        <el-select
          v-model="formData.orgId"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="输入客户ID搜索"
          :remote-method="queryOrgAsync"
        >
          <el-option
            v-for="item in orgNameList"
            :key="item.id"
            :label="`${item.id} (${item.orgName})`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属销售" prop="saleName">
        <wh-sales-select v-model="formData.saleName" placeholder="选择所属销售" clearable />
      </el-form-item>
      <el-form-item label="订单类型" prop="orderType">
        <el-select v-model="formData.orderType">
          <el-option
            v-for="(label, value) in enums.salesIncomeOrderType.maps()"
            :key="value"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收入类型" prop="type">
        <el-select v-model="formData.type">
          <el-option
            v-for="(label, value) in enums.salesIncomeType.maps()"
            :key="value"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交易编号" prop="orderNo">
        <el-input v-model="formData.orderNo" type="text" placeholder="请输入交易编号" />
      </el-form-item>
      <el-form-item label="交易时间" prop="transactionDate">
        <el-date-picker
          v-model="formData.transactionDate"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="收入金额" prop="income">
        <el-input-number v-model="formData.income" :precision="3" :step="0.001" :controls="false" />
      </el-form-item>
      <el-form-item label="成本" prop="cost">
        <el-input-number v-model="formData.cost" :precision="3" :step="0.001" :controls="false" />
      </el-form-item>
      <el-form-item label="提成" prop="commission">
        <el-input-number
          v-model="formData.commission"
          :precision="3"
          :step="0.001"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="原因" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="请输入原因" />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
