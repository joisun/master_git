<template>
  <div class="wh__warp">
    <div class="wh__header">
      <h2 class="wh__header--title">退款申请</h2>
    </div>
    <div class="wh__body">
      <el-form ref="form" :rules="rules" :model="form" label-width="160px" style="width: 600px">
        <el-form-item label="客户ID" prop="orgId">
          <el-select
            v-model="form.orgId"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="输入组织id、账户名、客户名称、手机号查询"
            :remote-method="getOrgList"
            :loading="isSelectLoading"
            style="width: 300px"
            @change="handleOrgChange"
          >
            <el-option
              v-for="item in orgList"
              :key="item.id"
              :label="item.orgName + '(' + item.id + ')'"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡片明细" prop="iccids">
          <wh-iccid-input v-model.trim="form.iccids" />
        </el-form-item>
        <el-form-item label="购买时是否开过发票" prop="haveInvoice">
          <el-switch v-model="form.haveInvoice" on-text="是" off-text="否" />
        </el-form-item>
        <el-form-item label="是否需要退卡" prop="returnCard">
          <el-switch v-model="form.returnCard" on-text="是" off-text="否" />
        </el-form-item>
        <el-form-item v-if="form.returnCard" label="退货快递单号" prop="returnLogisticsNo">
          <el-input v-model="form.returnLogisticsNo" />
        </el-form-item>
        <el-form-item label="是否需要提交销卡" prop="isTicket">
          <el-switch v-model="form.isTicket" on-text="是" off-text="否" disabled />
          <p class="remark-alert">提交审核后，会自动提交销卡，请各位申请人知悉</p>
        </el-form-item>
        <el-form-item label="退款原因" prop="refundReason">
          <el-input v-model.trim="form.refundReason" type="textarea" rows="2" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="computeResult">
            计算退款金额
          </el-button>
        </el-form-item>
      </el-form>
      <div v-show="showResult">
        <div>
          <p style="float: right; margin-bottom: 16px">
            <el-button type="primary" @click="onExport"> 导出结果 </el-button>
          </p>
          <el-table :data="tableData" height="400px">
            <el-table-column label="ICCID" prop="iccid"></el-table-column>
            <el-table-column label="MSISDN" prop="msisdn"></el-table-column>
            <el-table-column label="IMSI" prop="imsi"></el-table-column>
            <el-table-column label="设备状态" prop="status">
              <template slot-scope="scope">
                {{ scope.row.status | cardStatusFilter }}
              </template>
            </el-table-column>
            <el-table-column label="运营商状态" prop="deviceStatus">
              <template slot-scope="scope">
                {{ scope.row.deviceStatus | deviceStatusFilter }}
              </template>
            </el-table-column>
            <el-table-column label="出库时间" prop="openDate">
              <template slot-scope="scope">
                {{ scope.row.openDate | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column label="过期时间" prop="expireDate">
              <template slot-scope="scope">
                {{ scope.row.expireDate | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column label="处理方式" prop="refundType"></el-table-column>
            <el-table-column label="退款套餐数" prop="cancelCount"></el-table-column>
            <el-table-column label="单价" prop="price">
              <template slot-scope="scope">
                {{ scope.row.price | numberFilter }}
              </template>
            </el-table-column>
            <el-table-column label="退款金额" prop="totalMoney">
              <template slot-scope="scope">
                {{ scope.row.totalMoney | numberFilter }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form
          ref="form2"
          :model="form2"
          label-width="160px"
          style="width: 600px; margin: 20px 0 50px"
          :rules="rules2"
        >
          <el-form-item label="计算得出退款金额">
            {{ totalRefundMoney | numberFilter }}
          </el-form-item>
          <el-form-item label="申请退款金额" prop="refundMoney">
            <el-input-number v-model="form2.refundMoney" :controls="false" />
          </el-form-item>
          <el-form-item>
            <el-button type="plain" @click="cancel">取消申请</el-button>
            <el-button type="primary" :loading="loadingSubmit" @click="submit"
              >金额确认无误，提交审核</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Download from '@/page/components/wh-download/wh-download'
import whIccidInput from '@/global/components/wh-iccid-input.vue'
import { iccidsTransfer } from '@/global/function/iccids-tool'
function toFixed(num, fixed) {
  fixed = fixed || 0
  fixed = Math.pow(10, fixed)
  return Math.floor(num * fixed) / fixed
}
export default {
  name: 'RefundManagement',
  components: {
    whIccidInput
  },
  data() {
    return {
      orgList: [],
      isSelectLoading: false,
      form: {
        orgId: '',
        iccids: [],
        returnLogisticsNo: '',
        refundReason: '',
        haveInvoice: false,
        returnCard: false,
        isTicket: true
      },
      form2: {
        refundMoney: undefined
      },
      rules: {
        orgId: [
          {
            required: true,
            message: '该项为必选项',
            trigger: 'blur'
          }
        ],
        iccids: [
          {
            required: true,
            message: '该项为必填项'
          }
        ],
        returnLogisticsNo: [
          {
            required: true,
            message: '该项为必填项'
          }
        ],
        refundReason: [
          {
            required: true,
            message: '该项为必填项'
          }
        ]
      },
      rules2: {
        refundMoney: [
          {
            required: true,
            message: '该项为必填项'
          }
        ]
      },
      showResult: false,
      tableData: [],
      loading: false,
      loadingSubmit: false,
      cloneForm: {}
    }
  },
  computed: {
    totalRefundMoney() {
      return this.tableData.reduce((a, b) => {
        return a + b.totalMoney
      }, 0)
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
      this.$refs.form2.resetFields()
      this.tableData = []
      this.showResult = false
      this.cloneForm = {}
    },
    handleOrgChange() {},
    async getOrgList(content) {
      if (!content) {
        this.orgList = []
        return false
      }
      this.isSelectLoading = true
      let res = await this.jaxLib.customer.list.get(
        {
          pageIndex: 1,
          pageSize: 10,
          orgName: content
        },
        false
      )
      this.isSelectLoading = false
      if (!res.success) return false
      this.orgList = res.data.list
    },
    submit() {
      this.$refs.form2.validate(async (valid) => {
        const drpIds = []
        this.tableData.forEach((item) => {
          if (item.drpIds) {
            drpIds.push(item.drpIds)
          }
        })
        if (valid) {
          const params = {
            orgId: this.cloneForm.orgId,
            haveInvoice: this.cloneForm.haveInvoice,
            iccids: this.cloneForm.iccids.join(','),
            refundMoney: this.form2.refundMoney,
            refundReason: this.cloneForm.refundReason,
            returnCard: this.cloneForm.returnCard,
            returnLogisticsNo: this.cloneForm.returnLogisticsNo,
            isTicket: this.cloneForm.isTicket,
            drpIds: drpIds.join()
          }
          this.loadingSubmit = true
          try {
            const { success } = await this.jaxLib.salesComission.submitRefundMoney(params)
            if (success) {
              this.$message.success('提交成功！')
              this.reset()
            }
            this.loadingSubmit = false
          } catch {
            this.loadingSubmit = false
          }
        }
      })
    },
    async onExport() {
      const params = {
        orgId: this.cloneForm.orgId,
        iccids: this.cloneForm.iccids.join(',')
      }
      const { success, data } = await this.jaxLib.salesComission.refundDetailExport(params)
      if (!success) return false
      await Download({ ...data })
    },
    computeResult() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const params = {
            orgId: this.form.orgId,
            iccids: iccidsTransfer(this.form.iccids.join())
              .filter((item) => !!item)
              .join()
          }
          this.loading = true
          try {
            const { success, data } = await this.jaxLib.salesComission.computeRefundMoney(params)
            if (success) {
              this.showResult = true
              this.tableData = data
              this.cloneForm = JSON.parse(JSON.stringify(this.form))
              this.loading = false
            } else {
              this.loading = false
            }
          } catch {
            this.loading = false
          }
        }
      })
    },
    cancel() {
      this.showResult = false
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index !== 10) {
          sums[index] = ''
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = toFixed(sums[index], 2) + ' 元'
        } else {
          sums[index] = ''
        }
      })
      return sums
    }
  }
}
</script>

<style lang="scss">
.remark-alert {
  font-size: 12px;
  color: grey;
}
</style>
