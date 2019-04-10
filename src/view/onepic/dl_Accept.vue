<template>
  <div class="mask" id="dialog-vm4" v-show="showDialog">
    <div class="dialog">
      <div class="dialog-header">
        <div class="title pos-left">{{take}} - {{dialogTitle}}</div>
        <ul class="tools pos-right">
          <li class="item">
            <button class="btn" type="button" @click="closeDialog">
              <i class="icon icon-close"></i>
            </button>
          </li>
        </ul>
      </div>
      <div class="dialog-body scroll">
        <ul class="panel">
          <li class="item">
            <select class="selector" v-model="disasterType">
              <option value selected>所有类型</option>
              <option v-for="(item,idx) in disasterTypeArray" :key="idx" :value="item">{{item}}</option>
            </select>
          </li>
          <li class="item">
            <input type="date" class="datepicker" v-model="startTime" max="timeLimit">
          </li>
          <li class="item">至</li>
          <li class="item">
            <input type="date" class="datepicker" v-model="endTime" max="timeLimit">
          </li>
          <li class="item">
            <input type="text" class="textbox" v-model="keyword" placeholder="请输入关键字搜索">
          </li>
          <li class="item">
            <button class="btn bg-blue" type="button" @click="query()">
              <span class="text">查询</span>
            </button>
          </li>
        </ul>
        <table class="dtable">
          <thead>
            <tr>
              <td>序号</td>
              <td>灾情位置</td>
              <td>灾情类型</td>
              <td>出动时间</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,idx) in list" :key="idx">
              <td style="width:5%;">{{idx + 1}}</td>
              <td style="width:30%;">
                <div :title="item.zhdd">{{item.zhdd}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.ZQLX">{{item.zqlxName}}</div>
              </td>
              <td style="width:20%;">
                <div :title="item.JJSJ">{{item.BjsjTime}}</div>
              </td>
            </tr>
          </tbody>
        </table>
        <x-pager
          :page="page"
          :page-size="pageSize"
          :total="total"
          :max-page="maxPage"
          @pagehandler="pageHandler"
        ></x-pager>
        <x-loading :show="showLoading"></x-loading>
      </div>
    </div>
  </div>
</template>
<script>
import Pager from "@/components/Pager";
import Loading from "@/components/Loading";
import axios from "axios";

export default {
  data() {
    return {
      showDialog: false,
      dialogTitle: "接处警记录清单",
      disasterType: "",
      disasterTypeArray: ["火灾扑救", "抢险救援", "社会救助", "其他出动 "],
      startTime: this.oneMonthAgo(),
      endTime: this.today(),
      timeLimit: this.today(),
      keyword: null,
      list: [],
      listHasData: false,
      page: 0,
      pageSize: 10,
      total: 10,
      maxPage: 9,
      teamName: null,
      showLoading: false
    };
  },
  components: {
    "x-pager": Pager,
    "x-loading": Loading
  },
  props: {
    take: String,
    show: Boolean
  },
  methods: {
    pageHandler(page) {
      this.page = page;
      let params = {
        QXWZ: this.teamName,
        ZQLX: this.disasterType,
        ZQWZ: this.keyword,
        pageSize: this.pageSize,
        pageindex: this.page,
        startTime: this.startTime,
        endTime: this.endTime,
        HTTEST: "test"
      };
      let $this = this;
      this.showLoading = true;
      axios
        .get(this.URLHEAD + "YZT_JCJSDFX_Details", {
          params: params
        })
        .then(res => {
          let data = res.data;
          this.list = data.Data;
          this.total = data.count;
          this.dialogShow = true;
          this.showLoading = false;
        });
    },
    query(val) {
      this.teamName = val?val:this.teamName;
      this.showDialog = true;
      this.list = [];
      this.pageHandler(1);
    },
    reset() {
      this.keyword = "";
      this.disasterType = "";
      this.page = 0;
      this.pageSize = 10;
      this.total = 10;
      this.startTime = this.oneMonthAgo();
      this.endTime = this.today();
    },
    closeDialog() {
      this.showDialog = false;
      this.reset()
    }
  }
};
</script>
<style scoped>
</style>
