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

    <DrawerForm
      ref="permission"
      :loading="permissionsLoading"
      title="权限管理"
      @submit="grantPermission"
    >
      <Tree :data="menuTree" show-checkbox multiple check-strictly ref="permissions"></Tree>
    </DrawerForm>

    <ModalForm
      title="角色"
      :model="role"
      ref="role"
      :rules="roleRules"
      :edit="editMode"
      :editModal="true"
      :modelId="roleId"
      url="/role"
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
import DrawerForm from "../components/DrawerForm.vue";

export default {
  mounted() {
    this.loadRoles();
  },
  components: {
    ModalForm: ModalForm,
    OperatorButton: OperatorButton,
    OperatorDeleteButton: OperatorDeleteButton,
    DrawerForm: DrawerForm
  },
  data() {
    return {
      roles: [],
      rolesLoading: false,
      editMode: false,
      role: {
        name: ""
      },
      roleId: "",
      roleRules: {
        name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }]
      },
      permissionsLoading: false,
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
        .param({ name: name })
        .get("/role")
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
      this.$refs.role.show();
    },
    remove(id) {
      if (id) {
        this.$ajax.delete(`/role/${id}`).then(
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
        this.permissionsLoading = true;
        this.$refs.permission.show();
        Promise.all([
          this.$ajax.get("/permissions"),
          this.$ajax.get(`/role/${id}/permissions`)
        ])
          .then(([{ data: allPermissions }, { data: rolePermissions }]) => {
            const permissionTree = new Array();
            permissionTree.push({
              title: "菜单",
              expand: true,
              disableCheckbox: true,
              children: allPermissions.menus.map(menu => {
                return {
                  title: menu.title,
                  id: menu.id,
                  expand: true,
                  action: false,
                  // disabled: menu.children.length != 0,
                  disableCheckbox: menu.children.length != 0,
                  checked:
                    menu.children.length == 0 &&
                    rolePermissions.menus.some(m => m.id == menu.id),
                  children: this.renderPermissionTreeChildren(
                    menu,
                    allPermissions.actions,
                    rolePermissions.actions,
                    rolePermissions.menus
                  )
                  // children: allPermissions.actions
                  //   .filter(action => action.menuId == menu.id)
                  //   .map(action => {
                  //     return {
                  //       title: action.name,
                  //       id: action.id,
                  //       expand: true,
                  //       action: true,
                  //       checked: rolePermissions.actions.some(
                  //         a => a.id == action.id
                  //       )
                  //     };
                  //   })
                };
              })
            });
            this.menuTree = permissionTree;
          })
          .finally(() => {
            this.permissionsLoading = false;
          });
      }
    },
    renderPermissionTreeChildren(menu, allActions, roleActions, roleMenus) {
      if (menu.children.length != 0) {
        // let actions = [];
        let subRoleMenus = roleMenus.filter(rm => rm.id == menu.id)[0].children;
        console.log(subRoleMenus)
        let subMenus = [];
        menu.children.forEach(m => {
          let menuOrActions = this.renderPermissionTreeChildren(
            m,
            allActions,
            roleActions,
            subRoleMenus
          );
          //下面没有action，也没有menu，可以选
          //下面有menu，有没有action未知，可以选，
          //下面只有action，
          // console.log(roleMenus);
          subMenus.push({
            title: m.title,
            id: m.id,
            action: false,
            expand: true,
            checked: subRoleMenus.some(rm => rm.id == m.id),
            // disableCheckbox:
            //   menuOrActions.length != 0 &&
            //   !menuOrActions.some(ma => ma.action == false),
            children: menuOrActions
          });
        });
        // console.log(menu);
        // console.log(actions);
        return subMenus;
      } else {
        return allActions
          .filter(action => action.menuId == menu.id)
          .map(action => {
            return {
              title: action.name,
              id: action.id,
              expand: true,
              action: true,
              checked: roleActions.some(a => a.id == action.id)
            };
          });
        // menuActions = menuActions.concat(a);
        // console.log(menuActions);
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
        .form({ menus: menus, actions: actions })
        .put(`/role/${this.roleId}/grant-permission`)
        .then(
          resp => {
            this.$Message.success("设置权限成功");
            this.$refs.permission.close();
            this.$store.commit("user/updatePermission", resp.data);
          },
          () => {}
        )
        .finally(() => {});
    }
  }
};
</script>
