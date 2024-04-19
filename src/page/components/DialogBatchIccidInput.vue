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
    <el-form :model="form" ref="form" :rules="rules">
      <el-form-item prop="isFileUpload">
        <el-radio
          v-model="form.isFileUpload"
          :label="false"
          @change="onIsFileUploadChange"
          >手动批量备注</el-radio
        >
        <el-radio
          @change="onIsFileUploadChange"
          v-model="form.isFileUpload"
          :label="true"
          >文件上传</el-radio
        >
      </el-form-item>
      <el-form-item v-if="!form.isFileUpload" prop="iccids">
        <whIccidInput v-model="form.iccids" />
      </el-form-item>
      <el-form-item v-else label="批量上传" prop="fileUrl">
        <whFileUpload accept=".xls,.xlsx" v-model="form.fileUrl">
          <div
            slot="tip"
            class="el-upload__tip"
            style="text-align: left; position: relative"
          >
            <span>温馨提示：</span>
            <ol>
              <li>请选择模版下载；</li>
              <li>导入必须是xls、xlsx文件；</li>
              <li>只导入EXCEL文件的第一个标签页；</li>
              <li>文件大小最大为10MB；</li>
            </ol>
          </div>
        </whFileUpload>
        <el-link
          href="https://simboss-public.oss-cn-hangzhou.aliyuncs.com/wh/iccid-template.xlsx"
          type="info"
          style="position: absolute; left: 172px; top: 0"
          >下载模板</el-link
        >
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import whIccidInput from '@/global/components/wh-iccid-input.vue'
  import whFileUpload from '@/global/components/wh-file-upload.vue'

  export default {
    props: {
      visible: {
        type: Boolean
      },
      title: {
        default: '批量查询'
      }
    },
    data() {
      return {
        form: {
          isFileUpload: false,
          iccids: [],
          fileUrl: ''
        },
        rules: {
          iccids: [
            {
              required: true,
              message: '该项为必填项',
              trigger: 'blur'
            }
          ],
          fileUrl: [
            {
              required: true,
              message: '请上传文件',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    components: {
      whIccidInput,
      whFileUpload
    },
    methods: {
      onClose() {
        this.$refs.form.resetFields()
        this.$emit('update:visible', false)
      },
      onIsFileUploadChange() {
        this.$refs.form.clearValidate()
      },
      onConfirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$confirm('确定提交批量查询吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal: true
            }).then(() => {
              this.$emit('confirm', {
                iccids: this.form.iccids,
                iccidsOssKey: this.form.fileUrl
              })
              this.onClose()
            })
          }
        })
      }
    }
  }
</script>
