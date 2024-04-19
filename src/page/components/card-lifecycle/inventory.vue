<template>
  <div class="flex1 card-manage__detail--item import" :class="{'active': stage > 1, 'prior': stage === 1, 'over': stage < 1}">
    <div class="card-manage__detail--title">入库</div>
    <template>
      <p>
        <span class="card-manage__detail--key">入库时间</span>
        <span class="card-manage__detail--value">{{item.importDate | dateFilter}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">入库操作ID</span>
        <span class="card-manage__detail--value">
          <el-button type="text" @click="$emit('enterRouter', 'store-record-inner', {id: item.importRecordId})">{{item.importRecordId}}</el-button>
        </span>
      </p>
      <p>
        <span class="card-manage__detail--key">运营商账号</span>
        <span class="card-manage__detail--value">{{content.carrierName}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">规格</span>
        <span class="card-manage__detail--value">
          <template v-if="content.importDataVolume === -1">
            全套餐
          </template>
          <template v-else-if="content.useCountAsVolume">
            {{content.totalDataVolume}}次
          </template>
          <template v-else>
            {{content.importDataVolume | volumeFilter}}
          </template>
        </span>
      </p>
      <p>
        <span class="card-manage__detail--key">特殊限制</span>
        <span class="card-manage__detail--value">{{item.dbTagNames ? item.dbTagNames.join('、') : ''}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">批次号</span>
        <span class="card-manage__detail--value">{{item.importBatchNo}}</span>
      </p>
    </template>
  </div>
</template>

<script>
  export default {
    props: {
      stage: {
        type: Number
      },
      content: {
        default: {}
      },
      item: {
        default: {}
      }
    }
  }
</script>
