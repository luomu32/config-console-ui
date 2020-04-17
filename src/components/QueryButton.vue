<template>
  <Button @click="$emit('click')">{{$t('query')}}</Button>
</template>
<script>
export default {
  i18n: {
    messages: {
      "en-US": {
        query: "Query"
      },
      "zh-CN": {
        query: "查询"
      },
      ja: {
        query: "問い合わせ"
      }
    }
  }
};
</script>