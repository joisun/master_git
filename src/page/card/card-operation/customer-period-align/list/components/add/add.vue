<template>
  <el-dialog
    title="新增客户侧套餐周期对齐"
    :visible.sync="visible"
    width="30%"
    :before-close="beforeClose"
  >
    <el-form
      ref="form"
      label-width="150px"
      :model="formData"
      :rules="rules"
      :validate-on-rule-change="false"
    >
      <el-form-item label="对齐方式" prop="type">
        <el-select v-model="formData.type" clearable placeholder="对齐方式" @change="onTypeChange">
          <el-option
            v-for="key in Object.keys(typeMap)"
            :key="key"
            :label="typeMap[key]"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="formData.type === 'SPECIFY_TIME'"
        label="指定固定激活时间"
        prop="dateActivated"
      >
        <el-date-picker
          v-model="formData.dateActivated"
          type="datetime"
          placeholder="选择日期"
          format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="ICCID" prop="iccids">
        <el-input v-model="formData.iccids" rows="6" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit"> 提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'
import dateFormat from '@/global/filters/date-format'
import { typeMap } from '../../mixins/const'

export default {
  data() {
    return {
      visible: false,
      typeMap,
      formData: {
        type: '',
        dateActivated: '',
        iccids: ''
      }
    }
  },
  computed: {
    rules() {
      return {
        type: [{ required: true, message: '请选择对齐方式', trigger: 'blur' }],
        dateActivated: [{ required: true, message: '请选择指定激活时间', trigger: 'blur' }],
        iccids: [{ required: true, message: '请输入iccid', trigger: 'blur' }]
      }
    }
  },
  methods: {
    onTypeChange() {
      this.formData.dateActivated = ''
    },
    open() {
      this.visible = true
    },
    close() {
      this.$refs.form && this.$refs.form.resetFields()
      this.visible = false
    },
    beforeClose(done) {
      this.close()
      done()
    },
    // 提交保存
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        let rst = await this.jaxLib.store.userRatePlanAlignRecordSave({
          ...this.formData,
          dateActivated: dateFormat(this.formData.dateActivated, 'YYYY-MM-DD HH:mm:ss'),
          iccids: iccidsTransfer(this.formData.iccids).join()
        })
        if (rst.success) {
          this.$message.success('操作成功！')
          this.$emit('confirm')
          this.close()
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
