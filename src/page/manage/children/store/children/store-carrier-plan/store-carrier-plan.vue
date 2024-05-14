<script>
  /**
   * Create by zeter on 2019/1/22
   */
  import { columns } from './mixins/const'
  import CarrierPlanEdit from './components/carrier-plan-edit-dialo.vue'

  export default {
    name: 'store-carrier-plan',
    data() {
      return {
        columns,
        carrier: this.$route.params.carrier,
        activeItem: null,
        displayEditorShow: false,
        tableData: [],
        loading: false,
        page: {
          pageIndex: 1,
          pageSize: 20,
          allCount: 0
        }
      }
    },
    methods: {
      tabsClick(tab) {
        this.$router.push({ name: 'store-carrier-plan', params: { carrier: tab.name } })
        this.getList()
      },
      changePage(val) {
        this.page.pageIndex = val
        this.getList()
      },
      async getList() {
        let rst = await this.jaxLib.store.carrierPlanList({
          carrier: this.carrier,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize
        })
        if (!rst.success) return false
        this.tableData = rst.data.list
        this.page.allCount = rst.data.page.allCount
      },
      // 编辑
      handleEdit(row) {
        this.activeItem = row
        this.displayEditorShow = true
      },
      // 新建
      openDialog() {
        this.activeItem = null
        this.displayEditorShow = true
      },
      closeDialog(flag) {
        this.displayEditorShow = false
        this.activeItem = null
        if (flag) this.getList()
      }
    },
    mounted() {
      this.getList()
    },
    components: {
      'carrier-plan-edit': CarrierPlanEdit
    }
  }
</script>

<template>
  <div class="store-carrier-plan">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">续费接口</h2>
      </div>
      <div class="wh__tabs">
        <el-tabs v-model="carrier" @tab-click="tabsClick" class="wh__tabs">
          <el-tab-pane :label="key" :name="val" v-for="(key, val) in enums.carrier.maps()" :key="val">
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="wh__tools--mix">
        <el-button size="mini" @click="openDialog">新建</el-button>
      </div>
      <div class="wh__body" v-loading="loading">
        <div class="wh__body--table">
          <el-table :data="tableData">
            <el-table-column v-for="(item, index) in columns"
              :key=index
              :formatter="item.formatter"
              :prop=item.key
              :label=item.label
              :min-width=item.width
              :class-name="item.className">
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)">
                  编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="wh__body--page">
          <el-pagination
            @current-change="changePage"
            :current-page="page.pageIndex"
            :page-sizes="[15, 30, 60, 100, 200, 500]"
            :page-size="page.pageSize"
            layout="prev, pager, next, jumper"
            :total="page.allCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      :title="!activeItem ? `新增` : `编辑`"
      :visible.sync="displayEditorShow"
      class="wh__dialog"
      size="middle">
      <carrier-plan-edit
        :carrier="carrier"
        :content="activeItem"
        dialogName="displayEditorShow"
        @closeDialog="closeDialog">
      </carrier-plan-edit>
    </el-dialog>
  </div>
</template>
