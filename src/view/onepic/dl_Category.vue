<template>
  <div class="mask" id="dialog-vm2" v-show="showDialog">
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
            <select class="selector" v-model="disasterType">
              <option value selected>所属中队</option>
              <option v-for="(item,idx) in disasterTypeArray" :key="idx" :value="item">{{item}}</option>
            </select>
          </li>
          <li class="item">
            <input 
            type="date" 
            value 
            class="datepicker" 
            v-model="startTime"
            :max="timeLimit" 
            :min="timeMin"
            placeholder="开始时间">
          </li>
          <li class="item">至</li>
          <li class="item">
            <input 
            type="date" 
            value 
            class="datepicker" 
            v-model="endTime" 
            :max="timeLimit"
            :min="timeMin"
            placeholder="结束时间">
          </li>
          <li class="item">
            <input 
            type="text"
            class="textbox" 
            v-model="keyword" placeholder="请输入关键字搜索">
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
      disasterTypeArray: ['特勤一中队', '特勤二中队',
            '贵开路中队', '三桥南路中队', '北京东路中队',
            '醒狮路中队', '富源中路中队', '菊花洞路中队', '后冲路中队',
            '同心路中队', '苏庄消防站中队',
            '金朱西路中队', '长岭南路中队', '黔灵山路中队',
            '龙广路中队', '清溪路中队', '百花路中队',
            '云岭路中队', '黔江路中队', '金戈路中队',
            '麦肖路中队', '人民北路中队', '扎佐消防站', '虎城大道中队'],
      keyword: "",
      list: [],
      page: 0,
      pageSize: 10,
      total: 10,
      maxPage: 9,
      district: this.take,
      showDialog: false,
      dialogTitle:'灾情记录清单',
      startTime: '',
      endTime: '',
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
  created(){
    axios.get(this.URLHEAD+'YZT_ZDLB').then(res=>{
      let data = res.data
      this.disasterTypeArray=data.Data.map(o=>{
        return o.DicKey
      })
    })
  },
  methods: {
    pageHandler(page) {
      this.page = page;
      let params = {
        QXWZ: this.district,
        ZQLX: this.disasterType,
        ZQWZ: this.keyword,
        pageSize: this.pageSize,
        pageIndex: this.page,
        startTime: this.startTime + ' 00:00:00',
        endTime: this.endTime + ' 23:59:59',
        HTTEST: "test"
      };
      this.showLoading = true;
      axios
        .get(this.URLHEAD + "YZT_ZQDDJGFX_Details", {
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
      this.district = val?val:this.district;
      this.startTime=this.$parent.startTime
      this.endTime=this.$parent.endTime
      this.showDialog = true;
      this.list = [];
      this.pageHandler(1);
    },
    reset(){
      this.keyword = "";
      this.disasterType = "";
      this.page = 0;
      this.pageSize = 10;
      this.total = 10;
    },
    closeDialog() {
      this.showDialog = false;
      this.reset()
    }
  }
};
</script>
<style scoped>
</style>
