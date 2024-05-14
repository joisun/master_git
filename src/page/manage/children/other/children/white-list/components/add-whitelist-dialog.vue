<script>
import moment from 'moment'
export default {
  name: 'add-whitelist-dialog',
  props: {
    reasonList: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    },
    defaultData: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      addForm: {
        iccids: '',
        reason: '',
        expireDate: '',
        effectiveDate: '',
        type: ''
      },
      addRules: {
        iccids: [
          { required: true, message: '请输入iccid', trigger: 'change' }
        ],
        reason: [
          { type: 'string', required: true, message: '必须填写原因', trigger: 'change' }
        ],
        type: [
          { type: 'string', required: true, message: '请选择类型', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    editReason() {
      this.$prompt('添加原因', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        showCancelButton: true
      }).then(({ value }) => {
        this.addForm.reason = value
      }).catch(() => {})
    },
    openDialog() {
    },
    closeDialog() {
      this.addForm = {
        iccids: '',
        reason: '',
        expireDate: '',
        effectiveDate: '',
        type: ''
      }
      this.$emit('closeAdd')
    },
    save() {
      this.$refs.addForm.validate(async(valid) => {
        if (!valid) return false
        if (this.defaultData) {
          this.$confirm(`确认要删除【${this.addForm.iccids}】？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(async() => {
            let iccids = this.addForm.iccids.trim().split(/\s+/).join(',')
            const res = await this.jaxLib.whitelist.cancelWhiteList({ iccids: iccids, type: this.addForm.type})
            if (!res.success) return
            this.$message.success('删除成功')
            this.closeDialog()
            }).catch(() => {})
          } else {
            let iccids = this.addForm.iccids.trim().split(/\s+/).join(',')
            let param = {
              ...this.addForm,
              iccids: iccids
            }
            const res = await this.jaxLib.whitelist.saveWhiteList(param)
            if (!res.success) return
            this.$message.success('添加成功')
            this.closeDialog()
          }
      })
    }
  },
  computed: {
    blackWhiteListType() {
      return this.$store.getters.getEnum('blackWhiteListType') || {WHITE_CARRIER_DEACTIVE: "运营商停机白名单", WHITE_DAILY_ALERT: "告警白名单"}
    }
  }
}
</script>
<template>
  <el-dialog :title="!defaultData ? '新增黑白名单' : '删除黑白名单'" :visible="visible" @close="closeDialog" @open="openDialog">
    <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="120px">
      <el-form-item label="ICCID" prop="iccids">
        <el-input
          type="textarea"
          v-model="addForm.iccids"
          :rows="6"
          placeholder="可以直接复制excel中的整列ICCID；手动输入ICCID，一行一个，最多输入1000个"
          resize="none"
          style="width:440px">
        </el-input>  
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio v-model="addForm.type" v-for="(value, key) in blackWhiteListType" :key="key" :label="key">{{value}}</el-radio>
      </el-form-item>
      <el-form-item label="原因" prop="reason" v-if="!this.defaultData">
        <el-select v-model="addForm.reason" placeholder="原因" style="width:330px;margin-left:8px">
          <el-option v-for="(item, index) in reasonList" :key="index" :label="item" :value="item"></el-option>
        </el-select>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          content="没有找到合适的标签？点击手动添加">
         <el-button slot="reference" @click="editReason">点击添加</el-button>
        </el-popover>
      </el-form-item>
      <el-form-item label="开始时间" v-if="!this.defaultData">
        <el-date-picker
          v-model="addForm.effectiveDate"
          type="datetime"
          placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" v-if="!this.defaultData">
        <el-date-picker
          v-model="addForm.expireDate"
          type="datetime"
          placeholder="选择结束时间">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="save">{{ this.defaultData ? '删 除' : '保 存'}}</el-button>
    </span>
  </el-dialog>
</template>