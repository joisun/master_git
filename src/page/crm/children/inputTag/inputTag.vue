<script>
  /* eslint-disable no-return-assign */

  import { mapState } from 'vuex'
  import * as appTypes from '@/store/types'
  import DialogAlterForm from './dialogAlterForm.vue'
  import DateTimeFormat from '@/global/filters/date-format'

  const columns = [
    { key: 'inputTag', name: '标签名' },
    { key: 'createdPerson', name: '创建人' },
    { key: 'createdTime', minWidth: 120, name: '创建时间', formatter: (row, { property }) => DateTimeFormat(row[property], 'YYYY-MM-DD') },
    { key: 'registerCount', name: '注册客户数' },
    { key: 'total', name: '潜客数' },
    { key: 'sended', name: '已转单' },
    { key: 'recieved', name: '已接单' },
    { key: 'preliminary', name: '初步接洽' },
    { key: 'demandConfirm', name: '需求确认' },
    { key: 'negotiation', name: '商务谈判' },
    { key: 'win', name: '赢单' },
    { key: 'option', name: '操作' }
  ]

  const row = (function(columns) {
    return columns.map(item => item.key).reduce((prev, key) => {
      prev[key] = ''
      prev.tagId = ''
      return prev
    }, {})
  }(columns))

  export default {
    components: { DialogAlterForm },

    data() {
      return {
        keyword: '',
        columns: [...columns],
        records: [],
        currentTag: null,
        dialogStatus: { isDialogShow: false },
        loading: false
      }
    },

    created() {
      this.fetch()
    },

    computed: {
      ...mapState({
        list: state => state.inputTag.list,
        statistic: state => state.inputTag.statistic
      })
    },

    watch: {
      'list': 'normalizePartial',
      'statistic': 'normalizeAll'
    },

    methods: {
      async fetch() {
        let keyword = this.keyword
        await this.$store.dispatch(appTypes.INPUT_TAG_SEARCH, { keyword })
      },

      normalizePartial() {
        let { list } = this
        this.loading = true
        let arr = []
        list.forEach(item => {
          let hash = {}
          Object.keys(row).forEach(key => {
            hash[key] = item[key]
          })
          arr.push(hash)
        })
        this.$store.dispatch(
          appTypes.INPUT_TAG_STATISTICS_SEARCH,
          { tagIds: list.map(item => item.tagId).join(',') }
        ).finally(() => {
          this.loading = false
        })
        this.records = arr
      },

      normalizeAll() {
        let { list, statistic } = this
        list.forEach(item => {
          let _statistic = statistic[item.tagId]
          Object.keys(item).forEach(key => {
            if (['inputTag', 'createdPerson', 'createdTime'].includes(key)) return
            item[key] = _statistic[key]
          })
        })
        this.records = list
      },

      editTag(row) {
        this.currentTag = row
        this.dialogStatus.isDialogShow = true
      },
      async saveTag(flag, data) {
        this.dialogStatus.isDialogShow = false
        this.currentTag = null
        if (flag === false) return
        await this.$store.dispatch(appTypes.INPUT_TAG_UPDATE, data)
        this.fetch()
      },
      async deleteTag(tagId) {
        await this.$store.dispatch(appTypes.INPUT_TAG_DELETE, { tagId })
        this.fetch()
        this.$message.success('标签删除成功')
      }
    }
  }
</script>
<template>
  <div class="wh__warp">
    <div class="wh__header">
      <div class="wh__header--title">
        跟踪标签
      </div>
    </div>
    <div class="wh__tools">
      <el-input v-model="keyword" @keyup.native.enter="fetch()" prefix-icon="el-icon-search" class="wh__tools--search-input" placeholder="标签名/创建人"></el-input>
    </div>
    <div class="wh__body">
      <div class="duplicate-check crm-container" v-loading="loading">
        <div class="crm-container__content">
          <el-table :data="records" style="width: 100%">
            <el-table-column
              v-for="(item, index) in columns"
              v-if="'option'.indexOf(item.key) === -1"
              :formatter="item.formatter"
              :prop="item.key"
              :key="index"
              :min-width="item.minWidth"
              :label="item.name">
            </el-table-column>
            <el-table-column v-else-if="item.key === 'option'" :label="item.name">
              <template slot-scope="props">
                <el-button style="margin-bottom: 5px" size="mini" type="primary" @click="editTag(props.row)">修改</el-button><br/>
                <el-button size="mini" type="danger" @click="deleteTag(props.row.tagId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog
          :close-on-click-modal="false"
          title="修改标签"
          :visible.sync="dialogStatus.isDialogShow"
          width="30%">
          <DialogAlterForm
            @closeDialog="saveTag"
            :content="currentTag">
          </DialogAlterForm>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
