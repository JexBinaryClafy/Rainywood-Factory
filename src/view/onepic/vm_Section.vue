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
      <div class="chart" id="chart-1"></div>
      <ul class="towerlist" v-cloak>
        <li class="item">
          <div class="title">高灾情地区</div>
          <div class="subtitle fg-red">{{highDisasterDistrict}}</div>
        </li>
        <li class="item">
          <div class="title">环比上月增长</div>
          <div class="subtitle num fg-green">
            {{momIncrease}}
            <small>%</small>
          </div>
        </li>
        <li class="item">
          <div class="title">上升明显区域</div>
          <div class="subtitle fg-orange">{{highDisasterType}}</div>
        </li>
      </ul>
      <div class="chartSetting" v-show="showSetting">
        <div class="form">
          <div class="form-head">
            <div class="title">选择查询时间</div>
          </div>
          <div class="form-body">
            <div class="form-item">
              <div class="label">开始时间</div>
              <div class="field">
                <input
                  type="date"
                  class="datepicker"
                  v-model="startTime"
                  :max="timeLimit"
                  :min="timeMin"
                >
              </div>
            </div>
            <div class="form-item">
              <div class="label">结束时间</div>
              <div class="field">
                <input
                  type="date"
                  class="datepicker"
                  v-model="endTime"
                  :max="timeLimit"
                  :min="timeMin"
                >
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
      <dl-District ref="dialog" :show="showModal" :take="keyModal" :date="dateData"></dl-District>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import Pager from "@/components/Pager";
import dlDistrict from "@/view/onepic/dl_District";

export default {
  data() {
    return {
      startTime: this.oneMonthAgo(),
      endTime: this.today(),
      dateData: {
        startTime: this.oneMonthAgo(),
        endTime: this.today()
      },
      showSetting: false,
      showLoading: false,
      highDisasterDistrict: "",
      highDisasterType: "",
      momIncrease: 0,
      rangeMax: 300, //注意，后面要从接口取
      chartInstance: null,
      option: null,
      params: null,
      showModal: false,
      keyModal: null,
      chartData: null,
      autoflip: false,
      ticketfn: null,
      timeLimit: this.today(),
      timeMin: this.dateShift(-365)
    };
  },
  props: {
    title: String
  },
  components: {
    "x-loading": Loading,
    "x-pager": Pager,
    "dl-District": dlDistrict
  },
  computed: {
    hintText() {
      return `显示数据自${this.startTime}起，截止至${this.endTime}`;
    }
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    showSettingWindow() {
      this.showSetting = true; //打开进度等待动画
    },
    cancelSetting() {
      this.showSetting = false; //关闭进度等待动画
    },
    saveSetting() {
      //加载数据
      this.renderChart();
      this.showSetting = false;
    },
    closeModal() {
      this.showModal = false;
    },
    renderChart() {
      this.params = {
        //请求参数
        startTime: this.startTime + " 00:00:00",
        endTime: this.endTime + " 23:59:59"
      };
      this.showLoading = true;
      axios
        .get(this.URLHEAD + "YZT_ZQXYFX", {
          params: this.params
        })
        .then(res => {
          let data = res.data;
          this.highDisasterDistrict = data.Data.Name;
          this.highDisasterType = data.Data.Value;
          this.momIncrease = data.Data.Tag;
          this.chartData = [
            data.Data.list.map(item => {
              return item.value;
            })
          ];
          this.option = {
            color: ["rgba(245, 166, 35, 1)", "rgba(19, 173, 255, 1)"],
            tooltip: {
              show: true,
              trigger: "none"
            },
            grid: {
              containLabel: true,
              top: 20
            },
            radar: {
              center: ["50%", "50%"],
              radius: "75%",
              startAngle: 90,
              splitNumber: 4,
              splitArea: {
                areaStyle: {
                  color: ["transparent"]
                }
              },
              axisLabel: {
                show: false,
                fontSize: 12,
                color: "#fff",
                fontStyle: "normal",
                fontWeight: "normal"
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#fff",
                  opacity: 0.4
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#fff",
                  opacity: 0.3
                }
              },
              indicator: data.Data.list.map(item => {
                return { name: item.name, max: data.Data.MaxCount * 1.2 };
              }),
              triggerEvent: true
            },
            series: [
              {
                name: "灾情数量",
                type: "radar",
                symbol: "circle",
                symbolSize: 7,
                areaStyle: {
                  normal: {
                    color: "rgba(245, 166, 35, 0.4)"
                  }
                },
                itemStyle: {
                  color: "rgba(245, 166, 35, 1)",
                  borderColor: "rgba(245, 166, 35, 0.3)",
                  borderWidth: 10,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  shadowColor: "rgba(0,0,0,0.2)",
                  shadowBlur: 10
                },
                lineStyle: {
                  normal: {
                    type: "dashed",
                    color: "rgba(245, 166, 35, 1)",
                    width: 1
                  }
                },
                data: this.chartData,
                label: {
                  normal: {
                    show: true,
                    position: "outside",
                    formatter: "{c}起"
                  }
                }
              }
            ]
          };
          this.chartInstance = this.$Crender("chart-1", this.option);
          let vm = this;
          this.chartInstance.on("click", e => {
            console.log(e);
            let districtName = e.name;
            if (districtName !== "") {
              vm.keyModal = districtName;
              vm.date = {
                startTime:this.startTime,
                endTime:this.endTime
              }
              vm.$refs.dialog.query(districtName);
            }
          });
          this.showLoading = false;
          if (this.autoflip) {
            this.autoRefresh();
          }
        });
    },
    autoRefresh() {
      if (this.ticketfn) {
        clearInterval(this.ticketfn);
      } else {
        this.ticketfn = setInterval(() => {
          this.showLoading = true;
          axios
            .get(this.URLHEAD + "YZT_ZQXYFX", {
              params: this.params
            })
            .then(res => {
              let data = res.data;
              this.chartData = [
                data.Data.list.map(item => {
                  return item.value;
                })
              ];
              this.chartInstance.setOption(this.option);
              this.showLoading = false;
            });
        }, 3500);
      }
    }
  }
};
</script>
<style scoped>
</style>


