<script>
/**
 * Create by zeter on 2020/3/3
 */
import RealTimeInputTagSearch from '@/global/mixins/real-time-input-tag'
import RealTimeInputMarkSearch from '@/global/mixins/real-time-input-mark'
import DialogMixin from '@/global/mixins/dialog-mixin'
import { mapState } from 'vuex'
import moment from 'moment'
import apis from '@/api/ajax'
export default {
  name: 'dialogMissionForm',
  props: ['content', 'modelName'],
  mixins: [RealTimeInputTagSearch, RealTimeInputMarkSearch, DialogMixin],
  data() {
    const missionNameValidator = (rule, value, callback) => {
      if (!value.trim()) return callback(new Error('请输入任务'))
      if (value.length > 10) return callback(new Error('任务名称不能超过10个字符'))
      return callback()
    }
    const fileValidator = (rule, value, callback) => {
      if (this.form.selectMethod === 'FILE_UPLOAD' && value === '')
        return callback(new Error('请上传文件'))
      return callback()
    }
    const timeValidator = (rule, value, callback) => {
      if (!value || !value.length) {
        return callback(new Error('请选择任务时间'))
      }
      return callback()
    }
    return {
      sellerList: [],
      fileList: [],
      loading: false,
      form: {
        missionName: '',
        selectMethod: 'CONDITION_FILTRATE',
        fileKey: '',
        targetCustomerRank: [],
        targetSaleNumber: [],
        targetCustomerRemark: [],
        updateCustomerInfo: false,
        time: '',
        missionType: '',
        requiredMethod: '',
        missionPurpose: ''
      },
      rules: {
        missionName: [{ validator: missionNameValidator, trigger: 'blur' }],
        selectMethod: [{ required: true, message: '请选择任务客户筛选方式', trigger: 'change' }],
        fileKey: [{ validator: fileValidator, trigger: 'change' }],
        time: [{ validator: timeValidator, trigger: 'change' }],
        missionType: [{ required: true, message: '请选择任务跟进类型', trigger: 'change' }],
        requiredMethod: [{ required: true, message: '请选择任务跟进方式', trigger: 'change' }],
        missionPurpose: [{ required: true, message: '请填写本次任务原因', trigger: 'change' }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  mounted() {
    this.getSubordinates()
  },
  computed: {
    ...mapState({
      followStyles: (state) => state.overall.crmEnum.followStyle,
      missionType: (state) => state.overall.crmEnum.missionType,
      SelectMethod: (state) => state.overall.crmEnum.selectMethod
    }),
    isEditing() {
      return this.content !== null
    }
  },
  methods: {
    async getDetail() {
      this.loading = true
      const { success, data } = await this.jaxLib.crm.missionDetailGet({
        id: this.content.id
      })
      this.loading = false
      if (!success) return false
      this.form = {
        missionName: data.missionName,
        selectMethod: data.selectMethod,
        targetCustomerRank: data.targetCustomerRank ? data.targetCustomerRank.split(',') : [],
        targetSaleNumber: data.targetSellers.map((e) => e.saleNumber),
        targetCustomerRemark: data.targetCustomerRemarks.map((e) => e.id),
        updateCustomerInfo: data.updateCustomerInfo,
        time: [new Date(data.startTime), new Date(data.endTime)],
        missionType: data.missionType,
        requiredMethod: data.requiredMethod,
        missionPurpose: data.missionPurpose
      }
    },
    down() {
      window.location.href = '/template/mission-customer.xlsx'
    },
    async getSubordinates() {
      const { success, data } = await apis.crm.getSubordinates()
      if (!success) return false
      this.sellerList = data
    },
    onFileUploadSuccess(res, file) {
      this.fileList = [file]
      this.form.fileKey = res.data.filePosition
    },
    onFileUploadDel() {
      this.fileList = []
      this.form.fileKey = ''
    },
    open() {
      if (this.content) this.getDetail()
      else this.$refs.form.resetFields()
    },
    close() {
      this.$emit('onClose', this.modelName, false)
    },
    postForm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        let postMethod = this.jaxLib.crm.missionCreatePost
        if (this.content) postMethod = this.jaxLib.crm.missionUpdatePost
        let data = {
          missionName: this.form.missionName,
          updateCustomerInfo: this.form.updateCustomerInfo,
          endTime: moment(this.form.time[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
          startTime: moment(this.form.time[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          missionType: this.form.missionType,
          requiredMethod: this.form.requiredMethod,
          missionPurpose: this.form.missionPurpose
        }
        if (this.content) {
          data.id = this.content.id
        } else {
          data.selectMethod = this.form.selectMethod
          if (this.form.selectMethod === 'FILE_UPLOAD') data.fileKey = this.form.fileKey
          else {
            data.targetCustomerRank = this.form.targetCustomerRank.join(',')
            data.targetSaleNumber = this.form.targetSaleNumber.join(',')
            data.targetCustomerRemark = this.form.targetCustomerRemark.join(',')
          }
        }
        const { success } = await postMethod(data)
        if (!success) return false
        this.$message.success('提交成功')
        this.$emit('onClose', this.modelName, true)
      })
    }
  }
}
</script>

<template>
  <div class="dialogMissionForm" v-loading="loading">
    <el-form :model="form" :rules="rules" ref="form" label-width="160px">
      <el-form-item label="任务名称" prop="missionName">
        <el-input v-model="form.missionName" placeholder="请输入内容(不超过10个字符)"> </el-input>
      </el-form-item>
      <el-form-item label="任务客户选择方式" prop="selectMethod">
        <el-radio-group v-model="form.selectMethod" :disabled="isEditing">
          <el-radio v-for="item in SelectMethod" :label="item.id" :key="item.id">
            {{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上传" prop="fileKey" v-if="form.selectMethod === 'FILE_UPLOAD'">
        <el-upload
          accept="xlsx"
          name="price-excel"
          :show-file-list="true"
          :multiple="false"
          :file-list="fileList"
          :on-success="onFileUploadSuccess"
          :on-remove="onFileUploadDel"
          action="/ajax/common/file/upload"
        >
          <el-button size="mini" type="primary" :disabled="isEditing">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            <span>只能上传xls/xlsx文件，且文件行数不超过3万条。</span>
            <a @click="down" class="link">下载模板</a>
          </div>
        </el-upload>
      </el-form-item>
      <template v-else>
        <el-form-item label="目标客户等级" prop="targetCustomerRank">
          <el-select
            class="width70"
            clearable
            multiple
            :disabled="isEditing"
            v-model="form.targetCustomerRank"
            placeholder="请选择客户等级（不选择默认全选）"
          >
            <el-option
              v-for="item in ['SKA', 'KA', 'C', 'B', 'A']"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标销售" prop="targetSaleNumber">
          <el-select
            class="width70"
            clearable
            multiple
            v-model="form.targetSaleNumber"
            :disabled="isEditing"
            placeholder="请选择目标销售（不选择默认全选）"
          >
            <el-option
              v-for="item in sellerList"
              :key="item.saleNumber"
              :value="item.saleNumber"
              :label="item.realName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户标记" prop="targetCustomerRemark">
          <el-select
            class="width70"
            clearable
            multiple
            v-model="form.targetCustomerRemark"
            filterable
            remote
            :remote-method="getRemoteInputMarkList"
            :loading="loadingRemoteInputMark"
            :disabled="isEditing"
            placeholder="请选择客户标记（不选择默认全选）"
          >
            <el-option
              v-for="item in remoteInputMarkList"
              :key="item.id"
              :label="item.remark"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <el-form-item label="是否更新用户信息">
        <el-radio-group v-model="form.updateCustomerInfo">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="任务时间" prop="time">
        <el-date-picker
          v-model="form.time"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="任务跟进类型" prop="missionType">
        <el-select v-model="form.missionType" placeholder="选择任务跟进类型">
          <el-option v-for="item in missionType" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务跟进方式" prop="requiredMethod">
        <el-select v-model="form.requiredMethod" placeholder="选择任务跟进方式">
          <el-option
            v-for="item in followStyles"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="本次任务原因" prop="missionPurpose">
        <el-input type="textarea" v-model="form.missionPurpose" placeholder="请输入本次任务原因">
        </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="postForm">确认</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.link {
  color: #4997f8;
  cursor: pointer;
}
</style>
