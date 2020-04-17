<template>
  <Modal v-model="displayFlag" :title="modalTitle" @on-cancel="cancel">
    <Form :model="model" label-position="top" :rules="rules" ref="form">
      <slot></slot>
    </Form>
    <div slot="footer" class="footer">
      <Button type="error" class="btn" ghost @click="cancel">{{$t('cancel')}}</Button>
      <Button
        type="success"
        class="btn"
        ghost
        @click="submit"
        :loading="submitLoading"
      >{{$t('submit')}}</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    rules: Object,
    // value: Boolean,
    model: { type: Object },
    title: String,
    form: { type: Object },
    edit: { type: Boolean, default: false },
    editModal: { type: Boolean, default: false },
    paramsType: { type: String, default: "form" },
    httpMethod: { type: String, default: "post" },
    url: String,
    modelId: String
  },
  // watch: {
  //   value() {
  //     this.modalDisplayFlag = this.value;
  //   }
  // },
  computed: {
    modalTitle() {
      if (!this.editModal) {
        return this.title;
      } else {
        if (this.edit) return `${this.$t("edit")}${this.title}`;
        else return `${this.$t("new")}${this.title}`;
      }
    }
  },
  data() {
    return {
      submitLoading: false,
      displayFlag: false
    };
  },
  methods: {
    show() {
      this.displayFlag = true;
    },
    cancel() {
      this.displayFlag = false;
      this.$emit("closed");
      this.$refs.form.resetFields();
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid && this.url) {
          this.submitLoading = true;

          let ajax;
          //filter model
          //if not display or disable not send to server
          if (this.paramsType === "form") ajax = this.$ajax.form(this.model);
          else ajax = this.$ajax.body(this.model);

          let result;
          if (this.editModal) {
            if (!this.edit) {
              result = ajax.post(this.url);
            } else {
              result = ajax.put(`${this.url}/${this.modelId}`);
            }
          } else {
            if (this.httpMethod == "post") {
              result = ajax.post(this.url);
            } else result = ajax.put(this.url);
          }

          result
            .then(
              () => {
                if (this.editModal) {
                  this.$Message.success(
                    `${this.modalTitle}${this.$t("success")}`
                  );
                }
                this.cancel();
                this.$emit("send-success");
              },
              () => {}
            )
            .finally(() => {
              this.submitLoading = false;
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
