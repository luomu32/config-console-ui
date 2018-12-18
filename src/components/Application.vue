<template>
  <div>
    <!-- <Table border :columns="col" :data="applications" :loading="applicationLoading" /> -->
    <Button @click="openAddApplicationModal()" icon="md-add">添加应用</Button>
    <Row :gutter="16">
      <Col span="8" v-for="application in applications" :key="application.name">
        <Card :title="application.name" style="margin-bottom:15px;">
          <div style="height:80px">
            <Tag
              type="dot"
              color="primary"
              v-for="profile in application.profiles"
              :key="profile"
            >{{profile}}</Tag>

            <div v-if="application.profiles.lenght==0">没有可用的Profile</div>
          </div>
          <Divider/>
          <div style="text-align:center">
            <Button style="margin-right:10px">添加Profile</Button>
            <Button style="margin-right:10px" @click="remove(application.name)">删除</Button>
            <Button>管理配置</Button>
          </div>
        </Card>
      </Col>
    </Row>

    <ModalForm
      v-model="modalDisplayFlag"
      title="添加应用"
      :model="application"
      :rules="applicationRules"
      :url="url"
      @closed="closAddApplicationModal"
      @send-success="laodApplication"
    >
      <Row :gutter="16">
        <Col span="12">
          <FormItem label="名称" prop="name">
            <Input v-model="application.name" clearable/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="Profile" prop="profile">
            <AutoComplete
              v-model="application.profile"
              :data="profiles"
              :filter-method="profileFilter"
              clearable
            />
          </FormItem>
        </Col>
      </Row>
    </ModalForm>
  </div>
</template>
<script>
import ModalForm from "./ModalForm.vue";

export default {
  components: {
    ModalForm: ModalForm
  },
  mounted() {
    // const serverId = this.$route.params.serverId;
    this.laodApplication();
  },
  data() {
    return {
      applicationLoading: false,
      applications: [],
      modalDisplayFlag: false,
      application: {
        name: "",
        profile: ""
      },
      profiles: ["dev", "test", "stage", "prod"],
      applicationRules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }]
      },
      col: [{ title: "名称", key: "name" }],
      url: "/server/application"
    };
  },
  methods: {
    laodApplication: function() {
      this.$http.get(`/server/application`).then(resp => {
        this.applications = resp.data;
      });
    },
    openAddApplicationModal() {
      this.modalDisplayFlag = true;
    },
    closAddApplicationModal() {
      this.modalDisplayFlag = false;
    },
    profileFilter: function(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    // cancel: function() {
    //   this.modalDisplayFlag = false;
    //   this.$refs.application.resetFields();
    // },
    // submit: function() {
    //   this.$refs.application.validate(valid => {
    //     if (valid) {
    //       this.$http
    //         .postForm("/server/application", {
    //           application: this.application.name,
    //           profile: this.application.profile
    //         })
    //         .then(() => {
    //           this.cancel();
    //           this.submitLoading = false;
    //           this.laodApplication();
    //         })
    //         .catch(() => {
    //           this.submitLoading = false;
    //         });
    //     }
    //   });
    // },
    remove(applicationName) {
      if (applicationName) {
        this.$ajax.delete(`/server/application/${applicationName}`).send({
          success: () => {
            this.$Message.success("删除应用成功");
            this.laodApplication();
          }
        });
      }
    }
  }
};
</script>
