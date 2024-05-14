<template>
  <el-dialog
    :title="isAdd ? '新增' : '编辑'"
    :visible.sync="visible"
    :before-close="handleClose"
    destroy-on-close
  >
    <el-form ref="form" :model="formData" label-width="140px" :rules="rules">
      <el-form-item label="运营商" prop="carrier">
        <el-select
          v-model="formData.carrierName"
          placeholder="选择运营商"
          clearable
          @change="onCarrierChange"
        >
          <el-option
            v-for="(key, val) in enums.carrier.maps()"
            :key="val"
            :label="key"
            :value="val"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.carrierName" label="变更前运营商账号" prop="oldCarrierAccountId">
        <wh-carrier-account-select
          v-model="formData.oldCarrierAccountId"
          :carrier="formData.carrierName"
        />
      </el-form-item>
      <el-form-item v-if="formData.carrierName" label="变更后运营商账号" prop="newCarrierAccountId">
        <wh-carrier-account-select
          v-model="formData.newCarrierAccountId"
          :carrier="formData.carrierName"
        />
      </el-form-item>
      <el-form-item label="变更类型" prop="type">
        <el-select v-model="formData.type" allow-create style="width: 300px">
          <el-option
            v-for="item in computedTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="!isAdd" label="历史备注" prop="remark">
        <el-input v-model="content.remark" type="textarea" :rows="6" readonly />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="6" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select'
import { safeGet } from '@/global/function/safe-operations'
const DEFAULT_FORM = JSON.stringify({
  id: '',
  oldCarrierAccountId: undefined,
  newCarrierAccountId: undefined,
  type: '',
  carrierName: '',
  remark: ''
})
export default {
  components: {
    'wh-carrier-account-select': whCarrierAccountSelect
  },
  data() {
    return {
      visible: false,
      formData: JSON.parse(DEFAULT_FORM),
      typeOptions: null,
      content: {},
      rules: {
        carrierName: {
          required: true,
          message: '请选择运营商'
        },
        oldCarrierAccountId: {
          required: true,
          message: '请选择变更前运营商账号'
        },
        newCarrierAccountId: {
          required: true,
          message: '请选择变更后运营商账号'
        },
        type: {
          required: true,
          message: '请选择变更类型'
        }
      }
    }
  },
  computed: {
    isAdd() {
      return !this.content
    },
    computedTypeList() {
      const { carrierName } = this.formData
      if (!carrierName || !this.typeOptions) return []
      const mapper = this.typeOptions[carrierName]
      return Object.keys(mapper).map((key) => {
        return {
          value: key,
          label: mapper[key]
        }
      })
    }
  },
  methods: {
    async getTypes() {
      const res = await this.jaxLib.whitelist.accountMatchGetTypeMap()
      if (safeGet(res, 'success', false)) {
        this.typeOptions = res.data
      }
    },
    onCancel() {
      this.resetForm()
      this.visible = false
    },
    onConfirm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        const { newCarrierAccountId, oldCarrierAccountId, type, carrierName, id, remark } =
          this.formData
        const params = {
          newCarrierAccountId,
          oldCarrierAccountId,
          type,
          carrierName,
          id,
          remark: `${(this.content || {}).remark ? this.content.remark + ';' : ''}${remark}`
        }
        const res = await this.jaxLib.whitelist[
          this.isAdd ? 'accountMatchAdd' : 'accountMatchUpdate'
        ](params)
        if (res && res.success) {
          this.$message.success('保存成功')
          this.resetForm()
          this.$emit('confirm')
          this.visible = false
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.formData = JSON.parse(DEFAULT_FORM)
    },
    handleClose() {
      this.resetForm()
      this.visible = false
    },
    async onCarrierChange(v) {
      this.formData = {
        ...this.formData,
        newCarrierAccountId: '',
        oldCarrierAccountId: '',
        type: ''
      }
    },
    async open(content) {
      this.getTypes().then()
      this.content = content
      this.formData = {
        ...this.formData,
        carrierName: (content || {}).carrier,
        ...(content || {}),
        remark: ''
      }
      this.visible = true
    }
  }
}
</script>
