<template>
  <Poptip
    :confirm="true"
    :title="title"
    :transfer="true"
    :ok-text="$t('ok')"
    :cancel-text="$t('cancel')"
    @on-ok="handleOk"
  >
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
      default() {
        return this.$t("confirmTitle");
      }
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