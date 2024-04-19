<script>
import apis from '@/api/ironman-api'
import moment from 'moment'

export default {
  props: {
    parentMacAddr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      date: [
        moment().format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD')
      ],
      tableData: [],
      isLoading: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const [ startTime, endTime ] = this.date
      const params = {
        parentMacAddr: this.parentMacAddr,
        startDate: moment(startTime).format('YYYY-MM-DD'),
        endDate: moment(endTime).format('YYYY-MM-DD')
      }
      this.isLoading = true
      const { success, data } = await apis.clientUsageList(params)
      this.isLoading = false
      if (success) {
        this.tableData = data
      }
    }
  }
}
</script>

<template>
  <div class="device-flow">
    <div>
      <el-date-picker
        v-model="date"
        type="daterange"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="getData"
        :clearable="false"
      >
      </el-date-picker>
    </div>
    <el-table class="mt20" :data="tableData" v-loading="isLoading">
      <el-table-column label="序号" width="200px" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="终端名称" prop="name"></el-table-column>
      <el-table-column label="Mac地址" prop="macAddr"></el-table-column>
      <el-table-column label="流量使用量(MB)" prop="totalUsage"></el-table-column>
    </el-table>
  </div>
</template>

