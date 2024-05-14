<script>
  import apis from '@/api/ajax'
  import { iccidsTransfer } from '@/global/function/iccids-tool'
  import { toolsMixin } from '@/global/mixins/table-selection'
  const SELECTION_STORAGE_KEY = 'whitehouse_cpe_device_list'

  export default {
    mixins: [toolsMixin],
    data() {
      return {
        macAddr: '',
        action: 'RETRIVE_DEVICE',
        remark: '',
        storageKey: SELECTION_STORAGE_KEY
      }
    },
    created() {
      if (this.$route.query.from === 'device-list') {
        const selected = this.getSelected('macAddr')
        if (selected.length) {
          this.macAddr = selected.join('\n')
        }
      }
    },
    methods: {
      async submit() {
        const macAddrs = iccidsTransfer(this.macAddr)
        if (macAddrs.length === 1 && !macAddrs[0]) {
          macAddrs.pop()
        }
        if (!macAddrs.length) {
          return this.$message({ type: 'error', message: 'mac地址不能为空' })
        }
        const { success, message } = await apis.cpe.wipeDevice({
          macAddrs: macAddrs.join(','),
          action: this.action,
          remark: this.remark
        })
        if (!success) {
          return false
        }
        this.macAddr = ''
        this.remark = ''
        this.$message({ type: 'success', message })
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
        <h2 class="wh__header--title">设备回收/清除</h2>
        <span v-if="!$route.query.enter" class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div class="wh__body">
        <br/>
        <el-form label-width="100px">
          <el-form-item label="操作">
            <el-radio-group v-model="action" size="mini">
              <el-radio label="RETRIVE_DEVICE">回收</el-radio>
              <el-radio label="WIPE_DEVICE">清除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Mac地址">
            <el-input
              style="width: 400px"
              :rows="6"
              type="textarea"
              v-model="macAddr"
              placeholder="请输入Mac地址，一行一个"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              style="width: 400px"
              :rows="3"
              type="textarea"
              v-model="remark"
              placeholder="请输入备注"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="warning">
              <div>该工具用于已出库设备的回收和清除。操作说明：</div>
              <div>回收：删除设备数据、出库记录，库存状态由已出库变更为库存。</div>
              <div>清除：清除所有设备信息、出入库记录。</div>
              <div>该操作不可逆，请谨慎操作！</div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
