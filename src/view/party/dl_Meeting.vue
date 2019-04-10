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
        <table class="dtable">
          <thead>
            <tr>
              <td>序号</td>
              <td>会议标题</td>
              <td>会议地点</td>
              <td>会议时间</td>
              <td>应到人数</td>
              <td>实到人数</td>
            </tr>
          </thead>
          <tbody v-if="list.length>0">
            <tr v-for="(item,idx) in list" :key="idx">
              <td style="width:5%;">{{idx + 1}}</td>
              <td style="width:30%;">
                <div :title="item.meetingTitle">{{item.meetingTitle}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.meetingPlace">{{item.meetingPlace}}</div>
              </td>
              <td style="width:20%;">
                <div :title="item.meetingTime">{{item.meetingTime}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.personnel">{{item.personnel}}</div>
              </td>
              <td style="width:15%;">
                <div :title="item.actualPersonnel">{{item.actualPersonnel}}</div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6">暂无信息</td>
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
      date: this.take,
      dialogTitle: "党委会记录清单"
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
        indexDate: this.date,
        pageSize: this.pageSize,
        pageIndex: this.page
      };
      this.showLoading = true;
      axios.get(this.URLHEAD + "ZDDWHQKFX_TC", { params: params }).then(res => {
        let data = res.data;
        this.list = data.Data.list;
        this.total = data.Data.count;
        this.showLoading = false;
      });
    },
    query(n) {
      this.level = n?n:this.level;
      this.showDialog = true;
      this.list = [];
      this.pageHandler(1);
    },
    reset() {
      this.pageSize = 10;
      this.page = 1;
    },
    closeDialog() {
      this.showDialog = false;
      this.reset();
    }
  }
};
</script>