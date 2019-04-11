<template>
  <div class="box" id="vm5">
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
      <div class="chart" id="chart-remoter-5"></div>
      <ul class="towerlist">
        <li class="item">
          <div class="title">巡查率最低</div>
          <div class="subtitle num fg-red" style="font-size:22px;">{{lowestCheckRate}}</div>
        </li>
        <li class="item">
          <div class="title">巡查率最低当日告警</div>
          <div class="subtitle num fg-orange">{{dangerThatDay}}次</div>
        </li>
        <li class="item">
          <div class="title">巡查率最低当日接警</div>
          <div class="subtitle num fg-cyan">{{disasterThatDay}}次</div>
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
                <input type="date" class="datepicker" :max="timeLimit" :min="timeMin" v-model="startTime">
              </div>
            </div>
            <div class="form-item">
              <div class="label">结束时间</div>
              <div class="field">
                <input type="date" class="datepicker" :max="timeLimit" :min="timeMin" v-model="endTime">
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
      <dl-Patrol ref="dialog" :show="showModal" :take="keyModal"></dl-Patrol>
      <dl-Problems ref="dialog_problems" :show="showModal_problems" :take="keyModal_problems"></dl-Problems>
    
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import dlPatrol from "@/view/remoter/dl_Patrol";
import dlProblems from '@/view/remoter/dl_Problems'

export default {
  data() {
    return {
      startTime: this.dateShift(-7),
      endTime: this.today(),
      timeLimit: this.dateShift(0),
      timeMin:this.dateShift(-365),
      showSetting: false,
      showLoading: false,
      lowestCheckRate: "暂无",
      dangerThatDay: 0,
      disasterThatDay: 0,
      chartInstance: null,
      option: null,
      showModal: false,
      keyModal: null,
      showModal_problems:false,
      keyModal_problems:null
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
    "dl-Patrol": dlPatrol,
    'dl-Problems':dlProblems
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
        .get(this.URLHEAD + "getDangerPatrolSpread", {
          params: params
        })
        .then(res => {
          let data = res.data;
          this.lowestCheckRate = data.Data.lowestCheckRate;
          this.dangerThatDay = data.Data.dangerThatDay;
          this.disasterThatDay = data.Data.disasterThatDay;
          this.option = {
            tooltip: {
              trigger: "item",
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
            legend: {
              top: "top",
              left: "left",
              data: ["巡查次数", "隐患数量"],
              textStyle: {
                color: "#fff",
                fontSize: 12
              }
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
                  return item.time;
                })
              }
            ],
            yAxis: [
              {
                type: "value",
                name: "巡查次数",
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
                  },
                  formatter:'{value}次'
                },
                splitLine: {
                  lineStyle: {
                    color: "rgba(255,255,255,0.3)"
                  }
                }
              },
              {
                type: "value",
                name: "隐患告警",
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
                  },
                  formatter:'{value}次'
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
                name: "巡查次数",
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
                  return item.xcs;
                })
              },
              {
                name: "隐患数量",
                type: "line",
                stack: "总量",
                itemStyle: {
                  normal: {
                    show: true,
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
                    borderWidth: 0
                  },
                  emphasis: {
                    shadowBlur: 15,
                    shadowColor: "rgba(105,123, 214, 0.7)"
                  }
                },
                label: {
                  show: true,
                  color: "#fff",
                  position: "inside"
                },
                zlevel: 2,
                barBorderRadius: 5,
                data: data.Data.list.map(item => {
                  return item.yhs;
                }),
                yAxisIndex: 1
              }
            ]
          };
          this.chartInstance=this.$Crender('chart-remoter-5',this.option)
          
          this.chartInstance.on("click", e => {
            console.log(e);
            let selectTime = e.name;
            switch(e.seriesName){
              case '巡查次数':
              $this.keyModal=selectTime
              $this.$refs.dialog.query(selectTime)
              break;
              case '隐患数量':
              $this.keyModal_problems=selectTime
              $this.$refs.dialog_problems.query(selectTime)
              break;
            }
          });
          this.showLoading = false;
        });
    }
  }
};
</script>