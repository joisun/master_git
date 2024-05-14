<template>
  <div>
    <process-item
      v-for="(item, index) in list"
      :key="index"
      :flow-data="item"
      :is-history="true"
      :flow-no="flowNo"
    />
  </div>
</template>
<script>
import ProcessItem from '@/page/compliance/ext-whitelist/change-list/update-and-detail/components/process-item.vue'

export default {
  components: { ProcessItem },
  props: {
    flowNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await this.jaxLib.whitelist.complianceGetHistory({ flowNo: this.flowNo })
      if (res && res.success) {
        this.list = res.data
      }
    }
  }
}
</script>
