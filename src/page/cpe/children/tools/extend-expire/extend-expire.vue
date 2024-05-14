<script>
  import { iccidsTransfer } from '@/global/function/iccids-tool'
  import apis from '@/api/ajax'
  import { toolsMixin } from '@/global/mixins/table-selection'
  const SELECTION_STORAGE_KEY = 'whitehouse_cpe_device_list'

  export default {
    mixins: [toolsMixin],
    data() {
      return {
        macAddrList: '',
        date: "",
        show: false,
        storageKey: SELECTION_STORAGE_KEY,
        formRule: {
          macAddrList: { required: true, message: 'mac地址不能为空' }
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          },
          shortcuts: [{
            text: '1天后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '7天后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }, {
            text: '15天后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 15);
              picker.$emit('pick', date);
            }
          }, {
            text: '30天后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', date);
            }
          }]
        },
      }
    },
    created() {
      if (this.$route.query.from === 'device-list') {
        const selected = this.getSelected('macAddr')
        if (selected.length) {
          this.macAddrList = selected.join('\n')
        }
      }
    },
    methods: {
      async submit() {
        const macAddrList = iccidsTransfer(this.macAddrList)
        if (!macAddrList.length || (macAddrList.length === 1 && !macAddrList[0])) {
          return this.$message({ type: 'warning', message: 'mac地址不能为空' })
        }
        if (!this.date) {
          return this.$message({ type: 'warning', message: '日期不能为空' })
        }
        const params = {
          macAddrList,
          date: this.date
        }
        const { success, message } = await apis.cpe.extendExpire(params)
        if (success) {
          this.macAddrList = ''
          this.$message({ type: 'success', message })
        }
      },
      backList() {
        window.history.go(-1)
      }
    }
  }
</script>

<template>
  <div class="batch-restart-setting">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">延长测试期</h2>
        <span v-if="!$route.query.enter" class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div class="wh__body">
        <el-form class="form" label-width="110px">
          <el-form-item label="Mac地址">
            <el-input v-model="macAddrList" type="textarea" :rows="6" resize="none"
                      placeholder="请输入Mac地址，一行一个"></el-input>
          </el-form-item>
          <el-form-item label="延长至">
            <div class="block">
              <el-date-picker
                  v-model="date"
                  align="center"
                  type="date"
                  placeholder="选择日期"
                  v-on:change="show=true"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item>
            <div style="color: blue" v-show="this.show">
              <div>注意：过期时间大于该日期的设备不会进行变更</div>
            </div>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" @click="submit">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .form {
    width: 600px;
    margin-top: 20px;
  }
</style>
