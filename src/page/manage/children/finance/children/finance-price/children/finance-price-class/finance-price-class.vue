<script type="text/jsx">
  import moment from 'moment'
  import DialogAddPlanClassification from './components/dialog-add-plan-classification.vue'
  import DialogEditPlanClassification from './components/dialog-edit-plan-classification.vue'

  export default {
    computed: {
      normalizedContent() {
        let content = this.$store.getters.getClassificationList()
        let _hasTag = (con, property) => con.tagList.filter(tag => tag.name === property).length > 0
        return content.map(con => {
          let hash = {}
          hash.ALLOW_CHANGE_RATE_PLAN = _hasTag(con, 'ALLOW_CHANGE_RATE_PLAN') ? '支持' : '不支持'
          hash.ALLOW_APPEND_PACKAGE = _hasTag(con, 'ALLOW_APPEND_PACKAGE') ? '支持' : '不支持'
          hash.ALLOW_EXTEND_PERIOD = _hasTag(con, 'ALLOW_EXTEND_PERIOD') ? '支持' : '不支持'
          hash.RECHARGE_TIME_LIMIT = _hasTag(con, 'RECHARGE_TIME_LIMIT') ? '有' : '无'
          hash.ALLOW_APPEND_POOL_PACKAGE = _hasTag(con, 'ALLOW_APPEND_POOL_PACKAGE') ? '支持' : '不支持'
          hash.ALLOW_AUTO_RECHARGE = _hasTag(con, 'ALLOW_AUTO_RECHARGE') ? '支持' : '不支持'
          hash.VPDN_ONLY = _hasTag(con, 'VPDN_ONLY') ? '是' : '否'
          hash.NB_IOT = _hasTag(con, 'NB_IOT') ? '是' : '否'
          hash.locationService = con.locationService ? '是' : '否'
          hash.rechargeTimeRange = con.rechargeTimeRange.replace('-1', '最后一天').split('~')
          // 为了给时间分行显示o(╯□╰)o
          hash.created = moment(con.created.time).format('YYYY-MM-DD HH:mm:ss').split(/\s+/)
          hash.modified = moment(con.modified.time).format('YYYY-MM-DD HH:mm:ss').split(/\s+/)
          hash.carrier = this.enums.carrier.get(con.carrier)
          hash.type = this.enums.planClassType.get(con.type)
          hash.identificationA = con.displayIdentificationA ? con.identification.split(',')[0] : '无'
          hash.identificationB = con.displayIdentificationB ? con.identification.split(',')[1] : '无'
          hash.disabledText = con.disabled ? '禁用' : '可用'
          return { ...con, ...hash }
        })
      }
    },
    data() {
      return {
        dialogStatus: {
          isAddDialogShow: false,
          isEditDialogShow: false
        },
        item: null,
        loading: true
      }
    },
    methods: {
      openDialog(name, item) {
        this.item = item
        this.dialogStatus[name] = true
      },
      closeDialog(dialogName, refreshable) {
        this.dialogStatus[dialogName] = false
        refreshable && this.notifyParentRefresh()
      },
      async notifyParentRefresh() {
        this.loading = true
        await this.$store.dispatch('changeClassificationList', { force: true })
        this.loading = false
      }
    },
    components: {
      'dialog-add-plan-classification': DialogAddPlanClassification,
      'dialog-edit-plan-classification': DialogEditPlanClassification
    },
    created() {
      this.notifyParentRefresh()
    }
  }
</script>
<template>
  <div class="plan-manager-classification">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-button type="primary" class="float-right" @click="openDialog('isAddDialogShow', null)">
          新增分类
        </el-button>
      </div>
    </div>
    <div class="wh__body" v-loading="loading">
      <el-table :data="normalizedContent" class="classifications__table" style="width: 100%" height="calc(100vh - 240px)">
        <el-table-column fixed="left" width="60" prop="id" label="ID">
        </el-table-column>
        <el-table-column min-width="200" label="分类名" prop="name">
        </el-table-column>
        <el-table-column min-width="180" label="昵称" prop="displayName">
        </el-table-column>
        <el-table-column width="100" label="运营商" prop="carrier">
        </el-table-column>
        <el-table-column width="100" label="类型" prop="type">
        </el-table-column>
        <el-table-column width="100" label="所属平台" prop="platform">
        </el-table-column>
        <el-table-column width="100" label="可改套餐" prop="ALLOW_CHANGE_RATE_PLAN">
        </el-table-column>
        <el-table-column width="130" label="可叠加加油包" prop="ALLOW_APPEND_PACKAGE">
        </el-table-column>
        <el-table-column width="120" label="可叠加流量池叠加包" prop="ALLOW_APPEND_POOL_PACKAGE">
        </el-table-column>
        <el-table-column width="100" label="VPDN" prop="VPDN_ONLY">
        </el-table-column>
        <el-table-column width="100" label="定位功能" prop="locationService">
        </el-table-column>
        <el-table-column width="100" label="NB_IOT" prop="NB_IOT">
        </el-table-column>
        <el-table-column width="100" label="可续周期" prop="ALLOW_EXTEND_PERIOD">
        </el-table-column>
        <el-table-column width="130" label="可自动续费" prop="ALLOW_AUTO_RECHARGE">
        </el-table-column>
        <el-table-column width="130" label="续费时间限制" prop="RECHARGE_TIME_LIMIT">
        </el-table-column>
        <el-table-column width="90" label="标识1" prop="identificationA">
        </el-table-column>
        <el-table-column width="90" label="标识2" prop="identificationB">
        </el-table-column>
        <el-table-column width="180" label="续费周期">
          <template slot-scope="props">
            <div class="cell-wrapper">
              <span v-for="item in props.row.rechargeTimeRange" :key="item">
                {{item}}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="套餐分类状态" prop="disabledText"></el-table-column>
        <el-table-column min-width="120" label="创建时间">
          <template slot-scope="props">
            <div class="cell-wrapper">
              <span v-for="item in props.row.created" :key="item">
                {{item}}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="120" label="修改时间">
          <template slot-scope="props">
            <div class="cell-wrapper">
              <span v-for="item in props.row.modified" :key="item">
                {{item}}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="80" fixed="right" label="操作">
          <template slot-scope="props">
            <el-button @click="openDialog('isEditDialogShow', props.row)" type="primary" size="mini">修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加分类" :close-on-click-modal="false" :visible.sync="dialogStatus.isAddDialogShow">
      <dialog-add-plan-classification @closeDialog="closeDialog" dialogName="isAddDialogShow">
      </dialog-add-plan-classification>
    </el-dialog>
    <el-dialog title="修改分类" :close-on-click-modal="false" :visible.sync="dialogStatus.isEditDialogShow">
      <dialog-edit-plan-classification @closeDialog="closeDialog" dialogName="isEditDialogShow" :item="item">
      </dialog-edit-plan-classification>
    </el-dialog>
  </div>
</template>
