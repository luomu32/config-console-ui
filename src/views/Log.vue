<template>
  <div>
    <div class="query-bar">
      <Row>
        <Col span="16">
          <label>用户名：</label>
          <Input style="width:120px;" v-model="operatorName"></Input>
          <label>应用：</label>
          <Input style="width:120px;" v-model="application"></Input>
          <label>创建时间：</label>
          <DatePicker
            type="daterange"
            placeholder="开始日期-----结束时间"
            style="width: 190px;"
            @on-change="startDateChange"
            :options="datePickerOptions"
          ></DatePicker>
          <!-- <DatePicker type="date" placeholder="结束日期" style="width: 120px" @on-change="endDateChange" ></DatePicker> -->
        </Col>
        <Col span="8" style="text-align:right">
          <Button @click="loadLogs()">查询</Button>
        </Col>
      </Row>
    </div>

    <TablePage
      :data="logs"
      :columns="col"
      :total="logsTotal"
      :loading="logsLogading"
      @pageChange="pageChange"
      @sortChange="sortChange"
    ></TablePage>
  </div>
</template>
<script>
import TablePage from "../components/TablePage.vue";

export default {
  components: {
    TablePage: TablePage
  },
  mounted() {
    this.loadLogs();
  },
  data() {
    return {
      logs: [],
      col: [
        { title: "用户", key: "operatorName" },
        { title: "应用", key: "application" },
        {
          title: "Profile",
          key: "profile",
          width: 90
        },
        { title: "配置项", key: "configKey" },
        {
          title: "变动类型",
          key: "changeType",
          width: 120,
          render: (h, params) => {
            if (params.row.changeType === "ADD_CONFIG")
              return h("div", "新增配置");
            else if (params.row.changeType === "DELETE_CONFIG")
              return h("div", "删除配置");
            else if (params.row.changeType === "UPDATE_CONFIG")
              return h("div", "更新配置");
            else return h("div", params.row.changeType);
          }
        },
        { title: "内容", key: "content" },
        {
          title: "修改日期",
          key: "createdDatetime",
          width: 150,
          sortable: "custom",
          sortType: "desc"
        }
      ],
      logsTotal: 0,
      logsLogading: false,
      operatorName: "",
      application: "",
      startDate: "",
      endDate: "",
      pageSize: 10,
      datePickerOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      }
      //   startDateOptions: {
      //     disabledDate(date) {
      //         //如果选了结束时间，开始时间要早于等于结束时间，并且早于等于今日
      //       return date && date.valueOf() > Date.now();
      //     }
      //   },
      //   endDateOptions: {
      //     disabledDate: date => {
      //     //如果选了开始时间，结束时间要晚于等于开始时间，并且早于等于今日
      //       if (this.startDate) {
      //         let s = new Date(this.startDate);
      //         console.log(s.valueOf());
      //         return date.valueOf() < s.valueOf();
      //       }
      //       return date && date.valueOf() > Date.now();
      //     }
      //   }
    };
  },
  methods: {
    loadLogs(page = 1, size = this.pageSize, sort) {
      this.logsLogading = true;
      let sortStr = "";
      if (sort) {
        sortStr = `${sort.key},${sort.type}`;
      }
      this.$http
        .get("/log", {
          params: {
            page: page - 1,
            size: size,
            operatorName: this.operatorName,
            application: this.application,
            startDate: this.startDate,
            endDate: this.endDate,
            sort: sortStr
          }
        })
        .then(resp => {
          this.logs = resp.data.content;
          this.logsTotal = resp.data.totalElements;
          this.logsLogading = false;
        })
        .catch(() => {
          this.logsLogading = false;
        });
    },
    pageChange({ pageNo, pageSize }) {
      this.pageSize = pageSize;
      this.loadLogs(pageNo, pageSize);
    },
    startDateChange(value, type) {
      this.startDate = value[0];
      this.endDate = value[1];
    },
    // endDateChange(value) {
    //   this.endDate = value;
    // },
    sortChange(p) {
      this.loadLogs(null, null, {
        key: p.key,
        type: p.order === "normal" ? "desc" : p.order
      });
    }
  }
};
</script>
