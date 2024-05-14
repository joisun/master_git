<template>
  <div style="display: inline-block">
    <div style="display: flex; align-items: center">
      <el-input
        :value="value"
        :placeholder="placeholder"
        style="width: 300px"
        @input="handleInput"
        @keydown.native.enter="inputSearch"
      >
        <el-select slot="prepend" v-model="form.keyword" placeholder="请选择" style="width: 110px">
          <el-option
            v-for="item in searchTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-input>
      <el-badge is-dot :hidden="noBatchSearchData" style="margin-left: 5px">
        <el-button icon="el-icon-plus" @click="open">批量查询</el-button>
      </el-badge>
    </div>
    <el-dialog
      :visible="visible"
      :title="title"
      width="600px"
      :before-close="onClose"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" :inline="false">
        <el-form-item prop="isFileUpload">
          <el-radio v-model="form.isFileUpload" :label="false" @change="onIsFileUploadChange"
            >手动输入</el-radio
          >
          <el-radio v-model="form.isFileUpload" :label="true" @change="onIsFileUploadChange"
            >文件上传</el-radio
          >
        </el-form-item>
        <el-form-item v-if="!form.isFileUpload" label="">
          <el-radio-group v-model="form.keyword">
            <el-radio v-for="item in searchTypeOptions" :key="item.value" :label="item.value">{{
              item.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="!form.isFileUpload" prop="iccids">
          <!--        <whIccidInput v-model="form.iccids" />-->
          <el-input
            v-model="form.iccids"
            type="textarea"
            :rows="3"
            :placeholder="`可以直接复制excel中整列${
              searchTypeOptionsMap[form.keyword]
            }；手动输入多个${searchTypeOptionsMap[form.keyword]}，一行一个；最多10000个；`"
          />
        </el-form-item>
        <el-form-item v-else label="批量上传" prop="fileUrl">
          <el-upload
            v-model="form.fileUrl"
            accept=".xls,.xlsx"
            action="/ajax/common/file/upload"
            :limit="1"
            :on-success="onSuccess"
            class="wh-file-upload"
            :file-list="localFileList"
            :on-change="fileChange"
            :on-remove="fileRemove"
          >
            <el-button type="primary">点击上传</el-button>
            <div>
              <span>温馨提示：</span>
              <ol>
                <li>请选择模版下载；</li>
                <li>导入必须是xls、xlsx文件；</li>
                <li>只导入EXCEL文件的第一个标签页；</li>
                <li>文件大小最大为10MB；</li>
              </ol>
            </div>
          </el-upload>
          <el-link :href="tempFileUrl" type="info" style="position: absolute; left: 172px; top: 0"
            >下载模板</el-link
          >
        </el-form-item>
      </el-form>
      <el-alert
        v-if="form.keyword === 0"
        style="line-height: 14px"
        title="批量查询不支持模糊查询，联通ICCID存在校验位，请检查输入的卡号是否完整，否则会出现查询结果不全的情况"
        type="info"
        show-icon
        :closable="false"
      />
      <div slot="footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'

export const searchTypeOptions = [
  {
    label: 'ICCID',
    value: 0
  },
  {
    label: 'MSISDNS',
    value: 1
  },
  {
    label: 'IMSIS',
    value: 2
  },
  {
    label: 'IP',
    value: 3
  }
]
export const searchTypeOptionsMap = {
  0: 'ICCID',
  1: 'MSISDNS',
  2: 'IMSIS',
  3: 'IP'
}
const paramsTypeMap = {
  0: 'iccids',
  1: 'msisdns',
  2: 'imsis',
  3: 'ips'
}
export default {
  components: {},
  props: {
    value: {},
    placeholder: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '批量查询'
    },
    tempFileUrl: {
      type: String,
      require: true,
      default: 'https://simboss-public.oss-cn-hangzhou.aliyuncs.com/wh/iccid-template.xlsx'
    }
  },
  data() {
    return {
      searchTypeOptionsMap,
      searchTypeOptions,
      batchDialogData: {
        fileList: [],
        iccids: []
      },
      batchIccids: undefined,
      visible: false,
      form: {
        isFileUpload: false,
        iccids: [],
        fileUrl: '',
        keyword: 0
      },
      localFileList: [],
      rules: {
        iccids: [
          {
            required: false,
            trigger: 'blur'
          }
        ],
        fileUrl: [
          {
            required: false,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    noBatchSearchData() {
      const { fileList, iccids } = this.batchDialogData
      return (!fileList || fileList.length === 0) && iccids.length === 0
    }
  },
  methods: {
    inputSearch() {
      this.batchDialogData = {
        iccids: [],
        ossKey: '',
        fileList: []
      }
      this.$emit('change', {
        iccids: '',
        msisdns: '',
        imsis: '',
        ips: '',
        [paramsTypeMap[this.form.keyword]]: this.value,
        ossKey: ''
      })
    },
    handleInput(v) {
      this.$emit('input', v)
    },
    fileChange(file, fileList) {
      this.localFileList = fileList
    },
    fileRemove() {
      this.localFileList = []
      this.form.fileUrl = ''
    },
    open() {
      this.visible = true
      this.form.iccids = this.batchDialogData.iccids.join('\n')
    },
    onSuccess(data) {
      if (data && data.data) {
        this.form.fileUrl = data.data.filePosition
      }
    },
    onClose() {
      this.$refs.form.resetFields()
      this.visible = false
    },
    onIsFileUploadChange() {
      this.$refs.form.clearValidate()
    },
    onConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.batchDialogData = {
            iccids: iccidsTransfer(this.form.iccids).filter((item) => !!item),
            ossKey: this.form.fileUrl,
            fileList: this.localFileList
          }
          const { iccids, ossKey } = this.batchDialogData
          this.$emit('input', '')
          this.$emit('change', {
            iccids: '',
            msisdns: '',
            imsis: '',
            ips: '',
            [paramsTypeMap[this.form.keyword]]: iccids.join(),
            ossKey
          })
          this.onClose()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wh-file-upload {
  .el-upload {
    text-align: left !important;
  }
}
</style>
