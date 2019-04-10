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
      <div class="chart fullsize" id="chart-4"></div>
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
      <dl-Accept ref="dialog" :show="showModal" :take="keyModal"></dl-Accept>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import Pager from "@/components/Pager";
import dlAccept from "@/view/onepic/dl_Accept";

export default {
  data() {
    return {
      startTime: this.oneMonthAgo(),
      endTime: this.today(),
      timeLimit: this.today(),
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
      ticketfn: null
    };
  },
  props: {
    title: String
  },
  components: {
    "x-loading": Loading,
    "x-pager": Pager,
    "dl-Accept": dlAccept
  },
  computed:{
    hintText(){
      return `显示数据自${this.startTime}起，截止至${this.endTime}`
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
        startTime: this.startTime + " 00:00:00",
        endTime: this.endTime + " 23:59:59"
      };
      this.showLoading = true;
      axios
        .get(this.URLHEAD + "YZT_JCJSDFX", {
          params: params
        })
        .then(res => {
          let data = res.data;
          let min = 0;
          this.option = {
            color: ["#3398DB"],
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "line",
                lineStyle: {
                  opacity: 0
                }
              },
              formatter: "{b}接警：{c}次"
            },
            grid: {
              left: "3%",
              right: "3%",
              bottom: "7%",
              top: "7%",
              containLabel: true,
              z: 22
            },
            xAxis: [
              {
                type: "category",
                gridIndex: 0,
                axisTick: {
                  alignWithLabel: true
                },
                axisLine: {
                  lineStyle: {
                    color: "rgba(255,255,255,0.7)"
                  }
                },
                axisLabel: {
                  show: true,
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 12,
                  rotate: 45,
                  interval: 0
                },
                data: data.Data.list.map(o => {
                  return o.name;
                })
              }
            ],
            yAxis: [
              {
                type: "value",
                gridIndex: 0,
                splitLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    color: "rgba(255,255,255,0.7)"
                  }
                },
                axisLabel: {
                  color: "rgba(255,255,255,0.7)",
                  formatter: "{value}次"
                }
              },
              {
                type: "value",
                gridIndex: 0,
                splitNumber: 12,
                splitLine: {
                  show: false
                },
                axisLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: false
                },
                splitArea: {
                  show: true,
                  areaStyle: {
                    color: ["rgba(250,250,250,0.0)", "rgba(250,250,250,0.05)"]
                  }
                }
              }
            ],
            series: [
              {
                name: "时间差",
                type: "bar",
                barWidth: "30%",
                xAxisIndex: 0,
                yAxisIndex: 0,
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
                    color: "#fff"
                  }
                },
                data: data.Data.list.map(o => {
                  return o.value;
                }),
                zlevel: 11
              },
              {
                name: "背景",
                type: "bar",
                barWidth: "50%",
                xAxisIndex: 0,
                yAxisIndex: 1,
                barGap: "-135%",
                data: data.Data.list.map(o => {
                  return 50;
                }),
                itemStyle: {
                  normal: {
                    color: "rgba(255,255,255,0.1)"
                  }
                },
                zlevel: 9
              }
            ]
          };
          this.chartInstance = this.$Crender("chart-4", this.option);
          this.chartInstance.on("click", e => {
            let teamName = e.name;
            $this.keyModal = teamName;
            $this.$refs.dialog.query(teamName)
          });
          $this.showLoading = false;
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
            .get(this.URLHEAD + "YZT_JCJSDFX", {
              params: this.params
            })
            .then(res => {
              let data = res.data;
              this.option = {
                color: ["#3398DB"],
                tooltip: {
                  trigger: "axis",
                  axisPointer: {
                    type: "line",
                    lineStyle: {
                      opacity: 0
                    }
                  },
                  formatter: "{b}接警：{c}次"
                },
                grid: {
                  left: "5%",
                  right: "0%",
                  bottom: "20%",
                  top: "7%",
                  containLabel: true,
                  z: 22
                },
                xAxis: [
                  {
                    type: "category",
                    gridIndex: 0,
                    axisTick: {
                      alignWithLabel: true
                    },
                    axisLine: {
                      lineStyle: {
                        color: "rgba(255,255,255,0.7)"
                      }
                    },
                    axisLabel: {
                      show: true,
                      color: "rgba(255,255,255,0.7)",
                      fontSize: 12,
                      rotate: 45,
                      interval: 0
                    },
                    data: data.Data.list.map(o => {
                      return o.name;
                    })
                  }
                ],
                yAxis: [
                  {
                    type: "value",
                    gridIndex: 0,
                    splitLine: {
                      show: false
                    },
                    axisTick: {
                      show: false
                    },
                    axisLine: {
                      lineStyle: {
                        color: "rgba(255,255,255,0.7)"
                      }
                    },
                    axisLabel: {
                      color: "rgba(255,255,255,0.7)",
                      formatter: "{value}次"
                    }
                  },
                  {
                    type: "value",
                    gridIndex: 0,
                    splitNumber: 12,
                    splitLine: {
                      show: false
                    },
                    axisLine: {
                      show: false
                    },
                    axisTick: {
                      show: false
                    },
                    axisLabel: {
                      show: false
                    },
                    splitArea: {
                      show: true,
                      areaStyle: {
                        color: [
                          "rgba(250,250,250,0.0)",
                          "rgba(250,250,250,0.05)"
                        ]
                      }
                    }
                  }
                ],
                series: [
                  {
                    name: "时间差",
                    type: "bar",
                    barWidth: "30%",
                    xAxisIndex: 0,
                    yAxisIndex: 0,
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
                        color: "#fff"
                      }
                    },
                    data: data.Data.list.map(o => {
                      return o.value;
                    }),
                    zlevel: 11
                  },
                  {
                    name: "背景",
                    type: "bar",
                    barWidth: "50%",
                    xAxisIndex: 0,
                    yAxisIndex: 1,
                    barGap: "-135%",
                    data: data.Data.list.map(o => {
                      return 50;
                    }),
                    itemStyle: {
                      normal: {
                        color: "rgba(255,255,255,0.1)"
                      }
                    },
                    zlevel: 9
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
<style scoped>
</style>
