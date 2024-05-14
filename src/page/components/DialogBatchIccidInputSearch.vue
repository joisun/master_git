<!--
 * @Author: wushiji
 * @Date: 2021-03-09 16:18:43
 * @Description: 批量Iccid输入的弹框，支持手动填写及模版上传
 * @LastEditors: wushiji
 * @LastEditTime: 2021-03-10 17:23:47
-->
<template>
  <el-dialog
    :visible="visible"
    :title="title"
    width="500px"
    :before-close="onClose"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item prop="isFileUpload">
        <el-radio v-model="form.isFileUpload" :label="false" @change="onIsFileUploadChange"
          >手动输入</el-radio
        >
        <el-radio v-model="form.isFileUpload" :label="true" @change="onIsFileUploadChange"
          >文件上传</el-radio
        >
      </el-form-item>
      <el-form-item v-if="!form.isFileUpload" prop="iccids">
        <!--        <whIccidInput v-model="form.iccids" />-->
        <el-input
          v-model="form.iccids"
          type="textarea"
          :rows="3"
          :placeholder="`可以直接复制excel中整列${keyword}；手动输入多个${keyword}，一行一个；最多10000个；`"
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
      v-if="keyword === 'ICCID'"
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
</template>

<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'

export default {
  components: {},
  props: {
    keyword: {
      type: String,
      default: 'ICCID'
    },
    title: {
      type: String,
      default: '批量查询'
    },
    fileList: {
      type: Array,
      require: true,
      default: () => []
    },
    fileUrl: {
      type: String,
      require: true,
      default: ''
    },
    iccids: {
      type: Array,
      require: true,
      default: () => []
    },
    tempFileUrl: {
      type: String,
      require: true,
      default: 'https://simboss-public.oss-cn-hangzhou.aliyuncs.com/wh/iccid-template.xlsx'
    }
  },
  data() {
    return {
      visible: false,
      form: {
        isFileUpload: false,
        iccids: [],
        fileUrl: ''
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
  methods: {
    fileChange(file, fileList) {
      this.localFileList = fileList
    },
    fileRemove() {
      this.localFileList = []
      this.form.fileUrl = ''
    },
    open() {
      this.visible = true
      this.localFileList = this.fileList
      this.form.iccids = this.iccids.join('\n')
      this.form.fileUrl = this.fileUrl
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
          this.$emit('confirm', {
            iccids: iccidsTransfer(this.form.iccids),
            iccidsOssKey: this.form.fileUrl,
            fileList: this.localFileList
          })
          this.onClose()
          // this.$confirm('确定提交批量查询吗？', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning',
          //   closeOnClickModal: true
          // }).then(() => {
          //
          // })
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
