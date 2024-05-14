<template>
  <el-table :data="data" size="mini">
    <el-table-column label="参数名" prop="name" width="180px"></el-table-column>
    <el-table-column label="类型" prop="type" width="100px"></el-table-column>
    <el-table-column label="说明" prop="desc"></el-table-column>
    <el-table-column label="示例" prop="example"></el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  }
}
</script>
