<script>
/**
   * Create by zeter on 2018/11/20
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import apis from '@/api/ajax'
  export default {
    mixins: [DialogMixin],
    name: 'order-logistics-dialog',
    data() {
      return {
        form: {
          logisticsCompany: '',
          logisticsNo: '',
          logisticsType: 'EXPRESS'
        },
        rules: {
          logisticsCompany: [
            { required: true, message: '请选择物流公司', trigger: 'blur' }
          ],
          logisticsNo: [
            { required: true, message: '请填写物流单号', trigger: 'blur' }
          ]
        }
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
    methods: {
      open() {
        this.$refs.form.resetFields()
        this.form.logisticsCompany = this.order.logisticsCompany
        this.form.logisticsNo = this.order.logisticsNo
        this.form.logisticsType = this.order.logisticsType
      },
      close() {
        this.$emit('closeDialog', this.dialogName)
      },
      async submit() {
        this.$refs.form.validate(async valid => {
          if (!valid) return false
          const { success } = await apis.cpe.postOrderDeliver({
            tradeNo: this.order.tradeNo,
            ...this.form
          })
          if (!success) return false
          this.$message.success('发货成功')
          this.$emit('closeDialog', this.dialogName, true)
        })
      }
    }
  }
</script>

<template>
  <div class="industry-dialog wh__dialog">
    <div class="wh__dialog--body">
      <el-form ref="form" :rules="rules" :model="form"  label-width="80px" label-position="right">
        <el-form-item label="订单号">
          {{order.tradeNo}}
        </el-form-item>
        <el-form-item label="客户名称">
          {{order.orgName}}
        </el-form-item>
        <el-form-item label="物流类型">
          <el-radio-group disabled v-model="form.logisticsType">
            <el-radio label="EXPRESS">
              <span>快递</span>
            </el-radio>
            <el-radio label="SELF_LIFTING">
              <span>自提或其他配送方式</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="物流公司" prop="logisticsCompany" v-if="form.logisticsType === 'EXPRESS'">
          <el-select v-model="form.logisticsCompany">
            <el-option label="顺丰" value="顺丰"></el-option>
            <el-option label="中通" value="中通"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="logisticsNo" v-if="form.logisticsType === 'EXPRESS'">
          <el-input v-model="form.logisticsNo" placeholder="快递单号" style="width:250px;"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="wh__dialog--footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </div>
  </div>
</template>
