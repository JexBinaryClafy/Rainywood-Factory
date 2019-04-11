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
            <select class="selector" v-model="district">
              <option value selected>所有大队</option>
              <option v-for="(item,idx) in districtArray" :value="item" :key="idx">{{item}}</option>
            </select>
          </li>

          <li class="item">
            <input type="text" class="textbox" v-model="keyword" placeholder="请以警情位置作为关键字搜索">
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
              <td>所属区划</td>
              <td>接警时间</td>
              <td>出警中队</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,idx) in list" :key="idx">
              <td style="width:5%;">{{idx + 1}}</td>
              <td style="width:30%;">
                <div :title="item.zhdd">{{item.zhdd}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.zqlxName">{{item.zqlxName}}</div>
              </td>
              <td style="width:20%;">
                <div :title="item.qxName">{{item.ZXName}}</div>
              </td>
              <td style="width:20%;">
                <div :title="item.BjsjTime">{{item.BjsjTime}}</div>
              </td>
              <td style="width:10%;">
                <div :title="item.short_name">{{item.short_name}}</div>
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
      district: "",
      districtArray: [
        "南明大队",
        "云岩大队",
        "乌当大队",
        "花溪大队",
        "观山湖大队",
        "乌当大队",
        "白云大队",
        "清镇大队",
        "息烽大队",
        "修文大队",
        "开阳大队",
        "特勤大队"
      ],
      keyword: "",
      list: [],
      page: 0,
      pageSize: 10,
      total: 10,
      maxPage: 10,
      showDialog: false,
      dialogTitle: "警情记录清单",
      date: null,
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
  methods: {
    pageHandler(page) {
      this.page = page;
      let params = {
        QXWZ: this.date,
        ZQLX: this.disasterType,
        SWQX: this.district,
        ZQWZ: this.keyword,
        pageSize: this.pageSize,
        pageindex: this.page
      };
      let $this = this;
      this.showLoading = true;
      axios
        .get(this.URLHEAD + "YZT_XFJJXFX_Details", {
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
      this.date = val?val:this.date;
      
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
