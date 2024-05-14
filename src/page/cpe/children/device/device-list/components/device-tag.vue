<script>
import apis from '@/api/ironman-api'

export default {
  data() {
    return {
      visible: false,
      device: {},
      tagList: [],
      checkedTags: []
    }
  },
  methods: {
    open(data) {
      this.visible = true
      this.device = data
      if (this.device.tags) {
        this.checkedTags = this.device.tags
      }
      this.getAllTagList()
    },
    async getAllTagList() {
      const { success, data } = await apis.deviceTagList()
      if (!success) {
        return false
      }
      this.tagList = data
    },
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    async submit() {
      const { success } = await apis.deviceTagSave({
        macAddr: this.device.macAddr,
        tags: this.checkedTags
      })
      if (success) {
        this.$message({ type: 'success', message: '操作成功' })
        this.visible = false
        this.$emit('close', { refresh: true })
      }
    }
  }
}
</script>

<template>
  <el-dialog :visible.sync="visible" title="功能标记" width="500px" :close-on-click-modal="false">
    <div v-if="visible" class="device-tag">
      <div class="device-info">
        <div class="device-info-item">
          <span class="label">设备名称：</span>
          <span class="value">{{ device.name }}</span>
        </div>
        <div class="device-info-item">
          <span class="label">Mac地址：</span>
          <span class="value">{{ device.macAddr }}</span>
        </div>
      </div>
      <div class="tags-check">
        <div class="title">功能标记</div>
        <el-checkbox-group v-model="checkedTags">
          <el-checkbox
            v-for="item in tagList"
            :key="item.desc"
            :label="item.name"
            :disabled="!item.changeable"
            class="tag-item"
          >
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.device-tag {
  .device-info {
    padding-bottom: 10px;
    border-bottom: 1px solid #efefef;

    &-item {
      line-height: 30px;

      .label {
        display: inline-block;
        width: 100px;
      }
    }
  }

  .tags-check {
    .title {
      margin-top: 10px;
      font-weight: bold;
    }

    .tag-item {
      display: inline-block;
      width: 200px;
      line-height: 30px;
    }
  }

  .dialog-footer {
    text-align: right;
    margin-top: 15px;
  }
}
</style>
