<template>
  <Modal v-model="displayFlag" :closable="false" width="360" :mask-closable="false">
    <p slot="header" class="header" :class="[success ? 'success' : 'error']">
      <!-- <Icon type="ios-information-circle"></Icon> -->
      <span>{{title}}</span>
    </p>
    <slot>{{message}}</slot>
    <div slot="footer" style="text-align: center">
      <Button type="success" long @click="displayFlag=false">确定</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    // title: String,
    // message: String,
    type: {
      type: String,
      default: "success"
    }
  },
  data() {
    return {
      displayFlag: false,
      title: "",
      message: "",
      success: this.type == "success"
    };
  },
  methods: {
    show(success, title, message) {
      this.title = title;
      this.message = message;
      this.success = false;
      this.displayFlag = true;
    }
  }
};
</script>
<style scoped>
.header {
  text-align: center;
}
.error {
  color: #f60;
}
.success {
  color: black;
}
</style>

