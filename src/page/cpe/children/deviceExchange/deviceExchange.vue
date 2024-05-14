<script>
import ApplyList from '@/page/cpe/children/deviceExchange/components/apply-list'
import apis from '@/api/ironman-api'
export default {
  components: {
    'apply-list': ApplyList
  },
  data() {
    return {
      versionId: 0,
      activeTab: 'apply',
      counts: {
        INIT: 0,
        REVIEW: 0,
        DELIVERING: 0,
        RECYCLING: 0,
        TESTING: 0,
        RETURN_FACTORY: 0
      },
      deviceList: [],
      tabs: [
        {
          name: 'apply',
          label: '申请列表',
          apiKey: 'INIT'
        },
        {
          name: 'audit',
          label: '审核列表',
          apiKey: 'REVIEW'
        },
        {
          name: 'shipment',
          label: '寄货处理',
          apiKey: 'DELIVERING'
        },
        {
          name: 'recycle',
          label: '回收处理',
          apiKey: 'RECYCLING'
        },
        {
          name: 'examine',
          label: '验收测试',
          apiKey: 'TESTING'
        },
        {
          name: 'factory',
          label: '返回厂商',
          apiKey: 'RETURN_FACTORY'
        }
      ]
    }
  },
  watch: {
    activeTab(val) {
      if (val === 'second') {
        this.versionId = 0
      }
    }
  },
  created() {
    this.getCount()
    this.getList4DeviceAfterSale()
  },
  methods: {
    async getCount() {
      const res = await apis.getAfterSaleRequestListCount()
      if (res && res.success) {
        res.data.forEach((item) => {
          this.counts[item.linkStatus] = item.count
        })
      }
    },
    async getList4DeviceAfterSale() {
      const res = await apis.list4DeviceAfterSale({})
      this.deviceList = res.data.map((item) => {
        return {
          label: `${item.itemName}${item.itemModel ? '(' + item.itemModel + ')' : ''}`,
          value: item.itemNo,
          model: item.itemModel
        }
      })
    }
  }
}
</script>

<template>
  <div class="cpe-mqtt-topic">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">设备退换管理</h2>
      </div>
      <div class="wh__body">
        <el-tabs v-model="activeTab">
          <el-tab-pane
            v-for="item in tabs"
            :key="item.name"
            :label="`${item.label}(${counts[item.apiKey] || 0})`"
            :name="item.name"
          >
            <apply-list
              v-if="activeTab === item.name"
              :current-type="item.name"
              :device-list="deviceList"
              @reload="getCount"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
