<template>
    <Layout style="height: 100%" class="main">
        <Sider hide-trigger :width="256"  class="left-sider" :style="{overflow: 'hidden'}">
            <div class="logo-con">
                    配置中心管理平台
            </div>
            <Menu theme="dark" :active-name="activeMenuName" width="auto">
                <MenuItem name="server" to="/server">
                    <Icon type="md-filing"></Icon>
                            资源库管理
                </MenuItem>
                <MenuItem name="application" to="/application">
                    <Icon type="md-apps"></Icon>
                            应用管理
                </MenuItem>
                <MenuItem name="config" to="/config">
                    <Icon type="md-apps"></Icon>
                            配置管理
                </MenuItem>
                <MenuItem name="3">
                    <Icon type="md-key"></Icon>
                            加密设置
                </MenuItem>
                <MenuItem name="user" to="/user">
                    <Icon type="md-person"></Icon>
                            用户管理
                </MenuItem>
                <MenuItem name="role" to="/role">
                    <Icon type="md-people"></Icon>
                            角色管理
                </MenuItem>
                <MenuItem name="log" to="/log">
                    <Icon type="ios-archive"></Icon>
                            操作日志
                </MenuItem>
            </Menu>
        </Sider>
        <Layout>
            <Header class="header-con">
                <Button @click="loginOut" icon="md-log-out">退出</Button>
            </Header>
            <Content class="content-wrapper">
                <router-view/>
            </Content>
        </Layout>
    </Layout>
</template>
<style lang="less">
/* .container{
    height: 100%;
}
.content{
    border-radius: 5px;
    height: 100%;
    margin-bottom: -20px;
} */
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
import cookie from "js-cookie";
export default {
  mounted() {
    this.activeMenuName = this.$route.name;
  },
  data() {
    return {
      activeMenuName: "server"
    };
  },
  methods: {
    loginOut: function() {
      this.$http.post("/sing-out").then(() => {
        cookie.remove("token");
        this.$router.replace({ name: "login" });
      });
    }
  }
};
</script>
