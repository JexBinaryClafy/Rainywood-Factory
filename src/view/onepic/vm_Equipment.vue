<template>
  <div class="box">
    <div class="box-header">
      <span class="title pos-left">{{title}}</span>
    </div>
    <div class="box-body">
      <div class="chart" id="chart-6"></div>
      <ul class="towerlist">
        <li class="item">
          <div class="title">易损易耗装备</div>
          <div
            class="subtitle fg-red"
            :title="weakEquipmentType"
            style="font-size:18px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;"
          >{{weakEquipmentType}}</div>
        </li>
        <li class="item">
          <div class="title">报修报损数量（件）</div>
          <div class="subtitle num fg-orange">{{damagedRateIncrease}}<small></small></div>
        </li>
        <li class="item">
          <div class="title">高耐用性装备</div>
          <div class="subtitle fg-green" style="font-size:18px;">{{strongEquipmentType}}</div>
        </li>
      </ul>
      <x-loading :show="showLoading"></x-loading>
      <dl-Equipment ref="dialog" :show="showModal" :take="keyModal"></dl-Equipment>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import Pager from "@/components/Pager";
import dlEquipment from "@/view/onepic/dl_Equipment";

export default {
  data() {
    return {
      showSetting: false,
      showLoading: false,
      weakEquipmentType: "暂无",
      damagedRateIncrease: 0,
      strongEquipmentType: "暂无",
      startTime: this.oneMonthAgo(),
      endTime: this.today(),
      timeLimit: this.today(),
      chartInstance: null,
      option: null,
      params: null,
      limit: null,
      showModal: false,
      keyModal: null,
      pageindex: 0,
      pageSize: 10,
      autoflip: false,
      appTicket: null
    };
  },
  props: {
    title: String
  },
  components: {
    "x-loading": Loading,
    "x-pager": Pager,
    "dl-Equipment": dlEquipment
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
    pagedRender() {
      let $this = this;
      if (this.pageindex > $this.limit-1) {
        this.pageindex = 0;
      }
      let params = {
        startTime: this.startTime,
        endTime: this.endTime,
        pageindex: this.pageindex,
        pageSize: this.pageSize,
        HTTEST: "test"
      };
      axios.get(this.URLHEAD+'YZT_XFZBJCJ',{
          params:params
      }).then(res=>{
          let data = res.data
          this.weakEquipmentType = data.Data.ysyhzb;
          this.damagedRateIncrease = data.Data.count;
          this.strongEquipmentType = data.Data.gnyxzb;
          let data2 = data.Data.list.map(o => {
            return o.eqSend + o.eqDamage;
          });
          let xData = data.Data.list.map(o => {
            return o.eqClassify;
          });
          this.option = {
            tooltip: {
              show: "true",
              trigger: "item",
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: [8, 10],
              extraCssText: "box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);",
              formatter: function(params) {
                if (params.seriesName != "") {
                  return params.name + "报损报修数 ： " + params.value;
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
                  color: "rgba(255,255,255,0.3)",
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
                formatter: "{value}件"
              }
            },
            series: [
              {
                name: "报损报修",
                type: "bar",
                itemStyle: {
                  normal: {
                    show: true,
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
                data: data2
              }
            ]
          };
          this.pageindex++;
          this.limit = Math.ceil(data.count / this.pageSize);
          this.chartInstance.setOption(this.option);  
      })
    },
    renderChart() {
      let $this = this;
      let params = {
        startTime: this.startTime+' 00:00:00',
        endTime: this.endTime+' 23:59:59',
        pageindex:this.page,
        pageSize:this.pageSize,
        HTTEST: "test"
      };
      axios.get(this.URLHEAD+'YZT_XFZBJCJ',{
          params:params
      }).then(res=>{
          let data = res.data
          this.weakEquipmentType = data.Data.ysyhzb;
          this.damagedRateIncrease = data.Data.count;
          this.strongEquipmentType = data.Data.gnyxzb;
          let data2 = data.Data.list.map(o => {
            return o.eqSend + o.eqDamage;
          });
          let xData = data.Data.list.map(o => {
            return o.eqClassify;
          });
          this.option = {
            tooltip: {
              show: "true",
              trigger: "item",
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: [8, 10],
              extraCssText: "box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);",
              formatter(params) {
                if (params.seriesName != "") {
                  return params.name + "报损报修数 ： " + params.value;
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
                  color: "rgba(255,255,255,0.3)",
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
                formatter: "{value}件"
              }
            },
            series: [
              {
                name: "报损报修",
                type: "bar",
                itemStyle: {
                  normal: {
                    show: true,
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
                    position: "inside",
                    formatter:'报损报修:{c}件'
                  }
                },
                zlevel: 2,
                barWidth: "15",
                data: data2
              }
            ]
          };
          this.chartInstance = this.$Crender('chart-6',this.option)
          this.chartInstance.on("click", e => {
            //console.log(e);
            let equipmentType = e.name;
            $this.keyModal=equipmentType;
            $this.$refs.dialog.query(equipmentType)
          });
          this.showLoading = false;
          this.autoPage();  
      })
    },
    autoPage() {
      // this.pagedRender();
      if (this.appTicket) {
        clearInterval(this.appTicket);
      }
      this.appTicket = setInterval(() => {
        this.pagedRender();
      }, 3000);
    }
  },
  beforeDestroy(){
    clearInterval(this.appTicket);
  }
};
</script>