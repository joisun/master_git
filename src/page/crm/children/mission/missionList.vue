<script>
/**
 * Create by zeter on 2020/3/3
 */
  import { columns } from './mixins/fold-column'
  import DialogMissionForm from './dialog-mission-form.vue'
  import dateTimeFormat from '@/global/filters/date-format'
  import apis from '@/api/ajax'
  import { mapState } from 'vuex'
  export default {
    name: 'mission',
    data() {
      return {
        loading: false,
        form: {
          missionTime: '',
          missionType: ''
        },
        columns,
        page: {
          pageSize: 20,
          pageIndex: 1,
          total: 0
        },
        selectData: null,
        dialogStatus: {
          isEditMission: false
        },
        sellerList: [],
        list: []
      }
    },
    computed: {
      ...mapState({
        missionType: state => state.overall.crmEnum.missionType
      })
    },
    async mounted() {
      await this.getSubordinates()
      await this.getList()
    },
    methods: {
      async getSubordinates() {
        const { success, data } = await apis.crm.getSubordinates()
        if (!success) return false
        this.sellerList = data
      },
      search() {
        this.page.pageIndex = 1
        this.getList()
      },
      async getList() {
        this.loading = true
        const { success, data: { page, records } } = await apis.crm.missionListGet({
          pageNo: this.page.pageIndex,
          pageSize: this.page.pageSize,
          missionType: this.form.missionType,
          missionTime: dateTimeFormat(this.form.missionTime, 'YYYY-MM-DD')
        })
        this.loading = false
        if (!success) return
        this.list = records
        this.page.total = page.totalCount
      },
      createMission() {
        this.selectData = null
        this.dialogStatus.isEditMission = true
      },
      editMission(row) {
        this.selectData = row
        this.dialogStatus.isEditMission = true
      },
      handlePageChange(val) {
        this.page.pageIndex = val
        this.getList()
      },
      closeDialog(val, refresh) {
        this.dialogStatus[val] = false
        if (refresh) this.getList()
      }
    },
    components: {
      'dialog-mission-form': DialogMissionForm
    }
  }
</script>

<template>
  <div class="mission-list">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">销售任务</h2>
      </div>
      <div class="mission crm-container">
        <div class="wh__tools">
          <el-select
            v-model="form.missionType"
            placeholder="任务类型"
            @change="search"
            clearable
          >
            <el-option
              v-for="(item, index) in missionType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-date-picker
            @change="search"
            v-model="form.missionTime"
            type="date"
            placeholder="选择任务日期"
          >
          </el-date-picker>
          <div class="float-right">
            <el-tooltip
              class="item"
              effect="dark"
              content="新增任务"
              placement="top"
            >
              <el-button @click="createMission" type="primary" size="small">
                <wh-std-icon sign="&#xe632;">&#xe632;</wh-std-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>

        <div class="wh__body" v-loading="loading">
          <el-table :data="list" stripe style="width: 100%">
            <el-table-column
              v-for="(item, index) in columns"
              :formatter="item.formatter"
              :prop="item.key.split('.')[0]"
              :key="index"
              :min-width="item.minWidth"
              :width="item.width"
              :sortable="item.sortable"
              :label="item.name"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="props">
                <el-button @click="editMission(props.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="wh__body--page">
            <el-pagination
              class="margin-top20 align-right"
              @current-change="handlePageChange"
              :current-page="page.pageNo"
              :page-size="page.pageSize"
              layout="total, prev, pager, next"
              :total="page.total"
            >
            </el-pagination>
          </div>
        </div>

        <el-dialog
          :title="`${selectData ? '编辑' : '新增'}任务`"
          width="80%"
          :close-on-click-modal="false"
          :visible.sync="dialogStatus.isEditMission"
        >
          <dialog-mission-form
            modelName="isEditMission"
            @onClose="closeDialog"
            :content="selectData"
          >
          </dialog-mission-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
