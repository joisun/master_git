<script>
import { safeGet } from '@/global/function/safe-operations'
import vpdnApnFormat from '@/global/filters/vpdn-apn-format'
export default {
  props: {},
  data() {
    return {
      vpdnApnFormat,
      formData: {
        carrier: '',
        carrierName: '',
        apn: '',
        type: '',
        services: []
      },
      visible: false,
      content: null,
      formRules: {
        carrier: [{ required: true, message: '请选择运营商', trigger: 'change' }],
        carrierName: [{ required: true, message: '请填写运营商账号', trigger: 'change' }],
        apn: [{ required: true, message: '请填写APN名称', trigger: 'change' }],
        type: [{ required: true, message: '请选择APN类型', trigger: 'change' }],
        services: [{ required: true, message: '请至少选一个配置服务', trigger: 'change' }]
      }
    }
  },
  methods: {
    open(content) {
      this.content = content
      this.formData = {
        ...this.formData,
        ...content
      }
      this.visible = true
    },
    handleClose() {
      this.reset()
      this.visible = false
    },
    reset() {
      this.formData = {
        carrier: '',
        carrierName: '',
        apn: '',
        type: '',
        services: []
      }
      this.$refs.form.resetFields()
    },
    async submit() {
      await this.$refs.form.validate(async (valid) => {
        if (valid) {
          const res = await this.jaxLib.vpdn.apn[this.content ? 'update' : 'add']({
            ...this.formData
          })
          if (safeGet(res, 'success', false)) {
            this.$message.success('操作成功')
            this.$emit('confirm')
            this.reset()
            this.visible = false
          }
        }
      })
    }
  }
}
</script>

<template>
  <div class="edit-dialog">
    <el-dialog
      :title="content ? '修改' : '新增'"
      :visible.sync="visible"
      width="50%"
      @close="handleClose"
      destroy-on-close
    >
      <el-form ref="form" label-width="160px" :model="formData" :rules="formRules">
        <el-form-item label="运营商" prop="carrier">
          <el-select v-model="formData.carrier" class="width100">
            <el-option
              v-for="(item, key) in enums.carrier.maps()"
              :key="key"
              :label="item"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运营商名称" prop="carrierName">
          <el-input v-model="formData.carrierName" />
        </el-form-item>
        <el-form-item label="APN名称" prop="apn" style="width: 300px">
          <el-input v-model="formData.apn" />
        </el-form-item>
        <el-form-item label="APN类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择APN类型">
            <el-option
              v-for="(_, val) in enums.vpdnApnType.maps()"
              :key="val"
              :label="`${val} （${vpdnApnFormat(val)}）`"
              :value="val"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配置服务" prop="services">
          <el-checkbox-group v-model="formData.services">
            <el-checkbox
                v-for="(key, val) in enums.vpdnTag.maps()"
                :key="val"
                :label="val"
            >
              {{key}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
