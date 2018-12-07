<template>
    <div>   

        <!-- <div class="header">

        </div> -->
        <div class="container">
<Button @click="show(false)" icon="md-add">
            新增
        </Button>
        <!-- <Upload action="/server/key" :show-upload-list="false"  -->
                <!-- :format="['properties','yml']" :on-format-error="updateFormatError"  -->
                <!-- :before-upload="beforeUpload" :on-success="uploadSuccess" -->
                <!-- :on-error="uploadError" :on-progress="uploadProcess" -->
                <!-- style="display:inline-block"> -->
        <Button icon="md-key" @click="encryptionModelDisplayFlag=true">
            配置密钥
        </Button>
        <!-- </Upload> -->
        <Button @click="loadServer()" icon="md-refresh">
            手动刷新
        </Button>

        <Table border :columns="col" :data="servers" :loading="serverLoading" />

        <Modal v-model="showModelFlag" :title="modalTitle" @on-cancel="cancel">            
            <Form :model="server" label-position="top" :rules="serverRules" ref="server">
                <FormItem label="名称" prop="name">
                    <Input v-model="server.name" clearable />
                </FormItem>
                <FormItem label="类型" prop="type">
                <RadioGroup v-model="server.type" type="button">
                    <Radio label="ZooKeeper"></Radio>
                    <Radio label="Consul"></Radio>
                    <Radio label="Git"></Radio>
                    <Radio label="SVN"></Radio>
                </RadioGroup>
                </FormItem>
                <FormItem label="前缀" prop="prefix">
                    <Input v-model="server.prefix" clearable placeholder="不填默认为/根目录" />
                </FormItem>
                <FormItem label="地址（域名:端口或IP:端口）" prop="url">
                    <Input v-model="server.url" clearable placeholder="比如：localhost:2180" />
                </FormItem>
            </Form>
             <div slot="footer" style="text-align: center">
                <Button type="error" style="width:200px" ghost @click="cancel">取消</Button>
                <Button type="success" style="width:200px" ghost @click="submit">提交</Button>
            </div>
        </Modal>

        <Modal v-model="encryptionModelDisplayFlag" :closable="false" @on-cancel="cancel">
            <Tabs>
                <TabPane label="加密密码">标签一的内容</TabPane>
                <TabPane label="加密密钥">标签二的内容</TabPane>
            </Tabs>
            <div slot="footer" style="text-align: center">
                <Button type="error" style="width:200px" ghost @click="cancel">取消</Button>
                <Button type="success" style="width:200px" ghost @click="submit">提交</Button>
            </div>
        </Modal>
        </div>
        
    </div>
</template>
<script>
import ServerConfig from "./ServerConfig.vue";

export default {
  data() {
    return {
      servers: [],
      col: [
        { title: "名称", key: "name" },
        { title: "类型", key: "type" },
        { title: "前缀", key: "prefix" },
        { title: "地址", key: "url" },
        {
          title: "操作",
          key: "op",
          width: 300,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "small",
                    to: `${params.row.id}/application`
                  },
                  style: {
                    marginRight: "10px"
                  }
                },
                "应用管理"
              ),
              h(
                "Button",
                {
                  props: {
                    size: "small",
                    to: `config/${params.row.id}`
                  },
                  style: {
                    marginRight: "10px"
                  }
                },
                "查询配置"
              ),
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      this.server.name = params.row.name;
                      this.server.prefix = params.row.prefix;
                      this.server.url = params.row.url;
                      switch (params.row.type) {
                        case "ZOOKEEPER":
                          this.server.type = "ZooKeeper";
                          break;
                        case "CONSUL":
                          this.server.type = "Consul";
                          break;
                        case "GIT":
                          this.server.type = "Git";
                          break;
                        case "SVN":
                          this.server.type = "SVN";
                          break;
                      }
                      //   this.server.type = params.row.type;
                      this.show(true);
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
                      this.remove(params.row.id);
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
      currentServerId: "",
      serverLoading: false,
      showModelFlag: false,
      modalTitle: "",
      editMode: false,
      server: {
        name: "",
        prefix: "",
        url: "",
        type: "Consul"
      },
      serverRules: {
        name: [{ required: true, message: "名称不能为空", trigger: "change" }],
        url: [{ required: true, message: "地址不能为空", trigger: "blur" }],
        type: [{ required: true, message: "类型必须指定一个", trigger: "blur" }]
      },
      encryptionModelDisplayFlag: false
    };
  },
  mounted: function() {
    this.loadServer();
  },
  methods: {
    loadServer: function() {
      this.serverLoading = true;
      this.$http.get("server").then(response => {
        this.servers = response.data;
        this.serverLoading = false;
      });
    },
    renderConfig: function(id) {
      console.log(id);
      this.currentServerId = id;
    },
    show(editMode) {
      if (editMode) {
        this.modalTitle = "编辑配置服务中心";
        this.editMode = true;
      } else {
        this.modalTitle = "新增配置服务中心";
        this.editMode = false;
      }
      this.showModelFlag = true;
    },
    submit: function() {
      this.$refs["server"].validate(valid => {
        if (valid) {
          console.log("let go");
          this.$http
            .post("/server", {
              name: this.server.name,
              prefix: this.server.prefix,
              url: this.server.url,
              type: this.server.type.toUpperCase()
            })
            .then(resp => {
              this.showModelFlag = false;
              this.$refs["server"].resetFields();
              this.loadServer();
            });
        }
      });
    },
    cancel: function() {
      this.showModelFlag = false;
      this.$refs["server"].resetFields();
    },
    remove(id) {
      if (id) {
        this.$http.delete(`/server/${id}`).then(resp => {
          this.loadServer();
        });
      }
    },
    updateFormatError: function() {
      this.$Message.error("支持.properties、.yml两种文件类型");
      this.$Loading.finish();
    },
    beforeUpload: function() {
      this.$Loading.start();
    },
    uploadProcess: function(event, file) {
      console.log(event);
      console.log(file);
      this.$Loading.update(event.percent);
    },
    uploadSuccess: function(response, file) {
      this.$Loading.finish();
      console.log(response);
      console.log(file);
      this.$Message.success(`文件：${file.name}上传失败`);
    },
    uploadError: function(error, file, filelist) {
      console.log(error);
      console.log(file);
      console.log(filelist);
      this.$Message.error(`文件：${filelist.name}上传失败`);
      this.$Loading.finish();
    }
  },
  components: {
    ServerConfig
  }
};
</script>
<style scoped>
/* .container {
  padding: 0px 40px; */
/* } */
.header {
  height: 80px;
  background-color: #515a6e;
}
</style>
