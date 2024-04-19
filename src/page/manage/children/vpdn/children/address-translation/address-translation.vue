<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'
export default {
  data() {
    return {
      formData: {
        type: 0,
        ids: ''
      },
      tableData: [],
      typeMap: {
        0: 'iccid',
        1: 'msisd',
        2: 'ip'
      }
    }
  },
  methods: {
    async translation() {
      let res = await this.jaxLib.vpdn.util.change({
        type: this.formData.type,
        ids: iccidsTransfer(this.formData.ids, ',')
      })
      if (!res.success) {
        this.tableData = []
        return false
      }
      this.tableData = res.data
    },
    copyIp(ipList) {
      this.$refs.copyHook.value = ipList.join('\n')
      this.$refs.copyHook.select()
      document.execCommand('Copy')
      this.$message({ type: 'success', message: '已复制到剪切板' })
    }
  }
}
</script>

<template>
  <div class="address-translation">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">网络地址转换工具</h2>
      </div>
      <div class="wh__body flex">
        <el-form class="width30">
          <el-form-item>
            <el-radio v-model="formData.type" :label="0">iccid</el-radio>
            <el-radio v-model="formData.type" :label="1">msisd</el-radio>
            <el-radio v-model="formData.type" :label="2">ip</el-radio>
          </el-form-item>
          <el-form>
            <el-input
              v-model="formData.ids"
              type="textarea"
              :placeholder="`请输入${typeMap[formData.type]}`"
            ></el-input>
          </el-form>
        </el-form>
        <div class="btn-wrapper width10">
          <el-button type="primary" @click="translation">转 换</el-button>
        </div>
        <el-table v-show="tableData.length > 0" :data="tableData" class="width60">
          <el-table-column label="路由组" class="ip-card">
            <template slot-scope="scope">
              <p v-for="(item, key) in scope.row.routerGroup" v-if="item" :key="key">
                {{ key }}: {{ item }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="卡IP">
            <template slot-scope="scope">
              <p v-for="(item, index) in scope.row.cardIps" :key="index" v-text="item"></p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110px">
            <template slot-scope="scope">
              <el-button size="small" @click="copyIp(scope.row.cardIps)">复制卡IP</el-button>
            </template>
          </el-table-column>
        </el-table>
        <textarea ref="copyHook" class="copyTextArea"></textarea>
      </div>
    </div>
  </div>
</template>
