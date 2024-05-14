<script>
import apis from '@/api/ajax'
import { toolsMixin } from '@/global/mixins/table-selection'
import { iccidsTransfer } from '@/global/function/iccids-tool'
import Upload from './components/upload.vue'

const SELECTION_STORAGE_KEY = 'whitehouse_cpe_device_list'

export default {
  mixins: [ toolsMixin ],
  data() {
    return {
      formData: {
        macAddr: '',
        searchModel: '',
        firmwareId: ''
      },
      formRules: {
        firmwareId: { required: true, message: '请选择固件', trigger: 'change' }
      },
      loading: false,
      storageKey: SELECTION_STORAGE_KEY,
      activeTab: 'first',
      deviceSelectType: 'macAddr',
      supplierProduct: [],
      firmwareList: [],
      errMsg: ''
    }
  },
  components: {
    Upload
  },
  created() {
    if (this.$route.query.from === 'device-list') {
      const selected = this.getSelected('macAddr')
      if (selected.length) {
        this.formData.macAddr = selected.join('\n')
      }
    }
    this.getSupplierProduct()
    this.getFirmwareList()
  },
  computed: {
    filteredFirmwareList() {
      if (!this.formData.searchModel) {
        return this.firmwareList
      }
      return this.firmwareList.filter(item => item.cpeModel === this.formData.searchModel)
    }
  },
  methods: {
    async getSupplierProduct() {
      const { success, data } = await apis.cpe.supplierProductList({ pageIndex: 1, pageSize: 10000, platform: 'JARVIS' }) // 获取供应商产品型号
      if (!success) {
        return false
      }
      this.supplierProduct = data.list.map(item => ({ id: item.id, model: item.model }))
    },
    async getFirmwareList() {
      const macAddrs = iccidsTransfer(this.formData.macAddr)
      if (macAddrs.length === 1 && !macAddrs[0]) macAddrs.pop()
      const { success, data } = await apis.cpe.firmwareList({ macAddrs })
      if (!success) return false
      this.firmwareList = data
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) {
          return false
        }
        const { firmwareId, macAddr, searchModel } = this.formData
        const data = { firmwareId }
        if (this.deviceSelectType === 'macAddr') {
          data.macAddrList = iccidsTransfer(macAddr)
          if (!data.macAddrList.length) {
            return this.$message({ type: 'error', message: 'Mac地址不能为空' })
          }
        } else {
          data.searchModel = searchModel
          if (!data.searchModel) {
            return this.$message({ type: 'error', message: '请选择CPE型号' })
          }
        }
        this.loading = true
        this.errMsg = ''
        const result = await apis.cpe.upgradeValidate(data)
        if (!result.success) {
          this.loading = false
          this.errMsg = result.message
          return false
        }
        if (!result.data.validCount) {
          this.errMsg = '未查询到有效设备'
          return false
        }
        this.$confirm(`共${result.data.validCount}台有效设备，确定进行升级吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { success, message } = await apis.cpe.upgrade(data)
          this.loading = false
          if (!success) {
            return false
          }
          this.formData.macAddr = ''
          this.formData.searchModel = ''
          this.$message({ type: 'success', message })
        }).catch(() => {
          this.loading = false
        })
      })
    },
    backList() {
      window.history.go(-1)
    },
    uploadSuccess() {
      this.getFirmwareList()
    }
  }
}
</script>

<template>
  <div class="cpe-upgrade">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">设备升级</h2>
        <span v-if="!$route.query.enter" class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div class="wh__body">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="设备升级" name="first">
            <el-form label-width="100px" :inline="true" ref="form" :model="formData" :rules="formRules">
              <div class="device-select">
                <p class="mb10">
                  <el-radio v-model="deviceSelectType" label="macAddr">Mac地址</el-radio>
                  <el-radio v-model="deviceSelectType" label="conditions">条件筛选</el-radio>
                </p>
                <div v-if="deviceSelectType === 'macAddr'">
                  <el-input
                    type="textarea"
                    v-model="formData.macAddr"
                    :rows="6"
                    placeholder="请输入Mac地址">
                  </el-input>
                </div>
                <div v-else>
                  <p>
                    <span class="label">CPE型号：</span>
                    <el-select v-model="formData.searchModel" placeholder="请选择CPE型号" clearable filterable>
                      <el-option v-for="item in supplierProduct" :key="item.id" :value="item.model">
                        {{ item.model }}
                      </el-option>
                    </el-select>
                  </p>
                </div>
                <p class="device-select--desc">通过Mac地址或者筛选条件选择需要升级的设备</p>
              </div>
              <p>
                <el-form-item label="选择固件" prop="firmwareId">
                  <el-select v-model="formData.firmwareId" clearable filterable>
                    <el-option
                      v-for="item in filteredFirmwareList"
                      :key="item.id"
                      :value="item.id"
                      :label="`${item.cpeModel} - ${item.appType} - ${item.version}`"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </p>
              <p>
                <el-form-item label=" ">
                  <div class="warning" v-if="errMsg">{{errMsg}}</div>
                  <el-button type="primary" :loading="loading" @click="submit">升级</el-button>
                </el-form-item>
              </p>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="固件上传" name="second">
            <upload :supplierProduct="supplierProduct" :firmwareList="firmwareList" @upload-success="uploadSuccess"></upload>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cpe-upgrade {
  .el-input, .el-select, .el-textarea {
    width: 400px;
  }

  .device-select {
    padding: 15px;
    margin-bottom: 15px;
    background-color: #efefef;

    &--desc {
      margin-top: 25px;
      font-size: 12px;
      color: #999999;
    }

    & .label {
      font-size: 14px;
      color: #333333;
    }
  }
}
</style>
