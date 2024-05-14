<script>
/**
 * Create by zeter on 2017/9/20
 */
import _ from 'lodash'
import moment from 'moment'
import NbParams from '@/page/components/nb-params/nb-params'

const iccidHelper = (iccids) =>
  iccids
    ? iccids
        .split('\n')
        .filter((e) => e.length)
        .join(',')
    : ''
export default {
  components: {
    NbParams
  },
  filters: {
    dateCalculator(val) {
      let nowDate = new Date(moment().format('YYYY-MM-DD 23:59:59'))
      let activeDate = new Date(val)
      return val ? (activeDate.getTime() - nowDate.getTime()) / (24 * 60 * 60 * 1000) : 0
    },
    functionFilter(item) {
      return `${item.type === 'POOL' ? '流量池' : ''}
        ${
          !item.supportSms
            ? ''
            : item.monthlySmsPackage
            ? '短信月包'
            : item.yearlySmsPackage
            ? '短信年包'
            : '永久短信'
        }
        ${item.realnameRequire ? '实名认证' : ''}
        ${item.locationService ? '定位' : ''}
        ${item.cardDeviceBundling ? '机卡绑定' : ''}
        ${item.apnSetting ? 'apn设置' : ''}`
    }
  },
  data() {
    let orderNo = this.$route.query.orderNo
    return {
      limitConfig: [
        {
          label: '机卡绑定',
          key: 'ICCID_BIND_IMEI'
        },
        {
          label: '区域限制',
          key: 'REGIONAL_RESTRICTIONS'
        },
        {
          label: '限额',
          key: 'VOLUME_LIMIT'
        },
        {
          label: '个人实名',
          key: 'PERSONAL_REAL_NAME'
        },
        {
          label: '人联网限制',
          key: 'INTERNET_OF_PEOPLE_RESTRICTIONS'
        }
      ],
      defaultLimit: {
        cmcc: {
          ICCID_BIND_IMEI: true,
          REGIONAL_RESTRICTIONS: true,
          VOLUME_LIMIT: false,
          PERSONAL_REAL_NAME: false,
          INTERNET_OF_PEOPLE_RESTRICTIONS: true
        },
        chinanet: {
          ICCID_BIND_IMEI: true,
          REGIONAL_RESTRICTIONS: false,
          VOLUME_LIMIT: false,
          PERSONAL_REAL_NAME: false,
          INTERNET_OF_PEOPLE_RESTRICTIONS: true
        },
        unicom: {
          ICCID_BIND_IMEI: true,
          REGIONAL_RESTRICTIONS: false,
          VOLUME_LIMIT: false,
          PERSONAL_REAL_NAME: false,
          INTERNET_OF_PEOPLE_RESTRICTIONS: true
        }
      },
      loading: false,
      searchForm: {
        stateInput: orderNo || '',
        testFilterCheck: false
      },
      orderList: [],
      order: '',
      form: {
        remark: '',
        list: []
      },
      mouthsList: [
        '1个月',
        '2个月',
        '3个月',
        '4个月',
        '5个月',
        '6个月',
        '7个月',
        '8个月',
        '9个月',
        '10个月',
        '11个月',
        '12个月'
      ],
      postLoading: false,
      priceOfferCategoryList: [],
      carrierPriceOfferCategoryList: {},
      strategyList: [],
      strategyListLoading: false
    }
  },
  computed: {
    // 需要提交的计算列
    buyCardList() {
      return this.order.buyCardSpecificationVoList
    }
  },
  created() {
    this.querySearch = _.debounce(async () => {
      this.loading = true
      let rst = await this.jaxLib.card.orderSearch({
        queryStr: this.searchForm.stateInput,
        enableFilter: !this.searchForm.testFilterCheck ? 'on' : 'off'
      })
      this.loading = false
      if (rst.success) {
        this.orderList = rst.data.orderList
      }
    }, 500)
  },
  mounted() {
    this.querySearch()
    // this.getPriceOfferCategoryList()
  },
  methods: {
    async getStrategy(row) {
      this.strategyListLoading = true
      if (this.carrierPriceOfferCategoryList[row.carrier]) {
        this.priceOfferCategoryList = this.carrierPriceOfferCategoryList[row.carrier]
      } else {
        const list = await this.getPriceOfferCategoryList(row.carrier)
        this.carrierPriceOfferCategoryList[row.carrier] = list
        this.priceOfferCategoryList = list || []
      }
      const res = this.priceOfferCategoryList.find((item) =>
        (item.priceOfferCategoryIds || '').split(',').includes(`${row.priceOfferCategory.id}`)
      )
      this.strategyList = (res || {}).carrierAccountNameList || []
      this.strategyListLoading = false
    },
    async getPriceOfferCategoryList(carrier) {
      let rst = await this.jaxLib.store.deviceBaseExportStrategyList({
        carrier: (carrier || '').toLowerCase()
      })
      if (!rst.success) return false
      return rst.data
    },
    onTestDeadlineChange(index) {
      this.onMouthChange(index)
    },
    // 返回卡管理
    backManager() {
      this.$router.push({ name: 'order-list' })
    },
    // 点击订单事件
    nextStep(item) {
      const now = Date.now()
      let nowDate = new Date(moment().format('YYYY-MM-DD 23:59:59'))
      const objCreate = (i) => ({
        id: i.id,
        iccids: '',
        ossFileUrl: [],
        // realnameRequired: !!i.realnameRequire,
        testDeadline: '',
        testingDataVolume: '',
        imeiForceBinding: false,
        activeDuration: moment(
          nowDate.getTime() + i.activationDuration * 24 * 60 * 60 * 1000
        ).format('YYYY-MM-DD 23:59:59'),
        testDeadlineShow: !!i.supportTestingCard,
        imeiForceBindingShow: !!i.aclPolicyApp,
        mouth: i.activationDuration % 30 === 0 ? i.activationDuration / 30 : null,
        ...(this.defaultLimit[i.carrier.toLowerCase()] || {})
      })
      this.form.list = item.buyCardSpecificationVoList.map((e) => objCreate(e))
      this.order = {
        ...item,
        contactInfo: item.contactInfo ? JSON.parse(item.contactInfo) : {}
      }
      this.$forceUpdate()
    },
    // 清空原订单
    resetFormOrder() {
      this.order = ''
      this.form = {
        remark: '',
        list: []
      }
    },
    // 更改文件
    changeFile(e, index) {
      this.form.list[index].ossFileUrl = [{ name: e.data.filePosition }]
    },
    delFile(index) {
      this.form.list[index].ossFileUrl = []
      return true
    },
    async onIccidChange(item) {
      // 暂时先不做
      // const params = {
      //   iccids: item.iccids.split('\n'),
      //   bcsId: item.id
      // }
      // const res = await this.jaxLib.card.getOrderCost(params)
      // if (res.success) {
      //   item = {
      //     ...item,
      //     ...res.data
      //   }
      // }
    },
    genLimitations(formData) {
      return this.limitConfig
        .filter((item) => formData[item.key])
        .map((item) => {
          return {
            type: item.key,
            val: item.key === 'VOLUME_LIMIT' ? formData.limitAmount || 100 : ''
          }
        })
    },
    // 确认
    onSubmit() {
      if (!this.validator()) {
        return false
      }
      if (this.postLoading) return false
      let postData = {
        orderNo: this.order.orderNo,
        remark: this.form.remark,
        specification: this.form.list.map((e) => {
          const testDate = e.testDeadlineShow
            ? moment(e.testDeadline).endOf('month').format('YYYY-MM-DD HH:mm:ss')
            : null
          const activeDate = testDate
            ? moment(e.activeDuration).diff(moment(testDate), 'days')
            : moment(e.activeDuration).diff(moment(), 'days')
          const o = {
            bcsId: e.id,
            iccids: e.iccids ? iccidHelper(e.iccids) : null,
            ossFileUrl: e.ossFileUrl.length ? e.ossFileUrl[0].name : null,
            // realnameRequired: e.realnameRequired,
            activeDuration: activeDate,
            testDeadline: testDate,
            testingDataVolume: e.testDeadlineShow ? Number(e.testingDataVolume) * 1024 : null,
            imeiForceBinding: e.imeiForceBinding,
            cardLimitations: this.genLimitations(e)
          }
          for (let v of Object.keys(o)) {
            if (o[v] === null) delete o[v]
          }
          return o
        })
      }
      this.postOutPut(postData)
    },
    // 提交及反应
    async postOutPut(data) {
      this.postLoading = true
      let rst = await this.jaxLib.card.output(data)
      this.postLoading = false
      if (!rst.success) {
        this.$notify({ message: rst.message, title: '出库错误' })
        return false
      }
      this.$message.success('出库操作成功')
      this.querySearch()
      this.resetFormOrder()
    },
    // 校验
    validator() {
      // eslint-disable-next-line no-unused-vars
      for (let i in this.form.list) {
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
    },
    // 取消
    onCancel() {
      this.order = ''
      this.resetFormOrder()
    },
    onMouthChange(index) {
      let newDate = this.form.list[index].testDeadline
        ? moment(this.form.list[index].testDeadline).endOf('month')
        : new Date()
      newDate = this.dateAddDays(newDate, this.form.list[index].mouth)
      this.$set(this.form.list[index], 'activeDuration', newDate)
    },
    dateAddDays(date, months) {
      return moment(date)
        .add(months * 30, 'days')
        .format('YYYY-MM-DD 23:59:59')
    },
    onDatePickerChange(index) {
      if (!this.form.list[index].activeDuration) this.form.list[index].mouth = null
    }
  }
}
</script>

<template>
  <div class="card-export-actor">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">卡出库</h2>
        <span class="wh__header--close">
          <wh-std-icon sign="xe6aa" @click="backManager"></wh-std-icon>
        </span>
      </div>
      <div v-if="!order" v-loading="loading" class="wh__body">
        <div class="card-export-actor__choose">
          <div class="card-export-actor__choose--header">
            <el-input
              v-model="searchForm.stateInput"
              placeholder="请输入订单编号或组织ID"
              icon="el-icon-search"
              class="card-export-actor__choose--header-input"
              @change="querySearch"
            >
            </el-input>
            <el-checkbox v-model="searchForm.testFilterCheck" @change="querySearch"
              >测试订单
            </el-checkbox>
          </div>
          <div class="card-export-actor__choose--body">
            <div class="export-choose">
              <div v-if="orderList.length > 0 || loading">
                <div
                  v-for="(i, index) in orderList"
                  :key="index"
                  class="export-choose__item"
                  @click="nextStep(i, index)"
                >
                  <div class="export-choose__item--title">
                    <div class="export-choose__item--title-one">
                      订单编号:&nbsp;&nbsp;&nbsp;&nbsp;
                      {{ i.orderNo }}
                    </div>
                    <div class="export-choose__item--title-two">组织信息:{{ i.orgName }}</div>
                    <div class="export-choose__item--title-three">总卡量:{{ i.buyCount }}张</div>
                  </div>
                  <div class="export-choose__item--body">
                    <div class="export-choose__item--body-title">
                      订单要求:&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    <div class="export-choose__item--body-list">
                      <div v-for="item in i.buyCardSpecificationVoList" :key="item.id">
                        <p>
                          <span class="export-choose__item--body-content">{{
                            item.carrier | carrierFilter
                          }}</span>
                          <span
                            v-tag-extract="{
                              offerType: item.ratePlanType,
                              validity:
                                item.ratePlanType === 'CUSTOM'
                                  ? item.validity / item.rechargeUnit
                                  : item.validity,
                              validityUnit: item.validityUnit,
                              volume: item.volume,
                              unlimited: item.unlimitedVolume,
                              cardPeriod: item.rechargeUnit,
                              useCountAsVolume: item.useCountAsVolume
                            }"
                            class="export-choose__item--body-content"
                          >
                          </span>
                          <span class="export-choose__item--body-content">{{
                            item.ratePlanType | planTypeMap
                          }}</span>
                          <span class="export-choose__item--body-content"
                            >{{ item.buyCount }}张</span
                          >
                          <span class="export-choose__item--body-content">
                            规格材质:{{ item.cardMaterial | materialTypeFilter
                            }}{{ item.cardSpecification | specificationTypeFilter }}
                          </span>
                          <span v-if="item.priceOfferCategory">
                            <span class="result__body--list-content greyFont"
                              >套餐类型:{{ item.priceOfferCategory.name }}</span
                            >
                          </span>
                        </p>
                        <p>
                          <span
                            v-if="item.ratePlanType === 'MONTHLY'"
                            class="export-choose__item--body-content greyFont"
                          >
                            订购周期:{{ item.validity }}月
                          </span>
                          <span v-else class="export-choose__item--body-content greyFont">
                            订购周期:{{ item.rechargeUnit }}份
                          </span>
                          <span class="export-choose__item--body-content greyFont">
                            测试期:
                            {{ item.supportTestingCard ? `${item.testValidity}个月` : '无' }}
                          </span>
                          <span class="export-choose__item--body-content greyFont">
                            服务功能: {{ item | functionFilter }}
                          </span>
                        </p>
                        <nb-params :data="item" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="export-choose__none">暂无数据</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="wh__body">
        <div class="card-export-actor__result">
          <div class="result__header">
            <div v-if="order" class="export-choose__item export-choose__item--selected">
              <div class="export-choose__item__contact-info">
                <span>客户名称：{{ order.orgName }}</span>
                <span>收件人：{{ order.contactInfo.user_name }}</span>
                <span>联系电话：{{ order.contactInfo.phone }}</span>
              </div>
              <div>收货地址：{{ order.contactInfo.address }}</div>
              <div>
                <span> 订单编号：{{ order.orderNo }} </span>
                <span> 总金额：{{ Number(order.totalMoney) / 10000 }}元 </span>
                <span> 总张数：{{ order.buyCount }}张 </span>
                <span> 运费：{{ Number(order.logisticsFee) / 10000 }}元 </span>
              </div>
              <div>客户备注：{{ order.remark }}</div>
              <div>销售备注：{{ order.salerRemark }}</div>
            </div>
          </div>
          <div class="result__body">
            <div class="result__body--list">
              <div v-for="(item, index) in order.buyCardSpecificationVoList" :key="item.id">
                <div class="result__body--list-item">
                  <div class="result__body--list-index">
                    <span class="export-choose__item--body-content">
                      {{ index + 1 }}
                      <span class="result__body--list-down">{{ item.id }}</span>
                    </span>
                  </div>
                  <div class="result__body--list-title">
                    <el-form label-width="140px" size="mini" class="text-form">
                      <el-form-item label="购卡要求">
                        <span class="export-choose__item--body-content">{{
                          item.carrier | carrierFilter
                        }}</span>
                        <span
                          v-tag-extract="{
                            offerType: item.ratePlanType,
                            validity:
                              item.ratePlanType === 'CUSTOM'
                                ? item.validity / item.rechargeUnit
                                : item.validity,
                            validityUnit: item.validityUnit,
                            volume: item.volume,
                            unlimited: item.unlimitedVolume,
                            cardPeriod: item.rechargeUnit,
                            useCountAsVolume: item.useCountAsVolume
                          }"
                          class="export-choose__item--body-content"
                        ></span>
                        <span class="export-choose__item--body-content">{{
                          item.ratePlanType | planTypeMap
                        }}</span>
                        <span class="export-choose__item--body-content">{{ item.buyCount }}张</span>
                      </el-form-item>
                      <el-form-item v-if="item.priceOfferCategory" label="套餐类型">
                        {{ item.priceOfferCategory.name }}
                        <el-popover
                          placement="right"
                          width="400"
                          trigger="click"
                          @show="getStrategy(item)"
                        >
                          <el-table v-loading="strategyListLoading" :data="strategyList">
                            <el-table-column label="优先级" width="80" type="index" />
                            <el-table-column label="运营商">
                              <template #default="{ row }">{{ row }}</template>
                            </el-table-column>
                          </el-table>
                          <el-button slot="reference" style="margin-left: 8px" type="text"
                            >查看出卡策略</el-button
                          >
                        </el-popover>
                      </el-form-item>
                      <el-form-item label="订购周期">
                        {{
                          item.ratePlanType === 'MONTHLY'
                            ? `${item.validity}月`
                            : `${item.rechargeUnit}份`
                        }}
                      </el-form-item>
                      <el-form-item label="订购周期间隔">
                        {{ item.rechargeUnit }}
                      </el-form-item>
                      <el-form-item label="测试期">
                        {{ item.supportTestingCard ? `${item.testValidity}个月` : '无' }}
                      </el-form-item>
                      <el-form-item label="材质规格">
                        <span
                          :class="{
                            'export-choose__item--body-import': item.cardMaterial === 'CERAMICS'
                          }"
                          >{{ item.cardMaterial | materialTypeFilter
                          }}{{ item.cardSpecification | specificationTypeFilter }}</span
                        >
                      </el-form-item>
                      <el-form-item label="服务功能">
                        {{ item | functionFilter }}
                      </el-form-item>
                      <el-form-item label="APN设置">
                        {{ item.apn }}
                      </el-form-item>
                      <el-form-item label="安全管控">
                        {{ item.safetyControl }}
                      </el-form-item>
                      <el-form-item  label="NB参数">
                        <nb-params :data="item" title=""/>
                      </el-form-item>
                      <!--                      <el-form-item label="运营商实名认证限制">-->
                      <!--                        {{ item.carrierRealName ? '需要' : '不需要' }}-->
                      <!--                      </el-form-item>-->
                    </el-form>
                  </div>
                  <div class="result__body--input">
                    <el-form label-width="120px">
                      <el-form-item label="ICCID">
                        <el-input
                          v-model="form.list[index].iccids"
                          type="textarea"
                          placeholder="请输入ICCID，一个一行。或者上传含有ICCID列的excel文件"
                          class="result__body--input-textarea"
                          @change="onIccidChange(form.list[index])"
                        >
                        </el-input>
                        <el-upload
                          accept="xlsx"
                          name="price-excel"
                          :show-file-list="true"
                          :multiple="false"
                          :limit="1"
                          :file-list="form.list[index].ossFileUrl"
                          :on-success="(file) => changeFile(file, index)"
                          :before-remove="() => delFile(index)"
                          action="/ajax/common/file/upload"
                        >
                          <el-button size="mini"> 点击上传 </el-button>
                          <span slot="tip" style="margin-left: 8px">
                            <span>只能上传excel文件，且必须要有ICCID列</span>
                          </span>
                        </el-upload>
                        <span class="result__body--input-calculate"
                          >已填写
                          {{
                            form.list[index].iccids ? form.list[index].iccids.split('\n').length : 0
                          }}
                          条</span
                        >
                      </el-form-item>
                      <!-- <el-form-item label="实名认证">
                      <el-radio-group v-model="form.list[index].realnameRequired">
                        <el-radio :label="true">需要实名</el-radio>
                        <el-radio :label="false">无需实名</el-radio>
                      </el-radio-group>
                    </el-form-item> -->
                      <el-form-item v-if="form.list[index].testDeadlineShow" label="测试期流量">
                        <el-input
                          v-model="form.list[index].testingDataVolume"
                          type="number"
                          placeholder="填写测试期流量大小"
                          class="result__footer--input"
                        >
                          <template slot="append">M</template>
                        </el-input>
                        <span class="font12"> 前向卡以运营商测试期为准，后向卡以输入为准</span>
                      </el-form-item>
                      <el-form-item v-if="form.list[index].testDeadlineShow" label="测试期结束时间">
                        <el-date-picker
                          v-model="form.list[index].testDeadline"
                          type="month"
                          placeholder="选择月"
                          class="result__footer--input"
                          @change="onTestDeadlineChange(index)"
                        >
                        </el-date-picker>
                        末
                      </el-form-item>
                      <el-form-item label="激活宽限期">
                        <el-select
                          v-model="form.list[index].mouth"
                          placeholder="选择月份"
                          @change="onMouthChange(index)"
                        >
                          <el-option
                            v-for="(item, key) in mouthsList"
                            :key="key"
                            :value="key + 1"
                            :label="item"
                          >
                          </el-option>
                        </el-select>
                        <el-date-picker
                          v-model="form.list[index].activeDuration"
                          type="datetime"
                          :clearable="false"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          default-time="23:59:59"
                          placeholder="选择日期"
                          style="width: 200px"
                          @change="onDatePickerChange(index)"
                        >
                        </el-date-picker>
                        <span v-if="form.list[index].activeDuration"
                          >距离今天还有{{
                            form.list[index].activeDuration | dateCalculator
                          }}天</span
                        >
                      </el-form-item>
                      <!--                      <el-form-item label="卡费成本">-->
                      <!--                        <el-input-number-->
                      <!--                          v-model="form.list[index].cardCost"-->
                      <!--                          :controls="false"-->
                      <!--                          disabled-->
                      <!--                        />-->
                      <!--                      </el-form-item>-->
                      <!-- <el-form-item label="套餐成本">
                      <el-input-number :controls="false" disabled v-model="form.list[index].cost"/>
                    </el-form-item>
                    <el-form-item label="订单类型">
                      <el-select v-model="form.list[index].type" disabled>
                        <el-option v-for="(value, key) in enums.salesIncomeOrderType.maps()" :key="key" :value="key" :label="value"></el-option>
                      </el-select>
                    </el-form-item> -->
                      <el-form-item v-if="form.list[index].imeiForceBindingShow" label="">
                        <el-checkbox v-model="form.list[index].imeiForceBinding"></el-checkbox>
                        机卡强绑定
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
                <div class="compliance-limit">
                  <div class="compliance-limit__title">合规限制</div>
                  <el-form :inline="true" label-width="140px" size="mini">
                    <el-row>
                      <el-col v-for="item in limitConfig" :key="item.key" :span="12">
                        <el-form-item :label="item.label">
                          <el-select v-model="form.list[index][item.key]" placeholder="请选择">
                            <el-option label="是" :value="true" />
                            <el-option label="否" :value="false" />
                          </el-select>
                          <el-input
                            v-if="item.key === 'VOLUME_LIMIT' && form.list[index][item.key]"
                            v-model="form.list[index].limitAmount"
                            style="width: 150px"
                          >
                            <template slot="append">MB</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </div>

              <!--              <compliance-limit :form-data="form" />-->
            </div>
          </div>
          <div class="result__footer">
            <el-form label-width="120px">
              <el-form-item label="备注">
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  class="result__footer--remark"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="card-export-actor__enter">
          <el-button type="primary" :disabled="postLoading" @click="onSubmit">确认出库</el-button>
          <el-button @click="onCancel">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.compliance-limit {
  padding: 20px;
  border: 1px #ddd solid;
}
</style>
