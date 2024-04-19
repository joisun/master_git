<script>
/**
   * Create by zeter on 2017/8/3
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    mixins: [DialogMixin],
    props: {
      dialogName: {
        default: String
      }
    },
    data() {
      return {
        formData: {
          name: '',
          url: '',
          source: '',
          campaign: '',
          medium: ''
        },
        rules: {
          name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
          url: [{ required: true, message: 'url不能为空', trigger: 'blur' }],
          source: [{ required: true, message: '请输入来源', trigger: 'blur' }],
          campaign: [{ required: true, message: '请输入关键字', trigger: 'blur' }],
          medium: [{ required: true, message: '请输入媒介', trigger: 'blur' }]
        }
      }
    },
    methods: {
      open() {
        this.formData = {
          name: '',
          url: '',
          source: '',
          campaign: '',
          medium: ''
        }
      },
      submitData() {
        this.$refs.formData.validate(async(valid) => {
          if (!valid) return false
          await this.jaxLib.advertisement.add({
            name: this.formData.name,
            url: this.formData.url,
            source: this.formData.source,
            campaign: this.formData.campaign,
            medium: this.formData.medium
          })
          this.$emit('closeDialog', this.dialogName, true)
        })
      }
    }
  }
</script>

<template>
  <div class="add-link">
    <div class="wh__dialog--body">
      <el-form label-width="100px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label='名称' prop="name">
          <el-input v-model="formData.name">
          </el-input>
        </el-form-item>
        <el-form-item label='链接url' prop="url">
          <el-input v-model="formData.url">
          </el-input>
        </el-form-item>
        <el-form-item label="key1(渠道)" prop="source">
          <el-input v-model="formData.source">
          </el-input>
        </el-form-item>
        <el-form-item label="key2(关键词)" prop="campaign">
          <el-input v-model="formData.campaign">
          </el-input>
        </el-form-item>
        <el-form-item label="key3(媒介)" prop="medium">
          <el-input v-model="formData.medium">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="wh__dialog--footer">
      <el-button type="text" @click.native="close">取 消</el-button>
      <el-button type="primary" @click.native="submitData">确 定</el-button>
    </div>
  </div>
</template>
