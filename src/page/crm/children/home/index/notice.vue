<script>
  /**
   * Create by zeter on 2020/2/24
   */
  import NoticeDetail from '@/page/common/children/my-notice/notice-detail.vue'
  export default {
    name: 'notice',
    data() {
      return {
        list: [],
        notice: {},
        isShowDetail: false
      }
    },
    components: {
      NoticeDetail
    },
    mounted() {
      this.getList()
    },
    methods: {
      async getList() {
        const { success, data: { list } } = await this.jaxLib.notice.listGet({
          pageIndex: 1,
          pageSize: 3
        })
        if (!success) return false
        this.list = list.slice(0, 3)
      },
      openDetail(row) {
        this.notice = row
        this.isShowDetail = true
      },
      closeDialog() {
        this.isShowDetail = false
      },
      enterRouter() {
        this.$router.push({ name: 'my-notice' })
      }
    }
  }
</script>

<template>
  <div class="notice">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>通知</span>
        <div class="link float-right font12" @click="enterRouter">查看全部</div>
      </div>
      <template v-if="list.length">
        <div class="item" v-for="i in list" :key="i.id">
          <div class="flex">
            <div class="flex2 link title" @click="openDetail(i)">{{i.title}}</div>
            <div class="flex1 time">{{i['gmt_created'] | dateFilter('YYYY-MM-DD')}}</div>
          </div>
        </div>
      </template>
      <div v-else class="none">暂无通知</div>
    </el-card>
    <notice-detail v-if="isShowDetail" :visible="isShowDetail" @close="closeDialog" :notice="notice"/>
  </div>
</template>
<style scoped lang="scss">
  .notice {
    margin-bottom: 10px;

    .title{
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: keep-all;
      white-space: nowrap;
    }

    .none {
      margin-top: 10px;
      text-align: center;
      color: #bbb;
      font-size: 14px;
    }

    .link {
      cursor: pointer;
      color: #1c8de0;
    }
    .time{
      text-align: right;
    }
    .item {
      line-height: 30px;
      font-size: 14px;
    }
  }
</style>

