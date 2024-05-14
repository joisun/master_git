<script>
/**
 * Create by zeter on 2019-05-29
 */
export default {
  name: 'wh-preview-content',
  data() {
    return {
      pictureDialog: false,
      nowIndex: 0,
      computedStyle: {
        rotate: 0,
        scale: 1,
        origin: 'center'
      },
      baseScale: (100 * 0.1) / 100,
      position: {
        left: 0,
        top: 0
      },
      holdPosition: {
        left: 0,
        top: 0
      },
      isMousedown: false
    }
  },
  props: {
    carouselHeight: {
      type: String,
      default: '75vh'
    },
    list: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number,
      default: 0
    },
    indicatorPosition: {
      type: String,
      default: 'none'
    },
    tools: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    arrowWay() {
      if (this.list && this.list.length > 1) {
        return 'always'
      }
      return 'never'
    }
  },
  methods: {
    // 渲染机制
    render() {
      let sty = this.computedStyle
      let el = this.$refs[`img-${this.nowIndex}`][0]
      el.style.transform = `rotate(${sty.rotate}deg) scale(${sty.scale})`
      el.style.left = `${this.position.left}px`
      el.style.top = `${this.position.top}px`
    },
    // 旋转
    rotate() {
      this.computedStyle.rotate += 90
      this.isMousedown = false
      this.render()
    },
    // 置空样式
    reset() {
      this.isMousedown = false
      this.computedStyle = {
        rotate: 0,
        scale: 1,
        origin: 'center'
      }
      this.position = { left: 0, top: 0 }
      this.holdPosition = { left: 0, top: 0 }
      for (let k = 0; k < this.list.length; k++) {
        let el = this.$refs[`img-${k}`][0]
        el.style.transform = ''
        el.style.left = '0px'
        el.style.top = '0px'
      }
    },
    // 改变大小
    changeSize(type) {
      if (type === 'add' && this.computedStyle.scale <= 2) {
        this.computedStyle.scale = this.computedStyle.scale + this.baseScale
      }
      if (type === 'minus' && this.computedStyle.scale > 0.5) {
        this.computedStyle.scale = this.computedStyle.scale - this.baseScale
      }
      this.isMousedown = false
      this.render()
    },
    // 改变位置
    mouseDown(e) {
      let el = this.$refs[`img-${this.nowIndex}`][0]
      this.isMousedown = true
      e = e || event
      this.holdPosition.left = e.clientX - parseInt(el.style.left)
      this.holdPosition.top = e.clientY - parseInt(el.style.top)
      el.parentElement.style.cursor = 'pointer'
    },
    mouseMove(e) {
      e = e || event
      if (this.isMousedown) {
        this.position.left = e.clientX - this.holdPosition.left
        this.position.top = e.clientY - this.holdPosition.top
      }
      this.render()
    },
    mouseUp() {
      let el = this.$refs[`img-${this.nowIndex}`][0]
      this.isMousedown = false
      el.parentElement.style.cursor = 'auto'
    },
    // 改变图片时
    changeIndex(val) {
      this.isMousedown = false
      this.reset()
      this.nowIndex = val
    },
    initActiveItem(val) {
      this.$refs['carousel'].setActiveItem(val)
    }
  }
}
</script>

<template>
  <div class="wh-preview-content">
    <div class="picture__show">
      <el-carousel
        :indicator-position="indicatorPosition"
        :autoplay="false"
        :height="carouselHeight"
        :arrow="arrowWay"
        ref="carousel"
        :initial-index="index"
        @change="changeIndex"
      >
        <el-carousel-item v-for="(item, index) in list" :key="`${item}-${index}`">
          <div
            class="picture__item"
            v-on="{ mousedown: mouseDown, mousemove: mouseMove, mouseup: mouseUp }"
          >
            <img
              :src="item"
              class="picture__item--img"
              :name="`img-${index}`"
              :ref="`img-${index}`"
              draggable="false"
            />
          </div>
        </el-carousel-item>
      </el-carousel>
      <div class="picture__show--tool" v-if="tools">
        <div class="picture__show--button" @click="changeSize('add')">
          <wh-std-icon sign="xe656"> </wh-std-icon>
        </div>
        <div class="picture__show--button" @click="changeSize('minus')">
          <wh-std-icon sign="xe61c"> </wh-std-icon>
        </div>
        <div class="picture__show--button" @click="rotate">
          <wh-std-icon sign="xe621"> </wh-std-icon>
        </div>
        <div class="picture__show--button" @click="reset">
          <wh-std-icon sign="xe64d"> </wh-std-icon>
        </div>
      </div>
    </div>
  </div>
</template>
