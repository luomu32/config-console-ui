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
export default {
  props: {
    rules: Object,
    value: Boolean,
    model: { type: Object },
    title: String,
    url: String
  },
  watch: {
    value() {
      this.modalDisplayFlag = this.value;
    }
  },
  data() {
    return {
      submitLoading: false,
      modalDisplayFlag: this.value
    };
  },
  methods: {
    cancel() {
      // this.modalDisplayFlag = false;
      this.$emit("closed");
      this.$refs.form.resetFields();
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid && this.url) {
          this.submitLoading = true;
          //http
          this.$ajax
            .post(this.url)
            .form(this.model)
            .send({
              success: () => {
                
                this.cancel();
                this.$emit("send-success");
              },
              finally: () => {
                this.submitLoading = false;
              }
            });
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
