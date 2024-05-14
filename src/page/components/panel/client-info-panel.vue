<script>
  /**
   * Create by zeter on 2019-04-04
   */
  import enums from '@/constant/enums'
  const list = [
    { name: '客户名称', value: 'orgName' },
    { name: '客户ID', value: 'orgId' },
    { name: '所属销售', value: 'saleName' },
    { name: '企业认证', value: 'qualificationStatus', formatter: (name, row) => enums.qualificationStatus.get(row[name]) },
    { name: '实名认证', value: 'legalEntityStatus', formatter: (name, row) => enums.qualificationStatus.get(row[name]) }
  ]
  export default {
    name: 'client-info-panel',
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
        default: 'top',
        type: String
      },
      orgId: {
        require: true
      }
    },
    methods: {
      async getData() {
        this.loading = true
        let rst = await this.jaxLib.customer.info({
          orgId: this.orgId
        })
        if (!rst.success) return false
        this.content = { ...rst.data.qualification, ...rst.data.information, ...rst.data.information.orgAdmin }
        this.content.orgName = rst.data.information.orgName
        this.content.orgId = rst.data.information.id
        this.content.qualificationStatus = rst.data.qualification ? rst.data.qualification.status : ''
        this.content.legalEntityStatus = rst.data.qualification ? rst.data.qualification.legalEntityStatus : ''
        this.loading = false
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
  <el-popover class="client-info-panel" ref="popover" :placement="placement" trigger="hover" @show="show" >
    <div class="box-card wh-panel-card" v-loading="loading">
      <div v-for="(o, index) in list" :key="index">
        {{o.name}}: {{o.formatter ? o.formatter(o.value, content) : content[o.value]}}
      </div>
    </div>
    <slot slot="reference"></slot>
  </el-popover>
</template>
