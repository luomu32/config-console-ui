<template>
  <Drawer
    :title="title"
    :closable="true"
    :styles="drawerStyle"
    v-model="displayFlag"
    :width="width"
  >
    <div>
      <Spin size="large" fix v-if="loading"></Spin>
      <slot></slot>
    </div>
    <div class="drawer-footer">
      <Button long type="success" ghost @click="handleSubmit">保存</Button>
    </div>
  </Drawer>
</template>
<script>
export default {
  props: {
    // value: { type: Boolean, default: false },
    title: String,
    width: String,
    loading: { type: Boolean, default: false }
  },
  //   watch: {
  //     value() {
  //       this.displayFlag = this.value;
  //     }
  //   },
  data() {
    return {
      displayFlag: false,
      drawerStyle: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      }
    };
  },
  methods: {
    show() {
      this.displayFlag = true;
    },
    close() {
      this.displayFlag = false;
    },
    handleSubmit() {
      this.$emit("submit");
    }
  }
};
</script>
