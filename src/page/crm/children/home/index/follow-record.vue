<script>
/**
 * Create by zeter on 2019/12/2
 */
  import apis from '@/api/ajax'
  import moment from 'moment'
  import Enumerator from '@/constant/enums/crm-enum'
  import { mapState } from 'vuex'
  let firstDate = null
  export default {
    name: 'follow-record',
    props: {
      defaultSaleId: {
        type: String,
        default: ''
      },
      sellerList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        date: [moment().startOf('week').format('YYYY-MM-DD'), moment().endOf('week').format('YYYY-MM-DD')],
        time: new Date(),
        list: [],
        week: new Date(),
        seller: '',
        isFollowed: '',
        isShowExportDialog: false,
        exportDateRange: [],
        pickerOptions: {
          disabledDate(time) {
            const daySecond = 13 * 24 * 3600000
            if (firstDate) {
              return Math.abs(time.getTime() - firstDate.getTime()) > daySecond
            }
          },
          onPick(time) {
            firstDate = time.minDate || null
          }
        },
        page: {
          pageSize: 20,
          missionCount: 0,
          missionTotalPage: 0,
          missionPageIndex: 0,
          followCount: 0,
          followPageIndex: 0,
          followTotalPage: 0,
          followPageSize: 20
        },
        countInfo: {
          followed: 0,
          notFollowed: 0,
          missionFollowed: 0,
          missionNotFollowed: 0
        }
      }
    },
    computed: {
      ...mapState({
        missionStatus: state => state.overall.crmEnum.missionStatus
      }),
      followedCount() {
        return this.countInfo.followed + this.countInfo.missionFollowed
      },
      notFollowedCount() {
        return this.countInfo.notFollowed + this.countInfo.missionNotFollowed
      },
      user() {
        return this.$store.state.overall.user
      }
    },
    methods: {
      enterUser(item) {
        this.$router.push({ name: 'home-customer-detail', params: { customerId: item } })
      },
      async fetchFollow() {
        let { success, data: { followedCount, notFollowedCount, records, page } } = await apis.crm.followRecordGet({
          time: moment(this.time).format('YYYY-MM-DD'),
          saleId: this.seller,
          pageSize: this.page.pageSize,
          pageNo: this.page.followPageIndex || 1,
          isFollowed: this.isFollowed === '' ? null : this.isFollowed
        })
        if (!success) return false
        this.countInfo.followed = followedCount
        this.countInfo.notFollowed = notFollowedCount
        this.page.followCount = page.totalCount
        this.page.followTotalPage = Math.ceil(page.totalCount / page.pageSize)
        return records.map(e => {
          e.type = 'follow'
          e.status = false
          e.lastFollowTime = moment(e.lastFollowTime).format('YYYY-MM-DD HH:mm:ss')
          return e
        })
      },
      async fetchMission() {
        let { success, data: { followedCount, notFollowedCount, records, page } } = await apis.crm.missionRecordGet({
          time: moment(this.time).format('YYYY-MM-DD'),
          saleId: this.seller,
          pageSize: this.page.pageSize,
          pageNo: this.page.missionPageIndex,
          isFollowed: this.isFollowed === '' ? null : this.isFollowed
        })
        if (!success) return false
        this.countInfo.missionFollowed = followedCount
        this.countInfo.missionNotFollowed = notFollowedCount
        this.page.missionCount = page.totalCount
        this.page.missionTotalPage = Math.ceil(page.totalCount / page.pageSize)
        return records.map(e => {
          e.missionStatus = Enumerator.convert('missionStatus', e.missionStatus)
          e.type = 'mission'
          e.status = false
          e.lastFollowTime = moment(e.lastFollowTime).format('YYYY-MM-DD HH:mm:ss')
          return e
        })
      },
      handleWeekChange() {
        const weekStart = moment(this.week).startOf('week').format('YYYY-MM-DD')
        this.date = [
          weekStart,
          moment(this.week).endOf('week').format('YYYY-MM-DD')
        ]
        this.time = moment(weekStart).subtract(-1, 'days').format('YYYY-MM-DD')
      },
      async exportDetail() {
        if (this.exportDateRange.length !== 2 || !this.exportDateRange[0] || !this.exportDateRange[1]) {
          return this.$message({ type: 'error', message: '请选择时间范围' })
        }
        let { success, data } = await apis.crm.followRecordExport({
          startTime: moment(this.exportDateRange[0]).format('YYYY-MM-DD'),
          endTime: moment(this.exportDateRange[1]).format('YYYY-MM-DD')
        })
        if (!success) return false
        this.isShowExportDialog = false
        window.location.href = data.fileKey
      },
      handleDialogClose() {
        this.exportDateRange = []
      },
      enterMissionList() {
        this.$router.push({ name: 'home-mission' })
      },
      async resetLoad() {
        this.list = []
        this.page.missionCount = 0
        this.page.followCount = 0
        this.page.followPageIndex = 0
        this.page.missionPageIndex = 0
        this.load()
        this.fetchFollow()
      },
      async load() {
        const loadAddPageFollow = async(l) => {
          this.page.followPageIndex++
          let rep = await this.fetchFollow()
          return [...l, ...rep]
        }
        const loadAddPageMission = async(l) => {
          this.page.missionPageIndex++
          let rst = await this.fetchMission()
          return [...l, ...rst]
        }
        if (this.loading) return false
        this.loading = true
        let list = []
        const { missionPageIndex, followPageIndex, missionTotalPage, followTotalPage } = this.page
        if (missionPageIndex === 0) {
          list = await loadAddPageMission(list)
          if (this.page.missionCount < 20 && this.page.followPageIndex === 0) {
            list = await loadAddPageFollow(list)
          }
        } else if (this.page.missionPageIndex < missionTotalPage) {
          list = await loadAddPageMission(list)
        } else {
          if (followPageIndex === 0 || followTotalPage < this.page.followTotalPage) {
            list = await loadAddPageFollow(list)
          }
        }
        this.list = [...this.list, ...list]
        this.loading = false
      }
    },
    watch: {
      time(val) {
        this.time = val
        this.resetLoad()
      }
    },
    mounted() {
      if (this.sellerList.length === 1) {
        this.seller = this.sellerList[0].saleId
      }
      this.resetLoad()
    // document.querySelector('.el-calendar__header').style.display = 'none'
    }
  }
</script>

<template>
  <div class="record mr20">
    <el-card class="box-card">
      <div slot="header">
        <span>跟进提醒</span>
        <el-button style="float: right;" @click="enterMissionList" size="small"
        >任务列表</el-button
        >
      </div>
      <el-date-picker
        v-model="week"
        type="week"
        format="yyyy 第 WW 周"
        placeholder="选择周"
        :clearable="false"
        @change="handleWeekChange"
      >
      </el-date-picker>
      <el-select
        v-model="isFollowed"
        placeholder="选择根据状态"
        clearable
        @change="resetLoad"
      >
        <el-option :value="true" label="已跟进">已跟进</el-option>
        <el-option :value="false" label="未跟进">未跟进</el-option>
      </el-select>
      <el-select
        v-model="seller"
        placeholder="请选择销售"
        @change="resetLoad"
        clearable
        :disabled="sellerList.length === 1"
      >
        <el-option
          v-for="item in sellerList"
          :key="item.saleId"
          :value="item.saleId"
          :label="item.realName"
        >
        </el-option>
      </el-select>
      <el-button
        style="float: right;"
        @click="isShowExportDialog = true"
        type="text"
      >导出明细</el-button
      >
      <el-calendar :range="date" :first-day-of-week="7" v-model="time">
        <template slot="dateCell" slot-scope="{ date, data }">
          <p :class="data.isSelected ? 'is-selected' : ''" class="tac">
            {{
              data.day
                .split("-")
                .slice(1)
                .join("-")
            }}
          </p>
          <div v-if="data.isSelected" class="count-statistic">
            <p>
              <span>未跟进数：</span><span>{{ notFollowedCount }}</span>
            </p>
            <p>
              <span>已跟进数：</span><span>{{ followedCount }}</span>
            </p>
          </div>
        </template>
      </el-calendar>
      <div
        class="block"
        v-infinite-scroll="load"
        :infinite-scroll-distance="500"
        :infinite-scroll-delay="300"
      >
        <el-timeline>
          <el-timeline-item
            :timestamp="`任务时间范围:${item.startTime} - ${item.endTime}`"
            placement="top"
            v-for="item in list"
            :key="item.id + item.lastFollowTime"
            v-if="item.type === 'mission'"
          >
            <el-card>
              <div
                @click="item.status = !item.status"
                class="pt5 pb5 cursor-pointer"
              >
                <h3>
                  {{ item.company }}({{ item.orgId }})
                  <el-tag type="warning" class="ml10">{{
                    item.saleName
                  }}</el-tag>
                  <el-tag type="info" v-if="item.missionStatus === '未完成'">{{ item.missionStatus }}</el-tag>
                  <el-tag type="primary" v-else>{{ item.missionStatus }}</el-tag>
                  <el-tag type="danger">任务提醒</el-tag>
                  <el-button
                    class="float-right"
                    size="mini"
                    @click="enterUser(item.customId)"
                  >更新用户状态</el-button
                  >
                </h3>
                <template v-if="item.status">
                  <p><span>任务名称：</span> {{ item.missionName }}</p>
                  <p>
                    <span>任务类型：</span>
                    <span
                      v-crm-enum-extract="{
                        original: item.missionType,
                        category: 'missionType'
                      }"
                    ></span>
                  </p>
                  <p>
                    <span>任务跟进方式：</span
                    ><span
                      v-crm-enum-extract="{
                        original: item.requiredMethod,
                        category: 'followStyle'
                      }"
                    ></span>
                  </p>
                </template>
              </div>
            </el-card>
          </el-timeline-item>
          <el-timeline-item
            :timestamp="`上次跟进时间:${item.lastFollowTime}`"
            placement="top"
            :key="item.id + item.lastFollowTime"
            v-else
          >
            <el-card>
              <div
                @click="item.status = !item.status"
                class="pt5 pb5 cursor-pointer"
              >
                <h3>
                  {{ item.company }}({{ item.orgId }})
                  <el-tag type="warning" class="ml10">{{
                    item.saleName
                  }}</el-tag>
                  <el-tag type="primary" v-if="item.isFollowed">已跟进</el-tag>
                  <el-tag type="info" v-else>未跟进</el-tag>
                  <el-tag type="success">跟进提醒</el-tag>
                  <el-button
                    class="float-right"
                    size="mini"
                    @click="enterUser(item.id)"
                  >更新用户状态</el-button
                  >
                </h3>
                <template v-if="item.status">
                  <p><span>上次跟进人：</span> {{ item.lastFollowPeople }}</p>
                  <p><span>上次跟进内容：</span>{{ item.lastFollowNotice }}</p>
                  <p>
                    <span>本次跟进方式：</span>
                    <span
                      v-crm-enum-extract="{
                        original: item.method,
                        category: 'followStyle'
                      }"
                    >
                    </span>
                  </p>
                  <p>
                    <span>联系方式：</span><span>{{ item.mobile }}</span>
                  </p>
                  <p><span>本次跟进内容：</span>{{ item.followNotice }}</p>
                </template>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <div class="tac " v-if="list.length === notFollowedCount + followedCount">没有更多内容</div>
      </div>
    </el-card>
    <el-dialog
      title="时间范围选择"
      :visible.sync="isShowExportDialog"
      width="500px"
      :show-close="false"
      @close="handleDialogClose"
    >
      <p>选择相应的时间范围，不超过14天！</p>
      <br />
      <span>活动时间：</span>
      <el-date-picker
        v-model="exportDateRange"
        type="daterange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowExportDialog = false">取 消</el-button>
        <el-button type="primary" @click="exportDetail">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.record {
  .block {
    height: 50vh;
    overflow-y: auto;
  }

  .el-calendar__header {
    display: none;
  }

  .count-statistic {
    font-size: 13px;
    margin-top: 10px;
    text-align: center;
    p {
      display: flex;
      span {
        &:first-child {
          min-width: 70px;
          text-align: right;
        }
      }
    }
  }
}
</style>
