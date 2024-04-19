<script>
  /**
   * Create by zeter on 2019/12/26
   */
  import {modifyList} from '../mixins/const'

  export default {
    name: 'inventory-diff',
    props: {
      beforeModifyObject: {
        type: Object,
      },
      afterModifyObject: {
        type: Object
      }
    },
    computed: {
      planClassificationList() {
        return this.$store.getters.getClassificationList(this.afterModifyObject.carrier)
      }
    },
    data() {
      return {
        modifyList,
        allTags: []
      }
    },
    methods: {
      async getCardTags() {
        const {data, success} = await this.jaxLib.card.tags.list({
          carrier: this.afterModifyObject.carrier
        })
        if (!success) return false
        this.allTags = data
      },
      formatter() {
        const mapTags = (e) => {
          const v = this.allTags.find(m => e === m.name)
          return v ? v.desc : ''
        }
        const mapRefCategory = (e) => {
          const v = this.planClassificationList.find(m => Number(e) === m.id)
          return v ? v.name : ''
        }
        this.beforeModifyObject.tags = this.beforeModifyObject.tags.split(',').map(mapTags).join(',')
        this.afterModifyObject.tags = this.afterModifyObject.tags.split(',').map(mapTags).join(',')
        this.afterModifyObject.refCategory = this.afterModifyObject.refCategory.split(',').map(mapRefCategory).join(',')
        this.beforeModifyObject.refCategory = this.beforeModifyObject.refCategory.split(',').map(mapRefCategory).join(',')
      }
    },
    async mounted() {
      await this.$store.dispatch('changeClassificationList')
      await this.getCardTags()
      this.formatter()
    }
  }
</script>

<template>
    <div class="show-package-diff">
        <div class="flex">
          <div class="flex1 wh__card mr20">
            <div class="wh__card--header">变更前</div>
            <ul class="wh__card--body">
              <li v-for="(i, index) in modifyList" :key="index" v-if="i.show ? i.show(beforeModifyObject) : true">
                {{i.name}}: {{i.formatter ? i.formatter(beforeModifyObject[i.key]) : beforeModifyObject[i.key]}}
              </li>
            </ul>
          </div>
          <div class="flex1 wh__card">
            <div class="wh__card--header">变更后</div>
            <ul class="wh__card--body">
              <li v-for="(i, index) in modifyList" :key="index" v-if="i.show ? i.show(afterModifyObject) : true">
                {{i.name}}: {{i.formatter ? i.formatter(afterModifyObject[i.key]) : afterModifyObject[i.key]}}
              </li>
            </ul>
          </div>
        </div>
    </div>
</template>

<style scoped>
  .red{
    background-color: red;
  }
  .green{
    background-color: green;
  }
</style>

