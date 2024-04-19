<script>
import apis from '@/api/ironman-api'
const alertTypeMap = {
  CPE_OFFLINE: '离线告警',
  CPE_PING: '时延告警',
  CLIENT_OFFLINE: '离线告警',
  CLIENT_PING: '时延告警',
  NETWORK_SWITCH: '网络切换'
}
export default {
  props: {
    config: {
      type: Object,
      default: () => ({ type: '' })
    }
  },
  data() {
    return {
      alertTypeMap
    }
  },
  methods: {
    async changeEnableStatus(enable) {
      const { id } = this.config
      const { success } = await apis.alertRuleSwitch({ id, enable })
      if (success) {
        this.$message({ type: 'success', message: '修改成功' })
      }
    },
    async submit() {
      const { id, scope, type, methods, param } = this.config
      if (!scope) {
        return this.$message({ type: 'warning', message: '请选择监控' })
      }
      if (!methods.length) {
        return this.$message({ type: 'warning', message: '请选择告警方式' })
      }
      if (['CPE_OFFLINE', 'CLIENT_OFFLINE'].indexOf(type) > -1) {
        if (!param.duration || Number(param.duration) < 90) {
          return this.$message({ type: 'warning', message: '请填写正确的秒数，不得小于90' })
        }
      }
      if (['CPE_PING', 'CLIENT_PING'].indexOf(type) > -1) {
        if (!param.ping || !param.loss) {
          return this.$message({ type: 'warning', message: '' })
        }
      }
      const { success } = await apis.alertRuleSave({
        id,
        scope,
        methods,
        param: JSON.stringify(param)
      })
      if (success) {
        this.$message({ type: 'success', message: '保存成功' })
      }
    }
  }
}
</script>
<template>
  <div class="cpe-setting-card">
    <el-card>
      <div slot="header">
        <span>{{ alertTypeMap[config.type] }}</span>
        <el-switch
          style="float: right; padding: 3px 0"
          v-model="config.enable"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="changeEnableStatus"
        >
        </el-switch>
      </div>
      <div>
        <el-form :inline="true">
          <div class="form-row">
            <span class="label">监控：</span>
            <el-form-item>
              <el-radio v-model="config.scope" label="ALL">全部</el-radio>
              <el-radio v-model="config.scope" label="FOLLOWED">星标</el-radio>
            </el-form-item>
          </div>
          <div class="form-row">
            <span class="label">告警方式：</span>
            <el-form-item>
              <el-checkbox-group v-model="config.methods">
                <el-checkbox label="QYWX">企业微信</el-checkbox>
                <el-checkbox label="SMS" :disabled="true">短信</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div class="form-row" v-if="['CPE_OFFLINE', 'CLIENT_OFFLINE'].indexOf(config.type) > -1">
            断网持续
            <el-form-item>
              <el-input size="mini" v-model="config.param.duration" type="number" :min="1"></el-input>
            </el-form-item>
            秒，告警一次
          </div>
          <template v-if="['CPE_PING', 'CLIENT_PING'].indexOf(config.type) > -1">
            <div class="form-row">
              时延超过
              <el-form-item>
                <el-input size="mini" v-model="config.param.ping" type="number"></el-input> ms,
              </el-form-item>或丢包率超过
              <el-form-item>
                <el-input size="mini" v-model="config.param.loss" type="number"></el-input>
              </el-form-item>%，告警
            </div>
            <div class="form-row">一次</div>
          </template>
          <div v-else class="form-row"></div>
        </el-form>
        <div class="rules">
          <p>规则：</p>
          <template v-if="['CPE_OFFLINE', 'CLIENT_OFFLINE'].indexOf(config.type) > -1">
            <p>1、超过设置时间后仍然断网不再告警。</p>
            <p>2、设备联网后，重新触发告警规则。</p>
          </template>
          <template v-if="['CPE_PING', 'CLIENT_PING'].indexOf(config.type) > -1">
            <p>1、告警后仍然超过阈值，不再告警。</p>
            <p>2、低于阈值后，重新触发告警规则。</p>
          </template>
          <template v-if="config.type === 'NETWORK_SWITCH'">
            <p>1、网络从蜂窝切换至有线，或者从有线切换至蜂窝，告警一次。</p>
            <p>&nbsp;</p>
          </template>
        </div>
      </div>
      <div class="button-wrapper">
        <el-button size="small" type="primary" @click="submit">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss">
.cpe-setting-card {
  .form-row {
    height: 32px;
    line-height: 32px;
    font-size: 14px;

    .el-input {
      width: 65px;
      input {
        padding: 0 5px;
      }
    }

    .label {
      display: inline-block;
      width: 80px;
      font-size: 14px;
    }
  }

  .rules {
    color: #999;
    margin-top: 20px;
    font-size: 14px;

    p {
      line-height: 22px;
    }
  }

  .button-wrapper {
    margin-top: 15px;
    text-align: right;
  }
}
</style>
