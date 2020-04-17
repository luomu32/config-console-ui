<template>
  <div>
    <Row :gutter="16">
      <Col span="6" v-for="application in applications" :key="application.name">
        <Card :title="application.name" style="margin-bottom:15px;" class="card">
          <div style="height:80px">
            <Tag
              type="dot"
              color="primary"
              closable
              v-for="profile in application.profiles"
              :key="profile"
              @on-close="removeProfile(application.name,profile)"
            >{{profile}}</Tag>

            <div v-if="application.profiles.lenght==0">没有可用的Profile</div>
          </div>
          <Divider/>
          <div style="text-align:center">
            <Button style="margin-right:10px" @click="addProfile(application.name)">添加Profile</Button>
            <ConfirmButton
              style="margin-right:10px"
              @on-ok="remove(application.name)"
              :title="'确定要删除'+application.name+'吗？'"
            >删除</ConfirmButton>
          </div>
        </Card>
      </Col>
      <Col span="6">
        <div class="add-application-container" @click="openAddApplicationModal()">
          <div class="add-application-content">
            <Icon type="ios-add" size="80" style="color: #3399ff;margin-bottom:15px;"></Icon>
            <p>点击添加一个新应用</p>
          </div>
        </div>
      </Col>
    </Row>

    <ModalForm
      ref="application"
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

    <ModalForm
      ref="profile"
      title="添加Profile"
      :model="profile"
      :rules="profileRules"
      :url="'/server/application/'+applicationName+'/profile'"
      @send-success="laodApplication"
    >
      <FormItem label="名称" prop="name">
        <AutoComplete
          v-model="profile.name"
          :data="profiles"
          :filter-method="profileFilter"
          clearable
        />
      </FormItem>
    </ModalForm>
  </div>
</template>
<script>
import ModalForm from "../../components/ModalForm.vue";
import ConfirmButton from "../../components/ConfirmButton.vue";

export default {
  components: {
    ModalForm: ModalForm,
    ConfirmButton: ConfirmButton
  },
  mounted() {
    this.laodApplication();
  },
  data() {
    return {
      applicationLoading: false,
      applications: [],
      // modalDisplayFlag: false,
      application: {
        name: "",
        profile: ""
      },
      profiles: ["dev", "test", "stage", "prod"],
      applicationRules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }]
      },
      col: [{ title: "名称", key: "name" }],
      url: "/server/application",
      applicationName: "",
      profile: {
        name: ""
      },
      profileRules: {
        name: [{ required: true, message: "名称不能为空", trigger: "change" }]
      }
    };
  },
  methods: {
    laodApplication: function() {
      this.$ajax.get(`/server/application`).then(resp => {
        this.applications = resp.data;
      });
    },
    openAddApplicationModal() {
      this.$refs.application.show();
    },
    closAddApplicationModal() {
      this.modalDisplayFlag = false;
    },
    profileFilter: function(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    remove(applicationName) {
      if (applicationName) {
        this.$ajax.delete(`/server/application/${applicationName}`).then(() => {
          this.$Message.success("删除应用成功");
          this.laodApplication();
        });
      }
    },
    addProfile(applicationName) {
      this.applicationName = applicationName;
      this.$refs.profile.show();
    },
    removeProfile(applicationName, profileName) {
      console.log(profileName);
      this.$ajax
        .delete(`/server/application/${applicationName}/profile/${profileName}`)
        .then(() => {
          this.$Message.success("删除Profile成功");
          this.laodApplication();
        });
    }
  }
};
</script>
<style scoped>
.card {
  height: 250px;
}
.add-application-container {
  height: 250px;
  text-align: center;
  border-style: dashed;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
}
.add-application-content {
  position: absolute;
  margin: auto;
  left: 0px;
  right: 0px;
  margin: auto;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
}
</style>
