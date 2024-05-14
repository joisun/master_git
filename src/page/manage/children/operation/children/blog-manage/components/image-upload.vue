<script>
  export default {
    props: {
      picUrls: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        file: {},
        fileList: []
      }
    },
    watch: {
      picUrls(val) {
        if (val.length) {
          this.fileList = val.map(item => ({ name: item, url: item }))
        }
      }
    },
    methods: {
      handleRemove({ url }) {
        this.fileList = this.fileList.filter(item => item.url !== url)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleUploadSuccess(response) {
        if (!response.success || !response.data.fileUrl) {
          this.$message({ type: 'error', message: '上传失败' })
          return false
        }
        const url = response.data.fileUrl
        this.fileList.push({ name: url, url })
      },
      beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isLt2M
      },
      submit() {
        return this.fileList.map(item => item.url)
      }
    }
  }
</script>

<template>
  <div class="image-upload">
    <el-upload
      accept="image/jpeg,image/jpg,image/png"
      action="/ajax/common/file/uploadToPublic"
      :data="{path: 'items'}"
      :limit="5"
      list-type="picture-card"
      :file-list="fileList"
      :on-success="handleUploadSuccess"
      :before-upload="beforeUpload"
      :auto-upload="true">
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url" alt=""
        >
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
