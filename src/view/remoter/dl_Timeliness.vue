<template>
  <div class="mask" id="dialog-vm4" v-show="showDialog">
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
            <select class="selector" v-model="dangerType">
              <option value selected>所有隐患类型</option>
              <option v-for="(item,idx) in dangerTypeArray" :key="idx" :value="item">{{item}}</option>
            </select>
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
              <td>隐患内容</td>
              <td>隐患类型</td>
              <td>发生部位</td>
              <td>所在区划</td>
              <td>部位类型</td>
              <td>消防安全负责人</td>
              <td>联系电话</td>
            </tr>
          </thead>
          <tbody v-if="list.length>0">
            <tr v-for="(item,idx) in list" :key="idx">
              <td style="width:5%;">{{idx + 1}}</td>
              <td style="width:10%;">
                <span :title="item.content">{{item.content|| '暂无隐患内容'}}</span>
              </td>
              <td style="width:10%;">
                <span :title="item.dangerType">{{item.dangerType}}</span>
              </td>
              <td style="width:20%;">
                <span :title="item.name">{{item.name}}</span>
              </td>
              <td style="width:20%;">
                <span :title="item.city">{{item.city || '暂无'}}</span>
              </td>
              <td style="width:10%;">
                <span :title="item.pstType">{{item.pstType || '暂无'}}</span>
              </td>
              <td style="width:15%;">
                <span :title="item.person">{{item.person || '暂无'}}</span>
              </td>
              <td style="width:10%;">
                <span :title="item.tel">{{item.tel || '暂无'}}</span>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="8">暂无隐患内容</td>
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
      page: 1,
      pageSize: 10,
      total: 10,
      maxPage: 10,
      district: "",
      showDialog: false,
      showLoading: false,
      dialogTitle: "隐患记录",
      type: "",
      selectTime: this.take
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
        selectTime: this.selectTime
      };
      this.showLoading = true;
      axios
        .get(this.URLHEAD + "getHiddenTrouble", {
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
      this.selectTime = val?val:this.selectTime
      this.showDialog = true;
      this.list = [];
      this.pageHandler(1);
    },
    reset() {
      this.district = "";
      this.keyword = "";
      this.dangerType = "";
      this.pageSize = 10;
      this.page = 1;
    },
    closeDialog() {
      this.reset();
      this.showDialog = false;
    }
  }
};
</script>