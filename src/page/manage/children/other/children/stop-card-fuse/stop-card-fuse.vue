<template>
  <div class="test-card wh__warp stop-card-fuse">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="handleBatchClose">批量关闭</el-button>
    </div>
    <el-row :gutter="20">
      <el-col v-for="(item, key) in flowStatusData" :key="key" :span="8">
        <el-card class="stop-card-fuse__item">
          <div class="wh__header">
            <h2 class="wh-title">
              {{ flowStatusTypeCNMap[key] }}
              <el-button v-if="key === 'stopCardFuse'" type="text" @click="viewFuseDetail"
                >查看详情</el-button
              >
            </h2>
          </div>
          <div>
            <div
              v-for="(status, statusKey) in item"
              :key="statusKey"
              class="stop-card-fuse__item__btn"
            >
              <span style="display: inline-block; width: 100px">
                {{ flowStatusCNMap[statusKey] }}
              </span>
              <el-switch
                style="margin-left: 10px"
                :value="status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="handleFlowClose(key, statusKey, status)"
              >
              </el-switch>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <detail-dialog ref="detailDialog" />
  </div>
</template>

<script>
import DetailDialog from './components/detail-dialog'
export default {
  name: 'OperationLog',
  components: {
    DetailDialog
  },
  data() {
    return {
      flowStatusCNMap: {
        CMCC: '移动',
        UNICOM: '联通',
        CHINANET: '电信',
        VPDN: 'VPDN',
        EXECUTE: '停卡执行',
        INSERT: '停卡插入'
      },
      flowStatusTypeCNMap: {
        stopCardFuse: '停卡熔断',
        LoganDailyUsageSyncFuse: '日用量同步熔断',
        LoganMonthlyUsageApiFuse: '影子库月用量API熔断',
        LoganMonthlyUsagePushFuse: '影子库流量推送熔断',
        LoganUsageSyncFuse: '影子库流量同步熔断',
        SimbossTestPeriodFuse: '测试期用量同步'
      },
      flowStatusData: {
        // stopCardFuse: {
        //   INSERT: true,
        //   EXECUTE: true
        // },
        // LoganDailyUsageSyncFuse: {
        //   //日用量熔断
        //   CMCC: true,
        //   UNICOM: true,
        //   CHINANET: true,
        //   VPDN: true
        // },
        // LoganMonthlyUsageApiFuse: {
        //   //影子库月用量API熔断
        //   CMCC: true,
        //   UNICOM: true,
        //   CHINANET: true,
        //   VPDN: true
        // },
        // LoganMonthlyUsagePushFuse: {
        //   //影子库流量推送熔断
        //   CMCC: true,
        //   UNICOM: true,
        //   CHINANET: true,
        //   VPDN: true
        // },
        // LoganUsageSyncFuse: {
        //   //影子库流量同步熔断
        //   CMCC: true,
        //   UNICOM: true,
        //   CHINANET: true,
        //   VPDN: true
        // },
        // SimbossTestPeriodFuse: {
        //   //测试期用量同步
        //   CMCC: true,
        //   UNICOM: true,
        //   CHINANET: true,
        //   VPDN: true
        // }
      },
      activeTab: 'carrier',
      exportLoading: false,
      tableData: [],
      loading: false,
      CLOSE_TYPE_MAP: {
        EXECUTE: '停卡执行熔断',
        INSERT: '停卡插入熔断'
      },
      EXECUTE: false,
      INSERT: false
    }
  },
  async created() {
    this.getAllStatus().then()
  },
  methods: {
    async handleBatchClose() {
      const batchTarget = []
      Object.keys(this.flowStatusData).forEach((type) => {
        Object.keys(this.flowStatusData[type]).forEach((category) => {
          if (this.flowStatusData[type][category]) {
            batchTarget.push({
              category,
              type
            })
          }
        })
      })
      if (batchTarget.length === 0) {
        this.$message.error('当前无可关闭熔断')
        return
      }
      this.$confirm(`确定执行批量关闭操作`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        dangerouslyUseHTMLString: true
      })
        .then(async () => {
          this.loading = true

          const batchtargetPromises = batchTarget.map((target) => {
            return new Promise(
              target.type === 'stopCardFuse'
                ? async (resolve) => {
                    const res = await this.jaxLib.stopCardFuse.updateDeactivedCardFuse({
                      type: target.category,
                      open: false
                    })
                    resolve(res.success)
                  }
                : async (resolve) => {
                    const res = await this.jaxLib.stopCardFuse.fuse({
                      type: target.type,
                      category: target.category,
                      fuse: false
                    })
                    resolve(res.success)
                  }
            )
          })
          const res = await Promise.all(batchtargetPromises)
          if (res && res.every((item) => !!item)) {
            this.$message.success('批量关闭成功')
          } else {
            this.$message.success(`批量关闭完成，失败${res.filter((item) => !item).length}个`)
          }
          await this.getAllStatus()
        })
        .catch(() => {})
        .finally(() => (this.loading = false))
    },
    handleFlowClose(type, category, fuse) {
      if (type === 'stopCardFuse') {
        this.handleClose(category, fuse)
        return
      }
      const action = fuse
        ? `<span style="color:#F56C6C">关闭</span>`
        : `<span style="color:#67C23A">开启</span>`
      this.$confirm(
        `确定${action}【${this.flowStatusCNMap[category]}】【${this.flowStatusTypeCNMap[type]}】?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
          dangerouslyUseHTMLString: true
        }
      )
        .then(async () => {
          this.loading = true
          const data = {
            type,
            category,
            fuse: !fuse
          }
          const { success } = await this.jaxLib.stopCardFuse.fuse(data)
          if (success) {
            this.$message.success(`操作成功`)
            this.getAllStatus().then()
          }
        })
        .finally(() => {
          this.loading = false
        })
        .catch(() => {})
    },
    viewFuseDetail() {
      this.$refs.detailDialog.open()
    },
    async getStatus(type) {
      const { success, data } = await this.jaxLib.stopCardFuse.deactivedCardFuseStatus(type)
      if (success) {
        return {
          stopCardFuse: data
        }
      }
      return null
    },
    async getFlowStatus() {
      const { success, data } = await this.jaxLib.stopCardFuse.listFuseStatus()
      if (success) {
        return data
      }
      return null
    },
    async getAllStatus() {
      const data = await Promise.all([this.getStatus(), this.getFlowStatus()])
      this.flowStatusData = {}
      data.forEach((item) => {
        this.flowStatusData = {
          ...this.flowStatusData,
          ...(item || {})
        }
      })
      console.log('🎸 szy_193 stop-card-fuse.vue 👉', this.flowStatusData)
    },
    handleClose(type, fuse) {
      const action = fuse
        ? `<span style="color:#F56C6C">关闭</span>`
        : `<span style="color:#67C23A">开启</span>`
      this.$confirm(`确定${action}【${this.CLOSE_TYPE_MAP[type]}】?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        dangerouslyUseHTMLString: true
      })
        .then(async () => {
          this.loading = true
          const { success } = await this.jaxLib.stopCardFuse.updateDeactivedCardFuse({
            type,
            open: !fuse
          })
          if (success) {
            this.$message.success(`操作成功`)
            await this.getAllStatus()
          }
        })
        .finally(() => {
          this.loading = false
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.stop-card-fuse {
  &__item {
    margin-bottom: 20px;
    min-height: 225px;
    &__btn {
      margin-top: 15px;
    }
  }
}
</style>
