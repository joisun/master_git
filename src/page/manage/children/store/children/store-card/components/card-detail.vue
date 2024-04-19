<template>
  <div class="card-manage__table--expand card-manage__detail">
    <div class="flex" v-if="processData > 1">
      <lifecycle-locked :content="content" :item="item" :stage="processData">
      </lifecycle-locked>
      <lifecycle-delivered @enterRouter="enterRouter" :content="content" :item="item" :stage="processData">
      </lifecycle-delivered>
      <lifecycle-testing :content="content" :item="item" :stage="processData">
      </lifecycle-testing>
      <lifecycle-level2 :content="content" :item="item" :stage="processData">
      </lifecycle-level2>
    </div>
    <div class="flex" v-if="processData > 5">
      <lifecycle-activation :content="content" :item="item" :stage="processData">
      </lifecycle-activation>
      <lifecycle-current :content="content" :item="item" :stage="processData">
      </lifecycle-current>
      <lifecycle-deactivation :content="content" :item="item" :stage="processData">
      </lifecycle-deactivation>
      <lifecycle-retired :content="content" :item="item" :stage="processData">
      </lifecycle-retired>
    </div>
    <el-tabs v-model="tabActiveName" style="padding: 15px;">
      <el-tab-pane label="运营商状态变更" name="first">
        <el-table :data="statusRecord">
          <el-table-column label="变更前值" prop="previousStatus"></el-table-column>
          <el-table-column label="变更后值" prop="currentStatus"></el-table-column>
          <el-table-column label="变更原因" prop="changeReason"></el-table-column>
          <el-table-column label="变更时间">
            <template slot-scope="scope">
              {{ scope.row.changeTime | dateFilter }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="getStatusRecords"
          :current-page="pageConfig.pageIndex"
          :page-size="pageConfig.pageSize"
          layout="total, prev, pager, next"
          :total="pageConfig.allCount"
          class="wh__body--page">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="卡状态变更" name="second">
        <el-table :data="statusRecordV2">
          <el-table-column label="状态变更值" prop="modifyAction"></el-table-column>
          <el-table-column label="任务执行状态" prop="taskStatus"></el-table-column>
          <el-table-column label="变更原因" prop="changeReason"></el-table-column>
          <el-table-column label="修改时间" prop="gmtModified"></el-table-column>
        </el-table>
        <el-pagination
          @current-change="getStatusRecordsV2"
          :current-page="pageConfigV2.pageIndex"
          :page-size="pageConfigV2.pageSize"
          layout="total, prev, pager, next"
          :total="pageConfigV2.allCount"
          class="wh__body--page">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import LifeCurrent from '@/page/components/card-lifecycle/current.vue'
  import LifecycleLocked from '@/page/components/card-lifecycle/locked.vue'
  import LifecycleDelivered from '@/page/components/card-lifecycle/delivered.vue'
  import LifecycleTesting from '@/page/components/card-lifecycle/testing.vue'
  import LifecycleLevel2 from '@/page/components/card-lifecycle/level2.vue'
  import LifecycleActivation from '@/page/components/card-lifecycle/activation.vue'
  import LifecycleDeactivation from '@/page/components/card-lifecycle/deactivation.vue'
  import LifecycleRetired from '@/page/components/card-lifecycle/retired.vue'

  export default {
    components: {
      'lifecycle-locked': LifecycleLocked,
      'lifecycle-delivered': LifecycleDelivered,
      'lifecycle-testing': LifecycleTesting,
      'lifecycle-level2': LifecycleLevel2,
      'lifecycle-activation': LifecycleActivation,
      'lifecycle-current': LifeCurrent,
      'lifecycle-deactivation': LifecycleDeactivation,
      'lifecycle-retired': LifecycleRetired
    },
    name: 'card-detail',
    props: {
      content: {
        default: {}
      }
    },
    data() {
      return {
        tabActiveName: 'first',
        statusRecord: [],
        statusRecordV2: [],
        pageConfig: {
          pageIndex: 1,
          pageSize: 5,
          allCount: 0
        },
        pageConfigV2: {
          pageIndex: 1,
          pageSize: 5,
          allCount: 0
        }
      }
    },
    computed: {
      item() {
        return this.content.detailContent
      },
      processData() {
        if (this.item.importResult !== 'success') return 1
        switch (this.item.status) {
        case 'inventory':
          return 2
        case 'locked':
          return 2
        case 'delivered':
          if (!(this.item.runningCardInfoVO && this.item.runningCardInfoVO.status)) return 3
          switch (this.item.runningCardInfoVO.status) {
          case 'testing':
            return 4
          case 'level2':
            return 5
          case 'activation':
            return 6
          case 'deactivation':
            return 7
          case 'retired':
            return 8
          default:
            return 8
          }
        default:
          return 8
        }
      }
    },
    created() {
      this.getStatusRecords()
      this.getStatusRecordsV2()
    },
    methods: {
      enterRouter(name, query) {
        this.$emit('enterRouter', { name, query, type: 'open' })
      },
      async getStatusRecords(page = 1) {
        this.pageConfig.pageIndex = page
        let res = await this.jaxLib.card.listStatusRecords({
          iccid: this.content.iccid,
          pageIndex: page,
          pageSize: this.pageConfig.pageSize
        })
        if (!res.success) return false
        this.statusRecord = res.data.list
        this.pageConfig.allCount = res.data.page.allCount
      },
      async getStatusRecordsV2(page = 1) {
        this.pageConfigV2.pageIndex = page
        let res = await this.jaxLib.card.listStatusRecordsV2({
          iccid: this.content.iccid,
          pageIndex: page,
          pageSize: this.pageConfigV2.pageSize
        })
        if (!res.success) return false
        this.statusRecordV2 = res.data.list
        this.pageConfigV2.allCount = res.data.page.allCount
      }
    }
  }
</script>
