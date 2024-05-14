<script>
import { safeGet } from '@/global/function/safe-operations'
import SubmitCallback from '@/page/customer-service/components/submit-callback'
import { iccidsTransfer } from '@/global/function/iccids-tool'
import dateFormat from '@/global/filters/date-format'
import ListDialog from '@/page/customer-service/children/tag-tools/components/list-dialog'
export const actionOptions = [
  {
    label: '增加标记',
    value: 'addtag'
  },
  {
    label: '取消标记',
    value: 'deltag'
  }
]
export const tagOptions = [
  {
    label: '短信',
    value: '1'
  },
  {
    label: '定位',
    value: '67108864'
  },
  {
    label: '可改套餐',
    value: '4'
  },
  {
    label: '可续加油包',
    value: '8'
  },
  {
    label: '可续套餐',
    value: '32'
  },
  {
    label: '已激活卡支持激活宽限期',
    value: '64'
  }
]
const DEFAULT_FORM_DATA = JSON.stringify({
  action: '',
  iccids: '',
  remark: '',
  mergTags: [],
  type: 'tag',
  activeDeadline: ''
})
export default {
  components: {
    SubmitCallback,
    ListDialog
  },
  data() {
    return {
      actionOptions,
      tagOptions,
      formData: JSON.parse(DEFAULT_FORM_DATA),
      visible: false,
      content: null,
      formRules: {
        iccids: [{ required: true, message: '请输入ICCID', trigger: 'change' }],
        mergTags: [{ required: true, message: '请选择需要编辑的功能' }],
        action: [{ required: true, message: '请选择需要变更为的状态', trigger: 'change' }],
        activeDeadline: [
          { required: true, message: '请选择激活宽限期到期时间', trigger: 'change' }
        ],
        remark: [{ required: false, message: '请输入备注', trigger: 'change' }]
      }
    }
  },
  created() {},
  methods: {
    viewLog() {
      this.$refs.listDialog.open()
    },
    onTypeChange() {
      this.$refs.form.clearValidate()
      if (this.formData.type === 'tag') {
        this.formData = {
          ...this.formData,
          activeDeadline: '',
          mergTags: []
        }
      } else {
        this.formData = {
          ...this.formData,
          mergTags: [-1],
          action: 'addtag' // 需要后端更改
        }
      }
    },
    reset() {
      this.formData = JSON.parse(DEFAULT_FORM_DATA)
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    async submit() {
      await this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { action, iccids, remark, mergTags, activeDeadline, type } = this.formData
          const params = {
            mergTags,
            action,
            remark,
            iccids: iccidsTransfer(iccids)
              .filter((item) => !!item)
              .join()
          }
          if (type === 'modify') {
            params.activeDeadline = dateFormat(activeDeadline, 'YYYY-MM-DD')
          }
          const res = await this.jaxLib.customerServices.modifyCardTags(params)
          if (safeGet(res, 'success', false)) {
            this.$refs.submitCallback.open(res.data)
            this.reset()
          }
        }
      })
    }
  }
}
</script>


<template>
  <div class="forcibly-activate" style="background-color: #fff">
    <list-dialog ref="listDialog" />
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">卡功能打标修改</h2>
      </div>
      <div class="wh__body">
        <submit-callback ref="submitCallback" fail-reason="提交失败原因可能为：卡不存在" />

        <el-form ref="form" label-width="160px" :model="formData" :rules="formRules">
          <el-form-item label="">
            <el-radio-group v-model="formData.type" @change="onTypeChange">
              <el-radio label="tag">打标</el-radio>
              <el-radio label="modify">修改</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="ICCID" prop="iccids">
            <el-input v-model="formData.iccids" type="textarea" rows="6" />
          </el-form-item>
          <template v-if="formData.type === 'tag'">
            <el-form-item label="功能" prop="mergTags">
              <el-checkbox-group v-model="formData.mergTags">
                <el-checkbox
                  v-for="item in tagOptions"
                  :key="item.value"
                  :label="item.value"
                  name="type"
                  >{{ item.label }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="操作类型" prop="action">
              <el-select v-model="formData.action" placeholder="请选择">
                <el-option
                  v-for="item in actionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="功能"> 修改激活宽限期 </el-form-item>
            <el-form-item label="激活宽限期到期时间" prop="activeDeadline">
              <el-date-picker
                v-model="formData.activeDeadline"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </template>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" type="textarea" rows="4" />
          </el-form-item>
          <el-form-item>
            <el-button @click="reset">重置</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
            <el-button type="text" @click="viewLog">查看操作日志</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.search-form-inline {
  & > .el-form-item {
    display: inline-block;
    margin-right: 10px;
  }
}
</style>
