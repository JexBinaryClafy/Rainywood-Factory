<template>
  <div class="mask" v-show="showDialog">
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
            <input type="date" class="datepicker" v-model="date" :max="timeLimit">
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
              <td>姓名</td>
              <td>所属部位</td>
              <td>响应速度指数</td>
              <td>效能指数</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,idx) in list" :key="idx">
              <td>{{idx + 1}}</td>
              <td>
                <div :title="item.userName">{{item.userName}}</div>
              </td>
              <td>
                <div :title="item.groupName">{{item.groupName}}</div>
              </td>
              <td>
                <div :title="item.yysd">{{item.yysd}}</div>
              </td>
              <td>
                <div :title="item.score">{{item.score}}</div>
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
      list: [],
      page: 1,
      pageSize: 10,
      total: 10,
      maxPage: 10,
      showDialog: false,
      showLoading: false,
      level: this.take,
      dialogTitle: "业务能力指数清单",
      date: this.today(),
      timeLimit:this.today()
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
        level: this.level,
        pageSize: this.pageSize,
        pageIndex: this.page,
        indexDate: this.date
      };
      this.showLoading=true
      axios.get(this.URLHEAD+'XN_XYSD_TC',{params:params}).then(res=>{
          let data = res.data
          this.list = data.Data.list
          this.total = data.Data.count
          this.showLoading=false
      })
    },
    query(val) {
      this.level = val?val:this.level;
      this.showDialog = true;
      this.list = [];
      this.pageHandler(1);

    },
    reset(){
        this.pageSize=10
        this.page=1
        this.date=this.today()
    },
    closeDialog() {
      this.showDialog = false;
      this.reset()
    }
  }
};
</script>