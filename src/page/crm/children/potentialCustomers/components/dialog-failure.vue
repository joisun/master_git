<script>
import DialogMixin from '@/global/mixins/dialog-mixin'
import { cloneDeep } from 'lodash'
const form = {
  reasonNotice: '',
  tag: ''
}
export default {
  mixins: [DialogMixin],
  inject: ['tuple'],
  data() {
    return {
      tagEnum: {
        INVALID: 'invalid',
        NORMAL: 'normal'
      },
      rules: {
        tag: [{ required: true, message: '请选择输单类型', trigger: 'submit' }]
      },
      // cascaderProps: {
      //   label: 'name',
      //   value: 'id'
      // },
      form: cloneDeep(form)
    }
  },

  computed: {
    noticeRequired() {
      return this.form.reason.some((e) => {
        return e.value.some(
          (i) => i === '18' || i === '19' || i === '20' || i === '24' || i === '25'
        )
      })
    }
  },
  methods: {
    close() {
      this.form = cloneDeep(form)
      this.$refs.form.resetFields()
    },

    // addReason () {
    //   this.form.reason.push({value: []})
    // },

    // deleteReason (index) {
    //   this.form.reason.splice(index, 1)
    // },

    cancel() {
      this.$emit('onClose', { type: 'failure', refreshable: false })
    },
    confirm() {
      this.$refs.form.validate((valid) => {
        console.log('🎸 szy_52 dialog-failure.vue 👉', valid)
        if (!valid) return
        let hash = cloneDeep(this.form)
        hash.reason = ''
        this.$emit('onClose', { type: 'failure', refreshable: true, data: hash })
      })
    }
  }
}
</script>
<template>
  <div class="abandon-customer">
    <el-form ref="form" :model="form" label-width="90px" :rules="rules">
      <!-- :rules="{required: noticeRequired, message: '请填写说明', trigger: 'blur'}" -->
      <el-form-item label="输单类型" prop="tag">
        <el-radio-group v-model="form.tag">
          <el-radio :label="tagEnum.INVALID">无效客户</el-radio>
          <el-radio :label="tagEnum.NORMAL">正常输单</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="说明" prop="reasonNotice">
        <el-input v-model="form.reasonNotice" type="textarea"></el-input>
      </el-form-item>
      <el-form-item>
        <!--<el-button @click="addReason">新增原因</el-button>-->
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
