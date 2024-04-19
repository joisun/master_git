<script>
/**
   * Create by zeter on 2017/5/31
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    mixins: [DialogMixin],
    props: {
      orgId: {
        default: String
      },
      pointOrgName: {
        default: String
      },
      orgContent: {
        default: Object
      },
      dialogName: {
        default: String
      }
    },
    data() {
      return {
        configId: '',
        wechatForm: {
          app_id: '',
          app_secret: '',
          back_host: '',
          mch_id: '',
          pay_key: '',
          host: ''
        },
        formLabelWidth2: '98px'
      }
    },
    methods: {
      // 获得微信是否开通信息
      async getWechatInfo(userId) {
        let rst = await this.jaxLib.customer.wx.getWxConfig(userId)
        if (!rst.success) {
          this.msg(`微信配置获取错误: ${rst.message}`, 'error')
          return false
        }
        if (rst.data) {
          this.configId = rst.data.id
          this.wechatForm = {
            app_id: rst.data.appId,
            app_secret: rst.data.appSecret,
            back_host: rst.data.backHost,
            mch_id: rst.data.mchId,
            pay_key: rst.data.payKey,
            host: rst.data.host
          }
        }
      },
      async open() {
        if (this.orgContent.orgAdmin) {
          this.getWechatInfo(this.orgContent.orgAdmin.id)
        }
      },
      close() {
        this.wechatForm = {
          app_id: '',
          app_secret: '',
          back_host: '',
          mch_id: '',
          pay_key: '',
          host: ''
        }
        this.configId = ''
        this.$emit('closeDialog', this.dialogName, false)
      },
      async addOrSetWechat() {
        let postData = this.wechatForm
        let org = this.orgContent
        postData.user_id = org.orgAdmin.id
        postData.orgId = org.id
        if (this.configId !== '') postData.id = this.configId
        let rst = await this.jaxLib.customer.wx.setWxConfig(postData)
        if (!rst.success) {
          this.msg(`扑街 - 因为: ${rst.message}`, 'error')
          return false
        }
        this.msg('成功', 'success')
        this.$emit('closeDialog', this.dialogName, true)
      }
    }
  }
</script>

<template>
  <div class="wechat-set">
    <el-form :model="wechatForm" ref="wechatForm" style="width: 440px">
      <el-form-item label="公众号ID" :label-width="formLabelWidth2">
        <el-input v-model="wechatForm.app_id" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="公众号密钥" :label-width="formLabelWidth2">
        <el-input v-model="wechatForm.app_secret" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="客户后端主机" :label-width="formLabelWidth2">
        <el-input v-model="wechatForm.back_host" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="商户号" :label-width="formLabelWidth2">
        <el-input v-model="wechatForm.mch_id" auto-complete="on">
        </el-input>
      </el-form-item>
      <el-form-item label="商户支付密钥" :label-width="formLabelWidth2">
        <el-input v-model="wechatForm.pay_key" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="页面host" :label-width="formLabelWidth2">
        <el-input v-model="wechatForm.host" auto-complete="off">
        </el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="wh-dialog-footer">
      <el-button type="text" @click.native="close">取 消</el-button>
      <el-button type="primary" @click.native="addOrSetWechat">确 定</el-button>
    </span>
  </div>
</template>
