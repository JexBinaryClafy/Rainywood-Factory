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
            <input type="date" :max="timeLimit" :min="timeMin" class="datepicker" v-model="date">
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
              <td>人员姓名</td>
              <td>效能指数</td>
              <td>业务能力指数</td>
              <td>工作压力指数</td>
              <td>响应速度指数</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,idx) in list" :key="idx">
              <td style="width:5%;">{{idx + 1}}</td>
              <td style="width:40%;">{{item.userName}}</td>
              <td style="width:10%;">{{item.score}}</td>
              <td style="width:10%;">{{item.ywnl}}</td>
              <td style="width:10%;">{{item.gzyl }}</td>
              <td style="width:10%;">{{item.yysd }}</td>
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
      keyword: "",
      list: [],
      listHasData: false,
      page: 1,
      pageSize: 10,
      total: 10,
      maxPage: 9,
      district: "",
      showDialog: false,
      dialogTitle: "效能指数列表",
      date: this.dateShift(0),
      timeMin:this.dateShift(-365),
      timeLimit: this.dateShift(0),
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
  computed:{
    hintText(){
      return `显示${this.date}的数据`
    }
  },
  methods: {
    pageHandler(page) {
      this.page = page;
      let params = {
        groupName: this.district,
        userName: this.keyword,
        pageSize: this.pageSize,
        pageIndex: this.page,
        indexDate: this.$parent.date
      };
      this.showLoading = true;
      axios
        .get(this.URLHEAD + "ZZJGXN_NEW_TC", {
          params: params
        })
        .then(res => {
          let data = res.data;
          this.list = data.Data.list;
          this.total = data.Data.count;
          this.showLoading = false;
        });
    },
    query(val) {
      this.district = val?val:this.district;
      this.date = this.$parent.date
      this.showDialog = true;
      this.list = [];
      this.pageHandler(1);
    },
    reset() {
      this.keyword = "";
      this.page = 1;
      this.pageSize = 10;
      this.total = 10;
      this.date = this.today();
    },
    closeDialog() {
      this.showDialog = false;
      this.reset();
    }
  }
};
</script>