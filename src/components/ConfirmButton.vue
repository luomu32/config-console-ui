<template>
  <Poptip :confirm="true" :title="title" :transfer="true" @on-ok="$emit('on-ok')">
    <Button :type="type">
      <slot></slot>
    </Button>
  </Poptip>
</template>
<script>
export default {
  props: {
    title: String,
    type: {
      type: String,
      default: "default"
    }
  }
};
</script>

