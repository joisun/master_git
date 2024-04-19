<script type="text/jsx">
import DialogMixin from '@/global/mixins/dialog-mixin'
import { mapState } from 'vuex'
import apis from '@/api/ajax'

const form = {
  followMethod: '1', // 本次跟进方式
  followNotice: '', // 跟踪备注
  followPeople: '', // 跟踪人
  nextTime: '', // 下次跟进时间
  nextMethod: '1', // 下次跟进方式
  nextFollow: '',
  extraFollow: true
}
const rules = {
  followMethod: [{ required: true, message: '本次跟进方式不能为空', trigger: 'blur' }],
  followNotice: [{ required: true, message: '本次跟进内容不能为空', trigger: 'blur' }],
  followPeople: [{ required: true, message: '对接人不能为空', trigger: 'blur' }],
  nextTime: [{ type: 'object', required: true, message: '下次跟进时间不能为空', trigger: 'blur' }],
  nextMethod: [{ required: true, message: '下次跟进方式不能为空', trigger: 'blur' }],
  nextFollow: [{ required: true, message: '下次跟进内容不能为空', trigger: 'blur' }]
}

export default {
  mixins: [DialogMixin],
  props: ['content', 'customerId'],

  data() {
    return {
      form: { ...form },
      rules: { ...rules },
      progressing: false,
      contactList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  computed: {
    ...mapState({
      followStyles: (state) => state.overall.crmEnum.followStyle,
      detail: (state) => state.customer.detail
    })
  },

  created() {
    this.getPeopleList()
  },

  methods: {
    open() {
      this.form = { ...form }
    },

    close() {
      this.$refs.form.resetFields()
      this.form = { ...form }
    },

    cancel() {
      this.$emit('onClose', { refreshable: false })
    },
    async getPeopleList() {
      let { success, data } = await apis.crm.customerContactSearch({ customerId: this.customerId })
      if (!success) return false
      this.contactList = data.records
    },
    confirm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        const fields = {
          ...this.form,
          nextTime: +this.form.nextTime,
          missionId: this.content.missionId,
          customId: this.customerId
        }
        if (!this.form.extraFollow) {
          fields.nextTime = null
          fields.nextMethod = null
          fields.nextFollow = null
        }
        const { success } = await apis.crm.missionRecordUpdatePost(fields)
        if (!success) return false
        this.$message.success('修改跟进记录成功')
        this.$emit('onClose', { refreshable: true })
      })
    }
  }
}
</script>

<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="跟进方式" prop="followMethod">
        <el-select v-model="form.followMethod" placeholder="请选择本次跟进方式">
          <el-option
            v-for="item in followStyles"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="对接人" prop="followPeople">
        <el-select v-model="form.followPeople" placeholder="本次对接人">
          <el-option
            v-for="item in contactList"
            :key="`${item.name}(${item.mobile})`"
            :label="`${item.name}(${item.mobile})`"
            :value="item.name || item.mobile"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跟进内容" prop="followNotice">
        <el-input
          v-model="form.followNotice"
          class="width75"
          type="textarea"
          placeholder="本次跟进内容"
          >finance/refund-management
        </el-input>
      </el-form-item>
      <el-form-item label="是否需要额外跟进">
        <el-radio v-model="form.extraFollow" :label="true">是</el-radio>
        <el-radio v-model="form.extraFollow" :label="false">否</el-radio>
      </el-form-item>
      <template v-if="form.extraFollow">
        <el-form-item label="下次跟进方式" prop="nextMethod">
          <el-select v-model="form.nextMethod" placeholder="请选择下次跟进方式">
            <el-option
              v-for="item in followStyles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下次跟进时间" prop="nextTime">
          <el-date-picker
            v-model="form.nextTime"
            type="date"
            :picker-options="pickerOptions"
            placeholder="下次跟进时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下次跟进内容" prop="nextFollow">
          <el-input
            v-model="form.nextFollow"
            class="width75"
            type="textarea"
            placeholder="下次跟进内容"
          >
          </el-input>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.file-upload {
  .el-icon-close {
    position: relative;
    top: 2px;
    left: 3px;
    outline: none;
  }
}
</style>
