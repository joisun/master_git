<script type="text/jsx">
  import dateTimeFormat from '@/global/filters/date-format'
  import Enumerator from '@/constant/enums/crm-enum'
  import DialogAddFollow from './../components/dialog-add-follow'
  import apis from '@/api/ajax'
  import * as appTypes from '@/store/types'
  const columns = [
    { key: 'seller', name: '销售', width: 70, formatter: (row, { property }) => row[property] && row[property]['realName'] },
    { key: 'followTime', width: 120, name: '本次跟进时间', formatter: (row, { property }) => dateTimeFormat(row[property], 'YYYY-MM-DD') },
    { key: 'followMethod', name: '本次跟进方式', formatter: (row, { property }) => Enumerator.convert('followStyle', row[property]) },
    { key: 'followPeople', width: 120, name: '客户对接人' },
    { key: 'followNotice', name: '本次跟进内容' },
    { key: 'nextTime', width: 120, name: '下次跟进时间', formatter: (row, { property }) => !row[property] ? '-' : dateTimeFormat(row[property], 'YYYY-MM-DD') },
    { key: 'nextMethod', name: '下次跟进方式', formatter: (row, { property }) => !row[property] ? '-' : Enumerator.convert('followStyle', row[property]) },
    { key: 'nextFollow', name: '下次跟进内容' },
    { key: 'leaderFeedback', name: '领导意见' }
  ]

  export default {
    inject: ['tuple'],
    props: ['customerId'],
    components: { DialogAddFollow },
    data() {
      return {
        columns: [ ...columns ],
        tableData: [],
        loading: false,
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
        let { success, data: { records, page } } = await apis.crm.customerFollowSearch({
          id: this.customerId,
          pageNo: this.page.pageIndex,
          pageSize: this.page.pageSize
        })
        this.loading = false
        if (!success) return false
        this.tableData = records
        this.page.total = page.totalCount
      },
      async save(data) {
        let { success } = await apis.crm.customerFollowPost(data)
        if (!success) return false
        this.$message.success('跟进记录增加成功')
        this.page.pageIndex = 1
        this.fetch()
        await this.$store.dispatch(appTypes.CUSTOMER_DETAIL_GET, data.customerId)
      },
      async edit(data) {
        let { success } = await apis.crm.customerFollowPut(data)
        if (!success) return false
        this.$message.success('修改跟进记录成功')
        this.fetch()
      },
      openDialog(type, item) {
        let handlers = {
          'add'() {
            this.dialogStatus.isAddDialogShow = true
          },
          'edit'(item) {
            this.$prompt('请输入跟进意见', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              showCancelButton: true
            }).then(({ value }) => {
              this.closeDialog({ type: 'edit', refreshable: true, data: { id: item.id, leaderFeedback: value } })
            }).catch(() => {})
          }
        }
        handlers[type].call(this, item)
      },

      closeDialog({ type, refreshable, data }) {
        let handlers = {
          'add'(refreshable, data) {
            this.dialogStatus.isAddDialogShow = false
            if (refreshable === true) {
              let { customerId } = this
              data.customerId = customerId
              data.nextTime = +new Date(data.nextTime)
              this.save(data)
            }
          },
          'edit'(refreshable, data) {
            if (refreshable === true) {
              let hash = { ...data }
              this.edit(hash)
            }
          }
        }
        handlers[type].call(this, refreshable, data)
      }
    }
  }
</script>
<template>
  <div class="section follows" data-offset-id="follow">
    <div class="section__head">
      <span>跟进记录</span>

      <div class="section__head--tool">
        <el-button @click="openDialog('add')" class="margin-top20" type="primary" size="mini">
          添加跟进记录
        </el-button>
      </div>
    </div>

    <!-- 内容编辑区域 -->
    <div class="follow-body" >
      <el-table
        stripe
        :data="tableData"
        style="width: 100%">
        <el-table-column
          v-for="(item, index) in columns"
          v-if="item.key !== 'leaderFeedback'"
          :width="item.width"
          :min-width="item.minWidth"
          :key="index"
          :prop="item.key"
          :label="item.name"
          :formatter="item.formatter">
        </el-table-column>

        <el-table-column
          v-else-if="item.key === 'leaderFeedback'"
          :prop="item.key"
          :label="item.name">
          <template slot-scope="props">
            {{props.row.leaderFeedback}}
            <wh-std-icon @click="openDialog('edit', props.row)" sign="&#xe6b7;">
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
      title="新增跟进记录"
      width="40%"
      :close-on-click-modal="false"
      :visible.sync="dialogStatus.isAddDialogShow">
      <DialogAddFollow @onClose="closeDialog" :customerId="customerId">
      </DialogAddFollow>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
  .follow-body .el-table{
    .el-table__row .cell .icon{
      display: none;
      cursor: pointer;
    }
    .el-table__row:hover{
      .cell .icon{
        display: inline-block;
      }
    }
  }
</style>
