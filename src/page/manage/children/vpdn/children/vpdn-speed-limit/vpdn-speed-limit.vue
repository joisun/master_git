<style lang="scss">
</style>

<template>
  <div class="vpdn-speed-limit">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">联网限速</h2>
      </div>
      <div class="wh-tool">
        <el-input placeholder="请输入客户ID或客户名称"
          name="searchField"
          v-model="orgName"
          @keyup.native.enter="onClickSearch"
          class="wh__tools--search-input">
          <el-button slot="append" icon="el-icon-search" @click.native="onClickSearch">
          </el-button>
        </el-input>
        <el-button class="float-right" @click="onClickCreate">新增</el-button>
      </div>
      <div class="wh__body">
        <div class="speed-limit-list clearfix" v-loading="dataSource.loading">
          <el-card v-for="(item, index) in dataSource.list" :key="index" class="speed-limit-card">
            <div>
              <span class="speed-limit-card__title">客户名称：</span>
              <client-panel :orgId="item.orgId" :key="item.orgId">
                <div class="speed-limit-card__content" :title="`${ item.orgName }（${ item.orgId}）`">{{ item.orgName
                }}（{{ item.orgId}}）
                </div>
              </client-panel>
            </div>
            <div>
              <span class="speed-limit-card__title">限速套餐：</span>
              <price-panel :id="item.priceOfferId" :key="item.priceOfferId">
                <div class="speed-limit-card__content" :title="`${item.priceOfferName}（${item.priceOfferId}）`">
                  {{item.priceOfferName}}（{{item.priceOfferId}}）
                </div>
              </price-panel>

            </div>
            <div>
              <span class="speed-limit-card__title">限速规则：</span>
              <div class="speed-limit-card__content">{{item.rule}}</div>
              <table class="speed-limit-card__rules">
                <thead>
                  <tr>
                    <td>触发条件</td>
                    <td>执行策略</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="rule in item.speedLimitConfigs" :key="rule.usageStart">
                    <td>{{rule.usageStart |
                      volumeFilterOptimze}}{{rule.symbolStart}}套餐使用量{{rule.symbolEnd}}{{rule.usageEnd |
                      volumeFilterOptimze}}
                    </td>
                    <td>速度限制至{{rule.speedLimitValue | speedFilter(true, true) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="speed-limit-card__operation">
              <el-button size="mini" icon="el-icon-edit" @click="onClickModify(item)">
              </el-button>
            </div>
          </el-card>
        </div>
        <el-pagination
          @current-change="redirect"
          :current-page="pager.pageNo"
          :page-size="pager.pageSize"
          layout="prev, pager, next, jumper"
          :total="pager.allCount"
          class="wh__body--page">
        </el-pagination>
      </div>
    </div>

    <el-dialog
      :title="speedLimitDialog.isCreate ? '新增' : '修改'"
      :visible.sync="speedLimitDialog.visible"
      :lock-scroll="false">
      <EditRuleDialog
        @close="speedLimitDialog.visible=false"
        :speedLevelList="speedLevelList"
        @submited="refresh"
        :isCreate="speedLimitDialog.isCreate"
        :model="speedLimitDialog.model">
      </EditRuleDialog>
    </el-dialog>
  </div>
</template>

<script>
  import EditRuleDialog from './components/edit-rule-dialog.vue'
  import PagerMixin from '@/global/mixins/pager'
  import pricePanel from '@/page/components/panel/price-info-panel.vue'
  import clientPanel from '@/page/components/panel/client-info-panel.vue'

  export default {
    mixins: [PagerMixin],
    components: {
      EditRuleDialog,
      'client-panel': clientPanel,
      'price-panel': pricePanel
    },
    data() {
      return {
        orgName: '',
        speedLevelList: [],
        speedLimitDialog: {
          visible: false,
          isCreate: false,
          model: null
        }
      }
    },
    mounted() {
      this.fetch()
      this.getSpeedLevelList()
    },
    filters: {
      volumeFilterOptimze(volume) {
        if (isNaN(+volume)) return volume
        if (typeof volume === 'string') volume = parseFloat(volume)
        if (Math.abs(volume) < 1024) {
          return volume + 'M'
        }
        let cacheVolume = volume
        volume /= 1024
        if (Number.isInteger(volume)) {
          return volume + 'G'
        }
        if ((volume + '').split('.')[1].length > 3) {
          return cacheVolume + 'M'
        }
        return volume + 'G'
      }
    },
    methods: {
      async getSpeedLevelList() {
        let resp = await this.jaxLib.vpdn.speedLimit.speedLevelList()
        if (resp.success) {
          this.speedLevelList = resp.data || []
        } else {
          this.$message.error(resp.message)
        }
      },
      async getData(pager) {
        let params = {
          ...pager,
          orgName: this.orgName
        }
        let p = await this.jaxLib.vpdn.speedLimit.list(params)
        return p
      },
      onClickSearch() {
        this.redirect(1)
      },
      onClickCreate() {
        this.speedLimitDialog.visible = true
        this.speedLimitDialog.isCreate = true
        this.speedLimitDialog.model = null
      },
      onClickModify(row) {
        this.speedLimitDialog.visible = true
        this.speedLimitDialog.isCreate = false
        this.speedLimitDialog.model = row
      }
    }
  }
</script>
