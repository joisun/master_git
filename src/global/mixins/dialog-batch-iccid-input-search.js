export default {
  computed: {
    batchDialogData: {
      fileList: [],
      iccids: []
    },
    batchIccids: undefined
  },
  methods: {
    resetSameIccidSearch(resetTarget) {
      if (resetTarget === 'batchIccids') {
        this.batchIccids = undefined
        this.searchForm.iccidsOssKey = ''
        this.batchDialogData = {
          iccids: [],
          fileList: []
        }
      } else {
        this.searchForm.search = ''
      }
    },
    onBatchInputConfirm($event) {
      const batchIccids = $event.iccids.filter((item) => !!item)
      this.batchIccids = batchIccids.length ? batchIccids : undefined
      this.searchForm.iccidsOssKey = $event.iccidsOssKey
      this.batchDialogData = {
        iccids: $event.iccids.filter((item) => !!item),
        fileList: $event.fileList
      }
      if (!this.noBatchSearchData) this.resetSameIccidSearch('iccids')
      this.getList(false)
    }
  }
}
