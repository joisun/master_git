/**
 * user realSearch
 */
import apis from '@/api/ajax'
export default {
  data () {
    return {
      loadingRemoteUsers: false,
      remoteUsers: []
    }
  },
  methods: {
    async getRemoteUsers (query, remoteUserType) {
      remoteUserType = remoteUserType === '' ? '' : 'seller'
      this.loadingRemoteUsers = true
      const ret = await apis.crm.userSearch({
        pageNo: 1, pageSize: 1000, keyword: query || '', category: remoteUserType
      })
      this.remoteUsers = ret.data.records
      this.loadingRemoteUsers = false
    }
  }
}
