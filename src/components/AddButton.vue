<template>
  <Button icon="md-add" @click="$emit('click')" v-authority="'add'">{{$t('new')}}</Button>
</template>
<script>
export default {
  i18n: {
    messages: {
      "en-US": {
        new: "Add"
      },
      "zh-CN": {
        new: "新增"
      },
      "zh-TW": {
        new: "新增"
      },
      ja: {
        new: "追加する"
      }
    }
  }
};
</script>
