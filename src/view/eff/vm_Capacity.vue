<template>
  <div class="box">
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
      <div class="chart" id="chart-eff-2"></div>
      <ul class="towerlist">
        <li class="item">
          <div class="title">占比最高层级</div>
          <div class="subtitle num fg-white">{{maxName}}</div>
        </li>
        <li class="item">
          <div class="title">最高层级占比</div>
          <div class="subtitle num fg-red">
            {{maxZB}}
            <small>%</small>
          </div>
        </li>
      </ul>
      <div class="chartSetting" v-show="showSetting">
        <div class="form">
          <div class="form-head">
            <div class="title">选择要查看的日期</div>
          </div>
          <div class="form-body">
            <div class="form-item">
              <div class="label">日期</div>
              <div class="field">
                <input type="date" class="datepicker" :max="timeLimit" :min="timeMin" v-model="date">
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
      <dl-Capacity ref="dialog" :show="showModal" :take="keyModal"></dl-Capacity>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import Pager from "@/components/Pager";
import dlCapacity from "@/view/eff/dl_Capacity";

export default {
  data() {
    return {
      date: this.dateShift(0),
      timeLimit: this.dateShift(0),
      timeMin:this.dateShift(-365),
      showSetting: false,
      showLoading: false,
      maxName: "暂无",
      maxZB: 0,
      average: 0,
      chartData: null,
      chartInstance: null,
      option: null,
      params: null,
      showModal: false,
      keyModal: null
    };
  },
  props: {
    title: String
  },
  components: {
    "x-loading": Loading,
    "x-pager": Pager,
    "dl-Capacity": dlCapacity
  },
  computed:{
    hintText(){
      return `显示的是${this.date.split('-')[0]}年${this.date.split('-')[1]}月的数据`
    }
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    getAverage(level) {
      let result = null;
      switch (level) {
        case "0-20分":
          result = "差";
          break;
        case "20-40分":
          result = "较差";
          break;
        case "40-60分":
          result = "中等";
          break;
        case "60-80分":
          result = "良好";
          break;
        case "80-100分":
          result = "优秀";
          break;
        default:
          result = "中等";
          break;
      }
      return result
    },
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
      let params = {
        indexDate: this.date
      };
      this.showLoading = true;
      axios
        .get(this.URLHEAD + "XN_YWNL", {
          params: params
        })
        .then(res => {
          let data = res.data;
          this.maxName = data.Data.maxName;
          this.maxZB = data.Data.maxZB;
          this.average = this.getAverage(this.maxName);
          let xData = data.Data.list.map(spe=> {
            return spe;
          });
          this.option = {
            color: this.COLORS,
            series: [
              {
                name: "漏斗图",
                type: "funnel",
                x: "10%",
                y: 60,
                y2: 60,
                width: "80%",
                min: 0,
                max: 100,
                minSize: "0%",
                maxSize: "100%",
                sort: "ascending",
                gap: 0,
                data: [],
                roseType: true,
                label: {
                  normal: {}
                },
                itemStyle: {
                  normal: {
                    borderWidth: 0,
                    shadowBlur: 30,
                    shadowOffsetX: 0,
                    shadowOffsetY: 10,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              }
            ]
          };
          for (var i = 0; i < xData.length; i++) {
            this.option.series[0].data.push({
              name: xData[i].name,
              value: 20 * i,
              Dvalue: xData[i].value
            });
          }
          this.option.series[0].label.normal = {
            formatter: function(params) {
              return params.data.name + " " + params.data.Dvalue;
            },
            position: "center"
          };
          this.chartInstance = this.$Crender("chart-eff-2", this.option);
          this.chartInstance.on("click", e => {
            let type = e.data.name;
            $this.keyModal = type;
            $this.$refs.dialog.query(type);
          });
          this.showLoading = false;
        });
    }
  }
};
</script>