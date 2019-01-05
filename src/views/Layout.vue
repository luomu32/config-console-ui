<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger :width="256" class="left-sider" :style="{overflow: 'hidden'}">
      <div class="logo-con">配置中心管理平台</div>
      <Menu theme="dark" :active-name="activeMenuName" width="auto">
        <MenuItem
          :name="menu.name"
          :to="{path:menu.url,params:{menuId:'ddd'}}"
          v-for="menu in menus"
          :key="menu.name"
        >
          <Icon :type="menu.icon"></Icon>
          {{menu.title}}
        </MenuItem>
      </Menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        {{user.username}}
        <Tag>{{user.roleName}}</Tag>
        <Button>修改密码</Button>
        <Button @click="loginOut" icon="md-log-out">退出</Button>
      </Header>
      <Content class="content-wrapper">
        <router-view/>
      </Content>
    </Layout>
  </Layout>
</template>
<style lang="less">
.logo-con {
  height: 64px;
  padding: 0px;
  text-align: center;
  color: #fff;
  line-height: 64px;
  font-size: 24px;
  font-weight: bold;
}
.header-con {
  background: #fff;
  padding: 0 20px;
  width: 100%;
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
</style>
<script>
import { mapGetters } from "vuex";
export default {
  mounted() {
    const name = this.$route.name;
    if (name === "home") {
      this.activeMenuName = "";
    } else {
      this.activeMenuName = name;
    }
    // console.log(this.actions);
  },
  computed: {
    ...mapGetters(["user", "actions", "menus"])
  },
  data() {
    return {
      activeMenuName: "server"
    };
  },
  methods: {
    loginOut: function() {
      this.$ajax
        .post("/sing-out")
        .send()
        .then(
          resp => {
            this.$store.commit("clear");
            this.$router.replace({ name: "login" });
          },
          () => {}
        );
    }
  }
};
</script>
