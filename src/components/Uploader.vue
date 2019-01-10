<template>
  <div>
    <Upload
      v-show="uploaderDisplayFlag"
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
    <Progress :percent="percent" hide-info v-show="progressRateDisplay"/>
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
    trigger: Boolean,
    showUploadSuccessMessage: {
      type: Boolean,
      default: false
    },
    showUploadFailedMessage: {
      type: Boolean,
      default: true
    }
    // cancel: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data() {
    return {
      uploaderDisplayFlag: false,
      progressRateDisplay: false,
      percent: 0
    };
  },
  computed: {
    // uploaderDisplayFlag: function() {
    // return this.trigger;
    // }
  },
  watch: {
    trigger: function() {
      this.progressRateDisplay = false;
      this.uploaderDisplayFlag = this.trigger;
    }
  },
  methods: {
    beforeUpload() {
      // if (this.cancel) {
      //   console.log(this.cancel);
      //   return false;
      // }
      this.$Loading.start();
      this.uploaderDisplayFlag = false;
      this.progressRateDisplay = true;
    },
    updateFormatError() {
      this.$Message.error(`仅支持[${this.extension.join(",")}]`);
      this.$Loading.finish();
      this.progressRateDisplay = false;
      this.uploaderDisplayFlag = true;
    },
    uploadProcess: function(event, file) {
      this.$Loading.update(event.percent);
      this.percent = event.percent;
    },
    uploadSuccess: function(response, file) {
      this.$Loading.finish();
      if (this.showUploadSuccessMessage)
        this.$Message.success(`文件：${file.name}上传成功`);
      this.uploaderDisplayFlag = false;
      this.progressRateDisplay = true;
      this.$emit("success", response);
    },
    uploadError: function(error, file, filelist) {
      if (this.showUploadFailedMessage)
        this.$Message.error(`文件：${filelist.name}上传失败`);
      this.$Loading.finish();
      this.uploaderDisplayFlag = true;
      this.progressRateDisplay = false;
    }
  }
};
</script>
