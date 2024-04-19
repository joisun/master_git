<!--
 * @Author: SerkeyWu
 * @Date: 2021-03-01 13:48:58
 * @Description: Do not edit
 * @LastEditors: SerkeyWu
 * @LastEditTime: 2021-03-01 14:05:23
-->
<script>
  export default {
    model: {
      prop: 'dialogVisible',
      event: 'change'
    },
    data() {
      return {
        pictureDialog: false
      }
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: true
      },
      list: {
        type: Array,
        default: () => []
      },
      index: {
        type: Number,
        default: 0
      },
      'indicatorPosition': {
        type: String,
        default: 'inside'
      }
    },
    computed: {
      arrowWay() {
        if (this.list && this.list.length > 1) {
          return 'always'
        } else {
          return 'never'
        }
      }
    },
    watch: {
      dialogVisible(newVal, oldVal) {
        this.pictureDialog = newVal
      },
      pictureDialog(newVal, oldVal) {
        if (newVal === false) this.$emit('change', false)
      }
    }
  }
</script>
<template>
  <div>
    <el-dialog title="图片查看" :visible.sync="pictureDialog" top="3%" class="picture__global">
      <div class="picture__show" v-if="pictureDialog">
        <el-carousel :indicator-position ="indicatorPosition" :autoplay="false"
          height="82vh" :arrow="arrowWay" ref='carousel' :initial-index="index">
          <el-carousel-item v-for="item in list" :key="item">
            <div class="picture__item">
              <img :src="item" class="picture__item--img"/>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
  </div>
</template>
