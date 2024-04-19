<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'
import { safeGet } from '@/global/function/safe-operations'
const normalizeData = (data) => {
  return iccidsTransfer(data)
    .filter((item) => !!item)
    .join()
}
export default {
  name: 'card-info-convert',
  data() {
    return {
      loading: false,
      iccids: '',
      msisdns: '',
      imsis: '',
      ips: ''
    }
  },
  computed: {
    isValid() {
      return ['iccids', 'msisdns', 'imsis', 'ips'].some((item) => {
        return normalizeData(this[item]).length !== 0
      })
    }
  },
  methods: {
    onChange(exceptField) {
      ['iccids', 'msisdns', 'imsis', 'ips'].forEach((field) => {
        if (field === exceptField) {
          return
        }
        this[field] = ''
      })
    },

    async handleConvert() {
      const { iccids, msisdns, imsis, ips } = this
      const res = await this.jaxLib.customerServices.batchQueryDeviceInfo({
        iccids: normalizeData(iccids),
        msisdns: normalizeData(msisdns),
        imsis: normalizeData(imsis),
        ips: normalizeData(ips)
      })
      if (safeGet(res, 'success', false)) {
        this.iccids = ''
        this.msisdns = ''
        this.imsis = ''
        this.ips = ''
        res.data.forEach((item) => {
          this.iccids = `${this.iccids}${this.iccids ? '\n' : ''}${item.iccid}`
          this.msisdns = `${this.msisdns}${this.msisdns ? '\n' : ''}${item.msisdn}`
          this.imsis = `${this.imsis}${this.imsis ? '\n' : ''}${item.imsi}`
          this.ips = `${this.ips}${this.ips ? '\n' : ''}${item.ip}`
        })
      }
    }
  }
}
</script>

<template>
  <div class="forcibly-activate">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">卡信息互转</h2>
      </div>
      <div class="wh__body">
        <el-alert
          title="输入任意一个输出其余三项，注意电信卡无IMSI。请勿一次性查询超过2000个。"
          type="success"
          effect="dark"
          style="margin-bottom: 20px"
          :closable="false"
        />
        <el-form label-position="top">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="ICCID">
                <el-input
                  v-model="iccids"
                  type="textarea"
                  rows="12"
                  style="width: 100%"
                  @input="onChange('iccids')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="MSISDN">
                <el-input
                  v-model="msisdns"
                  type="textarea"
                  rows="12"
                  style="width: 100%"
                  @input="onChange('msisdns')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="IMSI">
                <el-input
                  v-model="imsis"
                  type="textarea"
                  rows="12"
                  style="width: 100%"
                  @input="onChange('imsis')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="IP">
                <el-input
                  v-model="ips"
                  type="textarea"
                  rows="12"
                  style="width: 100%"
                  @input="onChange('ips')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="">
            <el-button
              :loading="loading"
              size="large"
              type="primary"
              :disabled="!isValid"
              @click="handleConvert"
              >转换</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
