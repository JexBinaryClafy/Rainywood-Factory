<template>
  <div class="box" id="vm6">
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
      <div class="chart fullsize" id="chart-party-6"></div>
      <div class="chartSetting" v-show="showSetting">
        <div class="form">
          <div class="form-head">
            <div class="title">选择时间范围</div>
          </div>
          <div class="form-body">
            <div class="form-item">
              <div class="label">开始时间</div>
              <div class="field">
                <input
                  type="date"
                  class="datepicker"
                  id="startTime"
                  :max="timeLimit"
                  :min="timeMin"
                  v-model="startTime"
                >
              </div>
            </div>
            <div class="form-item">
              <div class="label">结束时间</div>
              <div class="field">
                <input
                  type="date"
                  class="datepicker"
                  id="endTime"
                  :max="timeLimit"
                  :min="timeMin"
                  v-model="endTime"
                >
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
      <dl-Meeting ref="dialog" :show="showModal" :take="keyModal"></dl-Meeting>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import dlMeeting from "@/view/party/dl_Meeting";

export default {
  data() {
    return {
      timeLimit: this.dateShift(0),
      timeMin:this.dateShift(-365),
      startTime: this.dateShift(-30),
      endTime: this.dateShift(0),
      showSetting: false,
      showLoading: false,
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
    "dl-Meeting": dlMeeting
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    showSettingWindow() {
      //打开设置窗口
      this.showSetting = true;
    },
    cancelSetting() {
      //关闭设置窗口
      this.showSetting = false;
    },
    saveSetting() {
      //保持关闭窗口
      this.renderChart();
      this.showSetting = false;
    },
    renderChart() {
      let $this = this;
      let params = {
        startTime: this.startTime + " 00:00:00",
        endTime: this.endTime + " 23:59:59"
      };
      this.showLoading=true
      axios
        .get(this.URLHEAD + "ZDDWHQKFX", {
          params: params
        })
        .then(res => {
          let data = res.data;
          this.option = {
            tooltip: {
              trigger: "axis",
              axisPointer: {
                lineStyle: {
                  color: "#57617B"
                }
              }
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
                boundaryGap: false,
                axisLine: {
                  lineStyle: {
                    color: "rgba(255,255,255,0.5)"
                  }
                },
                data: data.Data.map(item => {
                  return item.name;
                })
              }
            ],
            yAxis: [
              {
                type: "value",
                name: "党委会议题",
                axisTick: {
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    color: "rgba(255,255,255,0.3)"
                  }
                },
                axisLabel: {
                  margin: 10,
                  textStyle: {
                    fontSize: 14,
                    color: "rgba(255,255,255,0.3)"
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
                name: "党委会议题",
                type: "line",
                smooth: true,
                symbol: "circle",
                symbolSize: 5,
                showSymbol: true,
                lineStyle: {
                  normal: {
                    width: 3
                  }
                },
                label: {
                  normal: {
                    show: true,
                    position: "top",
                    color: "rgba(255,255,255,1)"
                  }
                },
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: "rgba(205,52,42, 0.5)"
                        },
                        {
                          offset: 0.8,
                          color: "rgba(235,235,21, 0)"
                        }
                      ],
                      false
                    ),
                    shadowColor: "rgba(0, 0, 0, 0.1)",
                    shadowBlur: 10
                  }
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                      {
                        offset: 0,
                        color: "rgba(205,52,42,1)"
                      },
                      {
                        offset: 1,
                        color: "rgba(235,235,21,1)"
                      }
                    ])
                  },
                  emphasis: {
                    color: "rgb(99,250,235)",
                    borderColor: "rgba(99,250,235,0.2)",
                    extraCssText: "box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);",
                    borderWidth: 10
                  }
                },
                data: data.Data.map(item => {
                  return item.value;
                })
              }
            ]
          };
          this.chartInstance = this.$Crender('chart-party-6',this.option)
          this.chartInstance.on("click", e => {
            console.log(e);
            let type = e.name;
            $this.keyModal=type
            $this.$refs.dialog.query(type)
          });
          this.showLoading = false;
        });
    }
  }
};
</script>