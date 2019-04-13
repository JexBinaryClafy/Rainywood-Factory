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
      <div style="height:417px" class="chart" id="chart-eff-4"></div>
      <div class="chartSetting" v-show="showSetting">
        <div class="form">
          <div class="form-head">
            <div class="title">选择日期范围</div>
          </div>
          <div class="form-body">
            <div class="form-item">
              <div class="label">开始日期</div>
              <div class="field">
                <input type="date" class="datepicker" 
                v-model="startTime" :max="timeLimit" :min="timeMin">
              </div>
            </div>
            <div class="form-item">
              <div class="label">结束日期</div>
              <div class="field">
                <input type="date" class="datepicker" 
                v-model="endTime" :max="timeLimit" :min="timeMin">
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
      <dl-Pressure ref="dialog" :show="showModal" :take="keyModal"></dl-Pressure>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import Pager from "@/components/Pager";
import dlPressure from "@/view/eff/dl_Pressure";

export default {
  data() {
    return {
      startTime:this.dateShift(-365),
      endTime: this.dateShift(0),
      timeLimit: this.dateShift(0),
      timeMin:this.dateShift(-365),
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
  computed:{
    hintText(){
      return `显示数据自${this.startTime}起，截止至${this.endTime}`
    }
  },
  components: {
    "x-loading": Loading,
    "x-pager": Pager,
    "dl-Pressure": dlPressure
  },
  mounted() {
    this.renderChart()
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
        startTime:this.startTime + ' 00:00:00',
          endTime:this.endTime + ' 23:59:59'
      };
      this.showLoading=true
      axios.get(this.URLHEAD+'XN_GZYL',{
          params:params
      }).then(res=>{
          let json = res.data
          let TData = json.Data.groupList
          let yData = json.Data.list.map(spe=>{
            return spe;
          })
          let xData = json.Data.list[0].map(o=>{
            return o.name;
          })
          let color = [
            "#1a9bfc",
            "#99da69",
            "#e32f46",
            "#7049f0",
            "#fa704d",
            "#01babc",
            "#37a2da",
            "#32c5e9",
            "#67e0e3",
            "#9fe6b8",
            "#ffdb5c",
            "#ff9f7f",
            "#e062ae",
            "#e690d1",
            "#e7bcf3",
            "#9d96f5",
            "#8378ea",
            "#96bfff"
          ];
          let name = TData;
          let data = yData;

          let series = [];
          for (var i = 0; i < yData.length; i++) {
            series.push({
              name: name[i],
              type: "line",
              symbolSize: 3,
              symbol: "circle",
              smooth: true,
              showSymbol: false,
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
                        color: color[i]
                      },
                      {
                        offset: 0.8,
                        color: "rgba(255,255,255,0)"
                      }
                    ],
                    false
                  ),
                  shadowBlur: 10,
                  opacity: 0.3
                }
              },
              itemStyle: {
                normal: {
                  color: color[i],
                  lineStyle: {
                    width: 1,
                    type: "solid" //'dotted'虚线 'solid'实线
                  },
                  borderColor: color[i], //图形的描边颜色。支持的格式同 color
                  borderWidth: 8, //描边线宽。为 0 时无描边。[ default: 0 ]
                  barBorderRadius: 0,
                  label: {
                    show: false
                  },
                  opacity: 0.5
                }
              },
              data: data[i]
            });
          }
          this.option = {
            legend: {
              top: 20,
              itemGap: 5,
              itemWidth: 5,
              textStyle: {
                color: "#fff",
                fontSize: "10"
              },
              data: name
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "line", // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {
                  color: "#57617B"
                }
              },
              backgroundColor: "rgba(0,0,0,0.7)", // 背景
              padding: [8, 10], //内边距
              extraCssText: "box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);" //添加阴影
            },
            grid: {
              borderWidth: 0,
              top: 90,
              bottom: 15,
              left: 40,
              right: 40,
              containLabel: true,
              textStyle: {
                color: "#fff"
              }
            },
            xAxis: [
              {
                type: "category",
                axisLine: {
                  lineStyle: {
                    color: "rgba(255,255,255,0.7)"
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: "rgba(255,255,255,0.4)"
                  }
                },
                boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样
                axisTick: {
                  show: false
                },
                splitArea: {
                  show: false
                },
                axisLabel: {
                  inside: false,
                  textStyle: {
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: "normal",
                    fontSize: "12"
                  }
                },
                data: xData
              }
            ],
            yAxis: {
              type: "value",
              axisTick: {
                show: false
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: "rgba(255,255,255,0.7)"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "rgba(255,255,255,0.4) "
                }
              },
              axisLabel: {
                textStyle: {
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: "normal",
                  fontSize: "12"
                },
                formatter: "{value}"
              }
            },
            series: series
          };

          this.chartInstance = this.$Crender('chart-eff-4',this.option);
          
          this.chartInstance.on("click", e => {
            debugger
            let districtName = e.seriesName;
            $this.keyModal = districtName+'在'+e.name;
            $this.$refs.dialog.query({
              dep:e.seriesName,
              date:e.name
            });
          });
          this.showLoading = false;
      })
    }
  }
};
</script>