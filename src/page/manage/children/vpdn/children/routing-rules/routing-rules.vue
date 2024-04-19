<script>
import EditDialog from './components/edit-dialog'
import filterQueryParams from '@/global/function/filterQueryParams'

export default {
  name: 'routing-rules',
  components: {
    EditDialog
  },
  data() {
    return {
      dialogVisible: false,
      id: 0,
      isLoading: true,
      tableData: [],
      search: {
        carrier: '',
        carrierAccountName: '',
        apn: '',
        inRouterIp: '',
        outRouterIp: ''
      }
    }
  },
  created() {
    this.getRuleList()
  },
  methods: {
    onCarrierChange() {
      this.onSearch()
    },
    onSearch() {
      this.getRuleList()
    },
    async getRuleList() {
      this.isLoading = true
      let res = await this.jaxLib.vpdn.rule.list(
        filterQueryParams({
          ...this.search
        })
      )
      this.isLoading = false
      if (!res.success) return false
      this.tableData = res.data
    },
    dialogClose(isUpdate) {
      this.dialogVisible = false
      if (isUpdate) {
        this.getRuleList()
      }
    },
    openDialog(id) {
      this.id = id
      this.dialogVisible = true
    }
  }
}
</script>

<template>
  <div class="routing-rules wh__warp">
    <div class="wh__header">
      <h2 class="wh-title">路由规则</h2>
    </div>
    <div class="wh__tools--mix">
      <el-select
        v-model="search.carrier"
        placeholder="选择运营商"
        clearable
        class="wh__tools--search-filter"
        style="width: 120px"
        @change="onCarrierChange"
      >
        <el-option
          v-for="(key, val) in enums.carrier.maps()"
          :key="val"
          :label="key"
          :value="val"
        />
      </el-select>
      <el-input
        v-model.trim="search.carrierAccountName"
        class="wh__tools--search-input"
        placeholder="请输入运营商账号"
        size="small"
        @keyup.native.enter="onSearch"
      />
      <el-input
        v-model.trim="search.apn"
        class="wh__tools--search-input"
        placeholder="请输入APN"
        size="small"
        @keyup.native.enter="onSearch"
      />
      <el-input
        v-model.trim="search.inRouterIp"
        class="wh__tools--search-input"
        placeholder="请输入入口路由器IP"
        size="small"
        @keyup.native.enter="onSearch"
      />

      <el-input
        v-model.trim="search.outRouterIp"
        class="wh__tools--search-input"
        placeholder="请输入出口路由器IP"
        size="small"
        @keyup.native.enter="onSearch"
      />
      <el-button type="primary" class="float-right" size="mini" @click="openDialog(0)"
        >新增</el-button
      >
    </div>
    <div class="wh__body">
      <el-table v-loading="isLoading" :data="tableData" height="calc(100vh - 200px)">
        <el-table-column label="运营商" prop="carrier" width="90px">
          <template slot-scope="scope">
            {{ scope.row.carrier | carrierFilter }}
          </template>
        </el-table-column>
        <el-table-column label="运营商账号" prop="remark"></el-table-column>
        <el-table-column label="APN" prop="apn"></el-table-column>
        <el-table-column label="开始IP" prop="startIp"></el-table-column>
        <el-table-column label="结束IP" prop="endIp"></el-table-column>
        <el-table-column label="IP段" prop="ipRange"></el-table-column>
        <el-table-column label="入口路由IP" prop="inRouterIp"></el-table-column>
        <el-table-column label="出口路由IP" prop="outRouterIp"></el-table-column>
        <el-table-column label="网络功能及其对应IP" width="200px">
          <template slot-scope="scope">
            <p v-for="(item, key) in scope.row.controlIp" :key="key">{{ key }}: {{ item }}</p>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="comment"></el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openDialog(scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit-dialog :id="id" :dialog-visible="dialogVisible" @close="dialogClose"></edit-dialog>
  </div>
</template>
