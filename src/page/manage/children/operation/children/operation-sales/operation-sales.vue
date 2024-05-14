<script>
/**
 * Create by zeter on 2017/7/19
 */
import column from './mixins/column'
import moment from 'moment'
import Download from '@/page/components/wh-download/wh-download'
import Trend from '@/page/manage/children/operation/children/operation-sales/components/trend.vue'

export default {
  components: { Trend },
  filters: {
    numberFixed(val) {
      return val ? Number((Number(val) / 10000).toFixed(2)).toLocaleString() : '0'
    },
    localString(val) {
      return val ? Number(val).toLocaleString() : '0'
    }
  },
  data() {
    return {
      showList: ['yoy', 'qoq'],
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }
        ],
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return +moment(time) > +moment().subtract(1, 'month')
        }
      },
      tableData: [],
      loading: false,
      detailLoading: false,
      column,
      dateValue: '',
      dateValueChoose: '',
      dateValueSetting: ''
    }
  },
  computed: {
    disabledNextDay() {
      return moment(this.dateValue).isSameOrAfter(new Date(), 'd')
    },
    disabledNextMonth() {
      return moment(this.dateValue).add(1, 'month').isAfter(new Date(), 'd')
    },
    disabledNextYear() {
      return moment(this.dateValue).add(1, 'year').isAfter(new Date(), 'd')
    },
    time() {
      if (this.dateValue === '') return moment().format('YYYY-MM-DD')
      return moment(this.dateValue).format('YYYY-MM-DD')
    }
  },
  created() {
    this.dateValueSetting = moment().subtract(1, 'month').format('YYYY-MM')
    this.dateValue = moment().format('YYYY-MM-DD')
    this.getList()
  },
  methods: {
    async quickDate(type, action) {
      this.dateValue = moment(this.dateValue)[action || 'add'](1, type)
      await this.getList()
    },
    async getList() {
      this.loading = true
      const { time } = this
      const MoMDate = moment(time).subtract(1, 'month').format('YYYY-MM-DD')
      const YoYDate = moment(time).subtract(1, 'year').format('YYYY-MM-DD')
      const preDate = moment(time).subtract(1, 'day').format('YYYY-MM-DD')
      const getData = this.jaxLib.sale.group
      const rst = await Promise.all([
        getData(time),
        getData(MoMDate),
        getData(YoYDate),
        getData(preDate)
      ])
      const [current, MoM, YoY, preDateData] = rst
      this.loading = false
      if (!current.success) return false
      this.tableData = current.data
        ? current.data.map((item, index) => {
            item.show = false
            item.list = []
            return {
              ...item,
              yoy: YoY.data[index],
              mom: MoM.data[index],
              preDate: preDateData.data[index],
              preYDate: YoY.data[index]
            }
          })
        : []
    },
    changDate() {
      this.getList()
    },
    // 导出
    async outFile() {
      if (!this.dateValueChoose || !this.dateValueChoose.length) {
        this.$message.warning('请选择日期')
        return false
      }
      const { success, data } = await this.jaxLib.sale.downloadFile(
        moment(this.dateValueChoose[0]).format('YYYY-MM-DD'),
        moment(this.dateValueChoose[1]).format('YYYY-MM-DD')
      )
      if (!success) return false
      await Download({ ...data })
    },
    // 其他导出
    async outSaleFile(val) {
      const ajaxMap = {
        buycard: 'downSalerBuyCardCount',
        renew: 'downSalerRenewCount',
        other: 'downOtherOtherCount'
      }
      if (!this.dateValueSetting) {
        this.$message.warning('请选择日期')
        return false
      }
      const { success, data } = await this.jaxLib.sale[ajaxMap[val]]({
        month: moment(this.dateValueSetting).format('YYYY-MM')
      })
      if (!success) return false
      await Download({ ...data })
    },
    async expandEvent(row, expanded) {
      if (!expanded.length) return
      if (row.show || !row.groupCode) return
      // let rst = await this.jaxLib.sale.groupDetail({ date: this.time, name: row.groupCode })
      const { time } = this
      this.detailLoading = true

      const getData = async (time) =>
        await this.jaxLib.sale.groupDetail({ date: time, name: row.groupCode })
      const MoMDate = moment(time).subtract(1, 'month').format('YYYY-MM-DD')
      const YoYDate = moment(time).subtract(1, 'year').format('YYYY-MM-DD')
      const preDate = moment(time).subtract(1, 'day').format('YYYY-MM-DD')
      const rst = await Promise.all([
        getData(time),
        getData(MoMDate),
        getData(YoYDate),
        getData(preDate)
      ])
      this.detailLoading = false
      const [current, MoM, YoY, preDateData] = rst
      if (!current.success) return false
      const list = current.data
        ? current.data.map((item, index) => {
            return {
              ...item,
              yoy: YoY.data.find((y) => y.salesName === item.salesName) || {},
              mom: MoM.data.find((y) => y.salesName === item.salesName) || {},
              preDate: preDateData.data.find((y) => y.salesName === item.salesName) || {},
              preYDate: YoY.data.find((y) => y.salesName === item.salesName) || {}
            }
          })
        : []
      this.$set(row, 'list', list)
      row.show = true
    }
  }
}
</script>

<template>
  <div class="sale-data">
    <div class="wh-app-wrap">
      <div class="wh-title--out">
        <h2 class="wh-title">销售报表</h2>
      </div>
      <el-popover ref="popover" placement="bottom" width="250" trigger="click">
        <el-date-picker
          v-model="dateValueChoose"
          type="daterange"
          placeholder="选择日期范围"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
        <br />
        <el-button class="setOutFile" @click="outFile">确定导出</el-button>
      </el-popover>
      <el-popover ref="popover2" placement="bottom" width="350" trigger="click">
        <el-date-picker
          v-model="dateValueSetting"
          type="month"
          placeholder="选择月份"
          :picker-options="pickerOptions2"
        >
        </el-date-picker>
        <br />
        <el-button class="setOutFile" @click="outSaleFile('buycard')">导出购卡订单</el-button>
        <el-button class="setOutFile" @click="outSaleFile('renew')">导出续费订单</el-button>
        <el-button class="setOutFile" @click="outSaleFile('other')">其他</el-button>
      </el-popover>
      <div class="wh-tool">
        <el-button-group>
          <el-button @click="quickDate('year', 'subtract')">&lt;&lt;&lt;</el-button>
          <el-button @click="quickDate('month', 'subtract')">&lt;&lt;</el-button>
          <el-button @click="quickDate('day', 'subtract')">&lt;</el-button>
        </el-button-group>
        <el-date-picker
          v-model="dateValue"
          style="width: 140px"
          type="date"
          placeholder="选择日期"
          :clearable="false"
          :picker-options="pickerOptions"
          @change="changDate"
        />
        <el-button-group>
          <el-button :disabled="disabledNextDay" @click="quickDate('day')">&gt;</el-button>
          <el-button :disabled="disabledNextMonth" @click="quickDate('month')">&gt;&gt;</el-button>
          <el-button :disabled="disabledNextYear" @click="quickDate('year')"
            >&gt;&gt;&gt;</el-button
          >
        </el-button-group>
        <el-checkbox-group v-model="showList" style="display: inline-block; margin-left: 20px">
          <el-checkbox label="yoy">同比</el-checkbox>
          <el-checkbox label="qoq">环比</el-checkbox>
        </el-checkbox-group>
        <el-button v-popover:popover class="float-right ml10">导出</el-button>
        <el-button v-popover:popover2 class="float-right">导出销售业绩</el-button>
      </div>
      <el-table
        v-loading="loading"
        stripe
        :data="tableData"
        style="width: 100%"
        class="sale__table"
        :lazy="true"
        height="calc(100vh - 220px)"
        @expand-change="expandEvent"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              stripe
              v-loading="detailLoading"
              :data="props.row.list"
              style="width: 100%"
              :resizable="false"
              class="sale__table--inner"
              row-class-name="table__inner--style"
            >
              <el-table-column width="48"> </el-table-column>
              <el-table-column prop="salesRealName" label="姓名" width="180" />
              <el-table-column label="当日新购卡数" prop="buyCountDay" min-width="120">
                <template #default="{ row }">
                  {{ row.buyCountDay | localString }}
                  <trend
                    :show-list="showList"
                    :current="row.buyCountDay"
                    :qoq="row.preDate.buyCountDay"
                    :yoy="row.preYDate.buyCountDay"
                  />
                </template>
              </el-table-column>
              <el-table-column label="当月累计购卡数" prop="buyCountMonth" min-width="120">
                <template #default="{ row }"
                  >{{ row.buyCountMonth | localString }}
                  <trend
                    :show-list="showList"
                    :current="row.buyCountMonth"
                    :qoq="row.mom.buyCountMonth"
                    :yoy="row.yoy.buyCountMonth"
                  />
                </template>
              </el-table-column>
              <el-table-column label="当日新增购卡金额" prop="buyMoneyDay" min-width="120">
                <template #default="{ row }"
                  >{{ row.buyMoneyDay | numberFixed }}
                  <trend
                    :show-list="showList"
                    is-money
                    :current="row.buyMoneyDay"
                    :qoq="row.preDate.buyMoneyDay"
                    :yoy="row.preYDate.buyMoneyDay"
                  />
                </template>
              </el-table-column>
              <el-table-column label="当月累计购卡金额" prop="buyMoneyMonth" min-width="120">
                <template #default="{ row }"
                  >{{ row.buyMoneyMonth | numberFixed }}
                  <trend
                    :show-list="showList"
                    is-money
                    :current="row.buyMoneyMonth"
                    :qoq="row.mom.buyMoneyMonth"
                    :yoy="row.yoy.buyMoneyMonth"
                  />
                </template>
              </el-table-column>
              <el-table-column label="当日续费金额" prop="rechargeMoneyDay" min-width="120">
                <template #default="{ row }"
                  >{{ row.rechargeMoneyDay | numberFixed }}
                  <trend
                    :show-list="showList"
                    is-money
                    :current="row.rechargeMoneyDay"
                    :qoq="row.preDate.rechargeMoneyDay"
                    :yoy="row.preYDate.rechargeMoneyDay"
                  />
                </template>
              </el-table-column>
              <el-table-column label="当月累计续费金额" prop="rechargeMoneyMonth" min-width="120">
                <template #default="{ row }"
                  >{{ row.rechargeMoneyMonth | numberFixed }}
                  <trend
                    :show-list="showList"
                    is-money
                    :current="row.rechargeMoneyMonth"
                    :qoq="row.mom.rechargeMoneyMonth"
                    :yoy="row.yoy.rechargeMoneyMonth"
                /></template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="销售组" prop="groupName" width="180" />
        <el-table-column prop="buyCountDay" min-width="120">
          <template slot="header"
            >当日新购卡数
            <el-tooltip effect="dark" placement="bottom">
              <template slot="content">
                <div>同比：(当日数据 - 去年当日数据) / 去年当日数据 * 100%</div>
                <div>环比：(当日数据 - 昨日数据) / 昨日数据 * 100%</div>
              </template>
              <i class="el-icon-question" />
            </el-tooltip>
          </template>
          <template #default="{ row }">
            {{ row.buyCountDay | localString }}
            <trend
              :show-list="showList"
              :current="row.buyCountDay"
              :qoq="row.preDate.buyCountDay"
              :yoy="row.preYDate.buyCountDay"
            />
          </template>
        </el-table-column>
        <el-table-column prop="buyCountMonth" min-width="120">
          <template slot="header"
            >当月累计购卡数
            <el-tooltip effect="dark" placement="bottom">
              <template slot="content">
                <div>同比：(当月数据 - 去年当月数据) / 去年当月数据 * 100%</div>
                <div>环比：(当月数据 - 上月数据) / 上月数据 * 100%</div>
              </template>
              <i class="el-icon-question" />
            </el-tooltip>
          </template>
          <template #default="{ row }"
            >{{ row.buyCountMonth | localString }}
            <trend
              :show-list="showList"
              :current="row.buyCountMonth"
              :qoq="row.mom.buyCountMonth"
              :yoy="row.yoy.buyCountMonth"
            />
          </template>
        </el-table-column>
        <el-table-column label="当日新增购卡金额" prop="buyMoneyDay" min-width="120">
          <template #default="{ row }"
            >{{ row.buyMoneyDay | numberFixed }}
            <trend
              :show-list="showList"
              is-money
              :current="row.buyMoneyDay"
              :qoq="row.preDate.buyMoneyDay"
              :yoy="row.preYDate.buyMoneyDay"
            />
          </template>
        </el-table-column>
        <el-table-column label="当月累计购卡金额" prop="buyMoneyMonth" min-width="120">
          <template #default="{ row }"
            >{{ row.buyMoneyMonth | numberFixed }}
            <trend
              :show-list="showList"
              is-money
              :current="row.buyMoneyMonth"
              :qoq="row.mom.buyMoneyMonth"
              :yoy="row.yoy.buyMoneyMonth"
            />
          </template>
        </el-table-column>
        <el-table-column label="当日续费金额" prop="rechargeMoneyDay" min-width="120">
          <template #default="{ row }"
            >{{ row.rechargeMoneyDay | numberFixed }}
            <trend
              :show-list="showList"
              is-money
              :current="row.rechargeMoneyDay"
              :qoq="row.preDate.rechargeMoneyDay"
              :yoy="row.preYDate.rechargeMoneyDay"
            />
          </template>
        </el-table-column>
        <el-table-column label="当月累计续费金额" prop="rechargeMoneyMonth" min-width="120">
          <template #default="{ row }"
            >{{ row.rechargeMoneyMonth | numberFixed }}
            <trend
              :show-list="showList"
              is-money
              :current="row.rechargeMoneyMonth"
              :qoq="row.mom.rechargeMoneyMonth"
              :yoy="row.yoy.rechargeMoneyMonth"
          /></template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="scss">
.sale-data {
  .el-table__body-wrapper {
    overflow-y: auto !important;
  }
}
</style>
