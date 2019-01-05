<template>
  <Poptip :confirm="true" title="确定要删除吗？" :transfer="true" @on-ok="handleOk">
    <OperatorButton type="error">
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
  methods: {
    handleOk() {
      this.$emit("on-ok");
    }
  }
};
</script>