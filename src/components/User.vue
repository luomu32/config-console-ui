<template>
    <div>
        <div class="query-bar">
            <Row>
                <Col span="12">
                    <label>用户名：</label>
                    <Input style="width:120px;"></Input>
                    <label>所属角色：</label>
                    <Select v-model="roleId" style="width:160px">
                      <Option v-for="item in roles" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Button>查询</Button>
                </Col>
                <Col span="12" style="text-align:right">
                    <ButtonGroup>
                        <Button icon="md-add" @click="showModal(false)">创建用户</Button>
                        <Button icon="md-refresh" @click="loadUsers()">手动刷新</Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </div>

        <Table border :data="users" :columns="col"></Table>

        <div class="page">
            <Page :total="usersTotal" ref="page" show-sizer show-total @on-change="pageChange" @on-page-size-change="pageSizeChange" />
        </div>
        
        <Modal v-model="userModalDisplayFlag" :title="modalTitle" @on-cancel="cancel">
            <Form :model="user" label-position="top" :rules="userRules" ref="user">
                <Row :gutter="16">
                    <Col span="12">
                <FormItem label="名称" prop="name">
                    <Input v-model="user.name" clearable />
                </FormItem>    
                    </Col>
                    <Col span="12">
                    <FormItem label="密码" prop="password">
                    <Input v-model="user.password" clearable type="password" />
                </FormItem>
                    </Col>
                </Row>
                <Row :gutter="16">
                    <Col span="12">
                    <FormItem label="确认密码" prop="comfiredPassword">
                    <Input v-model="user.comfiredPassword" clearable type="password" />
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="所属角色" prop="roleId">
                        <Select v-model="user.roleId">
                            <Option v-for="item in roles" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    <!-- <Input v-model="user.roleId" /> -->
                        </FormItem>
                    </Col>
                </Row>
                
            </Form>
             <div slot="footer" style="text-align: center">
                <Button type="error" style="width:200px" ghost @click="cancel">取消</Button>
                <Button type="success" style="width:200px" ghost @click="submit" :loading="submitLoading">提交</Button>
            </div>
        </Modal>

        <Modal v-model="changePwdModalDisplayFlag" title="重置新密码" @on-cancel="changePwdCancel">
          <Form :model="user" label-position="top" :rules="userRules" ref="changePwd">
            <Row :gutter="16">
              <Col span="12">
                <FormItem label="新密码" prop="password">
                  <Input v-model="user.password" clearable type="password" />
                </FormItem>    
              </Col>
              <Col span="12">
                <FormItem label="确认新密码" prop="comfiredPassword">
                  <Input v-model="user.comfiredPassword" clearable type="password" />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div slot="footer" style="text-align: center">
            <Button type="error" style="width:200px" ghost @click="changePwdCancel">取消</Button>
            <Button type="success" style="width:200px" ghost @click="changePwd" :loading="submitLoading">提交</Button>
          </div>
        </Modal>

        <Drawer title="管理可管理的应用程序" :closable="true" v-model="showApplicationManagerFlag" width="520">
           <!-- 体验不是很好，没有loading效果，如果加载不是很快容易出问题。 -->
          <Transfer :data="unManagedApplications" :titles="['不可配置的应用','可以设置配置项的应用']"
        :target-keys="managerdApplications" :list-style="{width:'210px',height:'400px'}" @on-change="transfToManaged"
        ></Transfer>
        </Drawer>
    </div>
</template>
<script>
export default {
  mounted() {
    this.loadUsers();
    this.loadRoles();
  },
  data() {
    return {
      roleId: "",
      users: [],
      usersTotal: 0,
      userModalDisplayFlag: false,
      modalTitle: "",
      editMode: false,
      user: {
        name: "",
        password: "",
        comfiredPassword: "",
        roleId: ""
      },
      roles: [],
      selectedRole: "",
      submitLoading: false,
      userRules: {
        name: [
          { required: true, message: "用户名不能为空", trigger: "change" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        comfiredPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" }
        ],
        roleId: [
          {
            required: true,
            message: "请选择一个所属的角色",
            trigger: "change",
            type: "number"
          }
        ]
      },
      changePwdModalDisplayFlag: false,
      showApplicationManagerFlag: false,
      unManagedApplications: [],
      managerdApplications: [],
      currentUserId: "",
      col: [
        { title: "用户名", key: "username" },
        {
          title: "所属角色",
          render: (h, params) => {
            return h("div", params.row.role.name);
          }
        },
        { title: "状态" },
        { title: "创建日期", key: "createdDatetime" },
        {
          title: "操作",
          align: "center",
          className: "table-action",
          width: 300,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  style: {
                    marginRight: "10px"
                  }
                },
                "编辑"
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
                      this.currentUserId = params.row.id;
                      this.showApplicationManager();
                    }
                  }
                },
                "应用管理"
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
                      this.changePwdModalDisplayFlag = true;
                    }
                  }
                },
                "重置密码"
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
                        size: "small",
                        type: "error",
                        icon: "md-trash"
                      }
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
  methods: {
    loadUsers: function(page = 1, size = 10) {
      this.$http
        .get("/user", { params: { page: page - 1, size: size } })
        .then(resp => {
          this.users = resp.data.content;
          this.usersTotal = resp.data.totalElements;
        });
    },
    pageChange: function(page) {
      const size = this.$refs.page.currentPageSize;
      this.loadUsers(page, size);
    },
    //如果当前页码不是第一页，page size change的时候还会触发page change。如果是第一页就不会出发
    pageSizeChange: function(size) {
      const page = this.$refs.page.currentPage;
      if (page == 1) {
        this.loadUsers(1, size);
      }
    },
    loadRoles: function() {
      this.$http.get("/role").then(resp => {
        this.roles = resp.data;
      });
    },
    showModal: function(editMode) {
      this.editMode = editMode;
      if (editMode) {
        this.modalTitle = "编辑用户";
      } else {
        this.modalTitle = "创建用户";
      }
      this.loadRoles();
      this.userModalDisplayFlag = true;
    },
    submit: function() {
      this.$refs.user.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          this.$http
            .post("/user", {
              name: this.user.name,
              password: this.user.password,
              roleId: this.user.roleId
            })
            .then(() => {
              this.submitLoading = false;
              this.userModalDisplayFlag = false;
              this.$refs.user.resetFields();
              this.loadUsers();
            })
            .catch(() => {
              this.submitLoading = false;
            });
        }
      });
    },
    cancel: function() {
      this.userModalDisplayFlag = false;
      this.$refs["user"].resetFields();
    },
    remove: function(id) {
      if (id) {
        this.$http.delete(`/user/${id}`).then(() => {
          const size = this.$refs.page.currentPageSize;
          this.loadUsers(1, size);
        });
      }
    },
    changePwdCancel: function() {
      this.changePwdModalDisplayFlag = false;
      this.$refs.changePwd.resetFields();
    },
    changePwd: function() {
      this.$refs.changePwd.validate(valid => {
        if (valid) {
          this.changePwdModalDisplayFlag = false;
          this.$refs.changePwd.resetFields();
        }
      });
    },
    showApplicationManager: function() {
      this.showApplicationManagerFlag = true;
      this.$http.get("/server/application").then(resp => {
        this.unManagedApplications = resp.data.map(a => {
          return {
            key: a.name,
            content: a.name
          };
        });
      });

      this.$http.get(`/user/${this.currentUserId}/application`).then(resp => {
        this.managerdApplications = resp.data;
      });
    },
    transfToManaged: function(newTargetKeys, direction, moveKeys) {
      console.log(newTargetKeys);
      console.log(direction);
      console.log(moveKeys);
      if (direction === "right") {
        this.$http
          .postForm(`/user/${this.currentUserId}/application`, {
            applications: moveKeys
          })
          .then(() => {
            this.managerdApplications = newTargetKeys;
          });
      } else {
        this.$http
          .delete(`/user/${this.currentUserId}/application?applications=${moveKeys}`)
          .then(() => {
            this.managerdApplications = newTargetKeys;
          });
      }
    }
  }
};
</script>
