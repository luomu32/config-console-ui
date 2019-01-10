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
            <Button icon="md-add" v-authority="'add'" @click="showModal()">创建配置</Button>
            <Button icon="md-arrow-up" v-authority="'import'" @click="showImportModal()">导入配置</Button>
            <Dropdown style="text-align:left" v-authority="'export'" @on-click="exportConfig">
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

    <Table border :data="configs" :columns="col" :loading="configsLoading">
      <template slot-scope="{ row }" slot="action">
        <OperatorButton v-authority="'edit'" @click="showModal(row)">编辑</OperatorButton>
        <OperatorDeleteButton @on-ok="remove(row.key)" v-authority="'del'">删除</OperatorDeleteButton>
      </template>
    </Table>

    <Maintain ref="configMaintain" :configForEdit="configForEdit" @send-success="loadConfigs"></Maintain>

    <ImportConfig ref="import" :application="application" :profile="profile"></ImportConfig>
  </div>
</template>
<script>
import ImportConfig from "./ImportConfig.vue";
import Maintain from "./Maintain.vue";
import OperatorButton from "../../components/OperatorButton.vue";
import OperatorDeleteButton from "../../components/OperatorDeleteButton.vue";

export default {
  components: {
    ImportConfig: ImportConfig,
    Maintain: Maintain,
    OperatorButton: OperatorButton,
    OperatorDeleteButton: OperatorDeleteButton
  },
  data() {
    return {
      configs: [],
      configsLoading: false,
      application: "",
      applications: [],
      profile: "",
      profiles: [],
      configForEdit: {
        application: "",
        name: "",
        value: ""
      },
      // configProfiles: [],
      // configApplications: [],
      // noProfile: false,
      col: [
        { type: "selection", width: 60, align: "center" },
        { title: "配置项名称", key: "key" },
        { title: "配置项值", key: "value" },
        {
          title: "操作",
          align: "center",
          width: 200,
          slot: "action"
        }
      ]
    };
  },
  mounted() {
    this.loadUserApplication();
  },
  watch: {
    // $route: function() {
    // console.log(this.$route.params);
    // this.loadConfigs(this.$route.params.id);
    // }
    application: function() {
      this.$ajax
        .get(`/server/application/${this.application}/profile`)
        .then(resp => {
          this.profiles = resp.data;
          this.profile = "";
        });
    }
  },
  methods: {
    loadUserApplication() {
      this.$ajax.get("/user/application").then(resp => {
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
        this.$ajax
          .param({ profile: profile })
          .get(`config/${application}/all`)
          .then(({ data }) => {
            this.configs = [];
            for (const key in data) {
              this.configs.push({ key: key, value: data[key] });
            }
            this.configsLoading = false;
          });
      }
    },
    showModal(row) {
      if (row) {
        console.log(row);
        this.configForEdit.application = this.application;
        this.configForEdit.profile = this.profile;
        this.configForEdit.name = row.key;
        this.configForEdit.value = row.value;
      } else {
        this.configForEdit.application = "";
        this.configForEdit.name = "";
        this.configForEdit.value = "";
      }
      this.$refs.configMaintain.show();
    },
    remove(id) {
      if (id) {
        this.$ajax
          .param({ profile: this.profile })
          .delete(`/config/${this.application}/${id}`)
          .then(() => {
            this.loadConfigs();
          });
      }
    },
    showImportModal() {
      this.$refs.import.show();
    },
    exportConfig(name) {
      if (!this.application || (this.profiles.length != 0 && !this.profile)) {
        this.$Message.error("请先指定一个应用及Profile");
        return;
      }
      this.$ajax
        .form({
          profile: this.profile
        })
        .download(
          `/config/${this.application}/export.${name}`,
          `${this.application}-${this.profile}.${name}`
        );
    }
  }
};
</script>
