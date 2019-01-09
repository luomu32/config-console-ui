<template>
  <div>
    <Table border :data="data" :columns="columns" :loading="loading" @on-sort-change="sortChange">
      <template slot-scope="{ row,index }" slot="action">
        <slot :row="row" :index="index"></slot>
      </template>
    </Table>
    <div class="page">
      <Page
        :total="total"
        ref="page"
        show-sizer
        show-total
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array
    },
    columns: {
      type: Array
    },
    total: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    }
    // url: {
    //   type: String
    // },
    // query: {
    //   type: Object
    // }
  },
  data() {
    return {
      // data: [],
      // dataTotal: 0,
      pageNo: 1,
      pageSize: 10
      // loading: false
    };
  },
  // mounted() {
  //   this.load();
  // },
  methods: {
    // load() {
    //   if (this.url) {
    //     this.loading = true;
    //     this.$ajax
    //       .get(this.url)
    //       .param(
    //         Object.assign(this.query, {
    //           page: this.pageNo - 1,
    //           size: this.pageSize
    //         })
    //       )
    //       .send()
    //       .then(
    //         ({ data }) => {
    //           this.data = data.content;
    //           this.dataTotal = data.totalElements;
    //         },
    //         () => {}
    //       )
    //       .finally(() => {
    //         this.loading = false;
    //       });
    //   }
    // },
    pageChange(pageNo) {
      // this.pageNo = pageNo;
      // this.pageSize = this.$refs.page.currentPageSize;
      // this.load();
      const pageSize = this.$refs.page.currentPageSize;
      this.$emit("pageChange", { pageNo: pageNo, pageSize: pageSize });
    },
    pageSizeChange(pageSize) {
      // this.pageSize = pageSize;
      // this.pageNo = this.$refs.page.currentPage;
      // this.load();
      const pageNo = this.$refs.page.currentPage;
      this.$emit("pageChange", { pageNo: pageNo, pageSize: pageSize });
    },
    sortChange(p) {
      this.$emit("sortChange", p);
    }
  }
};
</script>
