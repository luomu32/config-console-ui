<template>
  <div>
    <Upload
      v-show="displayFlag"
      :action="url"
      :show-upload-list="false"
      :type="type"
      :format="extension"
      :on-format-error="updateFormatError"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :on-progress="uploadProcess"
      :style="styles"
    >
      <slot></slot>
    </Upload>
    <Progress :percent="percent" v-show="progressRateDisplay"/>
  </div>
</template>
<script>
export default {
  props: {
    url: String,
    type: {
      type: String,
      default: "select"
    },
    extension: Array,
    styles: String,
    displayFlag: Boolean
  },
  data() {
    return {
      // displayFlag: true
      progressRateDisplay: false,
      percent: 0
    };
  },
  methods: {
    beforeUpload() {
      this.$Loading.start();
      this.displayFlag = false;
      this.progressRateDisplay = true;
    },
    updateFormatError() {
      this.$Message.error(`仅支持[${this.extension.join(",")}]`);
      this.$Loading.finish();
    },
    uploadProcess: function(event, file) {
      this.$Loading.update(event.percent);
      this.percent = event.percent;
    },
    uploadSuccess: function(response, file) {
      this.$Loading.finish();
      this.$Message.success(`文件：${file.name}上传成功`);
    },
    uploadError: function(error, file, filelist) {
      this.$Message.error(`文件：${filelist.name}上传失败`);
      this.$Loading.finish();
      this.displayFlag = true;
    }
  }
};
</script>
