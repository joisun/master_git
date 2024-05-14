<template>
  <el-dialog :title="title" :visible.sync="visible" width="50%" :before-close="beforeClose">
    <el-form
      ref="form"
      label-width="120px"
      :model="formData"
      :rules="rules"
      :validate-on-rule-change="false"
    >
      <el-form-item label="预计开卡时间" prop="exportTime">
        <el-date-picker
          v-model="formData.exportTime"
          clearable
          type="date"
          placeholder="预计开卡时间"
        />
      </el-form-item>
      <iccid-range-input
        v-if="!isAll"
        label="指定ICCID"
        :iccid-batchs="formData.iccidBatchs"
        @change="iccidRangeChange"
      />
      <el-form-item label="开卡数量" prop="exportCount">
        <el-input-number v-model="formData.exportCount" :disabled="isAll" :min="0" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="onSubmit(true)">生成Excel</el-button>
      <el-button type="primary" @click="onSubmit(false)">开卡</el-button>
    </div>
  </el-dialog>
</template>

<script>
import IccidRangeInput from '@/page/components/iccid-range-input'
import moment from 'moment'
import Download from '@/page/components/wh-download/wh-download'

export default {
  components: {
    IccidRangeInput
  },
  data() {
    const countValidator = (_, value, callback) => {
      if (!this.isAll) {
        const iccidCounts = this.formData.iccidBatchs
          .map((item) => item.count)
          .reduce((a, b) => a + b)
        if (iccidCounts !== value) {
          return callback(new Error('开卡数量和指定iccid数量不一致，请检查'))
        }
      }
      callback()
    }
    return {
      visible: false,
      content: {},
      isAll: false,
      rules: {
        exportCount: [
          {
            required: this.isAll,
            validator: countValidator,
            trigger: 'change'
          }
        ],
        exportTime: [{ required: true, message: '请选择预计开卡时间', trigger: 'change' }]
      },
      formData: {
        exportTime: '',
        exportCount: '',
        iccidBatchs: [
          {
            iccidStart: '',
            iccidEnd: '',
            count: 0
          }
        ]
      },
      isLoading: false
    }
  },
  computed: {
    title() {
      return this.isAll ? '全部开卡' : '部分开卡'
    }
  },
  methods: {
    async fieldsValid(validateField) {
      const valids = []
      await new Promise((resolve) =>
        this.$refs.form.validateField(validateField, async (valid) => {
          valid && valids.push(valid)
          resolve(valids)
        })
      )
      return valids
    },
    close() {
      this.$refs.form && this.$refs.form.resetFields()
      this.carrierChargeId = ''
      this.baseContent = {}
      this.visible = false
    },
    beforeClose(done) {
      this.close()
      done()
    },
    open(content, isAll) {
      this.content = content
      this.isAll = isAll
      if (isAll) this.formData.exportCount = content.deviceRemainingCount
      this.visible = true
    },
    async onSubmit(onlyExport) {
      this.$refs.form.clearValidate()
      const { exportTime, exportCount, iccidBatchs } = this.formData
      let batchValid = []
      iccidBatchs.forEach(
        (_, index) =>
          (batchValid = [
            ...batchValid,
            'iccidBatchs.' + index + '.iccidStart',
            'iccidBatchs.' + index + '.iccidEnd'
          ])
      )
      const validateField = onlyExport
        ? [...batchValid, 'exportCount']
        : [...batchValid, 'exportTime', 'exportCount']
      const valids = await this.fieldsValid(validateField)
      if (valids && valids.length) return
      const api = this.isAll ? 'deviceBaseBlankExportAll' : 'deviceBaseBlankExportPart'
      const params = {
        exportTime: moment(exportTime).format('YYYY-MM-DD HH:mm:ss'),
        exportCount,
        id: this.content.id,
        onlyExport
      }
      if (!this.isAll) {
        params.iccidBatchs = iccidBatchs
      }
      let rst = await this.jaxLib.store[api](params)
      if (rst.success) {
        if (onlyExport) {
          if (rst.data) {
            await Download({ ...rst.data, loop: true })
          } else {
            this.$message.success('操作成功，文件过大，请到下载管理页面查看')
          }
        }
        this.$emit('confirm', onlyExport)
        this.close()
      }
    },
    iccidRangeChange(data) {
      this.formData.iccidBatchs = data
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
