<template>
  <div>
    <Modal v-model="displayFlag" title="导入配置" @on-cancel="close" :footer-hide="true">
      <Form :model="config" label-position="top" :rules="rules" ref="import">
        <Row :gutter="16">
          <Col span="12">
            <FormItem label="所属的应用" prop="application">
              <Select v-model="config.application" @on-change="loadProfile">
                <Option v-for="item in applications" :value="item" :key="item">{{ item }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="所属的Profile" prop="profile" v-if="profiles.length!=0">
              <Select v-model="config.profile">
                <Option v-for="item in profiles" :value="item" :key="item">{{ item }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Uploader
          :url="uploadUrl"
          type="drag"
          :extension="uploadFile"
          :trigger="uploaderTrigger"
          @success="uploadSuccess"
        >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或拖拽配置文件至此来上传（.properties、.yml）</p>
          </div>
        </Uploader>
      </Form>
    </Modal>
    <ModalMessage ref="message">
      <div>
        <p>导入成功：{{importSuccessCount}}条</p>
        <p>导入失败：{{importFailedCount}}条</p>
        <p>共：{{importFailedCount+importSuccessCount}}</p>
      </div>
    </ModalMessage>
  </div>
</template>
<script>
import Uploader from "../../components/Uploader.vue";
import ModalMessage from "../../components/ModalMessage.vue";

export default {
  components: { Uploader: Uploader, ModalMessage: ModalMessage },
  props: ["application", "profile"],
  computed: {
    uploadUrl() {
      return `/config/${this.config.application}/import${
        this.config.profile ? "?profile=" + this.config.profile : ""
      }`;
    }
  },
  watch: {},
  data() {
    return {
      displayFlag: false,
      config: {
        application: "",
        profile: ""
      },
      rules: {
        application: [{ required: true, message: "所属应用不能为空" }],
        profile: [{ required: true, message: "所属Profile不能为空" }]
      },
      profiles: [],
      applications: [],
      uploaderTrigger: false,
      uploadFile: ["yml", "properties"],
      importSuccessCount: 0,
      importFailedCount: 0
    };
  },
  methods: {
    show() {
      if (this.application) this.config.application = this.application;

      this.$ajax.get("/user/application").then(resp => {
        this.applications = resp.data;
        if (this.profile) {
          this.config.profile = this.profile;
          this.loadProfile();
        }
        this.displayFlag = true;
      });
    },

    loadProfile() {
      if (!this.config.application) return;

      return this.$ajax
        .get(`/server/application/${this.config.application}/profile`)
        .then(resp => {
          this.profiles = resp.data;
          this.uploaderTrigger = true;
        });
    },
    close() {
      this.displayFlag = false;
      this.uploaderTrigger = false;
      this.$refs.import.resetFields();
      this.profiles = [];
    },
    uploadSuccess(resp) {
      const success = resp.successCount > 0;

      this.importSuccessCount = resp.successCount;
      this.importFailedCount = resp.failedCount;

      this.$refs.message.show(
        success,
        success ? "配置导入成功" : "配置导入失败"
      );
      this.close();
    }
  }
};
</script>
