<script>
import apis from '@/api/ajax'
function isJsonString(str) {
  try {
    var json = JSON.parse(str)
    return !!json && typeof json === 'object'
  } catch (e) {
    return false
  }
}
export default {
  data() {
    return {
      isAdd: false,
      json: [],
      serverOptions: [],
      visible: false,
      addForm: {
        displayJSON: ''
      },
      form: {
        macAddr: '',
        iccid: '',
        type: '',
        vpnSlave: '',
        vpnMaster: ''
      },
      selected: [],
      addRules: {
        displayJSON: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入配置数据或从左侧添加'))
              }
              return isJsonString(value) ? callback() : callback(new Error('JSON格式错误'))
            },
            trigger: 'change'
          }
        ]
      },
      rules: {
        macAddr: [{ required: true, message: '请输入mac地址', trigger: 'submit' }],
        iccid: [{ required: true, message: '请输入ICCID', trigger: 'submit' }],
        type: [{ required: true, message: '请选择类型', trigger: 'submit' }],
        vpnMaster: [{ required: true, message: '请选择vpn-master', trigger: 'submit' }],
        vpnSlave: [{ required: true, message: '请选择vpn-slave', trigger: 'submit' }]
      }
    }
  },
  computed: {
    isBulk() {
      return this.selected.length >= 2
    }
  },
  created() {
    this.getServerList()
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
      this.$refs.addForm && this.$refs.addForm.resetFields()
      this.json = []
    },
    inputChange(v) {
      if (!v) this.json = []
      if (isJsonString(v)) {
        this.json = JSON.parse(v)
      }
    },
    handleAdd() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        this.json.push({ ...this.form })
        this.addForm.displayJSON = JSON.stringify(this.json, null, 2)
        this.$refs.form.resetFields()
      })
    },
    async getServerList() {
      this.loading = true
      const { success, data } = await apis.cpe.vpnServerList()
      this.loading = false
      if (!success) return false
      this.serverOptions = data
    },
    cancel() {
      this.visible = false
    },
    async insert() {
      const batchInfo = JSON.stringify(this.json)
      const { success } = await apis.cpe.vpnConfigBatchInsert({ batchInfo })
      if (!success) return false
      this.visible = false
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.$emit('confirm', success)
    },
    confirm() {
      if (this.isAdd) {
        this.$refs.addForm.validate(async (valid) => {
          valid && (await this.insert())
        })
        return
      }
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.selected = this.selected.map((item) => {
            return {
              ...item,
              ...this.form
            }
          })
          const { success } = await apis.cpe.vpnConfigBatchUpdate({ update: this.selected })
          if (!success) return false
          this.visible = false
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.$emit('confirm', success)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    open(selected) {
      const DEFAULT_TYPE = 0
      const DEFAULT_MASTER_SERVER = '183.131.24.8:55191'
      const DEFAULT_SLAVE_SERVER = '47.103.127.248:55191'
      if (!selected) {
        this.isAdd = true
        this.form = {
          macAddr: '',
          iccid: '',
          type: DEFAULT_TYPE,
          vpnSlave: DEFAULT_SLAVE_SERVER,
          vpnMaster: DEFAULT_MASTER_SERVER
        }
        this.visible = true
        return
      }
      this.isAdd = false
      this.selected = selected
      if (selected.length < 2) {
        const [{ macAddr, iccid, type, vpnSlave, vpnMaster }] = selected
        this.form = {
          macAddr,
          iccid,
          type,
          vpnSlave,
          vpnMaster
        }
      } else {
        this.form = {
          type: DEFAULT_TYPE,
          vpnSlave: DEFAULT_SLAVE_SERVER,
          vpnMaster: DEFAULT_MASTER_SERVER
        }
      }
      this.visible = true
    }
  }
}
</script>

<template>
  <el-dialog
    :visible.sync="visible"
    :title="isAdd ? '新增' : isBulk ? '批量编辑' : '编辑'"
    :close-on-click-modal="false"
    @close="reset"
  >
    <el-row :gutter="15">
      <el-col :span="isAdd ? 12 : 24">
        <el-form ref="form" :model="form" label-width="100px" size="mini" :rules="rules">
          <template v-if="!isBulk">
            <el-form-item label="mac地址" prop="macAddr">
              <el-input v-model="form.macAddr"></el-input>
            </el-form-item>
            <el-form-item label="iccid" prop="iccid">
              <el-input v-model="form.iccid"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择" style="width: 100%">
              <el-option label="禁用" :value="-1" />
              <el-option label="全量" :value="0" />
              <el-option label="部分" :value="1" />
              <el-option label="非部分" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="vpn-master" prop="vpnMaster">
            <el-select v-model="form.vpnMaster" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in serverOptions"
                :key="item.id"
                :label="`${item.addr}(${item.provider})`"
                :value="item.addr"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="vpn-slave" prop="vpnSlave">
            <el-select v-model="form.vpnSlave" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in serverOptions"
                :key="item.id"
                :label="`${item.addr}(${item.provider})`"
                :value="item.addr"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isAdd">
            <el-button type="primary" @click="handleAdd">添加</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col v-if="isAdd" :span="12">
        <el-form ref="addForm" :model="addForm" :rules="addRules">
          <el-form-item prop="displayJSON" label-width="0">
            <el-input
              v-model="addForm.displayJSON"
              type="textarea"
              :rows="12"
              resize="none"
              placeholder='请输入配置数据或从左侧添加，格式：[{ "iccid": "", "macAddr": "", "type": 0, "vpnMaster": "", "vpnSlave": "" }]'
              @change="inputChange"
            />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<style lang="scss"></style>
