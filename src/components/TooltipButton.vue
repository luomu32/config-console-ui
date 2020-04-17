<template>
  <Tooltip :content="title" :placement="direction" style="margin-right: 5px">
    <Button size="default" :icon="icon">
      <slot/>
    </Button>
  </Tooltip>
</template>
<script>
export default {
  props: {
    title: {
      type: String
    },
    direction: {
      type: String,
      default: "top"
    },
    icon: String
  }
};
</script>