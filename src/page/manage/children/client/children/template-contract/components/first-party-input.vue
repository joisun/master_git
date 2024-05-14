<template>
  <span style="display: flex; align-items: center">
    <el-input
      style="width: 400px"
      :value="value"
      :disabled="disabled || (!orgId && firstPartyType === '1')"
      :placeholder="
        firstPartyType === '2'
          ? '请输入甲方'
          : !orgId && firstPartyType === '1'
          ? '请先选择客户'
          : ''
      "
      @input="handleInput"
    >
      <el-select
        slot="prepend"
        v-model="firstPartyType"
        placeholder=""
        style="width: 100px"
        :disabled="disabled"
        @change="firstPartyTypeChange"
      >
        <el-option label="已注册" value="1" />
        <el-option label="未注册" value="2" />
      </el-select>
      <el-popover
        v-if="firstPartyType === '1' && !disabled"
        slot="append"
        v-model="visible"
        placement="bottom"
        width="600"
        trigger="click"
        @show="popShow"
      >
        <el-input
          v-model="search"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          style="margin-bottom: 15px"
          @keydown.enter.native="onSearch"
        />
        <el-table
          v-loading="loading"
          :data="orgList"
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column width="150" property="id" label="orgId"></el-table-column>
          <el-table-column width="100" property="orgName" label="客户名"></el-table-column>
          <el-table-column width="300" property="address" label="地址"></el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 15px"
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          :page-sizes="[20, 40, 60, 100, 200, 500]"
          :total="page.total"
          layout="pager, total"
          @size-change="handleSizeChange"
          @current-change="changeIndex"
        >
        </el-pagination>
        <el-button slot="reference">选择客户</el-button>
      </el-popover>
    </el-input>
  </span>
</template>

<script>
import { safeGet } from '@/global/function/safe-operations'

export default {
  props: {
    value: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    orgId: {
      type: [Number, String]
    }
  },
  data() {
    return {
      firstPartyType: '1',
      visible: false,
      search: '',
      loading: false,
      page: {
        pageIndex: 1,
        pageSize: 6,
        total: 0
      },
      orgList: [],
      content: this.value
    }
  },
  watch: {
    orgId(newValue) {
      this.firstPartyType = newValue && newValue !== '尚未注册' ? '1' : '2'
    }
  },
  created() {
    this.firstPartyType = this.orgId && this.orgId !== '尚未注册' ? '1' : '2'
  },
  methods: {
    firstPartyTypeChange() {
      this.$emit('input', '')
      this.$emit('select', {
        id: '',
        address: '',
        orgAdmin: {
          email: '',
          phone: '',
          name: ''
        }
      })
    },
    handleCurrentChange(val) {
      if (!val) return
      this.$emit('input', val.orgName)
      this.$emit('select', val)
      this.visible = false
    },
    onSearch() {
      this.page.pageIndex = 1
      this.queryOrgAsync()
    },
    changeIndex(val) {
      this.page.pageIndex = val
      this.queryOrgAsync()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.queryOrgAsync()
    },
    popShow() {
      this.queryOrgAsync()
    },
    async queryOrgAsync() {
      this.loading = true
      const res = await this.jaxLib.customer.list.get(
        {
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize,
          orgName: this.search,
          saler: ''
        },
        false
      )
      this.loading = false
      if (safeGet(res, 'success', false)) {
        this.orgList = res.data.list
        this.page.total = res.data.page.allCount
      }
    },
    handleInput(e) {
      this.$emit('input', e)
    }
  }
}
</script>
