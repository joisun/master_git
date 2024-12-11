<template>
  <div>
    <el-form ref="form" :model="formData" label-width="80px">
      <el-form-item
        label="网络产品"
        prop="product"
        :rules="{ required: true, message: '请选择网络产品' }"
      >
        <el-select
          v-model="formData.product"
          placeholder="请选择网络产品"
          @change="onProductChange"
        >
          <el-option label="卡卡自组网" value="ADHOC" />
          <el-option label="白名单" value="ACL_POLICY_WHITE" />
          <el-option label="企业专网" value="EPNET" />
          <el-option value="IPSEC_VPN_TUNNEL" label="ipsecvpn隧道">ipsecvpn隧道</el-option>
          <el-option value="PUBLIC_NETWORK_PORT_MAPPING" label="公网端口映射">公网端口映射</el-option>
          <el-option value="DATA_REDIRECT" label="数据重定向">数据重定向</el-option>
          <el-option value="OPEN_VPN" label="openvpn">openvpn</el-option>
        </el-select>
      </el-form-item>
      <template v-if="formData.product">
        <el-form-item label="查询状态">
          <el-input
            v-model.trim="search.batchNo"
            style="width: 200px"
            placeholder="批次号/客户ID"
            clearable
            @keydown.native.enter="handleSearch"
          />
          <el-input
            v-model.trim="search.poolId"
            style="width: 200px"
            placeholder="池子ID"
            clearable
            @keydown.native.enter="handleSearch"
          />
          <el-select
            v-model="search.status"
            placeholder="配置状态"
            clearable
            @keydown.native.enter="handleSearch"
          >
            <el-option label="配置中" value="configuring" />
            <el-option label="未配置" value="unconfigure" />
            <el-option label="配置失败" value="config_failed" />
          </el-select>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item prop="batchNo" :rules="tableRule">
          <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="orgId" label="组织ID" width="180" />
            <el-table-column prop="poolId" label="池/通道ID" width="180" />
            <el-table-column prop="batchNo" label="批次号"></el-table-column>
            <el-table-column prop="type" label="配置类型"></el-table-column>
            <el-table-column prop="status" label="配置状态"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item
          label="变更状态"
          prop="status"
          :rules="{ required: true, message: '请选择变更状态' }"
        >
          <el-select v-model="formData.status" placeholder="请选择变更状态">
            <el-option label="配置成功" value="configured" />
            <el-option label="配置失败" value="config_failed" />
            <el-option label="配置中" value="configuring" />
            <el-option label="未配置" value="unconfigure" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">变更</el-button>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>
<script>
import { safeGet } from '@/global/function/safe-operations'
import Download from '@/page/components/wh-download/wh-download'
import filterQueryParams from '@/global/function/filterQueryParams'
export default {
  data() {
    const validator = (rule, value, callback) => {
      if (this.multipleSelection.length === 0) {
        return callback('请选择需要变变更的数据')
      }
      callback()
    }
    return {
      tableData: [],
      formData: {},
      multipleSelection: [],
      search: {
        batchNo: '',
        status: '',
        poolId: ''
      },
      tableRule: {
        required: true,
        validator
      }
    }
  },
  methods: {
    onProductChange() {
      this.tableData = []
      this.formData = {
        ...this.formData,
        status: ''
      }
      this.search = {
        batchNo: '',
        status: '',
        poolId: ''
      }
      this.$refs.form.clearValidate()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSearch() {
      const { batchNo, status, poolId } = this.search
      if (!batchNo && !status && !poolId) {
        this.tableData = []
        return
      }
      this.getList()
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        const { product, status } = this.formData
        const batchNo = this.multipleSelection.map((item) => item.batchNo)
        const res = await this.jaxLib.vpdn.util.changeStatus({ product, status, batchNo })
        if (safeGet(res, 'success', false)) {
          this.$message.success('操作成功')
          this.reset()
        }
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.tableData = []
    },
    async getList() {
      const res = await this.jaxLib.vpdn.util.queryStatus(
        filterQueryParams({ ...this.search, product: this.formData.product })
      )
      if (safeGet(res, 'success', false)) {
        this.tableData = res.data
        return
      }
      this.tableData = []
    }
    // async handleExport() {
    //   const { success, data } = await this.jaxLib.vpdn.util.export({
    //     id: row.id
    //   })
    //   if (!success) return false
    //   if (data) {
    //     await Download({ ...data, loop: true })
    //   } else {
    //     this.$message.success('操作成功，文件过大，请到下载管理页面查看')
    //   }
    // }
  }
}
</script>
