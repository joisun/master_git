<script>
import apis from '@/api/ajax'
import { toolsMixin } from '@/global/mixins/table-selection'
const SELECTION_STORAGE_KEY = 'whitehouse_cpe_device_list'

export default {
  mixins: [toolsMixin],
  data() {
    return {
      formData: {
        macAddr: '',
        type: 0
      },
      formRules: {
        macAddr: { required: true, message: 'mac地址不能为空', trigger: 'blur' }
      },
      loading: false,
      loadingMode: false,
      storageKey: SELECTION_STORAGE_KEY
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const { from, macAddr } = this.$route.query
      if (macAddr) {
        this.formData.macAddr = macAddr
        return
      }
      if (from === 'device-list') {
        const selected = this.getSelected('macAddr')
        if (selected.length) {
          this.formData.macAddr = selected[0]
        }
      }
    },
    getWan2Lan() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return false
        }
        this.loadingMode = true
        const { data } = await apis.cpe.getWan2Lan(this.formData)
        this.loadingMode = false
        let message
        if (data === 0) {
          message = '当前为WAN模式'
        } else if (data === 1) {
          message = '当前为LAN模式'
        }
        this.$message({ type: 'success', message })
      })
    },
    setWan2Lan() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return false
        }
        this.loading = true
        const { success, message } = await apis.cpe.setWan2Lan(this.formData)
        this.loading = false
        if (!success) {
          return false
        }
        this.macAddr = ''
        this.$message({ type: 'success', message })
      })
    },
    backList() {
      window.history.go(-1)
    }
  }
}
</script>

<template>
  <div class="recovery">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">WAN/LAN切换</h2>
        <span v-if="!$route.query.enter" class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div class="wh__body">
        <br />
        <el-form ref="form" label-width="100px" :model="formData" :rules="formRules">
          <el-form-item label="Mac地址" prop="macAddr">
            <el-input
              v-model="formData.macAddr"
              style="width: 200px"
              placeholder="请输入Mac地址"
            ></el-input>
            <el-button type="primary" :loading="loadingMode" @click="getWan2Lan"
              >查看当前模式</el-button
            >
          </el-form-item>
          <el-form-item label="模式">
            <el-radio-group v-model="formData.type" size="mini">
              <el-radio :label="0">WAN</el-radio>
              <el-radio :label="1">LAN</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="setWan2Lan">切换</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
