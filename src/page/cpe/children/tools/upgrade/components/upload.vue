<script>
import apis from '@/api/ajax'
import moment from 'moment'

const releaseFormFields = () => ({
  cpeModel: [],
  appType: '',
  storeType: '',
  version: '',
  remark: '',
  dependFirmware: '',
  releaseDate: ''
})
export default {
  props: {
    supplierProduct: {
      type: Array,
      default: () => []
    },
    firmwareList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      fileList: [],
      releaseData: releaseFormFields(),
      uploadInfo: {},
      loading: false,
      uploadFormRules: {
        cpeModel: { required: true, message: 'CPE型号不能为空', trigger: 'change' },
        appType: { required: true, message: '请选择应用类型', trigger: 'change' },
        storeType: { required: true, message: '请选择存储类型', trigger: 'change' },
        dependFirmware: { required: true, message: '请选择依赖固件', trigger: 'change' },
        releaseDate: { required: true, message: '发布日期不能为空', trigger: 'change' },
        version: { required: true, message: '版本号不能为空', trigger: 'blur' }
      },
      appType: [ 'OS', 'JARVIS', 'FRPC' ],
      storeType: [ 'FLASH', 'RAM' ]
    }
  },
  methods: {
    handleRemove() {
      this.uploadInfo = {}
    },
    beforeUpload(file) {
      const matchReg = /.+-([\d\w\(\)]+)-(\d{8})-([.\d\w]+).(?:tar.gz|bin)/
      const match = file.name.match(matchReg)
      if (!match || !match[1] || !match[2] || !match[3]) {
        this.$message({ type: 'error', message: '上传文件名不合法' })
        return false
      }
      const selectedCpeModel = this.releaseData.cpeModel.map(item => item.replace('-', ''))
      if (selectedCpeModel.indexOf(match[1]) === -1) {
        this.$message({ type: 'error', message: '固件与所选型号不匹配' })
        return false
      }
      const isLt16M = file.size / 1024 / 1024 < 16
      if (!isLt16M) {
        this.$message({ type: 'error', message: '附件大小不超过16M' })
        this.fileList = []
        return false
      }
      this.releaseData.version = match[3]
      this.releaseData.releaseDate = moment(match[2]).format('YYYY-MM-DD')
      this.uploadInfo.size = file.size
      return true
    },
    handleUploadSuccess(response) {
      if (!response || !response.success || !response.data.fileUrl) {
        this.$message({ type: 'error', message: '上传失败' })
        return false
      }
      this.uploadInfo = { ...this.uploadInfo, fileKey: response.data.filePosition, md5: response.data.etag }
    },
    async upload() {
      this.$refs.uploadForm.validate(async valid => {
        if (!valid) {
          return false
        }
        if (!this.uploadInfo.fileKey) {
          return this.$message({ type: 'error', message: '请选择上传固件' })
        }
        const data = { ...this.uploadInfo, ...this.releaseData, cpeModel: this.releaseData.cpeModel.join(',') }
        this.loading = true
        const { success } = await apis.cpe.firmwareRelease(data)
        this.loading = false
        if (!success) return false
        this.$emit('upload-success')
        this.$message({ type: 'success', message: '上传成功' })
        this.$refs.uploadForm.resetFields()
        this.uploadInfo = {}
        this.fileList = []
      })
    }
  }
}
</script>

<template>
  <div class="cpe-upgrade-upload">
    <el-form label-width="120px" ref="uploadForm" :model="releaseData" :rules="uploadFormRules">
      <el-form-item label="支持CPE型号" prop="cpeModel">
        <el-select v-model="releaseData.cpeModel" multiple filterable>
          <el-option v-for="item in supplierProduct" :key="item.id" :value="item.model">{{item.model}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用类型" prop="appType">
        <el-select v-model="releaseData.appType">
          <el-option v-for="item in appType" :key="item" :value="item" :label="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="依赖的固件"
        prop="dependFirmware"
        v-if="releaseData.appType && releaseData.appType !== 'OS'"
      >
        <el-select v-model="releaseData.dependFirmware" clearable>
          <el-option
            v-for="item in firmwareList"
            :key="item.id"
            :value="item.id"
            :label="`${item.cpeModel} - ${item.appType} - ${item.version}`"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="存储类型" prop="storeType">
        <el-select v-model="releaseData.storeType">
          <el-option v-for="item in storeType" :key="item" :value="item" :label="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传固件">
        <el-upload
          accept=".bin,.gz"
          action="/ajax/common/file/upload"
          :data="{ path: 'netbox/firmware', isPublicRead: true, isRename: false }"
          :on-remove="handleRemove"
          :limit="1"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          :file-list="fileList"
          :auto-upload="true"
        >
          <el-button size="small" :disabled="!!uploadInfo.fileKey || !releaseData.cpeModel.length"><i class="el-icon-upload2"></i> 点击上传
          </el-button>
          <div slot="tip" class="el-upload__tip">
            <p>附件大小不超过16M</p>
            <p>文件名需包含日期和版本号，格式如：XXXX-XXXX-20201109-0.41.bin，XXXX-XXXX-20201109-0.41.tar.gz</p>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="发布日期" prop="releaseDate">
        <el-date-picker placeholder="请选择发布日期" v-model="releaseData.releaseDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input placeholder="请输入版本号" v-model="releaseData.version"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="releaseData.remark" :row="5" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="upload">上传</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.cpe-upgrade-upload {
  .el-input, .el-select, .el-textarea {
    width: 400px;
  }
}
</style>
