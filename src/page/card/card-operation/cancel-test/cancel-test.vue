<script>
  /**
   * Create by zeter on 2019-05-22
   */
  import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
  import { iccidsTransfer } from '@/global/function/iccids-tool'
  import { toolsMixin } from '@/global/mixins/table-selection'

  const SELECTION_STORAGE_KEY = 'whitehouse_card_manager'
  export default {
    name: 'cancel-test',
    mixins: [toolsMixin],
    data() {
      return {
        formRule: {
          iccids: [{ required: true, message: '请输入iccid', trigger: 'blur' }],
          email: [{ type: 'email', required: true, message: '请输入正确的邮箱', trigger: 'blur' }],
          carrierAccountId: [
            {
              validator: (rule, value, callback) => {
                if (this.form.carrier === '') {
                  callback(new Error('请选择运营商'))
                }
                if (this.form.carrier !== '' && this.form.carrierAccountId === '') {
                  callback(new Error('请选择运营商账号'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        },
        form: {
          iccids: '',
          carrier: '',
          carrierAccountId: '',
          email: ''
        },
        storageKey: SELECTION_STORAGE_KEY
      }
    },
    created() {
      if (this.$route.query.from === 'card-list') {
        const selected = this.getSelected('iccid')
        if (selected.length) {
          this.form.iccids = selected.join('\n')
        }
      }
    },
    methods: {
      async onSubmit() {
        this.$refs.form.validate(async valid => {
          if (valid) {
            let rst = await this.jaxLib.card.cancelCarrierTesting({
              ...this.form,
              iccids: iccidsTransfer(this.form.iccids, ',')
            })
            if (!rst.success) return false
            this.$emit('close', true)
            this.$message.success('提交成功，请稍后到邮箱查看！')
            this.clearForm()
          }
        })
      },
      clearForm() {
        this.form = {
          iccids: '',
          carrier: '',
          carrierAccountId: '',
          email: ''
        }
        this.$refs.form.resetFields()
      },
      backList() {
        window.history.go(-1)
      }
    },
    components: {
      'wh-carrier-account-select': whCarrierAccountSelect
    }
  }
</script>

<template>
  <div class="cancel-test">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">取消运营商测试期</h2>
        <span v-if="!$route.query.enter" class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div class="wh__body">
        <el-form :model="form" :rules="formRule" ref="form" label-width="120px" style="width: 600px;">
          <el-form-item label="ICCID" prop="iccids">
            <el-input rows="6" type="textarea" v-model="form.iccids" placeholder="请输入ICCID">
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="carrierAccountId">
            <el-select v-model="form.carrier" placeholder="选择运营商">
              <el-option :label="key" :value="val" v-for="(key, val) in enums.carrier.maps()" :key="val">
              </el-option>
            </el-select>
            <wh-carrier-account-select
              v-model="form.carrierAccountId"
              placeholder="选择运营商账号"
              :carrier="form.carrier">
            </wh-carrier-account-select>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入有效邮箱用于接收处理结果">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
