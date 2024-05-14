<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'
export default {
  data() {
    return {
      formData: {
        platform: '',
        orderNo: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        const { orderNo, platform } = this.formData
        const orderNoList = iccidsTransfer(orderNo)
          .filter((item) => !!item)
          .join()
        const apis = {
          card: 'closeYddOrderCard',
          cpe: 'closeYddOrderCpe'
        }
        const res = await this.jaxLib.common[apis[platform]]({ orderNoList })
        if (res && res.success) {
          this.$message.success('操作成功')
          this.reset()
        }
      })
    },
    reset() {
      // this.formData = {
      //   platform: '',
      //   orderNo: ''
      // }
      this.$refs.form.resetFields()
    }
  }
}
</script>

<template>
  <div class="download">
    <div class="wh__warp">
      <div>
        <div class="wh__header">
          <h2 class="wh__header--title">三方订单关闭</h2>
        </div>
      </div>
      <div class="wh__body">
        <el-card class="box-card" shadow="none">
          <el-form ref="form" :model="formData" label-width="120px">
            <el-form-item
              label="订单平台"
              prop="platform"
              :rules="{ required: true, message: '请选择平台' }"
            >
              <el-radio-group v-model="formData.platform">
                <el-radio label="card">卡平台</el-radio>
                <el-radio label="cpe">设备平台</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="订单号"
              prop="orderNo"
              :rules="{ required: true, message: '请输入订单号' }"
            >
              <el-input
                v-model="formData.orderNo"
                type="textarea"
                rows="6"
                placeholder="请输入订单号，一行一个"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

