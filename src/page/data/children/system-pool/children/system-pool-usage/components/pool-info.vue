<script>
/**
   * Create by zeter on 2017/11/14
   */
  import echarts from 'echarts'
  import moment from 'moment'
  import volumeFormat from '@/global/filters/volume-format'

  export default {
    data() {
      return {}
    },
    props: {
      pool: {
        required: true,
        type: Object
      }
    },
    computed: {
      // 是否是全套餐
      isAllPage() {
        return this.pool.poolSpecification === -1
      }
    },
    methods: {
      // 获取用量数据
      drawDetail(data) {
        let myChart = echarts.init(document.getElementById('poolDetail'))
        myChart.setOption(
          {
            title: {
              text: '本月每日流量消耗详情'
            },
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              },
              formatter: (e) => `${e[0].axisValueLabel}<br>${volumeFormat(e[0].data)}`
            },
            xAxis: [
              {
                type: 'category',
                data: data.map(i => i.day),
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                axisLabel: {
                  formatter: (value, index) => volumeFormat(value)
                }
              }
            ],
            series: [
              {
                name: '当日流量消耗',
                type: 'bar',
                barWidth: '60%',
                data: data.map(i => i.usage),
                label: {
                  normal: {
                    formatter: '{b}: {c}'
                  }
                }
              }
            ]
          })
      },
      // 获取 日用量数据
      // 如果是联通的在本月1-26号=>标记为2取上月27-今天 ，补到本月26日
      // 如果是联通的在本月27-底=>标记为3取本月27-今天，补到下月26日
      // 其他的取1号-今天=>标记为1 ，补到本月月底
      async getDailyUsage() {
        let dateOption = {
          // eslint-disable-next-line new-cap
          startDate: new moment(),
          // eslint-disable-next-line new-cap
          endDate: new moment(),
          flagType: 1
        }
        if (this.pool.carrier === 'unicom') {
          // eslint-disable-next-line new-cap
          if (new moment().isBetween(moment().set('date', 1), moment().set('date', 26))) {
            dateOption.startDate = moment().subtract(1, 'month').set('date', 27)
            dateOption.flagType = 2
          } else {
            dateOption.startDate = moment().set('date', 27)
            dateOption.flagType = 3
          }
        } else {
          dateOption.startDate = moment().set('date', 1)
        }
        let rst = await this.jaxLib.pool.dailyVolume({
          startDay: dateOption.startDate.format('YYYY-MM-DD'),
          endDay: dateOption.endDate.format('YYYY-MM-DD'),
          poolId: this.$route.query.id
        })
        if (!rst.success) return false
        let dataList = rst.data.list.map(e => ({ day: e.day, usage: (e.usage / 1024).toFixed(3) }))
        let bottomDate = 0
        if (dateOption.flagType === 2) {
          bottomDate = moment().set('date', 27).diff(dateOption.endDate, 'day')
        } else if (dateOption.flagType === 3) {
          bottomDate = moment().add(1, 'month').set('date', 27).diff(dateOption.endDate, 'day')
        } else {
          bottomDate = moment().endOf('month').diff(dateOption.endDate, 'day')
        }
        for (let i = 0; i <= bottomDate; i++) {
          dataList.push({
            day: moment().add(i, 'days').format('YYYY-MM-DD'), usage: 0
          })
        }
        this.drawDetail(dataList)
      }
    },
    mounted() {
      this.getDailyUsage()
    }
  }
</script>

<template>
  <div class="systemPoolUsage__info">
    <div>
      <div class="info__volume">
        <p>
          <span class="info__volume--total"> {{!isAllPage ? '本月单卡累加用量' : '本月流量使用' }} </span>
          <span class="info__volume--number">
            {{pool.useVolume | volumeFilter}} <span v-if="!isAllPage">/ {{pool.totalVolume | volumeFilter}}</span>
          </span>
          <span class="info__volume--other" v-if="!isAllPage">
            剩余{{(pool.totalVolume - pool.useVolume) | volumeFilter}}
            使用率: <template v-if="pool.totalVolume">{{pool.useVolume / pool.totalVolume * 100 | numberFilter(2)}}%</template>
            <template v-else>-</template>
          </span>
        </p>
         <p v-if="!isAllPage && (pool.groupUseVolume || pool.groupTotalVolume)">
          <span class="info__volume--total">本月流量池接口用量 </span>
          <span class="info__volume--number">
            {{pool.groupUseVolume | volumeFilter}} <span>/ {{pool.groupTotalVolume | volumeFilter}}</span>
          </span>
          <span class="info__volume--other">
            剩余{{(pool.groupTotalVolume - pool.groupUseVolume) | volumeFilter}}
            使用率: <template v-if="pool.groupTotalVolume">{{pool.groupUseVolume / pool.groupTotalVolume * 100 | numberFilter(2)}}%</template>
            <template v-else>-</template>
          </span>
        </p>
      </div>
      <table class="info__card">
        <thead>
          <tr>
            <td></td>
            <td>
              总卡数
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                content="总卡数=入池卡数+库存卡数-库存已激活卡数+销卡卡数+出库未激活卡数">
                <i class="el-icon-question" slot="reference"></i>
              </el-popover>
            </td>
            <td>
              计费卡数
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                content="运营商侧需收费卡数">
                <i class="el-icon-question" slot="reference"></i>
              </el-popover>
            </td>
            <td>
              入池卡数(接口)
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                content="加入当前流量池，并共享总量的卡数">
                <i class="el-icon-question" slot="reference"></i>
              </el-popover>
            </td>
            <td>
              库存卡数
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                content="SIMBOSS侧所有未出库卡的卡数（不包括已销卡的卡）">
                <i class="el-icon-question" slot="reference"></i>
              </el-popover>
            </td>
            <td>
              库存已激活卡数
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                content="SIMBOSS侧未出库，但运营商状态为激活的卡数">
                <i class="el-icon-question" slot="reference"></i>
              </el-popover>
            </td>
            <td>
              锁卡卡数
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                content="SIMBOSS侧标记为锁卡的卡数">
                <i class="el-icon-question" slot="reference"></i>
              </el-popover>
            </td>
            <td>
              出库未激活卡数
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                content="SIMBOSS侧已出库，但运营商当月未激活的卡数（不包括已销卡的卡）">
                <i class="el-icon-question" slot="reference"></i>
              </el-popover>
            </td>
            <td>测试期</td>
            <td>沉默期</td>
            <td>激活</td>
            <td>停卡</td>
            <td>销卡</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>运营商</td>
            <td>{{ pool.carrierTotalCount}}</td>
            <td>{{ pool.carrierChargeCount }}</td>
            <td>{{ pool.enterPoolCount + '(' + Math.ceil(pool.groupTotalVolume / pool.poolSpecification) + ')' }}</td>
            <td>{{ pool.carrierInventoryCount }}</td>
            <td>{{ pool.inventoryActiveCount }}</td>
            <td>{{ pool.lockedCount }}</td>
            <td>{{ pool.deliveryNotActivatedCount }}</td>
            <td>{{ pool.carrierTestingCount }}</td>
            <td>{{ pool.carrierSilenceCount }}</td>
            <td>{{ pool.carrierActivationCount }}</td>
            <td>{{ pool.carrierDeactivationCount }}</td>
            <td>{{ pool.carrierRetiredCount}}</td>
          </tr>
          <tr>
            <td>客户</td>
            <td>{{ pool.userTotalCount }}</td>
            <td>{{ pool.userChargeCount }}</td>
            <td> - </td>
            <td>{{ pool.userInventoryCount }}</td>
            <td> - </td>
            <td> - </td>
            <td> - </td>
            <td>{{ pool.userTestingCount }}</td>
            <td>{{ pool.userSilenceCount }}</td>
            <td>{{ pool.userActivationCount }}</td>
            <td>{{ pool.userDeactivatoinCount }}</td>
            <td>{{ pool.userRetiredCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="info__detail">
      <div id="poolDetail" class="info__detail--canvas"></div>
      <!--<el-button  type="primary" size="mini" class="info__detail&#45;&#45;transfer">源数据</el-button>-->
      <div class="info__detail--table"></div>
    </div>
  </div>
</template>
