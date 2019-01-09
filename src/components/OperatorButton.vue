<template>
  <Button
    :type="type"
    :size="size"
    @click="handleClick"
    :loading="loading"
    style="margin-right: 5px"
  >
    <slot></slot>
  </Button>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: "default"
    },
    loading: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "small"
    }
  },
  methods: {
    handleClick() {
      this.$emit("click");
    }
  }
};
</script>
