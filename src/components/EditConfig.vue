<template>
    <div>
        <div>名称：{{$route.query.key}}</div>
        <div>值：<input type="text" v-model="value"></div>
        <div><button @click="sumbmit">提交</button></div>
    </div>
</template>
<script>
import axios from "axios";
/* eslint-disable */
const axiosClient = axios.create({
  baseURL: "http://localhost:8080/"
});
export default {
  data() {
    return {
      value: ""
    };
  },
  created() {},
  methods: {
    sumbmit: function() {
      axiosClient({
        url: `console/${this.$route.params.id}`,
        method:'put',
        data: this.value
      }).then(function(response) {
        console.log(response);
      });
    }
  }
};
</script>

