<template>
    <Modal v-model="displayFlag" :title="title" @on-cancel="cancel">
        <slot></slot>
        <div slot="footer" style="text-align: center">
            <Button type="error" style="width:200px" ghost @click="cancel">取消</Button>
            <Button type="success" style="width:200px" ghost @click="submit" :loading="submitLoading">提交</Button>
        </div>
    </Modal>
</template>
<script>
export default {
  props: ["title", "displayFlag"],
  data() {
    return {
      submitLoading: false
    };
  },
  methods: {
    cancel() {
      this.displayFlag = false;
    },
    submit() {
      this.displayFlag = false;
    }
  }
};
</script>
