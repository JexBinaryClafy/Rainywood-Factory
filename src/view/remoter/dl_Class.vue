<template>
  <div class="mask" v-show="showDialog">
    <div class="dialog" style="width:1600px;">
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
            <select class="selector" v-model="district">
              <option value selected>所有区划</option>
              <option v-for="(item,idx) in districtArray" :key="idx" :value="item">{{item}}</option>
            </select>
          </li>
          <li class="item">
            <input
              type="date"
              value
              class="datepicker"
              v-model="startTime"
              placeholder="开始时间"
              :max="timeLimit"
            >
          </li>
          <li class="item">至</li>
          <li class="item">
            <input
              type="date"
              value
              class="datepicker"
              v-model="endTime"
              placeholder="结束时间"
              :max="timeLimit"
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
              <td>隐患发生部位</td>
              <td>所在区划</td>
              <td>部位类型</td>
              <td>消防安全负责人</td>
              <td>联系电话</td>
              <td>隐患发生时间</td>
            </tr>
          </thead>
          <tbody v-if="list.length>0">
            <tr v-for="(item,idx) in list" :key="idx">
              <td style="width:5%;">{{idx + 1}}</td>
              <td style="width:25%;">
                <div :title="item.ComName">{{item.ComName}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.AreaMC">{{item.AreaMC}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.KindMC">{{item.KindMC || '暂无'}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.FireDuty">{{item.FireDuty || '暂无'}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.FireDutyTel">{{item.FireDutyTel || '暂无'}}</div>
              </td>
              <td style="width:10%;">
                <div :title="item.AlarmTime">{{item.AlarmTime || '暂无'}}</div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="7">暂无信息</td>
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
      districtArray: [
        "南明区",
        "云岩区",
        "乌当区",
        "花溪区",
        "观山湖区",
        "经开区",
        "白云区",
        "清镇市",
        "息烽县",
        "修文县",
        "开阳县"
      ],
      keyword: "",
      list: [],
      showLoading: false,
      page: 1,
      pageSize: 10,
      total: 10,
      maxPage: 10,
      district: "",
      showDialog: false,
      dialogTitle: "类型隐患地点清单",
      type: this.take,
      startTime: this.oneMonthAgo(),
      endTime: this.today(),
      timeLimit: this.today()
    };
  },
  watch: {
    take(n, o) {
      debugger;
    }
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
        district: this.district,
        keyword: this.keyword,
        pageSize: this.pageSize,
        pageIndex: this.page,
        type: this.type,
        startTime: this.startTime + " 00:00:00",
        endTime: this.endTime + " 23:59:59"
      };
      debugger;
      this.showLoading = true;
      axios
        .get(this.URLHEAD + "getAddressDetailed", {
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
      this.type = val ? val : "";
      this.showDialog = true;
      this.list = [];
      this.pageHandler(1);
    },
    reset() {
      this.keyword = "";
      this.page = 1;
      this.pageSize = 10;
      this.district=''
      this.startTime = this.oneMonthAgo();
      this.endTime = this.today();
    },
    closeDialog() {
      this.reset();
      this.showDialog = false;
    }
  }
};
</script>