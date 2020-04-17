<template>
  <div>
    <div class="query-bar">
      <Row>
        <Col span="12">
          <label>{{$t('username')}}</label>
          <Input style="width:120px;" v-model="queryCondition.username"/>
          <label>{{$t('role')}}</label>
          <Select v-model="queryCondition.roleId" style="width:160px">
            <Option v-for="item in roles" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <QueryButton @click="loadUsers()"/>
        </Col>
        <Col span="12" style="text-align:right">
          <ButtonGroup>
            <AddButton @click="showModal()"/>
            <Button icon="md-add" @click="showModal()">从LDAP导入</Button>
            <Button icon="md-refresh" @click="loadUsers()">{{$t('refresh')}}</Button>
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
        <OperatorButton
          @click="showApplicationManager(row.id)"
          v-authority="'application'"
        >{{$t('application_permission')}}</OperatorButton>
        <OperatorButton v-authority="'edit'" @click="showModal(row)">{{$t('edit')}}</OperatorButton>
        <OperatorButton @click="showRestPwd(row)" v-authority="'resetPwd'">{{$t('reset_password')}}</OperatorButton>
        <OperatorDeleteButton @on-ok="remove(row.id)" v-authority="'del'">{{$t('delete')}}</OperatorDeleteButton>
      </template>
    </TablePage>

    <Maintain :userForEdit="user" ref="userMaintain" @send-success="loadUsers"></Maintain>

    <ResetPassword :userId="currentUserId.toString()" ref="restPwd"></ResetPassword>

    <ApplicationPermission :userId="currentUserId.toString()" ref="applicationPermission"/>
  </div>
</template>
<script>
import OperatorButton from "../../components/OperatorButton.vue";
import OperatorDeleteButton from "../../components/OperatorDeleteButton.vue";
import TooltipButton from "../../components/TooltipButton.vue";
import TablePage from "../../components/TablePage.vue";
import AddButton from "../../components/AddButton.vue";
import QueryButton from "../../components/QueryButton.vue";

import Maintain from "./Maintain.vue";
import ResetPassword from "./ResetPassword.vue";
import ApplicationPermission from "./ApplicationPermission.vue";

export default {
  components: {
    OperatorButton: OperatorButton,
    OperatorDeleteButton: OperatorDeleteButton,
    TooltipButton: TooltipButton,
    AddButton: AddButton,
    QueryButton: QueryButton,
    TablePage: TablePage,
    ResetPassword: ResetPassword,
    Maintain: Maintain,
    ApplicationPermission: ApplicationPermission
  },
  mounted() {
    this.loadUsers();
    this.loadRoles();
  },
  i18n: {
    messages: {
      "en-US": {
        username: "Username:",
        role: "Role:",
        application_permission: "App Permission",
        reset_password: "Reset Pass"
      },
      "zh-CN": {
        username: "用户名：",
        role: "角色：",
        application_permission: "应用权限管理",
        reset_password: "重置密码"
      }
    }
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
        { title: this.$t("user.table.column.username"), key: "username" },
        {
          title: this.$t("user.table.column.role"),
          render: (h, params) => {
            return h("div", params.row.role.name);
          }
        },
        { title: this.$t("user.table.column.status") },
        {
          title: this.$t("user.table.column.create_datetime"),
          key: "createdDatetime"
        },
        {
          title: this.$t("action"),
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
        roles.push({ id: "-1", name: this.$t("all") });
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
      this.$refs.applicationPermission.show();
    }
  }
};
</script>
