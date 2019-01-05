<template>
  <Modal v-model="modalDisplayFlag" :title="modalTitle" @on-cancel="cancel">
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
    edit: { type: Boolean, default: false },
    editModal: { type: Boolean, default: false },
    paramsType: { type: String, default: "form" },
    url: String,
    modelId: String
  },
  watch: {
    value() {
      this.modalDisplayFlag = this.value;
    }
  },
  computed: {
    modalTitle() {
      if (!this.editModal) {
        return this.title;
      } else {
        if (this.edit) return `编辑${this.title}`;
        else return `新增${this.title}`;
      }
    }
  },
  data() {
    return {
      submitLoading: false,
      modalDisplayFlag: this.value
    };
  },
  methods: {
    show() {
      this.modalDisplayFlag = true;
    },
    cancel() {
      // this.modalDisplayFlag = false;
      this.$emit("closed");
      this.$refs.form.resetFields();
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid && this.url) {
          this.submitLoading = true;
          const resultProcessor = {
            success: () => {
              this.cancel();
              this.$emit("send-success");
            },
            finally: () => {
              this.submitLoading = false;
            }
          };

          let ajax;
          if (!this.editModal || (this.editModal && !this.edit)) {
            ajax = this.$ajax.post(this.url);
          } else {
            ajax = this.$ajax.put(`${this.url}/${this.modelId}`);
          }
          if (this.paramsType === "form") ajax.form(this.model);
          else ajax.body(this.model);
          ajax.send(resultProcessor);
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
