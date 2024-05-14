import apis from '@/back'
export default {
  data () {
    return {
      loadingRemoteRegisters: false,
      remoteRegisters: []
    }
  },
  methods: {
    async queryRegister (id) {
      this.loadingRemoteRegisters = true
      const ret = await apis.crm.register.search({
        pageNo: 1, pageSize: 1000, keyword: id
      })
      this.remoteRegisters = ret.data.records
      this.loadingRemoteRegisters = false
    }
  }
}
