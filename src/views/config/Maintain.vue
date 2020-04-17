<template>
  <ModalForm
    ref="config"
    :model="config"
    :modelId="config.key"
    :rules="rules"
    :edit="isEdit"
    :editModal="true"
    :url="'/config/'+config.application"
    :title="$t('config')"
    @send-success="$emit('send-success')"
  >
    <Row :gutter="16">
      <Col span="12">
        <FormItem :label="$t('application')" prop="application" v-if="!isEdit">
          <Select v-model="config.application" @on-change="applicationChange">
            <Option v-for="item in applications" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem :label="$t('profile')" prop="profile" v-if="profiles.length!=0 && !isEdit">
          <Select v-model="config.profile">
            <Option v-for="item in profiles" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>

    <FormItem :label="$t('configName')" prop="key">
      <Input v-model="config.key" :clearable="!isEdit" :disabled="isEdit"/>
    </FormItem>

    <FormItem :label="$t('configValue')" prop="value">
      <Input v-model="config.value" type="textarea" clearable/>
    </FormItem>
  </ModalForm>
</template>
<script>
import ModalForm from "../../components/ModalForm.vue";

export default {
  components: {
    ModalForm: ModalForm
  },
  props: {
    configForEdit: Object
  },
  data() {
    return {
      applications: [],
      profiles: [],
      config: {
        application: "",
        profile: "",
        key: "",
        value: ""
      },
      rules: {
        application: [
          { required: true, message: this.$t("applicationNotNull") }
        ],
        profile: [{ required: true, message: "所属Profile不能为空" }],
        key: [{ required: true, message: "名称不能为空" }],
        value: [{ required: true, message: "值不能为空", trigger: "change" }]
      },
      isEdit: false
    };
  },
  methods: {
    show() {
      if (this.configForEdit && this.configForEdit.application) {
        this.isEdit = true;
        this.config.application = this.configForEdit.application;
        this.config.profile = this.configForEdit.profile;
        this.config.key = this.configForEdit.name;
        this.config.value = this.configForEdit.value;
      } else {
        this.isEdit = false;
      }

      if (!this.isEdit)
        this.$ajax.get("/user/application").then(({ data }) => {
          this.applications = data;
          this.applicationChange(this.config.application);
          this.$refs.config.show();
        });
      else {
        this.$refs.config.show();
      }
    },
    applicationChange(value) {
      if (!value) return;

      this.$ajax
        .get(`/server/application/${value}/profile`)
        .then(({ data }) => {
          this.profiles = data;
        });
    }
  }
};
</script>