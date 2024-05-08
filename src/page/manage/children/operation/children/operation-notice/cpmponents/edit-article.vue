<script>
/**
 * Create by zeter on 2017/7/18
 */
import wangeditor from 'wangeditor'
import DialogMixin from '@/global/mixins/dialog-mixin'
import moment from 'moment'
import { mapState } from 'vuex'

// eslint-disable-next-line new-cap

let topStatusCheck = function (rule, value, callback) {
  if (this.formData.state && !this.formData.longTopState && !this.formData.topTime) {
    return callback(new Error('请填写置顶时间'))
  }
  callback()
}
let checkTitle = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('标题不能为空'))
  }
  if (value.length > 30) {
    return callback(new Error('标题不能超出30个字符'))
  }
  callback()
}

export default {
  mixins: [DialogMixin],
  data() {
    return {
      articleId: '',
      formData: {
        title: '',
        topTime: '',
        state: false,
        content: '',
        popups: false,
        longTopState: false,
        userType: 'customer'
      },
      attachment: '',
      fileList: [],
      isBtnLoading: false,
      rules: {
        title: [{ validator: checkTitle, trigger: 'blur' }],
        topStatus: [{ validator: topStatusCheck.bind(this), trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.overall.user
    })
  },

  props: {
    article: {
      default: Object,
      require: true
    },
    showClose: {
      default: String,
      require: true
    }
  },
  mounted() {
    const dom = document.getElementById('editor')
    let editor = new wangeditor(dom)
    editor.config.menus = [
      'head',
      'bold',
      'italic',
      'underline',
      'link',
      'justify',
      'image',
      'code',
      'undo'
    ]
    editor.config.onchange = (html) => {
      this.formData.content = html
    }
    editor.config.uploadImgMaxSize = 3 * 1024 * 1024
    editor.config.uploadImgMaxLength = 1
    editor.config.uploadImgTimeout = 1000 * 30
    editor.config.uploadImgServer = '/ajax/common/image/upload'
    editor.config.showLinkImg = false
    editor.create()
    editor.txt.html(this.formData.content)
  },
  methods: {
    open() {
      if (this.article) {
        this.formData = {
          title: this.article.title,
          state: Boolean(this.article.top_state),
          topTime: this.article.top_time,
          content: this.article.content,
          popups: Boolean(this.article.popups),
          userType: this.article.user_type === 'seller' ? 'seller' : 'customer',
          longTopState: Boolean(this.article.top_state) && !this.article.top_time
        }
        if (this.article.attachment) {
          const { attachment } = this.article
          this.attachment = attachment
          this.fileList = [{ name: attachment.split('/').pop(), url: attachment }]
        }
        this.articleId = this.article.article_id
      } else {
        this.formData = {
          title: '',
          topTime: '',
          state: false,
          content: '',
          popups: false,
          longTopState: false,
          userType: 'customer'
        }
      }
      try {
        editor.txt.html(this.formData.content)
      } catch (e) {}
    },
    close() {
      this.attachment = ''
      this.fileList = []
    },
    sureSubmit() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.formData.popups) {
            this.$confirm(
              '之前已有其他公告使用弹窗发布此条公告发布后将会替代之前的弹窗，确定发布吗',
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            ).then(() => {
              this.submitForm()
            })
          } else {
            this.submitForm()
          }
        } else return false
      })
    },
    async submitForm() {
      let data = { ...this.formData, realName: this.user.realName }
      data.state = !!data.state
      data.topTime =
        data.longTopState || !data.topTime
          ? null
          : moment(data.topTime).format('YYYY-MM-DD HH:mm:ss.SSS')
      delete data.longTopState
      if (this.articleId !== '') data.articleId = this.articleId
      if (!this.article) {
        delete data.articleId
      }
      if (this.attachment) {
        data.content += `<uploaded-attachment>${this.attachment}</uploaded-attachment>`
      }
      let rst = await this.jaxLib.announcement.save(data)
      if (!rst.success) return false
      this.attachment = ''
      this.fileList = []
      this.$message({
        type: 'success',
        message: this.article ? '文章编辑成功！' : '文章新建成功！'
      })
      this.$emit('close', this.showClose, 1)
    },
    resetForm() {
      this.$emit('close', this.showClose, 0)
      editor.txt.clear()
    },
    handleRemove() {
      this.attachment = ''
    },
    beforeUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50
      if (!isLt50M) {
        this.$message({ type: 'error', message: '附件大小不超过50M' })
        this.attachment = ''
        this.fileList = []
        return false
      }
      return true
    },
    handleUploadSuccess(response) {
      if (!response.success || !response.data.fileUrl) {
        this.$message({ type: 'error', message: '上传失败' })
        return false
      }
      this.attachment = response.data.fileUrl
    }
  }
}
</script>

<template>
  <div class="edit-article">
    <el-form ref="formData" :model="formData" label-width="80px" :rules="rules">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title"></el-input>
      </el-form-item>
      <el-form-item label="置顶规则" prop="topStatus">
        <el-checkbox v-model="formData.state" label="置顶" name="type"> </el-checkbox>
        <el-checkbox
          v-if="formData.state"
          v-model="formData.longTopState"
          label="长期置顶"
          name="type"
        >
        </el-checkbox>
        <el-date-picker
          v-if="formData.state && !formData.longTopState"
          v-model="formData.topTime"
          type="datetime"
          placeholder="选择置顶日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否弹窗">
        <el-radio-group v-model="formData.popups">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发布对象">
        <el-radio-group v-model="formData.userType">
          <el-radio label="seller">销售</el-radio>
          <el-radio label="customer">客户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="内容">
        <div id="editor"></div>
      </el-form-item>
      <el-form-item label="添加附件">
        <el-upload
          action="/ajax/common/file/uploadToPublic"
          :data="{ path: 'announce' }"
          :on-remove="handleRemove"
          :limit="1"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          :file-list="fileList"
        >
          <el-button size="small" :disabled="!!attachment"
            ><i class="el-icon-upload2"></i> 点击上传</el-button
          >
          <div slot="tip" class="el-upload__tip">附件大小不超过50M</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="isBtnLoading || !user" @click="sureSubmit"
          >立即保存</el-button
        >
        <el-button @click="resetForm">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
