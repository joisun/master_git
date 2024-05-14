<script>
  /**
   * Create by zeter on 2018/7/31
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    mixins: [DialogMixin],
    name: 'dialog-batch-edit-plan',
    props: {
      dialogName: {
        type: String,
        default: ''
      },
      selectArray: Array,
      type: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        form: {
          discount: 1,
          status: false
        }
      }
    },
    methods: {
      open() {
        this.form = {
          discount: 1,
          status: false
        }
      },
      async sureRight() {
        if (this.type === 'discount') {
          if (!this.form.discount) {
            this.$message({ type: 'error', message: '折扣不能为空' })
            return false
          }
          let rst = await this.jaxLib.financial.plan.batchChange({
            ids: this.selectArray.join(','),
            discount: this.form.discount
          })
          if (!rst.success) return false
        } else {
          let rst = await this.jaxLib.financial.plan.batchChangePackageStatus({
            ids: this.selectArray.join(','),
            status: this.form.status ? 'on' : 'off'
          })
          if (!rst.success) return false
        }
        this.$emit('closeDialog', this.dialogName, true)
      },
      close() {
        this.form.discount = 1
        this.$emit('closeDialog', false)
      }
    }
  }
</script>

<template>
  <div class="batch-edit-plan">
    <el-form label-position="right" label-width="120px" :model="form" ref="batchForm">
      <el-form-item v-if="type === 'discount'" label="销售折扣底价">
        <el-input v-model="form.discount" style="width: 120px;" type="number">
        </el-input>
      </el-form-item>
      <el-form-item v-else label="套餐状态">
        <el-switch
          v-model="form.status"
          active-text="上架"
          inactive-text="下架">
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sureRight">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
