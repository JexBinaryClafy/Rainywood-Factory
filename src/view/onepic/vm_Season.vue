<template>
  <div class="box">
    <div class="box-header" :title="hintText">
      <span class="title pos-left">{{title}}</span>
    </div>
    <div class="box-body">
      <div class="chart fullsize" id="chart-5"></div>
      <x-loading :show="showLoading"></x-loading>
    </div>
    <dl-Season ref="dialog" :show="showModal" :take="keyModal"></dl-Season>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import Pager from "@/components/Pager";
import dlSeason from "@/view/onepic/dl_Season";

export default {
  data() {
    return {
      showSetting: false,
      showLoading: false,
      params: null,
      startTime: "2018-01-01",
      endTime: "2018-12-31",
      chartInstance: null,
      option: null,
      showModal: false,
      keyModal: null,
      autoflip: false,
      ticketfn: null
    };
  },
  props: {
    title: String
  },
  computed: {
    hintText(){
      return `显示数据自${this.startTime}起，截止至${this.endTime}`
    }
  },
  components: {
    "x-loading": Loading,
    "x-pager": Pager,
    "dl-Season": dlSeason
  },
  methods: {
    renderChart() {
      let $this = this;
      let params = {
        HTTEST: "test",
        startTime:this.startTime + ' 00:00:00',
        endTime:this.endTime+' 23:59:59'
      };
      this.showLoading=true
      axios.get(this.URLHEAD+'YZT_XFJJXFX',{
          params:params
      }).then(res=>{
          let data = res.data;
          this.option ={
            tooltip: {
              trigger: "axis",
              axisPointer: {
                lineStyle: {
                  color: "#57617B"
                }
              }
            },
            color: [this.COLORS[1], this.COLORS[5], this.COLORS[9]],
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            legend: {
              orient: "horizontal",
              x: 40,
              textStyle: {
                color: "#fff",
                fontSize: 12
              },
              data: ["火灾扑救", "抢险救援", "社会救助", "其他出动"]
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
                data: data.Data.map(o => {
                  return o.name;
                })
              }
            ],
            yAxis: [
              {
                type: "value",
                name: "灾情数量（起）",
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
                name: "火灾扑救",
                type: "line",
                symbol: "circle",
                symbolSize: 5,
                showSymbol: true,
                stack: "总量",
                lineStyle: {
                  normal: {
                    width: 3
                  }
                },
                label: {
                  normal: {
                    show: true,
                    position: "top"
                  }
                },
                data: data.Data.map(o => {
                  return o.val.hzjy_list;
                })
              },
              {
                name: "抢险救援",
                type: "line",
                symbol: "circle",
                symbolSize: 5,
                showSymbol: true,
                stack: "总量",
                lineStyle: {
                  normal: {
                    width: 3
                  }
                },
                label: {
                  normal: {
                    show: true,
                    position: "top"
                  }
                },
                data: data.Data.map(o => {
                  return o.val.qxpj_list;
                })
              },
              {
                name: "社会救助",
                type: "line",
                symbol: "circle",
                symbolSize: 5,
                showSymbol: true,
                stack: "总量",
                lineStyle: {
                  normal: {
                    width: 3
                  }
                },
                label: {
                  normal: {
                    show: true,
                    position: "top"
                  }
                },
                data: data.Data.map(o => {
                  return o.val.shjz_list;
                })
              },
              {
                name: "其他出动",
                type: "line",
                symbol: "circle",
                symbolSize: 5,
                showSymbol: true,
                stack: "总量",
                lineStyle: {
                  normal: {
                    width: 3
                  }
                },
                label: {
                  normal: {
                    show: true,
                    position: "top"
                  }
                },
                data: data.Data.map(o => {
                  return o.val.qtcd_list;
                })
              }
            ]
          };
          this.chartInstance=this.$Crender('chart-5',this.option)
          this.chartInstance.on("click", e => {
            //console.log(e);
            let date = e.name;
            $this.keyModal=date
            $this.$refs.dialog.query(date)
          });
          this.showLoading = false;
      })
    }
  },
  mounted(){
      this.renderChart()
  }
};
</script>
<style scoped>
</style>
