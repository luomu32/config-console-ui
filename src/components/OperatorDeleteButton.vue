<template>
  <Poptip :confirm="true" :title="title" :transfer="true" @on-ok="handleOk">
    <OperatorButton :type="type">
      <slot></slot>
    </OperatorButton>
  </Poptip>
</template>
<script>
import OperatorButton from "./OperatorButton.vue";
export default {
  components: {
    OperatorButton: OperatorButton
  },
  props: {
    title: {
      type: String,
      default: "确定要删除吗？"
    },
    type: {
      type: String,
      default: "error"
    }
  },
  methods: {
    handleOk() {
      this.$emit("on-ok");
    }
  }
};
</script>