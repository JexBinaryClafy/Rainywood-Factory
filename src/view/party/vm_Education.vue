<template>
  <div class="box" style="margin-bottom:8px;">
    <div class="box-header" title="显示自系统上线以来，截止至今天的数据">
      <span class="title pos-left">{{title}}</span>
    </div>
    <div class="box-body">
      <div class="chart" id="chart-party-1"></div>
      <ul class="towerlist">
        <li class="item">
          <div class="title">热度最高课件类型</div>
          <div class="subtitle num fg-orange">{{coursewareType}}</div>
        </li>
        <li class="item">
          <div class="title">课件最丰富类型</div>
          <div class="subtitle num fg-cyan">{{richType}}</div>
        </li>
        <li class="item">
          <div class="title">累计课件总量（个）</div>
          <div class="subtitle num fg-green">{{count}}</div>
        </li>
      </ul>
      <x-loading :show="showLoading"></x-loading>
      <dl-Education ref="dialog" :show="showModal" :take="keyModal"></dl-Education>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import Pager from "@/components/Pager";
import dlEducation from "@/view/party/dl_Education";

export default {
  data() {
    return {
      showSetting: false,
      showLoading: false,
      coursewareType: "",
      richType: "",
      count: 0,
      chartInstance: null,
      option: null,
      params: null,
      chartData: null,
      chartInstance: null,
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
    "x-pager": Pager,
    "dl-Education": dlEducation
  },
  mounted() {
    this.renderChart()
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
        startTime:this.startTime,
        endTime:this.endTime
      }
      this.showLoading=true
      axios.get(this.URLHEAD + 'GovernmentEducationr',{
        params:params
      }).then(res=>{
          let data = res.data
          this.coursewareType=data.Data.coursewareType
          this.richType=data.Data.richType
          this.count=data.count
          let themeColor = [
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
          this.option = {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            grid: {
              top: 10,
              left: 10,
              right: 10,
              bottom: 10,
              containLabel: true
            },
            legend: {
              itemWidth: 12,
              itemHeight: 12,
              top: "bottom",
              left: "center",
              data: data.Data.list.map(o => {
                return o.name;
              }),
              textStyle: {
                fontSize: 12,
                color: "#fff"
              }
            },
            color: themeColor,
            calculable: true,
            series: [
              {
                name: "课件访问量",
                type: "pie",
                radius: ["45%", "65%"],
                center: ["50%", "47%"],
                roseType: "area",
                data: data.Data.list,
                itemStyle: {
                  normal: {
                    shadowBlur: 23,
                    shadowOffsetX: 0,
                    shadowOffsetY: 2,
                    shadowColor: "rgba(0,0,0,0.2)"
                  }
                },
                label: {
                  normal: {
                    show: true,
                    formatter: "{main|{b}}访问量：\n{num|{c}}{small|次}",
                    position: "right",
                    rich: {
                      main: {
                        fontSize: 12
                      },
                      num: {
                        fontSize: 28
                      },
                      small:{
                        fontSize:12

                      }
                    }
                  }
                },
                labelLine: {
                  length: 5,
                  length2: 15
                }
              }
            ]
          };
          this.chartInstance = this.$Crender('chart-party-1',this.option)          
          this.chartInstance.on("click", e => {
            console.log(e);
            let type = e.name;
            $this.keyModal = type;
            $this.$refs.dialog.query(type)
          });
          this.showLoading = false;
      })
    }
  }
};
</script>