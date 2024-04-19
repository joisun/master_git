<template>
  <div>
    <div v-show="!isShowPreview" class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">博客页管理 - {{ articleItem ? '编辑文章' : '新增文章' }}</h2>
      </div>
      <div class="wh__body body">
        <el-form
          ref="addForm"
          :model="addForm"
          :rules="addRules"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="addForm.title"
              placeholder="请输入标题"
              style="width: 440px"
            ></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input
              v-model="addForm.author"
              placeholder="请输入作者名字"
              style="width: 440px"
            ></el-input>
          </el-form-item>
          <el-form-item label="导语" prop="intro">
            <el-input
              v-model="addForm.intro"
              placeholder="请输入导语"
              style="width: 440px"
            ></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="coverUrl">
            <el-upload
              accept="image/jpeg,image/jpg,image/png"
              class="avatar-uploader"
              action="/ajax/common/file/uploadToPublic"
              :data="{ path: 'simboss-blog' }"
              :show-file-list="false"
              :on-success="handleCoverImgSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="addForm.coverUrl" :src="addForm.coverUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"> </i>
            </el-upload>
            <div style="font-size: 12px">{{ `只能上传jpg/png文件，且上传尺寸230*150为图片` }}</div>
          </el-form-item>
          <el-form-item label="分类" prop="category">
            <el-select v-model="addForm.category">
              <el-option
                v-for="(item, index) in categoryList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="栏目">
            <el-select v-model="addForm.type" multiple @change="onTypeSelect">
              <el-option
                v-for="(item, index) in typeList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-for="(item, index) in typeList"
            v-if="addForm.type.includes(item.id) && item.name !== '关键词位'"
            :key="index"
            :label="item.name"
            prop="imgUrls"
          >
            <el-upload
              accept="image/jpeg,image/jpg,image/png"
              class="avatar-uploader"
              action="/ajax/common/file/uploadToPublic"
              :data="{ path: 'simboss-blog' }"
              :show-file-list="false"
              :on-success="(file) => handleAvatarSuccess(file, item.id)"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="item.imageUrl"
                :src="item.imageUrl"
                class="avatar"
                :style="`width:${item.size.width}px;height:${item.size.height}px;`"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"> </i>
            </el-upload>
            <div style="font-size: 12px">
              {{ `只能上传jpg/png文件，且上传尺寸为${item.sizeStr}图片` }}
            </div>
          </el-form-item>
          <el-form-item
            v-if="addForm.attachments.videoUrl || isShowMovieView"
            label="上传视频"
            prop="content"
            label-width="80"
          >
            <el-upload
              class="avatar-uploader"
              action="/ajax/common/file/uploadToPublic"
              :data="{ path: 'simboss-blog' }"
              :on-progress="uploadVideoProcess"
              :before-upload="beforeMoveUpload"
              :on-success="(file) => handleMovieSuccess(file, movieTag)"
              :on-error="handleMovieFaile"
              :show-file-list="false"
              :multiple="false"
            >
              <video
                v-if="addForm.attachments.videoUrl && videoFlag == false"
                :src="addForm.attachments.videoUrl"
                class="avatar"
                controls="controls"
              >
                您的浏览器不支持视频播放
              </video>
              <i
                v-else-if="!addForm.attachments.videoUrl && videoFlag == false"
                class="el-icon-plus avatar-uploader-icon"
              ></i>
              <el-progress
                v-if="videoFlag == true"
                type="circle"
                :percentage="videoUploadPercent"
                style="margin-top: 30px"
              ></el-progress>
            </el-upload>
          </el-form-item>
          <el-form-item v-if="isShowRelatedView" label="相关推荐" prop="related">
            <el-select
              v-model="addForm.related"
              multiple-limit="3"
              style="width: 500px"
              clearable
              multiple
            >
              <el-option
                v-for="(item, index) in articleList"
                :key="index"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isShowKeywordView" label="关键字位" prop="keyword">
            <el-input
              v-model="addForm.keyword"
              placeholder="请输入4~6个关键字符"
              style="width: 440px"
            ></el-input>
          </el-form-item>
          <el-form-item label="文章内容" prop="content" visible>
            <div id="editor" style="width: 762px"></div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="primary" @click="preview">预览</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--      <div class="footer">-->
      <!--        <el-button type="primary" @click="save">保存</el-button>-->
      <!--        <el-button type="primary" @click="preview">预览</el-button>-->
      <!--        <el-button @click="cancel">取消</el-button>-->
      <!--      </div>-->
    </div>
    <div v-show="isShowPreview" class="blog-detail">
      <div class="blog-detail__article">
        <h1>{{ addForm.title }}</h1>
        <p class="blog-detail__article--info">
          <span class="blog-detail__article--data">{{ formatTime(addForm.gmtCreated) }}</span>
          <span>{{ addForm.author }}</span>
        </p>
        <div class="article markdown" v-html="addForm.content"></div>
        <el-button type="primary" class="blog-detail__article--cancel" @click="cancelPreview"
          >取消预览</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import E from 'wangeditor'
import BlogMixins from './mixins/blog-mixins'

export default {
  name: 'add-article',
  mixins: [BlogMixins],
  data() {
    return {
      editor: null,
      addForm: {
        title: '',
        author: '',
        type: [],
        coverUrl: '',
        imgUrls: {},
        intro: '',
        category: '',
        related: null,
        attachments: { videoUrl: '' },
        keyword: null,
        content: ''
      },
      addRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'change' }],
        author: [{ required: true, message: '请输入作者', trigger: 'change' }],
        coverUrl: [{ required: true, message: '请选择封面', trigger: 'change' }],
        intro: [{ required: true, message: '请输入导语', trigger: 'change' }],
        imgUrls: [{ required: true, message: '请选择封面', trigger: 'change' }],
        category: [{ required: true, message: '请选择分类', trigger: 'change' }],
        related: [{ required: true, message: '请至少选择一篇相关文章', trigger: 'change' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'change' }]
      },
      isShowPreview: false,
      isShowMovieView: false,
      isShowRelatedView: false,
      isShowKeywordView: false,
      videoFlag: false,
      videoUploadPercent: 0
    }
  },
  created() {
    this.typeList = this.$route.query.typeList
    this.categoryList = this.$route.query.categoryList
    this.articleList = this.$route.query.articleList
    if (this.$route.query.selectItem) {
      try {
        this.articleItem = this.setEditItem(this.$route.query.selectItem)
        for (const key in this.addForm) {
          if (this.articleItem.hasOwnProperty(key)) {
            this.addForm[key] = this.articleItem[key]
          }
        }
        this.imgUrls = this.articleItem.imgUrls
        if (this.articleItem.hasOwnProperty('related') && this.articleItem.related.length > 0) {
          this.isShowRelatedView = true
        }
        if (this.articleItem.hasOwnProperty('keyword') && this.articleItem.keyword.length > 0) {
          this.isShowKeywordView = true
        }
        editor.txt.html(this.addForm.content)
      } catch (e) {}
    }
    this.resetType()
  },
  mounted() {
    const dom = document.getElementById('editor')
    this.editor = new E(dom)

    this.editor.config.menus = [
      'head',
      'bold',
      'fontName',
      'fontSize',
      'foreColor',
      'backColor',
      'italic',
      'underline',
      'strikeThrough',
      'link',
      'quote',
      'justify',
      'image',
      'code',
      'indent',
      'lineHeight',
      'link',
      'list',
      'todo',
      'emoticon',
      'image',
      'table',
      'code',
      'splitLine',
      'undo',
      'redo'
    ]
    this.editor.config.colors = [
      '#000000',
      '#0000FF',
      '#eeece0',
      '#1c487f',
      '#4d80bf',
      '#c24f4a',
      '#008000',
      '#8baa4a',
      '#7b5ba1',
      '#46acc8',
      '#f9963b',
      '#ffffff',
      '#808080',
      '#FF0000',
      '#FFFF00'
    ]
    this.editor.config.fontNames = ['宋体', '微软雅黑', 'Arial', 'Tahoma', 'Verdana']

    this.editor.config.onchange = (html) => {
      this.addForm.content = html
    }
    this.editor.config.uploadImgMaxSize = 3 * 1024 * 1024
    this.editor.config.uploadImgMaxLength = 1
    this.editor.config.uploadImgTimeout = 1000 * 30
    this.editor.config.uploadImgServer = 'ajax/common/blog/content/upload'
    this.editor.config.showLinkImg = false
    this.editor.config.zIndex = 400
    this.editor.config.height = 600
    this.editor.create()
    this.editor.txt.html(this.addForm.content)
  },
  methods: {
    async save() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return false
        if (!this.isLoadImg(this.addForm.imgUrls, this.addForm.type))
          return this.$message.error('请完成图片选择')
        const { type } = this.addForm
        let param = this.addForm
        if (type && type.length > 0) {
          param = {
            ...param,
            type: type.join(',')
          }
        } else {
          param = {
            ...param,
            type: null
          }
        }
        if (this.articleItem) {
          param = {
            ...param,
            id: this.articleItem.id
          }
        }
        if (this.addForm.attachments.videoUrl) {
          param = {
            ...param,
            attachments: JSON.stringify(this.addForm.attachments)
          }
        } else {
          param = {
            ...param,
            attachments: null
          }
        }
        if (this.addForm.related) {
          param = {
            ...param,
            related: this.addForm.related.join(',')
          }
        }
        const result = await this.jaxLib.blog.saveArticle(param)
        if (!result.success) return this.$message.error(result.message)
        this.$message.success('保存成功')
        this.$router.push('blog-manage')
      })
    },
    cancel() {
      this.$router.push('blog-manage')
    },
    preview() {
      this.isShowPreview = true
    },
    cancelPreview() {
      this.isShowPreview = false
    },
    beforeAvatarUpload(file) {
      // const isSize = this.imgSize(file, { width: 800, height: 270 })
      // if (!isSize) {
      //   this.$message.error('上传的图片建议比例750:400')
      // }
      // return isSize
      return true
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true
      this.videoUploadPercent = file.percentage.toFixed(0)
    },
    handleMovieFaile(error) {
      this.$message.error('上传失败,' + error)
    },
    beforeMoveUpload(file) {
      if (
        ['video/mp4', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) == -1
      ) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
      const fileSize = file.size / 1024 / 1024 < 50
      if (!fileSize) {
        this.$message.error('视频大小不能超过50M')
        return false
      }
    },
    handleCoverImgSuccess(response) {
      if (!response.success || !response.data.fileUrl) {
        this.$message({ type: 'error', message: '上传失败' })
        return false
      }
      this.addForm.coverUrl = response.data.fileUrl
    },
    handleAvatarSuccess(response, id) {
      if (!response.success || !response.data.fileUrl) {
        this.$message({ type: 'error', message: '上传失败' })
        return false
      }
      this.setTypeListImgUrl(id, response.data.fileUrl)
      this.addForm.imgUrls = {
        ...this.addForm.imgUrls,
        [id]: response.data.fileUrl
      }
    },
    handleMovieSuccess(response, id) {
      if (!response.success || !response.data.fileUrl) {
        this.$message({ type: 'error', message: '上传失败' })
        return false
      }
      this.addForm.attachments.videoUrl = response.data.fileUrl
      this.videoFlag = false
      this.videoUploadPercent = 0
    },
    onContentChange(value) {
      this.addForm.content = value
    },
    onTypeSelect(value) {
      this.isShowMovieView = this.addForm.type.filter((item) => this.movieTag == item).length > 0
      this.isShowRelatedView =
        this.addForm.type.filter((item) => this.relatedTag == item).length > 0
      this.isShowKeywordView =
        this.addForm.type.filter((item) => this.keywordTag == item).length > 0
    },

    imgSize(file, size) {
      return new Promise((resolve, reject) => {
        let url = window.URL || window.webkitURL
        let img = new Image()
        img.onload = function () {
          // 图片校验
          let valid = img.width === size.width && img.height === size.height
          valid ? resolve() : reject()
        }
        img.src = url.createObjectURL(file)
      }).then(
        () => {
          return file
        },
        () => {
          return Promise.reject()
        }
      )
    }
  }
}
</script>
<style lang="scss">
#editor.w-e-full-screen-editor {
  background: #fff;
  & > .w-e-text-container {
    margin: 0 auto;
    width: 762px;
  }
}
.body {
  margin-left: 20px;
  margin-top: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.footer {
  margin-top: 20px;
  margin-bottom: 20px;
  float: right;
}

.blog-detail {
  width: 100%;
  padding: 60px 0 60px;
  background: white;
  &__article {
    margin: 0 auto;
    width: 816px;
    border: 1px solid #999;
    display: block;
    background: white;
    padding: 32px;

    &--info {
      padding: 0 0 40px;
      color: #363c4d;
      font-size: 18px;
      width: 100%;
    }

    &--data {
      color: #999999;
      margin-right: 20px;
      position: relative;
    }

    &--cancel {
      margin-top: 50px;
      float: right;
    }
  }
}
</style>
