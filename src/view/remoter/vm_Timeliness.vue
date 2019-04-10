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
      <div class="chart" id="chart-remoter-4"></div>
      <ul class="towerlist">
        <li class="item">
          <div class="title">隐患高峰时间</div>
          <div class="subtitle num fg-white">{{peakDate}}</div>
        </li>
        <li class="item">
          <div class="title">当日火灾接警</div>
          <div class="subtitle num fg-red">{{disasterThatDay}}</div>
        </li>
        <li class="item">
          <div class="title">隐患爆发地区</div>
          <div class="subtitle fg-white">{{peakDistrict}}</div>
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
      <dl-Timeliness ref="dialog" :show="showModal" :take="keyModal"></dl-Timeliness>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import dlTimeliness from "@/view/remoter/dl_Timeliness";

export default {
  data() {
    return {
      startTime: this.oneMonthAgo(),
      endTime: this.today(),
      timeLimit: this.today(),
      showSetting: false,
      showLoading: false,
      peakDate: "暂无",
      disasterThatDay: 0,
      peakDistrict: "暂无",
      chartInstance: null,
      option: null,
      showModal: false,
      keyModal: null
    };
  },
  props: {
    title: String
  },
  components: {
    "x-loading": Loading,
    "dl-Timeliness": dlTimeliness
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
        .get(this.URLHEAD + "getDangerTimeSpread", {
          params: params
        })
        .then(res => {
          let data = res.data;
          this.peakDate = data.Data.peakDate;
          this.disasterThatDay = data.Data.disasterThatDay;
          this.peakDistrict = data.Data.peakDistrict.split("-")[2];
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
              left: 10,
              right: 10,
              bottom: 10,
              top: 10,
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
                data: data.Data.list.map(item => {
                  return item.name;
                })
              }
            ],
            yAxis: [
              {
                type: "value",
                name: "火灾隐患（个）",
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
                name: "火灾隐患",
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
                data: data.Data.list.map(item => {
                  return item.value;
                })
              }
            ]
          };
          this.chartInstance=this.$Crender('chart-remoter-4',this.option)
          this.chartInstance.on("click", e => {
            let selectTime = e.name;
            
            $this.keyModal=selectTime
            $this.$refs.dialog.query(selectTime)
          });
          this.showLoading = false;
        });
    }
  }
};
</script>