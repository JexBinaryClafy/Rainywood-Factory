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
      <div class="chart fullsize" id="chart-remoter-1"></div>
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
      <dl-District ref="dialog" :show="showModal" :take="keyModal"></dl-District>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import dlDistrict from "@/view/remoter/dl_District";

export default {
  data() {
    return {
      startTime: this.oneMonthAgo(),
      endTime: this.today(),
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
      timeLimit: this.today(),
      timeMin:this.dateShift(-365)
    };
  },
  props: {
    title: String
  },
  components: {
    "x-loading": Loading,
    "dl-District": dlDistrict
  },
  mounted() {
    this.renderChart();
  },
  computed:{
    hintText(){
      return `显示数据自${this.startTime}起，截止至${this.endTime}`
    }
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
      this.showLoading = true;
      axios
        .get(this.URLHEAD + "getDangerAnalysis", {
          params: this.params
        })
        .then(res => {
          let data = res.data
          this.option = {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              x: "center",
              y: "bottom",
              textStyle: {
                color: "#fff",
                fontSize: 12
              },
              data: data.Data.map(o => {
                return o.name;
              })
            },
            grid: {
              top: 10,
              left: 10,
              right: 10,
              bottom: 10,
              containLabel: true
            },
            color: this.COLORS.reverse(),
            calculable: true,
            series: [
              {
                name: "隐患分布情况",
                type: "pie",
                radius: "65%",
                center: ["50%", "50%"],
                data: data.Data,
                itemStyle: {
                  normal: {
                    shadowBlur: 15,
                    shadowOffsetX: 3,
                    shadowOffsetY: 3,
                    shadowColor: "rgba(0,0,0,0.5)"
                  }
                },
                label: {
                  normal: {
                    show: true,
                    formatter: "{b}\n{c}次",
                    position: "right"
                  }
                },
                labelLine: {
                  length: 5,
                  length2: 15
                }
              }
            ]
          };
          this.chartInstance = this.$Crender("chart-remoter-1", this.option);
          this.chartInstance.on("click", e => {
            let districtName = e.data.name;
            $this.keyModal = districtName;
            $this.$refs.dialog.query(districtName)
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
            .get(this.URLHEAD + "getDangerAnalysis", {
              params: this.params
            })
            .then(res => {
              let data = res.data;
              this.option = {
                tooltip: {
                  trigger: "item",
                  formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                  x: "center",
                  y: "bottom",
                  textStyle: {
                    color: "#fff",
                    fontSize: 12
                  },
                  data: data.Data.map(o => {
                    return o.name;
                  })
                },
                grid: {
                  top: 10,
                  left: 10,
                  right: 10,
                  bottom: 10,
                  containLabel: true
                },
                color: this.COLORS.reverse(),
                calculable: true,
                series: [
                  {
                    name: "隐患分布情况",
                    type: "pie",
                    radius: "65%",
                    center: ["50%", "50%"],
                    data: data.Data,
                    itemStyle: {
                      normal: {
                        shadowBlur: 15,
                        shadowOffsetX: 3,
                        shadowOffsetY: 3,
                        shadowColor: "rgba(0,0,0,0.5)"
                      }
                    },
                    label: {
                      normal: {
                        show: true,
                        formatter: "{b}\n{c}",
                        position: "right"
                      }
                    },
                    labelLine: {
                      length: 5,
                      length2: 5
                    }
                  }
                ]
              };
              this.chartInstance.setOption(this.option);
              this.showLoading = false;
            });
        }, 3500);
      }
    }
  }
};
</script>