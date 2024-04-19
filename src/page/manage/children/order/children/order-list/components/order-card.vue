<script>
/**
 * Create by gzj on 17/1/23
 */

import ContactInfoEdit from './contact-info-edit.vue'
import OrderRequire from './order-require.vue'
import OrderClose from './order-close.vue'
import GoodsList from './order-goods-list.vue'
import OrderExpress from './order-express.vue'
import DeliverInfo from './deliver-info.vue'
import AddComment from './add-comment.vue'
import OrderCertify from './order-certify.vue'
import OrderDone from './order-done.vue'
import clientPanel from '@/page/components/panel/client-info-panel.vue'
import orderModifyRemark from './order-modify-remark.vue'
import goSystem from '@/global/function/go-system'
import orderSalerRemark from '@/page/manage/children/order/children/order-list/components/order-saler-remark'
export default {
  components: {
    DeliverInfo,
    AddComment,
    OrderCertify,
    OrderDone,
    OrderRequire,
    OrderClose,
    GoodsList,
    OrderExpress,
    clientPanel,
    orderModifyRemark,
    orderSalerRemark
  },

  props: {
    orderAllValue: {
      default: (_) => ({})
    },
    // 前端自定义的，后台有这状态？！
    billCertifyStatus: {
      default: (_) => ['未审核', '已通过', '未通过']
    }
  },

  data() {
    return {
      // 是否在加载购卡要求数据
      isSpecificationDataLoading: false,
      // 内部物流公司名
      internalExpressCompanyName: '',
      // 内部物流公司编号
      internalExpressId: '',

      // 显示 打印商品清单弹窗
      printGoodsListDialog: {
        display: false
      },
      // 显示 查看发卡信息 弹窗
      deliverInfoDialog: {
        display: false
      },
      // 显示 添加备注 弹窗
      addCommentDialog: {
        display: false
      },
      // 显示 录入物流信息 弹窗
      orderExpressDialog: {
        display: false
      },
      // 显示 查看购卡要求 弹窗
      orderRequireDialog: {
        display: false
      },
      // 是否显示关闭订单弹窗
      closeOrderDialog: {
        display: false
      },
      // 显示联系信息修改弹
      contactInfoEditDialog: {
        display: false
      },
      orderCertifyDialog: {
        display: false,
        certifyWinSize: 'tiny',
        quickCloseCertifyWin: true,
        certifyMode: 'nav' // nav-审核导航，company-企业审核
      },
      // 支付信息
      payinfoDialog: {
        display: false,
        data: {}
      },
      // 完成订单
      orderDoneDialog: {
        display: false
      },
      modifyRemark: {
        display: false,
        remark: '',
        orderNo: ''
      }
    }
  },

  computed: {
    // 订单编号
    billId() {
      return this.orderAllValue.orderNo
    },
    // 订单序列号
    billSerialId() {
      return this.orderAllValue.id
    },
    // 快递单号
    expressId() {
      return this.orderAllValue.logisticsNo || ''
    },
    // 订单状态
    billStatus() {
      return this.orderAllValue.status
    },
    // 联系人信息
    contactInfo() {
      return JSON.parse(this.orderAllValue.contactInfo) || {}
    },
    // 企业信息审核状态描述
    companyCertifyStatusText() {
      const { eqStatus, lpStatus } = this.orderAllValue
      return `执照-${this.enums.qualificationStatus.get(
        eqStatus
      )}，法人-${this.enums.qualificationStatus.get(lpStatus)}`
    },
    // 是否已经发卡
    isDelivered() {
      const states = this.enums.orderStatus.includes('DELIVERED', 'DONE', 'REFUND')
      return states.has(this.billStatus)
    },
    // 是否已经收货
    isReceive() {
      const states = this.enums.orderStatus.includes('DONE', 'REFUND')
      return states.has(this.billStatus)
    },
    // 是否可关闭订单
    isCancelable() {
      const states = this.enums.orderStatus.includes(
        'PAYMENT',
        'REVIEW',
        'REVIEW-FAILD',
        'DELIVERING',
        'OUTPUTING',
        'WAITING-PURCHASE',
        'PURCHASING'
      )
      return states.has(this.billStatus)
    },
    // 是否可以审核订单
    isCertifyable() {
      const states = this.enums.orderStatus.includes('REVIEW', 'REVIEW-FAILD')
      return states.has(this.billStatus)
    },
    // 是否有物流信息
    hasExpressInfo() {
      return this.internalExpressCompanyName.length || this.internalExpressId.length
    },
    // 快递单号查询链接
    searchExpressURL() {
      if (this.internalExpressCompanyName.indexOf('顺丰') >= 0) {
        return `http://www.sf-express.com/cn/sc/dynamic_function/waybill/#search/bill-number/${this.expressId}`
      }
      return 'https://www.baidu.com/s?wd=' + this.expressId
    },
    // 订单审核状态 0-未审 1-通过 2-拒绝
    billCertifyState() {
      switch (this.billStatus) {
        case 'PAYMENT':
        case 'REVIEW':
          return 0
        case 'REVIEW-FAILD':
          return 2
        default:
          return 1
      }
    }
  },

  mounted() {
    this.internalExpressCompanyName = this.orderAllValue.logisticsCompany || ''
    this.internalExpressId = this.expressId
  },

  beforeUpdate() {
    this.internalExpressCompanyName = this.orderAllValue.logisticsCompany || ''
    this.internalExpressId = this.expressId
  },

  methods: {
    onSalerRemark() {
      this.$emit('reloadbills')
    },
    handleSalerRemark(remark, orderNo) {
      this.$refs.orderSalerRemark.open({
        remark,
        orderNo
      })
    },
    // 统一关闭弹窗
    closeDialog(dialogName, args) {
      let [refresh] = args
      this[dialogName].display = false
      if (refresh) {
        this.$emit('reloadbills')
      }
    },
    // 发货信息
    onOpenDeliverInfoDialog() {
      if (this.isDelivered) {
        this.deliverInfoDialog.display = true
      }
    },
    // 订单物流
    onOpenOrderExpressDialog() {
      if (this.orderAllValue.baseOperationId) {
        this.orderExpressDialog.display = true
      } else {
        this.shortcuts.msg('订单所购卡未出库，请先出库！', 'error')
      }
    },
    // 查看审核状态点击回调
    onOpenOrderCertifyDialog() {
      if (this.isCertifyable) {
        this.orderCertifyDialog.display = true
      }
    },
    // 查看支付信息
    async onOpenPayinfoDialog() {
      this.payinfoDialog.display = true
      try {
        const ret = await this.jaxLib.bill.payinfo.get(this.billId)

        if (ret.success) {
          this.payinfoDialog.data = ret.data
        } else {
          this.payinfoDialog.display = false
          this.shortcuts.notify(ret.message, '操作失败', 'error')
        }
      } catch (err) {
        this.payinfoDialog.display = false
        console.error('onLookPayInfo:', err)
      }
    },
    // 完成订单点击回调
    onOpenOrderDoneDialog() {
      if (this.billStatus === 'DELIVERED') {
        this.orderDoneDialog.display = true
      }
    },
    // 审核弹窗关闭回调
    switchCertifyMode(mode) {
      // nav: 订单审核
      // company: 客户认证信息审核
      if (mode === 'nav') {
        this.orderCertifyDialog.certifyWinSize = 'tiny'
        this.orderCertifyDialog.quickCloseCertifyWin = true
        this.orderCertifyDialog.certifyMode = 'nav'
      } else if (mode === 'company') {
        // 切换至企业审核模式
        this.orderCertifyDialog.certifyMode = 'company'
        this.orderCertifyDialog.certifyWinSize = 'full'
        this.orderCertifyDialog.quickCloseCertifyWin = false
      }
    },
    // 订单审核
    onOrderCertifyDialogClose() {
      // 如果是审核模式，可能用户认证状态已改变，需要刷新页面
      if (this.orderCertifyDialog.certifyMode === 'company') {
        this.$emit('reloadbills')
      }
      this.switchCertifyMode('nav')
    },
    // 切换路由
    enterRouter(val) {
      this.$router.push({ name: val, query: { id: this.billId } })
    },
    onModifyRemark(remark, orderNo) {
      this.modifyRemark.remark = remark
      this.modifyRemark.orderNo = orderNo
      this.modifyRemark.display = true
    },
    // 超级登录
    async goSystem(billId) {
      const orgId = this.orderAllValue.orgId
      let preRst = await this.jaxLib.customer.list.orgHasUser({ orgId: orgId })
      if (!preRst.success || !preRst.data) return false
      goSystem(preRst.data.id, this.pointOrgName, `/#/online/records??billId=${billId}`)
    }
  }
}
</script>

<template>
  <el-card v-loading="isSpecificationDataLoading" class="bill-card">
    <div slot="header" class="bill-card__head">
      <div class="bill-card__head-createTime">
        {{ orderAllValue.gmtCreated }}
      </div>
      <div class="bill-card__head-billId" @click="goSystem(billId)">
        {{ billId }}
      </div>
      <div class="bill-card__status">
        <el-tooltip content="订单状态">
          <el-tag :type="billStatus === 'REVIEW-FAILD' ? 'danger' : 'gray'"
            >{{ billStatus | orderStatusFilter }}
          </el-tag>
        </el-tooltip>
        <el-tooltip content="订单类型">
          <el-tag>{{ orderAllValue.cardType | cardTypeFilter }}</el-tag>
        </el-tooltip>
        <div class="status-icons">
          <el-tooltip>
            <div slot="content">
              {{ `支付状态：${billStatus != 'PAYMENT' ? '已支付' : '未支付'}` }}
              <br />
              金额:{{ (orderAllValue.money / 10000) | numberFilter }}
              <span v-if="orderAllValue.refundMoney !== 0"
                >退款金额:{{ (orderAllValue.refundMoney / 10000) | numberFilter }}</span
              >
            </div>
            <div
              class="card-status bill-pay"
              :class="{
                positive: billStatus != 'PAYMENT',
                negative: billStatus == 'PAYMENT'
              }"
            >
              付
            </div>
          </el-tooltip>
          <el-tooltip>
            <div slot="content">
              企业审核:{{ companyCertifyStatusText }}
              <span v-if="isCertifyable">
                <br />
                <br />
                订单审核:{{ billStatus | orderStatusFilter }}
              </span>
            </div>
            <div
              class="card-status company-certify"
              :class="{
                positive: billCertifyState === 1,
                negative: billCertifyState === 2
              }"
              @click="onOpenOrderCertifyDialog"
            >
              审
            </div>
          </el-tooltip>
          <el-tooltip :content="`发卡状态：${isDelivered ? '已发卡' : '未发卡'}`">
            <div
              class="card-status bill-deliver"
              :class="{
                positive: isDelivered,
                negative: !isDelivered
              }"
              @click="onOpenDeliverInfoDialog"
            >
              发
            </div>
          </el-tooltip>
          <el-tooltip :content="isReceive ? '已签收' : '未签收'">
            <div
              class="card-status bill-done"
              :class="{
                positive: isReceive,
                negative: !isReceive
              }"
              @click="onOpenOrderDoneDialog"
            >
              收
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="bill-card__body">
      <el-button-group>
        <el-button
          type="info"
          icon="information"
          class="wh-reset-color"
          @click="orderRequireDialog.display = true"
        >
          查看购卡要求
        </el-button>
        <el-button
          type="info"
          icon="document"
          :disabled="orderAllValue.payType !== 'PUBLIC-ACCOUNT'"
          class="wh-reset-color"
          @click="onOpenPayinfoDialog"
        >
          查看支付信息
        </el-button>
      </el-button-group>
      <div class="contact-info">
        <div class="info-title">客户信息</div>
        <div class="info-body">
          <div>
            <span>客户备注</span>
            <span class="contact-info-item">
              <span @click="$alert(orderAllValue.remark, '客户备注')">{{
                orderAllValue.remark
              }}</span>
              <i
                v-if="orderAllValue.status === 'OUTPUTING' || orderAllValue.status === 'REVIEW'"
                class="el-icon-edit ml10"
                @click="onModifyRemark(orderAllValue.remark, orderAllValue.orderNo)"
              >
              </i>
            </span>
          </div>
          <div>
            <span>销售备注</span>
            <span class="contact-info-item">
              <span @click="$alert(orderAllValue.salerRemark, '销售备注')">{{
                orderAllValue.salerRemark
              }}</span>
              <i
                class="el-icon-edit ml10"
                @click="handleSalerRemark(orderAllValue.salerRemark, orderAllValue.orderNo)"
              >
              </i>
            </span>
          </div>
          <div>
            <span>客户名称</span>
            <client-panel :key="orderAllValue.orgId" :org-id="orderAllValue.orgId">
              <span>{{ orderAllValue.orgName }}</span>
            </client-panel>
          </div>
          <div>
            <span>联系人</span>
            <span>{{ contactInfo.user_name }}</span>
          </div>
          <div>
            <span>联系电话</span>
            <span>{{ contactInfo.phone }}</span>
          </div>
          <div>
            <span>送货清单</span>
            <span>
              <!-- 0-不需要 1-需要-->
              <span v-if="orderAllValue.deliveryList === 1" style="font-weight: bold"> 需要 </span>
              <span v-else> 不需要 </span>
            </span>
          </div>
          <div>
            <span>收货地址</span>
            <span class="shipping-address">{{ contactInfo.address }}</span>
          </div>

          <p>
            <el-tooltip v-if="orderAllValue.salesName" content="销售归属" class="salebar">
              <el-tag>{{ orderAllValue.salesName | saleFilter }}</el-tag>
            </el-tooltip>
          </p>
        </div>
      </div>
      <div class="express-info-block">
        <div class="info-title">
          物流信息(
          <span v-if="orderAllValue.freightCollect">到付</span>
          <span v-else-if="!orderAllValue.logisticsFee">包邮</span>
          <span v-else>不包邮</span> )
        </div>
        <div class="info-body">
          <template v-if="hasExpressInfo">
            <div>
              <span>快递公司：</span>
              <span>{{ internalExpressCompanyName }}</span>
            </div>
            <div>
              <span>快递单号：</span>
              <span>
                <a :href="searchExpressURL" target="_blank">{{ internalExpressId }}</a>
              </span>
            </div>
          </template>
          <div v-if="!hasExpressInfo" class="express-info no-express-tip">暂无物流信息</div>
        </div>
      </div>
    </div>
    <div class="bill-card__actions">
      <el-tooltip
        v-if="enums.orderStatus.includes('DELIVERING', 'DELIVERED').has(billStatus)"
        content="填写物流信息"
      >
        <wh-std-icon sign="xe639" class="wh-reset-color" @click="onOpenOrderExpressDialog">
        </wh-std-icon>
      </el-tooltip>
      <el-tooltip
        v-if="
          enums.orderStatus.includes('DELIVERING', 'DELIVERED', 'DONE', 'REFUND').has(billStatus)
        "
        content="打印发货清单"
      >
        <wh-std-icon
          sign="xe649"
          class="wh-reset-color"
          @click="printGoodsListDialog.display = true"
        >
        </wh-std-icon>
      </el-tooltip>
      <el-tooltip v-if="isCancelable" content="关闭订单">
        <wh-std-icon sign="xe68f" class="wh-reset-color" @click="closeOrderDialog.display = true">
        </wh-std-icon>
      </el-tooltip>
      <el-tooltip v-if="billStatus === 'PAYMENT'" content="修改订单">
        <wh-std-icon sign="xe67f" class="wh-reset-color" @click="enterRouter('order-change')">
        </wh-std-icon>
      </el-tooltip>
      <el-tooltip content="添加备注">
        <wh-std-icon sign="xe645" class="wh-reset-color" @click="addCommentDialog.display = true">
        </wh-std-icon>
      </el-tooltip>
    </div>

    <!--发卡信息弹窗-->
    <el-dialog title="发卡信息" :visible.sync="deliverInfoDialog.display">
      <deliver-info
        :bill-id="billId"
        :order-all-value="orderAllValue"
        @lookBillContent="orderRequireDialog.display = true"
      >
      </deliver-info>
    </el-dialog>
    <!--备注弹窗-->
    <el-dialog
      class="add-comment-win"
      title="添加备注"
      :visible.sync="addCommentDialog.display"
      :close-on-click-modal="false"
    >
      <add-comment :bill-id="billId" @close="closeDialog('addCommentDialog', arguments)">
      </add-comment>
    </el-dialog>
    <!--录入物流信息弹窗-->
    <el-dialog
      class="input-express-info-win"
      title="录入物流信息"
      :visible.sync="orderExpressDialog.display"
      :close-on-click-modal="false"
    >
      <order-express
        :bill-id="billId"
        :order-all-value="orderAllValue"
        @close="closeDialog('orderExpressDialog', arguments)"
      >
      </order-express>
    </el-dialog>
    <!--购卡要求表格弹窗-->
    <el-dialog title="购卡要求" width="90%" :visible.sync="orderRequireDialog.display" top="5vh">
      <order-require
        :bill-id="billId"
        :bill-serial-id="billSerialId"
        :order-all-value="orderAllValue"
        :bill-status="billStatus"
        @close="closeDialog('orderRequireDialog', arguments)"
      >
      </order-require>
    </el-dialog>
    <!--关闭订单弹窗-->
    <el-dialog
      title="关闭订单"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="closeOrderDialog.display"
    >
      <order-close
        :order-all-value="orderAllValue"
        :bill-status="billStatus"
        @close="closeDialog('closeOrderDialog', arguments)"
      >
      </order-close>
    </el-dialog>
    <!--审核状态弹窗-->
    <el-dialog
      title="审核状态"
      :close-on-click-modal="orderCertifyDialog.quickCloseCertifyWin"
      :close-on-press-escape="orderCertifyDialog.quickCloseCertifyWin"
      :visible.sync="orderCertifyDialog.display"
      :size="orderCertifyDialog.certifyWinSize"
      class="certify-dialog"
      @close="onOrderCertifyDialogClose"
    >
      <order-certify
        :bill-serial-id="billSerialId"
        :mode="orderCertifyDialog.certifyMode"
        :company-certify-status-text="companyCertifyStatusText"
        :order-all-value="orderAllValue"
        :bill-status="billStatus"
        :is-certifyable="isCertifyable"
        :certify-status="billCertifyStatus[billCertifyState]"
        @close="closeDialog('orderCertifyDialog', arguments)"
        @switchCompanyMode="switchCertifyMode('company')"
      >
      </order-certify>
    </el-dialog>
    <!--收货信息弹窗-->
    <el-dialog
      title="收货信息"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="contactInfoEditDialog.display"
      size="tiny"
    >
      <cont-tacinfo-edit
        :bill-serial-id="billSerialId"
        :name="contactInfo.user_name"
        :phone="contactInfo.phone"
        :address="contactInfo.address"
        @close="closeDialog('contactInfoEditDialog', arguments)"
      >
      </cont-tacinfo-edit>
    </el-dialog>
    <!--查看支付信息弹窗-->
    <el-dialog title="查看支付信息" :visible.sync="payinfoDialog.display">
      <div v-if="payinfoDialog.data.payAccountBank">
        <h3>银行</h3>
        <p>{{ payinfoDialog.data.payAccountBank }}</p>
      </div>
      <div>
        <h3>账户名</h3>
        <p>{{ payinfoDialog.data.payAccountName }}</p>
      </div>
      <div>
        <h3>账号</h3>
        <p>{{ payinfoDialog.data.payAccount }}</p>
      </div>
      <div>
        <h3>支付凭证</h3>
        <p>
          <a :href="payinfoDialog.data.payScreenshot" target="_blank">
            <img :src="payinfoDialog.data.payScreenshot" style="width: 100%" />
          </a>
        </p>
      </div>
      <div>
        <h3>创建时间</h3>
        <p>{{ payinfoDialog.data.gmtCreated }}</p>
      </div>
    </el-dialog>
    <!--完成订单弹窗-->
    <el-dialog title="完成订单" :visible.sync="orderDoneDialog.display">
      <order-done :bill-serial-id="billSerialId" @close="closeDialog('orderDoneDialog', arguments)">
      </order-done>
    </el-dialog>
    <!--打印信息弹窗-->
    <el-dialog
      title="打印"
      :visible.sync="printGoodsListDialog.display"
      :fullscreen="true"
      class="goods-list__dialog"
    >
      <goods-list :bill-id="billId" :order-all-value="orderAllValue"> </goods-list>
    </el-dialog>
    <el-dialog
      title="修改备注"
      :visible.sync="modifyRemark.display"
      width="500px"
      class="goods-list__dialog"
    >
      <order-modify-remark
        :order-no="modifyRemark.orderNo"
        :remark="modifyRemark.remark"
        @close="closeDialog('modifyRemark', arguments)"
      >
      </order-modify-remark>
    </el-dialog>
    <order-saler-remark ref="orderSalerRemark" @confirm="onSalerRemark" />
  </el-card>
</template>
