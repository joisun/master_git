<script>
import * as appTypes from '@/store/types'
import DialogContact from '../components/dialog-contact.vue'
import { mapState } from 'vuex'
import EventBus from '@/page/bus'
import Events from '@/constant/events'
const tempCurrentContact = {
  customerId: '',
  name: '',
  mobile: '',
  email: '',
  title: '',
  description: ''
}
export default {
  components: { DialogContact },
  props: ['customerId', 'readOnly'],
  data() {
    return {
      currentContact: null,
      isDialogShow: false,
      onlyUpdate: true
    }
  },
  computed: {
    ...mapState({
      content: (state) => state.customer.contacts
    })
  },
  methods: {
    closeDialog({ refreshable, data }) {
      this.isDialogShow = false
      if (refreshable === true) {
        this.save(data)
      }
    },
    // 新增联系人
    addContact() {
      this.currentContact = tempCurrentContact
      this.onlyUpdate = false
      this.isDialogShow = true
    },
    async edit(item) {
      const { success, data } = await this.jaxLib.common.desensitizationShow(
        {
          id: item.id,
          showField: ['phone'],
          idType: 'contactId'
        },
        'crm'
      )
      this.currentContact = item
      if (success) {
        this.currentContact = {
          ...item,
          mobile: data.phone || item.mobile
        }
      }
      this.onlyUpdate = true
      this.isDialogShow = true
    },
    // 新增联系人对应的是pots接口，更新是put接口
    async save(data) {
      let customerId = this.customerId
      let type = data.id ? appTypes.CUSTOMER_CONTACT_PUT : appTypes.CUSTOMER_CONTACT_POST
      let message = data.id ? '联系人更新成功' : '联系人新增成功'
      data.customerId = customerId
      await this.$store.dispatch(type, data)
      await this.$store.dispatch(appTypes.CUSTOMER_CONTACT_SEARCH, customerId)
      this.$message.success(message)
      EventBus.$emit(Events.dimensionsDidChange, {
        msg: `联系人新增或者修改完毕，需要通知spy-scroll刷新位置信息`
      })
    }
  }
}
</script>
<template>
  <div class="line-box contacts">
    <span class="line-box__title">联系人</span>
    <div class="line-box__body contact-body">
      <li v-for="(item, index) in content" :key="index">
        <span class="item is-spec"
          ><label>姓名：{{ item.name }}</label></span
        >&nbsp;&nbsp;
        <span class="item is-spec phone"
          ><label
            >手机号：
            <wh-desensitization :id="item.id" show-field="phone" system="crm" id-type="contactId">
              {{ item.mobile }}
            </wh-desensitization>
          </label></span
        >&nbsp;&nbsp;
        <span class="item email"
          ><label>邮箱：{{ item.email }}</label></span
        >&nbsp;&nbsp;
        <span class="item title"
          ><label>职务：{{ item.title }}</label></span
        >
        <span class="item description" :title="item.description"
          ><label>备注：{{ item.description }}</label></span
        >
        <span v-if="!readOnly" class="operate">
          <wh-std-icon sign="&#xe6b7;" @click="edit(item)"></wh-std-icon>
        </span>
      </li>
      <el-button
        v-if="!readOnly"
        auth-code="/api/customer/contact/post"
        type="primary"
        size="small"
        @click="addContact"
      >
        添加联系人
      </el-button>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="onlyUpdate ? '修改联系人' : '新增联系人'"
      width="30%"
      :visible.sync="isDialogShow"
    >
      <DialogContact :content="currentContact" @onClose="closeDialog"></DialogContact>
    </el-dialog>
  </div>
</template>
