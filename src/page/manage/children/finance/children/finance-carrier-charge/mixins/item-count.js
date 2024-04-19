export default {
  methods: {
    addRow() {
      this.tableData.push({ ...this.baseItem })
      this.emitValue()
    },
    removeRow(index) {
      this.tableData.splice(index, 1)
      this.emitValue()
    },
    initItem(table) {
      return table.map(e => ({ ...e, old: true }))
    }
  }
}
