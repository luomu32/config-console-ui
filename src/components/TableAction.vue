<template>
  <div>
    <!-- <ButtonGroup shape="circle"> -->
      <Button v-show="hasPermission('permission')" icon="ios-create-outline" shape="circle"></Button>
      <Button v-show="hasPermission('edit')" icon="ios-create-outline" shape="circle"></Button>
      <Button v-show="hasPermission('del')">删除</Button>
    <!-- </ButtonGroup> -->
  </div>
</template>
<script>
export default {
  mounted() {
    console.log(this.actions);
  },
  props: {
    actions: { type: Array, default: [] }
  },
  methods: {
    hasPermission(name) {
      return this.actions.some(a => a.name == name);
    }
  }
};
</script>
