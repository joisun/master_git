<script>
import { mapState } from 'vuex'
import * as appTypes from '@/store/types'
import Enumerator from '@/constant/enums/crm-enum'
import BatchCheck from '@/page/crm/children/duplicateCheck/components/batch-check.vue'
import CheckList from '@/page/crm/children/duplicateCheck/components/checkList.vue'

const columns = [
  { key: 'company', name: '客户名称' },
  { key: 'name', name: '联系人', formatter: (row) => row.contact.name },
  { key: 'mobile', name: '联系方式', formatter: (row) => row.contact.mobile },
  {
    key: 'salesman',
    name: '销售归属',
    formatter: (row, { property }) => row[property] && row[property]['realName']
  }
]
export default {
  components: { CheckList, BatchCheck },
  data() {
    return {
      keyword: '',
      columns: [...columns]
    }
  },

  computed: {
    ...mapState({
      list: (state) => state.duplicateCheck.list
    })
  },

  methods: {
    batchQuery() {
      this.$refs.batchCheck.open(0)
    },
    checkRecords() {
      this.$refs.checkList.open()
    },
    async fetch() {
      let keyword = this.keyword
      await this.$store.dispatch(appTypes.DUPLICATE_CHECK, keyword)
    }
  }
}
</script>
<template>
  <div class="wh__warp">
    <batch-check ref="batchCheck" />
    <check-list ref="checkList" />
    <div class="wh__header">
      <div class="wh__header--title">客户查重</div>
    </div>
    <div class="wh__tools">
      <el-input
        v-model="keyword"
        prefix-icon="el-icon-search"
        class="wh__tools--search-input"
        placeholder="公司名/联系人/手机号/邮箱"
        @keyup.native.enter="fetch()"
      />
      <el-button class="float-right ml10" type="primary" @click="batchQuery">批量查询</el-button>
      <el-button class="float-right" @click="checkRecords">查询记录</el-button>
    </div>
    <div class="wh__body">
      <div class="crm-container__content">
        <el-table :data="list" style="width: 100%">
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column
            v-for="(item, index) in columns"
            :key="index"
            :formatter="item.formatter"
            :prop="item.key"
            :min-width="item.minWidth"
            :label="item.name"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
