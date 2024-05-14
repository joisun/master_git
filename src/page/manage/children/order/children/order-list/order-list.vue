<script>
/**
 * Create by gzj on 17/1/23
 */
import moment from 'moment'

import BillCard from './components/order-card.vue'
import WhSaleSelect from '@/page/components/wh-sales-select.vue'

export default {
  components: {
    BillCard,
    'wh-sales-select': WhSaleSelect
  },

  data() {
    return {
      // 订单数据
      bills: [],

      // 筛选条件
      filter: {
        order_no: '',
        logisticsNo: '',
        customer_name: '',
        bill_status: '',
        timeRange: null,
        delivery_date: '',
        sales_name: '',
        card_type: '',
        testFilterCheck: true,
        vpdnOnlyOrder: false
      },

      // 分页信息
      pager: {
        // 当前页码
        pageNo: 1,
        // 每页总数
        pageSize: 6,
        // 记录总数
        totalAmount: 49
      },

      // 是否正在加载订单列表
      isBillLoading: false
    }
  },

  computed: {},
  watch: {
    '$route.query.order_no'(newValue) {
      if (newValue) {
        this.filter.order_no = newValue
        this.jumpTo()
      }
    }
  },

  mounted() {
    this.filter.order_no = this.$route.query.id ? `${this.$route.query.id}` : ''
    this.filter.bill_status = this.$route.query.status ? `${this.$route.query.status}` : ''
    this.jumpTo()
  },
  activated() {
    this.jumpTo()
  },
  methods: {
    async getData(param) {
      let ret
      try {
        ret = await this.jaxLib.bill.query(param)
      } catch (err) {
        this.isBillLoading = false
        console.error('获取订单页失败! pageNo:', param.page_index, 'err:', err)
        return
      }
      this.isBillLoading = false
      if (ret.success) {
        this.bills = ret.data.list
        this.pager.totalAmount = ret.data.page.allCount
      }
    },

    /**
     * 获取订单列表页面
     * @param pageNo {int} 页码
     * @param successCB {function(ret)} 操作成功回调
     * @param failCB {function(err)} 操作失败回调
     */
    jumpTo(pageNo = 1) {
      const filter = this.filter
      this.isBillLoading = true
      const queryParam = Object.assign({
        pageSize: this.pager.pageSize,
        pageIndex: pageNo,
        logisticsNo: filter.logisticsNo,
        status: filter.bill_status,
        gmtCreatedStart: filter.timeRange
          ? moment(filter.timeRange[0]).format('YYYY-MM-DD 00:00:00')
          : '',
        gmtCreatedEnd: filter.timeRange
          ? moment(filter.timeRange[1]).format('YYYY-MM-DD 00:00:00')
          : '',
        orderNo: filter.order_no.trim(),
        deliveryDate: filter.delivery_date,
        orgName: filter.customer_name.trim(),
        salesName: filter.sales_name,
        cardType: filter.card_type,
        enableFilter: filter.testFilterCheck ? 'on' : 'off'
      })
      if (filter.vpdnOnlyOrder) {
        queryParam.vpdnOnlyOrder = filter.vpdnOnlyOrder
      }
      this.pager.pageNo = pageNo
      this.getData(queryParam)
    },

    /**
     * 重载页面
     * @param pageNo {int} 载入的页码，不指定则重载当前页
     */
    reloadPage(pageNo) {
      // this.filter.delivery_date = ''
      this.jumpTo(pageNo || this.pager.pageNo)
    },
    // 快速查询
    loadBills(mode) {
      this.filter.delivery_date = ''
      this.filter.bill_status = mode
      this.filter.order_no = ''
      this.filter.logisticsNo = ''
      this.filter.customer_name = ''
      this.filter.timeRange = null
      this.jumpTo()
    },
    onSearchClick() {
      this.filter.delivery_date = ''
      this.jumpTo()
    }
  }
}
</script>

<template>
  <div class="bill-manager">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">订单列表</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--search">
          <el-input
            v-model="filter.order_no"
            placeholder="请输入订单编号"
            class="wh__tools--search-input"
            style="width: 200px"
            @keyup.enter.native="onSearchClick"
          >
          </el-input>
          <el-input
            v-model.trim="filter.logisticsNo"
            placeholder="请输入快递编号"
            class="wh__tools--search-input"
            style="width: 150px"
            @keyup.enter.native="onSearchClick"
          >
          </el-input>
          <el-input
            v-model="filter.customer_name"
            placeholder="客户账号或ID"
            class="wh__tools--search-input"
            style="width: 120px"
            @keyup.enter.native="onSearchClick"
          >
          </el-input>
          <el-date-picker
            v-model="filter.timeRange"
            :editable="false"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            type="daterange"
            style="width: 210px"
            class="wh__tools--search-filter"
            @change="onSearchClick"
          >
          </el-date-picker>
          <el-select
            v-model="filter.bill_status"
            placeholder="订单状态"
            class="wh__tools--search-filter"
            style="width: 150px"
            clearable
            @change="onSearchClick"
          >
            <el-option
              v-for="s in enums.orderStatus.entries()"
              :key="s[0]"
              :label="s[1]"
              :value="s[0]"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="filter.card_type"
            placeholder="订单类型"
            class="wh__tools--search-filter"
            style="width: 150px"
            clearable
            @change="onSearchClick"
          >
            <el-option
              v-for="(label, value) in enums.cardType.maps()"
              :key="value"
              :label="label"
              :value="value"
            >
            </el-option>
          </el-select>
          <wh-sales-select
            v-model="filter.sales_name"
            placeholder="销售归属"
            @change="onSearchClick"
          >
          </wh-sales-select>
          <el-button icon="el-icon-search" type="primary" @click="onSearchClick"> 搜索 </el-button>
        </div>
        <div class="wh__tools--operate">
          快速查询
          <el-button-group>
            <el-button
              v-for="(label, value) in enums.orderStatus
                .excludes('REVIEW-FAILD', 'DONE', 'CLOSE', 'REFUND')
                .maps()"
              :key="value"
              @click="loadBills(value)"
            >
              {{ label }}
            </el-button>
          </el-button-group>
          <el-checkbox v-model="filter.testFilterCheck" @change="onSearchClick"
            >隐藏测试账号订单</el-checkbox
          >
          <el-checkbox v-model="filter.vpdnOnlyOrder" @change="jumpTo(1)"
            >仅显示VPDN订单</el-checkbox
          >
        </div>
      </div>
      <div class="wh__body">
        <div v-loading="isBillLoading" class="wh__body--table">
          <div v-if="bills.length !== 0" class="outbox-card bill-manager__cards">
            <bill-card
              v-for="b in bills"
              :key="b.id"
              :order-all-value="b"
              @reloadbills="reloadPage"
            >
            </bill-card>
            <div class="reset-float"></div>
          </div>
          <div v-else class="outbox-card bill-manager__cards">
            <div class="outbox-card__none">暂无数据</div>
          </div>
        </div>
        <el-pagination
          :current-page="pager.pageNo"
          :page-size="pager.pageSize"
          layout="prev, pager, next, jumper"
          :total="pager.totalAmount"
          class="wh__body--page"
          @current-change="reloadPage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
