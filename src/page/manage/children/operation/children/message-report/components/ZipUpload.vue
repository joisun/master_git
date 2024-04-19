<script>
  import zip from './zip.png'

  export default {
    data() {
      return {
        fileInput: undefined,
        disabled: false,
        file: undefined,
        fileList: [],
        zip
      }
    },
    methods: {
      handleRemove({ url }) {
        this.file = undefined
        this.fileList = this.fileList.filter((item) => item.url !== url)
      },
      submit() {
        this.$refs.upload.submit()
      },
      onFileChange(e) {
        this.file = e
      },
      onFileRemove() {
        this.file = undefined
      },
      async onSuccess(e) {
        const url = e.data.fileUrl
        const pattern = /http.*\.com(\/.+)/
        const params = {
          zip: pattern.exec(url)[1]
        }
        const res = await this.jaxLib.customer.certification.createCaseRecordBatch(params)
        if (res.success) {
          this.$emit('success', res.data)
        }
      }
    }
  }
</script>

<template>
  <el-upload
    ref="upload"
    name="zip"
    accept="application/zip"
    action="/ajax/common/file/upload"
    :limit="1"
    :on-change="onFileChange"
    :auto-upload="false"
    :on-remove="onFileRemove"
    :on-success="onSuccess"
  >
    <div slot="tip">
      <p>1、压缩包必须为zip格式；</p>
      <p>
        2、压缩包包含图片和txt描述文件，txt文件名为相应卡片iccid；图片文件名为相应卡片iccid加上'.1'、'.2'等编号
      </p>
    </div>
    <el-button
      slot="trigger"
      size="small"
      type="primary"
      :disabled="file ? true : false"
    >
      选取文件
    </el-button>
  </el-upload>
</template>
