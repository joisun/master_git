/**
 * inputTag realSearch
 */
import apis from '@/api/ajax'

export default {
  data() {
    return {
      loadingRemoteInputMark: false,
      remoteInputMarkList: []
    }
  },
  methods: {
    async getRemoteInputMarkList(query) {
      this.loadingRemoteInputMark = true
      const ret = await apis.crm.inputMarkSearch({ remark: query || '' })
      this.remoteInputMarkList = ret.data.records
      this.loadingRemoteInputMark = false
    }
  }
}
