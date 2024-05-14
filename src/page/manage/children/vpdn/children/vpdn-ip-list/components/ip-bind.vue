<script>
/**
   * Create by zeter on 2018/6/7
   */

  import carrierMap from '@/collect/carrier-map'
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import { iccidsTransfer } from '@/global/function/iccids-tool'
  import { mapState } from 'vuex'

  export default {
    mixins: [DialogMixin],
    props: {
      dialogName: {
        default: '',
        required: true,
        type: String
      },
      now: {
        required: true
      }
    },
    data() {
      return {
        carrierList: carrierMap.beTemplate(),
        loading: false,
        form: {
          iccids: ''
        },
        fileList: '',
        rules: {
          iccids: [{
            validator: function(rule, value, callback) {
              if (!value && !this.fileList) callback('请填写ICCID或者上传文件')
              else callback()
            }.bind(this)
          }]
        }
      }
    },
    computed: {
      ...mapState({
        unicomAccountList: state => state.carrierAccount.unicomAccountList,
        cmccAccountList: state => state.carrierAccount.cmccAccountList,
        chinanetAccountList: state => state.carrierAccount.chinanetAccountList
      }),
      nowAccountList() {
        return this[`${this.form.carrier}AccountList`]
      }
    },
    methods: {
      // 文件修改
      changeFile(e) {
        this.fileList = e.target.files[0]
        this.$refs.form.validateField('iccids')
      },
      // 提交~
      submitForm() {
        this.$refs.form.validate(async valid => {
          if (valid) {
            this.loading = true
            let formValue = new FormData()
            formValue.append('planId', this.now.id)
            if (!this.fileList) {
              formValue.append('iccids', iccidsTransfer(this.form.iccids).join(','))
            } else {
              formValue.append('excel', this.fileList)
            }
            let rst = await this.jaxLib.vpdn.ip.upload(formValue)
            if (!rst.success) {
              this.loading = false
              return false
            }
            this.$message.success('提交成功')
            this.$emit('closeDialog', this.dialogName, true)
          }
        })
      },
      // 重置
      resetForm() {
        this.$emit('closeDialog', this.dialogName, false)
      },
      close() {
        this.form = {
          iccids: ''
        }
        this.fileList = ''
        this.$refs.form.resetFields()
      }
    }
  }
</script>

<template>
  <div class="ip-bind" v-loading="loading">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
      <el-form-item prop="iccids">
        <el-input type="textarea" placeholder="请输入ICCID，一个一行" v-model="form.iccids">
        </el-input>
        <input @change="changeFile" type="file" placeholder="只能上传excel文件，且必须要有iccid列">
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
