<script>
import Desc from './components/good-desc.vue'
import OrderClose from './components/order-close.vue'
import OrderLogistics from './components/order-logistics.vue'
import OrderModify from './components/order-modify.vue'
import OrderDeliver from './components/order-deliver.vue'
import OrderCardDeliver from './components/order-card-deliver.vue'
import OrderReject from './components/order-reject.vue'
import OrderReturns from './components/order-returns.vue'
import OrderReturnsReview from './components/order-returns-review.vue'
import { mapState } from 'vuex'
import apis from '@/api/ajax'

const changeStatusMap = {
  changing: '换货中',
  changed: '换货完成',
  changeReject: '换货驳回',
  returning: '退货中',
  returned: '退货完成',
  returnReject: '退货驳回'
}

export default {
  name: 'cpe-order-list',
  data() {
    return {
      selectOrder: null,
      changeStatusMap,
      dialogStatus: {
        cancelDialog: false,
        logisticsDialog: false,
        modifyDialog: false,
        deviceDeliverDialog: false,
        rejectDialog: false,
        cardDeliverDialog: false,
        returnsDialog: false, // 退换货
        returnsReviewDialog: false // 退换货审核
      },
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      form: {
        tradeNo: '',
        orgIdOrName: '',
        status: '',
        ignoreTest: true
      },
      loading: false,
      list: []
    }
  },
  watch: {
    '$route.query.tradeNo'(newValue) {
      if (newValue) {
        this.form.tradeNo = newValue
        this.getList()
      }
    }
  },
  computed: {
    ...mapState({
      tradeStatusMap: (state) => state.overall.cpeEnum.tradeStatus
    })
  },
  components: {
    'good-desc': Desc,
    'order-close-dialog': OrderClose,
    'order-logistics-dailog': OrderLogistics,
    'order-modify-dailog': OrderModify,
    'order-deliver-dailog': OrderDeliver,
    'order-card-deliver-dialog': OrderCardDeliver,
    'order-reject-dialog': OrderReject,
    'order-returns': OrderReturns,
    'order-returns-review': OrderReturnsReview
  },
  methods: {
    openAuditDialog(order) {
      const vNode = function (h, o) {
        return (
          <el-form>
            <el-form-item label="订单号">{o.tradeNo}</el-form-item>
            <el-form-item label="客户名称">{o.orgName}</el-form-item>
          </el-form>
        )
      }
      this.$msgbox({
        title: '订单审核',
        message: vNode(this.$createElement, order),
        showCancelButton: true,
        confirmButtonText: '通过',
        cancelButtonText: '驳回',
        distinguishCancelAndClose: true,
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            const { success } = await apis.cpe.postOrderAuditPass({
              tradeNo: order.tradeNo
            })
            if (!success) return false
            this.$message.success('审核成功')
            this.getList()
            done()
          } else if (action === 'cancel') {
            this.selectOrder = order
            this.dialogStatus.rejectDialog = true
            done()
          } else {
            done()
          }
        }
      }).catch(() => {})
    },
    openDialog(name, order) {
      this.selectOrder = order
      this.dialogStatus[name] = true
    },
    closeDialog(name, refresh) {
      this.dialogStatus[name] = false
      if (refresh) {
        this.getList()
      }
    },
    search() {
      this.page.pageIndex = 1
      this.getList()
    },
    async getList() {
      const { pageIndex, pageSize } = this.page
      this.loading = true
      const {
        success,
        data: { list, page }
      } = await apis.cpe.getOrderList({
        pageIndex,
        pageSize,
        ...this.form
      })
      this.loading = false
      if (!success) return false
      this.page.total = page.allCount
      this.list = list.map((e) => {
        e.orders = [...e.packageOrders, ...e.deviceOrders]
        e.contactInfoObject = JSON.parse(e.contactInfo)
        return e
      })
    },
    changPageSize(val) {
      this.page.pageSize = val
      this.getList()
    },
    changPageIndex(val) {
      this.page.pageIndex = val
      this.getList()
    },
    deliver(order) {
      this.selectOrder = order
      if (!(order.packageOrders && order.packageOrders.length)) {
        this.dialogStatus['deviceDeliverDialog'] = true
      } else {
        if (order.cardOutStatus === 'OUTED') this.dialogStatus['deviceDeliverDialog'] = true
        else {
          if (order.cardOutStatus === 'OUTING')
            this.$messgae.warning('订单卡片正在出库，请稍后操作')
          else this.dialogStatus['cardDeliverDialog'] = true
        }
      }
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
<template>
  <div class="order-list">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">订单管理</h2>
      </div>
      <div class="wh__tools--mix">
        <div class="wh__tools--search">
          <el-select
            v-model="form.status"
            clearable
            class="wh__tools--search-select"
            @change="search"
          >
            <el-option
              :label="i.name"
              :value="i.id"
              v-for="i in tradeStatusMap"
              :key="i.id"
            ></el-option>
          </el-select>
          <el-input
            class="wh__tools--search-input"
            placeholder="请输入订单号"
            v-model="form.tradeNo"
            @keyup.native.enter="search"
          >
          </el-input>
          <el-input
            class="wh__tools--search-input"
            placeholder="请输入客户名称或客户ID"
            v-model="form.orgIdOrName"
            @keyup.native.enter="search"
          >
          </el-input>
          <el-checkbox v-model="form.ignoreTest" @change="search">隐藏测试订单</el-checkbox>
        </div>
      </div>
      <div class="wh__body" v-loading="loading">
        <div class="theader flex">
          <div class="flex6">商品</div>
          <div class="flex1">单价</div>
          <div class="flex1">周期</div>
          <div class="flex1">数量</div>
          <div class="flex2">物流</div>
          <div class="flex2">订单金额</div>
          <div class="flex1">订单状态</div>
          <div class="flex3">订单操作</div>
        </div>
        <div class="tbody">
          <div class="item" v-for="item in list" :key="item.id">
            <div class="title">
              <el-tooltip effect="dark" content="订单号" placement="top">
                <el-tag type="success"
                  ><span class="id">{{ item.tradeNo }}</span></el-tag
                >
              </el-tooltip>
              <el-tooltip effect="dark" content="订单生成时间" placement="top">
                <el-tag type="info"
                  ><i class="el-icon-time"></i> {{ item.gmtCreated | (date - filter) }}</el-tag
                >
              </el-tooltip>
              <el-tooltip effect="dark" content="销售归属" placement="top">
                <el-tag type="danger">{{ item.saleName | saleFilter }}</el-tag>
              </el-tooltip>
              <el-tag type="success">{{ item.orgName }} ({{ item.orgId }})</el-tag>
              <el-tag type="info">
                <span>{{ item.contactInfoObject.user_name }}</span> &nbsp;
                <i class="el-icon-location"></i>
                <span>{{ item.contactInfoObject.address }}</span> &nbsp;
                <i class="el-icon-mobile-phone"></i>
                <span>{{ item.contactInfoObject.phone }}</span></el-tag
              >
            </div>
            <div class="goods">
              <ul class="row flex">
                <div class="flex9 border-right">
                  <good-desc
                    v-for="i in item.orders"
                    :key="i.id"
                    :detail="i"
                    :macAddrList="item.macAddrList"
                  ></good-desc>
                </div>
                <div class="flex2 border-right content">
                  <div class="tac">
                    <template v-if="item.logisticsType === 'EXPRESS'">
                      <p>{{ item.logisticsCompany }}</p>
                      <p v-if="item.freightCollect">(到付)</p>
                      <p v-else-if="!item.freightCollect && !item.logisticsFee">(包邮)</p>
                      <p v-else>(￥{{ item.logisticsFee }})</p>
                      <p v-if="item.logisticsNo">
                        <a
                          :href="
                            'https://www.kuaidi100.com/chaxun?com=' +
                            (item.logisticsCompany === '中通' ? 'zhongtong' : 'shunfeng') +
                            '&nu=' +
                            item.logisticsNo
                          "
                          class="link"
                          target="_blank"
                        >
                          <i class="el-icon-link"></i> {{ item.logisticsNo }}
                        </a>
                      </p>
                    </template>
                    <p v-else>自提</p>
                  </div>
                </div>
                <div class="flex2 border-right content">
                  <div>
                    <p>应付: ￥{{ item.totalMoney }}</p>
                    <p
                      v-if="
                        item.status === 'PAYMENT' || (item.status === 'CLOSE' && !item.refundMoney)
                      "
                    >
                      实付: 未支付
                    </p>
                    <p v-else-if="item.status === 'CLOSE' && item.refundMoney">
                      退款: ￥{{ item.refundMoney }}
                    </p>
                    <p v-else>实付: ￥{{ item.totalMoney }}</p>
                  </div>
                </div>
                <div class="flex1 border-right content">
                  <div>
                    <p
                      v-cpe-enum-extract="{
                        original: item.status,
                        category: 'tradeStatus'
                      }"
                    ></p>
                    <p class="color-danger" v-if="changeStatusMap[item.changeStatus]">
                      {{ changeStatusMap[item.changeStatus] }}
                    </p>
                  </div>
                </div>
                <div class="flex3 content">
                  <div class="operate tac">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="openAuditDialog(item)"
                      v-if="item.status === 'REVIEW' || item.status === 'REVIEW-FAILD'"
                    >
                      审核
                    </el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="deliver(item)"
                      v-if="item.status === 'OUTPUTING'"
                    >
                      设备出库
                    </el-button>

                    <el-button
                      type="primary"
                      size="mini"
                      @click="openDialog('logisticsDialog', item)"
                      v-if="item.status === 'DELIVERING'"
                    >
                      发货
                    </el-button>
                    <template v-if="['DELIVERED', 'DONE'].indexOf(item.status) > -1">
                      <el-button
                        v-if="['changing', 'returning'].indexOf(item.changeStatus) === -1"
                        size="mini"
                        @click="openDialog('returnsDialog', item)"
                        type="primary"
                      >
                        申请退换货
                      </el-button>
                      <el-button
                        v-if="['changing', 'returning'].indexOf(item.changeStatus) > -1"
                        size="mini"
                        @click="openDialog('returnsReviewDialog', item)"
                        type="primary"
                      >
                        退换货审核
                      </el-button>
                    </template>
                    <el-button
                      size="mini"
                      @click="openDialog('cancelDialog', item)"
                      v-if="item.status !== 'CLOSE'"
                    >
                      关闭订单
                    </el-button>
                    <el-button
                      size="mini"
                      @click="openDialog('modifyDialog', item)"
                      v-if="item.status === 'PAYMENT'"
                    >
                      修改订单
                    </el-button>
                  </div>
                </div>
              </ul>
            </div>
            <div class="remark">订单备注: {{ item.remark }}</div>
          </div>
        </div>
        <div class="no-data" v-if="!list.length">暂无数据</div>
        <el-pagination
          @size-change="changPageSize"
          @current-change="changPageIndex"
          :current-page="page.pageIndex"
          :page-sizes="[20, 40, 60, 80, 100]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="page.total"
          class="wh__body--page"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="dialogStatus.cancelDialog" title="关闭订单" width="400px">
      <order-close-dialog
        :order="selectOrder"
        dialogName="cancelDialog"
        @closeDialog="closeDialog"
        v-if="dialogStatus.cancelDialog"
      ></order-close-dialog>
    </el-dialog>
    <el-dialog :visible.sync="dialogStatus.logisticsDialog" title="物流信息" width="400px">
      <order-logistics-dailog
        :order="selectOrder"
        dialogName="logisticsDialog"
        @closeDialog="closeDialog"
        v-if="dialogStatus.logisticsDialog"
      ></order-logistics-dailog>
    </el-dialog>
    <el-dialog :visible.sync="dialogStatus.modifyDialog" title="修改订单" width="80%">
      <order-modify-dailog
        :order="selectOrder"
        dialogName="modifyDialog"
        @closeDialog="closeDialog"
        v-if="dialogStatus.modifyDialog"
      ></order-modify-dailog>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogStatus.deviceDeliverDialog"
      title="设备出库"
      width="80%"
      top="10vh"
    >
      <order-deliver-dailog
        :order="selectOrder"
        dialogName="deviceDeliverDialog"
        @closeDialog="closeDialog"
        v-if="dialogStatus.deviceDeliverDialog"
      ></order-deliver-dailog>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogStatus.cardDeliverDialog"
      title="卡片出库"
      width="80%"
      top="10vh"
    >
      <order-card-deliver-dialog
        :order="selectOrder"
        dialogName="cardDeliverDialog"
        @closeDialog="closeDialog"
        v-if="dialogStatus.cardDeliverDialog"
      ></order-card-deliver-dialog>
    </el-dialog>
    <el-dialog :visible.sync="dialogStatus.rejectDialog" title="驳回订单" width="400px">
      <order-reject-dialog
        :order="selectOrder"
        dialogName="rejectDialog"
        @closeDialog="closeDialog"
        v-if="dialogStatus.rejectDialog"
      ></order-reject-dialog>
    </el-dialog>
    <el-dialog :visible.sync="dialogStatus.returnsDialog" title="退换货申请" width="70%">
      <order-returns
        v-if="dialogStatus.returnsDialog"
        :order="selectOrder"
        @closeDialog="closeDialog"
      ></order-returns>
    </el-dialog>
    <el-dialog :visible.sync="dialogStatus.returnsReviewDialog" title="退换货审核" width="70%">
      <order-returns-review
        v-if="dialogStatus.returnsReviewDialog"
        :order="selectOrder"
        @closeDialog="closeDialog"
      ></order-returns-review>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.order-list {
  .theader {
    margin: 10px 0 20px;
    background-color: #ececec;

    & div {
      text-align: center;
      padding: 15px 0;
      font-size: 14px;
    }
  }

  .tbody {
    .item {
      border: 1px #b1acac solid;
      background-color: #fff;
      margin-bottom: 20px;
    }

    .title {
      padding: 8px 10px;
      border-bottom: 1px #b1acac solid;

      .id {
        font-size: 13px;
        font-weight: 600;
        color: #666;
      }

      .el-tag {
        font-size: 13px !important;
        margin: 3px 0;
      }
    }

    .remark {
      font-size: 13px;
      padding: 8px 20px;
      color: #666;
    }

    .content {
      word-break: break-word;
      align-content: center;
      align-items: center;
      justify-content: center;
      display: flex;
      font-size: 14px;
    }

    .operate {
      padding: 10px;

      .el-button {
        margin-bottom: 10px;
      }
    }

    .tac {
      text-align: center;
    }

    .link {
      color: rgb(106, 97, 233);
      text-decoration: aliceblue;
    }

    .goods {
      border-bottom: 1px #ddd solid;
    }

    .border-right {
      border-right: 1px #ddd solid;
    }
  }

  .no-data {
    text-align: center;
    line-height: 20px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #999;
  }
}
</style>
