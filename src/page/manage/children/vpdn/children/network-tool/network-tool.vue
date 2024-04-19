<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'
import NetworkProductStatus from './components/network-product-status'
export default {
  components: {
    NetworkProductStatus
  },
  data() {
    return {
      activeName: this.$route.query.type,
      titles: {
        1: '打标工具',
        2: '企业专网IP配置',
        3: '网络产品配置状态'
      },
      formData: {
        type: 0,
        ids: '',
        cardNetProductType: 'ACL_POLICY_WHITE'
      },
      epNetConfigForm: {
        routerIp: '',
        gatewayIp: ''
      },
      cardList: '',
      cardType: ''
    }
  },
  watch: {
    $route(newValue) {
      this.activeName = `${newValue.query.type}`
    }
  },
  created() {
    this.activeName = `${this.$route.query.type}`
  },
  methods: {
    async translation() {
      this.cardList = ''
      const ids = iccidsTransfer(this.formData.ids, ',')
      if (!ids) {
        this.$message({ type: 'error', message: 'iccid或ip不能为空' })
        return false
      }
      let res = await this.jaxLib.vpdn.util.whitelistTag({
        type: this.formData.type,
        ids,
        cardNetProductType: this.formData.cardNetProductType
      })
      if (!res.success) {
        this.cardType = 'error'
        this.cardList = res.data.join('\n')
        return false
      }
      this.cardType = 'success'
      this.cardList = res.data.join('\n')
      this.$message.success('标记成功~!')
      this.formData.ids = ''
    },
    copy() {
      this.$refs.inputRef.select()
      document.execCommand('Copy')
      this.$message({ type: 'success', message: '已复制到剪切板' })
    },
    async postEpNetIpConfig() {
      const { success } = await this.jaxLib.vpdn.util.postEpNetIpConfig({
        ...this.epNetConfigForm
      })
      if (!success) return false
      this.$message.success('配置成功')
    }
  }
}
</script>

<template>
  <div class="network-tool">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">{{ titles[activeName] }}</h2>
      </div>
      <div class="wh__body">
        <el-card shadow="never">
          <div v-if="activeName === '1'" class="form-wrapper flex">
            <el-form class="width45 mr20 mt20" label-position="right" label-width="150px">
              <el-form-item label="网络功能">
                <el-select v-model="formData.cardNetProductType">
                  <el-option value="ACL_POLICY_WHITE" label="白名单">白名单</el-option>
                  <el-option value="ADHOC" label="卡卡自组网">卡卡自组网</el-option>
                  <el-option value="EPNET" label="企业专网">企业专网</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="选择卡片">
                <el-radio v-model="formData.type" :label="0">iccid</el-radio>
                <el-radio v-model="formData.type" :label="1">ip</el-radio>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="formData.ids"
                  type="textarea"
                  :rows="5"
                  placeholder="请输入iccid或ip"
                />
              </el-form-item>
              <el-form-item label=" ">
                <el-button type="primary" @click="translation">确定</el-button>
              </el-form-item>
            </el-form>
            <div v-if="cardList" class="result width45">
              <h3>{{ cardType === 'success' ? '成功配置的iccid/ip' : '无效的iccid/ip:' }}</h3>
              <el-input ref="inputRef" v-model="cardList" rows="10" type="textarea" />
              <el-button class="mt15" @click="copy">复制</el-button>
            </div>
          </div>
          <el-form v-if="activeName === '2'" label-position="right" label-width="150px">
            <el-form-item label="企业专网路由外网IP">
              <el-input v-model="epNetConfigForm.routerIp"></el-input>
            </el-form-item>
            <el-form-item label="企业专网网关外网IP">
              <el-input v-model="epNetConfigForm.gatewayIp"></el-input>
            </el-form-item>
            <el-form-item lable=" ">
              <el-button type="primary" @click="postEpNetIpConfig">确定</el-button>
            </el-form-item>
          </el-form>
          <network-product-status v-if="activeName === '3'" ref="networkProductStatus" />

          <!--          <el-tabs v-model="activeName">-->
          <!--            <el-tab-pane label="打标工具" name="1">-->
          <!--            </el-tab-pane>-->
          <!--            <el-tab-pane label="企业专网IP配置" name="2">-->
          <!--            </el-tab-pane>-->
          <!--            <el-tab-pane label="查询/变更网络产品的配置状态" name="3">-->
          <!--            </el-tab-pane>-->
          <!--          </el-tabs>-->
        </el-card>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.result {
  h3 {
    font-size: 16px;
    height: 50px;
    margin-top: 70px;
  }
}
.network-tool {
  .el-collapse-item__header {
    padding: 0 20px;
    font-size: 20px;
    font-weight: 600;
  }
  .el-collapse-item__content {
    margin: 10px 20px;
    padding: 10px 20px;
    border: 1px #ddd solid;
  }
}
</style>
