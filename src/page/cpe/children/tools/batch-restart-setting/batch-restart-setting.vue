<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'
import apis from '@/api/ajax'
import { toolsMixin } from '@/global/mixins/table-selection'
import moment from 'moment'
const SELECTION_STORAGE_KEY = 'whitehouse_cpe_device_list'

const weekMap = ['每天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
export default {
  mixins: [toolsMixin],
  data() {
    return {
      macAddrs: '',
      enable: true,
      by: 'at',
      time: moment().startOf('day'),
      week: 0,
      interval: 300,
      weekMap,
      formRule: {
        macAddrs: { required: true, message: 'mac地址不能为空' }
      },
      storageKey: SELECTION_STORAGE_KEY
    }
  },
  created() {
    if (this.$route.query.from === 'device-list') {
      const selected = this.getSelected('macAddr')
      if (selected.length) {
        this.macAddrs = selected.join('\n')
      }
    }
  },
  methods: {
    async submit() {
      const macAddrs = iccidsTransfer(this.macAddrs).join(',').trim()
      if (!macAddrs) {
        return this.$message({ type: 'warning', message: 'mac地址不能为空' })
      }
      let params = {
        macAddrs,
        enable: !!this.enable
      }
      if (this.enable) {
        params.by = this.by
        if (this.by === 'at') {
          params = {
            ...params,
            time: moment(this.time).format('HH:mm'),
            week: this.week
          }
        } else {
          params = {
            ...params,
            interval: this.interval
          }
        }
      }
      const { success, message } = await apis.cpe.monitorBatchRestart(params)
      if (success) {
        this.macAddrs = ''
        this.$message({ type: 'success', message })
      }
    },
    backList() {
      window.history.go(-1)
    }
  }
}
</script>

<template>
  <div class="batch-restart-setting">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">批量定时重启</h2>
        <span v-if="!$route.query.enter" class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div class="wh__body">
        <el-form class="form" label-width="110px">
          <el-form-item label="Mac地址">
            <el-input
              v-model="macAddrs"
              type="textarea"
              :rows="6"
              resize="none"
              placeholder="请输入Mac地址，一行一个"
            ></el-input>
          </el-form-item>
          <el-form-item label="定时重启">
            <el-switch v-model="enable" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <template v-if="enable">
            <el-form-item label="重启方式">
              <el-radio v-model="by" label="at">定时重启</el-radio>
              <el-radio v-model="by" label="interval">间隔重启</el-radio>
            </el-form-item>
            <template v-if="by === 'at'">
              <el-form-item label="重启时间">
                <el-time-picker
                  v-model="time"
                  placeholder="选择时间"
                  format="HH:mm"
                  :clearable="false"
                />
              </el-form-item>
              <el-form-item label="定时间隔">
                <el-select v-model="week">
                  <el-option
                    v-for="(item, index) in weekMap"
                    :key="index"
                    :value="index"
                    :label="item"
                    >{{ item }}
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item v-else label="间隔时间">
              <el-input-number
                v-model="interval"
                controls-position="right"
                :min="300"
              ></el-input-number>
              秒，至少大于300
            </el-form-item>
          </template>
          <el-form-item label=" ">
            <el-button type="primary" @click="submit">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.form {
  width: 600px;
  margin-top: 20px;
}
</style>
