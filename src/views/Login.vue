<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title :bordered="true">
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
            <FormItem prop="name">
              <Input v-model="form.name" placeholder="请输入用户名">
                <span slot="prepend">
                  <Icon :size="16" type="ios-person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
                <span slot="prepend">
                  <Icon :size="14" type="md-lock"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>
<style scoped lang="less">
.login {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;

  &-con {
    position: absolute;
    margin: auto;
    left: 0px;
    right: 0px;
    margin: auto;
    top: 50%;
    transform: translateY(-50%);
    width: 300px;

    &-header {
      font-size: 16px;
      font-weight: 300;
      text-align: center;
      padding: 30px 0;
    }
    .form-con {
      padding: 10px 0 0;
    }
    .login-tip {
      font-size: 10px;
      text-align: center;
      color: #c3c3c3;
    }
  }
}
</style>
<script>
export default {
  computed: {},
  data() {
    return {
      form: {
        name: "",
        password: ""
      },
      rules: {
        name: [{ required: true, message: "用户名不能为空" }],
        password: [{ required: true, message: "密码不能为空" }]
      }
      //   loginBtnFlag: false
    };
  },
  methods: {
    handleSubmit: function() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$ajax
            .form(this.form)
            .post("auth")
            .then(
              ({ data }) => {
                this.$store.commit("user/set", data);
                this.$router.replace({ name: "home" });
              },
              () => {}
            );
        }
      });
    }
  }
};
</script>

