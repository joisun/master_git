<script>
import apis from '@/api/ajax'
import { toolsMixin } from '@/global/mixins/table-selection'
import { getRightIccid } from '@/global/function/iccids-tool'

const progressColor = ['#909399', '#e6a23c', '#1989fa', '#5cb87a']

const SELECTION_STORAGE_KEY = 'whitehouse_cpe_device_list'
export default {
  mixins: [toolsMixin],
  data() {
    return {
      macAddr: '',
      icon: 'el-icon-loading',
      process: '[simboss]>_',
      storageKey: SELECTION_STORAGE_KEY,
      progressStep: 0,
      progress: 0,
      tableData: []
    }
  },
  computed: {
    progressColor() {
      const { progress } = this
      switch (true) {
        case progress < 20:
          return progressColor[0]
        case progress >= 20 && progress < 50:
          return progressColor[1]
        case progress >= 50 && progress < 80:
          return progressColor[2]
        default:
          return progressColor[3]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const { from, macAddr } = this.$route.query
      if (macAddr) {
        this.macAddr = macAddr
        this.startSelfCheck()
        return
      }
      if (from === 'device-list') {
        const selected = this.getSelected('macAddr')
        if (selected.length) {
          this.macAddr = selected[0]
          this.startSelfCheck()
        }
      }
    },
    initStep() {
      this.progress = 0
      this.tableData = []
      this.process = ''
    },
    startSelfCheck() {
      this.initStep()
      this.getSelfCheckInfo()
    },
    async getSelfCheckInfo() {
      if (!this.macAddr) {
        return this.$message({ type: 'error', message: 'mac地址不能为空' })
      }
      const { success, data } = await apis.cpe.selfCheckInfo({ macAddr: this.macAddr })
      if (!success) {
        return false
      }
      this.progressStep = Math.round(100 / (data.stepCount + 1))
      const length = this.tableData.push({
        stepName: '物联网卡检测',
        status: 'waiting'
      })
      if (data.iccid) {
        const iccids = data.iccid.split(',')
        let result = ''
        if (iccids.length === 2) {
          const res1 = await this.getCardDetail(getRightIccid(iccids[0]))
          const res2 = await this.getCardDetail(getRightIccid(iccids[1]), false)
          result = (res1 || '卡1检查失败') + '；' + (res2 || '卡2检查失败')
        } else {
          result = await this.getCardDetail(getRightIccid(data.iccid))
        }
        this.changeResultRow(length - 1, result, result || '检测失败')
      } else {
        this.progress += this.progressStep
        this.changeResultRow(length - 1, 'fail', '无iccid')
      }
      this.selfCheck(data.firstStep)
    },
    changeResultRow(index, status, conclusion) {
      this.tableData[index].status = status ? 'success' : 'fail'
      this.tableData[index].conclusion = conclusion
    },
    async getCardDetail(iccid, isCard1 = true) {
      const { success, data } = await this.jaxLib.card.detail({ iccid })
      if (isCard1) this.progress += this.progressStep
      if (!success || !data) {
        return false
      }
      if (!data.runningCardInfoVO) {
        return `未出库，iccid:${data.iccid}，运营商名称:${data.carrierName}`
      }
      const physicalStatusMap = this.enums.physicalStatus.maps()
      const gprsStatusMap = this.enums.gprsStatus.maps()
      const { gprsStatus, physicalStatus } = data.runningCardInfoVO
      const { carrier, vpdnCard, carriorAccountId } = data
      let result = `iccid:${data.iccid}，网络状态:${gprsStatusMap[gprsStatus] || '-'}，运营商状态:${
        physicalStatusMap[physicalStatus] || '-'
      }`
      if (vpdnCard) {
        result = 'VPDN卡，' + result
        const ping = await this.jaxLib.vpdn.networkStatus.ping({
          carrier,
          carrierAccountId: carriorAccountId,
          iccid: iccid
        })
        if (ping.success) {
          result += `，ping:${ping.data.ping}，平均延时:${ping.data.avgDelay}ms，丢包率:${ping.data.packetLossRate}%`
        } else {
          result += '，ping失败'
        }
      }
      return result
    },
    async selfCheck(step) {
      const { macAddr } = this
      const length = this.tableData.push({
        stepName: step,
        status: 'waiting'
      })
      const { success, message, data } = await apis.cpe.selfCheck({ step, macAddr })
      if (!success) {
        this.progress += this.progressStep
        this.changeResultRow(length - 1, false, message)
        return false
      }
      this.changeResultRow(length - 1, data.pass, data.conclusion)
      this.process += data.process
      this.$nextTick(() => {
        document.querySelector('#table .el-table__body-wrapper').scrollTop = document.querySelector(
          '#table .el-table__body-wrapper'
        ).scrollHeight
        document.getElementById('result').scrollTop = document.getElementById('result').scrollHeight
      })
      if (data.nextStep) {
        this.progress += this.progressStep
        await this.selfCheck(data.nextStep)
      } else {
        this.progress = 100
        this.tableData.push({ stepName: '', status: '' }) // el-table的bug, 最后一行高度过高不会出现滚动条，加入一个空行
        this.process += '\n[simboss]>_'
      }
    },
    backList() {
      window.history.go(-1)
    }
  }
}
</script>

<template>
  <div class="self-check">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">设备自检</h2>
        <span v-if="!$route.query.enter" class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div class="wh__body">
        <el-form label-width="100px" :inline="true">
          <el-form-item label="Mac地址">
            <el-input v-model="macAddr" placeholder="请输入Mac地址"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="startSelfCheck">自检</el-button>
          </el-form-item>
        </el-form>
        <div class="content">
          <div class="steps">
            <el-progress
              :text-inside="true"
              :stroke-width="20"
              :percentage="progress"
              :color="progressColor"
            >
            </el-progress>
            <el-table id="table" class="mt15" height="420" size="mini" :data="tableData">
              <el-table-column label="序号" width="80px" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.$index < tableData.length - 1">{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="自检项" width="200px" prop="stepName"></el-table-column>
              <el-table-column label="自检状态" width="120px" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 'waiting'" class="el-icon-loading"></span>
                  <span
                    v-else-if="scope.row.status === 'success'"
                    class="el-icon-check"
                    style="color: #00d449"
                  ></span>
                  <span
                    v-else-if="scope.row.status === 'fail'"
                    class="el-icon-close"
                    style="color: #d70000"
                  ></span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column label="自检结果">
                <template slot-scope="scope">
                  <span v-html="scope.row.conclusion"></span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="result">
            <el-collapse>
              <el-collapse-item title="显示详细信息">
                <el-input id="result" v-model="process" type="textarea" readonly></el-input>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.self-check {
  .content {
    width: 100%;
    background-color: #fff;
    padding: 20px;

    .steps {
      width: 1200px;
      margin: 0 auto;
    }

    .result {
      width: 1200px;
      margin: 15px auto;

      textarea {
        width: 100%;
        height: 360px;
        resize: none;
        background-color: #333333;
        color: #ffffff;
      }
    }
  }
}
</style>
