<script type="text/ecmascript-6">
import goSystem from '@/global/function/go-system'

import whSaleSelect from '@/page/components/wh-sales-select.vue'
import ChannelPriceSet from './components/channel-price-set.vue'
import WeChatSet from './components/wechat-set.vue'
import SaleDistribute from './components/sale-distribute.vue'
import AddOrg from './components/add-org.vue'
import AddUser from './components/add-user.vue'
import MoneyDistribute from './components/money-distribute.vue'
import AddBride from './components/add-bride.vue'
import orgRemark from './components/org-remark.vue'
import subordinate from './components/subordinate.vue'
import volumeCount from './components/volume-count.vue'
import balanceControl from './components/balance-control.vue'
import industryDialog from './components/industry-dialog.vue'
import openService from './components/open-service'
import H5ConfigDialog from '@/page/manage/children/client/components/h5-config-dialog'
import ResetPwdDialog from '@/global/components/reset-pwd-dialog.vue'
export default {
  name: 'client-list',
  components: {
    ResetPwdDialog,
    'industry-dialog': industryDialog,
    'wh-sales-select': whSaleSelect,
    'channel-price-set': ChannelPriceSet,
    'we-chat-set': WeChatSet,
    'sale-distribute': SaleDistribute,
    'add-org': AddOrg,
    'add-user': AddUser,
    'money-distribute': MoneyDistribute,
    'add-bride': AddBride,
    'org-remark': orgRemark,
    subordinate: subordinate,
    'volume-count': volumeCount,
    'balance-control': balanceControl,
    'open-service': openService,
    H5ConfigDialog
  },
  data() {
    return {
      isActive: false,
      // 组织(客户)列表
      dataList: [],
      loading: false,
      // 当前选中
      pointOrgIdx: -1, // 一些dialog操作具体指定的组织的index
      // 搜索相关
      form: {
        orgName: '',
        sale: ''
      },
      page: {
        pageIndex: 1,
        pageSize: 15,
        total: 0
      },
      // 弹窗状态
      addDialogVisible: false,
      addUserVisible: false,
      distributeVisible: false,
      priceVisible: false,
      wechatVisible: false,
      sellVisible: false,
      brideVisible: false,
      remarkVisible: false,
      subordinateVisible: false,
      industryVisible: false,
      volumeCountVisible: false,
      balanceControlVisible: false,
      openService: false
    }
  },
  computed: {
    // 组织id
    pointOrgId() {
      return this.dataList[this.pointOrgIdx] ? this.dataList[this.pointOrgIdx].id : -1
    },
    // 组织名
    pointOrgName() {
      return this.dataList[this.pointOrgIdx] ? this.dataList[this.pointOrgIdx].orgName : ''
    }
  },
  watch: {
    '$route.query.id'(newValue) {
      if (newValue) {
        this.form.orgName = newValue
        this.getList()
      }
    }
  },
  async mounted() {
    this.form.orgName = this.$route.query.id ? this.$route.query.id : ''
    await this.$store.dispatch('getSales')
    this.getList()
  },
  methods: {
    elimnateCardRule(org) {
      this.$router.push({
        name: 'eliminate-card-rules',
        query: {
          orgName: org.orgName,
          orgId: org.id
        }
      })
    },
    resetPwd(org) {
      this.$confirm('确定为该客户重置密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: true
      })
        .then(async () => {
          let res = await this.jaxLib.customer.resetPwd({
            orgId: org.id
          })
          if (res && res.success) {
            this.$refs.resetPwdDialog.open(res.data)
          }
        })
        .catch(() => {})
    },
    showH5(org) {
      this.$refs.h5ConfigDialog.open({
        ...org,
        orgId: org.id
      })
    },
    // 统一打开弹窗（new）
    showDialog(num, idx) {
      this.pointOrgIdx = idx
      this[num] = true
    },
    // 统一关闭弹窗
    closeDialog(num, refesh) {
      this[num] = false
      if (refesh) this.getList()
    },
    // 搜索字段变化
    searchData() {
      this.page.pageIndex = 1
      this.getList()
    },
    // 切换页码
    changeIndex(idx) {
      if (idx === 0) return
      this.page.pageIndex = idx
      this.getList()
    },
    // 改搜索销售
    changeSale(val) {
      this.form.sale = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 改所搜内容
    changeType(val) {
      this.page.pageIndex = 1
      this.getList()
    },
    // 获取数据列表
    async getList() {
      this.dataList = []
      this.loading = true
      let rst = await this.jaxLib.customer.list.get(
        {
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize,
          orgName: this.form.orgName.trim(),
          saler: this.form.sale
        },
        !!this.isActive
      )
      if (!rst.success) return false
      this.dataList = rst.data.list
      this.page.total = rst.data.page.allCount
      this.loading = false
    },
    // 登录系统
    async goSystem(idx) {
      goSystem(this.dataList[idx].orgAdmin.id, this.pointOrgName)
    },
    // 进入设置报价
    interSettingPrice(name, org) {
      this.$router.push({
        name: name,
        query: {
          orgName: org.orgName,
          orgId: org.id,
          isMonitorIndustryChannels:
            org.tagList.findIndex((item) => item.name === 'MONITOR_INDUSTRY_CHANNELS') !== -1
        }
      })
    },
    // 进入用户详情
    enterUserInfo(id) {
      this.$router.push({ name: 'client-detail', query: { orgId: id } })
    },
    // 进入路由同一封装
    enterRoute(name, query = {}, param = {}) {
      this.$router.push({ name: name, query: query, params: param })
    },
    // 计算用户是否含有某个标记
    calcExistTag(list = [], name = '') {
      return !!list.filter((e) => e.name === name).length
    }
  }
}
</script>

<template>
  <div class="l-customers">
    <h5-config-dialog ref="h5ConfigDialog" />
    <div class="wh-app-wrap">
      <div class="wh__header">
        <div class="wh__header--title">客户管理</div>
      </div>
      <!-- tools -->
      <div class="wh__tools">
        <div class="wh__tools--search">
          <wh-sales-select v-model="form.sale" @change="changeSale"> </wh-sales-select>
          <el-input
            v-model="form.orgName"
            placeholder="组织id、账户名、客户名称、手机号"
            name="searchField"
            class="wh__tools--search-input"
            style="width: 350px"
            @keyup.enter.native="searchData"
          >
            <el-button slot="append" icon="el-icon-search" @click.native="searchData"> </el-button>
          </el-input>
        </div>
      </div>
      <!-- list-->
      <div class="wh__body">
        <div class="wh__body--table">
          <div id="customerList" v-loading="loading" class="l-customers__table">
            <div class="l-customers__thead" layout="row top-left">
              <div class="th w5">orgId</div>
              <div class="th w15">客户名称</div>
              <div class="th w13 tac">账号</div>
              <div class="th w13 tac">电话</div>
              <div class="th w5 tac">销售归属</div>
              <div class="th w5 tac">邀请码</div>
              <div class="th w18 tac">最后登录时间<br />注册时间</div>
              <div class="th tac l-customers__operation-title">
                <i class="el-icon-more"></i>
              </div>
            </div>

            <div v-if="!dataList.length" class="l-customers__tbody--empty">未搜索到任何数据</div>
            <div v-for="(org, index) in dataList" v-else :key="org.id" class="l-customers__tbody">
              <div class="td w5">
                <el-tooltip v-if="org.orgAdmin" content="超级登录" placement="right" effect="dark">
                  <span class="l-customers__link" @click="goSystem(index)">
                    {{ org.id }}
                  </span>
                </el-tooltip>
                <span v-else>
                  {{ org.id }}
                </span>
              </div>
              <div class="td w15">
                <div @click="enterUserInfo(org.id)">
                  {{ org.fullname }}
                </div>
                <div class="l-customers__industry--font">
                  {{ org.industry }}-{{ org.industryScope }}
                  <el-tooltip class="item" effect="dark" content="修改行业信息" placement="bottom">
                    <span @click="showDialog('industryVisible', index)">
                      <wh-std-icon sign="xe698" class="l-customers__link--icon"> </wh-std-icon>
                    </span>
                  </el-tooltip>
                </div>
              </div>
              <div
                v-desensitization="{
                  id: org.id,
                  idType: 'orgId',
                  showField: 'userAccount'
                }"
                class="td tac w13"
              >
                {{ org.orgAdmin ? org.orgAdmin.userAccount : '' }}
              </div>
              <div
                v-desensitization="{
                  id: org.id,
                  idType: 'orgId',
                  showField: 'phone'
                }"
                class="td tac w13"
              >
                {{ org.phone }}
              </div>
              <div class="td tac w5">
                <div>
                  <p>{{ org.saleName | saleFilter }}</p>
                  <!-- <p>{{org.dcRealName}}</p>-->
                </div>
              </div>
              <div class="td w5 tac">{{ org.inviteCode }}</div>
              <div class="td w18 tac">
                <el-tooltip class="item" effect="dark" content="最近登录时间" placement="left">
                  <div>{{ org.lastLoginTime | dateFilter }}</div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="注册时间" placement="left">
                  <div>{{ org.registerTime | dateFilter }}</div>
                </el-tooltip>
              </div>
              <div class="td l-customers__operation tac">
                <el-tooltip content="客户分配" placement="top" effect="light">
                  <el-button size="mini" @click="showDialog('sellVisible', index)">
                    <wh-std-icon sign="&#xe6a7;"></wh-std-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="客户备注" placement="top" effect="light">
                  <el-button size="mini" @click="showDialog('remarkVisible', index)">
                    <wh-std-icon sign="xe645"></wh-std-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="功能标记" placement="top" effect="light">
                  <el-button size="mini" @click="showDialog('brideVisible', index)">
                    <wh-std-icon sign="xe6b8"> </wh-std-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="设置报价" placement="top" effect="light">
                  <el-button
                    size="mini"
                    @click="interSettingPrice('client-price-set-package', org)"
                  >
                    <wh-std-icon sign="xe6b6"></wh-std-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="分配额度" placement="top" effect="light">
                  <el-button size="mini" @click.native="showDialog('distributeVisible', index)">
                    <wh-std-icon sign="xe6a4"></wh-std-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  v-if="org.orgAdmin"
                  content="微信配置"
                  placement="top"
                  effect="light"
                  class="item"
                >
                  <el-button size="mini" @click.native="showDialog('wechatVisible', index)">
                    <wh-std-icon :sign="org.wxSupport ? 'xe62a' : 'xe631'"></wh-std-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  v-if="org.category !== 'DIRECT_CUSTOMER'"
                  content="查看下级组织"
                  placement="top"
                  effect="light"
                >
                  <el-button size="mini" @click="showDialog('subordinateVisible', index)">
                    <wh-std-icon sign="xe652"></wh-std-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  v-if="!org.orgAdmin && isActive"
                  content="新建用户"
                  placement="top"
                  effect="light"
                >
                  <el-button size="mini" @click.native="showDialog('addUserVisible', index)">
                    <wh-std-icon sign="xe66a"></wh-std-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="服务功能开通" placement="top" effect="light">
                  <el-button size="mini" @click.native="showDialog('openService', index)">
                    <wh-std-icon sign="xe614"></wh-std-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip v-if="isActive" content="查看二级组织" placement="top" effect="light">
                  <el-button size="mini" @click="interSettingPrice('client-level2-list', org)">
                    <wh-std-icon sign="xe652"></wh-std-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip v-if="isActive" content="定制价格" placement="top" effect="light">
                  <el-button size="mini" @click.native="showDialog('priceVisible', index)">
                    <wh-std-icon sign="xe61e"></wh-std-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="流量统计" placement="top" effect="light">
                  <el-button size="mini" @click.native="showDialog('volumeCountVisible', index)">
                    <wh-std-icon sign="xe63e"></wh-std-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="超额阈值设定" placement="top" effect="light">
                  <el-button size="mini" @click.native="showDialog('balanceControlVisible', index)">
                    <wh-std-icon sign="xe640"></wh-std-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  v-if="!calcExistTag(org.tagList, 'POST_PAID')"
                  content="客户数据"
                  placement="top"
                  effect="light"
                >
                  <el-button
                    size="mini"
                    @click="enterRoute('client-data', { orgId: org.id, orgName: org.orgName })"
                  >
                    <wh-std-icon sign="xe613"></wh-std-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="H5页面配置" placement="top" effect="light">
                  <el-button size="mini" @click.native="showH5(org)">
                    <span class="std-icon iconfont" style="vertical-align: bottom">
                      <svg
                        t="1667299340390"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="2778"
                        width="18"
                        height="18"
                      >
                        <path
                          d="M513.232572 801.024649c-4.230348 0-8.444323-0.75827-12.467963-2.293229l-185.809893-70.886467c-12.544711-4.787026-21.234627-16.373922-22.350031-29.780257l-6.889921-83.941807c-1.574868-19.2269 12.727882-36.09508 31.950689-37.671994 19.48989-1.638313 36.094056 12.734022 37.682227 31.963992l5.097088 62.005192 153.11833 58.414411 162.173566-58.526975 6.444782-149.767002L315.026348 520.540514c-18.438954 0-33.701566-14.340613-34.858926-32.741705l-13.095249-208.28272c-0.621147-9.632381 2.795673-19.084661 9.388834-26.109658 6.614651-7.028067 15.827477-11.019984 25.470091-11.019984l433.917644 0c19.293415 0 34.936697 15.636119 34.936697 34.929534 0 19.300578-15.642259 34.936697-34.936697 34.936697l-396.715347 0 8.69094 138.420583 370.835933 0c9.530051 0 18.651802 3.889587 25.222451 10.769274 6.592139 6.879688 10.102079 16.143679 9.685593 25.664519l-9.03477 209.603809c-0.607844 14.157441-9.699919 26.542516-23.048949 31.358195l-196.407252 70.892607C521.258363 800.338011 517.234723 801.024649 513.232572 801.024649zM513.232572 980.803175c-4.299933 0-8.578376-0.783853-12.650111-2.371L159.556461 845.934488c-12.860912-4.992711-21.580504-17.104563-22.236444-30.885428L103.095541 100.733239c0.184195-36.966936 30.948873-37.361933 63.513546-37.796838 91.086531-1.203408 364.468922 1.196245 364.489388 1.196245-0.791016 0 246.738567-2.378164 329.086064-1.196245 27.059286 0.403183 60.745503 0.890276 60.745503 36.129872l-34.209126 715.983811c-0.657986 13.762445-9.325389 25.836435-22.145369 30.859845L525.958408 978.410686C521.86416 980.014206 517.545808 980.803175 513.232572 980.803175zM206.001259 789.033547l307.188334 119.355365 304.830637-119.28885 31.407314-656.423297c-12.742209-0.119727-30.560016-0.211824-55.515385-0.211824-105.08536 0-262.721587 1.531889-262.770705 1.531889-0.670266 0-175.036525-1.531889-291.298436-1.531889-30.156834 0-50.960649 0.112564-65.342194 0.257873L206.001259 789.033547z"
                          p-id="2779"
                        />
                      </svg>
                    </span>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="重置密码" placement="top" effect="light">
                  <el-button size="mini" @click.native="resetPwd(org)">
                    <span class="el-icon-refresh-left iconfont" />
                  </el-button>
                </el-tooltip>
                <el-tooltip content="销卡规则" placement="top" effect="light">
                  <el-button size="mini" @click.native="elimnateCardRule(org)">
                    <span class="el-icon-notebook-2 iconfont" />
                  </el-button>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div v-if="page.total" class="wh__body--page">
          <div class="wh__body--page">
            <el-pagination
              :current-page="page.pageIndex"
              :page-size="page.pageSize"
              :total="page.total"
              @current-change="changeIndex"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- add org form-->
    <el-dialog
      title="添加新客户/组织"
      :visible.sync="addDialogVisible"
      :lock-scroll="false"
      custom-class="auto-width"
    >
      <add-org dialog-name="addDialogVisible" @closeDialog="closeDialog"> </add-org>
    </el-dialog>
    <el-dialog
      :title="`${pointOrgName}添加用户`"
      :visible.sync="addUserVisible"
      :lock-scroll="false"
      custom-class="auto-width"
    >
      <add-user
        :org-id="pointOrgId"
        :point-org-name="pointOrgName"
        :org-content="dataList[pointOrgIdx]"
        dialog-name="addUserVisible"
        @closeDialog="closeDialog"
      >
      </add-user>
    </el-dialog>
    <!-- wechat setting form-->
    <el-dialog
      :title="`${pointOrgName}微信配置`"
      :visible.sync="wechatVisible"
      :lock-scroll="false"
      custom-class="auto-width"
    >
      <we-chat-set
        :org-id="pointOrgId"
        :point-org-name="pointOrgName"
        :org-content="dataList[pointOrgIdx]"
        dialog-name="wechatVisible"
        @closeDialog="closeDialog"
      >
      </we-chat-set>
    </el-dialog>
    <!-- price setting form-->
    <el-dialog
      :title="`${pointOrgName}定制价格`"
      :visible.sync="priceVisible"
      :lock-scroll="false"
      custom-class="auto-width"
    >
      <channel-price-set
        :org-id="pointOrgId"
        :point-org-name="pointOrgName"
        dialog-name="priceVisible"
        @closeDialog="closeDialog"
      >
      </channel-price-set>
    </el-dialog>
    <!-- sell from-->
    <el-dialog :visible.sync="sellVisible" custom-class="auto-width" title="客户分配">
      <sale-distribute
        :org-id="pointOrgId"
        :point-org-name="pointOrgName"
        :org-content="dataList[pointOrgIdx]"
        dialog-name="sellVisible"
        @closeDialog="closeDialog"
      >
      </sale-distribute>
    </el-dialog>
    <!-- distribute money form-->
    <el-dialog
      :title="`${pointOrgName}分配额度`"
      :visible.sync="distributeVisible"
      :lock-scroll="false"
      custom-class="auto-width"
    >
      <money-distribute
        :org-id="pointOrgId"
        :point-org-name="pointOrgName"
        :org-content="dataList[pointOrgIdx]"
        dialog-name="distributeVisible"
        @closeDialog="closeDialog"
      >
      </money-distribute>
    </el-dialog>
    <!-- bride from-->
    <el-dialog
      :visible.sync="brideVisible"
      custom-class="auto-width"
      :lock-scroll="false"
      title="功能标记"
    >
      <add-bride
        :org-id="pointOrgId"
        :point-org-name="pointOrgName"
        :org-content="dataList[pointOrgIdx]"
        dialog-name="brideVisible"
        @closeDialog="closeDialog"
      >
      </add-bride>
    </el-dialog>
    <!-- remark from -->
    <el-dialog
      :visible.sync="remarkVisible"
      :lock-scroll="false"
      title="客户备注"
      class="l-customers__remark"
    >
      <org-remark
        :org-id="pointOrgId"
        :point-org-name="pointOrgName"
        :org-content="dataList[pointOrgIdx]"
        dialog-name="remarkVisible"
        @closeDialog="closeDialog"
      >
      </org-remark>
    </el-dialog>
    <!-- subordinate from -->
    <el-dialog
      :visible.sync="subordinateVisible"
      :lock-scroll="true"
      title="下级客户"
      class="l-customers__subordinate"
      size="large"
      top="5%"
    >
      <subordinate
        :org-id="pointOrgId"
        :point-org-name="pointOrgName"
        :org-content="dataList[pointOrgIdx]"
        dialog-name="subordinateVisible"
        @closeDialog="closeDialog"
      >
      </subordinate>
    </el-dialog>
    <!-- industry from -->
    <el-dialog
      :visible.sync="industryVisible"
      title="行业分配"
      class="l-customers__industry"
      width="20%"
      size="tiny"
    >
      <industry-dialog
        :org-id="pointOrgId"
        :point-org-name="pointOrgName"
        :org-content="dataList[pointOrgIdx]"
        dialog-name="industryVisible"
        @closeDialog="closeDialog"
      >
      </industry-dialog>
    </el-dialog>
    <!--客户免费套餐-->
    <el-dialog
      :title="`${pointOrgName}服务功能开通`"
      :visible.sync="openService"
      :lock-scroll="false"
      custom-class="auto-width"
    >
      <open-service
        :org-id="pointOrgId"
        :point-org-name="pointOrgName"
        :org-content="dataList[pointOrgIdx]"
        dialog-name="openService"
        @closeDialog="closeDialog"
      >
      </open-service>
    </el-dialog>
    <el-dialog
      title="流量统计"
      :visible.sync="volumeCountVisible"
      :lock-scroll="false"
      custom-class="auto-width"
    >
      <volume-count
        :org-id="pointOrgId"
        :point-org-name="pointOrgName"
        :org-content="dataList[pointOrgIdx]"
        dialog-name="volumeCountVisible"
        @closeDialog="closeDialog"
      >
      </volume-count>
    </el-dialog>
    <el-dialog
      title="超额阈值设定"
      :visible.sync="balanceControlVisible"
      :lock-scroll="false"
      custom-class="auto-width"
    >
      <balance-control
        :org-id="pointOrgId"
        :point-org-name="pointOrgName"
        :org-content="dataList[pointOrgIdx]"
        dialog-name="balanceControlVisible"
        @closeDialog="closeDialog"
      >
      </balance-control>
    </el-dialog>
    <reset-pwd-dialog ref="resetPwdDialog" />
  </div>
</template>
