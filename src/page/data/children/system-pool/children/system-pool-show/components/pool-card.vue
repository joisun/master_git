<template>
  <div class="grid-content" :class="{ warn: volumeObject.consumed > 80 }">
    <div class="device-card">
      <div
        class="card-header"
        style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
      >
        <span v-if="content.poolSpecification !== -1" class="title">
          {{ content.poolSpecification | volumeFilter }}
        </span>
        <span v-else class="title">全套餐</span>
        <span class="info">ID:{{ content.poolId }}</span>
        <span v-if="signedCarrierName" class="info">{{ signedCarrierName }}</span>
        <el-popover
          placement="top-start"
          trigger="hover"
          :content="content.carrierAccountId.toString() | carrierAccountFilter(content.carrier)"
        >
          <span slot="reference" class="info">
            {{ content.carrierAccountId | carrierAccountFilter(content.carrier) }}
          </span>
        </el-popover>
      </div>

      <div class="card-content">
        <div v-if="poolAll" class="card-content-l1 margin-bottom-10 device-card__use">
          <span class="device-card__use--lasted"
            >已使用:{{ volumeObject.useVolume | volumeFilter }}</span
          >
          <br />
          <span class="device-card__use--overVolume">
            用户订购量:{{ volumeObject.oversellPackageVolume | volumeFilter }}
          </span>
          <br />
          <span v-if="volumeObject.groupUseVolume" class="device-card__use--overVolume">
            流量池接口用量:
            <span>{{ volumeObject.groupUseVolume | volumeFilter }}</span>
          </span>
        </div>
        <div v-else class="card-content-l1 margin-bottom-10 device-card__volume">
          <div
            v-if="volumeObject.totalVolume || volumeObject.groupTotalVolume"
            class="device-card__volume--picture"
          >
            <div ref="list" style="width: 100%; height: 100%"></div>
            <div class="device-card__volume--picture-rate">
              <el-tooltip
                class="item"
                effect="dark"
                content="运营商侧流量使用比率"
                placement="top-start"
              >
                <p>{{ volumeObject.consumed }}%</p>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="用户侧流量使用比率"
                placement="top-start"
              >
                <p>{{ volumeObject.backConsumed }}%</p>
              </el-tooltip>
            </div>
          </div>
          <div v-else class="device-card__volume--picture device-card__volume--picture-none">
            没有流量
          </div>
          <div class="device-card__volume--text">
            <span>已使用</span>
            <span
              v-if="
                volumeObject.groupTotalVolume ||
                volumeObject.groupLeftVolume ||
                volumeObject.groupUseVolume
              "
              class="device-card__volume--used"
              >: 差值{{
                volumeObject.groupUseVolume !== 0
                  ? Number(
                      ((volumeObject.useVolume - volumeObject.groupUseVolume) * 100) /
                        volumeObject.groupUseVolume
                    ).toFixed(2)
                  : 0
              }}%</span
            >
            <br />
            <span class="device-card__volume--other">单卡累加用量: </span>
            <span>{{ volumeObject.useVolume | volumeFilter }}</span>
            <span
              >({{
                volumeObject.totalVolume !== 0
                  ? Number((volumeObject.useVolume * 100) / volumeObject.totalVolume).toFixed(2)
                  : 0
              }}%)</span
            >
            <br />
            <span
              v-if="
                volumeObject.groupTotalVolume ||
                volumeObject.groupLeftVolume ||
                volumeObject.groupUseVolume
              "
            >
              <span class="device-card__volume--user">流量池接口用量: </span>
              <span>{{ volumeObject.groupUseVolume | volumeFilter }}</span>
              <span
                >({{
                  volumeObject.groupTotalVolume !== 0
                    ? Number(
                        (volumeObject.groupUseVolume * 100) / volumeObject.groupTotalVolume
                      ).toFixed(2)
                    : 0
                }}%)</span
              >
              <br />
            </span>
            <span>总量</span>
            <span
              v-if="
                volumeObject.groupTotalVolume ||
                volumeObject.groupLeftVolume ||
                volumeObject.groupUseVolume
              "
              class="device-card__volume--used"
              >: 差值{{
                volumeObject.groupTotalVolume !== 0
                  ? Number(
                      ((volumeObject.totalVolume - volumeObject.groupTotalVolume) * 100) /
                        volumeObject.groupTotalVolume
                    ).toFixed(2)
                  : 0
              }}%</span
            >
            <br />
            <span class="device-card__volume--other">单卡规格总量: </span>
            <span>{{ volumeObject.totalVolume | volumeFilter }}</span>
            <span class="device-card__volume--other device-card__volume--left-margin">剩: </span>
            <span>{{ volumeObject.leftVolume | volumeFilter }}</span>
            <br />
            <span
              v-if="
                volumeObject.groupTotalVolume ||
                volumeObject.groupLeftVolume ||
                volumeObject.groupUseVolume
              "
            >
              <span class="device-card__volume--user">流量池接口总量: </span>
              <span>{{ volumeObject.groupTotalVolume | volumeFilter }}</span>
              <span class="device-card__volume--user device-card__volume--left-margin">剩: </span>
              <span>{{ volumeObject.groupLeftVolume | volumeFilter }}</span>
              <br />
            </span>
            <span>用户</span>
            <br />
            <span>总:{{ volumeObject.userTotalVolume | volumeFilter }}</span>
            <span
              >超卖:{{
                (volumeObject.userTotalVolume - volumeObject.totalVolume) | volumeFilter
              }}</span
            >
            <br />
            <!--<span>止损点: 80%</span>-->
          </div>
        </div>
        <div class="card-content-l2">
          <div>
            <p class="detail-title">
              <span class="align-middle">
                总卡数 <br />
                {{ content.totalCount }}
              </span>
              <span class="align-middle">
                入池卡数(接口) <br />
                {{
                  content.enterPoolCount +
                  '(' +
                  Math.ceil(volumeObject.groupTotalVolume / content.poolSpecification) +
                  ')'
                }}
              </span>
              <span class="align-middle">
                库存卡数 <br />
                {{ content.currentInventoryCount }}
              </span>
              <span class="align-middle">
                销卡卡数 <br />
                {{ content.currentRetiredCount }}
              </span>
            </p>
            <p class="detail-title">
              <span class="align-middle">
                收入 <br />
                {{ content.totalIncome.toFixed(2) }}
              </span>
              <span class="align-middle">
                实际成本 <br />
                {{ content.realCost.toFixed(2) }}
              </span>
              <span
                :class="[
                  'align-middle',
                  content.totalIncome - content.realCost < 0 ? 'red-bold-nomal' : ''
                ]"
              >
                毛利 <br />
                {{ (content.totalIncome - content.realCost).toFixed(2) }}
              </span>
              <span
                :class="[
                  'align-middle',
                  content.totalIncome - content.realCost < 0 ? 'red-bold-nomal' : ''
                ]"
              >
                毛利率 <br />
                {{
                  (content.totalIncome
                    ? ((content.totalIncome - content.realCost) / content.totalIncome) * 100
                    : 0
                  ).toFixed(2)
                }}
                %
              </span>
            </p>
          </div>
        </div>
        <div class="card-content-l3 margin-bottom-10 flex">
          <el-button size="mini" type="primary" class="flex1" @click="detail('system-pool-usage')"
            >用量数据</el-button
          >
          <el-button size="mini" type="primary" class="flex1" @click="detail('system-pool-card')"
            >卡片列表</el-button
          >
          <el-button
            size="mini"
            type="primary"
            class="flex1"
            @click="detail('system-pool-traffic-operation')"
            >流量运营</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable indent */
import echarts from 'echarts'

let colorSelect = (val) => {
  switch (val.name) {
    case '用户侧已使用':
      return '#f00009'
    case '用户侧剩余':
      return '#5ed68c'
    case '运营商侧已使用':
      return '#f00009'
    case '运营商侧剩余':
      return '#2c9cff'
    case '用户侧已使用-告警':
      return '#f00009'
    case '运营商侧已使用-告警':
      return '#f00009'
    case '用户侧已使用-超出':
      return '#f00009'
    case '运营商侧已使用-超出':
      return '#f00009'
  }
}
export default {
  name: 'pool-card',
  props: {
    content: {
      type: Object,
      required: true
    },
    signedCarrierList: {
      type: Array,
      default: () => {}
    },
    carrier: {
      type: String
    }
  },
  data() {
    return {
      signedCarrierName: ''
    }
  },
  computed: {
    // 存储所有流量值
    volumeObject() {
      let {
        oversellPackageVolume,
        oversellVolume,
        totalVolume,
        useVolume,
        userTotalVolume,
        groupTotalVolume,
        groupUseVolume,
        groupLeftVolume
      } = this.content
      return {
        consumed:
          groupTotalVolume !== 0
            ? Number(((groupUseVolume / groupTotalVolume) * 100).toFixed(2))
            : totalVolume !== 0
            ? Number(((useVolume / totalVolume) * 100).toFixed(2))
            : 0,
        totalVolume,
        useVolume,
        leftVolume: (totalVolume - useVolume).toFixed(3),
        oversellPackageVolume: (oversellPackageVolume + oversellVolume).toFixed(3),
        backConsumed:
          groupTotalVolume !== 0
            ? userTotalVolume !== 0
              ? Number(((groupUseVolume / userTotalVolume) * 100).toFixed(2))
              : 0
            : userTotalVolume !== 0
            ? Number(((useVolume / userTotalVolume) * 100).toFixed(2))
            : 0,
        backUseVolume: useVolume,
        backLeftVolume: (userTotalVolume - useVolume).toFixed(3),
        userTotalVolume,
        groupTotalVolume,
        groupUseVolume,
        groupLeftVolume
      }
    },
    // 全套餐？
    poolAll() {
      return this.content.poolSpecification === -1
    }
  },
  mounted() {
    this.signedCarrierName = this.getSignedCarrierName(this.content.signedCarrierId)
    if (this.volumeObject.totalVolume || this.volumeObject.groupTotalVolume) {
      // 变更数据定义
      var useValue = 0,
        leftValue = 0,
        backUseValue = 0,
        backLeftValue = 0
      if (this.volumeObject.groupTotalVolume) {
        useValue = this.volumeObject.groupUseVolume
        leftValue = this.volumeObject.groupLeftVolume
        backUseValue = this.volumeObject.groupUseVolume
        backLeftValue = this.volumeObject.userTotalVolume - this.volumeObject.groupUseVolume
      } else {
        useValue = this.volumeObject.useVolume
        leftValue = this.volumeObject.leftVolume
        backUseValue = this.volumeObject.useVolume
        backLeftValue = this.volumeObject.backLeftVolume
      }
      this.draw(useValue, leftValue, backUseValue, backLeftValue)
    }
  },
  methods: {
    clickPanel() {
      let content = this.content
      this.$emit('on-click-panel', content)
    },
    draw(useValue, leftValue, backUseValue, backLeftValue) {
      let data1 =
        leftValue < 0
          ? [
              { value: useValue.toFixed(3), name: '运营商侧已使用-超出' },
              { value: 0, name: '运营商侧剩余' }
            ]
          : this.volumeObject.consumed > 80
          ? [
              { value: useValue.toFixed(3), name: '运营商侧已使用-告警' },
              { value: leftValue, name: '运营商侧剩余' }
            ]
          : [
              { value: useValue.toFixed(3), name: '运营商侧已使用' },
              { value: leftValue, name: '运营商侧剩余' }
            ]
      let data2 =
        backLeftValue < 0
          ? [
              { value: backUseValue.toFixed(3), name: '用户侧已使用-超出' },
              { value: 0, name: '用户侧剩余' }
            ]
          : [
              { value: backUseValue.toFixed(3), name: '用户侧已使用' },
              { value: backLeftValue, name: '用户侧剩余' }
            ]
      let rdx = echarts.init(this.$refs.list)
      rdx.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br>{c}M ({d}%)',
          position: (point, params, dom, rect, size) => [point[0] + 10, point[1] + 10]
        },
        series: [
          {
            name: '运营商侧流量',
            type: 'pie',
            radius: ['78%', '100%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: colorSelect
              }
            },
            data: data1
          },
          {
            name: '用户侧使用情况',
            type: 'pie',
            radius: ['48%', '70%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: colorSelect
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: data2
          }
        ]
      })
    },
    detail(name) {
      this.$router.push({ name, query: { id: this.content.poolId, carrier: this.carrier } })
    },
    getSignedCarrierName(id) {
      for (let i = 0, j = this.signedCarrierList.length; i < j; i++) {
        if (this.signedCarrierList[i].id === id) {
          return this.signedCarrierList[i].name
        }
      }
      return ''
    }
  }
}
</script>
