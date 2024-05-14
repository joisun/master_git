<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" :inline="false">
      <el-form-item prop="isFileUpload">
        <el-radio v-model="form.isFileUpload" :label="false" @change="onIsFileUploadChange"
          >手动输入</el-radio
        >
        <el-radio v-model="form.isFileUpload" :label="true" @change="onIsFileUploadChange"
          >文件上传</el-radio
        >
      </el-form-item>
      <el-form-item v-if="!form.isFileUpload && computedSearchTypeOptions.length > 1" label="">
        <el-radio-group v-model="form.keyword">
          <el-radio
            v-for="item in computedSearchTypeOptions"
            :key="item.value"
            :label="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="!form.isFileUpload" prop="value">
        <el-input
          v-model="form.value"
          type="textarea"
          :rows="3"
          style="width: 400px"
          :placeholder="`可以直接复制excel中整列${
            searchTypeOptionsMap[form.keyword]
          }；手动输入多个${searchTypeOptionsMap[form.keyword]}，一行一个；最多10000个；`"
          @change="inputChange"
        />
      </el-form-item>
      <el-form-item v-else label="" prop="ossKey">
        <el-upload
          v-model="form.ossKey"
          accept=".xls,.xlsx"
          action="/ajax/common/file/upload"
          :limit="1"
          :on-success="onSuccess"
          class="wh-file-upload"
          :file-list="localFileList"
          style="display: flex"
          drag
          :on-change="fileChange"
          :on-remove="fileRemove"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip" style="margin-left: 20px">
            <span>温馨提示：</span>
            <ol>
              <li>
                请选择模版下载；<el-link
                  style="color: #ec407a; vertical-align: baseline"
                  :href="tempFileUrl"
                  type="info"
                  >下载模板</el-link
                >
              </li>
              <li>导入必须是xls、xlsx文件；</li>
              <li>只导入EXCEL文件的第一个标签页；</li>
              <li>文件大小最大为10MB；</li>
            </ol>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-alert
      v-if="form.keyword === 0 && showTips"
      style="line-height: 14px"
      title="批量查询不支持模糊查询，联通ICCID存在校验位，请检查输入的卡号是否完整，否则会出现查询结果不全的情况"
      type="info"
      show-icon
      :closable="false"
    />
  </div>
</template>

<script>
import { searchTypeOptions } from '@/page/components/DialogBatchIccidInputSearchV2'
import { iccidsTransfer } from '@/global/function/iccids-tool'

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
  props: {
    tempFileUrl: {
      type: String,
      require: true,
      default: 'https://simboss-public.oss-cn-hangzhou.aliyuncs.com/wh/iccid-template.xlsx'
    },
    searchTypes: {
      type: Array,
      require: true,
      default: () => ['0', '1', '2', '3']
    },
    showTips: {
      type: Boolean,
      require: false,
      default: true
    }
  },
  data() {
    return {
      localFileList: [],
      rules: {
        value: [
          {
            required: false,
            trigger: 'blur'
          }
        ],
        ossKey: [
          {
            required: false,
            trigger: 'blur'
          }
        ]
      },
      searchTypeOptionsMap,
      searchTypeOptions,
      batchDialogData: {
        fileList: [],
        value: []
      },
      form: {
        isFileUpload: false,
        value: '',
        ossKey: '',
        keyword: 0
      }
    }
  },
  computed: {
    computedSearchTypeOptions() {
      return this.searchTypeOptions.filter((item) => this.searchTypes.includes(`${item.value}`))
    }
  },
  watch: {
    'searchTypes.length'(newValue) {
      if (newValue.length === 1) {
        this.form.keyword = newValue[0]
      }
    }
  },
  methods: {
    inputChange() {
      this.$emit('change', {
        ...this.form,
        ossKey: '',
        iccids: '',
        msisdns: '',
        imsis: '',
        ips: '',
        [paramsTypeMap[this.form.keyword]]: iccidsTransfer(this.form.value)
          .filter((item) => !!item)
          .join()
      })
    },
    getData() {
      let params = {
        ...this.form
      }
      if (this.form.isFileUpload) {
        params = {
          ...this.form,
          iccids: '',
          msisdns: '',
          imsis: '',
          ips: '',
          value: ''
        }
      } else {
        params = {
          ...this.form,
          ossKey: '',
          iccids: '',
          msisdns: '',
          imsis: '',
          ips: '',
          [paramsTypeMap[this.form.keyword]]: iccidsTransfer(this.form.value)
            .filter((item) => !!item)
            .join()
        }
      }
      return params
    },
    fileChange(file, fileList) {
      this.localFileList = fileList
    },
    fileRemove() {
      this.localFileList = []
      this.form.ossKey = ''
    },
    onSuccess(data) {
      if (data && data.data) {
        this.form.ossKey = data.data.filePosition
        this.$emit('change', {
          ...this.form,
          iccids: '',
          msisdns: '',
          imsis: '',
          ips: '',
          value: ''
        })
      }
    },
    onIsFileUploadChange() {
      this.form = {
        ...this.form,
        iccids: '',
        msisdns: '',
        imsis: '',
        ips: '',
        value: '',
        ossKey: ''
      }
      this.localFileList = []
      this.$refs.form.clearValidate()
      this.$emit('change', {
        ...this.form
      })
    }
  }
}
</script>
