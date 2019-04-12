<template>
  <div class="box">
    <div class="box-header">
      <span class="title pos-left">党员发展情况分析</span>
    </div>
    <div class="box-body">
      <div class="fullsize chart" id="chart-party-4"></div>
      <x-loading :show="showLoading"></x-loading>
      <dl-Communist ref="dialog" :show="showModal" :take="keyModal"></dl-Communist>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import dlCommunist from "@/view/party/dl_Communist";

export default {
  data() {
    return {
      showSetting: false,
      showLoading: false,
      chartData: null,
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
    "dl-Communist": dlCommunist
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
      this.params = {
        startTime:this.startTime + ' 00:00:00',
          endTime:this.endTime + '23:59:59'
      };
      this.showLoading = true;
      axios.get(this.URLHEAD + "GartyMemberCondition",{
        params:this.params
      }).then(res => {
        let data = res.data;
        this.option = {
          legend: {
            top: 20,
            left: 20,
            textStyle: {
              color: "#fff"
            },
            data: ["中共党员", "入党积极分子", "其他"],
            itemWidth: 10,
            itemHeight: 10
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "10%",
            containLabel: true
          },

          tooltip: {
            show: "true",
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },

          xAxis: {
            type: "value",
            axisTick: { show: false },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#fff"
              }
            },
            splitLine: {
              show: true
            }
          },
          yAxis: [
            {
              type: "category",
              axisTick: { show: false },
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#fff"
                }
              },
              data: data.Data.map(item => {
                return item.name;
              })
            }
          ],
          series: [
            {
              name: "中共党员",
              stack: "总量",
              type: "bar",
              itemStyle: {
                normal: {
                  show: true,
                  borderWidth: 0,
                  borderColor: "#333",
                  color: "#36afe0",
                  label: {
                    show: true,
                    textStyle: {
                      color: "#fff"
                    },
                    position: "inside",
                    formatter: function(p) {
                      return p.value > 0 ? p.value : "";
                    }
                  }
                }
              },
              barGap: "0%",
              barCategoryGap: "50%",
              data: data.Data.map(item => {
                return item.members;
              })
            },
            {
              name: "入党积极分子",
              stack: "总量",
              type: "bar",
              itemStyle: {
                normal: {
                  show: true,
                  borderWidth: 0,
                  borderColor: "#333",
                  color: "#67e0e3",
                  label: {
                    show: true,
                    textStyle: {
                      color: "#fff"
                    },
                    position: "inside",
                    formatter: function(p) {
                      return p.value > 0 ? p.value : "";
                    }
                  }
                }
              },
              barGap: "0%",
              barCategoryGap: "50%",
              data: data.Data.map(item => {
                return item.activist;
              })
            },
            {
              name: "其他",
              stack: "总量",
              type: "bar",
              itemStyle: {
                normal: {
                  show: true,
                  borderWidth: 0,
                  borderColor: "#333",
                  color: "#fca54e",
                  label: {
                    show: true,
                    textStyle: {
                      color: "#fff"
                    },
                    position: "inside",
                    formatter: function(p) {
                      return p.value > 0 ? p.value : "";
                    }
                  }
                }
              },
              barGap: "0%",
              barCategoryGap: "50%",
              data: data.Data.map(item => {
                return item.rest; //需要修改
              })
            }
          ]
        };
        this.chartInstance=this.$Crender('chart-party-4',this.option)
        this.chartInstance.on("click", e => {
          console.log(e);
          let type = e.name;
          $this.district = type;
          $this.keyModal=type
          $this.$refs.dialog.query(type)
        });
        this.showLoading = false;
      });
    }
  }
};
</script>