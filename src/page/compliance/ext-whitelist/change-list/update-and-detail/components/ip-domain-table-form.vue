<template>
  <el-form-item class="ip-domain-table-form" :style="{ width }" prop="addressList" label="IP/域名">
    <div class="table-header">
      <div class="table-col-index">序号</div>
      <div class="table-col-type">类型</div>
      <div v-if="carrier === 'cmcc'" class="table-col-protocol">协议号</div>
      <div class="table-col-content">
        类型内容
        <el-popover placement="top" title="" width="600" trigger="hover">
          <div>
            <h3>移动</h3>
            <p><strong>三层目的IP地址</strong> 格式 x.x.x.x</p>
            <p>
              <strong>三层目的IP地址段</strong> 格式 x.x.x.x/XX 地址段解析必须小于等于10个IP地址
              （29 ≤ XX ≤ 32）
            </p>
            <p><strong>七层URL（域名）</strong> HTTP 格式 *xxx.xxx/* HTTPS/TCP/UDP格式 *xxx.xxx*</p>
            <h3 style="margin-top: 10px">电信</h3>
            <p><strong>IP地址</strong> 格式 x.x.x.x</p>
            <p>
              <strong>IP地址段</strong> 格式 x.x.x.x/XX 地址段解析必须小于等于256个IP地址（24 ≤ XX ≤
              32）
            </p>
            <p><strong>URL白名单</strong> 格式 xxx.xxx/*</p>
            <p><strong>域名白名单</strong> 同URL白名单</p>
          </div>
          <i slot="reference" style="cursor: pointer" class="el-icon-question" />
        </el-popover>
      </div>
      <div class="table-col-change-type">变更类型</div>
      <div v-if="!disabled" class="table-col-action">操作</div>
    </div>
    <div class="table-body">
      <div v-for="(item, index) in addressList" :key="index" class="table-body-row">
        <div class="table-col-index">{{ index + 1 }}</div>
        <div class="table-col-type">
          <el-form-item
            :prop="'addressList.' + index + '.addressType'"
            :rules="{ required, message: '请选择类型' }"
          >
            <el-select
              v-model="item.addressType"
              placeholder=""
              clearable
              :disabled="formItemDisabled(item)"
              @change="onTypeChange(item, index)"
            >
              <el-option
                v-for="t in computedTypeOptions"
                :key="t.val"
                :label="t[`${carrier}Desc`]"
                :value="t.val"
              />
            </el-select>
          </el-form-item>
        </div>
        <div v-if="carrier === 'cmcc'" class="table-col-protocol">
          <el-form-item
            :prop="'addressList.' + index + '.explanation'"
            :rules="{
              required: !['IP', 'CIDR'].includes(item.addressType) && required,
              message: '请选择协议号'
            }"
          >
            <el-select
              v-if="!['IP', 'CIDR'].includes(item.addressType) && required"
              v-model="item.explanation"
              placeholder=""
              clearable
              :disabled="formItemDisabled(item, 'explanation')"
              @change="onProtocolChange(item, index)"
            >
              <el-option
                v-for="protocol in protocols"
                :key="protocol.value"
                :label="protocol.label"
                :value="protocol.value"
              />
            </el-select>
            <span v-else>/</span>
          </el-form-item>
        </div>
        <div class="table-col-content">
          <el-form-item
            :prop="'addressList.' + index + '.address'"
            :rules="addressRules(item, index)"
          >
            <el-input
              v-model.trim="item.address"
              :placeholder="contentPlaceholder(item)"
              :disabled="formItemDisabled(item)"
              @change="onContentChange(item, index)"
            />
          </el-form-item>
        </div>
        <div class="table-col-change-type">
          <el-form-item :prop="'addressList.' + index + '.action'">
            {{ actionMap[item.action] }}
          </el-form-item>
        </div>
        <div v-if="!disabled" class="table-col-action">
          <el-button
            v-if="item.action !== 'DEL'"
            size="mini"
            icon="el-icon-minus"
            :disabled="validateItems <= 1 || disabled"
            @click="handleRemove(index)"
          />
          <el-button
            v-if="item.action === 'DEL'"
            size="mini"
            icon="el-icon-refresh-left"
            @click="handleUndo(index)"
          />
          <el-button
            v-if="index === addressList.length - 1 && (validateItems < maxCount || !hasCountLimit(maxCount))"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="handleAdd"
          />
        </div>
      </div>
    </div>
  </el-form-item>
</template>
<script>
import ip from '@/global/function/ip'
import psl from 'psl'
import { safeGet } from '@/global/function/safe-operations'

// const DOMAIN_RULE_REGEX = /^\*\.?([\w-]+\.)+[\w-]+\/?\*$/
const DOMAIN_RULE_REGEX =
  /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9](:\d*)?/
const DOMAIN_RULE_REGEX_CHINANET =
  /(?:\*\.|[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9](:\d*)?/
const TYPE_TO_PLACEHOLDER = {
  cmcc: {
    IP: '格式:x.x.x.x 如:1.2.3.4',
    CIDR: '格式:xx.x.x.x/XX 如:1.2.3.4/29',
    DOMAIN: {
      HTTP: '格式：*xxx.xxx/* 如 *simboss.com/*',
      HTTPS: '格式：*xxx.xxx* 如 *simboss.com*',
      TCP: '格式：*xxx.xxx* 如 *simboss.com*',
      UDP: '格式：*xxx.xxx* 如 *simboss.com*'
    }
  },
  chinanet: {
    IP: '格式:x.x.x.x 如:1.2.3.4',
    CIDR: '格式:xx.x.x.x/XX 如:1.2.3.4/24',
    DOMAIN: {
      HTTP: '格式：xxx.xxx 如 simboss.com',
      HTTPS: '格式：xxx.xxx 如 simboss.com',
      TCP: '格式：xxx.xxx 如 simboss.com',
      UDP: '格式：xxx.xxx 如 simboss.com'
    },
    URL: {
      HTTP: '格式：xxx.xxx/* 如 simboss.com/*',
      HTTPS: '格式：xxx.xxx/* 如 simboss.com/*',
      TCP: '格式：xxx.xxx/* 如 simboss.com/*',
      UDP: '格式：xxx.xxx/* 如 simboss.com/*'
    }
  }
}
const regexWildcard = /[\*\/]/g

const validIpItem = (item) => {
  return item.addressType === 'IP' && ip.ipRegex.v4({ exact: true }).test(item.address)
}
const validCidrItem = (item) => {
  return item.addressType === 'CIDR' && ip.ipRegex.cidr({ exact: true }).test(item.address)
}
const validDomainItem = (item) => {
  return ['URL', 'DOMAIN'].includes(item.addressType) && DOMAIN_RULE_REGEX.test(item.address)
  // return !!item
}
const getPortAndRemove = (address) => {
  const portStart = address.indexOf(':')
  let port = ''
  if (portStart !== -1) {
    const portRegex = /(:\d*)/
    port = safeGet(address.match(portRegex), [0], '')
    address = address.substring(0, portStart)
  }
  return [address, port]
}
const extractDomainAndCompare = (str1, str2) => {
  const regex = /\*.+\/\*$/
  let pure1 = str1.replace(regexWildcard, '')
  let pure2 = str2.replace(regexWildcard, '')
  const [_pure1] = getPortAndRemove(pure1)
  const [_pure2] = getPortAndRemove(pure2)
  const domain1 = psl.parse(_pure1)
  const domain2 = psl.parse(_pure2)
  // 如果都是类似 *simboss.com*/格式的，则需要检查两者的tld是否一致
  if (regex.test(str1) && regex.test(str2)) {
    return pure1.indexOf(pure2) !== -1 && pure2.indexOf(pure1) !== -1 && domain1.tld === domain2.tld
  } else {
    return pure1.indexOf(pure2) !== -1 || pure2.indexOf(pure1) !== -1
  }
}
export default {
  props: {
    operateType: {
      type: String,
      require: true,
      default: ''
    },
    width: {
      type: String,
      default: 'auto'
    },
    addressList: {
      type: Array,
      require: true,
      default: () => []
    },
    maxCount: {
      type: Number,
      require: false,
      default: 10
    },
    cidrMaxCount: {
      type: Number,
      require: false,
      default: 10
    },
    carrier: {
      type: String,
      require: true,
      default: 'cmcc'
    },
    required: {
      type: Boolean,
      required: true,
      default: true
    },
    disabled: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      typeOptions: [],
      actionMap: {
        ADD: '新增',
        DEL: '删除'
      },
      protocols: [
        {
          label: 'HTTPS',
          value: 'HTTPS'
        },
        {
          label: 'HTTP',
          value: 'HTTP'
        },
        {
          label: 'TCP',
          value: 'TCP'
        },
        {
          label: 'UDP',
          value: 'UDP'
        }
      ]
    }
  },
  computed: {
    validateItems() {
      return this.addressList.filter((item) => item.action !== 'DEL').length
    },
    computedTypeOptions() {
      return this.typeOptions.filter((item) => {
        return !!item[`${this.carrier}Desc`]
      })
    }
  },
  created() {
    this.getAddressTypeList()
  },
  methods: {
    hasCountLimit(max) {
      if (['cmcc', 'chinanet'].includes(this.carrier) ) {
        return false
      }
      return max
    },
    async getAddressTypeList() {
      this.loading = true
      const { success, data } = await this.jaxLib.whitelist.listPoolAddressType({})
      this.loading = false
      if (!success) return false
      this.typeOptions = data
    },
    async getTypeList() {
      this.loading = true
      const { success, data } = await this.jaxLib.whitelist.workOrderCarrierConfigPuerposeList({})
      this.loading = false
      if (!success) return false
      this.purposeOptions = data
    },
    contentPlaceholder(item) {
      const { addressType, explanation } = item
      const { carrier } = this
      if (!addressType || !carrier) return ''
      if (['URL', 'DOMAIN'].includes(addressType)) {
        return (TYPE_TO_PLACEHOLDER[carrier][addressType] || {})[explanation || 'HTTP'] || ''
      }
      return TYPE_TO_PLACEHOLDER[carrier][addressType]
    },
    onTypeChange(item, index) {
      const notRestAddress =
        item.address.indexOf('/*') !== -1 &&
        this.carrier === 'chinanet' &&
        ['DOMAIN', 'URL'].includes(item.addressType)

      const addressList = [...this.addressList]
      addressList[index] = {
        ...addressList[index],
        address: !notRestAddress ? '' : addressList[index].address,
        explanation: ''
      }
      this.$emit('change', addressList, 'CHANGE')
    },
    onProtocolChange(item, index) {
      if (this.carrier === 'cmcc') {
        item.address && this.onContentChange(item, index, /\.?\w+\.\w+/)
      }
    },
    // regex = /\.?[\w-]+\.[\w-]+$/
    onContentChange(item, index) {
      const addressList = [...this.addressList]
      if (['URL', 'DOMAIN'].includes(item.addressType)) {
        let append = ''
        if (this.carrier === 'cmcc') {
          append = item.explanation === 'HTTP' ? '/*' : '*'
        } else if (this.carrier === 'chinanet' && item.addressType === 'URL') {
          append = '/*'
        }
        let address = item.address
        if (item.addressType === 'DOMAIN' && this.carrier === 'chinanet') {
          // 电信域名规则暂时不做处理
        } else {
          address = address.replace(regexWildcard, '')
          address = safeGet(address.match(DOMAIN_RULE_REGEX), [0], address)
        }
        let port = ''
        ;[address, port] = getPortAndRemove(address)
        const domain = this.carrier === 'cmcc' ? psl.parse(address).domain : address
        if (domain) {
          const prefix = this.carrier === 'cmcc' ? '*' : ''
          addressList[index].address = `${prefix}${domain}${port}${append}`
          this.$emit('change', addressList, 'CHANGE')
        }
      } else {
        const [address] = getPortAndRemove(item.address)
        addressList[index].address = address
        this.$emit('change', addressList, 'CHANGE')
      }
    },

    addressRules(item, index) {
      const addressList = this.addressList
      if (item.addressType === 'CIDR') {
        return {
          required: this.required,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (this.required && !value) {
              return callback('类型内容不能为空')
            }
            if (!ip.ipRegex.cidr({ exact: true }).test(value)) {
              return callback('IP段格式错误')
            }
            if (this.hasCountLimit(this.cidrMaxCount) && ip.cidrSubnet(value).length > this.cidrMaxCount) {
              return callback(`地址段解析不能超过${this.cidrMaxCount}个IP地址`)
            }
            const contains = this.cidrContainResult(
              addressList,
              index,
              ip.cidrSubnet(value).contains
            )
            if (contains.length > 0) {
              return callback(`IP段和第${contains.join()}条有重复`)
            }
            callback()
          }
        }
      }
      if (item.addressType === 'IP') {
        return {
          required: this.required,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (this.required && !value) {
              return callback('类型内容不能为空')
            }
            if (!ip.ipRegex.v4({ exact: true }).test(value)) {
              return callback('IP格式错误')
            }
            const contains = this.ipContainResult(addressList, index)
            if (contains.length) {
              return callback(`IP和第${contains.join()}条有重复`)
            }
            callback()
          }
        }
      }
      if (item.addressType === 'URL' || item.addressType === 'DOMAIN') {
        return {
          required: item.action !== 'DEL' && this.required,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (item.action !== 'DEL' && this.required && !value) {
              return callback('类型内容不能为空')
            }
            if (item.action === 'DEL') return callback()
            if (!value) {
              return callback('请输入')
            }
            if (!DOMAIN_RULE_REGEX.test(value)) {
              return callback('格式错误')
            }
            const contains = this.domainContainResult(addressList, index)
            if (contains.length) {
              return callback(`域名或URL和第${contains.join()}条有重复`)
            }
            if (this.carrier === 'chinanet') {
              // 电信没有协议号，且结尾为/* 转换后的值之间，只会有重复关系，不存在包含关系
              callback()
              return
            }
            const { resultLarge, resultSmall } = this.isDomainOverlap(addressList, index)
            if (resultSmall.length) {
              return callback(`域名或URL被第${resultSmall.join()}条包含`)
            } else if (resultLarge.length) {
              return callback(`域名或URL包含第${resultLarge.join()}条`)
            }
            callback()
          }
        }
      }
      return {}
    },
    isDomainOverlap(list, i) {
      // TCP 可包含HTTP 和HTTPS
      const current = list[i]
      const resultLarge = []
      const resultSmall = []
      const currentPureAddress = current.address.replace(regexWildcard, '')
      list.forEach((item, index) => {
        if (index === i || this.skipDelItem(item) || !validDomainItem(item)) return
        const itemPureAddress = item.address.replace(regexWildcard, '')
        if (current.explanation === 'TCP' && item.explanation !== 'UDP') {
          if (itemPureAddress.indexOf(currentPureAddress) !== -1) {
            resultLarge.push(index + 1)
          }
        } else {
          if (item.explanation === 'TCP' && current.explanation !== 'UDP') {
            currentPureAddress.indexOf(itemPureAddress) !== -1 && resultSmall.push(index + 1)
          } else {
            if (
              current.explanation === item.explanation &&
              extractDomainAndCompare(current.address, item.address)
            ) {
              current.address.length > item.address.length
                ? resultSmall.push(index + 1)
                : resultLarge.push(index + 1)
            }
          }
        }
      })
      return {
        resultLarge,
        resultSmall
      }
    },
    domainContainResult(list, i) {
      const current = list[i]
      const result = []
      list.forEach((item, index) => {
        if (index === i || this.skipDelItem(item)) return
        if (validDomainItem(item)) {
          item.address === current.address &&
            item.explanation === current.explanation &&
            result.push(index + 1)
        }
      })
      return result
    },
    ipContainResult(list, i) {
      const current = list[i]
      const result = []
      list.forEach((item, index) => {
        if (index === i || this.skipDelItem(item)) return
        if (validIpItem(item)) {
          item.address === current.address && result.push(index + 1)
        }
        if (validCidrItem(item)) {
          ip.cidrSubnet(item.address).contains(current.address) && result.push(index + 1)
        }
      })
      return result
    },
    skipDelItem(item) {
      return item.action === 'DEL'
    },
    cidrContainResult(list, i, containFn) {
      const current = list[i]
      const result = []
      list.forEach((item, index) => {
        if (index === i || this.skipDelItem(item)) return
        if (validIpItem(item)) {
          containFn(item.address) && result.push(index + 1)
        }
        if (validCidrItem(item)) {
          const overlap = ip.cidrOverlap([item.address, current.address])
          overlap.length && result.push(index + 1)
        }
      })
      return result
    },
    formItemDisabled(row) {
      return row.action === 'DEL' || row.isExist || this.disabled
    },
    handleUndo(index) {
      const addressList = [...this.addressList]
      if (this.hasCountLimit(this.validateItems) && this.validateItems >= maxCount) {
        // 撤销删除操作需要检查列表是否超过10条
        this.$message.error(`协议/ip 最多只支持${this.maxCount}条`)
        return
      }
      addressList[index] = {
        ...addressList[index],
        action: ''
      }
      this.$emit('change', addressList, 'CHANGE')
    },
    handleAdd() {
      this.$emit(
        'change',
        [
          ...this.addressList,
          {
            addressType: '',
            address: '',
            explanation: '',
            action: 'ADD'
          }
        ],
        'ADD'
      )
    },
    handleRemove(idx) {
      if (this.validateItems <= 1) return
      if (this.addressList[idx].isExist) {
        // 如果已存在在白名单池中，则添加DEL标，不删除当前数据
        const addressList = [...this.addressList]
        addressList[idx].action = 'DEL'
        this.$emit('change', addressList, 'DEL')
        return
      }
      const addressList = this.addressList.filter((_, i) => i !== idx)
      this.$emit('change', addressList, 'DEL')
    }
  }
}
</script>
<style scoped lang="scss">
.ip-domain-table-form {
  .table-col-index {
    width: 40px;
  }
  .table-col-type {
    width: 200px;
  }
  .table-col-content {
    width: 260px;
    text-align: center;
  }
  .table-col-protocol {
    width: 120px;
    text-align: center;
  }
  .table-col-action {
    width: 120px;
  }
  .table-col-change-type {
    text-align: center;
    width: 80px;
  }
  .table-header {
    display: flex;
    width: auto;
    div[class^='table-col-'] {
      padding: 4px 6px;
      background-color: #eaeef0;
      flex-grow: 0;
      flex-shrink: 0;
    }
  }
  .table-body {
    .table-body-row {
      margin-bottom: 15px;
      display: flex;
      div[class^='table-col-'] {
        padding: 4px 6px;
        flex-grow: 0;
        flex-shrink: 0;
      }
    }
  }
}
</style>
