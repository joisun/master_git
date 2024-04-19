<script>
import apis from '@/api/ironman-api'
import Detail from './detail'

const uptimeFormat = (seconds) => {
  if (typeof seconds !== 'number') {
    return seconds
  }
  if (seconds === 0) return '-'
  if (seconds <= 300) {
    return seconds + 's'
  } else if (seconds > 300 && seconds <= 3600) {
    const minute = Math.floor(seconds / 60)
    const second = seconds % 60
    return `${minute}m`
  } else if (seconds > 3600 && seconds <= 86400) {
    const hour = Math.floor(seconds / 3600)
    const minute = Math.floor((seconds % 3600) / 60)
    const second = seconds % 60
    return `${hour}h${minute}m`
  } else {
    const day = Math.floor(seconds / 86400)
    const hour = Math.floor((seconds % 86400) / 3600)
    const minute = Math.floor((seconds % 3600) / 60)
    const second = seconds % 60
    return `${day}d${hour}h${minute}m`
  }
}

export default {
  components: {
    Detail
  },
  props: {
    parentMacAddr: {
      type: String,
      default: ''
    },
    client: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      search: {
        macAddr: this.client
      },
      isLoading: true,
      page: {
        pageIndex: 1,
        pageSize: 30,
        total: 0
      }
    }
  },
  created() {
    this.getList()
  },

  methods: {
    async getList(pageIndex = 1) {
      this.page.pageIndex = pageIndex
      this.isLoading = true
      const params = { pageIndex, pageSize: 30, parentMacAddr: this.parentMacAddr }
      if (this.search.name) params.name = this.search.name
      if (this.search.macAddr) params.macAddr = this.search.macAddr
      const {
        success,
        data: { list, page }
      } = await apis.deviceClientList(params)
      if (!success) return false
      this.isLoading = false
      if (!success) return false
      this.tableData = list.map((item) => ({ ...item, uptimeFormat: uptimeFormat(item.uptime) }))
      this.page.total = page.allCount
    },
    async setFollow(id, follow, index) {
      const { success } = await apis.deviceClientSetFollow({ id, follow })
      if (success) {
        this.$message({ type: 'success', message: '操作成功' })
        this.$set(this.tableData[index], 'follow', follow)
      }
    }
  }
}
</script>

<template>
  <div class="cpe-device-terminal-list">
    <div class="wh__tools">
      <div class="wh__tools--search">
        <el-input
          v-model.trim="search.name"
          placeholder="请输入终端设备名称"
          name="searchField"
          class="wh__tools--search-input"
          @keyup.enter.native="getList(1)"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="getList(1)"> </el-button>
        </el-input>
        <el-input
          v-model.trim="search.macAddr"
          placeholder="请输入Mac地址"
          name="searchField"
          class="wh__tools--search-input"
          @keyup.enter.native="getList(1)"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="getList(1)"> </el-button>
        </el-input>
      </div>
    </div>
    <div class="wh__body">
      <div class="wh__body--table">
        <el-table v-loading="isLoading" :data="tableData">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <detail :mac-addr="scope.row.macAddr" :parent-mac-addr="parentMacAddr"></detail>
            </template>
          </el-table-column>
          <el-table-column label="序号" width="45" align="center">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="星标" width="45" align="center">
            <template slot-scope="scope">
              <span
                v-if="scope.row.follow"
                class="el-icon-star-on icon-star icon-star--on"
                @click="setFollow(scope.row.id, false, scope.$index)"
              >
              </span>
              <span
                v-else
                class="el-icon-star-off icon-star"
                @click="setFollow(scope.row.id, true, scope.$index)"
              >
              </span>
            </template>
          </el-table-column>
          <el-table-column label="Mac地址" prop="macAddr"></el-table-column>
          <el-table-column label="终端设备名称" prop="name"></el-table-column>
          <el-table-column
            label="累计在线时长"
            prop="uptimeFormat"
            align="center"
          ></el-table-column>
          <el-table-column label="在线状态" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.online" type="success">在线</el-tag>
              <el-tag v-else>离线</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="当前接入方式" prop="linkType" align="center"></el-table-column>
          <el-table-column label="当前IP地址" prop="ip"></el-table-column>
          <!--          <el-table-column label="当前时延">-->
          <!--            <template slot-scope="scope">{{ scope.row.avg || '-' }}ms</template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column label="当前网速">-->
          <!--            <template slot-scope="scope">-->
          <!--              <span class="el-icon-top">{{ scope.row.upRate || '-' }}KB/s</span><br>-->
          <!--              <span class="el-icon-bottom">{{ scope.row.downRate || '-' }}KB/s</span>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
        </el-table>
      </div>
      <div class="wh__body--page">
        <el-pagination
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          layout="total, prev, pager, next"
          :total="page.total"
          @current-change="getList"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.cpe-device-terminal-list {
  .icon-star {
    font-size: 16px;
    cursor: pointer;

    &--on {
      font-size: 20px;
      color: orange;
    }
  }
}
</style>
