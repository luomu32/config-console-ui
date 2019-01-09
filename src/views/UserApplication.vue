<template>
<div>
    <div>
        <Button @click="add()" icon="md-add">添加</Button>
        <Button icon="md-back" to="/user">返回</Button>
    </div>
    

    <Table border :data="applications" :columns="col"></Table>

    <Modal v-model="modalDisplayFlag" title="添加可管理的应用" @on-cancel="cancel">
        <Form :model="application" label-position="top" :rules="applicationRules" ref="application">
                <FormItem label="应用名称" prop="name">
                    <Select v-model="application.name" clearable>
                        <Option v-for="item in allApplications" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </FormItem>    
          </Form>
        <div slot="footer" style="text-align: center">
            <Button type="error" style="width:200px" ghost @click="cancel">取消</Button>
            <Button type="success" style="width:200px" ghost @click="submit" :loading="submitLoading">提交</Button>
        </div>
    </Modal>
</div>
    
</template>
<script>
export default {
  data() {
    return {
      applications: [],
      modalDisplayFlag: false,
      submitLoading: false,
      allApplications: [],
      application: {
        name: ""
      },
      applicationRules: {
        name: [{ required: true, message: "请选择一个应用", trigger: "blur" }]
      },
      col: [
        {
          title: "应用名称",
          render: (h, params) => {
            return params.row
          }
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", [h("Button", "删除")]);
          }
        }
      ]
    };
  },
  mounted() {
    this.loadUserApplication();
  },
  methods: {
    loadAllApplication: function() {
      this.$http.get("/server/application").then(resp => {
        this.allApplications = resp.data.map(n => n.name);
      });
    },
    loadUserApplication: function() {
      const userId = this.$route.params.id;
      this.$http.get(`/user/${userId}/application`).then(resp => {
        this.applications = resp.data;
      });
    },
    add: function() {
      this.loadAllApplication();
      this.modalDisplayFlag = true;
    },
    cancel: function() {
      this.modalDisplayFlag = false;
      this.$refs.application.resetFields();
    },
    submit: function() {
      this.$refs.application.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          const userId = this.$route.params.id;
          this.$http
            .post(
              `/user/${userId}/application?application=${this.application.name}`
            )
            .then(() => {
              this.modalDisplayFlag = false;
              this.$refs.application.resetFields();
              this.submitLoading = false;
              this.loadUserApplication();
            })
            .catch(() => {
              this.submitLoading = false;
            });
        }
      });
    }
  }
};
</script>
