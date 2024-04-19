<script>
  /**
   * Create by zeter on 2017/5/31
   */
  import { validateNumber, validateNumberWithZero } from '../mixin/validate'
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    mixins: [DialogMixin],
    props: {
      orgId: {
        default: String
      },
      pointOrgName: {
        default: String
      },
      orgContent: {
        default: Object
      },
      dialogName: {
        default: String
      }
    },
    data() {
      return {
        loading: false,
        distributeForm: {
          money: '',
          desc: '',
          inv: false
        },
        disRules: {
          money: [
            { validator: validateNumber, trigger: 'blur' }
          ]
        },
        serviceForm: {
          money: '',
          remark: '',
          type: 'EPNET'
        },
        serviceRules: {
          money: [{ validator: validateNumberWithZero, trigger: 'blur' }],
          remark: [{ required: true, message: '请填写备注', trigger: 'blur' }]
        },
        activeTabName: 'distribute'
      }
    },
    methods: {
      // 分配金额
      doDistribute() {
        this.$refs.distributeForm.validate(async valid => {
          if (valid) {
            this.loading = true
            let res = await this.jaxLib.customer.list.recharge({
              org_id: this.orgId,
              balance: this.distributeForm.money,
              description: this.distributeForm.desc,
              inv: !this.distributeForm.inv
            })
            this.loading = false
            if (res.success) {
              this.$emit('closeDialog', this.dialogName, false)
              this.msg('恭喜您，为客户充值成功啦~>_<', 'success')
            } else {
              this.msg(res.message, 'error')
            }
          }
        })
      },
      doRefund() {
        this.$refs.refundForm.validate(async valid => {
          if (valid) {
            this.loading = true
            let res = await this.jaxLib.customer.list.refund({
              orgId: this.orgId,
              money: this.distributeForm.money,
              remark: this.distributeForm.desc
            })
            this.loading = false
            if (!res.success) return false
            this.$message.success('退款成功')
            this.$emit('closeDialog', this.dialogName, false)
          }
        })
      },
      deviceMoneyDeduct() {
        this.$refs.cardDeductForm.validate(async valid => {
          if (valid) {
            this.loading = true
            let res = await this.jaxLib.customer.list.deductWithInternation({
              orgId: this.orgId,
              money: this.distributeForm.money,
              remark: this.distributeForm.desc
            })
            this.loading = false
            if (!res.success) return false
            this.$message.success('扣款成功')
            this.$emit('closeDialog', this.dialogName, false)
          }
        })
      },
      serviceMoneyDeduct() {
        this.$refs.serviceForm.validate(async valid => {
          if (valid) {
            this.loading = true
            let res = await this.jaxLib.customer.serviceMoneyDeduct({
              orgId: this.orgId,
              type: this.serviceForm.type,
              money: this.serviceForm.money,
              remark: this.serviceForm.remark
            })
            this.loading = false
            if (res.success) {
              this.$emit('closeDialog', this.dialogName, true)
              this.$message.success('服务产品扣款成功', 'success')
            }
          }
        })
      },
      submit() {
        if (this.activeTabName === 'distribute') {
          this.doDistribute()
        } else if (this.activeTabName === 'refund') {
          this.doRefund()
        } else if (this.activeTabName === 'device-deduct') {
          this.deviceMoneyDeduct()
        } else {
          this.serviceMoneyDeduct()
        }
      },
      handleTabChange() {
        this.distributeForm = {
          money: '',
          desc: '',
          inv: false
        }
      },
      close() {
        this.$refs.distributeForm.resetFields()
        this.$refs.serviceForm.resetFields()
        this.serviceForm = {
          money: '',
          remark: '',
          type: 'EPNET'
        }
        this.distributeForm = {
          money: '',
          desc: '',
          inv: false
        }
        this.$emit('closeDialog', this.dialogName, false)
      }
    }
  }
</script>

<template>
  <div class="money-distribute">
    <el-tabs v-model="activeTabName" @tab-click="handleTabChange">
      <el-tab-pane name="distribute" label="分配额度">
        <el-form :model="distributeForm" ref="distributeForm" style="width: 440px" :rules="disRules">
          <el-form-item label="分配额度" prop="money">
            <el-input placeholder="填写额度" v-model="distributeForm.money">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="distributeForm.inv">不开发票</el-checkbox>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="distributeForm.desc"/>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="refund" label="余额退款">
        <el-form style="width: 440px" ref="refundForm" :model="distributeForm" :rules="disRules">
          <el-form-item label="退款额度" prop="money">
            <el-input placeholder="填写额度" v-model="distributeForm.money">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="distributeForm.desc"/>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="device-deduct" label="国际卡付款">
        <el-form style="width: 440px" ref="cardDeductForm" :model="distributeForm" :rules="disRules">
          <el-form-item label="付款金额" prop="money">
            <el-input placeholder="填写额度" v-model="distributeForm.money">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="distributeForm.desc"/>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="service-deduct" label="服务费用付款">
        <el-form style="width: 440px" ref="serviceForm" :model="serviceForm" :rules="serviceRules">
          <el-form-item label="服务功能">
            <el-select v-model="serviceForm.type">
              <el-option label="企业专网" value="EPNET"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务开通费用" prop="money">
            <el-input placeholder="填写额度" v-model="serviceForm.money">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="serviceForm.remark">
            </el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="wh-dialog-footer">
      <el-button type="text" @click.native="close">取 消</el-button>
      <el-button type="primary" @click.native="submit" :disabled="loading">确 定</el-button>
    </span>
  </div>
</template>
