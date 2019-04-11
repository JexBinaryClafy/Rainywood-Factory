<template>
  <div class="mask" v-show="showDialog">
    <div class="dialog" style="width:1500px;">
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
            <input type="text" class="textbox" v-model="keyword" placeholder="请以巡查部位名称作为关键字搜索">
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
              <td>巡查部位名称</td>
              <td>巡查地点</td>
              <td>巡查时间</td>
              <td>巡查人</td>
            </tr>
          </thead>
          <tbody v-if="list.length>0">
            <tr v-for="(item,idx) in list" :key="idx">
              <td style="width:10%;">{{idx + 1}}</td>
              <td style="width:20%;">
                <span :title="item.DutyDept">{{item.DutyDept|| '暂无名称'}}</span>
              </td>
              <td style="width:20%;">
                <span :title="item.XXAddress">{{item.XXAddress || '暂无地点信息'}}</span>
              </td>
              <td style="width:30%;">
                <span :title="item.lastChkDate">{{item.lastChkDate || '暂无时间信息'}}</span>
              </td>
              <td style="width:20%;">
                <span :title="item.Dutyer">{{item.Dutyer || '暂无巡查人信息'}}</span>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="5">暂无巡查记录</td>
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
      page: 1,
      pageSize: 10,
      total: 10,
      maxPage: 10,
      showDialog: false,
      showLoading: false,
      dialogTitle: "巡查记录",
      selectTime: this.take
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
        keyword: this.keyword,
        pageSize: this.pageSize,
        pageIndex: this.page,
        selectTime: this.selectTime
      };
      this.showLoading = true;
      axios
        .get(this.URLHEAD + "GetpatrolContent", {
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
      this.selectTime = val?val:this.selectTime
      this.showDialog=true
      this.list = []
      this.pageHandler(1);
    },
    reset() {
      this.keyword = "";
      this.page = 1;
      this.pageSize = 10;
    },
    closeDialog() {
      this.reset();
      this.showDialog = false;
    }
  }
};
</script>