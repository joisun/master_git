<template>
  <el-form-item prop="iccidRanges">
    <div v-for="(item, index) in iccidRanges" :key="index" class="iccid-range-input-wrap">
      <div>
        <el-form-item
          label-width="80px"
          label="首ICCID"
          :prop="'iccidRanges.' + index + '.startIccid'"
          :rules="{ required: true, message: '首iccid必填' }"
        >
          <el-input
            v-model="item.startIccid"
            style="width: 250px"
            @change="startChange(item, index)"
          />
        </el-form-item>
        <el-form-item
          label="尾ICCID"
          label-width="80px"
          :prop="'iccidRanges.' + index + '.endIccid'"
          :rules="{ required: true, message: '尾部iccid必填' }"
        >
          <el-input
            v-model="item.endIccid"
            style="width: 250px"
            :disabled="!item.startIccid"
            @change="endChange(item, index)"
          />
        </el-form-item>
      </div>
      <div class="action-wrap">
        <el-form-item style="display: inline-block; margin-bottom: 0">
          <el-input-number
            v-model="item.count"
            :min="0"
            :disabled="!item.startIccid"
            @change="countChange(item, index)"
          />
        </el-form-item>
        <div style="display: inline-block; width: 80px">
          <el-button circle icon="el-icon-plus" @click="handleAdd" />
          <el-button
            v-show="index === 0 ? iccidRanges.length > 1 : true"
            icon="el-icon-minus"
            circle
            @click="handleDelete(index)"
          />
        </div>
      </div>
    </div>
  </el-form-item>
</template>

<script>
export default {
  props: {
    iccidRanges: {
      type: Array,
      require: true,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {
    handleDelete(idx) {
      const ranges = this.iccidRanges.filter((_, i) => i !== idx)
      this.$emit('change', ranges)
    },
    handleAdd() {
      this.$emit('change', [
        ...this.iccidRanges,
        {
          startIccid: '',
          endIccid: '',
          count: 0
        }
      ])
    },
    countChange(item, index) {
      const { startIccid } = item
      const number = this.getLastNumbers(startIccid)
      const prefix = startIccid.replace(number, '')
      const rangs = this.iccidRanges
      rangs[index].endIccid = `${prefix}${+number + item.count}`
      this.$emit('change', rangs)
    },
    startChange(item, index) {
      if (!item.startIccid) {
        const ranges = this.iccidRanges
        ranges[index].endIccid = ''
        ranges[index].count = 0
      }
    },
    endChange(item, index) {
      const ranges = this.iccidRanges
      ranges[index].count = this.calIccidDiff(item.startIccid, item.endIccid)
      this.$emit('change', ranges)
    },
    getLastNumbers(str) {
      return str.match(/\d+$/)
    },
    getCommonPrefix(start, end) {
      start = `${start}`
      end = `${end}`
      let commonPrefix = ''
      for (let i = 0; i <= start.length; i++) {
        if (start[i] !== end[i]) {
          return commonPrefix
        }
        commonPrefix += start[i]
      }
    },
    calIccidDiff(start, end) {
      const commPrefix = this.getCommonPrefix(start, end)
      start = start.replace(commPrefix, '') || 0
      end = end.replace(commPrefix, '') || 0
      return end - start || 0
    }
  }
}
</script>
<style lang="scss" scoped>
.iccid-range-input-wrap {
  width: 620px;
  position: relative;
  display: flex;
  align-items: center;
  align-content: center;
  &:before {
    //position: absolute;
    //top: 50%;
    //left: -20px;
    padding-bottom: 18px;
    transform: translate(0, -9px);
    content: '[';
    font-size: 57px;
    font-weight: 100;
    color: #333;
  }

  .action-wrap {
    //right: 0;
    //top: 50%;
    //position: absolute;
    //transform: translate(0, -50%);
    display: flex;
    align-items: center;
    width: 280px;
    justify-content: space-around;
    &:before {
      //position: absolute;
      //top: 50%;
      //left: -40px;
      transform: translate(0, -9px);
      line-height: 0;
      //transform: translate(0, -50%);
      content: '}';
      font-size: 57px;
      font-weight: normal;
      color: #666;
    }
  }
}
</style>
