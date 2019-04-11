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
            <input type="text" v-model="keyword" placeholder="请以姓名作为关键字搜索" class="textbox" />
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
              <td>事项名称</td>
              <td>数据来源</td>
              <td>事项开始时间</td>
              <td>处理时间</td>
            </tr>
          </thead>
          <tbody v-if="total>0">
            <tr v-for="(item,idx) in list" :key="idx">
              <td>{{idx + 1}}</td>
              <td>
                <div :title="item.userName">{{item.userName}}</div>
              </td>
              <td>
                <div :title="item.groupName">{{item.groupName}}</div>
              </td>
              <td>
                <div :title="item.TypeName">{{item.TypeName}}</div>
              </td>
              <td>
                <div :title="item.Type">{{item.Type}}</div>
              </td>
              <td>
                <div :title="item.startTime">{{item.startTime}}</div>
              </td>
              <td>
                <div :title="item.SignTime">{{item.SignTime}}</div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="7"></td>
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
      groupName: this.take,
      dialogTitle: "工作事项清单",
      keyword:null,
      date:this.dateShift(0)
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
        groupName: this.groupName,
        pageSize: this.pageSize,
        pageIndex: this.page,
        indexDate: this.date,
        userName:this.keyword
      };
      this.showLoading=true
      axios.get(this.URLHEAD+'XN_GZYL_TC',{params:params}).then(res=>{
          let data = res.data
          this.list = data.Data.list
          this.total = data.Data.count
          this.showLoading=false
      })
    },
    query(obj) {
      this.groupName = obj?obj.dep:this.groupName;
      this.date = obj?obj.date:this.date
      this.showDialog = true;
      this.list = [];
      this.pageHandler(1);

    },
    reset(){
        this.pageSize=10
        this.page=1
    },
    closeDialog() {
      this.showDialog = false;
      this.reset()
    }
  }
};
</script>