<script>
/**
 * Create by yuhao on 2020/7/2
 */
import moment from "moment";
import apis from "@/api/ajax";
export default {
  data() {
    return {
      loading: false,
      allsettingList: [],
      sellerList: [],
      provinceList: [],
      form: {
        regions: [{
          id: '',
          name: '',
          provinces: [],
          sellers: []
        }]
      }
    };
  },
  mounted() {
    this.getAllProvinces()
    this.getSubordinates()
    this.getAutoSetting()
  },
  methods: {
    async getAllProvinces() {
      const { success, data } = await apis.crm.orderSettingGetProvinces()
      if (!success) return false
      this.provinceList = data
    },
    async getAutoSetting() {
      this.loading = true
      const { success, data } = await apis.crm.orderSettingGet()
      this.loading = false
      if (!success) return false
      this.allsettingList = data
      this.form.regions = data
    },
    async getSubordinates() {
      const { success, data } = await apis.crm.orderSettingSellerGetAll();
      if (!success) return false;
      this.sellerList = data
    },

    async postForm() {
      try {
        this.$refs.form.validate(async valid => {
          if (!valid) return
          const params = []
          this.form.regions.forEach(element => {
          let param = {}
          if (element.provinces) {
            param = {
              id: element.id,
              provinces: element.provinces,
              sellers: element.sellers
            }
          }else {
            param = {
              id: element.id,
              sellers: element.sellers
            }
          }
          params.push(param)
        })
        const { success } = await apis.crm.orderSettingSet({regions: params})
        if (!success) return false
        this.$message.success('修改成功')
        this.$emit('onClose')
        })
      } catch (error) {
        console.error(error)
      }
    },

    close() {
      this.$emit('onClose')
    }

  },
};
</script>

<template>
  <div v-loading="loading">
    <el-form :model="form" ref="form" label-width="160px">
      <div v-for="(region, index) in form.regions" :key="index">
        <p>{{ region.name }}</p>
        <el-form-item
          v-if="region.name.indexOf('全国') === -1"
          label="优先分配区域"
          :prop="'regions.' + index + '.provinces'"
          :rules="{ required: true, message: '请先分配区域', trigger: 'change' }">
          <el-select
            class="width70"
            clearable
            multiple
            v-model="region.provinces"
            placeholder="请选择目标销售"
          >
            <el-option
              v-for="item in provinceList"
              :key="item"
              :value="item"
              :label="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="分配人员" 
          :prop="'regions.' + index + '.sellers'"
          :rules="{ required: true, message: '请先分配人员', trigger: 'change' }">
          <el-select
            class="width70"
            clearable
            multiple
            v-model="region.sellers"
            placeholder="请选择目标销售"
          >
            <el-option
              v-for="item in sellerList"
              :key="item"
              :value="item"
              :label="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-divider></el-divider>
      </div>
      <el-form-item>
        <el-button @click="postForm">确认</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss">
.text-line{
  //  text-decoration: underline;
  width: 60px;
  border-bottom: 1px solid black;
}
</style>