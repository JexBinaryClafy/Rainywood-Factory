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
            <select class="selector" v-model="dangerType">
              <option value selected>所有类型</option>
              <option v-for="(item,idx) in dangerTypeArray" :value="item" :key="idx">{{item}}</option>
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
              :min="timeMin"
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
              :min="timeMin"
            >
          </li>
          <li class="item">
            <input type="text" class="textbox" v-model="keyword" placeholder="请以告警发生部位为关键字搜索">
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
              <td>告警内容</td>
              <td>隐患类型</td>
              <td>发生部位</td>
              <td>告警时间</td>
            </tr>
          </thead>
          <tbody v-if="list.length>0">
            <tr v-for="(item,idx) in list" :key="idx">
              <td>{{idx + 1}}</td>
              <td>
                <div :title="item.AlarmType">{{item.AlarmType||"暂无隐患内容"}}</div>
              </td>
              <td>
                <div :title="item.dangerType">{{item.dangerType}}</div>
              </td>
              <td>
                <div :title="item.ComName">{{item.ComName}}</div>
              </td>
              <td>
                <div :title="item.AlarmTime">{{item.AlarmTime}}</div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="5">暂无信息</td>
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
      dangerType: "",
      dangerTypeArray: [
        "电压异常",
        "电流异常",
        "电路温度",
        "喷淋系统水压不足",
        "水箱水位低",
        "室内消火栓水位低",
        "其他隐患"
      ],
      keyword: "",
      list: [],
      showLoading: false,
      page: 1,
      pageSize: 10,
      total: 10,
      maxPage: 9,
      district: this.take,
      showDialog: false,
      dialogTitle: "安全隐患告警日志",
      startTime: this.oneMonthAgo(),
      endTime: this.today(),
      timeLimit:this.today(),
      timeMin:this.dateShift(-365)
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
        district: this.district,
        keyword: this.keyword,
        type: this.dangerType,
        pageSize: this.pageSize,
        pageIndex: this.page,
        startTime:this.startTime+' 00:00:00',
        endTime:this.endTime+' 23:59:59'
      };
      this.showLoading=true
      axios.get(this.URLHEAD+'getMonitorDetailed',{
          params:params
      }).then(res=>{
          let data = res.data
          this.list = data.Data;
          this.total = data.count;
          this.showLoading=false
      })
    },
    query(val) {
      this.district = val?val:this.district
      this.startTime=this.$parent.startTime
      this.endTime=this.$parent.endTime
      this.showDialog=true
      this.list=[]
      this.pageHandler(1);
    },
    reset(){
        this.keyword=''
        this.type=''
        this.page=1
        this.pageSize=10
        this.startTime=this.oneMonthAgo()
        this.endTime=this.today()
    },
    closeDialog() {
      this.reset()
      this.showDialog = false;
    }
  }
};
</script>