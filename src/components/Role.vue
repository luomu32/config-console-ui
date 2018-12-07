<template>
    <div>
        <div class="query-bar" style="text-align:right">
            
                    <ButtonGroup>
                        <Button icon="md-add" @click="showModal(false)">创建角色</Button>
                        <Button icon="md-refresh" @click="loadRoles()">手动刷新</Button>
                    </ButtonGroup>
        </div>

        <div>
            <Row>

            </Row>
        </div>

        <Row :gutter="16">
            <Col span="19">
                <Table border :data="roles" :columns="col" :loading="rolesLoading"></Table>
            </Col>
            <Col span="5">
            <div style="background-color:#fff;border-radius:4px;padding:10px 0px 10px 15px;">
                <Tree :data="menuTree" show-checkbox multiple></Tree>
            </div>
            </Col>
        </Row>
        

        <Modal v-model="modalDisplayFlag" :title="modalTitle" @on-cancel="cancel">
            <Form :model="role" label-position="top" :rules="roleRules" ref="role">
                <FormItem label="名称" prop="name">
                    <Input v-model="role.name" clearable />
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
  mounted() {
    this.loadRoles();
  },
  data() {
    return {
      roles: [],
      nameForQuery: "",
      rolesLoading: false,
      modalDisplayFlag: false,
      modalTitle: "",
      submitLoading: false,
      editMode: false,
      role: {
        name: ""
      },
      roleRules: {
        name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }]
      },
      menus: [
        { key: "1", label: "资源库管理" },
        { key: "2", label: "应用管理" },
        { key: "3", label: "加密设置" },
        { key: "4", label: "用户管理" },
        { key: "5", label: "角色管理" },
        { key: "6", label: "操作日志" }
      ],
      menuKeys: ["1", "2"],
      menuTree: [
        {
          title: "菜单",
          expand: true,
          selected: true,
          children: [
            { title: "资源库管理", expand: true, selected: true },
            { title: "应用管理", expand: true, selected: true },
            { title: "加密设置", expand: true, selected: true },
            {
              title: "用户管理",
              expand: true,
              selected: true,
              children: [
                { title: "新增" },
                { title: "编辑" },
                { title: "重置密码" },
                { title: "删除" }
              ]
            },
            {
              title: "角色管理",
              expand: true,
              selected: true,
              children: [
                { title: "新增" },
                { title: "编辑" },
                { title: "权限管理" },
                { title: "删除" }
              ]
            },
            {
              title: "操作日志",
              expand: true,
              selected: true,
              children: [
                { title: "设置" }
              ]
            }
          ]
        }
      ],
      col: [
        { title: "名称", key: "name" },
        { title: "创建时间", key: "createdDatetime" },
        { title: "最近一次修改时间", key: "lastModifyDatetime" },
        {
          title: "操作",
          align: "center",
          width: 240,
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
                  }
                },
                "权限管理"
              ),
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  style: {
                    marginRight: "15px"
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    icon: "md-trash",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.row.id);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    };
  },
  methods: {
    loadRoles: function(name) {
      this.rolesLoading = true;
      this.$http
        .get(`/role`, {
          params: { name: name }
        })
        .then(resp => {
          this.roles = resp.data;
          this.rolesLoading = false;
        })
        .catch(() => {
          this.rolesLoading = false;
        });
    },
    showModal: function(editMode) {
      this.editMode = editMode;
      if (editMode) {
        this.modalTitle = "编辑角色";
      } else {
        this.modalTitle = "创建角色";
      }
      this.modalDisplayFlag = true;
    },
    submit: function() {
      this.$refs.role.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          var result;
          if (this.editMode) {
            result = this.$http.put("/role", { name: this.role.name });
          } else {
            result = this.$http.post("/role", { name: this.role.name });
          }
          result
            .then(() => {
              this.modalDisplayFlag = false;
              this.$refs.role.resetFields();
              this.submitLoading = false;
              this.loadRoles();
            })
            .catch(() => {
              this.submitLoading = false;
            });
        }
      });
    },
    cancel: function() {
      this.modalDisplayFlag = false;
      this.$refs.role.resetFields();
    },
    remove: function(id) {
      if (id) {
        this.$http.delete(`/role/${id}`).then(() => {
          this.loadRoles();
        });
      }
    }
  }
};
</script>
