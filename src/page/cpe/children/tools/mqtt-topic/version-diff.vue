<script>
import apis from '@/api/ironman-api'
export default {
  props: {
    selectedVersion: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableColumns: [],
      tableData: [],
      topicList: [],
      versionTopicMap: {},
      isShowDifferent: false
    }
  },
  computed: {
    filteredTableData() {
      if (!this.isShowDifferent) return this.tableData
      return this.tableData.filter(item => {
        const keys = Object.keys(item).filter(key => key !== 'name')
        return keys.find(key => item[key] === false)
      })
    }
  },
  created() {
    this.getAllTopics(this.selectedVersion)
    this.setTableColumns(this.selectedVersion)
    this.getAllTopics(this.selectedVersion)
  },
  methods: {
    setTableColumns(selectedVersion) {
      const columns = [ { label: 'topic', prop: 'name' } ]
      selectedVersion.forEach(item => {
        columns.push({ label: item.version, prop: item.version })
      })
      this.tableColumns = columns
    },
    async getAllTopics(selectedVersion) {
      const versionTopicMap = {}
      selectedVersion.forEach(item => {
        versionTopicMap[item.version] = item.supportTopic.split(',').map(item => Number(item))
      })
      this.versionTopicMap = versionTopicMap
      const topicIdList = Object.keys(versionTopicMap).reduce((a, b) => ([...a, ...versionTopicMap[b]]), [])
      const { success, data } = await apis.mqttTopicList({ pageIndex: 1, pageSize: 10000, ids: topicIdList.join(',') })
      if (!success) return false
      this.topicList = data.list
      this.setTableData()
    },
    setTableData() {
      const { tableColumns, versionTopicMap } = this
      this.tableData = this.topicList.map(item => {
        const row = {}
        tableColumns.forEach(column => {
          if (column.label === 'topic') {
            row[column.prop] = item.name
          } else {
            row[column.prop] = versionTopicMap[column.prop].indexOf(item.id) > -1
          }
        })
        return row
      })
    }
  }
}
</script>

<template>
  <div class="version-diff">
    <p class="mb10 float-right">
      <el-checkbox v-model="isShowDifferent">仅看不同</el-checkbox>
    </p>
    <el-table :data="filteredTableData">
      <el-table-column
        v-for="(item, index) in tableColumns"
        :key="index"
        :label="item.label"
        :align="index > 0 ? 'center' : 'left'"
      >
        <template slot-scope="scope">
          <template v-if="item.label !== 'topic'">
            <span v-if="scope.row[item.prop]" class="el-icon-check" style="color: #14ec0a"></span>
            <span v-else class="el-icon-close" style="color: #ab4d47"></span>
          </template>
          <template v-else>{{scope.row.name}}</template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
