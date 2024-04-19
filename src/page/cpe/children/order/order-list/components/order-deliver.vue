<script>
import DialogMixin from '@/global/mixins/dialog-mixin'
import apis from '@/api/ajax'
import { iccidsTransfer } from '@/global/function/iccids-tool'

export default {
  mixins: [ DialogMixin ],
  name: 'order-deliver',
  data() {
    return {
      loading: false,
      form: {
        goods: []
      },
      orderInfo: {}
    }
  },
  props: {
    dialogName: {
      default: String
    },
    order: {
      type: Object
    }
  },
  computed: {
    isPackage() {
      return  this.order.packageOrders && this.order.packageOrders.length
    }
  },
  methods: {
    open() {
      this.getDeliverDetail()
    },
    close() {
      this.$emit('closeDialog', this.dialogName)
    },
    async getDeliverDetail() {
      const baseForm = { macAddrList: '', isTestingDevice: false, itemNo: '' }
      const { success, data } = await apis.cpe.getOrderDeliverDetail({
        tradeNo: this.order.tradeNo
      })
      if (!success || !data) {
        this.$message.error('没有找到该订单对应的设备订单')
        this.$emit('closeDialog', this.dialogName, true)
        return false
      }
      this.orderInfo = { ...data }
      this.form.goods = this.orderInfo.deviceOrders.map(e => {
        return { ...baseForm, itemNo: e.itemNo }
      })
      this.$refs.form.resetFields()
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return false
        const { success } = await apis.cpe.postStockDeliver({
          tradeNo: this.order.tradeNo,
          orgId: this.order.orgId,
          deliverROList: [ ...this.form.goods.map((e, index) => {
            if (e.testDuration) {
              e.testDuration = Number(e.testDuration)
            }
            return {
              ...e,
              orderId: this.orderInfo.deviceOrders[index].id,
              macAddrList: iccidsTransfer(e.macAddrList)
            }
          }) ]
        })
        if (!success) return false
        this.$message.success('订单出库成功')
        this.$emit('closeDialog', this.dialogName, true)
      })
    }
  }
}
</script>

<template>
  <div class="wh__dialog order-deliver" v-loading="loading">
    <el-form :model="form" ref="form" label-width="100px">
      <div class="info">
        <div>
          <span class="title">{{ order.tradeNo }}</span>
        </div>
        <div class="place">
          <span>收货信息:</span>
          <el-tag>{{ order.contactInfoObject.user_name }}</el-tag>
          <el-tag><i class="el-icon-location-information"></i><span>{{ order.contactInfoObject.address }}</span>
          </el-tag>
          <el-tag><i class="el-icon-mobile-phone"></i><span>{{ order.contactInfoObject.phone }}</span></el-tag>
        </div>
        <div>
          <span>客户信息: </span>
          <el-tag type="success">客户名称: {{ order.orgName }}</el-tag>
          <el-tooltip effect="dark" :content="order.remark" placement="top" v-if="order.remark">
            <el-tag type="danger remark">客户备注: {{ order.remark }}</el-tag>
          </el-tooltip>
        </div>
      </div>
      <div class="goods" v-if="this.form.goods.length">
        <div class="item" v-for="(item, index) in orderInfo.deviceOrders" :key="item.id">
          <el-form-item label="商品信息：">
            <div style="width:80%;">
              <div class="flex theader">
                <div class="flex3">商品详情</div>
                <div class="flex1" v-if="!isPackage">单价</div>
                <div class="flex1">数量</div>
                <div class="flex1" v-if="!isPackage">小计</div>
              </div>
              <div class="flex tbody items-center">
                <div class="flex3 flex items-center">
                  <div class="img"><img :src="item.itemPic" :alt="item.itemName"></div>
                  <div class="flex1 detail">
                    <p>
                      <span>{{ item.itemName }}</span>
                    </p>
                    <p>
                      <span v-for="p in item.properties.split(';')" :key="p">
                        {{ p }}
                      </span>
                    </p>
                  </div>
                </div>
                <div class="flex1" v-if="!isPackage">￥{{ item.price }}</div>
                <div class="flex1">{{ item.buyCount }}</div>
                <div class="flex1" v-if="!isPackage">￥{{ item.price * item.buyCount }}</div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="出库类型：">
            <el-radio-group v-model="form.goods[index].isTestingDevice">
              <el-radio :label="false">正式设备</el-radio>
              <el-radio :label="true">测试设备</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
              v-if="form.goods[index].isTestingDevice"
              label="测试周期："
              :prop="`goods.${index}.testDuration`"
              :rules="[
                { required: true,  message: '测试周期不能为空', trigger: 'blur' },
                { validator: (rule, value, callback) => {
                  if (!/^\d+$/.test(value)) {
                    return callback('测试周期为正整数')
                  }
                  const val = Number(value)
                  if (val < 0 || val > 180) {
                    return callback('测试周期为0-180')
                  }
                  callback()
                }}
              ]"
          >
            <el-input
                v-model="form.goods[index].testDuration"
                style="width: 200px;"
                type="number"
                placeholder="不超过180天"
                min="0"
                max="180"
            >
            </el-input>
            天
          </el-form-item>
          <el-form-item
              label="出库设备："
              :prop="`goods.${index}.macAddrList`"
              :rules="[
              { required: true, message: '请输入Mac地址', trigger: 'blur' }
            ]">
            <el-input
                v-model="form.goods[index].macAddrList"
                type="textarea"
                style="width:80%;"
                placeholder="请输入Mac地址，一行一个"
            >
            </el-input>
          </el-form-item>
        </div>
      </div>
      <el-form-item label="">
        <el-button type="primary" @click="submit">确认</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.order-deliver {
  .img {
    width: 80px;
    height: 60px;
    text-align: left;
    margin-right: 20px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .items-center {
    align-items: center;
  }

  .info {
    line-height: 35px;
    font-size: 13px;
    border-bottom: 1px #ddd solid;
    padding-bottom: 10px;
    margin-bottom: 10px;

    & .el-tag {
      margin-right: 10px;
      font-size: 13px;
      padding: 3px 10px;
      height: 30px;
    }

    .remark {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 70%;
      vertical-align: -9px;
    }

    .title {
      font-size: 20px;
      font-weight: 600;
      margin-right: 20px;
    }

    .place {
      vertical-align: middle;
    }
  }

  .item {
    border-bottom: 1px #ddd dashed;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
}
</style>
