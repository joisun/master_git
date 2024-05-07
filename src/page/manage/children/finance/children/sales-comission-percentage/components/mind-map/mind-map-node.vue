<template>
  <div class="node">
    <slot :childNode="node" :childIndex="index" :parentNode="parentNode" :childLevel="level" />
    <div v-if="node.children" class="children">
      <mind-map-node
        v-for="(child, i) in node.children"
        :key="child.key"
        :index="i"
        :node="child"
        :parent-node="parentNode"
        :type="type"
        :is-editing="isEditing"
      >
        <template #default="{ childNode, childIndex }">
          <node-inputs
            :is-editing="isEditing"
            :type="type"
            :child-node="childNode"
            :child-index="childIndex"
            :parent-node="node"
          />
        </template>
      </mind-map-node>
    </div>
  </div>
</template>

<script>
import MindMapNode from './mind-map-node.vue'
import NodeInputs from '@/page/manage/children/finance/children/sales-comission-percentage/components/mind-map/node-inputs.vue'
export default {
  name: 'mind-map-node',
  components: {
    NodeInputs,
    MindMapNode
  },
  props: {
    parentNode: Object,
    node: Object,
    level: Number,
    index: Number,
    type: String,
    isEditing: Boolean
  },
  methods: {}
}
</script>

<style scoped></style>
