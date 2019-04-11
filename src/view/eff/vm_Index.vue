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
      <div class="chart fullsize" id="chart-eff-1"></div>
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
      <dl-Index ref="dialog" :show="showModal" :take="keyModal"></dl-Index>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import Pager from "@/components/Pager";
import dlIndex from "@/view/eff/dl_Index";

export default {
  data() {
    return {
      date: this.dateShift(0),
      timeLimit: this.dateShift(0),
      timeMin:this.dateShift(-365),
      showSetting: false,
      showLoading: false,
      chartInstance: null,
      option: null,
      params: null,
      showModal: false,
      keyModal: null,
      chartData: null,
      autoflip: false,
      ticketfn: null,
    };
  },
  props: {
    title: String
  },
  components: {
    "x-loading": Loading,
    "x-pager": Pager,
    "dl-Index": dlIndex
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
        .get(this.URLHEAD + "ZZJGXN_NEW", {
          params: params
        })
        .then(res => {
          let json = res.data;
          this.option = {
            tooltip: {
              trigger: "axis",
              axisPointer: { type: "shadow" }
            },
            grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
            xAxis: [
              {
                type: "category",
                data: json.Data.list.map(o => {
                  return o.name;
                }),
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: "rgba(255,255,255,0.6)",
                    width: 1,
                    type: "solid"
                  }
                },
                axisTick: { show: false },
                axisLabel: {
                  show: true,
                  textStyle: { color: "rgba(255,255,255,0.6)" }
                }
              }
            ],
            yAxis: [
              {
                type: "value",
                axisLabel: { formatter: "{value}" },
                axisTick: { show: false },
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: "rgba(255,255,255,0.6)",
                    width: 1,
                    type: "solid"
                  }
                },
                splitLine: {
                  lineStyle: { color: "rgba(255,255,255,0.3)" }
                }
              }
            ],
            series: [
              {
                name: "效能指数",
                type: "bar",
                stack: "总量",
                data: json.Data.list,
                barWidth: 15,
                barGap: 1,
                itemStyle: {
                  normal: {
                    barBorderRadius: 30,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "#00feff"
                      },
                      {
                        offset: 0.5,
                        color: "#027eff"
                      },
                      {
                        offset: 1,
                        color: "#0286ff"
                      }
                    ])
                  }
                },
                label: {
                  normal: {
                    show: true,
                    position: "top",
                    color: this.COLORS[0]
                  }
                }
              }
            ]
          };
          this.chartInstance = this.$Crender("chart-eff-1", this.option);
          this.chartInstance.on("click", e => {
            let districtName = e.name;
            $this.keyModal = districtName;
            $this.$refs.dialog.query(districtName);
          });
          this.showLoading = false;
        });
    }
  }
};
</script>