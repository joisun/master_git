<script>
  export default {
    inject: ['tuple'],
    props: ['content', 'stage', 'stageName'],
    data () {
      return {

      }
    }
  }
</script>
<template>
  <div class="section" data-offset-id="win">
    <div class="section__head">
      <span>赢单</span>
      <div class="section__head--desc">
        <div class="desc__item">
          <label>进入时间：</label>
          <span>{{content.entryTime | dateFilter}}</span>
        </div>
        <div class="desc__item">
          <label>停留时间：</label>
          <template v-if="content.stayDays">
            <span>
              <i v-if="Math.floor(content.stayDays/24)>0">{{Math.floor(content.stayDays/24)}}天</i><i>{{content.stayDays%24}}小时</i>
            </span>
          </template>
        </div>
      </div>
    </div>
    <div class="section__body">
      <img class="success-img" src="https://simboss-public.oss-cn-hangzhou.aliyuncs.com/wh/success.png"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .success-img {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
