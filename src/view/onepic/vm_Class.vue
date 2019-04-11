<template>
  <div class="box" id="vm2">
    <div class="box-header" :title="hintText">
      <span class="title pos-left">{{title}}</span>
      <ul class="tools pos-right">
        <li class="item">
          <button class="btn" type="button" @click="showSettingWindow">
            <i class="icon icon-setting"></i>
          </button>
        </li>
      </ul>
    </div>
    <div class="box-body">
      <div class="chart" id="chart-2"></div>
      <ul class="towerlist" v-cloak>
        <li class="item">
          <div class="title">高频警情类型</div>
          <div class="subtitle fg-red">{{highFrequencyPlace}}</div>
        </li>
        <li class="item">
          <div class="title">环比上月增长</div>
          <div class="subtitle num fg-orange">{{momIncrease}}<small>%</small></div>
        </li>
        <li class="item">
          <div class="title">上升明显类型</div>
          <div class="subtitle fg-white">{{mainRisePlace}}</div>
        </li>
      </ul>
      <div class="chartSetting" v-show="showSetting">
        <div class="form">
          <div class="form-head">
            <div class="title">选择时间范围</div>
          </div>
          <div class="form-body">
            <div class="form-item">
              <div class="label">开始时间</div>
              <div class="field">
                <input type="date" class="datepicker" v-model="startTime" :max="timeLimit" :min="timeMin">
              </div>
            </div>
            <div class="form-item">
              <div class="label">结束时间</div>
              <div class="field">
                <input type="date" class="datepicker" v-model="endTime" :max="timeLimit" :min="timeMin">
              </div>
            </div>
          </div>
          <div class="form-foot">
            <button type="button" @click="saveSetting" class="btn bg-green">
              <span class="text">确定</span>
            </button>
            <button type="button" @click="cancelSetting" class="btn bg-green">
              <span class="text">关闭</span>
            </button>
          </div>
        </div>
      </div>
      <x-loading :show="showLoading"></x-loading>
      <dl-Class ref="dialog" :show="showModal" :take="keyModal"></dl-Class>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import Pager from "@/components/Pager";
import dlClass from "@/view/onepic/dl_Category";

export default {
  data() {
    return {
      startTime: this.oneMonthAgo(),
      endTime: this.today(),
      showSetting: false,
      showLoading: false,
      highFrequencyPlace: "暂无",
      momIncrease: 0,
      mainRisePlace: "暂无",
      chartInstance: null,
      option: null,
      params: null,
      showModal: false,
      keyModal: null,
      autoflip: false,
      ticketFn: null,
      timeLimit: this.today(),
      timeMin:this.dateShift(-365)
    };
  },
  props: {
    title: String
  },
  computed:{
    hintText(){
      return `显示数据自${this.startTime}起，截止至${this.endTime}`
    }
  },
  components: {
    "x-loading": Loading,
    "x-pager": Pager,
    "dl-Class": dlClass
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    showSettingWindow() {
      this.showSetting = true;
    },
    cancelSetting() {
      this.showSetting = false;
    },
    saveSetting() {
      this.renderChart();
      this.showSetting = false;
    },
    renderChart() {
      let $this = this;
      this.params = {
        startTime: this.startTime + " 00:00:00",
        endTime: this.endTime + " 23:59:59"
      };
      this.showLoading =true
      axios.get(this.URLHEAD + "YZT_ZQDDJGFX", { params: this.params }).then(res => {
        let data = res.data;
        this.highFrequencyPlace = data.Data.Name;
        this.momIncrease = data.Data.Tag;
        this.mainRisePlace = data.Data.Value;
        this.option = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c}起 ({d}%)"
          },
          grid: {
            top: 10,
            left: 10,
            right: 10,
            bottom: 10,
            containLabel: true
          },
          color: [
            "#a552bd",
            "#653c97",
            "#4d3c97",
            "#3c4e97",
            "#405b9a",
            "#44699a",
            "#4b889c",
            "#509f9e",
            "#58bba1",
            "#52cd98",
            "#63e7a5"
          ],
          calculable: true,
          series: [
            {
              name: "产生灾情",
              type: "pie",
              radius: ["55%", "85%"],
              center: ["50%", "50%"],
              roseType: "area",
              data: data.Data.list,
              itemStyle: {
                normal: {
                  shadowBlur: 23,
                  shadowOffsetX: 0,
                  shadowOffsetY: 2,
                  shadowColor: "rgba(0,0,0,0.2)"
                }
              },
              label: {
                normal: {
                  show: true,
                  formatter: "{main|{b}}：\n{num|{c}}{sub|起}",
                  position: "right",
                  rich: {
                    main: {
                      fontSize: 12
                    },
                    num: {
                      fontSize: 28
                    },
                    sub:{
                      fontSize:12
                    }
                  }
                }
              },
              labelLine: {
                length: 5,
                length2: 5
              }
            }
          ]
        };
        this.chartInstance = this.$Crender("chart-2", this.option);
        this.chartInstance.on("click", e => {
          let type = e.data.name;
          $this.keyModal = type;
          $this.$refs.dialog.query(type)
        });
        this.showLoading = false;
        if (this.autoflip) {
          this.autoRefresh();
        }
      });
    },
    autoRefresh() {
      if (this.ticketfn) {
        clearInterval(this.ticketfn);
      } else {
        this.ticketfn = setInterval(() => {
          this.showLoading = true;
          axios
            .get(this.URLHEAD + "YZT_ZQDDJGFX", {
              params: this.params
            })
            .then(res => {
              let data = res.data;
              this.option.series[0].data = data.Data.list;
              this.chartInstance.setOption(this.option);
              this.showLoading = false;
            });
        }, 3500);
      }
    }
  }
};
</script>
<style scoped>
</style>
