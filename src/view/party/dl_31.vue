<template>
  <div class="mask" id="dialog_vm4" v-show="showDialog">
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
            <input type="date" value class="datepicker" 
            v-model="startTime" :max="timeLimit" placeholder="开始时间">
          </li>
          <li class="item">至</li>
          <li class="item">
            <input type="date" value class="datepicker" 
            v-model="endTime" :max="timeLimit" placeholder="开始时间">
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
              <td>申报事项内容</td>
              <td>事项类型</td>
              <td>事项性质</td>
              
              <td>申报时间</td>
              <td>申报人</td>
            </tr>
          </thead>
          <tbody v-if="list.length>0">
            <tr v-for="(item,idx) in list" :key="idx">
              <td style="width:5%;">{{idx + 1}}</td>
              <td style="width:40%;text-align:left;">
                <div :title="item.SBSXNR">{{item.SBSXNR}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.SXMC">{{item.SXMC}}</div>
              </td>
              <td style="width:10%;">
                <div :title="item.SXXZ">{{item.SXXZ}}</div>
              </td>
              
              <td style="width:15%;">
                <div :title="item.SBSJ">{{item.SBSJ}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.SBR">{{item.SBR}}</div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6">暂无信息</td>
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
      list: [],
      page: 1,
      pageSize: 10,
      total: 10,
      keyword:'',
      maxPage: 10,
      dialogTitle:'三重一大申报事项清单',
      startTime:this.oneMonthAgo(),
      endTime:this.today(),
      timeLimit:this.today(),
      showDialog: false,
      showLoading: false,
      depname: this.take
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
        SBDW: this.depname,
        pageSize: this.pageSize,
        pageIndex: this.page,
        startTime:this.startTime,
        endTime:this.endTime
      };
      this.showLoading = true;
      axios.get(this.URLHEAD + "SZYDTC", { params: params }).then(res => {
        let data = res.data;
        console.log(data);
        this.list = data.Data;
        this.total = data.count;
        this.showLoading = false;
      });
    },
    query(n) {
      this.depname = n?n:this.depname;
      this.startTime=this.$parent.startTime
      this.endTime=this.$parent.endTime
      this.showDialog = true;
      this.list = [];
      this.pageHandler(1);
    },
    reset() {
      this.pageSize = 10;
      this.page = 1;
      this.type = "";
    },
    closeDialog() {
      this.showDialog = false;
      this.reset();
    }
  }
};
</script>