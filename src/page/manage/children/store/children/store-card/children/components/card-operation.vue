<script>
  export default {
    methods: {
      toOperationPage(name) {
        this.$router.push({ name, query: { from: 'card-list' } })
      }
    }
  }
</script>

<template>
  <div class="card-operation">
    <h4>卡状态变更</h4>
    <p>
      <el-button disabled>激活卡</el-button>
      <el-button disabled>停卡</el-button>
    </p>
    <p>
      <el-button @click="toOperationPage('eliminate-card')">提交销卡</el-button>
      <el-button disabled>卡回收</el-button>
    </p>
    <p>
      <el-button disabled>卡清除</el-button>
      <el-button disabled>锁卡</el-button>
    </p>
    <p>
      <el-button @click="toOperationPage('cancel-plan-detail')">取消卡计划套餐</el-button>
      <el-button @click="toOperationPage('return-stock-detail')">卡恢复库存状态</el-button>
    </p>
    <p>
      <el-button @click="toOperationPage('carrier-cancel-test')">取消测试期</el-button>
    </p>
    <h4>卡信息修改</h4>
    <p>
      <el-button @click="toOperationPage('inventory-modify-detail')">入库信息修改</el-button>
      <el-button @click="toOperationPage('carrier-modify-package-detail')">入库套餐修改</el-button>
    </p>
    <p>
      <el-button @click="toOperationPage('carrier-account-modify-detail')">运营商账户修改</el-button>
      <el-button @click="toOperationPage('customer-modify-package-detail')">客户套餐修改</el-button>
    </p>
  </div>
</template>

<style lang="scss">
  .card-operation {
    h4 {
      margin-bottom: 15px;
      color: #666;
    }

    p {
      width: 260px;
      display: flex;
      justify-content: center;
      margin-bottom: 15px;

      button {
        width: 120px;
      }
    }
  }
</style>
