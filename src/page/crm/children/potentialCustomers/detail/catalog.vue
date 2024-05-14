<script>
  import getScrollParent from '@/global/function/get-scroll-parent'
  let catalogCls = 'catalog'
  let maxScrollTop = 136
  export default {
    props: ['content', 'defaultSelect', 'wined'],
    data () {
      return {
        selected: ''
      }
    },
    created () {
      this.select(this.defaultSelect)
    },
    mounted () {
      let catalogs = document.querySelector(`.${catalogCls}`)
      let container = getScrollParent(this.$el)
      let ul = catalogs.querySelector('ul')
      this._handleScroll = function (evt) {
        let target = evt.target
        let scrollTop = target.scrollTop

        if (scrollTop + 2 > maxScrollTop) {
          ul.style.cssText = `position: fixed; top: 20px;height: 100%;right:64px;`
        } else {
          ul.style.cssText = ``
        }
      }
      container.addEventListener('scroll', this._handleScroll, false)
    },
    beforeDestroy () {
      let container = getScrollParent(this.$el)
      container.removeEventListener('scroll', this._handleScroll, false)
    },
    watch: {
      'defaultSelect': 'select'
    },
    computed: {
      _content () {
        let {wined, content} = this
        if (!wined) {
          return content.slice(0, content.length - 1)
        }
        return content
      }
    },
    methods: {
      select (item, flag) {
        this.selected = item.id || item
        if (flag === false) return
        this.$emit('onCatalogSelected', this.selected)
      }
    }
  }
</script>
<template>
  <div class="catalog">
    <ul>
      <li v-for="(item, index) in _content"
          :key="index"
          :class="[selected === item.id ? 'active' : '']"
          @click="select(item)">
        <a :data-target-id="item.id">
          <wh-std-icon sign="&#xe63b;" v-if="item.finished"></wh-std-icon>
          {{item.name}}
        </a>
      </li>
    </ul>
  </div>
</template>
