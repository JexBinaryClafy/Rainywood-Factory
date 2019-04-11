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
      <div class="chart" id="chart-remoter-2"></div>
      <ul class="towerlist">
        <li class="item">
          <div class="title">高频告警隐患类型</div>
          <div class="subtitle fg-red">{{highFrequencyType}}</div>
        </li>
        <li class="item">
          <div class="title">累计总告警量（次）</div>
          <div class="subtitle num fg-orange">{{risenum}}</div>
        </li>
        <li class="item">
          <div class="title">此隐患主要集中地</div>
          <div class="subtitle fg-cyan">{{majorType}}</div>
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
                <input type="date" class="datepicker" :max="timeLimit" v-model="startTime">
              </div>
            </div>
            <div class="form-item">
              <div class="label">结束时间</div>
              <div class="field">
                <input type="date" class="datepicker" :max="timeLimit" v-model="endTime">
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
import dlClass from "@/view/remoter/dl_Class";

export default {
  data() {
    return {
      startTime: this.oneMonthAgo(),
      endTime: this.today(),
      timeLimit: this.today(),
      showSetting: false,
      showLoading: false,
      highFrequencyType: "暂无",
      risenum: "+0%",
      majorType: "暂无",
      chartInstance: null,
      option: null,
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
      let params = {
        startTime: this.startTime + ' 00:00:00',
        endTime: this.endTime +' 23:59:59'
      };
      this.showLoading = true;
      axios
        .get(this.URLHEAD + "getDangerTypeAnalysis", {
          params: params
        })
        .then(res => {
          let data = res.data;
          this.highFrequencyType = data.Data.Name;
          this.risenum = data.Data.Tag;
          this.majorType = data.Data.Value;
          let valData = data.Data.list.map(item => {
            return item.value;
          });
          let xData = data.Data.list.map(item => {
            return item.name;
          });

          this.option = {
            tooltip: {
              show: "true",
              trigger: "item",
              backgroundColor: "rgba(0,0,0,0.7)", // 背景
              padding: [8, 10], //内边距
              extraCssText: "box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);", //添加阴影
              formatter: function(params) {
                if (params.seriesName != "") {
                  return params.name + "问题数 ： " + params.value;
                }
              }
            },
            feature: {
              saveAsImage: true
            },
            grid: {
              borderWidth: 0,
              top: 30,
              bottom: 30,
              left: 0,
              textStyle: {
                color: "#fff"
              },
              containLabel: true
            },
            yAxis: {
              type: "category",
              axisTick: {
                show: false
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: "rgba(255,255,255,0.3)"
                }
              },
              axisLabel: {
                show: true,
                inside: false,
                
                textStyle: {
                  color: "rgba(255,255,255,1)",
                  fontWeight: "normal",
                  fontSize: "12"
                }
              },
              data: xData
            },
            xAxis: {
              type: "value",
              axisTick: {
                show: false
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: "rgba(255,255,255,0.3)"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "rgba(255,255,255,0.3)"
                }
              },
              axisLabel: {
                textStyle: {
                  color: "#fff",
                  fontWeight: "normal",
                  fontSize: "12"
                },
                formatter: "{value}"
              }
            },
            series: [
              {
                name: "隐患数量",
                type: "bar",
                stack: "总量",
                itemStyle: {
                  normal: {
                    show: true,
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                      {
                        offset: 0,
                        color: "#f37f38"
                      },
                      {
                        offset: 1,
                        color: "#b7410d"
                      }
                    ]),
                    borderWidth: 0
                  },
                  emphasis: {
                    shadowBlur: 15,
                    shadowColor: "rgba(105,123, 214, 0.7)"
                  }
                },
                label: {
                  normal: {
                    show: true,
                    color: "#fff",
                    position: "right",
                    formatter:'{c}次'
                  }
                },
                zlevel: 2,
                barWidth: "15",
                data: valData
              }
            ]
          };
          this.chartInstance = this.$Crender("chart-remoter-2", this.option);
          this.chartInstance.on("click", e => {
            let type = e.name;
            $this.keyModal=type
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
            .get(this.URLHEAD + "getDangerTypeAnalysis", {
              params: this.params
            })
            .then(res => {
              let data = res.data;
              this.highFrequencyType = data.Data.Name;
              this.risenum = data.Data.Tag;
              this.majorType = data.Data.Value;
              let valData = data.Data.list.map(item => {
                return item.value;
              });
              let xData = data.Data.list.map(item => {
                return item.name;
              });
              this.option = {
                tooltip: {
                  show: "true",
                  trigger: "item",
                  backgroundColor: "rgba(0,0,0,0.7)", // 背景
                  padding: [8, 10], //内边距
                  extraCssText: "box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);", //添加阴影
                  formatter: function(params) {
                    if (params.seriesName != "") {
                      return params.name + "问题数 ： " + params.value;
                    }
                  }
                },
                feature: {
                  saveAsImage: true
                },
                grid: {
                  borderWidth: 0,
                  top: 30,
                  bottom: 30,
                  left: 0,
                  textStyle: {
                    color: "#fff"
                  },
                  containLabel: true
                },
                yAxis: {
                  type: "category",
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    show: true,
                    lineStyle: {
                      color: "rgba(255,255,255,0.3)"
                    }
                  },
                  axisLabel: {
                    show: true,
                    inside: false,
                    textStyle: {
                      color: "rgba(255,255,255,1)",
                      fontWeight: "normal",
                      fontSize: "12"
                    }
                  },
                  data: xData
                },
                xAxis: {
                  type: "value",
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    show: true,
                    lineStyle: {
                      color: "rgba(255,255,255,0.3)"
                    }
                  },
                  splitLine: {
                    show: true,
                    lineStyle: {
                      color: "rgba(255,255,255,0.3)"
                    }
                  },
                  axisLabel: {
                    textStyle: {
                      color: "#fff",
                      fontWeight: "normal",
                      fontSize: "12"
                    },
                    formatter: "{value}"
                  }
                },
                series: [
                  {
                    name: "隐患数量",
                    type: "bar",
                    stack: "总量",
                    itemStyle: {
                      normal: {
                        show: true,
                        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                          {
                            offset: 0,
                            color: "#f37f38"
                          },
                          {
                            offset: 1,
                            color: "#b7410d"
                          }
                        ]),
                        borderWidth: 0
                      },
                      emphasis: {
                        shadowBlur: 15,
                        shadowColor: "rgba(105,123, 214, 0.7)"
                      }
                    },
                    label: {
                      normal: {
                        show: true,
                        color: "#fff",
                        position: "right"
                      }
                    },
                    zlevel: 2,
                    barWidth: "15",
                    data: valData
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