<template>
  <div>
    <div class="query-bar">
      <Row>
        <Col span="12">
          <label>用户名：</label>
          <Input style="width:120px;" v-model="queryCondition.username"/>
          <label>所属角色：</label>
          <Select v-model="queryCondition.roleId" style="width:160px">
            <Option v-for="item in roles" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <Button @click="loadUsers()" :loading="loading">查询</Button>
        </Col>
        <Col span="12" style="text-align:right">
          <ButtonGroup>
            <Button icon="md-add" @click="showModal()" v-authority="'add'">创建用户</Button>
            <Button icon="md-add" @click="showModal()">从LDAP导入</Button>
            <Button icon="md-refresh" @click="loadUsers()">手动刷新</Button>
          </ButtonGroup>
        </Col>
      </Row>
    </div>

    <TablePage
      :data="users"
      :columns="col"
      :total="usersTotal"
      :loading="loading"
      @pageChange="pageChange"
    >
      <template slot-scope="{row}">
        <OperatorButton @click="showApplicationManager(row.id)" v-authority="'application'">应用管理</OperatorButton>
        <OperatorButton v-authority="'edit'" @click="showModal(row)">编辑</OperatorButton>
        <OperatorButton @click="showRestPwd(row)" v-authority="'resetPwd'">重置密码</OperatorButton>
        <OperatorDeleteButton @on-ok="remove(row.id)" v-authority="'del'">删除</OperatorDeleteButton>
      </template>
    </TablePage>

    <Maintain :userForEdit="user" ref="userMaintain" @send-success="loadUsers"></Maintain>

    <ResetPassword :userId="currentUserId.toString()" ref="restPwd"></ResetPassword>

    <Drawer title="应用程序权限管理" :closable="true" v-model="showApplicationManagerFlag" width="520">
      <Spin size="large" fix v-if="applicationLoading"></Spin>
      <Transfer
        :data="unManagedApplications"
        :titles="['不可配置的应用','可以设置配置项的应用']"
        :target-keys="managerdApplications"
        :list-style="{width:'210px',height:'400px'}"
        @on-change="transfToManaged"
      ></Transfer>
    </Drawer>
  </div>
</template>
<script>
import OperatorButton from "../../components/OperatorButton.vue";
import OperatorDeleteButton from "../../components/OperatorDeleteButton.vue";
import TablePage from "../../components/TablePage.vue";
import Maintain from "./Maintain.vue";
import ResetPassword from "./ResetPassword.vue";

export default {
  components: {
    OperatorButton: OperatorButton,
    OperatorDeleteButton: OperatorDeleteButton,
    TablePage: TablePage,
    ResetPassword: ResetPassword,
    Maintain: Maintain
  },
  mounted() {
    this.loadUsers();
    this.loadRoles();
  },
  data() {
    return {
      queryCondition: {
        roleId: "",
        username: ""
      },
      pageSize: 10,
      users: [],
      usersTotal: 0,
      loading: false,
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
          slot: "action"
        }
      ],
      user: {
        id: "",
        name: "",
        roleId: ""
      },
      roles: [],
      changePwdModalDisplayFlag: false,
      showApplicationManagerFlag: false,
      applicationLoading: false,
      unManagedApplications: [],
      managerdApplications: [],
      currentUserId: ""
    };
  },
  methods: {
    loadUsers(page = 1, size = this.pageSize) {
      this.loading = true;
      this.$ajax
        .param({
          page: page - 1,
          size: size,
          username: this.queryCondition.username,
          roleId:
            this.queryCondition.roleId == "-1" ? "" : this.queryCondition.roleId
        })
        .get("/user")
        .then(({ data }) => {
          this.users = data.content;
          this.usersTotal = data.totalElements;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    pageChange({ pageNo, pageSize }) {
      this.pageSize = pageSize;
      this.loadUsers(pageNo, pageSize);
    },
    loadRoles() {
      this.$ajax.get("/role").then(({ data }) => {
        let roles = [];
        roles.push({ id: "-1", name: "所有" });
        roles = roles.concat(data);
        this.roles = roles;
      });
    },
    showModal(row) {
      if (row) {
        this.user.id = row.id.toString();
        this.user.name = row.username;
        this.user.roleId = row.role.id;
      } else {
        this.user.id = "";
        this.user.name = "";
        this.user.roleId = "";
      }

      this.$refs.userMaintain.show();
    },
    remove: function(id) {
      if (id) {
        this.$ajax.delete(`/user/${id}`).then(() => {
          this.loadUsers();
        });
      }
    },
    showRestPwd(row) {
      this.currentUserId = row.id;
      this.$refs.restPwd.show();
    },
    showApplicationManager: function(userId) {
      this.currentUserId = userId;
      this.applicationLoading = true;
      this.showApplicationManagerFlag = true;
      Promise.all([
        this.$ajax.get("/server/application"),
        this.$ajax.get(`/user/${userId}/application`)
      ])
        .then(
          ([{ data: allApplications }, { data: managedApplications }]) => {
            this.unManagedApplications = allApplications.map(a => {
              return {
                key: a.name,
                content: a.name
              };
              this.managerdApplications = managedApplications;
            });
          },
          () => {}
        )
        .finally(() => {
          this.applicationLoading = false;
        });
    },
    transfToManaged: function(newTargetKeys, direction, moveKeys) {
      if (direction === "right") {
        this.$ajax
          .form({ applications: moveKeys })
          .post(`/user/${this.currentUserId}/application`)
          .then(() => {
            this.managerdApplications = newTargetKeys;
          });
      } else {
        this.$ajax
          .delete(
            `/user/${this.currentUserId}/application?applications=${moveKeys}`
          )
          .then(() => {
            this.managerdApplications = newTargetKeys;
          });
      }
    }
  }
};
</script>
