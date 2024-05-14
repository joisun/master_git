<template>
  <span
    :key="Date.now()"
    v-desensitization="{
      id,
      showField,
      system,
      idType
    }"
  >
    <slot />
  </span>
</template>
<script>
export default {
  props: {
    id: {
      type: [Number, String],
      require: true,
      default: -1
    },
    showField: {
      type: String,
      require: true,
      default: ''
    },
    system: {
      type: String,
      require: false,
      default: 'captain'
    },
    idType: {
      type: String,
      default: ''
    }
  }
}
</script>