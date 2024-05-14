<script>
import moment from 'moment'
import apis from '@/api/ironman-api'
import CpeDeviceTerminal from '@/page/cpe/children/device/device-list/terminal'

export default {
  components: {
    CpeDeviceTerminal
  },
  props: {
    macAddr: {
      type: String,
      default: ''
    },
    parentMacAddr: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'cpe'
    }
  },
  data() {
    return {
      date: [
        moment().format('YYYY-MM-DD 00:00:00'),
        moment().add(1, 'day').format('YYYY-MM-DD 00:00:00')
      ],
      domainList: [],
      isShowDomainTerminal: false,
      domain: '',
      domainTerminalList: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    terminalOpen(data) {
      this.$refs.cpeDeviceTerminal.open(data)
    },
    async getData() {
      const [startTime, endTime] = this.date
      const params = {
        macAddr: this.macAddr,
        startTime: moment(startTime).format('YYYY-MM-DD HH:00:00'),
        endTime: moment(endTime).format('YYYY-MM-DD HH:00:00')
      }
      if (this.type === 'terminal') {
        params.parentMacAddr = this.parentMacAddr
      }
      const { success, data } =
        this.type === 'cpe'
          ? await apis.domainRecordStat(params)
          : await apis.domainRecordClientStat(params)
      if (success) {
        this.domainList = data
      }
    },
    async showDomainTerminal(domain) {
      this.domain = domain
      this.isShowDomainTerminal = true
      const [startTime, endTime] = this.date
      const { success, data } = await apis.domainRecordDetail({
        macAddr: this.macAddr,
        domain: this.domain,
        startTime: moment(startTime).format('YYYY-MM-DD HH:00:00'),
        endTime: moment(endTime).format('YYYY-MM-DD HH:00:00')
      })
      if (success) {
        this.domainTerminalList = data
      }
    },
    toClient(clientMac) {
      this.terminalOpen({
        macAddr: this.macAddr,
        client: clientMac
      })
    }
  }
}
</script>

<template>
  <div class="domain-record">
    <div>
      <el-date-picker
        v-model="date"
        popper-class="domain-record-date-picker"
        type="datetimerange"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :clearable="false"
        @change="getData"
      >
      </el-date-picker>
      <span class="ml10" style="color: #999">时间精确到小时</span>
      <div class="statistic">
        <!--        <div class="chart"></div>-->
        <div class="table">
          <el-table size="small" :data="domainList" height="300px">
            <el-table-column label="序号" align="center" width="200">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column label="域名">
              <template slot-scope="scope">
                <span
                  v-if="type === 'cpe'"
                  class="link"
                  @click="showDomainTerminal(scope.row.domain)"
                >
                  {{ scope.row.domain }}
                </span>
                <span v-else>{{ scope.row.domain }}</span>
              </template>
            </el-table-column>
            <el-table-column label="访问次数" prop="count" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog title="域名访问终端" :visible.sync="isShowDomainTerminal">
      <div class="mb10">域名：{{ domain }}</div>
      <el-table size="small" :data="domainTerminalList" height="400px">
        <el-table-column label="序号" width="80px" align="center">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="终端名称" prop="name"></el-table-column>
        <el-table-column label="终端Mac地址" prop="macAddr">
          <template slot-scope="scope">
            <el-link type="primary" @click="toClient(scope.row.macAddr)">{{
              scope.row.macAddr
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          label="访问次数"
          prop="count"
          width="100px"
          align="center"
        ></el-table-column>
      </el-table>
    </el-dialog>
    <cpe-device-terminal ref="cpeDeviceTerminal" />
  </div>
</template>

<style lang="scss">
.domain-record-date-picker {
  .el-time-spinner {
    .el-time-spinner__wrapper {
      width: 100%;

      &:nth-child(2) {
        display: none;
      }
    }
  }
}

.domain-record {
  .statistic {
    margin-top: 15px;

    .link {
      color: #1c8de0;
      cursor: pointer;
      text-decoration: none;
    }
  }
}
</style>
