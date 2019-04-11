<template>
  <div class="mask" id="dialog_vm5" v-show="showDialog">
    <div class="dialog">
      <div class="dialog-header">
        <div class="title pos-left">{{take}}-{{dialogTitle}}</div>
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
            <input type="text" class="textbox" v-model="keyword" placeholder="请以标题作为关键字搜索">
          </li>
          <li class="item">
            <button class="btn bg-blue" type="button" @click="query">
              <span class="text">查询</span>
            </button>
          </li>
        </ul>
        <table class="dtable">
          <thead>
            <tr>
              <td>序号</td>
              <td>标题</td>
              <td>帖子类型</td>
              <td>作者</td>
              <td>查看量</td>
              <td>发布时间</td>
            </tr>
          </thead>
          <tbody v-if="list.length!=0">
            <tr v-for="(item,idx) in list" :key="idx">
              <td style="width:5%;">{{idx + 1}}</td>
              <td style="width:50%;">
                <div :title="item.BT">{{item.BT}}</div>
              </td>
              <td style="width:10%;">
                <div :title="item.TZLX">{{item.TZLX}}</div>
              </td>
              <td style="width:10%;">
                <div :title="item.ZZ">{{item.ZZ}}</div>
              </td>
              <td style="width:10%;">
                <div :title="item.CK">{{item.CK}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.FBSJ">{{item.FBSJ}}</div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
                <td colspan="6"></td>
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
      keyword: "",
      list: [],
      page: 1,
      pageSize: 10,
      total: 10,
      maxPage: 9,
      type: "",
      showDialog: false,
      showLoading:false,
      dialogTitle: "论坛活跃情况分析",
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
        type: this.type,
        BT: this.keyword,
        pageSize: this.pageSize,
        pageIndex: this.page,
        HTTEST: "test"
      };
      this.showLoading = true
      axios.get(this.URLHEAD+'WHJSLTHY_TC',{
          params:params
      }).then(res=>{
          this.list = res.data.Data.list
          this.total = res.data.Data.count
          this.showLoading=false
      })
    },
    query(n) {
      this.type = n?n:this.type;
      this.showDialog = true;
      this.list = [];
      this.pageHandler(1);
    },
    closeDialog() {
      this.showDialog = false;
    }
  }
};
</script>