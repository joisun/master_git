<script>
  /**
   * Create by zeter on 2019-05-27
   */
  import { PRICE_CONDITIONS_LIST } from '../mixins/const'
  import _ from 'lodash'
  import DialogMixin from '@/global/mixins/dialog-mixin'
  // import regexps from '@/constant/regexps'
  const baseForm = {
    discount: 100,
    ...PRICE_CONDITIONS_LIST.reduce(function(obj, param) {
      obj[param.discountFields] = 100
      return obj
    }, {})
  }

  export default {
    name: 'batch-setting',
    mixins: [DialogMixin],
    data() {
      const rule = [{ type: 'number', required: true, message: '折扣不能为空', trigger: 'blur' }]
      return {
        PRICE_CONDITIONS_LIST,
        switchStatus: true,
        form: { ...baseForm },
        rules: {
          discount: [
          {
            required: true,
            message: '折扣不能为空'
          }],
          ...PRICE_CONDITIONS_LIST.reduce(function(obj, param) {
            obj[param.discountFields] = [...rule]
            return obj
          }, {})
        }
      }
    },
    props: {
      orgName: {
        default: String
      },
      content: {
        default: Array
      },
      dialogName: {
        default: String
      },
      orgId: {
        default: Number
      },
      type: {
        type: String,
        default: 'status'
      }
    },
    methods: {
      open() {
        this.form = { ...baseForm }
        this.switchStatus = false
      },
      async saveConfig() {
        if (this.type === 'status') {
          let rst = await this.jaxLib.financial.plan.batchChangeStatus({
            ids: this.content.map(e => e.id).join(','),
            orgId: this.orgId,
            status: this.switchStatus ? 'on' : 'off'
          })
          if (!rst.success) return false
          this.$message.success('批量修改成功')
          this.$emit('closeDialog', this.dialogName, true)
        } else {
          this.$refs.form.validate(async v => {
            const params = {
              discount: this.form.discount / 100,
              condition1Discount: this.form.condition1Discount / 100,
              condition2Discount: this.form.condition2Discount / 100,
              condition3Discount: this.form.condition3Discount / 100,
              condition4Discount: this.form.condition4Discount / 100,
            }
            if (!v) return false
            let rst = await this.jaxLib.financial.plan.modifySalesPrice({
              ids: this.content.map(e => e.id).join(','),
              orgId: this.orgId,
              ...params
            })
            if (!rst.success) return false
            this.$message.success('批量修改成功')
            this.$emit('closeDialog', this.dialogName, true)
          })
        }
      }
    }
  }
</script>

<template>
  <div class="batch-setting">
    <div class="wh__dialog--body">
      <el-form ref="form" :label-width="type === 'status' ? '140px' : '180px'" :model="form" :rules="rules">
        <el-form-item v-if="type === 'status'" label="套餐状态">
          <el-switch
            v-model="switchStatus"
            active-text="上架"
            inactive-text="下架">
          </el-switch>
        </el-form-item>
        <template v-else>
          <el-form-item label="销售购卡折扣" prop="discount">
            <el-input-number v-model="form.discount" :min="0" :max="100" style="width: 80px" :controls="false"/> %
          </el-form-item>
          <el-form-item v-for="(item) in PRICE_CONDITIONS_LIST" :key="item.name"
            :label="item.name + ' 销售折扣'" :prop="item.discountFields">
            <el-input-number v-model="form[item.discountFields]" :min="0" :max="100" style="width: 80px" :controls="false"/> %
          </el-form-item>
        </template>
      </el-form>
    </div>
    <div class="wh__dialog--footer">
      <el-button type="primary" @click="saveConfig">
        确认
      </el-button>
    </div>
  </div>
</template>
