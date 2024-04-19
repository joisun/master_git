<script>
import { safeGet } from '@/global/function/safe-operations'
import dateFormat from '@/global/filters/date-format'
import Download from '@/page/components/wh-download/wh-download'
export default {
  data() {
    return {
      loading: false,
      formData: {
        iccid: '',
        timeRange: []
      }
    }
  },
  computed: {
    isValid() {
      const { timeRange, iccid } = this.formData
      return iccid && timeRange.length !== 0
    }
  },
  methods: {
    async handleExport() {
      this.loading = true
      const { timeRange, iccid } = this.formData
      let start, end
      if (timeRange && timeRange.length === 2) {
        start = dateFormat(timeRange[0])
        end = dateFormat(timeRange[1])
      }
      const res = await this.jaxLib.customerServices.deviceDetailExport({
        iccid,
        start,
        end
      })
      this.loading = false
      if (safeGet(res, 'success', false)) {
        // this.$message.success('转换成功')
        await Download({ ...res.data })
      }
    }
  }
}
</script>

<template>
  <div class="forcibly-activate" style="background-color: #fff">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">VPDN详单导出</h2>
      </div>
      <div class="wh__body" style="margin-top: 30px">
        <el-alert
          title="根据卡号和时间范围导出卡的详单，格式为Excel. 时间长度不能超过95天"
          type="success"
          effect="dark"
          :closable="false"
        />
        <el-form label-width="100px" label-position="left" style="margin-top: 15px">
          <el-form-item label="ICCID">
            <el-input v-model="formData.iccid" style="width: 400px" />
          </el-form-item>
          <el-form-item label="时间区间">
            <el-date-picker
              v-model="formData.timeRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="">
            <el-button
              :loading="loading"
              size="large"
              :disabled="!isValid"
              type="primary"
              @click="handleExport"
              >导出</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
