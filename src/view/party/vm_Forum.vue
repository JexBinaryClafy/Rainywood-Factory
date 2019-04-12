<template>
  <div class="box" id="vm5">
    <div class="box-header">
      <span class="title pos-left">文化建设论坛活跃情况分析</span>
    </div>
    <div class="box-body">
      <div class="chart fullsize" id="chart-party-5"></div>
      <x-loading :show="showLoading"></x-loading>
      <dl-Forum ref="dialog" :show="showModal" :take="keyModal"></dl-Forum>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import dlForum from "@/view/party/dl_Forum";

export default {
  data() {
    return {
      showSetting: false,
      showLoading: false,
      chartInstance: null,
      option: null,
      params: null,
      showModal: false,
      keyModal: null,
      startTime:this.dateShift(-3650),
      endTime:this.dateShift(0)
    };
  },
  props: {
    title: String
  },
  components: {
    "x-loading": Loading,
    "dl-Forum": dlForum
  },
  mounted() {
      this.renderChart()
  },
  methods: {
    renderChart() {
      let $this = this;
      let params = {
        startTime:this.startTime + ' 00:00:00',
          endTime:this.endTime + '23:59:59'
      }
      this.showLoading=true
      axios.get(this.URLHEAD + "WHJSLTHY",{
        params:params
      }).then(res => {
        let data = res.data;
        this.option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
              label: {
                backgroundColor: "#6a7985"
              }
            },
            textStyle: {
              color: "#fff",
              fontStyle: "normal",
              fontFamily: "微软雅黑",
              fontSize: 12
            }
          },
          grid: {
            left: "1%",
            right: "4%",
            bottom: "4%",
            top: 30,
            padding: "0 0 10 0",
            containLabel: true
          },
          legend: {
            right: 10,
            top: 0,
            itemGap: 16,
            itemWidth: 18,
            itemHeight: 10,
            data: [
              {
                name: "帖子数"
              },
              {
                name: "热度指数"
              }
            ],
            textStyle: {
              color: "#a8aab0",
              fontStyle: "normal",
              fontFamily: "微软雅黑",
              fontSize: 12
            }
          },
          xAxis: [
            {
              type: "category",
              boundaryGap: true,
              data: data.Data.map(item => {
                return item.name;
              }),
              axisLabel: {
                interval: 0,
                margin: 15,
                rotate:45,
                textStyle: {
                  color: "#078ceb",
                  fontStyle: "normal",
                  fontFamily: "微软雅黑",
                  fontSize: 12
                }
              },
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: "#fff",
                  opacity: 0.2
                }
              },
              splitLine: {
                show: false
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              splitNumber: 5,
              axisLabel: {
                textStyle: {
                  color: "#a8aab0",
                  fontStyle: "normal",
                  fontFamily: "微软雅黑",
                  fontSize: 12
                },
                rotate:45
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: ["#fff"],
                  opacity: 0.06
                }
              }
            }
          ],
          series: [
            {
              name: "帖子数",
              type: "bar",
              data: data.Data.map(item => {
                return item.value1;
              }),
              barWidth: 10,
              barGap: 0,
              label: {
                normal: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "#a8aab0",
                    fontStyle: "normal",
                    fontFamily: "微软雅黑",
                    fontSize: 12
                  }
                }
              },
              itemStyle: {
                normal: {
                  barBorderRadius: [5, 5, 0, 0],
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 1,
                        color: "rgba(127, 128, 225, 0.7)"
                      },
                      {
                        offset: 0.9,
                        color: "rgba(72, 73, 181, 0.7)"
                      },
                      {
                        offset: 0.31,
                        color: "rgba(0, 208, 208, 0.7)"
                      },
                      {
                        offset: 0.15,
                        color: "rgba(0, 208, 208, 0.7)"
                      },
                      {
                        offset: 0,
                        color: "rgba(104, 253, 255, 0.7)"
                      }
                    ],
                    false
                  )
                }
              }
            },
            {
              name: "热度指数",
              type: "bar",
              //data: [580, 720, 650, 780, 540, 1140, 240, 540],
              data:data.Data.map(item => {
                 return item.value2;
              }),
              barWidth: 10,
              barGap: 0.2,
              label: {
                normal: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "#a8aab0",
                    fontStyle: "normal",
                    fontFamily: "微软雅黑",
                    fontSize: 12
                  }
                }
              },
              itemStyle: {
                normal: {
                  barBorderRadius: [5, 5, 0, 0],
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 1,
                        color: "rgba(127, 128, 225, 0.7)"
                      },
                      {
                        offset: 0.9,
                        color: "rgba(72, 73, 181, 0.7)"
                      },
                      {
                        offset: 0.25,
                        color: "rgba(226, 99, 74, 0.7)"
                      },
                      {
                        offset: 0,
                        color: "rgba(253, 200, 106, 0.7)"
                      }
                    ],
                    false
                  )
                }
              }
            }
          ]
        };
        this.chartInstance=this.$Crender('chart-party-5',this.option)
        this.chartInstance.on("click", e => {
          console.log(e);
          let type = e.name;
          $this.keyModal = type;
          $this.$refs.dialog.query(type)
        });
        this.showLoading = false;
      });
    }
  }
};
</script>