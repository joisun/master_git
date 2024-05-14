<script>
/**
   * Create by zeter on 2018/6/6
   */
  import { IPMapping } from '../mixins/const'
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    mixins: [DialogMixin],
    props: {
      now: {
        required: true
      },
      dialogName: {
        default: String
      }
    },
    data() {
      return {
        columns: IPMapping,
        tableData: [],
        loading: false,
        page: {
          pageIndex: 1,
          pageSize: 20,
          total: 0
        }
      }
    },
    methods: {
      open() {
        this.getList()
      },
      close() {
        this.$emit('closeDialog', this.dialogName, true)
      },
      // 加载列表
      async getList() {
        let rst = await this.jaxLib.vpdn.ip.mapList({
          planId: this.now.id,
          pageNo: this.page.pageIndex
        })
        if (!rst.success) return false
        this.page.total = rst.data.page.allCount
        this.tableData = rst.data.list
      },
      // 切换页面
      changePage(index) {
        this.page.pageIndex = index
        this.getList()
      }
    }
  }
</script>

<template>
  <div class="ip-mapping-list">
    <div class="wh__dialog--body">
      <el-table :data="tableData"
        style="width: 100%">
        <el-table-column v-for="(item, index) in columns"
          :key=index
          :formatter="item.formatter"
          :prop=item.key
          :label=item.name
          :min-width=item.width
          :align=item.align
          :class-name="item.style">
        </el-table-column>
        <el-table-column label="分配时间">
          <template slot-scope="scope">
            {{scope.row.created | dateFilter}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="changePage"
        :current-page="page.pageIndex"
        :page-size="page.pageSize"
        layout="prev, pager, next, jumper"
        :total="page.total"
        class="tac mt10">
      </el-pagination>
    </div>
  </div>
</template>
