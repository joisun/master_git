<script>
  export default {
    props: {
      parameters: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        activeLabel: '',
        newTabCount: 1,
        dialogVisible: false,
        editTab: {},
        editTabIndex: 0,
        newTabLabel: '',
        specsConfig: [
          {
            label: '硬件参数',
            specs: [
              { name: '', value: '' }
            ]
          },
          {
            label: '+'
          }
        ]
      }
    },
    created() {
      this.activeLabel = this.specsConfig[0].label
    },
    watch: {
      parameters(val) {
        if (val && val.length) {
          this.activeLabel = val[0].label
          this.specsConfig = [
            ...val,
            {
              label: '+'
            }
          ]
        }
      }
    },
    methods: {
      addRow(item) {
        item.specs.push({ name: '', value: '' })
      },
      editTabLabel(item, index) {
        this.editTab = item
        this.editTabIndex = index
        this.newTabLabel = item.label
        this.dialogVisible = true
      },
      onDialogConfirm() {
        if (!this.newTabLabel) {
          this.$message({ type: 'error', message: '名称不能为空' })
          return false
        }
        const tab = this.specsConfig.find((item, index) => (index !== this.editTabIndex && item.label === this.newTabLabel))
        if (tab) {
          this.$message({ type: 'error', message: '名称已存在' })
          return false
        }
        this.specsConfig[this.editTabIndex].label = this.newTabLabel
        this.activeLabel = this.newTabLabel
        this.dialogVisible = false
      },
      tabClick() {
        const getNewTabLabel = () => {
          let label = `新增标签页${this.newTabCount}`
          const item = this.specsConfig.find(item => item.label === label)
          this.newTabCount++
          if (!item) {
            return label
          }
          return getNewTabLabel()
        }

        if (this.activeLabel === '+') {
          const label = getNewTabLabel()
          this.specsConfig.splice(this.specsConfig.length - 1, 0, {
            label,
            specs: [
              { name: '', value: '' }
            ]
          })
          this.activeLabel = label
        }
      },
      deleteTab(label, index) {
        this.$confirm(`确定删除 ${label} 吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.specsConfig.splice(index, 1)
          this.activeLabel = this.specsConfig[index > 0 ? index - 1 : 0].label
        })
      },
      deleteSpecsItem(specs, index) {
        specs.splice(index, 1)
      },
      moveRowPosition(item, index, direction) {
        if (direction === 'up' && index !== 0) {
          const tmp = item.specs[index - 1]
          item.specs[index - 1] = item.specs[index]
          item.specs[index] = tmp
          this.$forceUpdate()
        } else if (direction === 'down' && index < item.specs.length - 1) {
          const tmp = item.specs[index + 1]
          item.specs[index + 1] = item.specs[index]
          item.specs[index] = tmp
          this.$forceUpdate()
        }
      },
      submit() {
        const specsConfig = JSON.parse(JSON.stringify(this.specsConfig))
        specsConfig.pop()
        // eslint-disable-next-line no-unused-vars
        for (const item of specsConfig) {
          if (!item.specs && !item.specs.length) {
            this.$message({ type: 'warning', message: `「${item.label}」标签页内容不能为空` })
            return false
          }
          // eslint-disable-next-line no-unused-vars
          for (const specs of item.specs) {
            if (!specs.name || !specs.value) {
              this.$message({ type: 'warning', message: `「${item.label}」标签页存在未填写内容，请检查!` })
              return false
            }
          }
        }
        return specsConfig
      }
    }
  }
</script>

<template>
  <div class="specs-edit">
    <el-tabs type="card" v-model="activeLabel" @tab-click="tabClick">
      <el-tab-pane v-for="(item, i) in specsConfig" :key="item.label" :name="item.label">
        <span slot="label">
          {{item.label}}
          <i
            v-if="i < specsConfig.length - 1"
            style="margin: 0 5px;"
            class="el-icon-edit"
            @click="editTabLabel(item, i)"
          >
          </i>
          <i
            v-if="i < specsConfig.length - 1 && specsConfig.length > 2"
            class="el-icon-delete"
            @click="deleteTab(item.label, i)"
          >
          </i>
        </span>
        <div class="edit-row flex" v-for="(specs, index) in item.specs" :key="index">
          <div class="name">
            <el-input v-model="specs.name"></el-input>
          </div>
          <div class="value">
            <el-input type="textarea" v-model="specs.value" :rows="1"></el-input>
          </div>
          <div class="operation">
            <el-button :disabled="index === 0" @click="moveRowPosition(item, index, 'up')">上移一行</el-button>
            <el-button :disabled="index === item.specs.length - 1" @click="moveRowPosition(item, index, 'down')">
              下移一行
            </el-button>
            <el-button :disabled="item.specs.length === 1" @click="deleteSpecsItem(item.specs, index)">删除</el-button>
          </div>
        </div>
        <div class="add-row">
          <el-button size="mini" @click="addRow(item)" circle>
            <i class="el-icon-plus"></i>
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="修改参数Tab"
      :visible.sync="dialogVisible"
      width="350px"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-input v-model="newTabLabel"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss">
  .specs-edit {
    max-width: 1000px;

    .edit-row {
      margin-bottom: 8px;

      .name {
        width: 200px;
        margin-right: 15px;

        .el-input {
          width: 100%;
        }
      }

      .value {
        width: 480px;
        margin-right: 15px;
      }
    }

    .add-row {
      margin-top: 10px;
    }

    .el-tabs__item {
      font-size: 14px;
      line-height: 36px;
    }

    .el-tabs__content {
      border-bottom: 1px solid #E4E7ED;
      padding-bottom: 10px;
    }
  }
</style>
