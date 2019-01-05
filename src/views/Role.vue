<template>
  <div>
    <div class="query-bar" style="text-align:right">
      <ButtonGroup>
        <Button icon="md-add" @click="showModal(false)" v-authority="'add'">创建角色</Button>
        <Button icon="md-refresh" @click="loadRoles()">手动刷新</Button>
      </ButtonGroup>
    </div>

    <Table border :data="roles" :columns="col" :loading="rolesLoading">
      <template slot-scope="{ row }" slot="action">
        <OperatorButton @click="showPermissionManage(row.id)" v-authority="'permission'">权限管理</OperatorButton>
        <OperatorButton @click="showModal(true,row.id,row.name)" v-authority="'edit'">编辑</OperatorButton>
        <OperatorDeleteButton @on-ok="remove(row.id)" v-authority="'del'">删除</OperatorDeleteButton>
      </template>
    </Table>

    <Drawer title="权限管理" :closable="true" v-model="permissionManageDisplayFlag">
      <Tree :data="menuTree" show-checkbox multiple check-strictly ref="permissions"></Tree>
      <!-- <div style="position:absolute;bottom:10px;width:auto"> -->
      <Button long @click="grantPermission">保存</Button>
      <!-- </div> -->
    </Drawer>

    <ModalForm
      v-model="modalDisplayFlag"
      title="角色"
      :model="role"
      :rules="roleRules"
      :edit="editMode"
      :editModal="true"
      :modelId="roleId"
      url="/role"
      paramsType="body"
      @closed="closRoleModal"
      @send-success="loadRoles"
    >
      <FormItem label="名称" prop="name">
        <Input v-model="role.name" clearable/>
      </FormItem>
    </ModalForm>
  </div>
</template>
<script>
import ModalForm from "../components/ModalForm.vue";
import OperatorButton from "../components/OperatorButton.vue";
import OperatorDeleteButton from "../components/OperatorDeleteButton.vue";

export default {
  mounted() {
    this.loadRoles();
  },
  components: {
    ModalForm: ModalForm,
    OperatorButton: OperatorButton,
    OperatorDeleteButton: OperatorDeleteButton
  },
  data() {
    return {
      roles: [],
      rolesLoading: false,
      modalDisplayFlag: false,
      editMode: false,
      role: {
        name: ""
      },
      roleId: "",
      roleRules: {
        name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }]
      },
      permissionManageDisplayFlag: false,
      menuTree: [],
      col: [
        { title: "名称", key: "name" },
        { title: "创建时间", key: "createdDatetime" },
        { title: "最近一次修改时间", key: "lastModifyDatetime" },
        {
          title: "操作",
          align: "center",
          slot: "action"
        }
      ]
    };
  },
  methods: {
    loadRoles: function(name) {
      this.rolesLoading = true;
      this.$ajax
        .get("/role")
        .param({ name: name })
        .send()
        .then(resp => {
          this.roles = resp.data;
        })
        .finally(() => {
          this.rolesLoading = false;
        });
    },
    showModal: function(editMode, roleId, roleName) {
      if (editMode) {
        this.role.name = roleName;
        this.roleId = roleId.toString();
      }
      this.editMode = editMode;
      this.modalDisplayFlag = true;
      // }
    },
    closRoleModal() {
      this.modalDisplayFlag = false;
    },
    remove(id) {
      if (id) {
        this.$ajax
          .delete(`/role/${id}`)
          .send()
          .then(
            () => {
              this.loadRoles();
            },
            () => {}
          );
      }
    },
    showPermissionManage(id) {
      if (id) {
        this.roleId = id.toString();
        Promise.all([
          this.$ajax.get("/menu-with-actions").send(),
          this.$ajax.get(`/role/${id}/menus`).send()
        ])
          .then(([{ data: allMenus }, { data: rolePermissions }]) => {
            const permissionTree = new Array();
            permissionTree.push({
              title: "菜单",
              expand: true,
              disableCheckbox: true,
              children: allMenus.map(menu => {
                return {
                  title: menu.menuName,
                  id: menu.menuId,
                  expand: true,
                  action: false,
                  checked: rolePermissions.menus.some(m => m == menu.menuId),
                  children: menu.actions.map(action => {
                    return {
                      title: action.name,
                      id: action.id,
                      expand: true,
                      action: true,
                      checked: rolePermissions.actions.some(a => a == action.id)
                    };
                  })
                };
              })
            });
            this.menuTree = permissionTree;
          })
          .finally(() => {
            this.permissionManageDisplayFlag = true;
          });
      }
    },
    grantPermission() {
      const grantedPermissions = this.$refs.permissions.getCheckedNodes();
      const menus = [],
        actions = [];
      grantedPermissions.forEach(element => {
        if (element.action) actions.push(element.id);
        else menus.push(element.id);
      });
      this.$ajax
        .put("/grant-permission")
        .form({ roleId: this.roleId, menus: menus, actions: actions })
        .send()
        .then(
          () => {
            this.$Message.success("设置权限成功");
          },
          () => {}
        )
        .finally(() => {});
    }
  }
};
</script>
