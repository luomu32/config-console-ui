<template>
  <Modal v-model="importModalDisplayFlag" :title="title" @on-cancel="cancel">
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
import Modal from "./components/Modal.vue";

export default {
  props: ["rules", "displayFlag", "model", "title"],
  data() {
    return {
      submitLoading: false
    };
  },
  methods: {
    cancel() {
      this.displayFlag = false;
      this.$refs.form.restFields();
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
