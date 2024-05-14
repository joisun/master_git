<script>
/**
   * Create by zeter on 2019-08-23
   */
  import moment from 'moment'
  export default {
    name: 'operation-sale-report',
    data() {
      return {
        loading: false,
        form: {
          emailName: '',
          statisticsType: '',
          time: [],
          orgSources: [],
          reportTypes: []
        },
        rule: {
          statisticsType: [{ type: 'string', required: true, message: '请选择统计方式', trigger: 'change' }],
          orgSources: [{ type: 'array', required: true, message: '请至少选择一个客户来源', trigger: 'change' }],
          reportTypes: [{ type: 'array', required: true, message: '请至少选择一个报表类型', trigger: 'change' }],
          emailName: [{ type: 'string', required: true, message: '请输入邮箱', trigger: 'change' }],
          time: [{
            validator: (rule, value, callback) => {
              if (!value || !value.length) return callback(new Error('请选择时间范围'))
              if (!value[0] || !value[1]) return callback(new Error('请选择时间范围'))
              callback()
            },
            trigger: 'change'
          }]
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        reportType: {},
        source: {}
      }
    },
    computed: {
      statisticsType() {
        return this.$store.state.overall.enum.statisticsType
      }
    },
    methods: {
      async getEnums() {
        let rst = await this.jaxLib.report.getSaleReportEnum()
        if (!rst.success) return false
        this.reportType = rst.data.reportType
        this.source = rst.data.source
      },
      submit() {
        this.$refs.form.validate(async(valid) => {
          if (valid) {
            this.loading = true
            let rst = await this.jaxLib.report.saleReport({
              emailName: this.form.emailName.trim() + '@qipeng.com',
              statisticsType: this.form.statisticsType,
              orgSources: this.form.orgSources.join(','),
              reportTypes: this.form.reportTypes.join(','),
              endDate: moment(this.form.time[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
              startDate: moment(this.form.time[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
            })
            this.loading = false
            if (!rst.success) return false
            this.$alert('您需要的运营数据报表正在生成，请注意查看邮件。', '提交成功', {
              confirmButtonText: '确定',
              callback: action => {}
            })
          }
        })
      },
      cancel() {
        this.form = {
          emailName: '',
          statisticsType: '',
          time: '',
          orgSources: [],
          reportTypes: []
        }
        this.$refs.form.resetFields()
      },
      down() {
        window.location.href = '/template/pop-sale-report.xlsx'
      }
    },
    mounted() {
      this.getEnums()
    }
  }
</script>

<template>
  <div class="operation-sale-report">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">运营数据报表</h2>
      </div>
      <div class="wh__body">
        <el-form :model="form" ref="form" :rules="rule" label-position="left" label-width="120px">
          <el-form-item label="统计方式" prop="statisticsType">
            <el-radio-group v-model="form.statisticsType">
              <el-radio v-for="(label, value) in statisticsType"
                :label="value" :key="value">{{label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择时间范围" prop="time">
            <el-date-picker v-model="form.time" type="daterange" placeholder="选择时间范围" :pickerOptions="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <div>选择查询条件</div>
          <el-form-item label="客户来源" prop="orgSources">
            <el-checkbox-group v-model="form.orgSources">
              <el-checkbox :label="value" v-for="(key, value) in source" :key="key">{{key}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="选择报表类型" prop="reportTypes">
            <el-checkbox-group v-model="form.reportTypes">
              <el-checkbox :label="value" v-for="(key, value) in reportType" :key="key">{{key}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="">
            <el-button type="text" @click="down">下载EXCEL模板</el-button>
          </el-form-item>
          <el-form-item label="接收邮箱地址" prop="emailName">
            <el-input v-model="form.emailName" placeholder="请输入你的邮箱" style="width: 300px">
              <template slot="append">@qipeng.com</template>
            </el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="submit" :disabled="loading">确认</el-button>
            <el-button type="primary" @click="cancel">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
