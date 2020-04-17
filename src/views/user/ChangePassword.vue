<template>
  <ModalForm
    ref="change"
    :title="$t('user.form.change_password.title')"
    :rules="rules"
    :model="password"
    :url="'/user/'+userId+'/change-password'"
    httpMethod="put"
    @send-success="$Message.success($t('user.form.change_passowrd.success'))"
  >
    <FormItem :label="$t('user.form.change_passowrd.old_password.label')" prop="oldPassword">
      <Input v-model="password.oldPassword" clearable type="password"/>
    </FormItem>
    <FormItem :label="$t('user.form.new_password.title')" prop="newPassword">
      <Input v-model="password.newPassword" clearable type="password"/>
    </FormItem>
    <FormItem :label="$t('user.confirm_password.title')" prop="confirmNewPassword">
      <Input v-model="password.confirmNewPassword" clearable type="password"/>
    </FormItem>
  </ModalForm>
</template>
<script>
import ModalForm from "@/components/ModalForm.vue";

export default {
  components: {
    ModalForm: ModalForm
  },
  props: {
    userId: String
  },
  data() {
    const confirmPwdValidator = (rule, value, callback) => {
      if (!value) callback();
      else if (value != this.password.newPassword)
        callback(new Error(rule.message));
      else callback();
    };
    return {
      password: {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      },
      rules: {
        oldPassword: [
          { required: true, message: this.$t("user.old_password.empty") }
        ],
        newPassword: [
          { required: true, message: this.$t("user.new_password.empty") }
        ],
        confirmNewPassword: [
          { required: true, message: this.$t("user.confirm_password.empty") },
          {
            validator: confirmPwdValidator,
            message: this.$t("user.confirm_password.not_match")
          }
        ]
      }
    };
  },
  methods: {
    show() {
      if (this.userId) this.$refs.change.show();
    }
  }
};
</script>
