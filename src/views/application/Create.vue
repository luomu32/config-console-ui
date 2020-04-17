<template>
  <div class="panel">
    <div class="form">
      <Form :model="application" label-position="top" :rules="rules" ref="form">
        <FormItem label="名称" prop="name">
          <Input v-model="application.name" clearable/>
        </FormItem>
        <FormItem label="Profile" prop="profile">
          <AutoComplete
            v-model="application.profile"
            :data="profiles"
            :filter-method="profileFilter"
            clearable
          />
        </FormItem>
      </Form>
      <div slot="footer" style="text-align:center">
        <Button type="error" ghost class="btn" @click="cancel">重置表单</Button>
        <Button type="success" ghost class="btn" @click="submit" :loading="submitLoading">提交</Button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      application: {
        name: "",
        profile: ""
      },
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "change" }]
      },
      submitLoading: false,
      profiles: ["dev", "test", "stage", "prod"]
    };
  },
  methods: {
    profileFilter: function(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    cancel() {
      this.$refs.form.resetFields();
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
        }
      });
    }
  }
};
</script>
<style scoped>
.panel {
  height: 100%;
  background-color: white;
  border-radius: 5px;
  padding: 15px;
}
.form {
  width: 500px;
  margin: 0 auto;
}
.btn {
  width: 200px;
  margin-right: 10px;
}
</style>
