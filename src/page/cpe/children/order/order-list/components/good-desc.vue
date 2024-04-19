<template>
  <div class="good-desc">
    <template v-if="detail.itemType === 'DEVICE'">
      <div class="device-good flex" :key="detail.itemNo">
        <div class="flex1 good-pic">
          <img :src="detail.itemPic" :alt="detail.itemName">
        </div>
        <div class="flex7">
          <div class="flex item">
            <div class="flex5 attribute border-right">
              <span>{{detail.itemName}}</span>
              <span v-for="(p, index) in detail.properties.split(';')" :key="index">
                {{p}}
              </span>
            </div>
            <div class="flex1 border-right content">
              ￥{{detail.price}}
            </div>
            <div class="flex1 content border-right">-</div>
            <div class="flex1 content">
              <template v-if="macAddrList && macAddrList.length">
                <el-popover
                  placement="top-start"
                  title="Mac地址"
                  width="200"
                  trigger="hover"
                 >
                  <div>
                    <div v-for="macAddr in macAddrList" :key="macAddr">{{macAddr}}</div>
                  </div>
                  <span slot="reference" class="cursor-pointer color-link">{{detail.buyCount}}</span>
                </el-popover>
              </template>
              <span v-else>{{detail.buyCount}}</span>
            </div>
          </div>
          <div class="flex item">
            <div class="flex5 attribute border-right">
              <p>服务: {{detail | serviceRender}}</p>
            </div>
            <div class="flex1 border-right content">
              ￥{{detail.serviceFee}}
            </div>
            <div class="flex1 content border-right">-</div>
            <div class="flex1 content">
              {{detail.buyCount}}
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-if="detail.itemType === 'PACKAGE'" class="package-good ">
      <div class="flex">
        <div class="flex6">
          <el-tag class="tac ml10">{{detail.itemName}}</el-tag>
          <div class="flex">
            <div class="flex1 good-pic content">
              <div>
                <img :src="detail.itemPic" :alt="detail.itemName">
              </div>
            </div>
            <div class="flex5">
              <div class="item flex" v-for="i in detail.items" :key="i.itemNo">
                <template v-if="i.itemType === 'DEVICE'">
                  <div class="flex5">
                    <p>{{i.itemName}}</p>
                    <span v-for="p in i.properties.split(';')" :key="p">
                      {{p}}
                    </span>
                    <p>{{i | serviceRender}}</p>
                  </div>
                  <div class="flex1 content">
                    <div>✖️{{i.itemCount}}</div>
                  </div>
                </template>
                <template v-if="i.itemType === 'CARD'">
                  <div class="flex5">
                    <p>{{i.itemName}}</p>
                    <span v-for="p in i.properties.split(';')" :key="p">
                      {{p}}
                    </span>
                  </div>
                  <div class="flex1 content">
                    <div>✖️{{i.itemCount}}</div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="flex1 border-left content">
          <div>
            ￥{{detail.price}}
          </div>
        </div>
        <div class="flex1 content border-left">
          <div>️{{detail.buyYear}}</div>
        </div>
        <div class="flex1 border-left content">
          <div>
            <template v-if="macAddrList && macAddrList.length">
              <el-popover
                placement="top-start"
                title="Mac地址"
                width="200"
                trigger="hover"
              >
                <div>
                  <div v-for="macAddr in macAddrList" :key="macAddr">{{macAddr}}</div>
                </div>
                <span slot="reference" class="cursor-pointer color-link">{{detail.buyCount}}</span>
              </el-popover>
            </template>
            <span v-else>{{detail.buyCount}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { serviceRender } from '../mixins/service-render'
  export default {
    name: 'good-desc',
    data() {
      return {}
    },
    props: {
      detail: {
        type: Object
      },
      macAddrList: {
        type: Array,
        default: () => []
      }
    },
    filters: {
      serviceRender
    }
  }
</script>

<style lang="scss" scoped>
  .good-desc {
      line-height: 40px;
      font-size: 14px;
      & > div{
        border-top: 1px #ddd solid;
        &:first-child{
          border-top: none;
        }
      }
    .device-good{
      align-items: center;
    }
    .color-link {
      color: #1c8de0;
      font-weight: bold;
      outline: none;
    }
    .package-good{
      p{
        font-size: 13px;
      }
      span{
        font-size: 13px;
      }
    }
    .good-pic {
      width: 100%;
      overflow: hidden;
      margin: 0 15px;
      img {
        width: 100%;
      }
      .el-tag {
        margin-top: 10px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .attribute {
      font-size: 0;

      & span {
        width: 50%;
        display: inline-block;
        font-size: 13px;
        vertical-align: top;
      }

      & p {
        font-size: 13px;
      }
    }

    .item {
      border-bottom: 1px #ddd dashed;

      &:last-child {
        border-bottom: none;
      }
    }

    .border-right {
      border-right: 1px #ddd solid;
    }
    .border-left {
      border-left: 1px #ddd solid;
    }

    .content {
      word-break: break-word;
      align-content: center;
      align-items: center;
      justify-content: center;
      display: flex;
    }
  }
</style>
