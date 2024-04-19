<script>
  /**
   * Create by zeter on 2017/5/31
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    mixins: [ DialogMixin ],
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
        brideCheckValue: [], // 打标
        newBrideCheckValue: [], // 新加的v2打标
        allTags: [],
        checkedTagList: [],
        activeName: 'first'
      }
    },
    methods: {
      // 获取用户标记信息
      open() {
        this.activeName = 'first'
        this.checkedTagList = this.orgContent.tagList.map((e) => e.name)
        this.setCheckedTag()
      },
      setCheckedTag() {
        this.brideCheckValue = []
        this.newBrideCheckValue = []
        this.allTags.forEach(item => {
          const checkedTag = this.checkedTagList.find(tag => tag === item.name)
          if (checkedTag) {
            item.newAuthorize ? this.newBrideCheckValue.push(checkedTag) : this.brideCheckValue.push(checkedTag)
          }
        })
      },
      // 保存用户打标
      async setUserMark() {
        let postData = [ ...this.brideCheckValue, ...this.newBrideCheckValue ].join(',')
        let rst = await this.jaxLib.customer.bride.saveTags({ orgId: this.orgId, tags: postData })
        if (rst.success) {
          this.$emit('closeDialog', this.dialogName, true)
        } else {
          this.setCheckedTag()
          this.msg(`粗错了%>_<%粗错了 因为: ${body.message}`, 'error')
        }
      },
      close() {
        this.brideCheckValue = []
        this.$emit('closeDialog', this.dialogName, false)
      },
      async getTags() {
        let rst = await this.jaxLib.customer.bride.allTags()
        if (!rst.success) return false
        this.allTags = rst.data
      }
    },
    async created() {
      // 获取所有标记信息
      await this.getTags()
      this.setCheckedTag()
    }
  }
</script>

<template>
  <div class="add-bride">
    <div class="bride__title">
      <span class="bride__title--title">组织名称:<br> {{pointOrgName}}</span>
      <span class="bride__title--title">组织ID:<br> {{orgId}}</span>
    </div>
    <div class="bride__content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="功能标记" name="first">
          <el-checkbox-group v-model="brideCheckValue">
            <el-checkbox
              v-for="item in allTags.filter(e => !e.newAuthorize)"
              :key="item.desc"
              :label="item.name"
              style="margin-right: 0; width: 50%"
              class="bride__content--checkbox">{{item.desc}}
            </el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
        <el-tab-pane label="功能标记v2" name="second">
          <el-checkbox-group v-model="newBrideCheckValue">
            <el-checkbox
              style="margin-right: 0; width: 50%"
              v-for="item in allTags.filter(e => e.newAuthorize)"
              :key="item.desc"
              :label="item.name"
              class="bride__content--checkbox">{{item.desc}}
            </el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
      </el-tabs>
    </div>
    <span slot="footer" class="wh-dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click.native="setUserMark">保存</el-button>
    </span>
  </div>
</template>
