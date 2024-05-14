<template>
  <el-card>
    <el-tabs v-model="activeName">
      <el-tab-pane v-if="!hideFirst" label="我的处理" name="first">
        <process-item :flow-data="flowData" :flow-no="flowNo" :loading="loading" />
      </el-tab-pane>
      <el-tab-pane label="处理历史" name="second" lazy>
        <process-history :flow-no="flowNo" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import ProcessHistory from '@/page/compliance/ext-whitelist/change-list/update-and-detail/components/history/process-history.vue'
import ProcessItem from '@/page/compliance/ext-whitelist/change-list/update-and-detail/components/process-item.vue'

export default {
  components: {
    ProcessItem,
    ProcessHistory
  },
  props: {
    flowNo: {
      type: String,
      default: ''
    },
    flowData: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  data() {
    return {
      role: '',
      loading: false,
      activeName: 'first'
    }
  },
  computed: {
    hideFirst() {
      if (this.isFinished || this.isApplying) {
        return true
      }
      if (
        this.isSeller &&
        !['PRICE_MODIFICATION_AFTER_SALES_CHANGE', 'SALES_CONFIRMATION'].includes(
          this.flowData.status
        )
      ) {
        return true
      }
      return false
    },
    isSeller() {
      return this.role === 'seller'
    },
    isApplying() {
      return this.flowData.status === 'SUBMIT_APPLICATION'
    },
    isFinished() {
      return this.flowData.status === 'FINISHED'
    }
  },
  watch: {
    isFinished(value) {
      this.activeName = value ? 'second' : 'first'
    },
    isApplying(value) {
      this.activeName = value ? 'second' : 'first'
    }
  },
  async created() {
    await this.getRole()
    if (this.hideFirst) {
      this.activeName = 'second'
    } else {
      this.activeName = 'first'
    }
  },
  methods: {
    async getRole() {
      const { success, data } = await this.jaxLib.whitelist.opOrSu({})
      if (success) {
        this.role = data
      }
    }
  }
}
</script>
