<script>
  import numberFixedFormat from '@/global/filters/number-fixed'
  export default {
    name: 'vpdn-network-card-detail',
    data() {
      return {
        loading: false,
        data: {
          lastDownLink: {},
          lastUpLink: {}
        }
      }
    },
    computed: {},
    filters: {
      kbFilter: function(volume) {
        if (isNaN(volume)) {
          return volume
        }
        volume = parseFloat(volume)
        if (Math.abs(volume) < 1024) {
          return numberFixedFormat(volume) + 'KB/s'
        }
        volume /= 1024
        return numberFixedFormat(volume) + 'MB/s'
      }
    },
    methods: {
      async getNetworkStatus() {
        let { iccid, carrier, carrierAccountId } = this.$route.query
        if (!iccid) {
          return
        }
        this.loading = true
        let data = {
          iccid,
          carrier,
          carrierAccountId
        }
        let cardInfoPromise = this.jaxLib.vpdn.networkStatus.cardInfo(data)
        let linksPromise = this.jaxLib.vpdn.networkStatus.links(data)
        let pingPromise = this.jaxLib.vpdn.networkStatus.ping(data)

        let rsts = await Promise.all([cardInfoPromise, linksPromise, pingPromise])
        this.loading = false

        this.data = {}

        if (rsts[0].success) {
          this.data = Object.assign({}, this.data, rsts[0].data)
        }

        if (rsts[1].success) {
          this.data = Object.assign({}, this.data, rsts[1].data)
        }
        if (!this.data.lastUpLink) {
          this.data.lastUpLink = {}
        }
        if (!this.data.lastDownLink) {
          this.data.lastDownLink = {}
        }

        if (rsts[2].success) {
          this.data = Object.assign({}, this.data, rsts[2].data)
        }
      }
    },
    components: {},
    mounted() {
      this.getNetworkStatus()
    },
    activated() {
      this.getNetworkStatus()
    }
  }
</script>

<template>
  <div class="card-detail">
    <el-card class="vpdn-detail" v-loading="loading">
      <h4 class="vpdn-detail__title">卡详情</h4>
      <div class="vpdn-detail__row vpdn-detail__row--large">
        <div class="vpdn-detail__section">
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">ICCID</div>
            <div class="vpdn-detail__value">{{data.iccid}}</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">IMSI</div>
            <div class="vpdn-detail__value">{{data.imsi}}</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">MSISDN</div>
            <div class="vpdn-detail__value">{{data.msisdn}}</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">IP</div>
            <div class="vpdn-detail__value">{{data.ip}}</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">IMEI</div>
            <div class="vpdn-detail__value">{{data.imei}}</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">APN</div>
            <div class="vpdn-detail__value">{{data.apn}}</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">所属客户</div>
            <div class="vpdn-detail__value">{{data.orgName}}({{data.orgId}})</div>
          </div>
        </div>
        <div class="vpdn-detail__section">
          <h5 class="vpdn-detail__section__title">功能状态</h5>
          <!-- <div class="vpdn-detail__item">
              <div class="vpdn-detail__name">机卡分离功能</div>
              <div class="vpdn-detail__value">{{data.deviceImeiSplit | open3Filter}}</div>
            </div> -->
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">机卡分离状态</div>
            <div class="vpdn-detail__value">{{data.imeiStatus | imeiStatusFilter}}</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">限速功能</div>
            <div class="vpdn-detail__value">{{data.speedLimitStatus | open3Filter}}</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">限速状态</div>
            <div class="vpdn-detail__value">
              <span v-if="data.speedLimitStatus && data.speedLimitStatus !== 'off'">{{data.speedLimit | speedFilter(true, true)}}</span>
              <span v-else>未限速</span>
            </div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">分离计费功能</div>
            <div class="vpdn-detail__value">{{data.aclPolicy | open3Filter}}</div>
          </div>
        </div>
      </div>
      <div class="vpdn-detail__row vpdn-detail__row--small">
        <div class="vpdn-detail__section">
          <h5 class="vpdn-detail__section__title">卡状态</h5>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">运营商侧卡状态</div>
            <div class="vpdn-detail__value"
                 :class="{
                    'color-danger': ['DEACTIVATED_NAME', 'RETIRED_NAME', 'PURGED_NAME'].includes(data.physicalStatus)
                  }">{{data.physicalStatus | deviceStatusFilter}}</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">客户侧卡状态</div>
            <div class="vpdn-detail__value"
                 :class="{
                    'color-danger': ['deactivation', 'retired'].includes(data.status)
                  }">{{data.status | cardStatusFilter}}</div>
          </div>
        </div>
        <div class="vpdn-detail__section">
          <h5 class="vpdn-detail__section__title">网络状态</h5>
          <!-- <div class="vpdn-detail__item">
              <div class="vpdn-detail__name">运营商侧网络状态</div>
              <div class="vpdn-detail__value"></div>
            </div> -->
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">VPDN网络状态</div>
            <div class="vpdn-detail__value">
              <div class="vpdn-detail__value"
                   :class="{
                      'color-danger': ['DEACTIVATED_NAME'].includes(data.gprsStatus)
                    }">{{data.gprsStatus | gprsStatusFilter}}</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="vpdn-detail">
      <h4 class="vpdn-detail__title">网络详情</h4>
      <div class="vpdn-detail__row vpdn-detail__row--large">
        <div class="vpdn-detail__section">
          <h5 class="vpdn-detail__section__title">最近一次上行数据</h5>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">连接时间</div>
            <div class="vpdn-detail__value">{{data.lastUpLink.time}}</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">连接地址</div>
            <div class="vpdn-detail__value">{{data.lastUpLink.address}}</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">数据大小</div>
            <div class="vpdn-detail__value">{{data.lastUpLink.dataSize | volumeFilter(true, true)}}</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">连接时长</div>
            <div class="vpdn-detail__value" v-if="data.lastUpLink.duration">{{data.lastUpLink.duration}}s</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">当前网速</div>
            <div class="vpdn-detail__value">{{data.lastUpLink.currentSpeed | kbFilter}}</div>
          </div>
        </div>
        <div class="vpdn-detail__section">
          <h5 class="vpdn-detail__section__title">最近一次下行数据</h5>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">连接时间</div>
            <div class="vpdn-detail__value">{{data.lastDownLink.time}}</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">连接地址</div>
            <div class="vpdn-detail__value">{{data.lastDownLink.address}}</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">数据大小</div>
            <div class="vpdn-detail__value">{{data.lastDownLink.dataSize | volumeFilter(true, true)}}</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">连接时长</div>
            <div class="vpdn-detail__value" v-if="data.lastDownLink.duration">{{data.lastDownLink.duration}}s</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">当前网速</div>
            <div class="vpdn-detail__value">{{data.lastDownLink.currentSpeed | kbFilter}}</div>
          </div>
        </div>
      </div>
      <div class="vpdn-detail__row vpdn-detail__row--small">
        <div class="vpdn-detail__section">
          <h5 class="vpdn-detail__section__title">网速数据（50次内）</h5>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">最高网速</div>
            <div class="vpdn-detail__value vpdn-detail__value--flex">
              <span><span class="color-green">↿</span>{{data.lastUpLink.maxSpeed | kbFilter}}</span>
              <span><span class="color-danger">⇂</span>{{data.lastDownLink.maxSpeed | kbFilter}}</span>
            </div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">最低网速</div>
            <div class="vpdn-detail__value vpdn-detail__value--flex">
              <span><span class="color-green">↿</span>{{data.lastUpLink.minSpeed | kbFilter}}</span>
              <span><span class="color-danger">⇂</span>{{data.lastDownLink.minSpeed | kbFilter}}</span>
            </div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">平均网速</div>
            <div class="vpdn-detail__value vpdn-detail__value--flex">
              <span><span class="color-green">↿</span>{{data.lastUpLink.avgSpeed | kbFilter}}</span>
              <span><span class="color-danger">⇂</span>{{data.lastDownLink.avgSpeed | kbFilter}}</span>
            </div>
          </div>
        </div>
        <div class="vpdn-detail__section">
          <h5 class="vpdn-detail__section__title">Ping<span style="visibility: hidden;">隐藏文字撑起高度</span></h5>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">Ping</div>
            <div class="vpdn-detail__value" :class="{
              'color-danger': ['Fail'].includes(data.ping)
            }">{{data.ping}}</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">平均延时</div>
            <div class="vpdn-detail__value">{{data.avgDelay}}ms</div>
          </div>
          <div class="vpdn-detail__item">
            <div class="vpdn-detail__name">丢包率</div>
            <div class="vpdn-detail__value">{{data.packetLossRate}}%</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss">
  .vpdn-detail {
    display: inline-block;
    vertical-align: top;
    width: 49.2%;
    // padding: 10px 20px;
    // border: 1px solid #ccc;
    box-sizing: border-box;
    background-color: #fff;

    &__row {
      &:after {
        clear: both;
        display: block;
        content: '';
    }
      display: flex;
      justify-content: space-between;
      margin: 10px 0 15px;
      &:first-child {
        margin-top: 10px;
    }

      &--large {
        min-height: 274px;
    }
      &--small {
        min-height: 131px;
    }
  }

    &__section {
      box-sizing: border-box;
      padding: 8px 10px;
      border: 1px solid #e1e1e1;
      width: 48%;
      background: #f6f6f6;
      &__title {
        margin-bottom: 2px;
    }
  }

    &__item {
      line-height: 2;
      &:after {
        clear: both;
        display: block;
        content: '';
    }
  }
    &__name {
      color: #999;
      float: left;
      margin-right: 10px;
      // min-width: 128px;
      text-align: right;
  }
    &__value {
      overflow:hidden;
      &--flex {
        display: flex;
        justify-content: space-between;
        & > span {
          flex-grow: 1;
          width: 50%;
      }
    }
  }
  }
    .vpdn-network-body {
      display: flex;
      justify-content: space-between;
  }
</style>
