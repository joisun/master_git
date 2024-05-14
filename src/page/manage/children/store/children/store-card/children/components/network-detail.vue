<script>
  export default {
    name: 'vpdn-network-network-detail',
    data() {
      return {
        OFFER_TYPE_MAP: this.enums.offerType.maps(),
        ip: '',
        isLoading: true,
        networkInfo: {
          inRouter: {},
          middleRouter: {},
          outRouter: {},
          networkBroken: false
        }
      }
    },
    created() {
      this.getNetworkInfo()
    },
    methods: {
      async getNetworkInfo() {
        let { ip, iccid, carrier, carrierAccountId } = this.$route.query
        this.ip = ip
        if (!iccid) return
        let res = await this.jaxLib.vpdn.networkStatus.networkInfo({ iccid, carrier, carrierAccountId })
        this.isLoading = false
        if (!res.success) return false
        this.networkInfo = res.data
      }
    }
  }
</script>

<template>
  <div class="network-detail" v-loading="isLoading">
    <div class="wrapper" :class="{ hidden: !networkInfo.inRouter.ip }">
      <div class="item">
        <div class="image-wrapper">
          <img src="//simboss-public.oss-cn-hangzhou.aliyuncs.com/announce/b0a5b5c65aead9c96ed5ae9660b68072.jpg" alt="">
        </div>
        <div class="content">
          <p>IP：{{ ip }}</p>
        </div>
      </div>
      <div class="item"></div>
      <div class="item">
        <div class="image-wrapper">
          <img src="//simboss-public.oss-cn-hangzhou.aliyuncs.com/announce/15baa11a77ef721e88a1810c9a37564b.jpg" alt="">
        </div>
        <div class="content">
          <p>入口路由器：{{ networkInfo.inRouter.ip }}</p>
          <p v-if="networkInfo.inRouter && networkInfo.inRouter.netWorkType">
            增值功能：{{ OFFER_TYPE_MAP[networkInfo.inRouter.netWorkType] }}
          </p>
          <p  v-if="networkInfo.inRouter && networkInfo.inRouter.netWorkType">
            是否在地址集合中：{{ networkInfo.inRouter.inAddr ? '是' : '否' }}
          </p>
        </div>
      </div>
      <div class="item" v-if="networkInfo.middleRouter"></div>
      <div class="item" v-if="networkInfo.middleRouter">
        <div class="image-wrapper">
          <img src="//simboss-public.oss-cn-hangzhou.aliyuncs.com/announce/15baa11a77ef721e88a1810c9a37564b.jpg" alt="">
        </div>
        <div class="content">
          <p>中间路由器：{{ networkInfo.middleRouter.ip }}</p>
          <p v-if="networkInfo.middleRouter && networkInfo.middleRouter.netWorkType">
            增值功能：{{ OFFER_TYPE_MAP[networkInfo.middleRouter.netWorkType] }}
          </p>
        </div>
      </div>
      <div class="item"></div>
      <div class="item">
        <div class="image-wrapper">
          <img src="//simboss-public.oss-cn-hangzhou.aliyuncs.com/announce/15baa11a77ef721e88a1810c9a37564b.jpg" alt="">
        </div>
        <div class="content">
          <p>出口路由器：{{ networkInfo.outRouter.ip }}</p>
          <p v-if="networkInfo.outRouter && networkInfo.outRouter.netWorkType">
            增值功能：{{ OFFER_TYPE_MAP[networkInfo.outRouter.netWorkType] }}
          </p>
          <p v-if="networkInfo.outRouter && networkInfo.outRouter.netWorkType">
            是否在地址集合中：{{ networkInfo.outRouter.inAddr ? '是' : '否' }}
          </p>
        </div>
      </div>
      <div class="item" :class="{ interrupt: networkInfo.networkBroken }">
        <wh-std-icon v-if="networkInfo.networkBroken" sign="&#xe682;"></wh-std-icon>
      </div>
      <div class="item">
        <div class="image-wrapper">
          <img class="server-img"
            src="//simboss-public.oss-cn-hangzhou.aliyuncs.com/announce/92ea5f5739cc7f60f0b3aef41f50828a.jpg" alt="">
        </div>
        <div class="content">
          <p>目标地址</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .network-detail {
    .wrapper {
      display: flex;
      justify-content: center;
      .item {
        width: 180px;
        .image-wrapper {
          height: 260px;
          line-height: 260px;
          text-align: center;

          img {
            width: 95%;
            vertical-align: middle;

            &.server-img {
              width: 80%;
            }
          }
        }

        .content {
          width: 150%;
          margin-left: -25%;
          text-align: center;
        }

        &:nth-child(even) {
          background-color: #00db84;
          height: 2px;
          margin-top: 140px;
          position: relative;

          &:after {
            content: '';
            position: absolute;
            right: 0;
            top: -8px;
            width: 16px;
            height: 16px;
            border-top: 2px solid #00db84;
            border-right: 2px solid #00db84;
            transform: rotate(45deg);
          }
        }

        &.interrupt {
          background-color: #d2cece;

          &:after {
            border-top: 2px solid #d2cece;
            border-right: 2px solid #d2cece;
          }

          i {
            width: 26px;
            height: 26px;
            font-size: 26px;
            background-color: #ff4d51;
            border-radius: 50%;
            color: #fff;
            position: absolute;
            left: 46%;
            top: -13px;
          }
        }
      }
      &.hidden {
        visibility: hidden;
      }
    }
  }
</style>
