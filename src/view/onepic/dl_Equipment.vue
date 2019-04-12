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
            <select class="selector" v-model="orgType">
              <option value selected>贵阳市消防支队</option>
              <option v-for="(item,idx) in orgTypeArray" :value="item" :key="idx">{{item}}</option>
            </select>
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
              <td>设备名称</td>
              <td>投用年份</td>
              <td>装备产地</td>
              <td>所属机构</td>
              <td>库存</td>
              <td>报损</td>
              <td>报修</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,idx) in list" :key="idx">
              <td style="width:5%;">{{idx + 1}}</td>
              <td style="width:30%;">
                <div :title="item.eqName">{{item.eqName}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.eqTourTime">{{item.eqTourTime || '暂无信息'}}</div>
              </td>
              <td style="width:20%;">
                <div :title="item.eqChanDi">{{item.eqChanDi || '暂无信息'}}</div>
              </td>
              <td style="width:10%;">
                <div :title="item.depname">{{item.depname || '暂无信息'}}</div>
              </td>
              <td style="width:10%;">
                <div :title="item.eqStock">{{item.eqStock || '暂无信息'}}</div>
              </td>
              <td style="width:5%;">
                <div :title="item.eqDamage">{{item.eqDamage || '0'}}</div>
              </td>
              <td style="width:5%;">
                <div :title="item.eqSend">{{item.eqSend || '0'}}</div>
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
      orgType: "",
      orgTypeArray: [
        "白云大队同心路中队",
        "观山湖大队长岭南路中队",
        "观山湖大队金朱西路中队",
        "花溪大队清溪路中队",
        "开阳大队麦肖路中队",
        "南明大队富源中路中队",
        "南明大队菊花洞路中队",
        "南明大队醒狮路中队",
        "清镇大队云岭路中队",
        "乌当大队龙广路中队",
        "息烽大队虎成大道中队",
        "修文大队人民北路中队",
        "云岩大队贵开路中队",
        "云岩大队三桥南路中队",
        "云岩区消防大队",
        "特勤大队"
      ],
      keyword: "",
      list: [],
      listHasData: false,
      page: 0,
      pageSize: 10,
      total: 10,
      maxPage: 10,
      showDialog: false,
      showLoading: false,
      dialogTitle: "报修报损记录",
      equipmentType: null
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
    getOrgData() {
      let $this = this;
      axios.get(this.URLHEAD + "GetDepartmentName").then(res => {
        this.orgTypeArray = res.data.Data.map(o => {
          return o.depname;
        });
      });
    },
    pageHandler(page) {
      this.page = page;
      let params = {
        eqClassify: this.equipmentType,
        keyword: this.keyword,
        eqName: this.orgType,
        pageSize: this.pageSize,
        pageindex: this.page,
        HTTEST: "test"
      };
      this.showLoading = true;
      axios
        .get(this.URLHEAD + "YZT_XFZBJCJ_Details", {
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
      this.equipmentType = val?val:this.equipmentType;
     
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
      this.orgType=""
    },
    closeDialog() {
      this.showDialog = false;
      this.reset()
    }
  },
  created() {
    this.getOrgData();
  }
};
</script>