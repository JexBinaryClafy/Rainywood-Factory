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
      <div class="chart" id="chart-eff-3"></div>
      <ul class="towerlist">
        <li class="item">
          <div class="title">占比最高层级</div>
          <div class="subtitle num fg-cyan">{{maxName}}<small>%</small></div>
        </li>
        <li class="item">
          <div class="title">最高层级人数</div>
          <div class="subtitle num fg-red">
            {{maxZB}}
          </div>
        </li>
      </ul>
      <div class="chartSetting" v-show="showSetting">
        <div class="form">
          <div class="form-head">
            <div class="title">选择要查看的日期</div>
          </div>
          <div class="form-body">
            <div class="form-item">
              <div class="label">日期</div>
              <div class="field">
                <input type="date" class="datepicker" :max="timeLimit" :min="timeMin" v-model="date">
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
      <dl-Speed ref="dialog" :show="showModal" :take="keyModal"></dl-Speed>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import Pager from "@/components/Pager";
import dlSpeed from "@/view/eff/dl_Speed";

export default {
  data() {
    return {
      date: this.dateShift(0),
      timeLimit: this.dateShift(0),
      timeMin:this.dateShift(-365),
      showSetting: false,
      showLoading: false,
      maxName: "暂无",
      maxZB: 0,
      average: 0,
      chartInstance: null,
      option: null,
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
      return `显示的是${this.date.split('-')[0]}年${this.date.split('-')[1]}月的数据`
    }
  },
  components: {
    "x-loading": Loading,
    "x-pager": Pager,
    "dl-Speed": dlSpeed
  },
  mounted() {
      this.renderChart()
  },
  methods: {
    getAverage(level) {
      let result = null;
      switch (level) {
        case "0-20":
          result = "差";
          break;
        case "20-40":
          result = "较差";
          break;
        case "40-60":
          result = "中等";
          break;
        case "60-80":
          result = "良好";
          break;
        case "80-100":
          result = "优秀";
          break;
        default:
          result = "中等";
          break;
      }
      return result
    },
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
        indexDate:this.date
      };
      this.showLoading=true
      axios.get(this.URLHEAD + "XN_XYSD", { 
          params: params }).then(res => {
        let data = res.data;
        this.maxName = data.Data.maxName;
        this.maxZB = data.Data.maxZB;
        this.average = this.getAverage(this.maxName);
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
          color: [
            "#a552bd",
            "#653c97",
            "#4d3c97",
            "#3c4e97",
            "#405b9a",
            "#44699a",
            "#4b889c",
            "#509f9e",
            "#58bba1",
            "#52cd98",
            "#63e7a5"
          ],
          calculable: true,
          series: [
            {
              name: "及时率",
              type: "pie",
              radius: ["45%", "65%"],
              center: ["50%", "50%"],
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
                  formatter: "{main|{b}}：\n{num|{c}}{sub|%}",
                  position: "right",
                  rich: {
                    main: {
                      fontSize: 12
                    },
                    num: {
                      fontSize: 28
                    },
                    sub:{
                      fontSize:16
                    }
                  }
                }
              },
              labelLine: {
                length: 5,
                length2: 5
              }
            }
          ]
        };
        this.chartInstance=this.$Crender('chart-eff-3',this.option)
        this.chartInstance.on('click',e=>{
            let type=e.data.name
            $this.keyModal=type
            $this.$refs.dialog.query(type)
        })
        this.showLoading=false
      });
    }
  }
};
</script>