<template>
  <Drawer :title="$t('application_permission')" :closable="true" v-model="displayFlag" width="620">
    <Spin size="large" fix v-if="loading"></Spin>
    <Transfer
      :data="unManagedApplications"
      :titles="[$t('unManagedApplication'),$t('managedApplication')]"
      :target-keys="managerdApplications"
      :list-style="{width:'260px',height:'400px'}"
      @on-change="transfToManaged"
    ></Transfer>
  </Drawer>
</template>
<script>
export default {
  i18n: {
    messages: {
      "en-US": {
        application_permission: "Application Permission Management",
        unManagedApplication: "Unmanageable Applications",
        managedApplication: "Manageable Applications"
      },
      "zh-CN": {
        application_permission: "应用权限管理",
        unManagedApplication: "不可管理的应用",
        managedApplication: "可管理的应用"
      },
      "zh-TW": {
        application_permission: "應用權限管理",
        unManagedApplication: "不可管理的應用",
        managedApplication: "可管理的應用"
      }
    }
  },
  props: {
    userId: String
  },
  data() {
    return {
      displayFlag: false,
      loading: false,
      unManagedApplications: [],
      managerdApplications: []
    };
  },
  methods: {
    show() {
      this.loading = true;
      this.displayFlag = true;
      Promise.all([
        this.$ajax.get("/server/application"),
        this.$ajax.get(`/user/${this.userId}/application`)
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
          this.loading = false;
        });
    },
    transfToManaged(newTargetKeys, direction, moveKeys) {
      if (direction === "right") {
        this.$ajax
          .form({ applications: moveKeys })
          .post(`/user/${this.userId}/application`)
          .then(() => {
            this.managerdApplications = newTargetKeys;
          });
      } else {
        this.$ajax
          .delete(
            `/user/${this.userId}/application?applications=${moveKeys}`
          )
          .then(() => {
            this.managerdApplications = newTargetKeys;
          });
      }
    }
  }
};
</script>