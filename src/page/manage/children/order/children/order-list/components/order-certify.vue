<style lang="sass">
</style>

<template>
  <div>
    <el-form v-if="mode==='nav'" label-position="right" label-width="150px">
      <el-form-item label="企业资质审核状态：">
        {{ companyCertifyStatusText }}
      </el-form-item>
      <el-form-item label="订单审核状态：">
        {{ certifyStatus}}
        <el-button-group v-if="isCertifyable">
          <el-button size="mini" type="primary" @click="passBillCertify" v-if="billStatus == 'REVIEW' || billStatus == 'REVIEW-FAILD'">通过</el-button>
          <el-button size="mini" type="danger" @click="refuseBillCertify" v-if="billStatus == 'REVIEW'">拒绝</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <audit-cpt :showModal="false" v-if="mode==='company'" :orgId="orderAllValue.orgId">
    </audit-cpt>
  </div>
</template>

<script>
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import AuditCpt from '@/page/manage/children/client/children/client-verify/client-verify.vue'

  export default {
    components: {
      AuditCpt
    },
    mixins: [DialogMixin],
    props: {
      mode: String,
      companyCertifyStatusText: String,
      orderAllValue: {},
      billSerialId: {
        default: ''
      },
      billStatus: String,
      certifyStatus: String,
      isCertifyable: Boolean
    },
    data() {
      return {}
    },
    watch: {},
    methods: {
      // 订单审核通过
      passBillCertify() {
        this.jaxLib.bill.certify.pass(this.billSerialId).then(ret => {
          if (ret.success) {
            this.shortcuts.msg(`订单${this.billSerialId}已通过`, 'success')
            this.$emit('close', true)
          } else {
            this.shortcuts.notify('订单审核通过失败！' + ret.message, '操作失败', 'error')
          }
        }).catch(err => {
          console.error('passBillCertify:', err)
        })
      },

      // 订单审核拒绝
      refuseBillCertify() {
        this.jaxLib.bill.certify.refuse(this.billSerialId).then(ret => {
          if (ret.success) {
            this.shortcuts.msg(`订单${this.billSerialId}已拒绝`, 'success')
            this.$emit('close', true)
          } else {
            this.shortcuts.notify('订单审核拒绝失败！' + ret.message, '操作失败', 'error')
          }
        }).catch(err => {
          console.error('refuseBillCertify:', err)
        })
      }
    }
  }
</script>
