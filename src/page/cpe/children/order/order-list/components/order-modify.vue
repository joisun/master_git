<script>
/**
 * Create by zeter on 2018/11/20
 */
import DialogMixin from '@/global/mixins/dialog-mixin'
import { serviceRender } from '../mixins/service-render'
import apis from '@/api/ajax'
export default {
  mixins: [DialogMixin],
  name: 'order-modify-dialog',
  data() {
    return {
      isAllDisable: false,
      isSeller: false,
      form: {
        remark: '',
        logisticsCompany: '',
        isFee: false,
        logisticsFee: 0,
        logisticsType: 'EXPRESS'
      },
      table: [],
      rules: {
        remark: [
          {
            required: true,
            message: '请填写备注',
            trigger: 'blur'
          }
        ]
      },
      isBtnLoading: false
    }
  },
  props: {
    order: {
      default: String
    },
    dialogName: {
      default: String
    }
  },
  computed: {
    totalMoney() {
      return this.table.reduce((total, e) => {
        return (
          total +
          e.price * e.buyCount * (e.buyYear || 1) +
          (e.serviceFee ? e.buyCount * e.serviceFee * (e.buyYear || 1) : 0)
        )
      }, 0)
    }
  },
  created() {
    this.getAuthInfo()
  },
  methods: {
    isFeeChange(val) {
      if (val) this.form.logisticsFee = 0
      else this.form.logisticsFee = this.order.logisticsFee
    },
    open() {
      this.form.remark = ''
      this.form.logisticsCompany = this.order.logisticsCompany
      this.form.logisticsFee = this.order.logisticsFee
      this.form.logisticsType =
        this.order.logisticsType === 'SELF_LIFTING'
          ? 'SELF_LIFTING'
          : this.order.freightCollect
          ? 'freightCollect'
          : 'EXPRESS'
      this.form.isFee = Number(this.order.logisticsFee) === 0
      this.table = this.order.orders.map((e) => {
        if (e.itemType === 'DEVICE')
          return {
            id: e.id,
            price: e.price,
            buyCount: e.buyCount,
            serviceFee: e.serviceFee,
            itemType: 'DEVICE'
          }
        if (e.itemType === 'PACKAGE')
          return {
            id: e.id,
            price: e.price,
            buyCount: e.buyCount,
            itemType: 'PACKAGE',
            buyYear: e.buyYear
          }
        return { id: e.id, price: e.price, buyCount: e.buyCount, itemType: 'CARD' }
      })
      this.$refs.form.resetFields()
    },
    close() {
      this.$emit('closeDialog', this.dialogName)
    },
    async getAuthInfo() {
      const res = await await apis.cpe.modifyLogisticsAuth({})
      this.isSeller = res.data.onlyFreight
      this.isAllDisable = !res.data.all && !res.data.onlyFreight
    },
    async submit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        this.isBtnLoading = true
        const { success } = await apis.cpe.postOrderModify({
          freightCollect: this.form.logisticsType === 'freightCollect',
          logisticsCompany: this.form.logisticsCompany,
          logisticsType:
            this.form.logisticsType === 'freightCollect' ? 'EXPRESS' : this.form.logisticsType,
          logisticsFee: this.form.logisticsFee,
          orders: this.table,
          remark: this.form.remark,
          tradeNo: this.order.tradeNo
        })
        this.isBtnLoading = false
        if (!success) return false
        this.$message.success('修改订单成功')
        this.$emit('closeDialog', this.dialogName, true)
      })
    }
  },
  filters: {
    serviceRender
  }
}
</script>

<template>
  <div class="industry-dialog wh__dialog">
    <div class="wh__dialog--body">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" label-position="right">
        <el-form-item label="订单号">
          {{ order.tradeNo }}
        </el-form-item>
        <el-form-item label="客户名称">
          {{ order.orgName }}
        </el-form-item>
        <el-form-item label="订单状态">
          <span
            v-cpe-enum-extract="{
              original: order.status,
              category: 'tradeStatus'
            }"
          ></span>
        </el-form-item>
        <el-form-item label="商品清单">
          <div class="table">
            <div class="theader tac flex">
              <div class="flex4">商品详情</div>
              <div class="flex1">单价</div>
              <div class="flex1">周期</div>
              <div class="flex1">数量</div>
              <div class="flex1">修改后单价</div>
              <div class="flex1">修改后合计</div>
            </div>
            <div class="tbody" v-if="table.length">
              <div class="item flex">
                <div class="flex8" v-for="(i, index) in order.orders" :key="i.id">
                  <div class="flex" v-if="i.itemType === 'PACKAGE'">
                    <div class="flex1">{{ i.itemName }}</div>
                    <div class="flex3">
                      <template v-for="item in i.items">
                        <template v-if="item.itemType === 'DEVICE'">
                          <li class="flex good" :key="item.itenNo">
                            <div class="flex3 border-right">
                              {{ item.itemName }} {{ item.properties }}
                            </div>
                          </li>
                          <li class="flex good" :key="item.itenNo">
                            <div class="flex3 border-right">{{ item | serviceRender }}</div>
                          </li>
                        </template>
                        <li class="flex good" v-if="item.itemType === 'CARD'" :key="item.itenNo">
                          <div class="flex3 border-right">
                            {{ item.itemName }} {{ item.properties }}
                          </div>
                        </li>
                      </template>
                    </div>
                    <div class="flex1 border-right tac">{{ i.price }}</div>
                    <div class="flex1 border-right tac">{{ i.buyYear }}</div>
                    <div class="flex1 border-right tac">{{ i.buyCount }}</div>
                    <div class="flex1 border-right">
                      <div class="input">
                        <el-input-number
                          :disabled="isSeller || isAllDisable"
                          v-model="table[index].price"
                          :precision="2"
                          :step="0.1"
                          :min="0"
                          size="mini"
                          :controls="false"
                        ></el-input-number>
                      </div>
                    </div>
                  </div>
                  <div class="flex" v-if="i.itemType === 'DEVICE'">
                    <div class="flex1">{{ i.itemName }}</div>
                    <div class="flex6">
                      <li class="flex good">
                        <div class="flex3 border-right">{{ i.properties }}</div>
                        <div class="flex1 border-right tac">￥{{ i.price }}</div>
                        <div class="flex1 border-right tac">-</div>
                        <div class="flex1 border-right tac">{{ i.buyCount }}</div>
                        <div class="flex1 border-right">
                          <div class="input">
                            <el-input-number
                                :disabled="isSeller || isAllDisable"
                              v-model="table[index].price"
                              :precision="2"
                              :step="0.1"
                              :min="0"
                              size="mini"
                              :controls="false"
                            />
                          </div>
                        </div>
                      </li>
                      <li class="flex good">
                        <div class="flex3 border-right">{{ i | serviceRender }}</div>
                        <div class="flex1 border-right tac">￥{{ i.serviceFee }}</div>
                        <div class="flex1 border-right tac">-</div>
                        <div class="flex1 border-right tac">{{ i.buyCount }}</div>
                        <div class="flex1 border-right">
                          <div class="input">
                            <el-input-number
                                :disabled="isSeller || isAllDisable"
                              v-model="table[index].serviceFee"
                              :precision="2"
                              :step="0.1"
                              :min="0"
                              size="mini"
                              :controls="false"
                            ></el-input-number>
                          </div>
                        </div>
                      </li>
                    </div>
                  </div>
                </div>
                <div class="flex1 tac">￥{{ totalMoney }}</div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="物流方式">
          <el-radio v-model="form.logisticsType" :disabled="isAllDisable" label="EXPRESS">邮寄</el-radio>
          <el-radio v-model="form.logisticsType"  :disabled="isAllDisable" label="freightCollect">到付</el-radio>
          <el-radio v-model="form.logisticsType"  :disabled="isAllDisable"  label="SELF_LIFTING">自提</el-radio>
        </el-form-item>
        <el-form-item label="快递公司" v-if="form.logisticsType !== 'SELF_LIFTING'">
          <el-select v-model="form.logisticsCompany"  :disabled="isAllDisable" >
            <el-option label="中通" value="中通"></el-option>
            <el-option label="顺丰" value="顺丰"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否包邮" v-if="form.logisticsType === 'EXPRESS'">
          <el-radio-group v-model="form.isFee" @change="isFeeChange" :disabled="isSeller || isAllDisable">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="物流金额" v-if="form.logisticsType === 'EXPRESS'">
          <el-input-number
              :disabled="isSeller || isAllDisable"
            v-model="form.logisticsFee"
            :precision="2"
            :step="0.1"
            :min="0"
            size="mini"
            :controls="false"
            style="width: 100px"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="合计金额">
          ￥{{ totalMoney + (form.logisticsType === 'EXPRESS' ? form.logisticsFee : 0) }}
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="form.remark" type="textarea" style="width: 250px"  :disabled="isAllDisable" />
        </el-form-item>
      </el-form>
    </div>
    <div class="wh__dialog--footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" v-loading="isBtnLoading" @click="submit">确认</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table {
  border: 1px #ddd solid;
}
.theader {
  border-bottom: 1px #ddd solid;
}
.item {
  border-bottom: 1px #ddd solid;
  &:last-child {
    border-bottom: none;
  }
}
.input {
  padding: 5px 10px;
}
.good {
  border-bottom: 1px #ddd dashed;
}
.tac {
  text-align: center;
}
.border-right {
  border-right: 1px #ddd solid;
}
</style>
