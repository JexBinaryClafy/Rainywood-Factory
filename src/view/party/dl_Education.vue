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
            <input type="text" class="textbox" v-model="keyword" placeholder="请输入标题作为关键字搜索">
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
              <td>标题</td>
              <td>浏览量</td>
              <td>发布时间</td>
              <td>发布类型</td>
              <td>媒体类型</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,idx) in list" :key="idx">
              <td style="width:10%;">{{idx + 1}}</td>
              <td style="width:25%;">
                <div :title="item.FileName">{{item.FileName}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.ClickCount">{{item.ClickCount}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.Created">{{item.Created}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.FileResTypeName">{{item.FileResTypeName}}</div>
              </td>
              <td style="width:20%;">
                <div :title="item.FileType">{{item.FileType}}</div>
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
      type: "",
      keyword: "",
      list: [],
      page: 0,
      pageSize: 10,
      total: 10,
      maxPage: 10,
      district: "",
      showDialog: false,
      showLoading: false,
      dialogTitle: "教育详情",
      startTime:this.$parent.startTime,
      endTime:this.$parent.endTime
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
        parameterType: this.type,
        pageSize: this.pageSize,
        pageIndex: this.page,
        keyword: this.keyword,
        startTime:this.startTime + ' 00:00:00',
          endTime:this.endTime + ' 23:59:59'
      };
      this.showLoading = true;
      axios.get(this.URLHEAD + "GovernmentWindows", { params: params }).then(res => {
        let data = res.data;
        this.list = data.Data;
        this.total = data.count;
        this.showLoading = false;
      });
    },
    query(n) {
      this.type = n?n:this.type;
      this.showDialog = true;
      this.list = [];
      this.pageHandler(1);
    },
    reset() {
      this.pageSize = 10;
      this.page = 1;
      this.date = this.today();
      this.keyword=''
    },
    closeDialog() {
      this.showDialog = false;
      this.reset();
    }
  }
};
</script>