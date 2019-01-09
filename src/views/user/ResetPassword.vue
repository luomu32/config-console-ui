<template>
  <ModalForm
    title="重置新密码"
    ref="restPwd"
    :url="'/user/'+userId+'/reset-password'"
    :rules="rules"
    :model="user"
    httpMethod="put"
    @send-success="resetPwdSuccess"
  >
    <Row :gutter="16">
      <Col span="12">
        <FormItem label="新密码" prop="password">
          <Input v-model="user.password" clearable type="password"/>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="确认新密码" prop="confirmPassword">
          <Input v-model="user.confirmPassword" clearable type="password"/>
        </FormItem>
      </Col>
    </Row>
  </ModalForm>
</template>
<script>
import ModalForm from "../../components/ModalForm.vue";
// import { confirmPasswordValidator } from "../../validator.js";

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
      else if (value != this.user.password) callback(new Error(rule.message));
      else callback();
    };
    return {
      user: {
        password: "",
        confirmPassword: ""
      },
      rules: {
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          {
            validator: confirmPwdValidator,
            message: "两次输入的密码不一致",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    show() {
      this.$refs.restPwd.show();
    },
    resetPwdSuccess() {
      this.$Message.success("重置密码成功");
    }
  }
};
</script>
