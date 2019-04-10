<template>
  <div class="box">
    <div class="box-header">
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
      <div class="chart fullsize" id="chart-3"></div>

      <div class="chartSetting" v-show="showSetting">
        <div class="form">
          <div class="form-head">
            <div class="title">选择时间范围</div>
          </div>
          <div class="form-body">
            <div class="form-item">
              <div class="label">开始时间</div>
              <div class="field">
                <input type="date" class="datepicker" v-model="startTime" :max="timeLimit">
              </div>
            </div>
            <div class="form-item">
              <div class="label">结束时间</div>
              <div class="field">
                <input type="date" class="datepicker" v-model="endTime" :max="timeLimit">
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
      <dl-Merge ref="dialog" :show="showModal" :take="keyModal"></dl-Merge>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import Pager from "@/components/Pager";
import dlMerge from "@/view/onepic/dl_Merge";

export default {
  data() {
    return {
      startTime: this.oneMonthAgo(),
      endTime: this.today(),
      timeLimit: this.today(),
      showSetting: false,
      showLoading: false,
      chartInstance: null,
      option: null,
      params: null,
      showModal: false,
      keyModal: null,
      autoflip: false,
      ticketFn: null
    };
  },
  props: {
    title: String
  },
  components: {
    "x-loading": Loading,
    "x-pager": Pager,
    "dl-Merge": dlMerge
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
        endTime: this.endTime + " 23:59:59",
        HTTEST: "test"
      };
      this.showLoading = true;
      axios
        .get(this.URLHEAD + "YZT_JJSJ_LXFX", {
          params: params
        })
        .then(res => {
          let data = res.data;
          this.option = {
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            },
            legend: {
              data: ["火灾扑救", "抢险救援", "社会救助", "其他出动"],
              align: "right",
              right: 10,
              textStyle: {
                color: "#fff"
              },
              itemWidth: 10,
              itemHeight: 10,
              itemGap: 35
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            xAxis: [
              {
                type: "category",
                data: data.Data.map(o => {
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
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: "rgba(255,255,255,0.6)"
                  }
                }
              }
            ],
            yAxis: [
              {
                type: "value",
                axisLabel: {
                  formatter: "{value}"
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: "rgba(255,255,255,0.6)",
                    width: 1,
                    type: "solid"
                  }
                },
                splitLine: {
                  lineStyle: {
                    color: "rgba(255,255,255,0.3)"
                  }
                }
              }
            ],
            series: [
              {
                name: "火灾扑救",
                type: "bar",
                stack: "总量",
                data: data.Data.map(o => {
                  return o.val.hzjy_list;
                }),
                barWidth: 10,
                barGap: 1,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: this.COLORS[0]
                      },
                      {
                        offset: 1,
                        color: this.COLORS[1]
                      }
                    ]),
                    opacity: 1
                  }
                },
                label: {
                  normal: {
                    show: true,
                    position: "right",
                    color: this.COLORS[0]
                  }
                }
              },
              {
                name: "抢险救援",
                type: "bar",
                stack: "总量",
                data: data.Data.map(o => {
                  return o.val.qxpj_list;
                }),
                barWidth: 10,
                barGap: 1,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: this.COLORS[2]
                      },
                      {
                        offset: 1,
                        color: this.COLORS[3]
                      }
                    ]),
                    opacity: 1
                  }
                },
                label: {
                  normal: {
                    show: true,
                    position: "right",
                    color: this.COLORS[2]
                  }
                }
              },
              {
                name: "社会救助",
                type: "bar",
                stack: "总量",
                data: data.Data.map(o => {
                  return o.val.shjz_list;
                }),
                barWidth: 10,
                barGap: 1,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: this.COLORS[4]
                      },
                      {
                        offset: 1,
                        color: this.COLORS[5]
                      }
                    ]),
                    opacity: 1
                  }
                },
                label: {
                  normal: {
                    show: true,
                    position: "right",
                    color: this.COLORS[4]
                  }
                }
              },
              {
                name: "其他出动",
                type: "bar",
                stack: "总量",
                data: data.Data.map(o => {
                  return o.val.qtcd_list;
                }),
                barWidth: 10,
                barGap: 1,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: this.COLORS[7]
                      },
                      {
                        offset: 1,
                        color: this.COLORS[9]
                      }
                    ]),
                    opacity: 1
                  }
                },
                label: {
                  normal: {
                    show: true,
                    position: "right",
                    color: this.COLORS[4]
                  }
                }
              }
            ]
          };
          this.chartInstance = this.$Crender("chart-3", this.option);
          this.chartInstance.on("click", e => {
            console.log(e);
            let timeScope = e.name;
            $this.keyModal = timeScope;
            $this.$refs.dialog.query(timeScope);
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
            .get(this.URLHEAD + "YZT_JJSJ_LXFX", {
              params: this.params
            })
            .then(res => {
              let data = res.data;
              this.option = {
                tooltip: {
                  trigger: "axis",
                  axisPointer: {
                    type: "shadow"
                  }
                },
                legend: {
                  data: ["火灾扑救", "抢险救援", "社会救助", "其他出动"],
                  align: "right",
                  right: 10,
                  textStyle: {
                    color: "#fff"
                  },
                  itemWidth: 10,
                  itemHeight: 10,
                  itemGap: 35
                },
                grid: {
                  left: "3%",
                  right: "4%",
                  bottom: "3%",
                  containLabel: true
                },
                xAxis: [
                  {
                    type: "category",
                    data: data.Data.map(o => {
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
                    axisTick: {
                      show: false
                    },
                    axisLabel: {
                      show: true,
                      textStyle: {
                        color: "rgba(255,255,255,0.6)"
                      }
                    }
                  }
                ],
                yAxis: [
                  {
                    type: "value",
                    axisLabel: {
                      formatter: "{value}"
                    },
                    axisTick: {
                      show: false
                    },
                    axisLine: {
                      show: false,
                      lineStyle: {
                        color: "rgba(255,255,255,0.6)",
                        width: 1,
                        type: "solid"
                      }
                    },
                    splitLine: {
                      lineStyle: {
                        color: "rgba(255,255,255,0.3)"
                      }
                    }
                  }
                ],
                series: [
                  {
                    name: "火灾扑救",
                    type: "bar",
                    stack: "总量",
                    data: data.Data.map(o => {
                      return o.val.hzjy_list;
                    }),
                    barWidth: 10,
                    barGap: 1,
                    itemStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          {
                            offset: 0,
                            color: this.COLORS[0]
                          },
                          {
                            offset: 1,
                            color: this.COLORS[1]
                          }
                        ]),
                        opacity: 1
                      }
                    },
                    label: {
                      normal: {
                        show: true,
                        position: "right",
                        color: this.COLORS[0]
                      }
                    }
                  },
                  {
                    name: "抢险救援",
                    type: "bar",
                    stack: "总量",
                    data: data.Data.map(o => {
                      return o.val.qxpj_list;
                    }),
                    barWidth: 10,
                    barGap: 1,
                    itemStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          {
                            offset: 0,
                            color: this.COLORS[2]
                          },
                          {
                            offset: 1,
                            color: this.COLORS[3]
                          }
                        ]),
                        opacity: 1
                      }
                    },
                    label: {
                      normal: {
                        show: true,
                        position: "right",
                        color: this.COLORS[2]
                      }
                    }
                  },
                  {
                    name: "社会救助",
                    type: "bar",
                    stack: "总量",
                    data: res.Data.map(o => {
                      return o.val.shjz_list;
                    }),
                    barWidth: 10,
                    barGap: 1,
                    itemStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          {
                            offset: 0,
                            color: this.COLORS[4]
                          },
                          {
                            offset: 1,
                            color: this.COLORS[5]
                          }
                        ]),
                        opacity: 1
                      }
                    },
                    label: {
                      normal: {
                        show: true,
                        position: "right",
                        color: this.COLORS[4]
                      }
                    }
                  },
                  {
                    name: "其他出动",
                    type: "bar",
                    stack: "总量",
                    data: data.Data.map(o => {
                      return o.val.qtcd_list;
                    }),
                    barWidth: 10,
                    barGap: 1,
                    itemStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          {
                            offset: 0,
                            color: this.COLORS[7]
                          },
                          {
                            offset: 1,
                            color: this.COLORS[9]
                          }
                        ]),
                        opacity: 1
                      }
                    },
                    label: {
                      normal: {
                        show: true,
                        position: "right",
                        color: this.COLORS[4]
                      }
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
<style scoped>
</style>
