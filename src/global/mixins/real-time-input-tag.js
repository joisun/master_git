/**
 * inputTag realSearch
 */
import apis from '@/api/ajax'
export default {
  data () {
    return {
      loadingRemoteInputTag: false,
      remoteInputTagList: []
    }
  },
  methods: {
    async getRemoteInputTagList (query) {
      this.loadingRemoteInputTag = true
      const ret = await apis.crm.inputTagSearch({keyword: query || ''})
      this.remoteInputTagList = ret.data.records
      this.loadingRemoteInputTag = false
    }
  }
}
