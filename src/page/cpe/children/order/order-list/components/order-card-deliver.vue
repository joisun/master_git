<script>
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import apis from '@/api/ajax'
  import { iccidsTransfer } from '@/global/function/iccids-tool'
  import moment from 'moment'

  export default {
    mixins: [DialogMixin],
    name: 'order-deliver',
    data() {
      return {
        loading: false,
        form: {
          remark: '',
          list: []
        },
        orderInfo: {}
      }
    },
    props: {
      dialogName: {
        default: String
      },
      order: {
        type: Object
      }
    },
    computed: {
      isThreeInOneCard() {
        if (this.order.packageOrders && this.order.packageOrders.length) {
          return this.order.packageOrders[0].isThreeInOneCard
        }
        return false
      },
      isUsePool() {
        if (this.order.packageOrders && this.order.packageOrders.length) {
          return this.order.packageOrders[0].usePool
        }
        return false
      }
    },
    methods: {
      open() {
        this.form.remark = ''
        this.getOrderGoods()
      },
      close() {
        this.$emit('closeDialog', this.dialogName)
      },
      async getOrderGoods() {
        this.loading = true
        let rst = await apis.card.orderSearch({
          queryStr: this.order.packageOrders[0].cardOrderNo,
          searchPackage: true,
          enableFilter: 'off'
        })
        this.loading = false
        if (!rst.success) {
          this.$emit('closeDialog', this.dialogName, true)
          return false
        }
        if (!rst.data || !rst.data.orderList.length) {
          this.$message.error('没有找到该订单对应的卡订单')
          this.$emit('closeDialog', this.dialogName, true)
          return false
        }
        this.orderInfo = rst.data.orderList[0]
        this.createForm(rst.data.orderList[0])
      },
      createForm(data) {
        const now = Date.now()
        const baseActiveTime = 90 * 24 * 60 * 60 * 1000
        const formItemCreate = (i) => ({
          id: i.id,
          carrier: i.carrier,
          iccids: '',
          ossFileUrl: [],
          realnameRequired: !!i.realnameRequire,
          testDeadline: '',
          testingDataVolume: '',
          imeiForceBinding: false,
          activeDuration: new Date(now + baseActiveTime),
          testDeadlineShow: !!i.supportTestingCard,
          imeiForceBindingShow: !!i.aclPolicyApp
        })
        this.form.list = data.buyCardSpecificationVoList.map(e => {
          return { ...formItemCreate(e) }
        })
      },
      async onSubmit() {
        if (!this.validator()) {
          return false
        }
        if (this.postLoading) return false
        const iccidsMap = {}
        if (this.isThreeInOneCard) { // 三合一卡，获取卡号
          const cardIds = iccidsTransfer(this.form.list[0].iccids)
          if (!cardIds.length) {
            return this.$message.warning('请输入三合一卡号')
          }
          const { success, data } = await apis.cpe.threeInOneCardListByCardIds({ cardIds })
          if (!success || !data.cmccIccids) {
            return this.$message({ type: 'warning', message: '不存在的三合一卡号，请重新输入' })
          }
          iccidsMap.CMCC = data.cmccIccids || []
          iccidsMap.UNICOM = data.unicomIccids || []
          iccidsMap.CHINANET = data.chinanetIccids || []
        }
        const firstListItem = this.form.list[0]
        let postData = {
          orderNo: this.order.packageOrders[0].cardOrderNo,
          remark: this.form.remark,
          specification: this.form.list.map(e => {
            const testDeadlineShow = this.isThreeInOneCard ? firstListItem.testDeadlineShow : e.testDeadlineShow
            const testDeadline = this.isThreeInOneCard ? firstListItem.testDeadlineShow : e.testDeadlineShow
            const testingDataVolume = this.isThreeInOneCard ? firstListItem.testingDataVolume : e.testingDataVolume
            const testDate = testDeadlineShow ? moment(testDeadline).endOf('month').format('YYYY-MM-DD HH:mm:ss') : null
            const activeDuration = this.isThreeInOneCard ? firstListItem.activeDuration : e.activeDuration
            const activeDate = testDate
              ? moment(activeDuration).diff(moment(testDate), 'days')
              : moment(activeDuration).diff(moment(), 'days')
            const o = {
              bcsId: e.id,
              iccids: this.isThreeInOneCard ? iccidsMap[e.carrier].join(',') : (e.iccids ? iccidsTransfer(e.iccids).join(',') : null),
              ossFileUrl: e.ossFileUrl.length ? e.ossFileUrl[0].name : null,
              realnameRequired: this.isThreeInOneCard ? firstListItem.realnameRequired : e.realnameRequired,
              activeDuration: activeDate,
              testDeadline: testDate,
              testingDataVolume: testDeadlineShow ? Number(testingDataVolume) * 1024 : null,
              imeiForceBinding: this.isThreeInOneCard ? firstListItem.imeiForceBinding : e.imeiForceBinding
            }
            for (let v of Object.keys(o)) {
              if (o[v] === null) delete o[v]
            }
            return o
          })
        }
        this.postOutPut(postData)
      },
      async postOutPut(data) {
        this.postLoading = true
        let rst = await apis.card.output(data)
        this.postLoading = false
        if (!rst.success) {
          this.$notify({ message: rst.message, title: '出库错误' })
          return false
        }
        this.$message.success('订单出库成功')
        this.$emit('closeDialog', this.dialogName, true)
      },
      validator() {
        for (let i in this.form.list) {
          if (this.isThreeInOneCard && Number(i) > 0) {
            return true // 三合一卡只校验第一个输入模块
          }
          const e = this.form.list[i]
          if (!e.ossFileUrl.length && !e.iccids) {
            this.$message.error(`第${Number(i) + 1}个购卡要求必须填写ICCID或者上传excel`)
            return false
          }
          if (!e.activeDuration) {
            this.$message.error(`第${Number(i) + 1}个购卡要求必须填写激活宽限期`)
            return false
          }
          if (e.testDeadlineShow && !e.testDeadline) {
            this.$message.error(`第${Number(i) + 1}个购卡要求必须填写测试期结束时间`)
            return false
          }
          if (e.testDeadlineShow[i] && !e.testingDataVolume) {
            this.$message.error(`第${Number(i) + 1}个购卡要求必须填写测试期流量大小`)
            return false
          }
        }
        return true
      }
    },
    filters: {
      dateCalculator(val) {
        return val ? moment(val).diff(moment(), 'days') + 1 : 0
      },
      functionFilter(item) {
        return `${item.type === 'POOL' ? '流量池' : ''}
        ${item.supportSms ? '短信接收' : ''}
        ${item.realnameRequire ? '实名认证' : ''}
        ${item.locationService ? '定位' : ''}
        ${item.cardDeviceBundling ? '机卡绑定' : ''}
        ${item.apnSetting ? 'apn设置' : ''}`
      }
    }
  }
</script>

<template>
  <div class="wh__dialog order-deliver" v-loading="loading">
    <el-form :model="form" ref="form" label-width="80px">
      <div class="info">
        <div>
          <span class="title">卡订单号：{{ (order && order.packageOrders && order.packageOrders.length) ? order.packageOrders[0].cardOrderNo : '-'}}</span>
        </div>
        <div class="place">
          <span>收货信息:</span>
          <el-tag>{{order.contactInfoObject.user_name}}</el-tag>
          <el-tag><i class="el-icon-location-information"></i><span>{{order.contactInfoObject.address}}</span></el-tag>
          <el-tag><i class="el-icon-mobile-phone"></i><span>{{order.contactInfoObject.phone}}</span></el-tag>
        </div>
        <div>
          <span>客户信息: </span>
          <el-tag type="success">客户名称: {{order.orgName}}</el-tag>
          <el-tooltip effect="dark" :content="order.remark" placement="top" v-if="order.remark">
            <el-tag type="danger remark">客户备注: {{order.remark}}</el-tag>
          </el-tooltip>
        </div>
      </div>
      <el-form-item :label="isThreeInOneCard ? '购卡要求' : '商品清单'">
        <div class="goods" v-if="this.form.list.length">
          <div
            class="flex item"
            v-for="(item, index) in orderInfo.buyCardSpecificationVoList"
            :key="item.id"
            v-if="!isThreeInOneCard || (isThreeInOneCard && index === 0)"
          >
            <div v-if="!isThreeInOneCard" class="flex2">
              <p class="title">{{index + 1}} 购卡要求({{item.id}})</p>
              <p>
                <span class="export-choose__item--body-content">{{item.carrier | carrierFilter}}</span>
                <span class="export-choose__item--body-content"
                  v-tag-extract="{
                    offerType: item.ratePlanType,
                    validity: item.ratePlanType === 'CUSTOM'
                      ? item.validity / item.rechargeUnit
                      : item.validity,
                    validityUnit: item.validityUnit,
                    volume: item.volume,
                    unlimited: item.unlimitedVolume,
                    cardPeriod: item.rechargeUnit,
                    useCountAsVolume: item.useCountAsVolume,
                  }"></span>
                <span class="export-choose__item--body-content">{{item.ratePlanType | planTypeMap}}</span>
                <span class="export-choose__item--body-content">{{item.buyCount}}张</span>
              </p>
              <p>
                <span v-if="item.priceOfferCategory">套餐类型:<span
                  class="export-choose__item--body-content">{{item.priceOfferCategory.name}}</span></span>
              </p>
              <p>
                <span class="export-choose__item--body-content" v-if="item.ratePlanType==='MONTHLY'">订购周期:{{item.validity}}月</span>
                <span class="export-choose__item--body-content" v-else>订购周期:{{item.rechargeUnit}}份</span>
              </p>
              <p>
                <span class="export-choose__item--body-content">测试期:{{item.supportTestingCard ? `${item.testValidity}个月` : '无'}}</span>
              </p>
              <p>
                <span class="export-choose__item--body-content"
                  :class="{ 'export-choose__item--body-import': item.cardMaterial==='CERAMICS'}">
                  材质规格:{{item.cardMaterial | materialTypeFilter }}{{item.cardSpecification | specificationTypeFilter }}
                </span>
              </p>
              <p>
                <span class="export-choose__item--body-content">服务功能: {{ item | functionFilter }}</span>
              </p>
            </div>
            <div v-else class="flex2">
              <p>&nbsp;</p>
              <p>三合一卡</p>
              <p>流量池：{{isUsePool ? '使用' : '不使用'}}</p>
            </div>
            <div class="flex3">
              <el-form label-width="120px">
                <el-form-item :label="isThreeInOneCard ? '三合一卡号' : 'ICCID'">
                  <el-input type="textarea"
                    v-model="form.list[index].iccids"
                    :placeholder="isThreeInOneCard ? '请输入三合一卡号，一个一行' : '请输入ICCID，一个一行。或者上传含有ICCID列的excel文件'"
                    class="result__body--input-textarea">
                  </el-input>
                  <el-upload
                    v-if="!isThreeInOneCard"
                    accept="xlsx"
                    name="price-excel"
                    :show-file-list="true"
                    :multiple="false"
                    :limit="1"
                    :file-list="form.list[index].ossFileUrl"
                    :on-success="file => changeFile(file, index)"
                    :before-remove="() => delFile(index)"
                    action="/ajax/common/file/upload">
                    <el-button size="mini">
                      点击上传
                    </el-button>
                    <span slot="tip">
                      <span class="font12">
                        上传含有ICCID列的excel文件
                      </span>
                    </span>
                  </el-upload>
                  <span class="font12">已填写
                    {{ form.list[index].iccids ? (form.list[index].iccids).split('\n').length :  0}}
                    条</span>
                </el-form-item>
                <el-form-item label="实名认证">
                  <el-radio-group v-model="form.list[index].realnameRequired">
                    <el-radio :label="true">需要实名</el-radio>
                    <el-radio :label="false">无需实名</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="测试期流量" v-if="form.list[index].testDeadlineShow">
                  <el-input
                    type="number"
                    v-model="form.list[index].testingDataVolume"
                    placeholder="填写测试期流量大小"
                    style="width:200px;"
                    class="result__footer--input">
                    <template slot="append">M</template>
                  </el-input>
                  <div class="font12"> 前向卡以运营商测试期为准，后向卡已输入为准</div>
                </el-form-item>
                <el-form-item label="测试期结束时间" v-if="form.list[index].testDeadlineShow">
                  <el-date-picker
                    v-model="form.list[index].testDeadline"
                    type="month"
                    placeholder="选择月"
                    class="result__footer--input">
                  </el-date-picker>
                  末
                </el-form-item>
                <el-form-item label="激活宽限期">
                  <el-date-picker
                    v-model="form.list[index].activeDuration"
                    type="date"
                    placeholder="选择月"
                    class="result__footer--input">
                  </el-date-picker>
                  <span class="font12" v-if="form.list[index].activeDuration">距今天{{form.list[index].activeDuration | dateCalculator}}天</span>
                </el-form-item>
                <el-form-item label="" v-if="form.list[index].imeiForceBindingShow">
                  <el-checkbox v-model="form.list[index].imeiForceBinding"></el-checkbox>
                  机卡强绑定
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model.trim="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="onSubmit">确认</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
  .order-deliver {
    .img {
      width: 80px;
      height: 60px;
      text-align: left;
      margin-right: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .items-center {
      align-items: center;
    }
    .title{
        &::first-letter{
            font-size: 30px;
            margin-right: 10px;
        }
    }

    .info {
      line-height: 35px;
      font-size: 13px;
      border-bottom: 1px #ddd solid;
      padding-bottom: 10px;
      margin-bottom: 10px;

      & .el-tag {
        margin-right: 10px;
        font-size: 13px;
        padding: 3px 10px;
        height: 30px;
      }

      .remark {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 70%;
        vertical-align: -9px;
      }

      .title {
        font-size: 20px;
        font-weight: 600;
        margin-right: 20px;
      }

      .place {
        vertical-align: middle;
      }
    }

    .item {
      border-bottom: 1px #ddd dashed;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
  }
</style>
