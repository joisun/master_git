<template>
  <div class="vpdn-separate">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">分离计费</h2>
      </div>
      <div class="wh-tool">
        <el-input placeholder="请输入客户ID或客户名称"
          name="searchField"
          v-model="searchStr"
          @keyup.native.enter="searchList"
          class="wh__tools--search-input">
          <el-button slot="append" icon="el-icon-search" @click.native="searchList">
          </el-button>
        </el-input>
        <el-button class="float-right" size="mini"  @click="handleNew">新增</el-button>
      </div>
      <div class="wh__body">
        <el-table :data="tableData"
          style="width: 100%"
          height="calc(100vh - 190px)"
          class="vpdn-separate--table">
          <el-table-column prop='orgId' label='客户ID' min-width='76'>
            <template slot-scope="scope">
              <client-panel :orgId="scope.row.orgId" :key="scope.row.orgId">
                <span>{{ scope.row.orgId }}</span>
              </client-panel>
            </template>
          </el-table-column>
          <el-table-column prop='orgName' label='客户名称' min-width='120'></el-table-column>
          <el-table-column prop='priceOfferId' label='套餐ID' min-width='76'>
            <template slot-scope="scope">
              <price-panel :id="scope.row.priceOfferId" :key="scope.row.priceOfferId">
                <span>{{scope.row.priceOfferId}}</span>
              </price-panel>
            </template>
          </el-table-column>
          <el-table-column prop='priceOfferName' label='套餐名称' min-width='120'></el-table-column>
          <el-table-column label="子套餐名称" min-width="120" align="center" class="vpdn-separate__table--colume">
            <template slot-scope="scope">
              <div class="vpdn-separate__table--border-left">
                <div class="vpdn-separate__table--item" v-for="i in scope.row.aclSwitcherList" :key="i.id">
                  {{i.policyName}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="网络类型" min-width="80" align="center" class="vpdn-separate__table--colume">
            <template slot-scope="scope">
              <div>
                <div class="vpdn-separate__table--item" v-for="(i, index) in scope.row.aclSwitcherList" :key="index">
                  {{i.type === 'public' ? '公网' : '私网'}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="流量规格" min-width="80" align="center" class="vpdn-separate__table--colume">
            <template slot-scope="scope">
              <div>
                <div class="vpdn-separate__table--item" v-for="i in scope.row.aclSwitcherList" :key="i.id">
                  {{i.volumeThreshold | volumeFilter}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="IP地址" min-width="90" align="center" class="vpdn-separate__table--colume">
            <template slot-scope="scope">
              <div>
                <div class="vpdn-separate__table--item" v-for="i in scope.row.aclSwitcherList" :key="i.id">
                  <el-button type="text" v-if="i.destIp" @click="showIp(i.destIp)">{{i.destIp.split(',')[0]}}
                  </el-button>
                  <span v-else>null</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="VMIP" min-width="90" align="center" class="vpdn-separate__table--colume">
            <template slot-scope="scope">
              <div>
                <div class="vpdn-separate__table--item" v-for="i in scope.row.aclSwitcherList" :key="i.id">
                  {{i.vmip}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="网络名称" min-width="80" align="center" class="vpdn-separate__table--colume">
            <template slot-scope="scope">
              <div>
                <div class="vpdn-separate__table--item" v-for="i in scope.row.aclSwitcherList" :key="i.id">
                  {{i.netName}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="策略ID" min-width="67" align="center" class="vpdn-separate__table--colume">
            <template slot-scope="scope">
              <div>
                <div class="vpdn-separate__table--item" v-for="i in scope.row.aclSwitcherList" :key="i.id">
                  {{i.id}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="达量断网" min-width="67" align="center" class="vpdn-separate__table--colume">
            <template slot-scope="scope">
              <div>
                <div class="vpdn-separate__table--item" v-for="i in scope.row.aclSwitcherList" :key="i.id">
                  {{i.exceedCut ? '是': '否'}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="附属月套餐" min-width="67" align="center" class="vpdn-separate__table--colume">
            <template slot-scope="scope">
              <div class="vpdn-separate__table--border-right">
                <div class="vpdn-separate__table--item" v-for="i in scope.row.aclSwitcherList" :key="i.id">
                  {{i.attachMonthlyPackage? '是': '否'}}
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :title="indexItem===null ? `新增项目` : `修改项目`"
      size="large"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible.displayEditorWin"
      class="wh__dialog"
      width="80%"
      top="7%">
      <item-add-edit
        :plan="indexItem"
        dialogName="displayEditorWin"
        @closeDialog="closeDialog">
      </item-add-edit>
    </el-dialog>
    <el-dialog
      title="查看IP"
      size="tiny"
      :visible.sync="dialogVisible.displayIpShow"
      class="wh__dialog">
      <div class="vpdn-separate__dialog">
        {{nowIP.replace(',','\n')}}
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import itemAddEdit from './components/item-add-edit.vue'
  import pricePanel from '@/page/components/panel/price-info-panel.vue'
  import clientPanel from '@/page/components/panel/client-info-panel.vue'

  export default {
    name: 'vpdn-separate',
    data() {
      return {
        tableData: [],
        page: {
          pageIndex: 1,
          pageSize: 20,
          allCount: 0
        },
        searchStr: '',
        indexItem: null,
        dialogVisible: {
          displayEditorWin: false,
          displayIpShow: false
        },
        nowIP: ''
      }
    },
    components: {
      'item-add-edit': itemAddEdit,
      'client-panel': clientPanel,
      'price-panel': pricePanel
    },
    methods: {
      searchList() {
        this.page.pageIndex = 1
        this.getList()
      },
      async getList() {
        this.tableData = []
        let rst = await this.jaxLib.vpdn.acl.get({ searchStr: this.searchStr })
        // 网络慢，多次触发请求时，如果先清空tableData，
        // 请求返回后，前一个请求会往数组中添加数据，后一个请求也会往数组中加数据，所以需要再请求返回后清空一遍tableData
        this.tableData = []
        if (!rst.success) return false
        rst.data.map(e => {
          let matchItem = 0
          let aclSwitcher = {
            policyName: e.policyName,
            vmip: e.vmip,
            netName: e.netName,
            destIp: e.destIp,
            volumeThreshold: e.volumeThreshold,
            type: e.type,
            id: e.id,
            exceedCut: e.exceedCut,
            attachMonthlyPackage: e.attachMonthlyPackage
          }
          this.tableData.map(i => {
            if (e.orgId === i.orgId && e.priceOfferId === i.priceOfferId) {
              i.aclSwitcherList.push(aclSwitcher)
              matchItem = 1
            }
          })
          if (!matchItem) {
            this.tableData.push({
              orgName: e.orgName,
              orgId: e.orgId,
              priceOfferId: e.priceOfferId,
              priceOfferName: e.priceOfferName,
              aclSwitcherList: [aclSwitcher]
            })
          }
        })
      },
      handleNew() {
        this.indexItem = null
        this.dialogVisible.displayEditorWin = true
      },
      handleEdit(row) {
        this.indexItem = row
        this.dialogVisible.displayEditorWin = true
      },
      showIp(ip) {
        this.nowIP = ip.replace(/,/g, ' \n')
        this.dialogVisible.displayIpShow = true
      },
      closeDialog(name, flag) {
        this.dialogVisible[name] = false
        if (flag) {
          this.getList()
        }
      }
    },
    mounted() {
      this.getList()
    }
  }
</script>
