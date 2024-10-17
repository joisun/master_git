<template>
  <div class="services-selector">
    <div class="handle" @click="open">
      <i class="el-icon-s-tools"/>
    </div>
    <el-drawer
        append-to-body
        modal-append-to-body
        title="服务选择"
        :visible.sync="visible"
        direction="btt"
        size="50%"
        class="services-selector"
        :before-close="handleClose">
      <template #title>
        <span>服务选择</span>
      </template>
      <el-form :model="formData" :rules="rules" ref="form" label-width="100px" class="demo-formData" inline>
        <template v-for="item in aliaList">
          <el-divider v-if="item.name === 'divider'" />
          <el-form-item v-else :label="item.name" :prop="item.apiKey"  :key="item.apiKey">
            <el-select v-model="formData[item.apiKey]" placeholder="请选择服务地址" :name="item.apiKey" allow-create
                       clearable>
              <el-option v-for="a in apis.filter(i => i.name === item.apiKey)" :key="a.id" :label="a.meta.branch"
                         :value="`http://${a.meta.publicAddress}:${a.meta.publicPort}`"/>
            </el-select>
          </el-form-item>
        </template>

      </el-form>
      <div style="text-align: center;margin-top: 20px">
        <el-button @click="getServers">刷新</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import {getCookie, setCookie} from "@/global/components/wh-image/src/util";
import ajax from "@/api/ajax";

export default {
  data() {
    return {
      visible: false,
      formData: {
        'simboss-whitehouse-client': '',
        'simboss-avatar-lady-liberty': '',
        'simboss-avatar-ota-gotham': '',
        'simboss-captain-america': '',
        'simboss-avatar-superman': '',
        'simboss-crm': '',
        'simboss-awesome-tools': "",
        'simboss-dashboard': '',
        'simboss-ironman': ''
      },
      rules: {},
      apis: [],
      aliaList: [{
        name: '白宫前端',
        apiKey: 'simboss-whitehouse-client',
      },
        {
          name: 'Captain',
          apiKey: 'simboss-captain-america',
        },
        {
          name: 'Crm',
          apiKey: 'simboss-crm',
        },
        {
          name: 'Ironman',
          apiKey: 'simboss-ironman',
        },
        {
          name: 'Dashboard',
          apiKey: 'simboss-dashboard',
        },
        {
          name: 'Tool',
          apiKey: 'simboss-awesome-tools',
        },
        {
          name: 'divider'
        },
        {
          name: '国际卡前端',
          apiKey: 'simboss-avatar-lady-liberty',
        },
        {
          name: 'OTA前端',
          apiKey: 'simboss-avatar-ota-gotham',
        },
        {
          name: 'Superman',
          apiKey: 'simboss-avatar-superman',
        },
      ]
    }
  },
  created() {
    this.aliaList.forEach(item => {
      this.formData[item.apiKey] = getCookie(item.apiKey) || `http://${item.apiKey}-master.test.simboss.com:80`
    })
  },
  methods: {
    open() {
      this.visible = true
      this.getServers()
    },
    async getServers() {
      const res = await ajax.apiSelector.getApiServer({})
      this.apis = res.data
    },
    handleClose() {
      this.visible = false
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        Object.keys(this.formData).forEach(key => {
          setCookie(key, this.formData[key])
        })
        this.$message.success('设置成功，建议刷新下页面哦')
      })
    },
  },
}
</script>

<style lang="scss" scoped>

.status-bar {
  position: fixed;
  bottom: 0;
  right: 0;
  width: calc(100vw - 30px);
  height: 30px;
  border: 1px solid #cdcdcd;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 12px;
  padding: 0 20px;
  line-height: 30px;
}

.handle {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background-color: #fff;
  text-align: center;
  border: 1px solid #cdcdcd;
  line-height: 30px;
  color: #333;
  cursor: pointer;
}
</style>
<style lang="scss">
.services-selector {
  .el-drawer {
    color: #333;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(15px) saturate(180%);
    -webkit-backdrop-filter: blur(15px) saturate(180%);

    .el-drawer__header, .el-form-item__label {
      color: #333;
    }

    .el-drawer__body {
      padding-bottom: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .el-input__inner {
    }
  }
}
</style>
