<script>
  /**
   * Create by zeter on 2019-04-04
   */
  import enums from '@/constant/enums'

  const list = [
    { name: 'ID', value: 'id' },
    { name: '运营商', value: 'carrier', formatter: (name, row) => enums.carrier.get(row[name]) },
    { name: '类型', value: 'type', formatter: (name, row) => enums.planClassType.get(row[name]) },
    { name: '可改套餐', value: 'ALLOW_CHANGE_RATE_PLAN' },
    { name: '可叠加加油包', value: 'ALLOW_APPEND_PACKAGE' },
    { name: '可叠加流量池叠加包', value: 'ALLOW_APPEND_POOL_PACKAGE' },
    { name: 'VPDN', value: 'VPDN_ONLY' },
    { name: 'NB-IOT', value: 'NB_IOT' },
    { name: '可续周期', value: 'ALLOW_EXTEND_PERIOD' },
    { name: '自动续费', value: 'ALLOW_AUTO_RECHARGE' },
    { name: '续费时间限制', value: 'RECHARGE_TIME_LIMIT' }
  ]
  const hasTag = (content, property) => content['tagList'].filter(tag => tag.name === property).length > 0
  export default {
    name: 'price-class-info-panel',
    data() {
      return {
        time: 0,
        list,
        content: {},
        loading: false
      }
    },
    props: {
      placement: {
        default: 'top'
      },
      id: {
        require: true
      }
    },
    computed: {
      classificationList() {
        let classifications = this.$store.getters.getClassificationList()
        return classifications.filter(e => {
          return e.id === this.id
        })[0]
      }
    },
    methods: {
      async getData() {
        let content = this.classificationList
        if (!content) return false
        let hash = {}
        hash['ALLOW_CHANGE_RATE_PLAN'] = hasTag(content, 'ALLOW_CHANGE_RATE_PLAN') ? '支持' : '不支持'
        hash['ALLOW_APPEND_PACKAGE'] = hasTag(content, 'ALLOW_APPEND_PACKAGE') ? '支持' : '不支持'
        hash['ALLOW_EXTEND_PERIOD'] = hasTag(content, 'ALLOW_EXTEND_PERIOD') ? '支持' : '不支持'
        hash['RECHARGE_TIME_LIMIT'] = hasTag(content, 'RECHARGE_TIME_LIMIT') ? '有' : '无'
        hash['ALLOW_APPEND_POOL_PACKAGE'] = hasTag(content, 'ALLOW_APPEND_POOL_PACKAGE') ? '支持' : '不支持'
        hash['ALLOW_AUTO_RECHARGE'] = hasTag(content, 'ALLOW_AUTO_RECHARGE') ? '支持' : '不支持'
        hash['VPDN_ONLY'] = hasTag(content, 'VPDN_ONLY') ? '是' : '否'
        hash['NB_IOT'] = hasTag(content, 'NB_IOT') ? '是' : '否'
        hash['rechargeTimeRange'] = content['rechargeTimeRange'].replace('-1', '最后一天').split('~')
        hash['carrier'] = this.enums.carrier.get(content['carrier'])
        hash['type'] = this.enums.planClassType.get(content['type'])
        this.content = { ...hash, ...content }
      },
      show() {
        if (this.time === 0) {
          this.getData()
        }
        this.time++
      }
    }
  }
</script>

<template>
  <el-popover class="price-class-info-panel" ref="popover" :placement="placement" trigger="hover" @show="show">
    <div class="box-card wh-panel-card" v-if="classificationList" v-loading="loading">
      <div v-for="(o, index) in list" :key="index">
        {{o.name}}: {{o.formatter ? o.formatter(o.value, content) : content[o.value]}}
      </div>
    </div>
    <div v-else class="tac">暂无信息</div>
    <slot slot="reference"></slot>
  </el-popover>
</template>
