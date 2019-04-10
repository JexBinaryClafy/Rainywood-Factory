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
              class="datepicker"
              v-model="startTime"
              :max="timeLimit"
              placeholder="开始时间"
            >
          </li>
          <li class="item">至</li>
          <li class="item">
            <input
              type="date"
              class="datepicker"
              v-model="endTime"
              :max="timeLimit"
              placeholder="结束时间"
            >
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
              <td>接警时间</td>
              <td>出警中队</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,idx) in list" :key="idx">
              <td style="width:5%;">{{idx + 1}}</td>
              <td style="width:40%;">
                <div :title="item.zhdd">{{item.zhdd}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.zqlxName">{{item.zqlxName}}</div>
              </td>
              <td style="width:25%;">
                <div :title="item.BjsjTime">{{item.BjsjTime}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.CJZD">{{item.short_name}}</div>
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
      showDialog: false,
      dialogTitle: "贵阳市整体灾情记录",
      disasterType: "",
      disasterTypeArray: ["火灾扑救", "抢险救援", "社会救助", "其他出动"],
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
      timeScope: null,
      showLoading:false
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
        QXWZ: this.timeScope,
        ZQLX: this.disasterType,
        ZQWZ: this.keyword,
        pageSize: this.pageSize,
        pageindex: this.page,
        startTime: this.startTime + ' 00:00:00',
        endTime: this.endTime + ' 23:59:59',
        HTTEST: "test"
      };
      let $this = this;
      this.showLoading = true
      axios.get(this.URLHEAD+'YZT_JJSJ_LXFX_Details',{
          params:params
      }).then(res=>{
          this.list = res.data.Data;
          this.total = res.data.count;
          this.showLoading = false;
      })
    },
    query(val) {
      this.timeScope = val?val:this.timeScope;
      this.showDialog = true;
      this.list = [];
      this.pageHandler(1);
    },
    reset() {
        this.disasterType = ''
        this.keyword=''
        this.startTime=this.oneMonthAgo()
        this.endTime=this.today()
    },
    closeDialog() {
      this.showDialog = false;
      this.reset()
    }
  }
};
</script>