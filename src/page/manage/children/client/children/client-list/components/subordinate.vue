<script type="text/jsx">
/**
   * Create by zeter on 2017/9/1
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import { iccidsTransfer } from '@/global/function/iccids-tool'
  import goSystem from '@/global/function/go-system'
  import regexps from '@/constant/regexps'
import ReverseAssignDialog
  from "@/page/manage/children/client/children/client-list/components/reverse-assign-dialog.vue";

  export default {
    components: {
      ReverseAssignDialog
    },
    mixins: [DialogMixin],
    props: {
      orgId: {
        default: String
      },
      pointOrgName: {
        default: String
      },
      orgContent: {
        default: Object
      },
      dialogName: {
        default: String
      }
    },
    data() {
      return {
        wxKey: 1,
        listData: [],
        loading: true,
        searchInput: '',
        nowMoney: '',
        moneyValidateForm: {
          money: '',
          remark: ''
        },
        transferValidateForm: {
          iccids: '',
          remark: ''
        },
        wechatForm: {
          app_id: '',
          app_secret: '',
          back_host: '',
          mch_id: '',
          pay_key: '',
          host: ''
        },
        page: {
          pageIndex: 1,
          pageSize: 10,
          total: 0
        },
        moneyRules: {
          money: [
            { validator: function(rule, value, callback) {
                if (this.moneyValidateForm.money === '') return callback(new Error('请填写金额'))
                if (!regexps.money.test(this.moneyValidateForm.money)) return callback(new Error('请填写符合要求的金额'))
                callback()
              }.bind(this),
              trigger: 'blur'
            }
          ],
          remark: [
            { validator: function(rule, value, callback) {
                if (this.moneyValidateForm.remark === '') return callback(new Error('请填写备注'))
                if (this.moneyValidateForm.remark.length > 100 || this.moneyValidateForm.remark.length < 2) return callback(new Error('请填写符合要求的备注'))
                callback()
              }.bind(this),
              trigger: 'blur'
            }
          ]
        },
        transferRules: {
          iccids: [
            { validator: function(rule, value, callback) {
                if (this.transferValidateForm.iccids.trim() === '') return callback(new Error('请填写iccid'))
                callback()
              }.bind(this),
              trigger: 'blur'
            }
          ],
          remark: [
            { validator: function(rule, value, callback) {
                if (this.transferValidateForm.remark === '') return callback(new Error('请填写备注'))
                if (this.transferValidateForm.remark.length > 100 || this.transferValidateForm.remark.length < 2) return callback(new Error('请填写符合要求的备注'))
                callback()
              }.bind(this),
              trigger: 'blur'
            }
          ]
        },
        transferCheckResult: ''
      }
    },
    methods: {
      open() {
        this.getList()
      },
      close() {
        this.searchInput = ''
        this.listData = []
      },
      async getList() {
        this.loading = true
        let rst = await this.jaxLib.customer.list.nextList({
          page_index: this.page.pageIndex,
          page_size: this.page.pageSize,
          org_id: this.orgId,
          org_name: this.searchInput
        })
        this.loading = false
        if (!rst.success) return false
        this.listData = rst.data.list
        this.page.total = rst.data.page.allCount
      },
      changeIndex(val) {
        this.page.pageIndex = val
        this.getList()
      },
      searchChange(val) {
        this.searchInput = val
        this.changeSearch()
      },
      changeSearch() {
        this.page.pageIndex = 1
        this.getList()
      },
      async getMoney(id) {
        this.nowMoney = ''
        let rst = await this.jaxLib.customer.balance.get({ orgId: id })
        if (!rst.success) return false
        this.nowMoney = (rst.data.balance / 10000).toFixed(2)
        return this.nowMoney >= 0
      },
      async goSystem(val) {
        goSystem(val.orgAdmin.id, this.pointOrgName)
      },
      // 配额工具
      async toQuota(val) {
        let vNode = function(h, name) {
          return (<div>
          <div> 确认为子账号进行配额吗？</div>
          <div>
            <div class="tac subordinate__box--side">  {val.orgName}(ID:{val.id})</div>
            <div class="subordinate__box--inline"> --></div>
            <div class="tac subordinate__box--side"> {name.orgContent.orgName}(ID:{name.orgContent.id})</div>
          </div>
          <div> 该分销用户账户余额为: {name.nowMoney} 元</div>
          <el-form
            model={name.moneyValidateForm}
            value={name.moneyValidateForm}
            onInput={value => (name.moneyValidateForm.money = value)} rules={name.moneyRules} ref="moneyValidateForm">
            <el-form-item prop="money">
              <el-input value={name.moneyValidateForm.money} ref="moneyValidateRef" onInput={value => {
                name.moneyValidateForm.money = value
                name.$refs.moneyValidateRef.value = value
              }}
                placeholder="请输入配额金额" size="small" class="subordinate__box--input">
              </el-input>
            </el-form-item>
            <el-form-item prop="remark">
              <el-input type="textarea" ref="moneyValidateRemarkRef" value={name.moneyValidateForm.remark}
                onInput={value => {
                  name.moneyValidateForm.remark = value
                  name.$refs.moneyValidateRemarkRef.value = value
                }} placeholder="请输入备注">
              </el-input>
            </el-form-item>
          </el-form>
          <div class="subordinate__box--tip">请确认录入信息与实际操作一致</div>
        </div>)
        }
        if (await this.getMoney(val.id)) {
          this.$msgbox({
            title: '提示',
            message: vNode(this.$createElement, this),
            showCancelButton: true,
            beforeClose: function(action, instance, done) {
              if (action === 'confirm') {
                this.$refs.moneyValidateForm.validate(async(valid) => {
                  if (valid) {
                    let rst = await this.jaxLib.customer.subordinate.fxQuotaDeduct({
                      orgId: val.id,
                      balance: this.moneyValidateForm.money,
                      remark: this.moneyValidateForm.remark
                    })
                    if (!rst.success) return false
                    this.$message.success('配额成功')
                    done()
                  } else return false
                })
              } else done()
            }.bind(this)
          })
        } else {
          this.$message.warning('该子用户余额为负无法继续配额')
        }
      },
      toTransferIccids(val) {
        this.$refs.reverseAssignDialog.open(val)
      },
      // 划拨工具
      toTransfer(val) {
        let vNode = function(h, name) {
          return (<div>
          <div> 确认为分销子账号的卡进行回收吗？</div>
          <div>
            <div class="tac subordinate__box--side"> {val.orgName}(ID:{val.id})</div>
            <div class="subordinate__box--inline"> --></div>
            <div class="tac subordinate__box--side"> {name.orgContent.orgName}(ID:{name.orgContent.id})</div>
          </div>
          <el-form
            model={name.transferValidateForm}
            value={name.transferValidateForm}
            onInput={value => (name.transferValidateForm = value)} rules={name.transferRules}
            ref="transferValidateForm">
            <el-form-item prop="iccids">
              <el-input type="textarea" disabled={true} value={name.transferValidateForm.iccids}
                onInput={value => (name.transferValidateForm.iccids = value)} placeholder="请输入iccid,用逗号或者换行分割"
                size="small" class="subordinate__box--input">
              </el-input>
            </el-form-item>
            <el-form-item prop="remark">
              <el-input type="textarea" ref="transferRemarkRef" value={name.transferValidateForm.remark}
                onInput={value => {
                  name.transferValidateForm.remark = value
                  name.$refs.transferRemarkRef.value = value
                }} placeholder="请输入备注">
              </el-input>
            </el-form-item>
            <el-form-item label="注意:只能逆向划拨没有续费记录的卡">
            </el-form-item>
          </el-form>
          <div class="subordinate__box--tip">请确认录入信息与实际操作一致</div>
          { name.transferCheckResult && name.transferCheckResult.validIccids && (
           <p>有效卡数：{name.transferCheckResult.validIccids.length}</p>
          )}
          { name.transferCheckResult && name.transferCheckResult.invalidIccids && (
            <p>无效卡数：{name.transferCheckResult.invalidIccids.length}</p>
          )}
          { name.transferCheckResult &&
            name.transferCheckResult.mayExceedPoolId &&
            name.transferCheckResult.mayExceedPoolId.length > 0 && (
            <p>爆池的流量池id：{name.transferCheckResult.mayExceedPoolId.join(',')}</p>
          )}
        </div>)
        }
        this.$msgbox({
          title: '划拨工具',
          message: vNode(this.$createElement, this),
          showCancelButton: true,
          beforeClose: function(action, instance, done) {
            if (action === 'confirm') {
              if (!this.transferCheckResult ||
                !this.transferCheckResult.validIccids ||
                this.transferCheckResult.validIccids.length === 0) {
                this.$message({ type: 'error', message: '有效卡数不能为空' })
                return false
              }
              this.$refs.transferValidateForm.validate(async(valid) => {
                if (valid) {
                  let rst = await this.jaxLib.customer.subordinate.transferReverse({
                    orgId: val.id,
                    iccids: iccidsTransfer(this.transferValidateForm.iccids).join(','),
                    remark: this.transferValidateForm.remark
                  })
                  if (!rst.success) return false
                  this.$notify({
                    title: '划拨消息',
                    message: `划拨成功`,
                    duration: 0
                  })
                  done()
                } else return false
              })
            } else done()
          }.bind(this)
        })
      },
      // 获得微信是否开通信息
      async getWechatInfo(userId) {
        let rst = await this.jaxLib.customer.wx.getWxConfig(userId)
        if (!rst.success) {
          this.msg(`微信配置获取错误: ${rst.message}`, 'error')
          return false
        }
        if (rst.data) {
          this.wechatForm = {
            id: rst.data.id,
            app_id: rst.data.appId,
            app_secret: rst.data.appSecret,
            back_host: rst.data.backHost,
            mch_id: rst.data.mchId,
            pay_key: rst.data.payKey,
            host: rst.data.host
          }
        }
      },
      async addOrSetWechat(org) {
        let postData = this.wechatForm
        postData.user_id = org.orgAdmin.id
        postData.orgId = org.id
        let rst = await this.jaxLib.customer.wx.setWxConfig(postData)
        return rst
      },
      // 微信配置
      async toConfigWx(val) {
        let vNode = function(h, name) {
          return (<div class="wechat-set" key={name.wxKey++}>
          <el-form
            model={name.wechatForm}
            value={name.wechatForm}
            onInput={value => (name.wechatForm = value)}
            ref="wechatForm">
            <el-form-item label="公众号ID" label-width="98px">
               <el-input value={name.wechatForm.app_id} ref="wechatAppIdRef" onInput={value => {
                 name.wechatForm.app_id = value
                 name.$refs.wechatAppIdRef.value = value
               }} auto-complete="off">
               </el-input>
              </el-form-item>
            <el-form-item label="公众号密钥" label-width="98px">
              <el-input value={name.wechatForm.app_secret} ref="wechatAppSecretRef" onInput={value => {
                name.wechatForm.app_secret = value
                name.$refs.wechatAppSecretRef.value = value
              }} auto-complete="off">
              </el-input>
            </el-form-item>
              <el-form-item label="客户后端主机" label-width="98px">
              <el-input value={name.wechatForm.back_host} ref="wechatBackHostRef" onInput={value => {
                name.wechatForm.back_host = value
                name.$refs.wechatBackHostRef.value = value
              }} auto-complete="off">
              </el-input>
            </el-form-item>
              <el-form-item label="商户号" label-width="98px">
              <el-input value={name.wechatForm.mch_id} ref="wechtMachIdRef" onInput={value => {
                name.wechatForm.mch_id = value
                name.$refs.wechtMachIdRef.value = value
              }} auto-complete="on">
              </el-input>
            </el-form-item>
              <el-form-item label="商户支付密钥" label-width="98px">
              <el-input value={name.wechatForm.pay_key} ref="wechatPayKey" onInput={value => {
                name.wechatForm.pay_key = value
                name.$refs.wechatPayKey.value = value
              }} auto-complete="off">
              </el-input>
            </el-form-item>
              <el-form-item label="页面host" label-width="98px" style="margin-bottom: 0;">
              <el-input value={name.wechatForm.host} ref="wechatHostRef" onInput={value => {
                name.wechatForm.host = value
                name.$refs.wechatHostRef.value = value
              }} auto-complete="off">
              </el-input>
            </el-form-item>
          </el-form>
        </div>)
        }
        this.wechatForm = {
          app_id: '',
          app_secret: '',
          back_host: '',
          mch_id: '',
          pay_key: '',
          host: ''
        }
        if (val.orgAdmin) {
          await this.getWechatInfo(val.orgAdmin.id)
        }
        this.$msgbox({
          title: `${val.orgName}微信配置`,
          message: vNode(this.$createElement, this),
          showCancelButton: true,
          beforeClose: async function(action, instance, done) {
            if (action === 'confirm') {
              let rst = await this.addOrSetWechat(val)
              if (!rst.success) {
                this.msg(`扑街 - 因为: ${rst.message}`, 'error')
                return false
              }
              this.msg('成功', 'success')
            }
            done()
          }.bind(this)
        })
      }
    }
  }
</script>

<template>
  <div class="subordinate">
    <reverse-assign-dialog ref="reverseAssignDialog" @confirm="getList" />
    <div class="wh__dialog--header">
      <el-input
        placeholder="组织id、账户名、企业名称"
        name="searchField"
        v-model="searchInput"
        @keyup.native.enter="changeSearch"
        style="width: 350px"
      >
        <el-button slot="append" icon="el-icon-search" @click.native="changeSearch"></el-button>
        >
      </el-input>
    </div>
    <div class="wh__dialog--body">
      <el-table :data="listData" style="width: 100%" class="subordinate__body" v-loading="loading">
        <el-table-column prop="id" label="orgId" min-width="60">
          <template slot-scope="scope">
            <div v-if="!scope.row.orgAdmin">{{ scope.row.id }}</div>
            <el-button type="text" @click="goSystem(scope.row)" v-else>{{
              scope.row.id
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="orgName" label="用户名" min-width="100"> </el-table-column>
        <el-table-column prop="phone" label="联系电话">
          <template slot-scope="{ row }">
            <span
              style="cursor: pointer"
              v-desensitization="{
                id: row.id,
                idType: 'orgId',
                showField: 'phone'
              }"
              >{{ row.phone }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="parentId" label="父级ID" min-width="70">
          <template slot-scope="scope">
            <div v-if="scope.row.parentId === orgId">{{ scope.row.parentId }}</div>
            <el-button type="text" @click="searchChange(scope.row.parentId)" v-else
              >{{ scope.row.parentId }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="最近登录时间">
          <template slot-scope="scope">
            {{ scope.row.lastLoginTime | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="60" align="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              style="margin-bottom: 2px"
              size="mini"
              @click="toQuota(scope.row)"
              >配额工具</el-button
            >
            <el-button style="margin-bottom: 2px" size="mini" @click="toTransferIccids(scope.row)"
              >逆划拨工具</el-button
            >
            <el-button size="mini" @click="toConfigWx(scope.row)">微信配置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="wh__dialog--footer">
      <el-pagination
        layout="prev, pager, next"
        @current-change="changeIndex"
        :currentPage="page.pageIndex"
        :pageSize="page.pageSize"
        :total="page.total"
      >
      </el-pagination>
    </div>
  </div>
</template>
