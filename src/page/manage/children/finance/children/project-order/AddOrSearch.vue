<template>
  <el-dialog
    :visible="visible"
    :title="title"
    width="500px"
    :before-close="onClose"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="type === 'search' ? {} : rules">
      <el-form-item prop="orders" label="订单号">
        <el-input v-model="form.orders" type="textarea" rows="6" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'

export default {
  props: {
    type: {
      type: String,
      default: 'search'
    }
  },
  data() {
    return {
      visible: false,
      form: {
        orders: ''
      },
      rules: {
        orders: [
          {
            required: true,
            message: '该项为必填项',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.type === 'search' ? '批量搜索' : '新增项目订单'
    }
  },
  methods: {
    onClose() {
      this.$refs.form.resetFields()
      this.visible = false
    },
    open({ orders }) {
      console.log('🎸 szy_59 AddOrSearch.vue 👉', orders)
      if (orders) this.form.orders = orders.join('\n')
      this.visible = true
    },
    onConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.type === 'search') {
            this.$emit('confirm', {
              orders: iccidsTransfer(this.form.orders).filter((item) => !!item)
            })
            this.onClose()
            return
          }
          this.$confirm('确定新增？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal: true
          }).then(() => {
            this.$emit('confirm', {
              orders: iccidsTransfer(this.form.orders)
                .filter((item) => !!item)
                .join(',')
            })
            this.onClose()
          })
        }
      })
    }
  }
}
</script>
