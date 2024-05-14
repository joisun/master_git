<template>
  <el-dialog title="核销" :visible.sync="visible" :before-close="beforeClose" width="30%">
    <el-form
      ref="form"
      label-width="120px"
      :model="formData"
      :rules="rules"
      :validate-on-rule-change="false"
    >
      <el-form-item label="核销方式" prop="type">
        <el-radio-group v-model="formData.type" @change="typeChange">
          <el-radio label="all">全部核销</el-radio>
          <el-radio label="part">部分核销</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="核销数量" prop="dunderwritingNum">
        <el-input-number
          v-model="formData.dunderwritingNum"
          :min="1"
          :max="maxNum"
          :disabled="formData.type === 'all'"
        />
      </el-form-item>
      <el-form-item label=""> 核销后，将有系统消息通知销售 </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="onSubmit"> 提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
const DEFAULT_FORM_DATA = JSON.stringify({
  dunderwritingNum: undefined,
  type: ''
})
export default {
  data() {
    return {
      visible: false,
      formData: JSON.parse(DEFAULT_FORM_DATA),
      success: [],
      isLoading: false,
      data: {},
      baseContent: {},
      carrierChargeId: '',
      content: {}
    }
  },
  computed: {
    maxNum() {
      const { reserveNum, dunderwritingNum } = this.content
      return reserveNum - dunderwritingNum
    },
    rules() {
      return {
        type: [{ required: true, message: '请选择核销方式' }],
        dunderwritingNum: [{ required: true, message: '请输入核销数量' }]
      }
    }
  },
  methods: {
    typeChange(v) {
      if (v === 'all') {
        this.formData.dunderwritingNum = this.maxNum
      } else {
        this.formData.dunderwritingNum = undefined
      }
    },
    close() {
      this.formData = JSON.parse(DEFAULT_FORM_DATA)
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
      this.visible = false
    },
    beforeClose() {
      this.close()
    },
    open(content) {
      this.content = content
      console.log('🎸 DEBUG_82 write-off-modal.vue 👉', this.content)
      this.visible = true
    },
    // 提交保存
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        const params = {
          id: this.content.id,
          dunderwritingNum: this.formData.dunderwritingNum
        }
        let rst = await this.jaxLib.store.dunderwriting(params)
        if (rst.success) {
          this.$message.success('操作成功！')
          this.$emit('confirm')
          this.close()
        }
      })
    }
  }
}
</script>
