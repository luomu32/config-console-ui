<template>
  <ModalForm
    title="用户"
    ref="user"
    :model="user"
    :modelId="user.id"
    :rules="rules"
    :edit="isEdit"
    :editModal="true"
    url="/user"
    @send-success="handleSendSuccess"
  >
    <Row :gutter="16">
      <Col span="12">
        <FormItem label="名称" prop="name">
          <Input v-model="user.name" :disabled="isEdit" clearable/>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="所属角色" prop="roleId">
          <Select v-model="user.roleId">
            <Option v-for="item in roles" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="12">
        <FormItem label="密码" prop="password" v-if="!isEdit">
          <Input v-model="user.password" clearable type="password"/>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="确认密码" prop="confirmPassword" v-if="!isEdit">
          <Input v-model="user.confirmPassword" ignoreSubmit clearable type="password"/>
        </FormItem>
      </Col>
    </Row>
  </ModalForm>
</template>
<script>
import ModalForm from "../../components/ModalForm.vue";
export default {
  components: {
    ModalForm: ModalForm
  },
  props: {
    userForEdit: Object
  },
  data() {
    const confirmPasswordValidator = (rule, value, callback) => {
      if (!value) callback();
      else if (value != this.user.password) callback(new Error(rule.message));
      else callback();
    };
    return {
      roles: [],
      isEdit: false,
      user: {
        id: "",
        name: "",
        password: "",
        confirmPassword: "",
        roleId: ""
      },
      rules: {
        name: [
          { required: true, message: "用户名不能为空", trigger: "change" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "change" }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "change" },
          {
            validator: confirmPasswordValidator,
            message: "两次输入的密码不一致",
            trigger: "change"
          }
        ],
        roleId: [
          {
            required: true,
            message: "请选择一个所属的角色",
            trigger: "blur",
            type: "number"
          }
        ]
      }
    };
  },
  methods: {
    show() {
      if (this.userForEdit && this.userForEdit.id) {
        this.isEdit = true;
        this.user.id = this.userForEdit.id;
        this.user.name = this.userForEdit.name;
        this.user.roleId = this.userForEdit.roleId;
      } else this.isEdit = false;

      this.$ajax
        .get("/role")
        .send()
        .then(
          ({ data }) => {
            this.roles = data;
            this.$refs.user.show();
          },
          () => {}
        );
    },

    handleSendSuccess() {
      this.$emit("send-success");
    }
  }
};
</script>
