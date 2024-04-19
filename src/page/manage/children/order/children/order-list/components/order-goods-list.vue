<script>
/**
 * Create by zeter on 2018/1/17
 */
import { GOOD_COLUMNS } from '../mixin/consts'
import DialogMixin from '@/global/mixins/dialog-mixin'

export default {
  mixins: [DialogMixin],
  props: {
    orderAllValue: {
      default: {}
    },
    billId: {
      default: ''
    }
  },
  data() {
    return {
      deliveryDateTimestamp: null,
      GOOD_COLUMNS: GOOD_COLUMNS,
      orderGoodsList: {
        cardOrder: {}
      },
      existCmcc: false
    }
  },
  methods: {
    open() {
      this.getList()
    },
    async getList() {
      let rst = await this.jaxLib.bill.getGoodsList.get(this.billId)
      if (!rst.success) return false
      this.orderGoodsList = rst.data
      this.orderGoodsList.bcsDetail = this.orderGoodsList.bcsDetail.map((e) => {
        if (e.bcs.carrier.toLocaleLowerCase() === 'cmcc') {
          this.existCmcc = true
        }
        return { ...e, ...e.bcs }
      })
      const { data = {} } = rst
      this.deliveryDateTimestamp = data.cardOrder.openDate ? data.cardOrder.openDate.time : ''
      // 保证图片加载完毕
      let isLoad = false
      let tImg
      let domImg = document.getElementsByTagName('img')
      const isImgLoad = () => {
        if (domImg[0] === 0 || domImg[1] === 0) {
          isLoad = false
          return false
        }
        if (isLoad) {
          clearTimeout(tImg)
          this.$nextTick(function () {
            this.closeAfterPrint()
          })
        } else {
          isLoad = true
          tImg = setTimeout(() => {
            isImgLoad()
          }, 500)
        }
      }
      isImgLoad()
    },
    closeAfterPrint() {
      if (document.execCommand('print')) {
        this.close()
      } else {
        setTimeout(this.closeAfterPrint(), 1000)
      }
    }
  }
}
</script>

<template>
  <div id="goods-list" class="goods-list">
    <h3 class="goods-list__title">SIMBOSS物联网卡发货清单</h3>
    <div class="goods-list__body">
      <div class="goods-list__body--title">
        <div class="goods-list__body--title-text">
          订单号: {{ orderGoodsList.cardOrder.orderNo }} 总卡量:
          {{ orderGoodsList.cardOrder.buyCount }} 购卡组织: {{ orderAllValue.orgName }}
        </div>
        <div class="goods-list__body--title-time">
          发卡时间: {{ deliveryDateTimestamp | dateFilter }}
        </div>
      </div>
      <table class="goods-list__body--table">
        <thead>
          <tr>
            <th style="width: 7%">套餐</th>
            <th style="width: 7%">运营商</th>
            <th style="width: 12%">材质规格</th>
            <th style="width: 4%">订购周期</th>
            <th
              v-for="(item, index) in GOOD_COLUMNS"
              :key="index"
              :style="{ width: item.width + '%' }"
            >
              {{ item.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(list, i) in orderGoodsList.bcsDetail" :key="i">
            <td
              v-tag-extract="{
                offerType: list.ratePlanType,
                validity: list.validity,
                validityUnit: list.validityUnit,
                volume: list.volume,
                unlimited: list.unlimitedVolume,
                useCountAsVolume: list.useCountAsVolume
              }"
              style="width: 7%"
            ></td>
            <td style="width: 7%">{{ list.carrier | carrierFilter }}</td>
            <td
              v-material-extract="{
                specification: list.cardSpecification,
                material: list.cardMaterial
              }"
              style="width: 12%"
            ></td>
            <td style="width: 4%">
              {{ list.ratePlanType === 'CUSTOMER' ? '1份' : `${list.validity}月` }}
            </td>
            <td
              v-for="(item, index) in GOOD_COLUMNS"
              :key="index"
              :style="{ width: item.width + '%' }"
            >
              {{ item.formatter ? item.formatter(list) : list[item.key] }}
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="orderAllValue.deliveryListRemark"
        style="line-height: 22px; font-size: 16px; margin-top: 8px"
      >
        备注：{{ orderAllValue.deliveryListRemark }}
      </div>
    </div>

    <div class="goods-list__footer flex">
      <div>
        <img
          class="logo"
          src="https://simboss-public.oss-cn-hangzhou.aliyuncs.com/wh/simboss-gray.png"
          alt="simboss"
        />
        <span class="goods-list__footer--font">物联网卡管理专家</span>
        <hr />
        <div class="tips-font">
          <p>温馨提示</p>
          <p>1、企业用户购卡需要提交企业资质。</p>
          <p>2、企业用户可登陆SIMBOSS网站进行物联网卡管理，地址:www.simboss.com。</p>
          <p>
            3、终端用户使用物联网卡前要完成实名认证，SIMBOSS提供微信公众号接入，支持终端用户提交实名认证信息。
          </p>
          <p v-if="existCmcc">
            4、如果物联网卡首次放在您的设备里无法直接上网，请设置APN，具体步骤：设置-移动数据(移动网络)-接入点名称(APN)-新建APN：只需名称、APN两个地方输入cmiotqipeng.js，最后保存，点击启用新建APN，再联网测试。
          </p>
        </div>
      </div>
      <div class="goods-list__footer-img">
        <img
          class="qcCode"
          src="https://simboss-public.oss-cn-hangzhou.aliyuncs.com/wh/simboss-gray-qc-code.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>
