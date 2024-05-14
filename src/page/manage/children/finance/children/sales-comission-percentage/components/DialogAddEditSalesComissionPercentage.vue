<!--
 * @Author: SerkeyWu
 * @Date: 2021-02-20 16:49:00
 * @Description: Do not edit
 * @LastEditors: SerkeyWu
 * @LastEditTime: 2021-02-25 14:07:40
-->
<template>
  <el-dialog :visible="visible" :title="title" :before-close="onCloseDialog" width="400px">
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="订单类型" prop="orderType">
        <el-select v-model="form.orderType" disabled>
          <el-option
            v-for="(label, value) in enums.salesIncomeOrderType.maps()"
            :key="value"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="type === 'RECHARGE'" label="续费时间" prop="rechargeLimit">
        <el-select v-model="form.rechargeLimit" disabled>
          <el-option
            v-for="(label, value) in enums.rechargeLimit.maps()"
            :key="value"
            :label="label"
            :value="parseInt(value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="毛利率上限" prop="profitLimit">
        <el-input-number
          v-model="form.profitLimit"
          :controls="false"
          style="width: 175px"
          :min="0"
          :max="100"
        />
        %
      </el-form-item>
      <el-form-item label="收入提成比例" prop="incomeCommission">
        <el-input-number
          v-model="form.incomeCommission"
          :controls="false"
          style="width: 175px"
          :min="0"
          :max="100"
        />
        %
      </el-form-item>
      <el-form-item label="毛利提成比例" prop="profitCommission">
        <el-input-number
          v-model="form.profitCommission"
          :controls="false"
          style="width: 175px"
          :min="0"
          :max="100"
        />
        %
      </el-form-item>
    </el-form>
    <div slot="footer">
      <div>
        <el-button @click="onCloseDialog">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    monthDate: {
      type: String
    },
    visible: {
      type: Boolean
    },
    data: {
      type: Object
    },
    type: {
      type: String
    },
    saleType: {
      type: String
    }
  },
  data() {
    return {
      form: {
        orderType: '',
        rechargeLimit: undefined,
        profitLimit: undefined,
        incomeCommission: undefined,
        profitCommission: undefined
      },
      signedCarrierList: [],
      rules: {
        orderType: [
          {
            required: true,
            message: '该项为必填项',
            trigger: 'blur'
          }
        ],
        rechargeLimit: [
          {
            required: true,
            message: '该项为必填项',
            trigger: 'blur'
          }
        ],
        profitLimit: [
          {
            required: true,
            message: '该项为必填项',
            trigger: 'blur'
          }
        ],
        incomeCommission: [
          {
            required: true,
            message: '该项为必填项',
            trigger: 'blur'
          }
        ],
        profitCommission: [
          {
            required: true,
            message: '该项为必填项',
            trigger: 'blur'
          }
        ]
      },
      loadingPriceOfferInfo: false
    }
  },
  computed: {
    isEdit() {
      return !!(this.data && this.data.id)
    },
    title() {
      return (this.type === 'INCOME' ? '新增订单' : '续费订单') + '—提成比例'
    }
  },
  watch: {
    visible(v) {
      if (v && this.data && this.data.id) {
        this.form = Object.assign({}, this.form, this.data)
        this.form.incomeCommission *= 100
        this.form.profitCommission *= 100
        this.form.profitLimit = this.form.profitLimit[1]
      }
      if (v && this.data && !this.data.id) {
        this.form = {}
        ;(this.form.orderType = this.data.orderType),
          (this.form.rechargeLimit = this.data.rechargeLimit)
      }
    }
  },
  methods: {
    onCloseDialog() {
      const form = this.$refs.form
      if (form) {
        form.clearValidate()
        form.resetFields()
        this.form.rechargeLimit = undefined
      }
      this.$emit('update:visible', false)
    },
    onConfirm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        const params = {
          saleType: this.saleType,
          type: this.type,
          orderType: this.form.orderType,
          rechargeLimit: this.form.rechargeLimit,
          profitLimit: this.form.profitLimit / 100,
          incomeCommission: this.form.incomeCommission / 100,
          profitCommission: this.form.profitCommission / 100,
          monthDate: this.monthDate
        }
        if (this.data && this.data.id) {
          params.id = this.data.id
        }
        const rst = await this.jaxLib.salesComission.saveSalesComissionPercentage(params)
        if (rst.success) {
          this.$message.success('操作成功！')
          this.$emit('refresh')
          this.onCloseDialog()
        }
      })
    }
  }
}
</script>
