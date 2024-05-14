<script>
/**
   * Create by zeter on 2018/10/22
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import moment from 'moment'

  export default {
    mixins: [DialogMixin],
    name: 'volume-count',
    props: {
      orgId: {
        default: String
      },
      dialogName: {
        default: String
      }
    },
    data() {
      let timeValid = async(rule, value, callback) => {
        if (!value || !value.length) {
          return callback('请选择周期')
        }
        if (!value[0] || !value[1]) {
          return callback('请选择周期')
        }
        callback()
      }
      return {
        form: {
          time: '',
          carrier: [],
          email: ''
        },
        timeStart: '',
        rules: {
          time: [
            { validator: timeValid, message: '请选择周期', trigger: 'change' }
          ],
          carrier: [
            { type: 'array', required: true, message: '请至少选择一个运营商', trigger: 'change' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'change' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ]
        },
        loading: false
      }
    },
    computed: {
      pickerOptions() {
        let self = this
        return {
          disabledDate(time) {
            let intervalCondition = (time.getTime() > self.timeStart + 3600 * 1000 * 24 * 30)
            let fixedCondition = (time.getTime() > Date.now() - 3600 * 1000 * 24)
            if (self.timeStart) {
              return self.timeStart && (intervalCondition || fixedCondition)
            }
            return self.timeStart && (intervalCondition)
          },
          onPick(date) {
            self.timeStart = (new Date(date.minDate)).getTime()
          }
        }
      }
    },
    methods: {
      onSubmit() {
        this.$refs.form.validate(async(valid) => {
          if (valid) {
            this.loading = true
            let rst = await this.jaxLib.customer.volume.count({
              startDate: moment(this.form.time[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
              endDate: moment(this.form.time[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
              orgId: this.orgId,
              carrier: this.form.carrier.join(','),
              email: this.form.email
            })
            this.loading = false
            if (!rst.success) return false
            this.$message.success('提交成功，稍后数据会被发送到邮箱中')
            this.$emit('closeDialog', this.dialogName, false)
          }
        })
      },
      close() {
        this.form = { time: '', carrier: [], email: '' }
        this.$refs.form.resetFields()
        this.$emit('closeDialog', this.dialogName)
      }
    }
  }
</script>

<template>
  <div class="volume-count">
    <el-form :rules="rules" ref="form" :model="form" label-width="80px">
      <el-form-item label="统计周期" prop="time">
        <el-date-picker
          v-model="form.time"
          type="daterange"
          placeholder="选择日期范围"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="运营商" prop="carrier">
        <el-checkbox-group v-model="form.carrier">
          <el-checkbox v-for="(key, val) in enums.carrier.maps()" :key="val" :label="val">
            {{key}}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :disabled="loading">立即创建</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
