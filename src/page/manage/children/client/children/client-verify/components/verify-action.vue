<script>
import whPreviewContent from '@/global/components/wh-preview/wh-preview-content.vue'
import DialogMixin from '@/global/mixins/dialog-mixin'
import consts from '@/page/manage/children/client/children/client-verify/mixins/consts'

export default {
  name: 'verify-action',
  components: {
    'wh-preview-content': whPreviewContent
  },
  mixins: [DialogMixin, consts],
  props: {
    content: {}
  },
  data() {
    return {}
  },
  computed: {
    id() {
      return this.content.id
    },
    picList() {
      let arr = []
      if (this.content.licencePic) arr.push(this.content.licencePic)
      if (this.content.idCardPicFont) arr.push(this.content.idCardPicFont)
      if (this.content.idCardPicBack) arr.push(this.content.idCardPicBack)
      return arr
    },
    finalStatus() {
      return this.judgeFinalStatus(this.content)
    }
  },
  methods: {
    async handleAuthPickValid() {
      const ret = await this.jaxLib.customer.passIdCardAndLicence({
        id: this.content.id
      })
      if (!ret.success) return false
      this.content.machineFailReasonCode = ''
      this.$message.success(ret.message)
    },
    async pass() {
      const ret = await this.jaxLib.customer.qualificationsPass({
        id: this.content.id
      })
      if (!ret.success) return false
      const res = await this.jaxLib.customer.certification.manualWatch({
        ids: this.content.id
      })
      this.content.manualStatus = this.AUDIT_STATUS.PASS
      if (res.success) {
        this.content.manualWatch = 1
      }
      this.$message.success(ret.message)
    },
    async cancel(defaultValue = '') {
      this.$prompt('请输入审核不通过原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (v) => !!v,
        inputValue: defaultValue,
        inputErrorMessage: '请填写原因'
      })
        .then(async ({ value }) => {
          await this.callCancelApi(value)
        })
        .catch()
    },
    async callCancelApi(value) {
      const ret = await this.jaxLib.customer.qualificationsReject({
        id: this.content.id,
        content: value
      })
      if (!ret.success) return false
      this.$message.success('操作成功')
      this.content.manualStatus = this.AUDIT_STATUS.NOT_PASS
    },
    close() {
      this.$emit('closeDialog', this.dialogName, true)
    },
    async picCheck(id) {
      const res = await this.jaxLib.customer.certification.manualWatch({ ids: id })
      if (res && res.success) {
        this.$message.success('操作成功')
        this.content.manualWatch = 1
      }
    },
    async changeFlow(pickType) {
      this.$confirm(
        '更改后将会驳回当前的企业资质，客户需重新提交企业资质后才可进行购卡等操作，确定更改？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          const ret = await this.jaxLib.customer.updateType({
            id: this.content.id,
            pickType
          })
          if (!ret.success) return false
          // eslint-disable-next-line vue/no-mutating-props
          this.content.pickType = pickType
          await this.callCancelApi('审核流程类型更改，请按照新流程重新提交')
          this.$message.success(ret.message)
        })
        .catch()
    }
  }
}
</script>

<template>
  <div class="verify-action flex">
    <div class="verify-action__img">
      <wh-preview-content
        :key="id"
        ref="carousel"
        :list="picList"
        :index="0"
        indicator-position="outside"
      >
      </wh-preview-content>
    </div>
    <div class="verify-action__content">
      <div class="verify-action__item">客户名称: {{ content.orgName }}</div>
      <div class="verify-action__item">客户ID: {{ content.orgId }}</div>
      <div class="verify-action__item">公司名称: {{ content.name }}</div>
      <div class="verify-action__item">执照注册号/信用代码: {{ content.licence }}</div>
      <div class="verify-action__item">身份证姓名: {{ content.idCardName }}</div>
      <div class="verify-action__item">身份证: {{ content.idCardNum }}</div>
      <div
        class="verify-action__item"
        v-if="content.pickType === AUDIT_PICK_TYPE.BUSINESS && content.certificate"
      >
        授权书: <a target="_b" style="color: #ec407a" :href="content.certificate">点击下载</a>
      </div>
      <div class="verify-action__action">
        企业资质审核:
        <br />
        <el-button
          v-if="finalStatus === AUDIT_STATUS.NOT_AUDIT || finalStatus === AUDIT_STATUS.NOT_PASS"
          type="primary"
          @click="pass()"
          >通过
        </el-button>
        <el-button v-else :disabled="true"> 已通过</el-button>
        <el-button v-if="finalStatus === AUDIT_STATUS.NOT_PASS" :disabled="true">已驳回</el-button>
        <el-button v-else @click="cancel('')">驳回</el-button>
        <!--        <el-button v-if="content.manualWatch !== '1'" @click="picCheck(content.id)">复核</el-button>-->
        <!--        <el-button v-else disabled>复核通过</el-button>-->
        <div v-if="isAuthPicInValid(content)" style="margin-top: 15px">
          证件照有效性:
          <br />
          <el-button type="primary" @click="handleAuthPickValid">证件照有效</el-button>
          <el-button @click="cancel('证件照无效')">证件照无效</el-button>
        </div>
        <div style="margin-top: 15px">
          是否允许商务对接人流程:
          <br />
          <el-button
            type="primary"
            v-if="content.pickType === AUDIT_PICK_TYPE.BUSINESS"
            @click="changeFlow(AUDIT_PICK_TYPE.LEGAL)"
            >禁止商务对接人</el-button
          >
          <el-button type="primary" v-else @click="changeFlow(AUDIT_PICK_TYPE.BUSINESS)"
            >允许商务对接人</el-button
          >
        </div>
      </div>
      <div class="verify-action__action">
        <el-button type="primary" @click="$emit('changeDetail', -1)">上一个</el-button>
        <el-button type="primary" @click="$emit('changeDetail', 1)">下一个</el-button>
      </div>
    </div>
  </div>
</template>
