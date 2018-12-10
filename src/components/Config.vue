<template>
  <div>
    <div class="query-bar">
      <Row>
        <Col span="12">
          <label>应用：</label>
          <Select v-model="application" style="width:160px">
            <Option v-for="item in applications" :value="item" :key="item">{{ item }}</Option>
          </Select>
          <Select v-model="profile" style="width:160px">
            <Option v-for="item in profiles" :value="item" :key="item">{{ item }}</Option>
          </Select>
          <Button @click="loadConfigs()" icon="md-search">查询</Button>
        </Col>
        <Col span="12" style="text-align:right">
          <ButtonGroup>
            <Button icon="md-add" @click="showModal(false)">创建配置</Button>
            <Button icon="md-arrow-up" @click="showImportModal()">导入配置</Button>
            <Dropdown style="text-align:left" @on-click="exportConfig">
              <Button icon="md-download">导出配置</Button>
              <DropdownMenu slot="list">
                <DropdownItem name="properties">Property格式</DropdownItem>
                <DropdownItem name="yml">YAML格式</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        </Col>
      </Row>
    </div>

    <Table border :data="configs" :columns="col" :loading="configsLoading"></Table>

    <Modal v-model="modalDisplayFlag" :title="modalTitle" @on-cancel="cancel">
      <Form :model="config" label-position="top" :rules="configRules" ref="config">
        <Row :gutter="16">
          <Col span="12">
            <FormItem label="所属的应用" prop="application">
              <Select v-model="config.application" :disabled="editMode">
                <Option v-for="item in configApplications" :value="item" :key="item">{{ item }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="所属的Profile" prop="profile" v-show="noProfile">
              <Select v-model="config.profile" :disabled="editMode">
                <Option v-for="item in configProfiles" :value="item" :key="item">{{ item }}</Option>
                <!-- <Option v-else value="无" >无</Option> -->
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col span="12">
            <FormItem label="配置项名称" prop="name">
              <Input v-model="config.name" :clearable="!editMode" :disabled="editMode"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="配置项值" prop="value">
              <Input v-model="config.value" clearable/>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align: center">
        <Button type="error" style="width:200px" ghost @click="cancel">取消</Button>
        <Button type="success" style="width:200px" ghost @click="submit" :loading="submitLoading">提交</Button>
      </div>
    </Modal>

    <Modal
      v-model="importModalDisplayFlag"
      title="导入配置"
      @on-cancel="importCancel"
      :footer-hide="true"
    >
      <Form :model="config" label-position="top" :rules="configRules" ref="import">
        <Row :gutter="16">
          <Col span="12">
            <FormItem label="所属的应用" prop="application">
              <Select v-model="config.application">
                <Option v-for="item in configApplications" :value="item" :key="item">{{ item }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="所属的Profile" prop="profile" v-show="noProfile">
              <Select v-model="config.profile">
                <Option v-for="item in configProfiles" :value="item" :key="item">{{ item }}</Option>
                <!-- <Option v-else value="无" >无</Option> -->
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Uploader
          :url="uploadUrl"
          type="drag"
          :extension="['yml','properties']"
          :display-flag="uploaderDisplayFlag"
        >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或拖拽配置文件至此来上传（.properties、.yml）</p>
          </div>
        </Uploader>
      </Form>
      <!-- <div slot="footer" style="text-align: center">
        <Button type="error" style="width:200px" ghost @click="importCancel">取消</Button>
        <Button
          type="success"
          style="width:200px"
          ghost
          @click="importSubmit"
          :loading="submitLoading"
        >提交</Button>
      </div>-->
    </Modal>
  </div>
</template>
<script>
import Uploader from "./Uploader.vue";

export default {
  components: {
    Uploader: Uploader
  },
  computed: {
    uploadUrl: function() {
      return `/config/${this.config.application}/import${
        this.config.profile ? "?profile=" + this.config.profile : ""
      }`;
    }
  },
  data() {
    return {
      configs: [],
      configsLoading: false,
      application: "",
      applications: [],
      profile: "",
      profiles: [],
      modalDisplayFlag: false,
      editMode: false,
      modalTitle: "",
      submitLoading: false,
      config: {
        application: "",
        profile: "",
        name: "",
        value: ""
      },
      configProfiles: [],
      configApplications: [],
      noProfile: false,
      configRules: {
        application: [{ required: true, message: "所属应用不能为空" }],
        profile: [{ required: true, message: "所属Profile不能为空" }],
        name: [{ required: true, message: "名称不能为空" }],
        value: [{ required: true, message: "值不能为空", trigger: "blur" }]
      },
      importModalDisplayFlag: false,
      uploaderDisplayFlag: false,
      col: [
        { type: "selection", width: 60, align: "center" },
        { title: "配置项名称", key: "key" },
        { title: "配置项值", key: "value" },
        {
          title: "操作",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  style: {
                    marginRight: "15px"
                  },
                  on: {
                    click: () => {
                      this.showModal(true, params.row.key, params.row.value);
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
                      this.remove(params.row.key);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: { size: "small", type: "error", icon: "md-trash" }
                    },
                    "删除"
                  )
                ]
              )
            ]);
          }
        }
      ]
    };
  },
  mounted() {
    // this.loadConfigs(this.$route.params.id);
    this.loadUserApplication();
  },
  watch: {
    // $route: function() {
    // console.log(this.$route.params);
    // this.loadConfigs(this.$route.params.id);
    // }
    application: function() {
      // this.loadConfigs(this.application);
      this.$http.get(`/server/${this.application}/profile`).then(resp => {
        this.profiles = resp.data;
        this.profile = "";
      });
    },
    "config.application"() {
      // console.log(this.config.application);
      if (this.config.application) {
        this.uploaderDisplayFlag = true;
        this.$http
          .get(`/server/${this.config.application}/profile`)
          .then(resp => {
            if (resp.data.length == 0) this.noProfile = false;
            else {
              this.configProfiles = resp.data;
              this.noProfile = true;
            }
          });
      }
    }
  },
  methods: {
    loadUserApplication() {
      this.$http.get("/user/application").then(resp => {
        this.applications = resp.data;
      });
    },
    loadConfigs() {
      const application = this.application;
      const profile = this.profile;
      if (
        application &&
        ((this.profiles.length != 0 && profile) || this.profiles.length == 0)
      ) {
        this.configsLoading = true;
        this.$http
          .get(`config/${application}/all`, { params: { profile: profile } })
          .then(response => {
            this.configs = [];
            for (const key in response.data) {
              this.configs.push({ key: key, value: response.data[key] });
            }
            this.configsLoading = false;
          });
      }
    },
    // applicationChange(v) {
    //   console.log(v);
    // },
    showModal(editMode, key, value) {
      this.editMode = editMode;
      if (editMode) {
        this.modalTitle = "编辑配置项";
        this.config.application = this.application;
        this.config.profile = this.profile;
        if (this.profile) this.noProfile = false;
        else this.noProfile = true;

        this.config.name = key;
        this.config.value = value;
      } else {
        this.modalTitle = "新增配置项";
      }
      this.$http.get("/user/application").then(resp => {
        this.configApplications = resp.data;
        this.modalDisplayFlag = true;
      });
    },
    cancel: function() {
      this.modalDisplayFlag = false;
      this.$refs.config.resetFields();
    },
    submit() {
      this.$refs.config.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          let result;
          if (this.editMode)
            result = this.$http.putBody(`/config/${this.config.application}`, {
              key: this.config.name,
              value: this.config.value,
              profile: this.config.profile
            });
          else
            result = this.$http.postForm(`/config/${this.config.application}`, {
              key: this.config.name,
              value: this.config.value,
              profile: this.config.profile
            });
          result
            .then(() => {
              this.cancel();
              this.submitLoading = false;
              this.loadConfigs();
            })
            .catch(() => {
              this.submitLoading = false;
            });
        }
      });
    },
    remove(id) {
      if (id) {
        console.log(id);
        const application = this.application;
        this.$http
          .delete(`/config/${application}`, {
            key: id,
            profile: this.profile
          })
          .then(() => {
            this.loadConfigs();
          });
      }
    },
    showImportModal() {
      this.$http.get("/user/application").then(resp => {
        this.configApplications = resp.data;
        this.importModalDisplayFlag = true;
      });
    },
    importCancel() {
      this.importModalDisplayFlag = false;
      this.$refs.import.resetFields();
    },
    importSubmit() {
      this.$refs.import.validate(valid => {
        if (valid) {
          this.importCancel();
        }
      });
    },
    exportConfig(name) {
      if (!this.application || (this.profiles.length != 0 && !this.profile)) {
        this.$Message.error("请先指定一个应用及Profile");
        return;
      }
      this.$ajax
        .post(`/config/${this.application}/export.${name}`)
        .form({
          profile: this.profile
        })
        .download(`${this.application}-${this.profile}.${name}`);
    }
  }
};
</script>
