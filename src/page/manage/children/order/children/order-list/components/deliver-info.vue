<style lang="sass">
</style>

<template>
  <div>
    <h4>订单信息</h4>
    <div class="record-item">
      <div class="record-label">订单编号</div>
      <div class="record-content">{{ billId }}</div>
    </div>
    <div class="record-item">
      <div class="record-label">订单时间</div>
      <div class="record-content">{{ orderAllValue.gmtCreated }}</div>
    </div>
    <div class="record-item">
      <div class="record-label">购卡要求</div>
      <div class="record-content">
        <el-button size="mini" @click="$emit('lookBillContent')">点击查看</el-button>
      </div>
    </div>
    <h4>发货信息</h4>
    <div class="record-item">
      <div class="record-label">ICCID数据</div>
      <div class="record-content">
        <a><el-button @click="downloadExportResult" size="mini">点击下载</el-button></a>
      </div>
    </div>
  </div>
</template>

<script>
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import Download from '@/page/components/wh-download/wh-download'

  export default {
    mixins: [DialogMixin],
    props: {
      billId: String,
      orderAllValue: {
        default: _ => ({})
      }
    },
    data() {
      return {}
    },
    watch: {},
    methods: {
      async downloadExportResult() {
        const {success, data} = await this.jaxLib.card.outStoreRecordGet({
          operationId: this.orderAllValue.baseOperationId
        })
        if (!success) return false
        await Download({...data})
      }
    }
  }
</script>
