<script>
  import apis from '@/api/ajax'
  import moment from 'moment'

  export default {
    props: {
      macAddr: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        search: {
          date: [],
          orgId: '',
          type: '',
          macAddr: ''
        },
        isSearchLoading: false,
        customerList: [],
        logList: [],
        typeMap: {},
        counts: [],
        page: {
          total: 0,
          pageIndex: 0,
          pageSize: this.macAddr ? 10 : 30
        }
      }
    },
    async created() {
      this.search.macAddr = this.macAddr
      await this.getTypeList()
      await this.getList()
    },
    methods: {
      async customerSearch(search) {
        const { success, data } = await apis.cpe.getClientList({ search })
        if (!success) {
          return false
        }
        this.customerList = data
      },
      async reMatch() {
        const { success, data } = await apis.cpe.monitorLogRematch()
        if (!success) {
          return false
        }
        this.$message({ type: 'success', message: data })
        await this.getList()
      },
      async getList(pageIndex = 1) {
        const params = { ...this.search }
        if (params.date && params.date.length && params.date[0] && params.date[1]) {
          params.startTime = moment(params.date[0]).format('YYYY-MM-DD HH:mm:ss')
          params.endTime = moment(params.date[1]).format('YYYY-MM-DD HH:mm:ss')
        }
        delete params.date
        Object.keys(params).forEach(key => {
          if (!params[key]) {
            delete params[key]
          }
        })
        const { success, data: { logs, page, counts } } = await apis.cpe.getMonitorLogList({
          pageIndex,
          pageSize: this.page.pageSize,
          ...params
        })
        if (!success) {
          return false
        }
        this.counts = counts
        this.logList = logs.map(item => ({
          ...item,
          type: this.typeMap[item.type],
          syncTime: moment(item.syncTime).format('YYYY-MM-DD HH:mm:ss')
        }))
        this.page = { ...this.page, pageIndex, total: page.allCount }
      },
      async getTypeList() {
        const { success, data } = await apis.cpe.getMonitorLogType()
        if (!success) {
          return false
        }
        this.typeMap = data
      },
      backList() {
        window.history.go(-1)
      }
    }
  }
</script>

<template>
  <div class="monitor-logs">
    <div class="wh__warp">
      <div class="wh__header" v-if="!macAddr">
        <h2 class="wh__header--title">设备日志</h2>
        <span v-if="!$route.query.enter" class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div class="wh__tools--mix">
        <el-date-picker
          v-model="search.date"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          type="datetimerange"
          @change="getList(1)"
        >
        </el-date-picker>
        <template v-if="!macAddr">
          <el-select
              v-model="search.orgId"
              filterable
              clearable
              remote
              reserve-keyword
              placeholder="组织id/客户名称"
              :remote-method="customerSearch"
              :loading="isSearchLoading">
            <el-option
                v-for="item in customerList"
                :key="item.orgId"
                :label="item.orgName + '(' + item.orgId + ')'"
                :value="item.orgId">
            </el-option>
          </el-select>
          <el-select placeholder="日志类型" v-model="search.type" clearable>
            <el-option v-for="(item, key) in typeMap" :key="key" :label="item" :value="key"></el-option>
          </el-select>
          <el-input v-model="search.macAddr" placeholder="Mac地址/设备名称" style="width: 220px;"></el-input>
          <el-button type="primary" @click="getList(1)">搜索</el-button>
        </template>
      </div>
      <div class="wh__body">
        <el-tabs>
          <el-tab-pane label="汇总">
            <div class="statistic" v-if="counts.length">
              <div class="statistic-item" v-for="item in counts" :key="item.type">
                <div
                  v-if="item.type === 'UNKNOW'"
                  class="title title--link"
                  @click="reMatch"
                >
                  {{typeMap[item.type]}}
                </div>
                <div v-else class="title">{{typeMap[item.type]}}</div>
                <div class="value">{{item.count}}</div>
              </div>
              <div class="statistic-item statistic-item--empty"></div>
              <div class="statistic-item statistic-item--empty"></div>
              <div class="statistic-item statistic-item--empty"></div>
              <div class="statistic-item statistic-item--empty"></div>
              <div class="statistic-item statistic-item--empty"></div>
            </div>
            <div class="statistic-empty" v-else>暂无数据</div>
          </el-tab-pane>
          <el-tab-pane label="明细">
            <el-table :data="logList">
              <el-table-column label="设备" prop="macAddr"></el-table-column>
              <el-table-column label="类型" prop="type"></el-table-column>
              <el-table-column label="内容" prop="content"></el-table-column>
              <el-table-column label="时间" prop="syncTime"></el-table-column>
            </el-table>
            <div class="wh__body--page">
              <el-pagination
                @current-change="getList"
                :current-page="page.pageIndex"
                :page-size="page.pageSize"
                layout="total, prev, pager, next"
                :total="page.total"
                class="wh__body--page">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .monitor-logs {
    .statistic {
      display: flex;
      justify-content: space-between;
      flex-flow: wrap;
      padding-top: 20px;

      &-empty {
        text-align: center;
        margin-top: 50px;
      }

      &-item {
        width: 18%;
        background-color: #fff;
        margin-bottom: 30px;
        padding: 25px 30px;

        &--empty {
          height: 0;
          padding: 0;
        }

        .title {
          color: rgba(0, 0, 0, .45);
          font-size: 16px;
          line-height: 36px;

          &--link {
            color: #1c8de0;
            cursor: pointer;
          }
        }

        .value {
          font-size: 24px;
          line-height: 36px;
        }
      }
    }
  }
</style>
