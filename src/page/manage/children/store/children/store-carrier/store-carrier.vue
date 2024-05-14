<script>
/**
   * Create by zeter on 2017/12/11
   */
  import { columns } from './mixins/const'
  import accountAddEdit from './components/account-add-edit.vue'

  export default {
    data() {
      return {
        columns,
        carrier: 'cmcc',
        tableData: [],
        loading: false,
        chooseItem: null,
        displayEditorShow: false
      }
    },
    methods: {
      changeCarrier(val) {
        this.carrier = val
        this.getList()
      },
      async getList() {
        this.loading = true
        const { success, data } = await this.jaxLib.store.carrierAccountConfigListGet({
          carrier: this.carrier.toUpperCase()
        })
        this.loading = false
        if (!success) return false
        this.tableData = data.map(e => {
          e.carrier = e.carrier.toLowerCase()
          return e
        })
      },
      // 编辑
      handleEdit(row) {
        this.chooseItem = row
        this.displayEditorShow = true
      },
      // 新建
      openDialog() {
        this.chooseItem = null
        this.displayEditorShow = true
      },
      closeDialog(flag) {
        this.displayEditorShow = false
        this.chooseItem = null
        if (flag) this.getList()
      }
    },
    mounted() {
      this.getList()
    },
    components: {
      'account-add-edit': accountAddEdit
    }
  }
</script>

<template>
  <div class="store-carrier">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">运营商管理</h2>
      </div>
      <div class="wh__tools--mix">
        <el-select v-model="carrier" placeholder="请选择运营商" style="width: 150px;" @change="changeCarrier">
          <el-option :label="key" :value="val" v-for="(key, val) in enums.carrier.maps()" :key="val">
          </el-option>
        </el-select>
        <el-button class="float-right" @click="openDialog">新建</el-button>
      </div>
      <div class="wh__body" v-loading="loading">
        <div class="wh__body--table">
          <el-table :data="tableData" height="calc(100vh - 210px)">
            <el-table-column label="ID" prop="id" width="67">
            </el-table-column>
            <el-table-column v-for="(item, index) in columns"
              :key=index
              :formatter="item.formatter"
              :prop=item.key
              :label=item.label
              :min-width=item.width
              :class-name="item.className"
              v-if="!item.show || item.show(activeName)">
            </el-table-column>
            <el-table-column
              label="配置"
              width="300">
              <template slot-scope="scope">
                <p>appId:{{scope.row.appId}}</p>
                <p>secret:{{scope.row.secret}}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)">
                  编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog
      :title="!chooseItem ? `新增运营商账号` : `修改运营商账号`"
      :visible.sync="displayEditorShow"
      class="wh__dialog"
      size="large"
      top="7%">
      <account-add-edit
        :list="tableData"
        :carrier="carrier"
        :content="chooseItem"
        dialogName="displayEditorShow"
        @closeDialog="closeDialog">
      </account-add-edit>
    </el-dialog>
  </div>
</template>
