<script>
import moment from 'moment'
import ImageUpload from './image-upload.vue'
import ZipUpload from './ZipUpload.vue'
const uploadType = [
  {
    label: '相同场景',
    value: 0
  },
  {
    label: '不同场景',
    value: 1
  }
]
export default {
  name: 'add-message-report',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'image-upload': ImageUpload,
    ZipUpload
  },
  data() {
    return {
      options: {
        uploadType
      },
      addForm: {
        iccids: '',
        photos: [],
        remark: '',
        uploadType: 0,
        zipFile: ['']
      },
      addRules: {
        iccids: [
          { required: true, message: '请输入iccid', trigger: 'change' }
        ],
        photos: [
          { required: true, message: '必须上传报备图片', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    onCloseDialog() {
      this.addForm = {
        iccids: '',
        photos: [],
        remark: '',
        uploadType: 0
      }
      if (this.$refs.imgRef) {
        this.$refs.imgRef.onClear()
      }
      if (this.$refs.addForm) {
        this.$refs.addForm.clearValidate()
        this.$refs.addForm.resetFields()
      }
      this.$emit('update:visible', false)
    },
    async save() {
      if (!this.addForm.uploadType) {
        const photoArr = this.$refs.imgRef.submit()
        if (photoArr.length !== 2) return this.$message.error('上传图片必须为2张')
        if (photoArr.length > 0) this.addForm.photos = photoArr
        this.$refs.addForm.validate(async(valid) => {
          if (!valid) return false
          let iccids = this.addForm.iccids.trim().split(/\s+/).join(',')
          let param = {
            photos: this.addForm.photos,
            remark: this.addForm.remark,
            iccids: iccids.split(',')
          }
          const res = await this.jaxLib.customer.certification.createCaseRecord(param)
          if (!res.success) return
          this.$message.success('添加成功')
          this.onCloseDialog()
          this.$emit('refresh')
        })
      } else {
        this.$refs.zipRef.submit() 
      }
    },
    onSuccess(data) {
      const h = this.$createElement;
      const total = data.successIccids.length + data.incompleteIccids.length + data.invalidIccids.length
      this.onCloseDialog()
      this.$emit('refresh')
      this.$msgbox({
        title: '新增报备信息',
        message: h('div', null, [
          h('p', {}, `共选择上传${total}张ICCID图片，其中：`),
          h('p', {}, `${data.successIccids.length}张，上传成功；`),
          h('p', {}, `${data.invalidIccids.length}张，ICCID错误，未上传；`),
          h('p', {}, `${data.incompleteIccids.length}张，使用场景描述文件名称错误，未上传`),
          h('a', {attrs: {
            href: data.failDetail,
            target: '_blank'
          }, style: {
            color: '#db507a',
            textDecoration: 'underline'
          }}, '点击下载所有错误ICCID；'),
        ]),
        showCancelButton: false,
        confirmButtonText: '知道了'
      })
    }
  }
}
</script>
<template>
  <el-dialog title="新增信息报备" :visible="visible" @close="onCloseDialog" top="10vh">
    <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="120px">
      <el-form-item label="上传方式" prop="uploadType">
        <el-radio
          v-model="addForm.uploadType"
          v-for="item in options.uploadType"
          :key="item.value"
          :label="item.value"
          >{{ item.label }}</el-radio
        >
      </el-form-item>
      <template v-if="addForm.uploadType === 0">
        <el-form-item label="ICCID" prop="iccids">
          <el-input
            type="textarea"
            v-model="addForm.iccids"
            :rows="6"
            placeholder="可以直接复制excel中的整列ICCID；手动输入ICCID，一行一个，最多输入1000个"
            resize="none"
            style="width:440px">
          </el-input>  
        </el-form-item>
        <el-form-item label="设备图片" prop="photos">
          <image-upload ref="imgRef" :picUrls="addForm.photos"/>
          <p>上传说明：</p>
          <p>1、图片格式位PNG或JPG；2、图片大小不超过5M；3、上传2张图片</p>
        </el-form-item>
        <el-form-item label="使用场景描述" prop="remark">
          <el-input
            type="textarea"
            :rows="6"
            v-model="addForm.remark"
            placeholder="请输入使用场景描述"
            style="width:440px">
          </el-input>
        </el-form-item>
      </template>
      <template v-else>
       <el-form-item label="压缩包文件" prop="zip">
         <zip-upload ref="zipRef" @success="onSuccess"/>
       </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCloseDialog">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </span>
  </el-dialog>
</template>