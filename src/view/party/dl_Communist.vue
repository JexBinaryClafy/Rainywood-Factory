<template>
  <div class="mask" v-show="showDialog">
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
              <td>姓名</td>
              <td>学历</td>
              <td>党员状态</td>
              <td>所属组织</td>
              <td>所属单位</td>
            </tr>
          </thead>
          <tbody v-if="list.length!=0">
            <tr v-for="(item,idx) in list" :key="idx">
              <td style="width:5%;">{{idx + 1}}</td>
              <td style="width:15%;">
                <div :title="item.userName">{{item.userName}}</div>
              </td>
              <td style="width:10%;">
                <div :title="item.education">{{item.education}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.partytype">{{item.partytype}}</div>
              </td>
              <td style="width:40%;">
                <div :title="item.department">{{item.department}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.deparment">{{item.deparment}}</div>
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
      maxPage: 10,
      keyword:'',
      showDialog: false,
      showLoading: false,
      dialogTitle: "业务能力指数清单",
      detachmentName: this.take
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
        keyword:this.keyword,
        detachmentName:this.detachmentName,
        pageIndex:this.page,
        pageSize:this.pageSize
      };
      this.showLoading=true
      axios.get(this.URLHEAD+'GartyMemberWinddows',{params:params}).then(res=>{
          let data = res.data
          this.list = data.Data
          this.total = data.count
          this.showLoading=false
      })
    },
    query(n) {
      this.detachmentName = n?n:this.detachmentName;
      this.showDialog = true;
      this.list = [];
      this.pageHandler(1);

    },
    reset(){
        this.pageSize=10
        this.page=1
        this.keyword=''
    },
    closeDialog() {
      this.showDialog = false;
      this.reset()
    }
  }
};
</script>