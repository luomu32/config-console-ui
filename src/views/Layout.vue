<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger :width="256" class="left-sider" :style="{overflow: 'hidden'}">
      <Menu theme="dark" :active-name="activeMenuName" width="auto" :open-names="openMenus">
        <template v-for="menu in menus">
          <MenuItem
            :name="menu.name"
            :to="menu.url"
            :key="menu.name"
            v-if="menu.children.length==0"
          >
            <Icon :type="menu.icon" v-if="menu.icon"></Icon>
            {{menu.title}}
          </MenuItem>
          <Submenu :name="menu.name" v-else :key="menu.name">
            <template slot="title" v-if="menu.icon">
              <Icon :type="menu.icon"/>
              {{menu.title}}
            </template>
            <MenuItem
              :name="subMenu.name"
              v-for="subMenu in menu.children"
              :key="subMenu.name"
              :to="subMenu.url"
            >
              <Icon :type="subMenu.icon" v-if="subMenu.icon"></Icon>
              {{subMenu.title}}
            </MenuItem>
          </Submenu>
        </template>
      </Menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <Row :gutter="16">
          <Col span="16">
            <div class="logo-con">{{$t('title')}}</div>
          </Col>
          <Col span="8">
            <div class="user">
              {{user.username}}
              <Tag>{{user.roleName}}</Tag>
              <Button @click="$refs.changePassword.show()">{{$t('changePassword')}}</Button>
              <ChangePassword ref="changePassword" :userId="user.id.toString()"></ChangePassword>
              <Button @click="loginOut" icon="md-log-out">{{$t('quit')}}</Button>
            </div>
          </Col>
        </Row>
      </Header>
      <Content class="content-wrapper">
        <router-view/>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import { mapGetters } from "vuex";
import ChangePassword from "./user/ChangePassword.vue";

export default {
  components: {
    ChangePassword: ChangePassword
  },
  mounted() {
    const name = this.$route.name;
    if (name === "home") {
      this.activeMenuName = "";
    } else {
      this.activeMenuName = name;
    }
  },
  computed: {
    ...mapGetters("user", ["user", "menus"]),
    openMenus() {
      return this.menus.filter(m => m.children.length != 0).map(m => m.name);
    }
  },
  data() {
    return {
      activeMenuName: ""
    };
  },
  methods: {
    loginOut() {
      this.$ajax.post("/sing-out").then(
        () => {
          this.$store.commit("user/clear");
          this.$router.replace({ name: "login" });
        },
        () => {}
      );
    }
  }
};
</script>
<style lang="less">
.logo-con {
  // height: 64px;
  padding: 0px;
  // text-align: center;
  // color: #fff;
  // line-height: 64px;
  font-size: 24px;
  font-weight: bold;
}
.header-con {
  background: #fff;
  padding: 0 20px;
  width: 100%;
}
.header-con .user {
  text-align: right;
}
.content-wrapper {
  padding: 18px;
  height: ~"calc(100% - 80px)";
  overflow: auto;
}
.query-bar {
  margin-bottom: 15px;
  border: 1px #e9e9e9 solid;
  border-radius: 4px;
  background-color: #fff;
  padding: 10px;
}
.ivu-table-wrapper,
.ivu-table {
  border-radius: 4px;
}
.page {
  margin-top: 15px;
  text-align: right;
}
.table-action .ivu-table-cell {
  padding: 0px;
}
.drawer {
  height: ~"calc(100% - 55px)";
  overflow: "auto";
  padding-bottom: "53px";
  position: "static";
}
.drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>