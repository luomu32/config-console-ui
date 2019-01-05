<template>
  <Button
    :type="type"
    size="small"
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
    }
  },
  methods: {
    handleClick() {
      this.$emit("click");
    }
  }
};
</script>
