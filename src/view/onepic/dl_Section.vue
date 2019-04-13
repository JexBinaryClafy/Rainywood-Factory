<template>
  <div class="mask" v-if="showDialog">
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
            <input
              type="date"
              value
              class="datepicker"
              v-model="startTime"
              placeholder="开始时间"
              :max="timeLimit"
              :min="timeMin"
            >
          </li>
          <li class="item">至</li>
          <li class="item">
            <input
              type="date"
              value
              class="datepicker"
              v-model="endTime"
              placeholder="结束时间"
              :max="timeLimit"
              :min="timeMin"
            >
          </li>
          <li class="item">
            <input type="text" class="textbox" v-model="keyword" placeholder="请以警情位置为关键字搜索">
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
              <td>警情位置</td>
              <td>警情类型</td>
              <td>接警时间</td>
              <td>出警中队</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,idx) in list" :key="idx">
              <td>{{idx + 1}}</td>
              <td>
                <div :title="item.zhdd">{{item.zhdd}}</div>
              </td>
              <td>
                <div :title="item.zqlxName">{{item.zqlxName}}</div>
              </td>
              <td>
                <div :title="item.BjsjTime">{{item.BjsjTime}}</div>
              </td>
              <td>
                <div :title="item.time">{{item.short_name}}</div>
              </td>
            </tr>
          </tbody>
        </table>
        <x-loading :show="showLoading"></x-loading>
        <x-pager
          :page="page"
          :page-size="pageSize"
          :total="total"
          :max-page="maxPage"
          @pagehandler="pageHandler"
        ></x-pager>
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
      disasterType: "",
      disasterTypeArray: ["火灾扑救", "抢险救援", "社会救助", "其他出动"],
      keyword: "",
      list: [],
      listHasData: false,
      page: 1,
      pageSize: 10,
      total: 10,
      maxPage: 9,
      district: this.take,
      showDialog: false,
      dialogTitle: "警情记录清单",
      startTime: this.$parent.startTime,
      endTime: this.$parent.endTime,
      timeLimit: this.today(),
      timeMin: this.dateShift(-365),
      showLoading: false
    };
  },
  components: {
    "x-pager": Pager,
    "x-loading": Loading
  },
  props: {
    take: String,
    show: Boolean,
    date: Object
  },
  methods: {
    pageHandler(page) {
      this.page = page;
      let params = {
        QXWZ: this.district,
        ZQLX: this.disasterType,
        ZQWZ: this.keyword,
        pageSize: this.pageSize,
        pageIndex: this.page,
        startTime: this.startTime + " 00:00:00",
        endTime: this.endTime + " 23:59:59",
        HTTEST: "test"
      };
      this.showLoading = true;
      axios
        .get(this.URLHEAD + "YZT_ZQXYFX_Details", {
          params: params
        })
        .then(res => {
          let data = res.data;
          this.list = data.Data;
          this.total = data.count;
          this.showLoading = false;
        });
    },
    query(val) {
      this.district = val ? val : this.district;
      this.startTime = this.$parent.startTime;
      this.endTime = this.$parent.endTime;
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
    },
    closeDialog() {
      this.showDialog = false;
      this.reset();
    }
  }
};
</script>
<style scoped>
</style>
