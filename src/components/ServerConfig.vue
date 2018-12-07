<template>
    <div>
        <div class="op">
             <ButtonGroup class="op-btn">
                <Button to="/" icon='ios-arrow-back'>
                    返回
                </Button>
                <Button @click="showModel(false)" icon="md-add">
                    新增
                </Button>
                <Button @click="showBatchDeleteModel()" icon="md-trash" type="error" :disabled="this.configs.length==0">
                    批量删除
                </Button>
                <Button @click="showModel(false)" icon="md-download" :disabled="this.configs.length==0">
                    导出
                </Button>
                <Upload action="//jsonplaceholder.typicode.com/posts/" :show-upload-list="false" 
                :format="['properties','yml']" :on-format-error="updateFormatError" style="display:inline-block">
                <Button icon="md-arrow-up">
                    导入
                </Button>
                </Upload>
                <Button @click="loadServerConfigs()" icon="md-refresh">
                    刷新
                </Button>
                
             </ButtonGroup>
             <Select v-model="application" class="ap" placeholder="请选择一个应用">
                  <Icon type="ios-person-outline" slot="prepend"></Icon>
                <Option v-for="item in applications" :value="item" :key="item">{{ item }}</Option>
            </Select>
            <Select v-model="profile" class="profile" placeholder="请选择一个剖面" v-show="profiles.length!=0">
                <Option v-for="item in profiles" :value="item" :key="item">{{ item }}</Option>
            </Select>
        </div>

        <Table border ref="configs" :columns="col" :data="configs" :loading="configLoading"></Table>

        <Modal v-model="showModelFlag" :title="modalTitle" @on-cancel="cancel">
            <!-- <div v-bind:class="noticeError"> -->
                <!-- <Alert type="error" show-icon v-show="errorInfo"> -->
                <!-- 添加失败，{{errorMessage}} -->
            <!-- </Alert> -->
            <!-- </div> -->
            
            <Form :model="config" label-position="top" :rules="configRules" ref="config">
                <FormItem label="剖面" prop="profile">
                    <Input v-model="config.profile" clearable :disabled="this.editMode" />
                </FormItem>
                <FormItem label="名称" prop="name">
                    <Input v-model="config.name" clearable />
                </FormItem>
                <FormItem label="值" prop="value">
                    <Input type="textarea" :rows="4" :autosize="{minRows: 2,maxRows: 8}" v-model="config.value" />
                </FormItem>
            </Form>
             <div slot="footer" style="text-align: center">
                <Button type="error" style="width:200px" ghost @click="cancel">取消</Button>
                <Button type="success" style="width:200px" ghost @click="submit">提交</Button>
            </div>
        </Modal>

        <Modal v-model="showBatchModelFlag" width="360">
            <p slot="header" style="color:#f60;">
                <Icon type="ios-information-circle"></Icon>
                <span>批量删除确认</span>
            </p>
            <div style="text-align:center">
                <p>确定需要删除这{{batchDeleteCount}}个配置项吗？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long ghost @click="batchDelete">Delete</Button>
            </div>
    </Modal>
    </div>
</template>
<style scoped>
.op {
  /* padding: 20px 15px; */
  position: relative;
  height: 60px;
}
.op-btn {
  position: absolute;
  right: 20px;
  top: 15px;
}
.ap {
  position: absolute;
  left: 20px;
  width: 300px;
  top: 15px;
}
.profile {
  position: relative;
  left: 340px;
  top: 15px;
  width: 130px;
}
</style>

<script>
export default {
  mounted() {
    // const id = this.$route.params.id;
    // this.loadServerConfigs(id);
    this.loadApplication();
  },
  watch: {
    serverId: function() {
      this.loadServerConfigs();
    },
    application: function() {
      this.loadProfile();
      if (this.profiles.length == 0) {
        this.loadServerConfigs();
      }
    },
    profile: function() {
      this.loadServerConfigs();
    }
    // "config.name": function(before, after) {
    //   if (this.errorInfo) {
    // this.errorInfo = false;
    //   }
    // },
    // "config.value": function() {
    //   if (this.errorInfo) this.errorInfo = false;
    // }
  },
  //   computed: {
  //     noticeError: function() {
  //       return {
  //         animated: this.errorNotice,
  //         shake: this.errorNotice
  //       };
  //     }
  //   },
  data() {
    return {
      col: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        { title: "名称", key: "name" },
        { title: "值", key: "value" },
        {
          title: "操作",
          align: "center",
          width: 180,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "small",
                    icon: "ios-paper-outline"
                  },
                  style: {
                    marginRight: "15px"
                  },
                  on: {
                    click: () => {
                      this.showModel(true, params.row.name, params.row.value);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "确定要删除吗？",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.delete(params.row.name);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        icon: "md-trash",
                        size: "small"
                      }
                    },
                    "删除"
                  )
                ]
              )
            ]);
          }
        }
      ],
      configs: [],
      configLoading: false,
      showModelFlag: false,
      editMode: false,
      modalTitle: "",
      //   errorInfo: false,
      //   errorMessage: "",
      //   errorNotice: false,
      config: {
        name: "",
        value: "",
        applicationName: "",
        profile: ""
      },
      configRules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        value: [{ required: true, message: "值不能为空", trigger: "blur" }]
      },
      application: "",
      applications: [],
      showBatchModelFlag: false,
      batchDeleteCount: 0,
      profile: "",
      profiles: []
    };
  },
  methods: {
    loadServerConfigs: function() {
      console.log("load configs for server ");
      if (this.application === "") {
        console.log("no application selected");
        return;
      }
      if (this.profiles.length != 0 && this.profile === "") {
        console.log("this application has mutilable profile,must select one");
        return;
      }
      const serverId = this.$route.params.id;
      this.configLoading = true;
      this.$http
        .get(`/config/${serverId}/${this.application}/all`)
        .then(resp => {
          const d = resp.data;
          this.configs = [];
          for (const key in d) {
            this.configs.push({ name: key, value: d[key] });
          }

          this.configLoading = false;
        });
    },
    showModel: function(editMode = false, name, value) {
      if (editMode) {
        this.modalTitle = "编辑配置项";
        this.config.name = name;
        this.config.value = value;
      } else this.modalTitle = "新增配置项";
      this.editMode = editMode;
      this.showModelFlag = true;
    },
    submit: function() {
      this.$refs["config"].validate(valid => {
        if (valid) {
          console.log("验证通过，关闭");
          const serverId = this.$route.params.id;
          //   if (this.errorInfo) {
          // this.errorNotice = true;
          // return;
          //   }
          var result;
          if (this.editMode) {
            console.log("进入编辑模式");
            //后端拿不到
            result = this.$http.putBody(
              `/config/${serverId}/${this.application}`,
              {
                key: this.config.name,
                value: this.config.value,
                profile: this.config.profile
              },
              this.config.name
            );
          } else {
            result = this.$http.postForm(
              `/console/${serverId}/${this.application}`,
              {
                key: this.config.name,
                value: this.config.value,
                profile: this.config.profile
              },
              this.config.name
            );
          }
          result
            .then(() => {
              this.$refs["config"].resetFields();
              this.showModelFlag = false;
              this.loadServerConfigs();
            })
            .catch(data => {
              //   this.errorInfo = true;
              //   this.errorMessage = data.message;
              //   this.
            });
        }
      });
    },
    cancel: function() {
      console.log("点击取消");

      this.$refs["config"].resetFields();
      //   this.errorInfo = false;
      //   this.errorMessage = "";
      this.showModelFlag = false;
    },
    delete: function(name) {
      if (name) {
        const serverId = this.$route.params.id;
        this.$http.delete(`/console/${serverId}?key=${name}`);
        this.loadServerConfigs();
      }
    },
    loadApplication: function() {
      const serverId = this.$route.params.id;
      //   this.applications.push("default");
      this.$http.get(`/server/${serverId}/application`).then(resp => {
        this.applications.push(...resp.data);

        this.loadServerConfigs();
      });
    },
    showBatchDeleteModel: function() {
      const selectedConfigs = this.$refs["configs"].getSelection();
      if (selectedConfigs.length == 0) {
        this.$Message.warning("请先选择需要删除的配置项");
      } else {
        this.batchDeleteCount = selectedConfigs.length;
        this.showBatchModelFlag = true;
      }
    },
    batchDelete: function() {
      this.showBatchModelFlag = false;
    },
    updateFormatError: function() {
      console.log("d");
      this.$Message.error("支持.properties、.yml两种文件类型");
    },
    loadProfile: function() {
      const serverId = this.$route.params.id;
      const application = this.application;
      this.$http
        .get(`/server/${serverId}/${application}/profiles`)
        .then(resp => {
          this.profiles = resp.data;
        });
    }
  }
};
</script>