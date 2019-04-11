<template>
  <div class="box" style="margin-bottom:8px;">
    <div class="box-header" title="显示自系统上线以来，截止至今天的数据">
      <span class="title pos-left">{{title}}</span>
    </div>
    <div class="box-body">
      <div class="chart" id="chart-party-3"></div>
      <ul class="towerlist">
        <li class="item">
          <div class="title">最多申报类型</div>
          <div class="subtitle num fg-orange">{{maxType}}</div>
        </li>
        <li class="item">
          <div class="title">申报最多部位</div>
          <div class="subtitle num fg-orange">{{maxDep}}</div>
        </li>
        <li class="item">
          <div class="title">累计申报总量</div>
          <div class="subtitle num fg-green">{{total}}</div>
        </li>
      </ul>
      <x-loading :show="showLoading"></x-loading>
      <dl-31 ref="dialog" :show="showModal" :take="keyModal"></dl-31>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import dl31 from "@/view/party/dl_31";

export default {
  data() {
    return {
      showLoading: false,
      maxType: "",
      maxDep: "",
      total: 0,
      chartInstance: null,
      chartData: null,
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
    "dl-31": dl31
  },
  mounted() {
      this.renderChart()
  },
  methods: {
    getTotal(arr) {
        let result = 0
        arr.forEach(element => {
            result = result + element.value
        });
        return result
    },
    renderChart() {
      this.showLoading = true;
      let params = {
        startTime:this.startTime,
        endTime:this.endTime
      }
      axios.get(this.URLHEAD + "getSZYD",{
        params:params
      }).then(res => {
        let $this = this;
        let data = res.data;
        this.maxType = data.Data.maxType;
        this.maxDep = data.Data.maxDep;
        this.total=this.getTotal(data.Data.data)
        let colorList = [
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
            formatter: "{b}: {c} ({d}%)"
          },
          grid: {
            top: "1%",
            containLabel: true
          },
          series: [
            {
              type: "pie",
              radius: ["37%", "65%"],
              center:['50%','55%'],
              clockwise: true,
              z: 5,
              itemStyle: {
                normal: {
                  color: function(params) {
                    return colorList[params.dataIndex];
                  },
                  shadowBlur: 20,
                  shadowColor: "rgba(0, 0, 0, 0.3)"
                }
              },
              label: {
                normal: {
                  formatter: "{d|{b}}\n{hr|}\n{d|({d}%)}",
                  rich: {
                    b: {
                      fontSize: 12,
                      color: "#fff",
                      align: "left",
                      padding: 4
                    },
                    hr: {
                      width: "100%",
                      borderWidth: 1,
                      height: 0
                    },
                    d: {
                      fontSize: 12,
                      color: "#fff",
                      align: "left",
                      padding: 1
                    },
                    c: {
                      fontSize: 12,
                      color: "#fff",
                      align: "center"
                    }
                  }
                }
              },
              labelLine: {
                normal: {
                  length: 10,
                  length2: 5,
                  lineStyle: {
                    width: 1
                  }
                }
              },
              data: data.Data.data
            }
          ]
        };
        this.chartInstance=this.$Crender('chart-party-3',this.option)
        this.chartInstance.on('click',e=>{
            let type = e.data.name
            $this.keyModal=type
            $this.$refs.dialog.query(type)
        })
        this.showLoading = false;
      });
    }
  }
};
</script>