<template>
  <el-row>
    <el-col v-for="(item, index) in formData.extWhiteGroupNoDTOList" :key="index" :span="6">
      <el-form-item
        :label="`${item.signedCarrierName}群组号`"
        :prop="'extWhiteGroupNoDTOList.' + index + '.groupNo'"
        :rules="[{ required: true, message: '请输入群组号' }]"
      >
        <el-input v-model="item.groupNo" style="width: 300px" :disabled="isHistory" />
      </el-form-item>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    flowNo: {
      type: String,
      default: ''
    },
    isHistory: {
      type: Boolean,
      default: false
    }
  },
  created() {
    if (this.isHistory) {
      this.$emit('change', this.formData.extWhiteGroupNoDTOList)
    } else {
      this.getData()
    }
  },
  methods: {
    async getData() {
      this.loading = true
      const { success, data } = await this.jaxLib.whitelist.listExtWhiteList({
        flowNo: this.flowNo
      })
      this.loading = false
      if (!success) return false
      this.$emit('change', data)
    }
  }
}
</script>
