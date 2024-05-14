<script type="text/jsx">
  import dateTimeFormat from '@/global/filters/date-format'
  import Enumerator from '@/constant/enums/crm-enum'
  import DialogAddMission from './../../mission/dialog-add-mission.vue'
  import apis from '@/api/ajax'

  const columns = [
    {
      key: 'saleName',
      name: '销售',
      width: 70
    },
    {
      key: 'missionName',
      name: '任务名称',
      width: 120
    },
    {
      key: 'requiredMethod',
      name: '任务跟进方式',
      width: 70,
      formatter: (row, { property }) => Enumerator.convert('followStyle', row[property])
    },
    {
      key: 'missionType',
      name: '任务跟进类型',
      width: 70,
      formatter: (row, { property }) => Enumerator.convert('missionType', row[property])
    },
    { key: 'missionPurpose', name: '本次任务内容', width: 120 },
    {
      key: 'startTime',
      width: 120,
      name: '任务时间',
      formatter: (row, { property }) => dateTimeFormat(row['startTime'], 'YYYY-MM-DD') + '-' + dateTimeFormat(row['endTime'], 'YYYY-MM-DD')
    },
    {
      key: 'missionStatus',
      name: '任务状态',
      formatter: (row, { property }) => Enumerator.convert('missionStatus', row[property])
    },
    {
      key: 'followMethod',
      name: '本次跟进方式',
      formatter: (row, { property }) => !row[property] ? '-' : Enumerator.convert('followStyle', row[property])
    },
    { key: 'followPeople', width: 120, name: '本次联系人' },
    { key: 'followNotice', name: '本次跟进内容' }
  ]

  export default {
    inject: ['tuple'],
    props: ['customerId', 'needUpdate'],
    components: { DialogAddMission },
    data() {
      return {
        columns: [...columns],
        tableData: [],
        loading: false,
        selectData: null,
        page: {
          pageIndex: 1,
          pageSize: 5,
          total: 0
        },
        dialogStatus: {
          isAddDialogShow: false
        }
      }
    },

    mounted() {
      this.fetch()
    },

    watch: {
      'customerId': function(val) {
        this.init()
      }
    },

    methods: {
      init() {
        this.page.pageIndex = 1
        this.fetch()
      },
      changeIndex(val) {
        this.page.pageIndex = val
        this.fetch()
      },
      async fetch() {
        this.loading = true
        let { success, data: { records, page } } = await apis.crm.customerMissionListGet({
          id: this.customerId,
          pageNo: this.page.pageIndex,
          pageSize: this.page.pageSize
        })
        this.loading = false
        if (!success) return false
        this.tableData = records
        this.page.total = page.totalCount
      },
      openDialog(item) {
        if (this.needUpdate) {
          this.$alert('请先修改客户基础信息后，再添加任务记录！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        this.dialogStatus.isAddDialogShow = true
        this.selectData = item
      },
      closeDialog({ refreshable }) {
        this.dialogStatus.isAddDialogShow = false
        this.selectData = null
        if (refreshable) {
          this.fetch()
          this.$emit('updateFollow')
        }
      }
    }
  }
</script>
<template>
  <div class="section follows" data-offset-id="follow">
    <div class="section__head">
      <span>任务列表</span>
    </div>

    <!-- 内容编辑区域 -->
    <div class="follow-body">
      <el-table
        stripe
        :data="tableData"
        style="width: 100%">
        <el-table-column
          v-for="(item, index) in columns"
          :width="item.width"
          :min-width="item.minWidth"
          :key="index"
          :prop="item.key"
          :label="item.name"
          :formatter="item.formatter">
        </el-table-column>

        <el-table-column
          label="操作">
          <template slot-scope="props">
            <wh-std-icon @click="openDialog(props.row)" sign="&#xe6b7;">
            </wh-std-icon>
          </template>
        </el-table-column>
      </el-table>
      <div class="wh__body--page">
        <el-pagination
          @current-change="changeIndex"
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          :total="page.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="新增任务记录"
      width="40%"
      :close-on-click-modal="false"
      :visible.sync="dialogStatus.isAddDialogShow">
      <DialogAddMission @onClose="closeDialog" :content="selectData" :customerId="customerId">
      </DialogAddMission>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
  .follow-body .el-table {
    .el-table__row .cell .icon {
      display: none;
      cursor: pointer;
    }

    .el-table__row:hover {
      .cell .icon {
        display: inline-block;
      }
    }
  }
</style>
