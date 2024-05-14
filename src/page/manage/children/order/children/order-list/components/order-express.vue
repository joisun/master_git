<script>
/**
   * Create by zeter on 2018/11/13
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    mixins: [DialogMixin],
    name: 'order-express',
    data() {
      return {
        form: {
          company: '',
          type: false,
          expressId: ''
        },
        rules: {
          company: [
            {
              validator: (rule, value, callback) => {
                if (!value && !this.form.type) callback('请选择快递公司')
                else callback()
              },
              trigger: 'blur'
            }
          ],
          expressId: [
            {
              validator: (rule, value, callback) => {
                if (!value && !this.form.type) callback('请填写快递号')
                else callback()
              },
              trigger: 'blur'
            }
          ]
        }
      }
    },
    props: {
      orderAllValue: {}
    },
    methods: {
      open() {
        this.form.company = this.orderAllValue.logisticsCompany
        this.form.type = this.orderAllValue.logisticsType === 'SELF_LIFTING'
        this.form.expressId = this.orderAllValue.logisticsNo
      },
      changeChecked() {
        if (this.form.type) {
          this.form.expressId = ''
        }
      },
      // 提交物流信息回调
      onSubmit() {
        this.$refs.form.validate(async valid => {
          if (valid) {
            let rst = await this.jaxLib.bill.express.set({
              co_id: this.orderAllValue.id,
              logisticsType: this.form.type ? 'SELF_LIFTING' : 'EXPRESS',
              number: this.form.type ? '' : this.form.expressId,
              company: this.form.company
            })
            if (!rst.success) return false
            this.$emit('close', true)
            this.msg('物流信息设置成功！', 'success')
          }
        })
      },
      close() {
        this.$emit('close')
        this.form = { company: '', type: false, expressId: '' }
        this.$refs.form.resetFields()
      }
    }
  }
</script>

<template>
  <div class="order-express wh__dialog">
    <div class="wh__dialog--body">
      <el-form label-width="80px" ref="form" :model="form" :rules="rules">
        <el-form-item label="物流公司">
          <el-select v-model="form.company" placeholder="物流公司名" prop="company" :disabled="form.type">
            <el-option :label="item" :value="item" v-for="item in enums.logisticsCompany.excludes('自提', '到付').keys()" :key="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单编号" prop="expressId">
          <el-input v-model="form.expressId" placeholder="输入运单号码" :disabled="form.type">
          </el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-checkbox v-model="form.type" @change="changeChecked">自提或其他配送方式</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
    <div class="wh__dialog--footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </div>
</template>
