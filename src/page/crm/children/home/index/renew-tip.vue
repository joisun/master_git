<script>
  /**
   * Create by zeter on 2019/12/2
   */
  import apis from '@/api/ajax'
  import regexps from '@/constant/regexps'
  export default {
    name: 'renew-tips',
    props: {
      sellerList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        data: {},
        carouselIndex: 0
      }
    },
    computed: {
      user() {
        return this.$store.state.overall.user
      }
    },
    methods: {
      async getContent() {
        let { success, data } = await apis.card.getSaleRenewData()
        if (!success) return false
        if (!data.infoList) {
          data.infoList = []
        }
        if (data.leader || data.superLeader) {
          data.infoList.unshift({
            name: '销售总计',
            rechargeInfo: {
              rechargeCount: data.totalCount,
              rechargeMoney: data.totalMoney
            }
          })
        }
        if (!data.superLeader) {
          data.infoList.forEach(item => {
            const seller = this.sellerList.find(s => s.saleName === item.name)
            if (seller) {
              item.name = seller.realName
            }
          })
        }
        this.data = data
      },
      async exportDetail() {
        this.$prompt('请确认邮箱', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: regexps.email,
          inputValue: this.user.email,
          inputErrorMessage: '邮箱格式不正确'
        }).then(async({ value }) => {
          let exportAll = false
          if (this.data.leader) {
            exportAll = this.carouselIndex === 0
          }
          if (this.data.superLeader) {
            exportAll = true
          }
          let { success, message } = await apis.card.getSaleRenewExportPath({
            email: value,
            exportAll
          })
          if (!success) return false
          this.$message.success(message)
        }).catch(() => {
        })
      },
      carouselChange(index) {
        setTimeout(() => {
          this.carouselIndex = index
        }, 300)
      }
    },
    mounted() {
      this.getContent()
    }
  }
</script>

<template>
  <div class="renew-tips">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>本月续费提醒（{{data.infoList.length}}）</span>
      </div>
      <el-carousel @change="carouselChange" trigger="click" height="220px" :autoplay="false" indicator-position="none" arrow="always" :loop="false">
        <el-carousel-item v-for="(item, key) in data.infoList" :key="key">
          <div class="renew-card">
            <p class="renew-card-title">
              {{item.name}}:
              <el-button v-if="user.realName === item.name || carouselIndex === 0" style="float: right;" type="text" @click="exportDetail">导出明细</el-button>
            </p>
            <div class="flex renew-card-item">
              <div class="flex1">
                <p>续费客户</p>
                <p>{{item.rechargeInfo.rechargeCount}}</p>
              </div>
              <div class="flex1">
                <p>续费金额</p>
                <p>{{item.rechargeInfo.rechargeMoney}}</p>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-card>
  </div>
</template>
<style lang="scss">
  .renew-tips {
    margin-bottom: 10px;
  }

  .box-card {
    height: 100%;
  }

  .el-carousel__button {
    background-color: #e4e7ed;
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  .renew-card {
    background-color: #fff;
    &-title {
      height: 30px;
      line-height: 30px;
    }
    &-item {
      background-color: #fff;
      text-align: center;
      margin-top: 20px;

      .flex1 {
        width: 150px;
        padding: 20px 0;

        p {
          padding: 10px 0;

          &:first-child {
            color: #797878;
            font-size: 14px;
          }

          &:last-child {
            font-size: 18px;
            font-weight: bold;
          }
        }
      }
    }
  }
</style>
