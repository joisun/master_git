<script>
  /**
   * Create by zeter on 2019-04-08
   */
  import enums from '@/constant/enums'
  import dateFormat from '@/global/filters/date-format'
  import volumeFilter from '@/global/filters/volume-format'
  import materialExtract from '@/global/directive/material-extract'
  import tagExtract from '@/global/directive/tag-extract'
  import { openFilter } from '@/global/filters/word-map'

  const buildProcess = (e) => {
    if (e.importResult !== 'success') return 1
    switch (e.status) {
    case 'inventory':
      return 2
    case 'locked':
      return 2
    case 'delivered':
      if (!(e.runningCardInfoVO && e.runningCardInfoVO.status)) return 3
      switch (e.runningCardInfoVO.status) {
      case 'testing':
        return 4
      case 'level2':
        return 5
      case 'activation':
        return 6
      case 'deactivation':
        return 7
      case 'retired':
        return 8
      default:
        return 8
      }
    default:
      return 8
    }
  }
  const mainList = {
    title: (i) => `
    ICCID ${i.iccid}
    ${i.processData >= 3
      ? `网络${openFilter(i.runningCardInfoVO.carrierStatus)}` : ''
    }
    ${enums.cardStoreStatus.get(i.status)}
    ${i.status === 'locked' ? enums.lockStatus.get(i.lockStatus) : ''}`,
    list: [
      { name: 'MSISDN', value: 'msisdn' },
      { name: 'IMSI', value: 'imsi' },
      { name: 'IP', value: 'ip' },
      { name: '运营商账号', value: 'carrierName', formatter: (name, row) => row.carrierName },
      { name: '类型', value: 'buyCount', formatter: (name, row) => enums.ratePlanType.get(row.type) },
      {
        name: '材质',
        value: 'salesName',
        formatter: (name, row) =>
          materialExtract(null, {
            value: {
              specification: row.cardSpecification,
              material: row.cardMaterial
            }
          })
      },
      { name: '客户', value: 'orgName', show: (item) => item.processData > 3 },
      {
        name: '运营商套餐',
        value: 'ratePlanType',
        formatter: (name, row) => {
          return tagExtract(null, {
            value: {
              ratePlanType: row.ratePlanType,
              validity: row.validity,
              validityUnit: row.validityUnit,
              unlimited: row.unlimited,
              volume: row.totalDataVolume,
              cardPeriod: row.cardPeriod,
              useCountAsVolume: row.useCountAsVolume
            }
          })
        }
      },
      {
        // show: (item) => item.runningCardInfoVO && item.runningCardInfoVO.currentRatePlan,
        show: (item) => false,
        name: '当前套餐',
        value: 'offerType',
        formatter: (name, row) => {
          if (row.status === 'delivered' && row.runningCardInfoVO && row.runningCardInfoVO.currentRatePlan) {
            let k = row.runningCardInfoVO.currentRatePlan
            return tagExtract(null, {
              value: {
                offerType: row.buyCardSpecification.ratePlanType,
                validity: k.validity,
                validityUnit: k.validityUnit,
                unlimited: k.unlimited,
                volume: k.totalDataVolume,
                cardPeriod: row.cardPeriod,
                useCountAsVolume: row.useCountAsVolume
              }
            })
          } else {
            return ''
          }
        }
      }
    ]
  }
  const inQueryList = {
    showCondition: (i) => i.processData > 1,
    title: (i) => `入库 ${dateFormat(i.importDate)}`,
    list: [
      { name: '套餐类型', value: 'type', formatter: (name, row) => enums.ratePlanType.get(row.type) },
      {
        name: '套餐档位',
        value: 'ratePlanType',
        formatter: (name, row) => {
          return tagExtract(null, {
            value: {
              ratePlanType: row.ratePlanType,
              validity: row.validity,
              validityUnit: row.validityUnit,
              unlimited: row.unlimited,
              volume: row.totalDataVolume,
              cardPeriod: row.cardPeriod,
              useCountAsVolume: row.useCountAsVolume
            }
          })
        }
      },
      {
        name: '批次号',
        value: 'importBatchNo'
      },
      {
        name: '入库操作ID',
        value: 'importRecordId'
      },
      { name: '特殊限制', value: 'dbTagNames', formatter: (name, row) => row.dbTagNames ? row.dbTagNames.join('、') : '' }
    ]
  }
  const outQueryList = {
    showCondition: (i) => i.processData > 2,
    title: (i) => `出库 ${dateFormat(i.exportDate)}`,
    list: [
      {
        name: '套餐档位',
        value: 'feeCalType',
        formatter: (name, row) => {
          if (row.status === 'delivered' && row.buyCardSpecification) {
            return tagExtract(null, {
              value: {
                offerType: row.buyCardSpecification.ratePlanType,
                validity: row.buyCardSpecification.ratePlanType === 'CUSTOM'
                  ? row.buyCardSpecification.validity / row.buyCardSpecification.rechargeUnit
                  : row.buyCardSpecification.validity,
                validityUnit: row.buyCardSpecification.validityUnit,
                volume: row.buyCardSpecification.volume,
                cardPeriod: row.cardPeriod,
                useCountAsVolume: row.useCountAsVolume
              }
            })
          } else {
            return ''
          }
        }
      },
      {
        name: '激活宽限期',
        value: 'activeDuration',
        formatter: (name, row) => `${row.runningCardInfoVO.activeDuration}天`
      },
      {
        name: '测试期',
        value: 'cardMaterial',
        formatter: (name, row) => `${row.runningCardInfoVO.testingDurationMonth}个月`
      },
      { name: '首次激活时间',
        value: 'cardFee',
        show: (item) => !!item.runningCardInfoVO.dateStartUseData,
        formatter: (name, row) => `${dateFormat(row.runningCardInfoVO.dateStartUseData || '')}` },
      { name: '出库操作ID', value: 'exportRecordId' },
      { name: '标签', value: 'bcsTagNames', formatter: (name, row) => row.bcsTagNames ? row.bcsTagNames.join('、') : '' }
    ]
  }
  const testQueryList = {
    showCondition: (i) => i.processData > 3,
    title: (i) => '测试期',
    list: [
      { name: '开始时间',
        value: 'supportSms',
        show: (item) => !!item.runningCardInfoVO.testingStartDate,
        formatter: (name, row) => dateFormat(row.runningCardInfoVO.testingStartDate || '') },
      { name: '实际结束时间',
        value: 'feeCalType',
        show: (item) => !!item.runningCardInfoVO.testingEndDate,
        formatter: (name, row) => dateFormat(row.runningCardInfoVO.testingEndDate) },
      {
        name: '测试期流量',
        value: 'supportTestingCard',
        formatter: (name, row) => volumeFilter(row.runningCardInfoVO.testingDataVolume, true, true)
      }
    ]
  }
  const activedQueryList = {
    showCondition: (i) => i.processData > 5,
    title: (i) => '激活',
    list: [
      {
        name: '激活时间',
        value: 'supportSms',
        formatter: (name, row) => dateFormat(row.runningCardInfoVO.dateActivated)
      },
      {
        name: '当前套餐开始',
        value: 'feeCalType',
        formatter: (name, row) =>
          row.runningCardInfoVO.currentRatePlan
            ? dateFormat(row.runningCardInfoVO.currentRatePlan.effectiveDate)
            : ''
      },
      {
        name: '当前套餐结束',
        value: 'supportTestingCard',
        formatter: (name, row) =>
          row.runningCardInfoVO.currentRatePlan
            ? dateFormat(row.runningCardInfoVO.currentRatePlan.expirationDate)
            : ''
      },
      {
        name: '当前网络状态',
        value: 'carrierStatus',
        formatter: (name, row) => openFilter(row.runningCardInfoVO.carrierStatus)
      },
      {
        name: '当前套餐规格',
        value: 'feeCalType',
        formatter: (name, row) => {
          if (row.runningCardInfoVO.currentRatePlan) {
            if (row.useCountAsVolume) {
              return `${row.runningCardInfoVO.currentRatePlan.totalDataVolume}次`
            } else {
              return dateFormat(row.runningCardInfoVO.currentRatePlan.expirationDate)
            }
          } else {
            return ''
          }
        }
      },
      {
        show: (item) => {
          return item.runningCardInfoVO.isAclPolicyApp && item.runningCardInfoVO.aclSwitchers && item.runningCardInfoVO.aclSwitchers[0]
        },
        name: '子套餐A',
        value: 'aclSwitchers',
        formatter: (name, row) => {
          if (row.useCountAsVolume) {
            return `${row.runningCardInfoVO.aclSwitchers[0].policyName}-${row.runningCardInfoVO.aclSwitchers[0].volumeThreshold}次`
          } else {
            return `${row.runningCardInfoVO.aclSwitchers[0].policyName}-${volumeFilter(row.runningCardInfoVO.aclSwitchers[0].volumeThreshold)}`
          }
        }
      },
      {
        show: (item) => {
          return item.runningCardInfoVO.isAclPolicyApp && item.runningCardInfoVO.aclSwitchers && item.runningCardInfoVO.aclSwitchers[1]
        },
        name: '子套餐B',
        value: 'aclSwitchers',
        formatter: (name, row) => {
          if (row.useCountAsVolume) {
            return `${row.runningCardInfoVO.aclSwitchers[1].policyName}-${row.runningCardInfoVO.aclSwitchers[1].volumeThreshold}次`
          } else {
            return `${row.runningCardInfoVO.aclSwitchers[1].policyName}-${volumeFilter(row.runningCardInfoVO.aclSwitchers[1].volumeThreshold)}`
          }
        }
      }
    ]
  }
  const retiredQueryList = {
    showCondition: (i) => i.processData > 7,
    title: (i) => `销卡 ${dateFormat(i.runningCardInfoVO.dateRetired)}`,
    list: [
      { name: '销卡原因', value: 'supportSms', formatter: (name, row) => row.runningCardInfoVO.retiredReason }
    ]
  }
  const showList = { inQueryList, outQueryList, testQueryList, activedQueryList, retiredQueryList }
  export default {
    name: 'card-info-panel',
    data() {
      return {
        time: 0,
        content: {},
        queryList: [],
        loading: false,
        showList,
        mainList
      }
    },
    props: {
      placement: {
        default: 'top',
        type: String
      },
      iccid: {
        required: true
      }
    },
    methods: {
      async getData() {
        this.loading = true
        let rst = await this.jaxLib.card.detail({ iccid: this.iccid })
        this.loading = false
        if (!rst.success) {
          this.content = null
          return false
        }
        this.content = rst.data
        this.content.processData = buildProcess(rst.data)
      },
      async show() {
        if (this.time === 0) {
          this.getData()
        }
        this.time++
      }
    }
  }
</script>

<template>
  <el-popover class="order-info-panel" ref="popover" :placement="placement" trigger="hover" @show="show" width="600">
    <div class="box-card wh-panel-card order-panel" v-loading="loading" >
      <el-collapse :value="['1']" v-if="content">
        <el-collapse-item name="1">
          <template slot="title">
            {{mainList.title(content)}}
          </template>
          <div class="wh-panel-card__group">
            <div v-for="(o, index) in mainList.list" :key="index" class="wh-panel-card__item" v-if="o.show ? o.show(content) : true">
              {{o.name}}: {{o.formatter ? o.formatter(o.value, content) : content[o.value]}}
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item v-for="(i, index) in showList" :key="index" v-if="i.showCondition(content)">
          <template slot="title">
            {{i.title(content)}}
          </template>
          <div class="wh-panel-card__group">
            <div v-for="(o, index) in i.list" :key="index" v-if="o.show ? o.show(content) : true" class="wh-panel-card__item">
              {{o.name}}: {{o.formatter ? o.formatter(o.value, content) : content[o.value]}}
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div v-else class="tac">该卡详情查询失败,请排查是否清楚或有其他异常</div>
    </div>
    <slot slot="reference"></slot>
  </el-popover>
</template>
