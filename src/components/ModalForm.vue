<template>
  <Modal v-model="modalDisplayFlag" :title="title" @on-cancel="cancel">
    <Form :model="model" label-position="top" :rules="rules" ref="form">
      <slot></slot>
    </Form>
    <div slot="footer" class="footer">
      <Button type="error" class="btn" ghost @click="cancel">取消</Button>
      <Button type="success" class="btn" ghost @click="submit" :loading="submitLoading">提交</Button>
    </div>
  </Modal>
</template>
<script>
// import Modal from "./components/Modal.vue";

export default {
  props: {
    rules: Array,
    displayFlag: Boolean,
    model: { type: Object },
    title: String
  },
  watch: {
    displayFlag() {
      console.log(this.displayFlag);
      this.modalDisplayFlag = this.displayFlag;
    }
  },
  data() {
    return {
      submitLoading: false,
      modalDisplayFlag: this.displayFlag
    };
  },
  methods: {
    cancel() {
      this.modalDisplayFlag = false;
      this.$refs.form.resetFields();
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          //http
        }
      });
    }
  }
};
</script>
<style scoped>
.footer {
  text-align: center;
}
.btn {
  width: 200px;
}
</style>
